import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Bell, 
  Users, 
  Scissors, 
  UserCheck, 
  CalendarCheck, 
  DollarSign, 
  BarChart3, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Boxes,
  CreditCard,
  AlertTriangle,
  Power,
  MapPin,
  Globe,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BusinessDashboard: React.FC = () => {
  const { 
    currentBusinessShop, 
    bookings, 
    stylists, 
    services, 
    inventory,
    payrolls,
    setBusinessScreen, 
    acceptBooking, 
    rejectBooking, 
    updateShopSettings,
    setMode,
    setCustomerScreen,
    formatPrice,
    userLocation
  } = useApp();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const todayBookings = bookings.filter(b => b.status === 'confirmed');
  
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const lowStockCount = inventory.filter(i => i.stockQty <= i.minThreshold).length;
  const uniqueCustomersCount = new Set(
    bookings.map(b => b.customerPhone || b.customerName || b.customerId).filter(Boolean)
  ).size;

  const handleAccept = (id: string) => {
    acceptBooking(id);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleToggleOnline = () => {
    updateShopSettings({ isOpen: !currentBusinessShop.isOpen });
  };

  const metricCards = [
    {
      id: 'customers',
      title: 'Customers',
      count: `${uniqueCustomersCount} Customer${uniqueCustomersCount === 1 ? '' : 's'}`,
      icon: Users,
      action: () => alert(`${uniqueCustomersCount} unique customer${uniqueCustomersCount === 1 ? ' has' : 's have'} booked appointments at ${currentBusinessShop.name}`)
    },
    {
      id: 'services',
      title: 'Services',
      count: `${services.length} Services`,
      icon: Scissors,
      action: () => setBusinessScreen('services_mgr', 'services')
    },
    {
      id: 'staff',
      title: 'Staff',
      count: `${stylists.length} Stylists`,
      icon: UserCheck,
      action: () => setBusinessScreen('staff_mgr', 'staff')
    },
    {
      id: 'appointments',
      title: 'Appointments',
      count: `${todayBookings.length + pendingBookings.length} Bookings`,
      badge: pendingBookings.length > 0 ? `${pendingBookings.length} Pending` : undefined,
      icon: CalendarCheck,
      action: () => setBusinessScreen('appointments', 'appointments')
    },
    {
      id: 'inventory',
      title: 'Inventory',
      count: `${inventory.length} SKUs`,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      icon: Boxes,
      action: () => setBusinessScreen('inventory', 'inventory')
    },
    {
      id: 'payroll',
      title: 'Staff Payroll',
      count: `${payrolls.length} Active Records`,
      icon: CreditCard,
      action: () => setBusinessScreen('payroll', 'payroll')
    },
    {
      id: 'reports',
      title: 'Financial Reports',
      count: `${formatPrice(totalRevenue)} Revenue`,
      icon: BarChart3,
      action: () => setBusinessScreen('reports', 'reports')
    },
  ];

  return (
    <div className="min-h-full pb-24 bg-[#08080C] text-[#F3F4F6] font-body">
      {/* Top Header Bar with Live Location & Currency Switcher */}
      <div className="sticky top-0 z-30 bg-[#0A0A10]/95 backdrop-blur-xl px-4 py-3 border-b border-gold-400/15 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white truncate max-w-[170px]">
                {currentBusinessShop.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${currentBusinessShop.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-[10px] text-gray-400 font-medium">
                  {currentBusinessShop.isOpen ? 'Shop Online • Accepting' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Salon Permanent Settlement Currency Badge */}
            <button
              onClick={() => setBusinessScreen('settings', 'settings')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#14141E] border border-gold-400/30 text-xs font-bold text-gold-300 hover:bg-gold-400/15 transition-colors shadow-sm"
              title="Shop Settlement Currency (Tap to Edit in Settings)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{currentBusinessShop?.currencySymbol || currentBusinessShop?.currency || 'AED'}</span>
              <span className="text-gray-400 text-[10px] hidden sm:inline">({currentBusinessShop?.country || 'UAE'})</span>
            </button>

            <button
              onClick={handleToggleOnline}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentBusinessShop.isOpen
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
              title="Toggle Shop Open/Close"
            >
              <Power className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setBusinessScreen('appointments')}
              className="relative w-9 h-9 rounded-xl bg-[#14141E] border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-300 hover:border-gold-400/30 transition-all shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {pendingBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center px-1 animate-pulse shadow-sm">
                  {pendingBookings.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Business Location & Settlement Info Bar */}
        <div className="bg-[#14141E] px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px] shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">
              {currentBusinessShop.address ? `${currentBusinessShop.address}, ${currentBusinessShop.city}` : (currentBusinessShop.city || 'Downtown Dubai')}
            </span>
          </div>

          <button
            onClick={() => setBusinessScreen('settings', 'settings')}
            className="text-[10px] text-gold-300 hover:underline font-bold shrink-0 flex items-center gap-1 ml-2"
          >
            <Settings className="w-3 h-3" />
            <span>Shop Settings</span>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Salon Verification Documents Status Banner */}
        <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-sm ${
          currentBusinessShop.tradeLicenseDocumentUrl
            ? 'glass-card-obsidian border-emerald-500/30 bg-emerald-500/5'
            : 'glass-card-gilded border-amber-500/40 shadow-gold-sm'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              currentBusinessShop.tradeLicenseDocumentUrl
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentBusinessShop.tradeLicenseDocumentUrl ? 'Salon Verified & 100% Compliant' : 'Verification Documents Pending'}
                </span>
                {currentBusinessShop.tradeLicenseDocumentUrl && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold shrink-0">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                {currentBusinessShop.tradeLicenseDocumentUrl
                  ? `Shop License: ${currentBusinessShop.tradeLicenseNo || 'Attached'} • Tax/GST: ${currentBusinessShop.taxVatNo || 'Active'}`
                  : 'Upload Trade License & Tax/GST documents in Settings.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => setBusinessScreen('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 shadow-sm ${
              currentBusinessShop.tradeLicenseDocumentUrl
                ? 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10'
                : 'gold-gradient-btn text-black'
            }`}
          >
            {currentBusinessShop.tradeLicenseDocumentUrl ? 'View' : 'Upload Docs'}
          </button>
        </div>

        {/* Pending Requests Alert Banner */}
        {pendingBookings.length > 0 && (
          <div className="glass-card-gilded border border-amber-400/40 rounded-2xl p-4 shadow-gold-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h3 className="font-heading text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {pendingBookings.length} New Booking Request Waiting for Acceptance
                </h3>
              </div>
              <button
                onClick={() => setBusinessScreen('appointments')}
                className="text-[11px] text-gold-300 hover:underline font-bold"
              >
                View Queue
              </button>
            </div>

            {/* Quick Accept Card for the newest pending booking */}
            {pendingBookings.slice(0, 1).map(pb => (
              <div key={pb.id} className="bg-[#101018] p-3 rounded-xl border border-white/10 space-y-2 shadow-inner">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-white block">{pb.customerName}</span>
                    <span className="text-[10px] text-gray-400">{pb.customerPhone} • {pb.formattedDate} at {pb.timeSlot}</span>
                  </div>
                  <span className="font-extrabold text-gold-300 font-heading">
                    {formatPrice(pb.totalAmount)} (Pay at Salon)
                  </span>
                </div>

                <p className="text-[11px] text-gray-300">
                  Services: <strong>{pb.services.map(s => s.name).join(', ')}</strong> with <em>{pb.stylist.name}</em>
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleAccept(pb.id)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Appointment</span>
                  </button>

                  <button
                    onClick={() => rejectBooking(pb.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-600/30 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Revenue & Performance Overview Card */}
        <div className="relative overflow-hidden rounded-3xl glass-card-gilded border border-gold-400/40 p-5 shadow-gold-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1.5 font-heading">
              <DollarSign className="w-4 h-4 text-gold-400" />
              Total Salon Revenue ({currentBusinessShop?.currency || 'AED'})
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm">
              Live Settled
            </span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-black text-gold-300 font-heading tracking-tight">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-xs text-gray-400 ml-2 font-medium">
              from {bookings.length} appointments
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gold-400/20 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">Today's Confirmed Slots</span>
              <span className="font-bold text-white">{todayBookings.length} Bookings</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Settlement Currency</span>
              <span className="font-bold text-gold-300">{currentBusinessShop?.currency || 'AED'} ({currentBusinessShop?.currencySymbol || 'AED'})</span>
            </div>
          </div>
        </div>

        {/* 6 Grid Navigation Tiles */}
        <div>
          <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Business Management Hub
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {metricCards.map(card => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={card.action}
                  className="glass-card-obsidian p-4 rounded-2xl border border-white/10 hover:border-gold-400/40 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-28 relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#14141E] border border-white/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    {card.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-heading text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {card.count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
