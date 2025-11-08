'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ContentPage() {
  const params = useParams();
  const slug = params.type as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <main className="w-full max-w-lg">
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-10">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
              Content Unlocked!
            </h1>
            
            <p className="text-gray-600 text-center text-lg mb-6">
              You now have access to: <strong>{slug}</strong>
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
              <div className="text-sm text-gray-500 mb-1">Payment Confirmed</div>
              <div className="text-2xl font-bold text-gray-900">✓ Access Granted</div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
            <div className="text-center text-sm text-gray-500">
              Payment successful • Folder: {slug}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
