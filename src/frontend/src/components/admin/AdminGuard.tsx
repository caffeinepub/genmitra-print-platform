import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useAdminSession } from "../../hooks/useAdminSession";

export default function AdminGuard() {
  const { isAuthenticated } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: "/login",
        search: { mode: "admin", redirect: window.location.pathname },
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <Outlet />;
}
