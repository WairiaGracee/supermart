// src/components/auth/RegisterForm.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { branchService } from '../../services/branchService';
import type { Branch } from '../../types';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
    branch: '',
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await branchService.getBranches();
        setBranches(data);
      } catch (err) {
        console.error('Failed to load branches:', err);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.role === 'customer' && !formData.branch) {
      setError('Please select a branch');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.role,
        formData.role === 'customer' ? formData.branch : undefined
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200";
  const selectClass = "w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-purple-500 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Phone (M-Pesa)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="254712345678"
            required
          />
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'customer' })}
            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              formData.role === 'customer'
                ? 'bg-purple-600/30 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'admin' })}
            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              formData.role === 'admin'
                ? 'bg-purple-600/30 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </button>
        </div>
      </div>

      {/* Branch (for customers) */}
      {formData.role === 'customer' && (
        <div className="space-y-1 animate-fadeIn">
          <label className="block text-sm font-medium text-gray-300">Preferred Branch</label>
          {loadingBranches ? (
            <div className="flex items-center justify-center py-3">
              <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={selectClass}
              required
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name} - {branch.location}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Passwords */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Confirm</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-gray-400 text-sm pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
