import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { User, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { login: iiLogin, loginStatus } = useInternetIdentity();
  const { actor } = useActor();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isLoggingIn = loginStatus === 'logging-in';

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { toast.error('Please enter a username'); return; }
    setIsCreating(true);
    try {
      await iiLogin();
      if (actor) {
        await actor.saveCallerUserProfile({
          username: username.trim(),
          email: email.trim(),
          phone: '',
          createdAt: BigInt(Date.now()),
        });
      }
      toast.success('Account created successfully!');
      navigate({ to: '/', search: { category: undefined } });
    } catch (err: any) {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-5 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/assets/generated/auth-bg-pattern.dim_800x600.png')" }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <img
              src="/assets/generated/logo.dim_320x80.png"
              alt="GenMitra"
              className="h-10 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-2xl font-bold text-foreground">GenMitra</span>
          </div>
          <p className="text-muted-foreground text-sm">Create your personalized gift account</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-card-lg border border-border p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground mb-1">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join GenMitra and start creating memories</p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email (optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              You'll be redirected to Internet Identity to securely verify your account. This is a one-time setup.
            </p>

            <button
              type="submit"
              disabled={isCreating || isLoggingIn}
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-[var(--primary)]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm mt-2"
            >
              {isCreating || isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <button
              onClick={() => navigate({ to: '/login', search: { mode: undefined, redirect: undefined } })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
