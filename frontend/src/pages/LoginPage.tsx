import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isAuthenticated, isAdmin, adminLoading, profileLoading } = useAuth();
  const [_showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !adminLoading && !profileLoading) {
      if (isAdmin) {
        navigate({ to: '/admin' });
      } else {
        navigate({ to: '/', search: { category: undefined } });
      }
    }
  }, [isAuthenticated, isAdmin, adminLoading, profileLoading, navigate]);

  const handleLogin = () => {
    try {
      login();
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-purple">
            <Printer className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display">PrintCraft Studio</h1>
          <p className="text-muted-foreground mt-2">Premium Personalized Printing</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card-hover p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Sign in with Internet Identity to continue
          </p>

          <div className="space-y-4">
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-12 text-base font-semibold shadow-purple"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Connecting...
                </span>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              New to PrintCraft?{' '}
              <button
                onClick={() => navigate({ to: '/create-account' })}
                className="text-primary font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate({ to: '/forgot-password' })}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-card/50 rounded-2xl p-4 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Secured by Internet Identity — your privacy is protected
          </p>
        </div>
      </div>
    </div>
  );
}
