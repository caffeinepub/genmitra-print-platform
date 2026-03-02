import { useState } from 'react';
import { Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { ShoppingCart, Search, User, Menu, X, Package, LogOut, UserCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function Layout() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: cartItems } = useGetCart();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const cartCount = cartItems?.length ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/', search: { search: encodeURIComponent(searchQuery.trim()), category: undefined } });
    } else {
      navigate({ to: '/', search: { category: undefined, search: undefined } });
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/', search: { category: undefined, search: undefined } });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f6f7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
            >
              <img src="/assets/generated/logo.dim_320x80.png" alt="GenMitra" className="h-10 w-auto" />
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-sm text-sm focus:outline-none focus:border-[#2874f0]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2874f0] text-white rounded-r-sm hover:bg-[#1f5bb8] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Nav */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Profile Button */}
                  <button
                    onClick={() => navigate({ to: '/profile' })}
                    className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#2874f0] transition-colors"
                    title="My Profile"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="text-xs mt-0.5 hidden sm:block">Profile</span>
                  </button>

                  {/* My Orders */}
                  <button
                    onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
                    className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#2874f0] transition-colors"
                    title="My Orders"
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-xs mt-0.5 hidden sm:block">Orders</span>
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => navigate({ to: '/cart' })}
                    className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#2874f0] transition-colors relative"
                    title="Cart"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#2874f0] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-0.5 hidden sm:block">Cart</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs mt-0.5 hidden sm:block">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate({ to: '/login', search: { mode: undefined, redirect: undefined } })}
                    className="px-6 py-2 bg-[#2874f0] text-white text-sm font-medium rounded hover:bg-[#1f5bb8] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate({ to: '/cart' })}
                    className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-[#2874f0] transition-colors relative"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#2874f0] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-0.5 hidden sm:block">Cart</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Nav Bar */}
        <div className="bg-[#2874f0] text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 h-10 text-sm overflow-x-auto">
              {['Photo Prints', 'Photo Frames', 'Photo Magnets', 'Mugs', 'Corporate Gifts'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate({ to: '/', search: { category: cat, search: undefined } })}
                  className="whitespace-nowrap hover:text-yellow-300 transition-colors font-medium"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">About GenMitra</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Help</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Payments</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Policy</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Social</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#2874f0] transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} GenMitra. All rights reserved.</p>
            <p className="mt-1">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'genmitra')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2874f0] hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
