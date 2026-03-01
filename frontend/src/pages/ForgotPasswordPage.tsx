import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Printer, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setSubmitted(true);
    toast.success('If an account exists, a reset link has been sent.');
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
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card-hover p-8 border border-border">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm mb-6">
                If an account exists for <strong>{email}</strong>, we've sent a password reset link.
              </p>
              <Button
                className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
                onClick={() => navigate({ to: '/login' })}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Enter your email address and we'll send you a reset link.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
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
                  onClick={handleSubmit}
                >
                  Send Reset Link
                </Button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate({ to: '/login' })}
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-1 w-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
