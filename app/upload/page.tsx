'use client';

import Link from "next/link";
import { useState } from "react";

export default function UploadPage() {
  const [folderName, setFolderName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      folderName,
      walletAddress,
      solAmount,
      images: images.map(img => img.name)
    });
    alert('Upload submitted! (This is not yet connected)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          {/* Folder Name */}
          <div>
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-900 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none placeholder:text-gray-500 text-gray-900"
              placeholder="Enter folder name"
              required
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-900 mb-2">
              Wallet Address
              <span className="text-gray-500 text-xs ml-2">(Where you'll receive payments)</span>
            </label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none font-mono text-sm placeholder:text-gray-500 text-gray-900"
              placeholder="Enter Solana wallet address"
              required
            />
          </div>

          {/* SOL Amount */}
          <div>
            <label htmlFor="solAmount" className="block text-sm font-medium text-gray-900 mb-2">
              SOL Amount
              <span className="text-gray-500 text-xs ml-2">(Price to access this folder)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="solAmount"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none placeholder:text-gray-500 text-gray-900"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">SOL</span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-900 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="images"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                multiple
                required
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center"
              >
                <span className="text-sm text-gray-600 mb-1">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </span>
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {images.length} file{images.length !== 1 ? 's' : ''} selected:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {images.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Create Folder & Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

