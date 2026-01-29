// src/pages/NotFoundPage.tsx

import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-blue-100 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}