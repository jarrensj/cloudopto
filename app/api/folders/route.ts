import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Upload images to Supabase Storage and create image records
    const uploadedImages = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${folder.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Convert File to ArrayBuffer then to Uint8Array
      const arrayBuffer = await image.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('folder-images')
        .upload(fileName, uint8Array, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue with other images even if one fails
        continue;
      }

      // Create image record in database
      const { data: imageData, error: imageError } = await supabase
        .from('images')
        .insert({
          folder_id: folder.id,
          file_name: image.name,
          file_path: fileName,
          file_size: image.size,
          mime_type: image.type,
        })
        .select()
        .single();

      if (!imageError && imageData) {
        uploadedImages.push(imageData);
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

