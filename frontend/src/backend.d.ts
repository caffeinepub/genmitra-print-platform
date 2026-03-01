import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInfo {
    id: string;
    imageData: string;
    name: string;
    description: string;
    dpiSettings: bigint;
    deliveryTime: string;
    sizeOptions: Array<string>;
    category: string;
    price: number;
    templateImageData: string;
}
export interface ShippingAddress {
    city: string;
    fullName: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    pincode: string;
}
export interface CartItem {
    customImageData: string;
    quantity: bigint;
    selectedSize: string;
    product: ProductInfo;
}
export interface Order {
    status: OrderStatus;
    total: number;
    paymentStatus: string;
    paymentMethod: string;
    userId: Principal;
    createdAt: bigint;
    estimatedDelivery: string;
    orderId: string;
    shippingAddress: ShippingAddress;
    productionFileData: string;
    items: Array<CartItem>;
}
export interface UserProfile {
    username: string;
    createdAt: bigint;
    email: string;
    phone: string;
}
export interface Template {
    id: string;
    imageData: string;
    name: string;
    dpiSettings: bigint;
    previewData: string;
    photoSlots: bigint;
}
export enum OrderStatus {
    New = "New",
    Printed = "Printed",
    Delivered = "Delivered",
    Processing = "Processing",
    Shipped = "Shipped"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateProduct(productInfo: ProductInfo): Promise<void>;
    addOrUpdateTemplate(template: Template): Promise<void>;
    addPincode(pincode: string): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(targetUser: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createOrder(paymentMethod: string, shippingAddress: ShippingAddress): Promise<string>;
    createProduct(product: ProductInfo): Promise<void>;
    createTemplate(template: Template): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    deleteTemplate(templateId: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<ProductInfo>>;
    getAllTemplates(): Promise<Array<Template>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getDashboardSummary(): Promise<{
        totalProducts: bigint;
        totalOrders: bigint;
        totalUsers: bigint;
        totalEarnings: number;
    }>;
    getMyAddress(): Promise<ShippingAddress | null>;
    getMyOrders(): Promise<Array<Order>>;
    getProduct(productId: string): Promise<ProductInfo | null>;
    getProductsByCategory(category: string): Promise<Array<ProductInfo>>;
    getSelectedSize(): Promise<string | null>;
    getTemplate(templateId: string): Promise<Template | null>;
    getUserOrderHistory(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isPincodeAvailable(pincode: string): Promise<boolean>;
    /**
     * / Login with username and password. On success, assigns the caller's principal
     * / the role stored in the users map (admin or user) via AccessControl.
     */
    login(username: string, password: string): Promise<string>;
    /**
     * / Logout: demote the caller's principal back to guest role.
     */
    logout(): Promise<void>;
    removeFromCart(productId: string): Promise<void>;
    removePincode(pincode: string): Promise<void>;
    saveAddress(address: ShippingAddress): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    selectSize(size: string): Promise<void>;
    setProductionFileData(orderId: string, fileData: string): Promise<void>;
    trackOrder(orderId: string): Promise<Order>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(productInfo: ProductInfo): Promise<void>;
    updateTemplate(template: Template): Promise<void>;
}
