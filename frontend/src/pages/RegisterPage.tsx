// src/pages/RegisterPage.tsx

import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">Supermarket</h1>
          <p className="text-blue-100">Management System</p>
        </div>
        <div className="p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}