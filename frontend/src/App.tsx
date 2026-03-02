import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditorPage from './pages/EditorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout route (public pages with header/footer)
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

// Home route
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
    search: search.search as string | undefined,
  }),
});

// Product detail route
const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Editor route
const editorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/editor/$productId',
  component: EditorPage,
  validateSearch: (search: Record<string, unknown>) => ({
    size: search.size as string | undefined,
  }),
});

// Cart route
const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: CartPage,
});

// Checkout route
const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/checkout',
  component: CheckoutPage,
});

// Order confirmation route
const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

// My orders route
const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/my-orders',
  component: MyOrdersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Order detail route
const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order/$orderId',
  component: OrderDetailPage,
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode as string | undefined,
    redirect: search.redirect as string | undefined,
  }),
});

// Create account route
const createAccountRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/create-account',
  component: CreateAccountPage,
});

// Forgot password route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile',
  component: ProfilePage,
});

// Admin layout route
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  ),
});

// Admin dashboard route
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminDashboardPage,
});

// Admin products route
const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/products',
  component: ProductManagementPage,
});

// Admin templates route
const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/templates',
  component: TemplateManagementPage,
});

// Admin orders route
const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/orders',
  component: OrderManagementPage,
});

// Admin settings route
const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: AdminSettingsPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    editorRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
    myOrdersRoute,
    orderDetailRoute,
    loginRoute,
    createAccountRoute,
    forgotPasswordRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminTemplatesRoute,
    adminOrdersRoute,
    adminSettingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
