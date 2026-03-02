import Map "mo:core/Map";
import Text "mo:core/Text";
import Set "mo:core/Set";

module {
  type OldProductInfo = {
    id : Text;
    name : Text;
    price : Float;
    description : Text;
    sizeOptions : [Text];
    imageData : Text;
    templateImageData : Text;
    deliveryTime : Text;
    category : Text;
    dpiSettings : Nat;
  };

  type OldTemplate = {
    id : Text;
    name : Text;
    imageData : Text;
    photoSlots : Nat;
    dpiSettings : Nat;
    previewData : Text;
  };

  type OldCartItem = {
    product : OldProductInfo;
    quantity : Nat;
    selectedSize : Text;
    customImageData : Text;
  };

  type OldShippingAddress = {
    fullName : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    phone : Text;
  };

  type OldOrder = {
    orderId : Text;
    userId : Principal;
    items : [OldCartItem];
    total : Float;
    status : { #New; #Processing; #Printed; #Shipped; #Delivered };
    paymentMethod : Text;
    paymentStatus : Text;
    shippingAddress : OldShippingAddress;
    createdAt : Int;
    estimatedDelivery : Text;
    productionFileData : Text;
  };

  type OldUserProfile = {
    username : Text;
    email : Text;
    phone : Text;
    createdAt : Int;
  };

  type OldUser = {
    password : Text;
    role : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    products : Map.Map<Text, OldProductInfo>;
    templates : Map.Map<Text, OldTemplate>;
    orders : Map.Map<Text, OldOrder>;
    carts : Map.Map<Principal, [OldCartItem]>;
    payments : Map.Map<Text, Text>;
    availablePincodes : Set.Set<Text>;
    userAddresses : Map.Map<Principal, OldShippingAddress>;
    selectedSizes : Map.Map<Principal, Text>;
    users : Map.Map<Text, OldUser>;
  };

  // New types
  type NewProductInfo = {
    id : Text;
    name : Text;
    price : Float;
    description : Text;
    sizeOptions : [Text];
    imageData : Text;
    templateImageData : Text;
    deliveryTime : Text;
    category : Text;
    dpiSettings : ?Nat;
  };

  type NewTemplate = {
    id : Text;
    name : Text;
    imageData : Text;
    photoSlots : Nat;
    dpiSettings : Nat;
    previewData : Text;
  };

  type NewCartItem = {
    product : NewProductInfo;
    quantity : Nat;
    selectedSize : Text;
    customImageData : Text;
  };

  type NewShippingAddress = {
    fullName : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
    phone : Text;
  };

  type NewOrder = {
    orderId : Text;
    userId : Principal;
    items : [NewCartItem];
    total : Float;
    status : { #New; #Processing; #Printed; #Shipped; #Delivered };
    paymentMethod : Text;
    paymentStatus : Text;
    shippingAddress : NewShippingAddress;
    createdAt : Int;
    estimatedDelivery : Text;
    productionFileData : Text;
  };

  type NewUserProfile = {
    username : Text;
    email : Text;
    phone : Text;
    createdAt : Int;
  };

  type NewUser = {
    password : Text;
    role : Text;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    products : Map.Map<Text, NewProductInfo>;
    templates : Map.Map<Text, NewTemplate>;
    orders : Map.Map<Text, NewOrder>;
    carts : Map.Map<Principal, [NewCartItem]>;
    payments : Map.Map<Text, Text>;
    availablePincodes : Set.Set<Text>;
    userAddresses : Map.Map<Principal, NewShippingAddress>;
    selectedSizes : Map.Map<Principal, Text>;
    users : Map.Map<Text, NewUser>;
  };

  // Type conversion functions
  func migrateProductInfo(old : OldProductInfo) : NewProductInfo {
    {
      id = old.id;
      name = old.name;
      price = old.price;
      description = old.description;
      sizeOptions = old.sizeOptions;
      imageData = old.imageData;
      templateImageData = old.templateImageData;
      deliveryTime = old.deliveryTime;
      category = old.category;
      dpiSettings = ?(old.dpiSettings);
    };
  };

  func migrateCartItem(old : OldCartItem) : NewCartItem {
    {
      product = migrateProductInfo(old.product);
      quantity = old.quantity;
      selectedSize = old.selectedSize;
      customImageData = old.customImageData;
    };
  };

  func migrateShippingAddress(old : OldShippingAddress) : NewShippingAddress {
    {
      fullName = old.fullName;
      addressLine1 = old.addressLine1;
      addressLine2 = old.addressLine2;
      city = old.city;
      state = old.state;
      pincode = old.pincode;
      phone = old.phone;
    };
  };

  func migrateOrder(old : OldOrder) : NewOrder {
    {
      orderId = old.orderId;
      userId = old.userId;
      items = old.items.map(migrateCartItem);
      total = old.total;
      status = old.status;
      paymentMethod = old.paymentMethod;
      paymentStatus = old.paymentStatus;
      shippingAddress = migrateShippingAddress(old.shippingAddress);
      createdAt = old.createdAt;
      estimatedDelivery = old.estimatedDelivery;
      productionFileData = old.productionFileData;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProductInfo, NewProductInfo>(
      func(_id, oldProduct) { migrateProductInfo(oldProduct) }
    );

    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_id, oldOrder) { migrateOrder(oldOrder) }
    );

    let newCarts = old.carts.map<Principal, [OldCartItem], [NewCartItem]>(
      func(_id, oldCart) { oldCart.map(migrateCartItem) }
    );

    let newUserAddresses = old.userAddresses.map<Principal, OldShippingAddress, NewShippingAddress>(
      func(_id, oldAddress) { migrateShippingAddress(oldAddress) }
    );

    {
      userProfiles = old.userProfiles;
      products = newProducts;
      templates = old.templates;
      orders = newOrders;
      carts = newCarts;
      payments = old.payments;
      availablePincodes = old.availablePincodes;
      userAddresses = newUserAddresses;
      selectedSizes = old.selectedSizes;
      users = old.users;
    };
  };
};
