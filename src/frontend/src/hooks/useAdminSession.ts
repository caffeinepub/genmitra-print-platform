import { useState } from "react";

interface AdminSession {
  username: string;
  password: string;
  role: string;
  loggedInAt: number;
}

const SESSION_KEY = "admin_session";

const ADMIN_ACCOUNTS: Record<string, string> = {
  genmitra: "12345678",
  admin: "Admin@1234",
};

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as AdminSession) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = session !== null;

  const loginAdmin = (username: string, password: string): boolean => {
    const expectedPassword = ADMIN_ACCOUNTS[username];
    if (!expectedPassword || expectedPassword !== password) {
      return false;
    }
    const newSession: AdminSession = {
      username,
      password,
      role: "admin",
      loggedInAt: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return {
    session,
    isAuthenticated,
    loginAdmin,
    logout,
  };
}
