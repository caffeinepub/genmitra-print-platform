import { useState, useEffect } from 'react';

interface AdminSession {
  username: string;
  role: string;
  loggedInAt: number;
}

const SESSION_KEY = 'admin_session';

const ADMIN_CREDENTIALS: Record<string, string> = {
  genmitra: '12345678',
  admin: 'Admin@1234',
};

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminSession;
        setSession(parsed);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = (username: string, password: string): boolean => {
    const expectedPassword = ADMIN_CREDENTIALS[username];
    if (!expectedPassword || expectedPassword !== password) {
      return false;
    }
    const newSession: AdminSession = {
      username,
      role: 'admin',
      loggedInAt: Date.now(),
    };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setSession(null);
  };

  const isAdminLoggedIn = session !== null;

  return {
    session,
    isLoading,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
  };
}
