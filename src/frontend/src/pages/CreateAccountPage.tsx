import { useNavigate } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { login, loginStatus } = useInternetIdentity();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login();
    } catch {
      // handle error silently
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GenMitra</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Join GenMitra to start creating memories
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label
                htmlFor="create-username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="create-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="create-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="create-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loginStatus === "logging-in"}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginStatus === "logging-in" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account with Internet Identity"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/login",
                    search: { mode: undefined, redirect: undefined },
                  })
                }
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
