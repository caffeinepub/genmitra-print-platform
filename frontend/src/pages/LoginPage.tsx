import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAdminSession } from '../hooks/useAdminSession';
import { LogIn, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus } = useInternetIdentity();
  const { loginAdmin } = useAdminSession();

  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleUserLogin = async () => {
    try {
      await login();
      navigate({ to: '/', search: { category: undefined, search: undefined } });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsAdminLoading(true);
    try {
      const success = await loginAdmin(username, password);
      if (success) {
        window.location.href = '/admin';
      } else {
        setAdminError('Invalid username or password');
      }
    } catch {
      setAdminError('Login failed. Please try again.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f6f7' }}>
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to GenMitra</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 mb-6 shadow-card">
          <button
            onClick={() => setMode('user')}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
              mode === 'user'
                ? 'bg-[#2874f0] text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
              mode === 'admin'
                ? 'bg-[#2874f0] text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Admin Login
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
          {mode === 'user' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-[#2874f0]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Login with Internet Identity</h2>
              <p className="text-gray-500 text-sm mb-6">
                Secure, passwordless authentication powered by Internet Computer.
              </p>
              <button
                onClick={handleUserLogin}
                disabled={loginStatus === 'logging-in'}
                className="w-full py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login with Internet Identity'
                )}
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate({ to: '/create-account' })}
                  className="text-[#2874f0] hover:underline font-medium"
                >
                  Create one
                </button>
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#2874f0]" />
                <h2 className="text-lg font-semibold text-gray-800">Admin Login</h2>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-[#2874f0]"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-[#2874f0]"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {adminError && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                    {adminError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full py-3 bg-[#2874f0] text-white font-semibold rounded hover:bg-[#1f5bb8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login as Admin'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
            className="text-sm text-gray-500 hover:text-[#2874f0] transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
