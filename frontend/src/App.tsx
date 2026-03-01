import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';

// Pages
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditorPage from './pages/EditorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const ALLOWED_ORIGINS = [
  'https://sole-aqua-rc6-draft.caffeine.xyz',
  'https://caffeine.xyz',
  'https://www.caffeine.xyz',
  'https://caffeine.ai',
  'https://www.caffeine.ai',
];

function OriginHandler() {
  useEffect(() => {
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'app-ready', origin: window.location.origin }, '*');
      } catch (_) {
        // ignore cross-origin errors
      }
    }

    const handleMessage = (event: MessageEvent) => {
      const isAllowed =
        ALLOWED_ORIGINS.includes(event.origin) ||
        event.origin === window.location.origin ||
        event.origin === 'null' ||
        event.origin === '';

      if (!isAllowed) return;

      if (event.data && (event.data.type === 'ping' || event.data.type === 'draft-editor:ping')) {
        try {
          const target = event.source as Window;
          if (target) {
            target.postMessage({ type: 'pong', origin: window.location.origin }, event.origin || '*');
          }
        } catch (_) {
          // ignore
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return null;
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <OriginHandler />
      <Outlet />
    </>
  ),
});

// Public routes (no layout)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    mode: typeof search.mode === 'string' ? search.mode : undefined,
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
});

const createAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-account',
  component: CreateAccountPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Main layout routes
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
  }),
  component: HomePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const editorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/editor/$productId',
  component: EditorPage,
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/my-orders',
  component: MyOrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/order/$orderId',
  component: OrderDetailPage,
});

// Admin layout routes — wrapped with AdminGuard
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/products',
  component: ProductManagementPage,
});

const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/templates',
  component: TemplateManagementPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/orders',
  component: OrderManagementPage,
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/customers',
  component: CustomerManagementPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  createAccountRoute,
  forgotPasswordRoute,
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    editorRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
    myOrdersRoute,
    orderDetailRoute,
  ]),
  adminLayoutRoute.addChildren([
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
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
