import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch folder by slug
    const { data: folder, error: folderError } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('slug', slug)
      .single();

    if (folderError || !folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Fetch images for this folder
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('folder_id', folder.id)
      .order('created_at', { ascending: true });

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    // Images already have S3 URLs in the file_path field
    const imagesWithUrls = images.map((image) => {
      return {
        ...image,
        url: image.file_path, // file_path now contains the full S3 URL
      };
    });

    return NextResponse.json({
      folder,
      images: imagesWithUrls,
    });
  } catch (error) {
    console.error('Error fetching folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

