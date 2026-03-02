import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  ShoppingBag, Heart, Tag, Gift, Bell, User, MapPin, CreditCard,
  LogOut, ChevronRight, Edit2, Check, X, ChevronDown, ChevronUp,
  Package, Home
} from 'lucide-react';

type ActivePanel = 'dashboard' | 'profileDetails' | 'orders' | 'wishlist' | 'coupons' | 'giftCards' | 'notifications' | 'addresses' | 'panCard';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
}

function ProfileDetailsPanel() {
  const [personalEdit, setPersonalEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [mobileEdit, setMobileEdit] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'Challa',
    lastName: 'Manohar',
    gender: 'Male',
    email: 'challa.manohar@example.com',
    phone: '9876543210',
  });
  const [tempData, setTempData] = useState<ProfileFormData>({ ...formData });

  const faqs = [
    {
      q: 'How do I change my password?',
      a: 'Visit Account Settings and click on "Change Password". Enter your current password and set a new one. You will receive a confirmation email.',
    },
    {
      q: 'How do I track my order?',
      a: 'Go to "My Orders" from the sidebar or header. Click on any order to see its current status and tracking details.',
    },
    {
      q: 'How do I update my delivery address?',
      a: 'Click on "Manage Addresses" in the Account Settings section. You can add, edit, or remove delivery addresses from there.',
    },
    {
      q: 'How do I cancel an order?',
      a: 'Orders can be cancelled within 24 hours of placement. Go to My Orders, select the order, and click "Cancel Order". Refunds are processed within 5-7 business days.',
    },
  ];

  const handlePersonalSave = () => {
    setFormData({ ...tempData });
    setPersonalEdit(false);
  };

  const handlePersonalCancel = () => {
    setTempData({ ...formData });
    setPersonalEdit(false);
  };

  const handleEmailSave = () => {
    setFormData(prev => ({ ...prev, email: tempData.email }));
    setEmailEdit(false);
  };

  const handleMobileSave = () => {
    setFormData(prev => ({ ...prev, phone: tempData.phone }));
    setMobileEdit(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

      {/* Personal Info Card */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Personal Details</h3>
          {!personalEdit ? (
            <button
              onClick={() => setPersonalEdit(true)}
              className="flex items-center gap-1 text-sm text-[#2874f0] hover:text-[#1f5bb8] font-medium"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handlePersonalSave}
                className="flex items-center gap-1 text-sm bg-[#2874f0] text-white px-3 py-1 rounded hover:bg-[#1f5bb8] transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={handlePersonalCancel}
                className="flex items-center gap-1 text-sm border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">First Name</label>
            <input
              type="text"
              value={personalEdit ? tempData.firstName : formData.firstName}
              onChange={e => setTempData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!personalEdit}
              className={`w-full px-3 py-2 border rounded text-sm transition-colors ${
                personalEdit
                  ? 'border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0]'
                  : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Last Name</label>
            <input
              type="text"
              value={personalEdit ? tempData.lastName : formData.lastName}
              onChange={e => setTempData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!personalEdit}
              className={`w-full px-3 py-2 border rounded text-sm transition-colors ${
                personalEdit
                  ? 'border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0]'
                  : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-2">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={(personalEdit ? tempData.gender : formData.gender) === g}
                    onChange={e => setTempData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!personalEdit}
                    className="accent-[#2874f0]"
                  />
                  <span className="text-sm text-gray-700">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Card */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Email Address</h3>
          {!emailEdit ? (
            <button
              onClick={() => setEmailEdit(true)}
              className="flex items-center gap-1 text-sm text-[#2874f0] hover:text-[#1f5bb8] font-medium"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleEmailSave}
                className="flex items-center gap-1 text-sm bg-[#2874f0] text-white px-3 py-1 rounded hover:bg-[#1f5bb8] transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={() => { setTempData(prev => ({ ...prev, email: formData.email })); setEmailEdit(false); }}
                className="flex items-center gap-1 text-sm border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email Address</label>
          <input
            type="email"
            value={emailEdit ? tempData.email : formData.email}
            onChange={e => setTempData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!emailEdit}
            className={`w-full max-w-sm px-3 py-2 border rounded text-sm transition-colors ${
              emailEdit
                ? 'border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0]'
                : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}
          />
        </div>
      </div>

      {/* Mobile Card */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Mobile Number</h3>
          {!mobileEdit ? (
            <button
              onClick={() => setMobileEdit(true)}
              className="flex items-center gap-1 text-sm text-[#2874f0] hover:text-[#1f5bb8] font-medium"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleMobileSave}
                className="flex items-center gap-1 text-sm bg-[#2874f0] text-white px-3 py-1 rounded hover:bg-[#1f5bb8] transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={() => { setTempData(prev => ({ ...prev, phone: formData.phone })); setMobileEdit(false); }}
                className="flex items-center gap-1 text-sm border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Mobile Number</label>
          <div className="flex max-w-sm">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l text-sm text-gray-600">+91</span>
            <input
              type="tel"
              value={mobileEdit ? tempData.phone : formData.phone}
              onChange={e => setTempData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!mobileEdit}
              className={`flex-1 px-3 py-2 border rounded-r text-sm transition-colors ${
                mobileEdit
                  ? 'border-[#2874f0] focus:outline-none focus:ring-1 focus:ring-[#2874f0]'
                  : 'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            />
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{faq.q}</span>
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

function WelcomeDashboard({ onNavigate }: { onNavigate: (panel: ActivePanel) => void }) {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome to Your Account</h2>
        <p className="text-gray-500 text-sm">Manage your orders, profile, and preferences from here.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => navigate({ to: '/my-orders', search: { category: undefined } })}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">My Orders</h3>
          </div>
          <p className="text-sm text-gray-500">Track and manage your orders</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => onNavigate('profileDetails')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">Profile Info</h3>
          </div>
          <p className="text-sm text-gray-500">Update your personal details</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">Browse Products</h3>
          </div>
          <p className="text-sm text-gray-500">Explore our product catalog</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-card border border-gray-100 p-5 cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => onNavigate('addresses')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#2874f0]" />
            </div>
            <h3 className="font-semibold text-gray-700">Addresses</h3>
          </div>
          <p className="text-sm text-gray-500">Manage delivery addresses</p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="animate-fade-in bg-white rounded-lg shadow-card border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-[#2874f0]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">This feature is coming soon. Stay tuned!</p>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');

  const username = identity?.getPrincipal().toString().slice(0, 8) ?? 'User';
  const displayName = 'Challa Manohar';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/', search: { category: undefined, search: undefined } });
  };

  const menuItems = [
    { id: 'orders' as ActivePanel, label: 'My Orders', icon: ShoppingBag, action: () => navigate({ to: '/my-orders', search: { category: undefined } }) },
    { id: 'wishlist' as ActivePanel, label: 'Wishlist', icon: Heart, badge: 0 },
    { id: 'coupons' as ActivePanel, label: 'Coupons', icon: Tag },
    { id: 'giftCards' as ActivePanel, label: 'Gift Cards', icon: Gift },
    { id: 'notifications' as ActivePanel, label: 'Notifications', icon: Bell },
  ];

  const accountItems = [
    { id: 'profileDetails' as ActivePanel, label: 'Profile Information', icon: User },
    { id: 'addresses' as ActivePanel, label: 'Manage Addresses', icon: MapPin },
    { id: 'panCard' as ActivePanel, label: 'PAN Card Information', icon: CreditCard },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return <WelcomeDashboard onNavigate={setActivePanel} />;
      case 'profileDetails':
        return <ProfileDetailsPanel />;
      case 'wishlist':
        return <PlaceholderPanel title="My Wishlist" icon={Heart} />;
      case 'coupons':
        return <PlaceholderPanel title="My Coupons" icon={Tag} />;
      case 'giftCards':
        return <PlaceholderPanel title="Gift Cards" icon={Gift} />;
      case 'notifications':
        return <PlaceholderPanel title="Notifications" icon={Bell} />;
      case 'addresses':
        return <PlaceholderPanel title="Manage Addresses" icon={MapPin} />;
      case 'panCard':
        return <PlaceholderPanel title="PAN Card Information" icon={CreditCard} />;
      default:
        return <WelcomeDashboard onNavigate={setActivePanel} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden">
              {/* User Card */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#2874f0] to-[#1f5bb8]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2874f0] font-bold text-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs opacity-80">Hello,</p>
                    <p className="text-white font-semibold text-sm">{displayName}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => item.action ? item.action() : setActivePanel(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-[#2874f0] font-semibold border-r-2 border-[#2874f0]'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2874f0]' : 'text-gray-500'}`} />
                        {item.label}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-[#2874f0] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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

                {/* Account Settings */}
                <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Account Settings</p>
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePanel(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-[#2874f0] font-semibold border-r-2 border-[#2874f0]'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2874f0]' : 'text-gray-500'}`} />
                        {item.label}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Logout */}
                <button
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
          <div className="flex-1 min-w-0">
            {renderPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}
