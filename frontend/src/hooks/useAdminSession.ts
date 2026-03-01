import { useState, useEffect } from 'react';

const SESSION_KEY = 'admin_session';
const CREDENTIALS_KEY = 'admin_credentials';

interface AdminCredentials {
  username: string;
  password: string;
}

export function useAdminSession() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsAdminLoggedIn(sessionStorage.getItem(SESSION_KEY) === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loginAdmin = (username: string, password: string) => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username, password }));
    setIsAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(CREDENTIALS_KEY);
    setIsAdminLoggedIn(false);
  };

  const getStoredCredentials = (): AdminCredentials | null => {
    const raw = sessionStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminCredentials;
    } catch {
      return null;
    }
  };

  return { isAdminLoggedIn, loginAdmin, logoutAdmin, getStoredCredentials };
}
