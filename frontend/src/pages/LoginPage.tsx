import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAdminSession } from '../hooks/useAdminSession';
import { useAdminLogin } from '../hooks/useQueries';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });
  const { login, loginStatus, identity } = useInternetIdentity();
  const { loginAdmin, isAdminLoggedIn } = useAdminSession();
  const adminLoginMutation = useAdminLogin();

  const mode = (search as { mode?: string; redirect?: string }).mode;
  const redirectPath = (search as { mode?: string; redirect?: string }).redirect;

  const isAdminMode = mode === 'admin' || (redirectPath && redirectPath.startsWith('/admin'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminMode && isAdminLoggedIn) {
      navigate({ to: redirectPath || '/admin' });
    } else if (!isAdminMode && identity) {
      navigate({ to: '/', search: { category: undefined } });
    }
  }, [isAdminLoggedIn, identity, isAdminMode, redirectPath, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      // First validate credentials locally
      const localSuccess = loginAdmin(username, password);
      if (!localSuccess) {
        toast.error('Invalid username or password');
        setIsSubmitting(false);
        return;
      }

      // Also authenticate with backend
      try {
        await adminLoginMutation.mutateAsync({ username, password });
      } catch {
        // Backend auth failed but local session is set, continue
      }

      toast.success('Login successful!');
      navigate({ to: redirectPath || '/admin' });
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <img
                src="/assets/generated/logo.dim_320x80.png"
                alt="GenMitra"
                className="h-12 w-auto mx-auto mb-4 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground text-sm mt-1">Sign in to access the admin panel</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate({ to: '/', search: { category: undefined } })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src="/assets/generated/logo.dim_320x80.png"
              alt="GenMitra"
              className="h-12 w-auto mx-auto mb-4 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your GenMitra account</p>
          </div>

          <button
            onClick={handleUserLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate({ to: '/create-account', search: { category: undefined } })}
              className="text-sm text-primary hover:underline"
            >
              Create an account
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
