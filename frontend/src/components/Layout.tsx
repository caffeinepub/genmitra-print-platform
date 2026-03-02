import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from '@tanstack/react-router';
import { ShoppingCart, User, LogOut, Package, Search, Menu, X, ChevronDown } from 'lucide-react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    setMobileMenuOpen(false);
    navigate({ to: '/', search: { category } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/', search: { category: undefined } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs font-medium">
        🎉 Free shipping on orders above ₹499 | Same-day delivery available!
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" search={{ category: undefined }} className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">GenMitra</span>
            </Link>

            {/* Search Bar - centered */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gifts, frames, prints..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Cart */}
              <button
                onClick={() => navigate({ to: '/cart', search: { category: undefined } })}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 p-2 text-gray-600 hover:text-primary transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-6 h-6" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate({ to: '/my-orders', search: { category: undefined } });
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 rounded-t-xl text-gray-700"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 rounded-b-xl text-red-500"
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
                  className="hidden md:flex items-center gap-2 p-2 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                  aria-label="Login"
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for gifts, frames, prints..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </form>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/', search: { category: undefined } });
                }}
                className="w-full text-left py-2 text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Categories</p>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {!isAuthenticated && (
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogin();
                    }}
                    className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm"
                  >
                    {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
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
    </div>
  );
}
