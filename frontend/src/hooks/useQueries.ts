import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductInfo, Template, CartItem, ShippingAddress, Order, UserProfile, OrderStatus } from '../backend';

// ---- Product Queries ----

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductInfo[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();
  const isDemo = productId.startsWith('demo-');
  return useQuery<ProductInfo | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (isDemo) return null;
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !isDemo && !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductInfo[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ---- Template Queries ----

export function useGetAllTemplates() {
  const { actor, isFetching } = useActor();
  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useDeleteTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

// ---- Cart Queries ----

export function useGetCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCart();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// ---- Order Queries ----

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrackOrder(orderId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.trackOrder(orderId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentMethod, shippingAddress }: { paymentMethod: string; shippingAddress: ShippingAddress }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(paymentMethod, shippingAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// ---- Admin Order Queries ----

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useSetProductionFileData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, fileData }: { orderId: string; fileData: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProductionFileData(orderId, fileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

// ---- User Profile Queries ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Admin Queries ----

export function useGetDashboardSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalProducts: bigint; totalOrders: bigint; totalUsers: bigint; totalEarnings: number } | null>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getDashboardSummary();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<[import('@dfinity/principal').Principal, UserProfile][]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllUsers() as [import('@dfinity/principal').Principal, UserProfile][];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserOrderHistory(userId: import('@dfinity/principal').Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['userOrderHistory', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        return await actor.getUserOrderHistory(userId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// ---- Pincode Queries ----

export function useIsPincodeAvailable(pincode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['pincode', pincode],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPincodeAvailable(pincode);
    },
    enabled: !!actor && !isFetching && pincode.length === 6,
  });
}

export function useAddPincode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pincode'] });
    },
  });
}

export function useRemovePincode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pincode'] });
    },
  });
}

// ---- Address Queries ----

export function useGetMyAddress() {
  const { actor, isFetching } = useActor();
  return useQuery<ShippingAddress | null>({
    queryKey: ['myAddress'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMyAddress();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: ShippingAddress) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAddress'] });
    },
  });
}

// ---- Admin Login ----

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.login(username, password);
    },
  });
}
