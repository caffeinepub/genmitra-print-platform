import { useState, useEffect } from 'react';

interface AdminSession {
  username: string;
  role: string;
  loggedInAt: number;
}

const SESSION_KEY = 'admin_session';

const VALID_CREDENTIALS = [
  { username: 'genmitra', password: '12345678', role: 'admin' },
  { username: 'admin', password: 'Admin@1234', role: 'admin' },
];

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
    const match = VALID_CREDENTIALS.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (match) {
      const newSession: AdminSession = {
        username: match.username,
        role: match.role,
        loggedInAt: Date.now(),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const isAuthenticated = session !== null;

  return {
    session,
    isAuthenticated,
    isLoading,
    loginAdmin,
    logoutAdmin,
  };
}
