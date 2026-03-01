import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../../hooks/useAdminSession';
import { useActor } from '../../hooks/useActor';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { isAdminLoggedIn, getStoredCredentials, logoutAdmin } = useAdminSession();
  const { actor, isFetching } = useActor();
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const hasReauthed = useRef(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate({ to: '/login', search: { mode: 'admin', redirect: undefined } });
      return;
    }

    // Actor not ready yet, wait
    if (isFetching || !actor) {
      return;
    }

    // Already re-authenticated in this session
    if (hasReauthed.current) {
      setIsReady(true);
      return;
    }

    // Re-authenticate with backend to restore admin role after page refresh
    const credentials = getStoredCredentials();
    if (!credentials) {
      // No credentials stored, can't re-auth — log out
      logoutAdmin();
      navigate({ to: '/login', search: { mode: 'admin', redirect: undefined } });
      return;
    }

    setIsReauthenticating(true);
    actor.login(credentials.username, credentials.password)
      .then(() => {
        hasReauthed.current = true;
        setIsReady(true);
      })
      .catch(() => {
        // Re-auth failed, clear session
        logoutAdmin();
        navigate({ to: '/login', search: { mode: 'admin', redirect: undefined } });
      })
      .finally(() => {
        setIsReauthenticating(false);
      });
  }, [isAdminLoggedIn, actor, isFetching]);

  if (!isAdminLoggedIn) {
    return null;
  }

  if (isFetching || isReauthenticating || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
