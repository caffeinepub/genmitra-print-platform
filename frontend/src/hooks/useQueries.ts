import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductInfo, Template, Order, OrderStatus, UserProfile, CartItem, ShippingAddress } from '../backend';

// ---- Helper: always get the freshest actor ----
function useActorInstance() {
  const { actor } = useActor();
  return actor;
}

// ---- User Profile ----

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

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      try {
        return await actor.getCallerUserRole();
      } catch {
        return 'guest';
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();
  const actor = useActorInstance();

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

export function useAssignUserRole() {
  const queryClient = useQueryClient();
  const actor = useActorInstance();

  return useMutation({
    mutationFn: async ({ targetUser, role }: { targetUser: string; role: string }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.assignUserRole(Principal.fromText(targetUser), role as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

// ---- Products ----

export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductInfo[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductInfo[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductInfo | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (product: ProductInfo) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (product: ProductInfo) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ---- Templates ----

export function useGetAllTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTemplate(templateId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Template | null>({
    queryKey: ['template', templateId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplate(templateId);
    },
    enabled: !!actor && !actorFetching && !!templateId,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.createTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.updateTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      return actor.deleteTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

// ---- Orders ----

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useTrackOrder(orderId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.trackOrder(orderId);
    },
    enabled: !!actor && !actorFetching && !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

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
  const queryClient = useQueryClient();
  const { actor } = useActor();

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

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

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

// ---- Cart ----

export function useGetCart() {
  const { actor, isFetching: actorFetching } = useActor();

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
    enabled: !!actor && !actorFetching,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

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
  const queryClient = useQueryClient();
  const { actor } = useActor();

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
  const queryClient = useQueryClient();
  const { actor } = useActor();

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

// ---- Dashboard ----

export function useGetDashboardSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ totalOrders: bigint; totalEarnings: number; totalUsers: bigint; totalProducts: bigint }>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ---- Pincodes ----

export function useAddPincode() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pincodes'] });
    },
  });
}

export function useRemovePincode() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pincode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePincode(pincode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pincodes'] });
    },
  });
}

export function useIsPincodeAvailable(pincode: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['pincode', pincode],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPincodeAvailable(pincode);
    },
    enabled: !!actor && !actorFetching && !!pincode,
  });
}

// ---- Address ----

export function useGetMyAddress() {
  const { actor, isFetching: actorFetching } = useActor();

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
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveAddress() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

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

// ---- Users (Admin) ----

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[any, UserProfile][]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}
