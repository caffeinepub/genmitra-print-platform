import React, { useState } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  FileImage,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminSession } from '../../hooks/useAdminSession';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Templates', path: '/admin/templates', icon: FileImage },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutAdmin } = useAdminSession();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    logoutAdmin();
    navigate({ to: '/', search: { category: undefined, search: undefined } });
  };

  const handleBackToStore = () => {
    navigate({ to: '/', search: { category: undefined, search: undefined } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-[#2874f0] flex items-center justify-center">
            <Printer className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">GenMitra</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2874f0] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.path;
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
              </a>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-200 space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-500 hover:text-gray-700 rounded-xl"
            onClick={handleBackToStore}
          >
            ← Back to Store
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {navItems.find((n) => currentPath === n.path || (n.path !== '/admin' && currentPath.startsWith(n.path)))?.label || 'Admin'}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
