import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut, Package } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import Footer from './Footer';

const CATEGORIES = [
  'Photo Prints',
  'Photo Frames',
  'Photo Magnets',
  'Mugs',
  'Corporate Gifts',
];

export default function Layout() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: cartItems } = useGetCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const cartCount = cartItems?.length ?? 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setUserMenuOpen(false);
    navigate({ to: '/', search: { category: undefined } });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);
    navigate({ to: '/', search: { category } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        🎉 Free shipping on orders above ₹499 | Same-day delivery available!
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" search={{ category: undefined }} className="flex items-center gap-2">
              <img
                src="/assets/generated/logo.dim_320x80.png"
                alt="GenMitra"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.className = 'text-2xl font-bold text-primary';
                    span.textContent = 'GenMitra';
                    parent.appendChild(span);
                  }
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="relative">
                <button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Categories <ChevronDown className="w-4 h-4" />
                </button>
                {categoryMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to="/"
                search={{ category: undefined }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => navigate({ to: '/cart', search: { category: undefined } })}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate({ to: '/my-orders', search: { category: undefined } });
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 rounded-t-lg"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 rounded-b-lg text-destructive"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={loginStatus === 'logging-in'}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/', search: { category: undefined } });
                }}
                className="w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <div className="border-t border-border pt-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Categories</p>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left py-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {!isAuthenticated && (
                <div className="border-t border-border pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogin();
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Overlay for dropdowns */}
      {(categoryMenuOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCategoryMenuOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}
