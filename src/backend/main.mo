import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Type Definitions
  public type ProductInfo = {
    id : Text;
    name : Text;
    price : Nat;
    description : Text;
    sizeOptions : [Text];
    imageData : Text;
    templateImageData : Text;
    deliveryTime : Text;
    category : Text;
    dpiSettings : ?Nat;
  };

  public type Template = {
    id : Text;
    name : Text;
    imageData : Text;
    photoSlots : Nat;
    dpiSettings : Nat;
    previewData : Text;
  };

  public type OrderStatus = {
    #New;
    #Processing;
    #Printed;
    #Shipped;
    #Delivered;
  };

  public type CartItem = {
    product : ProductInfo;
    quantity : Nat;
    selectedSize : Text;
    customImageData : Text;
  };

  public type ShippingAddress = {
    fullName : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    phone : Text;
  };

  public type Order = {
    orderId : Text;
    userId : Principal;
    items : [CartItem];
    total : Nat;
    status : OrderStatus;
    paymentMethod : Text;
    paymentStatus : Text;
    shippingAddress : ShippingAddress;
    createdAt : Int;
    estimatedDelivery : Text;
    productionFileData : Text;
  };

  public type UserProfile = {
    username : Text;
    email : Text;
    phone : Text;
    createdAt : Int;
  };

  public type User = {
    password : Text;
    role : Text;
  };

  // Storage Structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  var products : Map.Map<Text, ProductInfo> = Map.empty<Text, ProductInfo>();
  let templates = Map.empty<Text, Template>();
  let orders = Map.empty<Text, Order>();
  let carts = Map.empty<Principal, [CartItem]>();
  let payments = Map.empty<Text, Text>();
  let availablePincodes = Set.empty<Text>();
  let userAddresses = Map.empty<Principal, ShippingAddress>();
  let selectedSizes = Map.empty<Principal, Text>();
  let users = Map.empty<Text, User>();

  // Admin Account Seeding
  func seedAdminAccounts() {
    users.add(
      "genmitra",
      {
        password = "12345678";
        role = "admin";
      },
    );
    users.add(
      "admin",
      {
        password = "Admin@1234";
        role = "admin";
      },
    );
    users.add(
      "genmitra_user",
      {
        password = "1234";
        role = "user";
      },
    );
  };

  // Demo Product Seeding
  func seedDemoProducts() {
    let product1 : ProductInfo = {
      id = "1";
      name = "Wall Decor Collage";
      price = 599;
      description = "Transform your space with our Wall Decor Collage kit. Create a stunning gallery of memories with customizable photo layouts.";
      sizeOptions = ["A4", "A3", "A2"];
      imageData = "";
      templateImageData = "";
      deliveryTime = "5-7 business days";
      category = "Posters with Photo";
      dpiSettings = ?300;
    };

    let product2 : ProductInfo = {
      id = "2";
      name = "Poster Collage with Photo";
      price = 799;
      description = "Celebrate your favorite moments with our Poster Collage featuring a central photo surrounded by beautiful designs.";
      sizeOptions = ["A4", "A3", "A2"];
      imageData = "";
      templateImageData = "";
      deliveryTime = "5-7 business days";
      category = "Posters with Photo";
      dpiSettings = ?300;
    };

    let product3 : ProductInfo = {
      id = "3";
      name = "Custom Canvas Prints";
      price = 1299;
      description = "Create personalized canvas prints with your own photos and text. Perfect for gifts and home decor.";
      sizeOptions = ["12x12 inch", "16x20 inch", "20x30 inch"];
      imageData = "";
      templateImageData = "";
      deliveryTime = "7-10 business days";
      category = "Canvas Prints";
      dpiSettings = ?300;
    };

    let product4 : ProductInfo = {
      id = "4";
      name = "Framed Photo Collage";
      price = 1499;
      description = "Display your memories in style with our Framed Photo Collage. Choose from various layouts and frame options.";
      sizeOptions = ["A4", "A3", "A2"];
      imageData = "";
      templateImageData = "";
      deliveryTime = "5-7 business days";
      category = "Framed Prints";
      dpiSettings = ?300;
    };

    let product5 : ProductInfo = {
      id = "5";
      name = "Custom Poster Printing";
      price = 499;
      description = "Get your favorite photos printed as high-quality posters. Available in multiple sizes.";
      sizeOptions = ["A4", "A3", "A2"];
      imageData = "";
      templateImageData = "";
      deliveryTime = "3-5 business days";
      category = "Unframed Posters";
      dpiSettings = ?300;
    };

    products.add(product1.id, product1);
    products.add(product2.id, product2);
    products.add(product3.id, product3);
    products.add(product4.id, product4);
    products.add(product5.id, product5);
  };

  // ── User Profile Functions ──────────────────────────────────────────────────

  /// Get the caller's own profile. Requires at least #user role.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  /// Get any user's profile. Caller may only view their own profile unless admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /// Save the caller's own profile. Requires at least #user role.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Product Functions ───────────────────────────────────────────────────────

  /// Get all products. Available to everyone (no auth required).
  public query func getProducts() : async [ProductInfo] {
    products.values().toArray();
  };

  /// Get a single product by id. Available to everyone.
  public query func getProduct(id : Text) : async ?ProductInfo {
    products.get(id);
  };

  /// Add or update a product. Admin only.
  public shared ({ caller }) func upsertProduct(product : ProductInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage products");
    };
    products.add(product.id, product);
  };

  /// Delete a product. Admin only.
  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  // ── Template Functions ──────────────────────────────────────────────────────

  /// Get all templates. Available to everyone.
  public query func getTemplates() : async [Template] {
    templates.values().toArray();
  };

  /// Get a single template by id. Available to everyone.
  public query func getTemplate(id : Text) : async ?Template {
    templates.get(id);
  };

  /// Add or update a template. Admin only.
  public shared ({ caller }) func upsertTemplate(template : Template) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage templates");
    };
    templates.add(template.id, template);
  };

  /// Delete a template. Admin only.
  public shared ({ caller }) func deleteTemplate(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete templates");
    };
    templates.remove(id);
  };

  // ── Cart Functions ──────────────────────────────────────────────────────────

  /// Get the caller's cart. Requires #user role.
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (?items) items;
      case null [];
    };
  };

  /// Save the caller's cart. Requires #user role.
  public shared ({ caller }) func saveCart(items : [CartItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their cart");
    };
    carts.add(caller, items);
  };

  /// Clear the caller's cart. Requires #user role.
  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their cart");
    };
    carts.remove(caller);
  };

  // ── Order Functions ─────────────────────────────────────────────────────────

  /// Place a new order. Requires #user role.
  public shared ({ caller }) func placeOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (order.userId != caller) {
      Runtime.trap("Unauthorized: Order userId must match caller");
    };
    orders.add(order.orderId, order);
  };

  /// Get the caller's own orders. Requires #user role.
  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter<Order>(func(o) { o.userId == caller });
  };

  /// Get a specific order. Caller must own the order or be admin.
  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
      case null null;
    };
  };

  /// Get all orders. Admin only.
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  /// Update order status. Admin only.
  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        let updated : Order = {
          order with
          status = status;
        };
        orders.add(orderId, updated);
      };
      case null Runtime.trap("Order not found");
    };
  };

  // ── Shipping Address Functions ──────────────────────────────────────────────

  /// Get the caller's saved shipping address. Requires #user role.
  public query ({ caller }) func getShippingAddress() : async ?ShippingAddress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their shipping address");
    };
    userAddresses.get(caller);
  };

  /// Save the caller's shipping address. Requires #user role.
  public shared ({ caller }) func saveShippingAddress(address : ShippingAddress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their shipping address");
    };
    userAddresses.add(caller, address);
  };

  // ── Pincode Functions ───────────────────────────────────────────────────────

  /// Check if a pincode is serviceable. Available to everyone.
  public query func isPincodeAvailable(pincode : Text) : async Bool {
    availablePincodes.contains(pincode);
  };

  /// Get all available pincodes. Available to everyone.
  public query func getAvailablePincodes() : async [Text] {
    availablePincodes.toArray();
  };

  /// Add a serviceable pincode. Admin only.
  public shared ({ caller }) func addPincode(pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage pincodes");
    };
    availablePincodes.add(pincode);
  };

  /// Remove a serviceable pincode. Admin only.
  public shared ({ caller }) func removePincode(pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage pincodes");
    };
    availablePincodes.remove(pincode);
  };

  // ── Payment Functions ───────────────────────────────────────────────────────

  /// Record a payment for an order. Requires #user role.
  public shared ({ caller }) func recordPayment(orderId : Text, paymentRef : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record payments");
    };
    // Verify the order belongs to the caller
    switch (orders.get(orderId)) {
      case (?order) {
        if (order.userId != caller) {
          Runtime.trap("Unauthorized: Can only pay for your own orders");
        };
      };
      case null Runtime.trap("Order not found");
    };
    payments.add(orderId, paymentRef);
  };

  /// Get payment reference for an order. Caller must own the order or be admin.
  public query ({ caller }) func getPayment(orderId : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payments");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own payment details");
        };
      };
      case null Runtime.trap("Order not found");
    };
    payments.get(orderId);
  };

  // ── Role Management ─────────────────────────────────────────────────────────

  /// Assign a role to a user. Admin only (enforced inside AccessControl.assignRole).
  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  /// Get the role of the caller.
  public query ({ caller }) func getMyRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  // ── Credential-Based Admin Functions ────────────────────────────────────────

  /// Validate admin credentials (username + password).
  func validateAdminCredentials(adminUser : Text, adminPass : Text) {
    switch (users.get(adminUser)) {
      case (?user) {
        if (user.role != "admin" or user.password != adminPass) {
          Runtime.trap("Unauthorized: Invalid admin credentials");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Admin user not found");
      };
    };
  };

  /// Add or update a product with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func upsertProductWithCredentials(adminUser : Text, adminPass : Text, product : ProductInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    products.add(product.id, product);
  };

  /// Delete a product with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func deleteProductWithCredentials(adminUser : Text, adminPass : Text, id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    products.remove(id);
  };

  /// Add or update a template with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func upsertTemplateWithCredentials(adminUser : Text, adminPass : Text, template : Template) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    templates.add(template.id, template);
  };

  /// Delete a template with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func deleteTemplateWithCredentials(adminUser : Text, adminPass : Text, id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    templates.remove(id);
  };

  /// Update order status with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func updateOrderStatusWithCredentials(adminUser : Text, adminPass : Text, orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    switch (orders.get(orderId)) {
      case (?order) {
        let updated : Order = {
          order with
          status = status;
        };
        orders.add(orderId, updated);
      };
      case null Runtime.trap("Order not found");
    };
  };

  /// Get all orders with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func getAllOrdersWithCredentials(adminUser : Text, adminPass : Text) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    orders.values().toArray();
  };

  /// Add a pincode with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func addPincodeWithCredentials(adminUser : Text, adminPass : Text, pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    availablePincodes.add(pincode);
  };

  /// Remove a pincode with credentials. Requires caller to be authenticated (#user) AND valid admin credentials.
  public shared ({ caller }) func removePincodeWithCredentials(adminUser : Text, adminPass : Text, pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Caller must be authenticated");
    };
    validateAdminCredentials(adminUser, adminPass);
    availablePincodes.remove(pincode);
  };
};
