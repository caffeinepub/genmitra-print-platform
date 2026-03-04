import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldCheck, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminSession } from "../hooks/useAdminSession";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { loginAdmin } = useAdminSession();

  // Determine mode from URL manually
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") ?? "customer";
  const redirect = params.get("redirect") ?? "/";

  const [isAdminMode, setIsAdminMode] = useState(mode === "admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const isLoggingIn = loginStatus === "logging-in";

  const handleCustomerLogin = async () => {
    try {
      await login();
      navigate({ to: "/", search: { category: undefined, search: undefined } });
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setIsAdminLoading(true);
    try {
      const success = loginAdmin(username, password);
      if (success) {
        window.location.href = redirect.startsWith("/admin")
          ? redirect
          : "/admin";
      } else {
        setAdminError("Invalid username or password");
      }
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/generated/logo.dim_320x80.png"
            alt="GenMitra"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdminMode ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdminMode
              ? "Sign in to the admin panel"
              : "Sign in to your account"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-gray-200 p-1 mb-6 bg-white">
          <button
            type="button"
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              !isAdminMode
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              isAdminMode
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {isAdminMode ? (
            /* Admin Login Form */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              {adminError && (
                <p className="text-sm text-red-500">{adminError}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isAdminLoading}
              >
                {isAdminLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>
          ) : (
            /* Customer Login */
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Use Internet Identity to securely sign in to your account.
              </p>
              {identity ? (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-3">
                    ✓ Already signed in
                  </p>
                  <Button
                    onClick={() =>
                      navigate({
                        to: "/",
                        search: { category: undefined, search: undefined },
                      })
                    }
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCustomerLogin}
                  className="w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In with Internet Identity"
                  )}
                </Button>
              )}
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/create-account",
                    })
                  }
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
