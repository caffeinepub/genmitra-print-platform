import Map "mo:core/Map";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ---- Type Definitions ----

  public type ProductInfo = {
    id : Text;
    name : Text;
    price : Float;
    description : Text;
    sizeOptions : [Text];
    imageData : Text; // Base64 image as Text
    templateImageData : Text; // Base64 image as Text
    deliveryTime : Text;
    category : Text;
    dpiSettings : ?Nat;
  };

  public type Template = {
    id : Text;
    name : Text;
    imageData : Text; // Base64 image as Text
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
    total : Float;
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

  // ---- Stable Data ----

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Text, ProductInfo>();
  let templates = Map.empty<Text, Template>();
  let orders = Map.empty<Text, Order>();
  let carts = Map.empty<Principal, [CartItem]>();
  let payments = Map.empty<Text, Text>();
  let availablePincodes = Set.empty<Text>();
  let userAddresses = Map.empty<Principal, ShippingAddress>();
  let selectedSizes = Map.empty<Principal, Text>();
  var users : Map.Map<Text, User> = Map.empty<Text, User>();

  // ---- Lifecycle Method ----

  system func preupgrade() {
    upsertAdminSeeds();
    upsertDemoProducts();
  };

  system func postupgrade() {
    upsertAdminSeeds();
    upsertDemoProducts();
  };

  // ---- Admin Account Seeding ----

  func upsertAdminSeeds() {
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

  // ---- Demo Product Seeding ----

  func upsertDemoProducts() {
    let product1 : ProductInfo = {
      id = "1";
      name = "Wall Decor Collage";
      price = 599.0;
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
      price = 799.0;
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
      price = 1299.0;
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
      price = 1499.0;
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
      price = 499.0;
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

  // ---- Authentication (Login / Logout) ----

  public shared ({ caller }) func login(username : Text, password : Text) : async Text {
    switch (users.get(username)) {
      case (null) { Runtime.trap("Invalid username or password") };
      case (?user) {
        if (user.password != password) {
          Runtime.trap("Invalid username or password");
        };
        let role : AccessControl.UserRole = if (user.role == "admin") { #admin } else { #user };
        AccessControl.assignRole(accessControlState, caller, caller, role);
        "Login successful";
      };
    };
  };

  public shared ({ caller }) func logout() : async () {
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      if (AccessControl.isAdmin(accessControlState, caller)) {
        AccessControl.assignRole(accessControlState, caller, caller, #guest);
      };
    };
  };

  // ---- User Profile Functions (required by frontend) ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ---- Role Assignment ----

  public shared ({ caller }) func assignUserRole(targetUser : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, targetUser, role);
  };

  // ---- Product Management ----

  public shared ({ caller }) func addOrUpdateProduct(productInfo : ProductInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage products");
    };
    products.add(productInfo.id, productInfo);
  };

  public shared ({ caller }) func createProduct(product : ProductInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(productInfo : ProductInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(productInfo.id, productInfo);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public query func getProduct(productId : Text) : async ?ProductInfo {
    products.get(productId);
  };

  public query func getProductsByCategory(category : Text) : async [ProductInfo] {
    let all = products.values();
    Array.fromIter(
      all.filter(func(p : ProductInfo) : Bool { p.category == category })
    );
  };

  public query func getAllProducts() : async [ProductInfo] {
    Array.fromIter(products.values());
  };

  // ---- Template Management ----

  public shared ({ caller }) func addOrUpdateTemplate(template : Template) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage templates");
    };
    templates.add(template.id, template);
  };

  public shared ({ caller }) func createTemplate(template : Template) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create templates");
    };
    templates.add(template.id, template);
  };

  public shared ({ caller }) func updateTemplate(template : Template) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update templates");
    };
    templates.add(template.id, template);
  };

  public shared ({ caller }) func deleteTemplate(templateId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete templates");
    };
    templates.remove(templateId);
  };

  public query func getTemplate(templateId : Text) : async ?Template {
    templates.get(templateId);
  };

  public query func getAllTemplates() : async [Template] {
    Array.fromIter(templates.values());
  };

  // ---- Cart Management ----

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    carts.add(caller, currentCart.concat([item]));
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updated = currentCart.filter(func(item : CartItem) : Bool {
      item.product.id != productId
    });
    carts.add(caller, updated);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // ---- Order Management ----

  public shared ({ caller }) func createOrder(paymentMethod : Text, shippingAddress : ShippingAddress) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) { c };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let total = cart.foldLeft(0.0, func(acc, item) {
      acc + item.product.price * item.quantity.toFloat();
    });

    let orderId = caller.toText() # "_" # Time.now().toText();

    let newOrder : Order = {
      orderId = orderId;
      userId = caller;
      items = cart;
      total = total;
      status = #New;
      paymentMethod = paymentMethod;
      paymentStatus = if (paymentMethod == "COD") { "Pending" } else { "Paid" };
      shippingAddress = shippingAddress;
      createdAt = Time.now();
      estimatedDelivery = "5-7 business days";
      productionFileData = "";
    };

    orders.add(orderId, newOrder);
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let allOrders = Array.fromIter(orders.values());
    allOrders.filter(func(o : Order) : Bool {
      o.userId == caller
    });
  };

  public query ({ caller }) func trackOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only track your own orders");
        };
        order;
      };
    };
  };

  // ---- Admin Order Management ----

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    Array.fromIter(orders.values());
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated : Order = {
          orderId = order.orderId;
          userId = order.userId;
          items = order.items;
          total = order.total;
          status = newStatus;
          paymentMethod = order.paymentMethod;
          paymentStatus = order.paymentStatus;
          shippingAddress = order.shippingAddress;
          createdAt = order.createdAt;
          estimatedDelivery = order.estimatedDelivery;
          productionFileData = order.productionFileData;
        };
        orders.add(orderId, updated);
      };
    };
  };

  public shared ({ caller }) func setProductionFileData(orderId : Text, fileData : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set production files");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated : Order = {
          orderId = order.orderId;
          userId = order.userId;
          items = order.items;
          total = order.total;
          status = order.status;
          paymentMethod = order.paymentMethod;
          paymentStatus = order.paymentStatus;
          shippingAddress = order.shippingAddress;
          createdAt = order.createdAt;
          estimatedDelivery = order.estimatedDelivery;
          productionFileData = fileData;
        };
        orders.add(orderId, updated);
      };
    };
  };

  // ---- Customer Management ----

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    Array.fromIter(userProfiles.entries());
  };

  public query ({ caller }) func getUserOrderHistory(userId : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user order history");
    };
    let allOrders = Array.fromIter(orders.values());
    allOrders.filter(func(o : Order) : Bool {
      o.userId == userId
    });
  };

  // ---- Pincode Management ----

  public shared ({ caller }) func addPincode(pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage pincodes");
    };
    availablePincodes.add(pincode);
  };

  public shared ({ caller }) func removePincode(pincode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage pincodes");
    };
    availablePincodes.remove(pincode);
  };

  public query func isPincodeAvailable(pincode : Text) : async Bool {
    availablePincodes.contains(pincode);
  };

  // ---- Address and Size Management ----

  public shared ({ caller }) func saveAddress(address : ShippingAddress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save addresses");
    };
    userAddresses.add(caller, address);
  };

  public query ({ caller }) func getMyAddress() : async ?ShippingAddress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their address");
    };
    userAddresses.get(caller);
  };

  public shared ({ caller }) func selectSize(size : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can select sizes");
    };
    selectedSizes.add(caller, size);
  };

  public query ({ caller }) func getSelectedSize() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their selected size");
    };
    selectedSizes.get(caller);
  };

  // ---- Admin Dashboard ----

  public query ({ caller }) func getDashboardSummary() : async { totalOrders : Nat; totalEarnings : Float; totalUsers : Nat; totalProducts : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view the dashboard");
    };
    let allOrders = Array.fromIter(orders.values());
    let totalEarnings = allOrders.foldLeft(0.0, func(acc, o) {
      acc + o.total
    });
    {
      totalOrders = allOrders.size();
      totalEarnings = totalEarnings;
      totalUsers = userProfiles.size();
      totalProducts = products.size();
    };
  };
};
