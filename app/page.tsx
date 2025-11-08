'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Folder {
  id: string;
  name: string;
  slug: string;
  wallet_address: string;
  usdc_amount: number;
  image_count: number;
  created_at: string;
}

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFolders() {
      try {
        const response = await fetch('/api/folders');
        const data = await response.json();
        
        if (response.ok) {
          setFolders(data.folders || []);
        } else {
          setError(data.error || 'Failed to fetch folders');
        }
      } catch (err) {
        console.error('Error fetching folders:', err);
        setError('Failed to load folders');
      } finally {
        setLoading(false);
      }
    }

    fetchFolders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Upload
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Photo Content Library
          </h1>
          <p className="text-lg text-gray-600">
            Select a folder to unlock the photos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading folders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No folders yet. Create your first folder!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/content/${folder.slug}`}
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-900 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {folder.usdc_amount} USDC
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {folder.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  {folder.image_count} image{folder.image_count !== 1 ? 's' : ''} • Click to unlock
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
