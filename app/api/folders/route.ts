import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const folderName = formData.get('folderName') as string;
    const slug = formData.get('slug') as string;
    const walletAddress = formData.get('walletAddress') as string;
    const solAmount = formData.get('solAmount') as string;
    const images = formData.getAll('images') as File[];

    if (!folderName || !slug || !walletAddress || !solAmount || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create folder entry in database
    const { data: folder, error: folderError } = await supabase
      .from('folders')
      .insert({
        name: folderName,
        slug: slug,
        wallet_address: walletAddress,
        sol_amount: parseFloat(solAmount),
        image_count: images.length,
      })
      .select()
      .single();

    if (folderError) {
      console.error('Error creating folder:', folderError);
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      );
    }

    // Upload images to AWS S3 and create image records
    const uploadedImages = [];
    
    for (const image of images) {
      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${folder.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Convert File to Buffer for S3 upload
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const s3Url = await uploadToS3(buffer, fileName, image.type);

        // Create image record in database with S3 URL
        const { data: imageData, error: imageError } = await supabase
          .from('images')
          .insert({
            folder_id: folder.id,
            file_name: image.name,
            file_path: s3Url, // Store the full S3 URL
            file_size: image.size,
            mime_type: image.type,
          })
          .select()
          .single();

        if (!imageError && imageData) {
          uploadedImages.push(imageData);
        }
      } catch (uploadError) {
        console.error('Error uploading image to S3:', uploadError);
        // Continue with other images even if one fails
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      folder: folder,
      uploadedImages: uploadedImages.length,
    });
  } catch (error) {
    console.error('Error in folder creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: folders, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching folders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Error in fetching folders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

