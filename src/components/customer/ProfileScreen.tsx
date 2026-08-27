import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Gift, 
  Settings, 
  HelpCircle, 
  LogOut, 
  LogIn,
  ChevronRight, 
  Store, 
  Camera, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  Edit3, 
  ShieldAlert,
  Calendar,
  Bell,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { CustomerLocationModal } from '../common/CustomerLocationModal';

export const ProfileScreen: React.FC = () => {
  const { 
    customer, 
    customerLocation,
    updateCustomerProfile, 
    uploadCustomerAvatar, 
    deleteCustomerAvatar, 
    deleteCustomerAccountPermanently, 
    setCustomerScreen, 
    setMode, 
    setBusinessScreen, 
    formatPrice, 
    bookings, 
    notifications, 
    supabaseSession, 
    signOutSupabase,
    theme,
    setTheme
  } = useApp();

  const isWhite = theme === 'white';
  const isAuthenticated = Boolean(customer.isVerified || supabaseSession?.user || (customer.id && customer.name));

  const [showEditModal, setShowEditModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editName, setEditName] = useState(customer.name || '');
  const [editPhone, setEditPhone] = useState(customer.phone || '');
  const [editEmail, setEditEmail] = useState(customer.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize edit inputs with customer
  React.useEffect(() => {
    setEditName(customer.name || '');
    setEditPhone(customer.phone || '');
    setEditEmail(customer.email || '');
  }, [customer]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      try {
        await uploadCustomerAvatar(file);
      } catch (err) {
        console.warn('Avatar upload error:', err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() === 'DELETE') {
      setIsDeletingAccount(true);
      try {
        await deleteCustomerAccountPermanently();
        setShowDeleteModal(false);
        alert('Your customer account, bookings, and uploaded avatar have been permanently deleted.');
      } catch (err: any) {
        alert('Account deletion failed: ' + (err.message || 'Error'));
      } finally {
        setIsDeletingAccount(false);
      }
    } else {
      alert('Please type "DELETE" to confirm.');
    }
  };

  const handleLogout = async () => {
    await signOutSupabase();
    setCustomerScreen('auth');
  };

  const menuItems = [
    {
      id: 'my_bookings',
      label: 'My Bookings',
      icon: Calendar,
      badge: isAuthenticated ? `${bookings.length} Appointment${bookings.length === 1 ? '' : 's'}` : undefined,
      isGoldBadge: true,
      action: () => {
        if (isAuthenticated) {
          setCustomerScreen('my_bookings', 'bookings');
        } else {
          setCustomerScreen('auth');
        }
      }
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: notifications.filter(n => !n.isRead).length > 0 ? `${notifications.filter(n => !n.isRead).length} New` : undefined,
      action: () => setCustomerScreen('notifications')
    },
    ...(isAuthenticated ? [{
      id: 'settings_appearance',
      label: 'Settings → Appearance & Phone',
      icon: Settings,
      badge: customer.phone ? customer.phone : 'Add Phone',
      isGoldBadge: !customer.phone,
      action: () => setShowEditModal(true)
    }] : []),
    {
      id: 'addresses',
      label: 'Saved Addresses',
      icon: MapPin,
      badge: customer.savedAddresses?.length ? `${customer.savedAddresses.length} Saved` : undefined,
      action: () => {
        if (!isAuthenticated) {
          setCustomerScreen('auth');
        } else if (customer.savedAddresses?.length) {
          alert(`Saved Addresses:\n${customer.savedAddresses.map((a, i) => `${i + 1}. ${a}`).join('\n')}`);
        } else {
          alert('No saved addresses yet. You can add your address when booking an appointment.');
        }
      }
    },
    {
      id: 'country_location',
      label: 'Country & Location',
      icon: Globe,
      badge: `${customerLocation?.countryName || 'UAE'} (${customerLocation?.currencyCode || 'AED'})`,
      action: () => setShowLocationModal(true)
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: CreditCard,
      badge: 'UPI & Cards',
      action: () => setCustomerScreen('wallet')
    },
    {
      id: 'wallet',
      label: 'My Wallet',
      icon: Wallet,
      badge: isAuthenticated ? formatPrice(customer.walletBalance) : undefined,
      isGoldBadge: true,
      action: () => {
        if (isAuthenticated) {
          setCustomerScreen('wallet', 'wallet');
        } else {
          setCustomerScreen('auth');
        }
      }
    },
    {
      id: 'offers',
      label: 'Special Offers & Rewards',
      icon: Gift,
      badge: 'Live Deals',
      action: () => setCustomerScreen('offers')
    },
    ...(isAuthenticated ? [{
      id: 'delete_acc',
      label: 'Delete Account Permanently',
      icon: AlertTriangle,
      isDanger: true,
      action: () => setShowDeleteModal(true)
    }] : []),
    {
      id: 'support',
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => alert('ALGO Saloon Spot 24/7 Support Hotline: 1800-ALGO-SALON\nEmail: support@algosalon.com')
    },
  ];

  return (
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <h2 className={`font-heading text-lg font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
          My Account
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowEditModal(true)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30'
            }`}
            title="Edit Profile"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* User Card: Authenticated vs Clean Guest View */}
        {isAuthenticated ? (
          <div className={`p-4 rounded-3xl border flex items-center gap-3.5 relative shadow-sm ${
            isWhite 
              ? 'bg-white border-purple-100 shadow-[0_4px_20px_rgba(126,34,206,0.08)]' 
              : 'glass-card-gilded border-gold-400/35 shadow-gold-sm'
          }`}>
            <div className="relative group">
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 p-0.5 shrink-0 flex items-center justify-center shadow-md ${
                isWhite ? 'border-purple-500 bg-purple-50' : 'border-gold-400 bg-[#12121A]'
              }`}>
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name || 'User'}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-lg ${
                    isWhite ? 'bg-purple-100 text-purple-700' : 'bg-gold-400/20 text-gold-300'
                  }`}>
                    {customer.name ? customer.name.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
                  </div>
                )}
              </div>

              {/* Camera Upload Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Upload new avatar photo"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              {customer.avatar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomerAvatar();
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md border border-black/30 z-10 transition-transform active:scale-90"
                  title="Remove avatar photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-heading text-base font-black truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {customer.name || 'Valued Customer'}
              </h3>
              {customer.phone && (
                <p className={`text-xs mt-0.5 flex items-center gap-1 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Phone className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                  <span>{customer.phone}</span>
                </p>
              )}
              {customer.email && (
                <p className={`text-[11px] truncate flex items-center gap-1 mt-0.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Mail className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                  <span>{customer.email}</span>
                </p>
              )}
              <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Customer Account</span>
              </div>
            </div>

            {/* Quick Avatar Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-xl transition-all shadow-sm border ${
                  isWhite 
                    ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' 
                    : 'bg-[#14141E] border-white/10 hover:border-gold-400/40 text-gold-300'
                }`}
                title="Upload avatar photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              {customer.avatar && (
                <button
                  onClick={deleteCustomerAvatar}
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all shadow-sm"
                  title="Remove avatar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Clean Guest Unauthenticated Card */
          <div className={`p-5 rounded-3xl border space-y-3.5 shadow-sm ${
            isWhite 
              ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' 
              : 'glass-card-obsidian border-white/10'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                isWhite ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gold-400/10 border border-gold-400/30 text-gold-300'
              }`}>
                <User className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-heading text-base font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                  Guest User
                </h3>
                <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                  Not signed in. Sign in to view and manage your appointments.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCustomerScreen('auth')}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110'
                  : 'gold-gradient-btn text-black shadow-gold-sm'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        )}

        {/* Switch to Business Partner Banner */}
        <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm ${
          isWhite 
            ? 'bg-gradient-to-r from-purple-50 via-white to-pink-50 border-purple-200' 
            : 'bg-gradient-to-r from-[#241C0E] via-[#161622] to-[#0A0A10] border-gold-400/35'
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className={`flex items-center gap-1.5 text-xs font-bold ${isWhite ? 'text-purple-900' : 'text-gold-300'}`}>
                <Store className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                <span>Salon Partner Portal</span>
              </div>
              <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
                Manage appointments, stylists, services & sales
              </p>
            </div>
            <button
              onClick={() => {
                setMode('business');
                setBusinessScreen('dashboard');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-md hover:brightness-110 active:scale-95 transition-all ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'gold-gradient-btn text-black'
              }`}
            >
              Switch Mode
            </button>
          </div>
        </div>

        {/* Menu Items List */}
        <div className={`rounded-2xl border overflow-hidden divide-y shadow-sm ${
          isWhite ? 'bg-white border-purple-100 divide-gray-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10 divide-white/5'
        }`}>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full p-3.5 flex items-center justify-between transition-colors text-left ${
                  item.isDanger
                    ? isWhite ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-500/10 text-red-400'
                    : isWhite ? 'hover:bg-purple-50 text-gray-800' : 'hover:bg-white/[0.04] text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    item.isDanger
                      ? isWhite ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : isWhite ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'bg-[#14141E] border border-white/5 text-gold-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${item.isDanger ? (isWhite ? 'text-red-600' : 'text-red-400') : (isWhite ? 'text-gray-800' : 'text-gray-200')}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.isGoldBadge
                        ? isWhite 
                          ? 'bg-purple-100 text-purple-800 border-purple-200' 
                          : 'bg-gold-400/20 text-gold-300 border border-gold-400/30'
                        : isWhite
                          ? 'bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-white/10 text-gray-300 border-white/10'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${isWhite ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout or Sign In Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isWhite 
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                : 'bg-[#251316] border-red-500/30 hover:bg-red-500/15 text-red-400'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        ) : (
          <button
            onClick={() => setCustomerScreen('auth')}
            className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isWhite 
                ? 'bg-purple-50 border border-purple-300 text-purple-700 hover:bg-purple-100' 
                : 'gold-outline-btn'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
        )}
      </div>

      {/* Settings & Appearance Modal */}
      {showEditModal && isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 ${
            isWhite ? 'bg-white border-purple-200' : 'bg-[#12121C] border-gold-400/30'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isWhite ? 'border-gray-100' : 'border-white/10'
            }`}>
              <h3 className={`font-heading font-black text-sm flex items-center gap-2 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                <Settings className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                <span>Settings & Appearance</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isWhite ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>Full Name</label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full rounded-xl pl-9 pr-3 py-2 outline-none transition-colors ${
                      isWhite 
                        ? 'bg-purple-50/50 border border-purple-200 focus:border-purple-600 text-gray-900' 
                        : 'bg-[#181826] border border-[#2B2B3E] focus:border-gold-400 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-[11px] font-bold ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>Mobile Phone Number</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setShowLocationModal(true);
                    }}
                    className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-400'}`}
                  >
                    {customerLocation?.countryName || 'UAE'} ({customerLocation?.phoneCountryCode || '+971'}) ▼
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setShowLocationModal(true);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-colors border ${
                      isWhite 
                        ? 'bg-purple-50 border-purple-200 text-purple-700' 
                        : 'bg-[#181826] border-[#2B2B3E] hover:border-gold-400 text-gold-400'
                    }`}
                    title="Change Country Dial Code"
                  >
                    {customerLocation?.phoneCountryCode || '+971'}
                  </button>
                  <div className="relative flex-1">
                    <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="50 123 4567"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 outline-none transition-colors ${
                        isWhite 
                          ? 'bg-purple-50/50 border border-purple-200 focus:border-purple-600 text-gray-900' 
                          : 'bg-[#181826] border border-[#2B2B3E] focus:border-gold-400 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full rounded-xl pl-9 pr-3 py-2 outline-none transition-colors ${
                      isWhite 
                        ? 'bg-purple-50/50 border border-purple-200 focus:border-purple-600 text-gray-900' 
                        : 'bg-[#181826] border border-[#2B2B3E] focus:border-gold-400 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Theme & Appearance (Dark vs White Mode) */}
              <div className={`pt-2 border-t ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
                <label className={`block text-[11px] font-bold mb-1.5 flex items-center gap-1.5 ${isWhite ? 'text-gray-800' : 'text-gray-300'}`}>
                  <Sparkles className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-purple-400'}`} />
                  <span>Appearance</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('white')}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      theme === 'white'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-1 ring-purple-400'
                        : isWhite 
                          ? 'border-gray-200 bg-gray-50 text-gray-600' 
                          : 'border-white/10 bg-[#161622] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚪</span>
                      <div>
                        <div className={`text-xs font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>White</div>
                        <div className="text-[10px] text-purple-700">Clean & Purple</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600">{theme === 'white' ? '◉' : '○'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      theme === 'dark'
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300 shadow-sm ring-1 ring-gold-400'
                        : isWhite 
                          ? 'border-gray-200 bg-gray-50 text-gray-600' 
                          : 'border-white/10 bg-[#161622] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌙</span>
                      <div>
                        <div className={`text-xs font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>Dark</div>
                        <div className="text-[10px] text-amber-500">Obsidian Gold</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-400">{theme === 'dark' ? '◉' : '○'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true);
                await updateCustomerProfile({
                  name: editName.trim() || customer.name,
                  phone: editPhone.trim(),
                  email: editEmail.trim() || customer.email
                });
                setIsSaving(false);
                setShowEditModal(false);
              }}
              className={`w-full py-3 rounded-xl text-xs font-bold mt-2 disabled:opacity-50 shadow-md transition-all ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
                  : 'gold-gradient-btn text-black shadow-gold-sm'
              }`}
            >
              {isSaving ? 'Saving Settings...' : 'Save Settings & Phone'}
            </button>
          </div>
        </div>
      )}

      {/* Permanent Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-xl ${
            isWhite ? 'bg-white border-red-200' : 'bg-[#14141E] border-red-500/40'
          }`}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h3 className={`font-heading font-black text-lg ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Delete Account Permanently?
              </h3>
              <p className={`text-xs mt-1 leading-relaxed font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                This action is permanent and cannot be undone. All your appointment bookings and account details will be removed.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-left text-xs ${
              isWhite ? 'bg-red-50/50 border-red-200' : 'bg-[#1C1518] border-red-500/20'
            }`}>
              <label className="block text-[11px] text-red-600 font-bold mb-1">
                Type <span className={`font-mono font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className={`w-full rounded-lg px-3 py-2 text-xs font-mono outline-none border ${
                  isWhite ? 'bg-white border-red-300 text-gray-900' : 'bg-[#121014] border-red-500/40 text-white'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`py-2.5 rounded-xl text-xs font-bold ${
                  isWhite ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/15 text-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
              >
                {isDeletingAccount ? 'Deleting Account...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Location & Country Selector Modal */}
      <CustomerLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
};

