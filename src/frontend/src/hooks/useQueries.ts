import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CartItem,
  Order,
  OrderStatus,
  ProductInfo,
  ShippingAddress,
  Template,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";
import { useAdminSession } from "./useAdminSession";

// ── Products ────────────────────────────────────────────────────────────────

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductInfo[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductInfo | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      if (id.startsWith("demo-")) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpsertProduct() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInfo) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.upsertProductWithCredentials(
          session.username,
          session.password,
          product,
        );
      }
      return actor.upsertProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.deleteProductWithCredentials(
          session.username,
          session.password,
          id,
        );
      }
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Templates ────────────────────────────────────────────────────────────────

export function useGetTemplates() {
  const { actor, isFetching } = useActor();
  return useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplate(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Template | null>({
    queryKey: ["template", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplate(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpsertTemplate() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.upsertTemplateWithCredentials(
          session.username,
          session.password,
          template,
        );
      }
      return actor.upsertTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.deleteTemplateWithCredentials(
          session.username,
          session.password,
          id,
        );
      }
      return actor.deleteTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export function useGetCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCart(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(orderId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { session } = useAdminSession();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      if (session?.username && session?.password) {
        return actor.getAllOrdersWithCredentials(
          session.username,
          session.password,
        );
      }
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.updateOrderStatusWithCredentials(
          session.username,
          session.password,
          orderId,
          status,
        );
      }
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
}

// ── Shipping Address ──────────────────────────────────────────────────────────

export function useGetShippingAddress() {
  const { actor, isFetching } = useActor();
  return useQuery<ShippingAddress | null>({
    queryKey: ["shippingAddress"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getShippingAddress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveShippingAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: ShippingAddress) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveShippingAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingAddress"] });
    },
  });
}

// ── Pincodes ─────────────────────────────────────────────────────────────────

export function useGetAvailablePincodes() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["pincodes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailablePincodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsPincodeAvailable() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.isPincodeAvailable(pincode);
    },
  });
}

export function useAddPincode() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.addPincodeWithCredentials(
          session.username,
          session.password,
          pincode,
        );
      }
      return actor.addPincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pincodes"] });
    },
  });
}

export function useRemovePincode() {
  const { actor } = useActor();
  const { session } = useAdminSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error("Actor not available");
      if (session?.username && session?.password) {
        return actor.removePincodeWithCredentials(
          session.username,
          session.password,
          pincode,
        );
      }
      return actor.removePincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pincodes"] });
    },
  });
}

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── Role ──────────────────────────────────────────────────────────────────────

export function useGetMyRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      role,
    }: {
      user: import("@dfinity/principal").Principal;
      role: import("../backend").UserRole;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRole"] });
    },
  });
}

// ── Payment ───────────────────────────────────────────────────────────────────

export function useRecordPayment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      orderId,
      paymentRef,
    }: { orderId: string; paymentRef: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordPayment(orderId, paymentRef);
    },
  });
}
