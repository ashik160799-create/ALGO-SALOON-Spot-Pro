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
  ShieldCheck
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    customer, 
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
    signOutSupabase
  } = useApp();

  const isAuthenticated = Boolean(customer.isVerified || supabaseSession?.user || (customer.id && customer.name));

  const [showEditModal, setShowEditModal] = useState(false);
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
      id: 'edit_profile',
      label: 'Edit Profile & Avatar',
      icon: Edit3,
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
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-white">
          My Account
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowEditModal(true)}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            title="Edit Profile"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* User Card: Authenticated vs Clean Guest View */}
        {isAuthenticated ? (
          <div className="glass-card p-4 rounded-3xl border border-gold-400/30 flex items-center gap-3.5 shadow-gold-sm relative">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400 p-0.5 shrink-0 bg-[#12121A] flex items-center justify-center">
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name || 'User'}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gold-400/20 text-gold-400 rounded-full flex items-center justify-center font-bold text-lg">
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
                <Camera className="w-5 h-5 text-gold-400" />
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
              <h3 className="font-heading text-base font-bold text-white truncate">
                {customer.name || 'Valued Customer'}
              </h3>
              {customer.phone && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gold-400" />
                  <span>{customer.phone}</span>
                </p>
              )}
              {customer.email && (
                <p className="text-[11px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-gold-400" />
                  <span>{customer.email}</span>
                </p>
              )}
              <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Customer Account</span>
              </div>
            </div>

            {/* Quick Avatar Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-[#1A1A28] border border-white/10 hover:border-gold-400 text-gold-400 transition-colors"
                title="Upload avatar photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              {customer.avatar && (
                <button
                  onClick={deleteCustomerAvatar}
                  className="p-2 rounded-xl bg-[#241416] border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Remove avatar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Clean Guest Unauthenticated Card */
          <div className="glass-card p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#161622] via-[#101018] to-[#0A0A0F] space-y-3.5 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-white">
                  Guest User
                </h3>
                <p className="text-[11px] text-gray-400">
                  Not signed in. Sign in to view and manage your appointments.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCustomerScreen('auth')}
              className="gold-gradient-btn w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-sm"
            >
              <LogIn className="w-4 h-4 text-black" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        )}

        {/* Switch to Business Partner Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2A2210] to-[#151522] border border-gold-400/40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-300">
                <Store className="w-4 h-4 text-gold-400" />
                <span>Salon Partner Portal</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Manage appointments, stylists, services & sales
              </p>
            </div>
            <button
              onClick={() => {
                setMode('business');
                setBusinessScreen('dashboard');
              }}
              className="gold-gradient-btn px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-md"
            >
              Switch Mode
            </button>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full p-3.5 flex items-center justify-between transition-colors text-left ${
                  item.isDanger
                    ? 'hover:bg-red-500/10 text-red-400'
                    : 'hover:bg-white/[0.03] text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    item.isDanger
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#1A1A28] border border-white/5 text-gold-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isGoldBadge
                        ? 'bg-gold-400/20 text-gold-300 border border-gold-400/30'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout or Sign In Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-2xl bg-[#251316] border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        ) : (
          <button
            onClick={() => setCustomerScreen('auth')}
            className="w-full p-3 rounded-2xl bg-[#151522] border border-gold-400/30 hover:border-gold-400 text-gold-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4 text-gold-400" />
            <span>Sign In to Your Account</span>
          </button>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-gold-400" />
                Edit Profile Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white outline-none focus:border-gold-400"
                />
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
              className="gold-gradient-btn w-full py-2.5 rounded-xl text-xs font-bold mt-2 disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Permanent Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-red-500/40 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Delete Account Permanently?
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This action is permanent and cannot be undone. All your appointment bookings and account details will be removed.
              </p>
            </div>

            <div className="bg-[#1C1518] p-3 rounded-xl border border-red-500/20 text-left text-xs">
              <label className="block text-[11px] text-red-300 font-semibold mb-1">
                Type <span className="font-mono text-white font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#121014] border border-red-500/40 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold"
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
    </div>
  );
};

