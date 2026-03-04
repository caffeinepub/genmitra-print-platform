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
    dpiSettings?: bigint;
    deliveryTime: string;
    sizeOptions: Array<string>;
    category: string;
    price: bigint;
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
    total: bigint;
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
    /**
     * / Add a serviceable pincode. Admin only.
     */
    addPincode(pincode: string): Promise<void>;
    /**
     * / Add a pincode with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    addPincodeWithCredentials(adminUser: string, adminPass: string, pincode: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Assign a role to a user. Admin only (enforced inside AccessControl.assignRole).
     */
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Clear the caller's cart. Requires #user role.
     */
    clearCart(): Promise<void>;
    /**
     * / Delete a product. Admin only.
     */
    deleteProduct(id: string): Promise<void>;
    /**
     * / Delete a product with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    deleteProductWithCredentials(adminUser: string, adminPass: string, id: string): Promise<void>;
    /**
     * / Delete a template. Admin only.
     */
    deleteTemplate(id: string): Promise<void>;
    /**
     * / Delete a template with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    deleteTemplateWithCredentials(adminUser: string, adminPass: string, id: string): Promise<void>;
    /**
     * / Get all orders. Admin only.
     */
    getAllOrders(): Promise<Array<Order>>;
    /**
     * / Get all orders with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    getAllOrdersWithCredentials(adminUser: string, adminPass: string): Promise<Array<Order>>;
    /**
     * / Get all available pincodes. Available to everyone.
     */
    getAvailablePincodes(): Promise<Array<string>>;
    /**
     * / Get the caller's own profile. Requires at least #user role.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get the caller's cart. Requires #user role.
     */
    getCart(): Promise<Array<CartItem>>;
    /**
     * / Get the caller's own orders. Requires #user role.
     */
    getMyOrders(): Promise<Array<Order>>;
    /**
     * / Get the role of the caller.
     */
    getMyRole(): Promise<UserRole>;
    /**
     * / Get a specific order. Caller must own the order or be admin.
     */
    getOrder(orderId: string): Promise<Order | null>;
    /**
     * / Get payment reference for an order. Caller must own the order or be admin.
     */
    getPayment(orderId: string): Promise<string | null>;
    /**
     * / Get a single product by id. Available to everyone.
     */
    getProduct(id: string): Promise<ProductInfo | null>;
    /**
     * / Get all products. Available to everyone (no auth required).
     */
    getProducts(): Promise<Array<ProductInfo>>;
    /**
     * / Get the caller's saved shipping address. Requires #user role.
     */
    getShippingAddress(): Promise<ShippingAddress | null>;
    /**
     * / Get a single template by id. Available to everyone.
     */
    getTemplate(id: string): Promise<Template | null>;
    /**
     * / Get all templates. Available to everyone.
     */
    getTemplates(): Promise<Array<Template>>;
    /**
     * / Get any user's profile. Caller may only view their own profile unless admin.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Check if a pincode is serviceable. Available to everyone.
     */
    isPincodeAvailable(pincode: string): Promise<boolean>;
    /**
     * / Place a new order. Requires #user role.
     */
    placeOrder(order: Order): Promise<void>;
    /**
     * / Record a payment for an order. Requires #user role.
     */
    recordPayment(orderId: string, paymentRef: string): Promise<void>;
    /**
     * / Remove a serviceable pincode. Admin only.
     */
    removePincode(pincode: string): Promise<void>;
    /**
     * / Remove a pincode with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    removePincodeWithCredentials(adminUser: string, adminPass: string, pincode: string): Promise<void>;
    /**
     * / Save the caller's own profile. Requires at least #user role.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Save the caller's cart. Requires #user role.
     */
    saveCart(items: Array<CartItem>): Promise<void>;
    /**
     * / Save the caller's shipping address. Requires #user role.
     */
    saveShippingAddress(address: ShippingAddress): Promise<void>;
    /**
     * / Update order status. Admin only.
     */
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    /**
     * / Update order status with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    updateOrderStatusWithCredentials(adminUser: string, adminPass: string, orderId: string, status: OrderStatus): Promise<void>;
    /**
     * / Add or update a product. Admin only.
     */
    upsertProduct(product: ProductInfo): Promise<void>;
    /**
     * / Add or update a product with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    upsertProductWithCredentials(adminUser: string, adminPass: string, product: ProductInfo): Promise<void>;
    /**
     * / Add or update a template. Admin only.
     */
    upsertTemplate(template: Template): Promise<void>;
    /**
     * / Add or update a template with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
     */
    upsertTemplateWithCredentials(adminUser: string, adminPass: string, template: Template): Promise<void>;
}
