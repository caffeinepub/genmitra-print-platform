import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    try {
      login();
      navigate({ to: '/', search: { category: undefined } });
    } catch {
      toast.error('Failed to create account. Please try again.');
    }
  };

  const handleBack = () => {
    navigate({ to: '/', search: { category: undefined } });
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
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card-hover p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">Get Started</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Create your PrintCraft account with Internet Identity
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your display name"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 rounded-xl"
              />
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-12 text-base font-semibold shadow-purple"
              onClick={handleCreate}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate({ to: '/login', search: { mode: undefined, redirect: undefined } })}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary w-full transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
