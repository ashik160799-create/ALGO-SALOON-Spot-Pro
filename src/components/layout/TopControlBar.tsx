import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerScreen, BusinessScreen } from '../../types';
import { 
  Smartphone, 
  Maximize2, 
  User, 
  Store, 
  RotateCcw, 
  Sparkles,
  Scissors,
  CheckCircle2,
  Globe,
  MapPin,
  Layers,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { CurrencySwitcherModal } from '../common/CurrencySwitcherModal';

export const TopControlBar: React.FC = () => {
  const { 
    mode, 
    setMode, 
    customerScreen,
    setCustomerScreen,
    businessScreen,
    setBusinessScreen,
    customer,
    currentBusinessShop,
    supabaseSession,
    deviceViewMode, 
    setDeviceViewMode, 
    bookings,
    currency
  } = useApp();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showScreenNav, setShowScreenNav] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const customerScreensList: { id: CustomerScreen; label: string; icon: string }[] = [
    { id: 'home', label: 'Home Page', icon: '🏠' },
    { id: 'services', label: 'Services Catalog', icon: '✂️' },
    { id: 'select_staff', label: 'Select Staff', icon: '👤' },
    { id: 'choose_datetime', label: 'Date & Time', icon: '📅' },
    { id: 'add_ons', label: 'Add-Ons', icon: '➕' },
    { id: 'cart', label: 'Cart Summary', icon: '🛒' },
    { id: 'payment', label: 'Payment Gateway', icon: '💳' },
    { id: 'booking_confirmed', label: 'Booking Confirmed', icon: '🎉' },
    { id: 'my_bookings', label: 'My Bookings', icon: '📋' },
    { id: 'booking_details', label: 'Booking Details', icon: '📄' },
    { id: 'wallet', label: 'Wallet & Credits', icon: '💰' },
    { id: 'offers', label: 'Offers & Deals', icon: '🏷️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Customer Profile', icon: '👤' },
    { id: 'splash', label: 'Splash Screen', icon: '📱' },
    { id: 'auth', label: 'Login / Register', icon: '🔐' },
  ];

  const businessScreensList: { id: BusinessScreen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Business Dashboard', icon: '📊' },
    { id: 'appointments', label: 'Appointments Manager', icon: '📅' },
    { id: 'services_mgr', label: 'Services Manager', icon: '✂️' },
    { id: 'staff_mgr', label: 'Staff & Stylists', icon: '👥' },
    { id: 'inventory', label: 'Inventory & Stock', icon: '📦' },
    { id: 'payroll', label: 'Payroll & Commissions', icon: '💵' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', label: 'Shop Settings', icon: '⚙️' },
    { id: 'register_shop', label: 'Register New Salon', icon: '🏢' },
    { id: 'auth', label: 'Partner Auth / Login', icon: '🔐' },
  ];

  const currentScreenName = mode === 'customer'
    ? (customerScreensList.find(s => s.id === customerScreen)?.label || customerScreen)
    : (businessScreensList.find(s => s.id === businessScreen)?.label || businessScreen);

  const currentScreenIcon = mode === 'customer'
    ? (customerScreensList.find(s => s.id === customerScreen)?.icon || '📱')
    : (businessScreensList.find(s => s.id === businessScreen)?.icon || '🏢');

  return (
    <header className="sticky top-0 z-50 bg-[#0D0D14]/95 backdrop-blur-md border-b border-[#242436] px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-amber via-gold-400 to-gold-600 flex items-center justify-center shadow-gold-sm">
            <Scissors className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg tracking-wider text-white">
                ALGO <span className="text-gold-400">SALOON</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gold-400/10 text-gold-400 border border-gold-400/20">
                Spot Pro
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Look Good. Feel Great. | Customer & Business Unified Platform
            </p>
          </div>
        </div>

        {/* Center: Dual Role Switcher & Screen Navigation Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#161622] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setMode('customer');
                if (customer.isVerified || supabaseSession?.user) {
                  setCustomerScreen('home');
                } else {
                  setCustomerScreen('auth');
                }
                setDeviceViewMode('mobile');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'customer' && deviceViewMode !== 'dual'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => {
                setMode('business');
                if (currentBusinessShop.isVerified && currentBusinessShop.id && currentBusinessShop.name) {
                  setBusinessScreen('dashboard');
                } else if (supabaseSession?.user) {
                  setBusinessScreen('register_shop');
                } else {
                  setBusinessScreen('auth');
                }
                setDeviceViewMode('mobile');
              }}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'business' && deviceViewMode !== 'dual'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Business Portal</span>
              {pendingCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-black bg-amber-400 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Multiple Screen Jump Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowScreenNav(!showScreenNav)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161622] hover:bg-[#1E1E2E] border border-gold-400/30 text-xs font-semibold text-white shadow-sm transition-all"
              title="Jump between multiple screens"
            >
              <Layers className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-gray-400 text-[11px] hidden md:inline">Screen:</span>
              <span className="text-gold-300 font-bold max-w-[130px] truncate flex items-center gap-1">
                <span>{currentScreenIcon}</span>
                <span>{currentScreenName}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showScreenNav ? 'rotate-180' : ''}`} />
            </button>

            {showScreenNav && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowScreenNav(false)} 
                />
                <div className="absolute top-full mt-1.5 right-0 sm:left-0 z-50 w-64 bg-[#12121B] border border-gold-400/30 rounded-2xl shadow-2xl p-2 space-y-1 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2 py-1.5 border-b border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">
                      {mode === 'customer' ? 'Customer Screens (16)' : 'Business Screens (10)'}
                    </span>
                    <span className="text-gold-400 font-bold text-[10px]">Instant Jump</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-0.5 no-scrollbar py-1">
                    {mode === 'customer' ? (
                      customerScreensList.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCustomerScreen(s.id);
                            setShowScreenNav(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                            customerScreen === s.id
                              ? 'bg-gold-400/20 text-gold-300 font-bold border border-gold-400/30'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{s.icon}</span>
                            <span>{s.label}</span>
                          </span>
                          {customerScreen === s.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                          )}
                        </button>
                      ))
                    ) : (
                      businessScreensList.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setBusinessScreen(s.id);
                            setShowScreenNav(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                            businessScreen === s.id
                              ? 'bg-gold-400/20 text-gold-300 font-bold border border-gold-400/30'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{s.icon}</span>
                            <span>{s.label}</span>
                          </span>
                          {businessScreen === s.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Currency Selector, View Modes & Reset Demo */}
        <div className="flex items-center gap-2">
          {/* Live Auto-Detected Currency Button */}
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#161622] border border-white/10 hover:border-gold-400/40 text-xs font-semibold text-white transition-colors"
            title="Country Settlement Currency"
          >
            <span className="text-sm">{currency.flag}</span>
            <span className="text-gold-400 font-bold">{currency.symbol}</span>
            <span className="text-gray-400 text-[10px] hidden sm:inline">{currency.code}</span>
          </button>

          {/* Live Request Alert Pill */}
          {pendingCount > 0 && (
            <div 
              onClick={() => {
                setMode('business');
                setBusinessScreen('appointments');
              }}
              className="cursor-pointer hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors animate-pulse"
              title="Click to view and accept pending booking requests"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{pendingCount} New Request</span>
            </div>
          )}

          {/* View Modes */}
          <div className="flex items-center bg-[#161622] rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setDeviceViewMode('mobile')}
              title="Mobile Application View"
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                deviceViewMode === 'mobile' ? 'bg-gold-400 text-black shadow-sm font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Mobile App</span>
            </button>
            <button
              onClick={() => setDeviceViewMode('fullscreen')}
              title="Full Width Screen View"
              className={`p-1.5 rounded-md transition-all ${
                deviceViewMode === 'fullscreen' ? 'bg-gold-400 text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh Database Live Data */}
          <button
            onClick={() => window.location.reload()}
            title="Refresh Real-Time Database"
            className="p-1.5 rounded-lg bg-[#161622] border border-white/10 text-gray-400 hover:text-gold-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Currency Switcher Modal */}
      <CurrencySwitcherModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />
    </header>
  );
};

