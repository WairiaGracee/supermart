// src/components/common/Navbar.tsx

import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-blue-100">Welcome, {user?.name}!</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}