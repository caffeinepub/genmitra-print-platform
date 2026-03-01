import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAdminSession } from '../../hooks/useAdminSession';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdminLoggedIn, isLoading } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && !isAdminLoggedIn) {
      navigate({
        to: '/login',
        search: {
          mode: 'admin',
          redirect: location.pathname,
        },
      });
    }
  }, [isLoading, isAdminLoggedIn, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
