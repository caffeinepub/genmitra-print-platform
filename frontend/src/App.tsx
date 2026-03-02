import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import EditorPage from './pages/EditorPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout route (public pages) — pathless layout route uses only `id`
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: CartPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const editorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/editor/$productId',
  component: EditorPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/my-orders',
  component: MyOrdersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order/$orderId',
  component: OrderDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/checkout',
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: typeof search.mode === 'string' ? search.mode : undefined,
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
});

const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-account',
  component: CreateAccountPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
});

// Admin layout route — uses only `path`, no `id` (cannot have both)
function AdminLayoutWrapper() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  );
}

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayoutWrapper,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/products',
  component: ProductManagementPage,
});

const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/templates',
  component: TemplateManagementPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/orders',
  component: OrderManagementPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    cartRoute,
    editorRoute,
    myOrdersRoute,
    orderDetailRoute,
    orderConfirmationRoute,
    checkoutRoute,
  ]),
  loginRoute,
  createAccountRoute,
  forgotPasswordRoute,
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
