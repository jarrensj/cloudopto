import Link from "next/link";

const folders = [
  { id: 'folder1', name: 'Folder 1', price: '$0.10' },
  { id: 'folder2', name: 'Folder 2', price: '$0.10' },
  { id: 'folder3', name: 'Folder 3', price: '$0.10' },
  { id: 'folder4', name: 'Folder 4', price: '$0.10' },
  { id: 'folder5', name: 'Folder 5', price: '$0.10' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Premium Content Library
          </h1>
          <p className="text-lg text-gray-600">
            Select a folder to unlock exclusive content
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/content/${folder.id}`}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-900 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {folder.price}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {folder.name}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                Click to unlock
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
