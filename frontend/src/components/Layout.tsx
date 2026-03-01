import React, { useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ShoppingCart, User, Menu, X, ChevronDown, Tag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGetCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const categories = [
  { name: 'Photo Prints' },
  { name: 'Photo Frames' },
  { name: 'Photo Magnets' },
  { name: 'Mugs' },
  { name: 'Corporate Gifts' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, userProfile, logout, login, isLoggingIn, isAdmin } = useAuth();
  const { data: cartItems } = useGetCart();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const cartCount = cartItems?.length ?? 0;

  // Get the active category from the current URL search params
  const searchParams = new URLSearchParams(routerState.location.search);
  const activeCategory = searchParams.get('category') ?? '';

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      login();
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate({ to: '/', search: { category: categoryName } });
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate({ to: '/', search: { category: undefined } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Promo Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center flex items-center justify-center gap-3 px-4">
        <span className="flex items-center gap-1">
          🚚 Free delivery on orders above ₹999
        </span>
        <span className="opacity-50 hidden sm:inline">|</span>
        <span className="hidden sm:flex items-center gap-1">
          <Tag className="h-3 w-3" />
          Use code <strong className="font-bold tracking-wide">PRINT20</strong> for 20% off
        </span>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 shrink-0 focus:outline-none"
            >
              <img
                src="/assets/generated/logo.dim_320x80.png"
                alt="PrintCraft Studio"
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xl font-bold text-primary font-display">PrintCraft</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground hover:text-primary hover:bg-secondary'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: '/cart' })}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">
                        {userProfile?.username || 'Account'}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                          Admin Panel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate({ to: '/my-orders' })}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuthAction} className="text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAuthAction}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:opacity-90"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground hover:text-primary hover:bg-secondary'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
              {/* Mobile promo reminder */}
              <div className="mt-2 pt-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
                <Tag className="h-3 w-3 inline mr-1" />
                Use code <strong>PRINT20</strong> for 20% off
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
