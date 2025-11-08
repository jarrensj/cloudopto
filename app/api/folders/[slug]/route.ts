import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch folder by slug
    const { data: folder, error: folderError } = await supabase
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
    const { data: images, error: imagesError } = await supabase
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

    // Get public URLs for images
    const imagesWithUrls = images.map((image) => {
      const { data } = supabase.storage
        .from('folder-images')
        .getPublicUrl(image.file_path);
      
      return {
        ...image,
        url: data.publicUrl,
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

