import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAdminSession } from '../hooks/useAdminSession';
import { Printer, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });
  const mode = (search as { mode?: string; redirect?: string }).mode;
  const redirectPath = (search as { mode?: string; redirect?: string }).redirect;

  const isAdminMode = mode === 'admin';

  const { login: iiLogin, loginStatus, identity } = useInternetIdentity();
  const { loginAdmin, isAuthenticated: isAdminAuthenticated } = useAdminSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminMode && isAdminAuthenticated) {
      const target = redirectPath ? decodeURIComponent(redirectPath) : '/admin';
      navigate({ to: target as '/admin' });
    }
  }, [isAdminMode, isAdminAuthenticated, redirectPath, navigate]);

  useEffect(() => {
    if (!isAdminMode && identity) {
      navigate({ to: '/', search: { category: undefined } });
    }
  }, [isAdminMode, identity, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = loginAdmin(username.trim(), password);
      if (success) {
        const target = redirectPath ? decodeURIComponent(redirectPath) : '/admin';
        navigate({ to: target as '/admin' });
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIILogin = async () => {
    try {
      await iiLogin();
    } catch (err: unknown) {
      console.error('Login error:', err);
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GenMitra</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Login</h1>
            <p className="text-gray-500 text-center mb-8">Sign in to access the admin panel</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !username || !password}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate({ to: '/', search: { category: undefined } })}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ← Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular user login (Internet Identity)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GenMitra</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-8">Sign in to your account to continue</p>

          <button
            onClick={handleIILogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In with Internet Identity'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate({ to: '/create-account', search: { category: undefined } })}
                className="text-primary font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate({ to: '/forgot-password', search: { category: undefined } })}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
