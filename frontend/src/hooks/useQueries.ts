import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductInfo, Template, CartItem, ShippingAddress, OrderStatus, UserProfile, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// ---- Products ----

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
  return useQuery<ProductInfo | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
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

export function useAddOrUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productInfo: ProductInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateProduct(productInfo);
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

// ---- Templates ----

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

export function useGetTemplate(templateId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Template | null>({
    queryKey: ['template', templateId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTemplate(templateId);
    },
    enabled: !!actor && !isFetching && !!templateId,
  });
}

export function useAddOrUpdateTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: Template) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateTemplate(template);
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

// ---- Cart ----

export function useGetCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
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

// ---- Orders ----

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      paymentMethod,
      shippingAddress,
    }: {
      paymentMethod: string;
      shippingAddress: ShippingAddress;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(paymentMethod, shippingAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useTrackOrder(orderId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.trackOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

// ---- Admin Orders ----

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
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
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
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

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
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
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ---- Admin Users ----

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserOrderHistory(userId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['userOrderHistory', userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrderHistory(Principal.fromText(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// ---- Dashboard ----

export function useGetDashboardSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Pincodes ----

export function useIsPincodeAvailable(pincode: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
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

// ---- Address ----

export function useGetMyAddress() {
  const { actor, isFetching } = useActor();
  return useQuery<ShippingAddress | null>({
    queryKey: ['myAddress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyAddress();
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

// ---- Size Selection ----

export function useGetSelectedSize() {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ['selectedSize'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSelectedSize();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSelectSize() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (size: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.selectSize(size);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedSize'] });
    },
  });
}

// ---- Role Assignment ----

export function useAssignUserRole() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignUserRole(Principal.fromText(userId), role);
    },
  });
}
