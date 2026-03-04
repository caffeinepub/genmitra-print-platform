import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React from "react";

import Layout from "./components/Layout";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import EditorPage from "./pages/EditorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MagnetEditorPage from "./pages/MagnetEditorPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import CustomerManagementPage from "./pages/admin/CustomerManagementPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import TemplateManagementPage from "./pages/admin/TemplateManagementPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ── Root Route ────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ── Public Layout Route ───────────────────────────────────────────────────────
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
    search: search.search as string | undefined,
  }),
  component: HomePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/product/$productId",
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
  component: ProductDetailPage,
});

const editorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/editor/$productId",
  validateSearch: (search: Record<string, unknown>) => ({
    size: search.size as string | undefined,
  }),
  component: EditorPage,
});

const magnetEditorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/magnet-editor/$productId",
  validateSearch: (search: Record<string, unknown>) => ({
    magnet: search.magnet as string | undefined,
  }),
  component: MagnetEditorPage,
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/my-orders",
  component: MyOrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/order/$orderId",
  component: OrderDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/login",
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode as string | undefined,
    redirect: search.redirect as string | undefined,
  }),
  component: LoginPage,
});

const createAccountRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/create-account",
  component: CreateAccountPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

// ── Admin Guard Route ─────────────────────────────────────────────────────────
const adminGuardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-guard",
  component: AdminGuard,
});

// ── Admin Layout Route ────────────────────────────────────────────────────────
const adminLayoutRoute = createRoute({
  getParentRoute: () => adminGuardRoute,
  path: "/admin",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/products",
  component: ProductManagementPage,
});

const adminTemplatesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/templates",
  component: TemplateManagementPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/orders",
  component: OrderManagementPage,
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/customers",
  component: CustomerManagementPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: AdminSettingsPage,
});

// ── Route Tree ────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    productDetailRoute,
    editorRoute,
    magnetEditorRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
    myOrdersRoute,
    orderDetailRoute,
    profileRoute,
    loginRoute,
    createAccountRoute,
    forgotPasswordRoute,
  ]),
  adminGuardRoute.addChildren([
    adminLayoutRoute.addChildren([
      adminDashboardRoute,
      adminProductsRoute,
      adminTemplatesRoute,
      adminOrdersRoute,
      adminCustomersRoute,
      adminSettingsRoute,
    ]),
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
