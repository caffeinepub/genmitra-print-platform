import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditorPage from './pages/EditorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';

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

// Pathless layout route — uses only `id`, no `path`
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
});

// Home
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Product detail
const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Editor
const editorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/editor',
  component: EditorPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
    productId: search.productId as string | undefined,
    size: search.size as string | undefined,
  }),
});

// Cart
const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: CartPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Checkout
const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/checkout',
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// My Orders
const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/my-orders',
  component: MyOrdersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Order Detail
const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order/$orderId',
  component: OrderDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Order Confirmation
const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode as string | undefined,
    redirect: search.redirect as string | undefined,
  }),
});

// Create Account
const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-account',
  component: CreateAccountPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Forgot Password
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

// Admin layout route — pathless, uses only `id`
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: () => (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  ),
});

// Admin index
const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

// Admin products
const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/products',
  component: ProductManagementPage,
});

// Admin templates
const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/templates',
  component: TemplateManagementPage,
});

// Admin orders
const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/orders',
  component: OrderManagementPage,
});

// Admin customers
const adminCustomersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/customers',
  component: CustomerManagementPage,
});

// Admin settings
const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    editorRoute,
    cartRoute,
    checkoutRoute,
    myOrdersRoute,
    orderDetailRoute,
    orderConfirmationRoute,
  ]),
  loginRoute,
  createAccountRoute,
  forgotPasswordRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminProductsRoute,
    adminTemplatesRoute,
    adminOrdersRoute,
    adminCustomersRoute,
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
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
