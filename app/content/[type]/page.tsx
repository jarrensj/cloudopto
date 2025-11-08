'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Folder {
  id: string;
  name: string;
  slug: string;
  wallet_address: string;
  sol_amount: number;
  image_count: number;
  created_at: string;
}

interface Image {
  id: string;
  folder_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
  created_at: string;
}

export default function ContentPage() {
  const params = useParams();
  const slug = params.type as string;
  
  const [folder, setFolder] = useState<Folder | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFolderData() {
      try {
        const response = await fetch(`/api/folders/${slug}`);
        const data = await response.json();

        if (response.ok) {
          setFolder(data.folder);
          setImages(data.images);
        } else {
          setError(data.error || 'Failed to fetch folder');
        }
      } catch (err) {
        console.error('Error fetching folder:', err);
        setError('Failed to load folder');
      } finally {
        setLoading(false);
      }
    }

    fetchFolderData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading folder...</p>
        </div>
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Folder Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This folder does not exist.'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{folder.name}</h1>
                <p className="text-gray-600">
                  {folder.image_count} image{folder.image_count !== 1 ? 's' : ''} in this folder
                </p>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Payment Required</div>
                <div className="text-2xl font-bold text-green-900">{folder.sol_amount} SOL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate">{image.file_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(image.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No images in this folder yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
