// src/pages/LoginPage.tsx

import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SuperMart</h1>
          <p className="text-gray-600 mt-2">Welcome Back</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}