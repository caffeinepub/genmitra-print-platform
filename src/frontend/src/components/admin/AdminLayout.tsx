import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  FileImage,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useAdminSession } from "../../hooks/useAdminSession";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Templates", icon: FileImage, href: "/admin/templates" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout() {
  const { logout } = useAdminSession();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/admin";

  const handleLogout = () => {
    logout();
    navigate({ to: "/", search: { category: undefined, search: undefined } });
  };

  const NavLink = ({
    item,
    onClick,
  }: {
    item: (typeof navItems)[0];
    onClick?: () => void;
  }) => {
    const isActive =
      item.href === "/admin"
        ? currentPath === "/admin"
        : currentPath.startsWith(item.href);
    const Icon = item.icon;
    return (
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = item.href;
          onClick?.();
        }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-white"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{item.label}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </a>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          role="button"
          tabIndex={0}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.currentTarget.click();
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              GenMitra
            </h1>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
          <button
            type="button"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-gray-900">Admin Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
