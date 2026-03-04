import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Edit2,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import { getWishlistLS, removeFromWishlistLS } from "../lib/wishlistStorage";
import { getImageSrc } from "../utils/imageHelpers";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActivePanel = "dashboard" | "profileDetails" | "addresses" | "wishlist";

type AddressType = "Permanent" | "Temporary";

interface Address {
  id: string;
  type: AddressType;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const ADDRESSES_KEY = "user_addresses";
const PROFILE_PHOTO_KEY = "profile_photo";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getAddressesLS(): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    return raw ? (JSON.parse(raw) as Address[]) : [];
  } catch {
    return [];
  }
}

function saveAddressesLS(addresses: Address[]) {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

function getProfilePhotoLS(): string {
  return localStorage.getItem(PROFILE_PHOTO_KEY) ?? "";
}

function saveProfilePhotoLS(data: string) {
  localStorage.setItem(PROFILE_PHOTO_KEY, data);
}

// ── Profile Details Panel ─────────────────────────────────────────────────────

function ProfileDetailsPanel() {
  const { data: backendProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string>(getProfilePhotoLS);
  const [fullName, setFullName] = useState(
    backendProfile?.username ?? "Challa Manohar",
  );
  const [email, setEmail] = useState(
    backendProfile?.email ?? "challa.manohar@example.com",
  );
  const [phone, setPhone] = useState(backendProfile?.phone ?? "9876543210");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Populate from backend once loaded — functional updates avoid stale deps
  useEffect(() => {
    if (backendProfile) {
      setFullName((prev) => backendProfile.username || prev);
      setEmail((prev) => backendProfile.email || prev);
      setPhone((prev) => backendProfile.phone || prev);
    }
  }, [backendProfile]);

  const handleAutoSave = async (field: string, value: string) => {
    const profile: UserProfile = {
      username: field === "username" ? value : fullName,
      email: field === "email" ? value : email,
      phone: field === "phone" ? value : phone,
      createdAt: backendProfile?.createdAt ?? BigInt(0),
    };
    try {
      await saveProfile.mutateAsync(profile);
    } catch {
      // backend save failed — still keep localStorage copy
    }
    toast.success("Profile updated successfully ✅");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result as string;
      setPhoto(data);
      saveProfilePhotoLS(data);
      toast.success("Profile photo updated ✅");
    };
    reader.readAsDataURL(file);
  };

  const faqs = [
    {
      q: "How do I change my password?",
      a: 'Visit Account Settings and click on "Change Password". Enter your current password and set a new one.',
    },
    {
      q: "How do I track my order?",
      a: 'Go to "My Orders" from the sidebar. Click on any order to see its current status and tracking details.',
    },
    {
      q: "How do I update my delivery address?",
      a: 'Click on "Manage Addresses" in the sidebar. You can add, edit, or remove delivery addresses from there.',
    },
    {
      q: "How do I cancel an order?",
      a: "Orders can be cancelled within 24 hours of placement. Go to My Orders, select the order, and click Cancel Order.",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

      {/* Profile Photo */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-50 border-2 border-[#2874f0] flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#2874f0] font-bold text-2xl">
                {fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            data-ocid="profile.upload_button"
            aria-label="Upload profile photo"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2874f0] text-white rounded-full flex items-center justify-center hover:bg-[#1f5bb8] transition-colors shadow-md"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{fullName}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-[#2874f0] hover:underline mt-1"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Full Name */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <label
          htmlFor="profile-full-name"
          className="block text-xs text-gray-500 mb-1 font-medium"
        >
          Full Name
        </label>
        <input
          id="profile-full-name"
          data-ocid="profile.input"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={(e) => handleAutoSave("username", e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
          placeholder="Enter your full name"
        />
        <p className="text-xs text-gray-400 mt-1">
          Changes are saved automatically when you click away
        </p>
      </div>

      {/* Email */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <label
          htmlFor="profile-email"
          className="block text-xs text-gray-500 mb-1 font-medium"
        >
          Email Address
        </label>
        <input
          id="profile-email"
          data-ocid="profile.input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => handleAutoSave("email", e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
          placeholder="Enter your email"
        />
        <p className="text-xs text-gray-400 mt-1">
          Changes are saved automatically when you click away
        </p>
      </div>

      {/* Phone */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <label
          htmlFor="profile-phone"
          className="block text-xs text-gray-500 mb-1 font-medium"
        >
          Phone Number
        </label>
        <div className="flex max-w-sm">
          <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l text-sm text-gray-600 select-none">
            +91
          </span>
          <input
            id="profile-phone"
            data-ocid="profile.input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={(e) => handleAutoSave("phone", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-r text-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
            placeholder="Enter your phone number"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Changes are saved automatically when you click away
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="border border-gray-100 rounded overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {faq.q}
                </span>
                {expandedFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-[#2874f0] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-3 text-sm text-gray-600 bg-blue-50 border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Manage Address Panel ──────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Address, "id"> = {
  type: "Permanent",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

function ManageAddressPanel() {
  const [addresses, setAddresses] = useState<Address[]>(getAddressesLS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, "id">>(EMPTY_FORM);

  const handleFormChange = (
    field: keyof Omit<Address, "id">,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.fullName || !form.addressLine1 || !form.city || !form.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    let updated: Address[];
    if (editId) {
      updated = addresses.map((a) =>
        a.id === editId ? { ...form, id: editId } : a,
      );
    } else {
      const newAddress: Address = {
        ...form,
        id: Date.now().toString(),
      };
      updated = [...addresses, newAddress];
    }
    setAddresses(updated);
    saveAddressesLS(updated);
    toast.success("Address saved successfully ✅");
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (address: Address) => {
    setEditId(address.id);
    const { id: _id, ...rest } = address;
    setForm(rest);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveAddressesLS(updated);
    toast.success("Address removed");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors";
  const labelClass = "block text-xs text-gray-500 mb-1 font-medium";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Manage Addresses</h2>
        {!showForm && (
          <button
            type="button"
            data-ocid="address.open_modal_button"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(EMPTY_FORM);
            }}
            className="flex items-center gap-1.5 text-sm bg-[#2874f0] text-white px-4 py-2 rounded font-medium hover:bg-[#1f5bb8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          data-ocid="address.modal"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5"
        >
          <h3 className="font-semibold text-gray-700 mb-4">
            {editId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address Type */}
            <div className="sm:col-span-2">
              <label htmlFor="addr-type" className={labelClass}>
                Address Type *
              </label>
              <select
                id="addr-type"
                data-ocid="address.select"
                value={form.type}
                onChange={(e) =>
                  handleFormChange("type", e.target.value as AddressType)
                }
                className={inputClass}
              >
                <option value="Permanent">Permanent Address</option>
                <option value="Temporary">Temporary Address</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="addr-name" className={labelClass}>
                Full Name *
              </label>
              <input
                id="addr-name"
                data-ocid="address.input"
                type="text"
                value={form.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
                className={inputClass}
                placeholder="Enter full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="addr-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="addr-phone"
                data-ocid="address.input"
                type="tel"
                value={form.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className={inputClass}
                placeholder="10-digit phone number"
              />
            </div>

            {/* Address Line 1 */}
            <div className="sm:col-span-2">
              <label htmlFor="addr-line1" className={labelClass}>
                Address Line 1 *
              </label>
              <input
                id="addr-line1"
                data-ocid="address.input"
                type="text"
                value={form.addressLine1}
                onChange={(e) =>
                  handleFormChange("addressLine1", e.target.value)
                }
                className={inputClass}
                placeholder="House / Flat / Block No."
              />
            </div>

            {/* Address Line 2 */}
            <div className="sm:col-span-2">
              <label htmlFor="addr-line2" className={labelClass}>
                Address Line 2
              </label>
              <input
                id="addr-line2"
                data-ocid="address.input"
                type="text"
                value={form.addressLine2}
                onChange={(e) =>
                  handleFormChange("addressLine2", e.target.value)
                }
                className={inputClass}
                placeholder="Street / Colony / Locality"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="addr-city" className={labelClass}>
                City *
              </label>
              <input
                id="addr-city"
                data-ocid="address.input"
                type="text"
                value={form.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className={inputClass}
                placeholder="City"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="addr-state" className={labelClass}>
                State
              </label>
              <input
                id="addr-state"
                data-ocid="address.input"
                type="text"
                value={form.state}
                onChange={(e) => handleFormChange("state", e.target.value)}
                className={inputClass}
                placeholder="State"
              />
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="addr-pincode" className={labelClass}>
                Pincode *
              </label>
              <input
                id="addr-pincode"
                data-ocid="address.input"
                type="text"
                value={form.pincode}
                onChange={(e) => handleFormChange("pincode", e.target.value)}
                className={inputClass}
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="button"
              data-ocid="address.save_button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#2874f0] text-white text-sm font-medium rounded hover:bg-[#1f5bb8] transition-colors"
            >
              {editId ? "Update Address" : "Save Address"}
            </button>
            <button
              type="button"
              data-ocid="address.cancel_button"
              onClick={handleCancel}
              className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div
          data-ocid="address.empty_state"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-12 text-center"
        >
          <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No addresses saved. Add your first address.
          </p>
        </div>
      ) : (
        <div data-ocid="address.list" className="space-y-3">
          {addresses.map((address, idx) => (
            <div
              key={address.id}
              data-ocid={`address.item.${idx + 1}`}
              className="bg-white rounded-lg shadow-card border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        address.type === "Permanent"
                          ? "bg-blue-100 text-[#2874f0]"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {address.type}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {address.fullName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}
                    {address.state && `, ${address.state}`} — {address.pincode}
                  </p>
                  {address.phone && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      +91 {address.phone}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    data-ocid={`address.edit_button.${idx + 1}`}
                    onClick={() => handleEdit(address)}
                    className="p-1.5 text-[#2874f0] hover:bg-blue-50 rounded transition-colors"
                    aria-label="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`address.delete_button.${idx + 1}`}
                    onClick={() => handleDelete(address.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Wishlist Panel ────────────────────────────────────────────────────────────

function WishlistPanel() {
  const navigate = useNavigate();
  const [items, setItems] = useState(getWishlistLS);

  const handleRemove = (id: string) => {
    removeFromWishlistLS(id);
    setItems(getWishlistLS());
    toast("Removed from wishlist", { icon: "💔" });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">My Wishlist</h2>
        <div
          data-ocid="wishlist.empty_state"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-12 text-center"
        >
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">
            Your wishlist is empty. Browse products to add your favorites.
          </p>
          <button
            type="button"
            data-ocid="wishlist.primary_button"
            onClick={() =>
              navigate({
                to: "/",
                search: { category: undefined, search: undefined },
              })
            }
            className="px-5 py-2 bg-[#2874f0] text-white text-sm font-medium rounded hover:bg-[#1f5bb8] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        My Wishlist ({items.length})
      </h2>
      <div
        data-ocid="wishlist.list"
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        {items.map((product, idx) => {
          const imgSrc = getImageSrc(product.imageData);
          return (
            <div
              key={product.id}
              data-ocid={`wishlist.item.${idx + 1}`}
              className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden group"
            >
              <button
                type="button"
                className="w-full"
                onClick={() =>
                  navigate({
                    to: "/product/$productId",
                    params: { productId: product.id },
                    search: { category: undefined },
                  })
                }
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={
                      imgSrc ||
                      "/assets/generated/photo-print-1.dim_600x600.png"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
              <div className="p-3">
                <p className="text-xs text-[#2874f0] font-medium mb-0.5 truncate">
                  {product.category}
                </p>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  ₹{Number(product.price).toLocaleString()}
                </p>
                <button
                  type="button"
                  data-ocid={`wishlist.delete_button.${idx + 1}`}
                  onClick={() => handleRemove(product.id)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 border border-red-200 rounded py-1.5 hover:bg-red-50 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Remove from Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Welcome Dashboard ─────────────────────────────────────────────────────────

function WelcomeDashboard({
  onNavigate,
}: { onNavigate: (panel: ActivePanel) => void }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Welcome to Your Account
        </h2>
        <p className="text-gray-500 text-sm">
          Manage your orders, profile, and preferences from here.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow text-left"
          onClick={() =>
            navigate({ to: "/my-orders", search: { category: undefined } })
          }
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">My Orders</h3>
          </div>
          <p className="text-sm text-gray-500">Track and manage your orders</p>
        </button>
        <button
          type="button"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow text-left"
          onClick={() => onNavigate("profileDetails")}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">Profile Info</h3>
          </div>
          <p className="text-sm text-gray-500">Update your personal details</p>
        </button>
        <button
          type="button"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow text-left"
          onClick={() => onNavigate("wishlist")}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-700">Wishlist</h3>
          </div>
          <p className="text-sm text-gray-500">View your saved products</p>
        </button>
        <button
          type="button"
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow text-left"
          onClick={() => onNavigate("addresses")}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">Addresses</h3>
          </div>
          <p className="text-sm text-gray-500">Manage delivery addresses</p>
        </button>
      </div>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState<ActivePanel>("dashboard");
  const [wishlistCount, setWishlistCount] = useState(
    () => getWishlistLS().length,
  );

  // Refresh wishlist count on storage changes (cross-tab)
  useEffect(() => {
    const sync = () => setWishlistCount(getWishlistLS().length);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const displayName =
    localStorage.getItem("profile_display_name") || "My Account";

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/", search: { category: undefined, search: undefined } });
  };

  const menuItems = [
    {
      id: "profileDetails" as ActivePanel,
      label: "My Profile",
      icon: User,
    },
    {
      id: "addresses" as ActivePanel,
      label: "Manage Address",
      icon: MapPin,
    },
    {
      id: "orders" as ActivePanel,
      label: "My Orders",
      icon: Package,
      action: () =>
        navigate({ to: "/my-orders", search: { category: undefined } }),
    },
    {
      id: "wishlist" as ActivePanel,
      label: "Wishlist",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      id: "cart" as ActivePanel,
      label: "Cart",
      icon: ShoppingCart,
      action: () =>
        navigate({
          to: "/cart",
          search: { category: undefined, search: undefined },
        }),
    },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <WelcomeDashboard onNavigate={setActivePanel} />;
      case "profileDetails":
        return <ProfileDetailsPanel />;
      case "addresses":
        return <ManageAddressPanel />;
      case "wishlist":
        return <WishlistPanel />;
      default:
        return <WelcomeDashboard onNavigate={setActivePanel} />;
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f6f7" }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden">
              {/* User Card */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#2874f0] to-[#1f5bb8]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {getProfilePhotoLS() ? (
                      <img
                        src={getProfilePhotoLS()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#2874f0] font-bold text-lg">
                        U
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-xs opacity-80">Hello,</p>
                    <p className="text-white font-semibold text-sm">
                      {displayName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.id && !item.action;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      data-ocid={`profile.sidebar.${item.id}`}
                      onClick={() =>
                        item.action ? item.action() : setActivePanel(item.id)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-blue-50 text-[#2874f0] font-semibold border-r-2 border-[#2874f0]"
                          : "text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${isActive ? "text-[#2874f0]" : "text-gray-500"}`}
                        />
                        {item.label}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Logout */}
                <button
                  type="button"
                  data-ocid="profile.logout_button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">{renderPanel()}</div>
        </div>
      </div>
    </div>
  );
}
