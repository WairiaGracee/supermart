// src/components/common/Sidebar.tsx

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const customerLinks = [
    { label: 'Shop', href: '/dashboard' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Cart', href: '/cart' },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Reports', href: '/admin/reports' },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-blue-800 text-white shadow-lg transform transition-transform duration-300 z-50 md:relative md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">SuperMart</h2>

          <nav className="space-y-4 mb-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-blue-700 pt-4">
            <p className="text-sm text-blue-200 mb-4">
              Logged in as: <strong>{user?.name}</strong>
            </p>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}