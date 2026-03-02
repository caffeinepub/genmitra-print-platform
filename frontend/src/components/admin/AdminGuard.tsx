import React, { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAdminSession } from '../../hooks/useAdminSession';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectPath = encodeURIComponent(location.pathname);
      navigate({
        to: '/login',
        search: { mode: 'admin', redirect: redirectPath },
      });
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
