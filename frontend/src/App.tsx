import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditorPage from './pages/EditorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetailPage from './pages/OrderDetailPage';
import MyOrdersPage from './pages/MyOrdersPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
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

// Layout route (wraps public pages)
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: Layout,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      category: search.category as string | undefined,
    };
  },
});

// Home page
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

// Login page
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      mode: search.mode as string | undefined,
      redirect: search.redirect as string | undefined,
    };
  },
});

// Create account page
const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-account',
  component: CreateAccountPage,
});

// Forgot password page
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Product detail page
const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

// Editor page
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: EditorPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      productId: search.productId as string | undefined,
      size: search.size as string | undefined,
    };
  },
});

// Cart page
const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: CartPage,
});

// Checkout page
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

// Order confirmation page
const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

// Order detail page
const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order/$orderId',
  component: OrderDetailPage,
});

// My orders page
const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/my-orders',
  component: MyOrdersPage,
});

// Admin routes
const adminRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/products',
  component: ProductManagementPage,
});

const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/templates',
  component: TemplateManagementPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/orders',
  component: OrderManagementPage,
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/customers',
  component: CustomerManagementPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    cartRoute,
    orderDetailRoute,
    myOrdersRoute,
  ]),
  loginRoute,
  createAccountRoute,
  forgotPasswordRoute,
  editorRoute,
  checkoutRoute,
  orderConfirmationRoute,
  adminRootRoute.addChildren([
    adminDashboardRoute,
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
