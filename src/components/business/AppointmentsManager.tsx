import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Scissors, 
  Sparkles, 
  DollarSign, 
  Filter, 
  AlertCircle,
  Check,
  Send,
  Navigation
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';
import confetti from 'canvas-confetti';

export const AppointmentsManager: React.FC = () => {
  const { 
    bookings, 
    acceptBooking, 
    rejectBooking, 
    completeBooking, 
    setBusinessScreen,
    formatPrice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedBookingForReject, setSelectedBookingForReject] = useState<string | null>(null);

  // Helper to check if an appointment slot has elapsed
  const isBookingPast = (booking: Booking): boolean => {
    if (!booking.date) return false;
    try {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (booking.date < todayStr) return true;
      if (booking.date === todayStr && booking.timeSlot) {
        const match = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let hours = parseInt(match[1], 10);
          const mins = parseInt(match[2], 10);
          const ampm = match[3].toUpperCase();
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          const bookingTime = new Date();
          bookingTime.setHours(hours, mins, 0, 0);
          return bookingTime.getTime() < today.getTime();
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending' && !isBookingPast(b));
  const confirmedBookings = bookings.filter(b => (b.status === 'confirmed' || b.status === 'in-progress') && !isBookingPast(b));
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || isBookingPast(b));

  const handleAccept = (bookingId: string) => {
    acceptBooking(bookingId);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleRejectSubmit = (bookingId: string) => {
    rejectBooking(bookingId, rejectReason || 'Stylist unavailable at requested time');
    setSelectedBookingForReject(null);
    setRejectReason('');
  };

  const handleComplete = (bookingId: string) => {
    completeBooking(bookingId);
  };

  return (
    <div className="min-h-full pb-24 bg-[#08080C] text-[#F3F4F6] font-body">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A10]/95 backdrop-blur-xl px-4 py-3 border-b border-gold-400/15 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#14141E] border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-300 hover:border-gold-400/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Appointment Manager
            </h2>
            <p className="text-[10px] text-gold-300 font-semibold">Accept & Manage Client Queue</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Tab Switcher */}
        <div className="flex bg-[#14141E] p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pending'
                ? 'gold-gradient-btn'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Pending Requests</span>
            {pendingBookings.length > 0 && (
              <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-sm ${
                activeTab === 'pending' ? 'bg-black text-gold-300' : 'bg-amber-400 text-black animate-pulse'
              }`}>
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('confirmed')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'confirmed'
                ? 'gold-gradient-btn'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Confirmed ({confirmedBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'gold-gradient-btn'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completed ({completedBookings.length})
          </button>
        </div>

        {/* Tab 1: Pending Requests Queue (Core Feature) */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingBookings.length === 0 ? (
              <div className="glass-card p-8 rounded-3xl text-center space-y-2 border border-white/5 my-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white">All Caught Up!</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  No new pending appointment requests at this moment. Customers booking with "Pay at Salon" will show up here instantly.
                </p>
              </div>
            ) : (
              pendingBookings.map(booking => (
                <div
                  key={booking.id}
                  className="bg-gradient-to-br from-[#261E10] via-[#1A1822] to-[#12121A] p-4 rounded-2xl border border-amber-400/40 shadow-gold-sm space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-gold-400">
                        #{booking.id}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-black animate-pulse">
                        Pay at Salon Request
                      </span>
                    </div>
                    <span className="text-xs font-black text-gold-300 font-heading">
                      Collect {formatPrice(booking.totalAmount)}
                    </span>
                  </div>

                  {/* Customer & Stylist Info */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <User className="w-3.5 h-3.5 text-gold-400" />
                        <span>{booking.customerName}</span>
                      </div>
                      <a
                        href={`tel:${booking.customerPhone}`}
                        className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 hover:text-gold-300"
                      >
                        <Phone className="w-3 h-3 text-gray-500" />
                        {booking.customerPhone}
                      </a>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Requested Stylist</span>
                      <span className="font-bold text-gold-300">{booking.stylist.name}</span>
                    </div>
                  </div>

                  {/* Live Schedule Date & Time */}
                  <div className="bg-[#12121B] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{booking.formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gold-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="text-xs text-gray-300">
                    <span className="text-gray-500 text-[10px] block">Requested Services:</span>
                    <span className="font-medium text-white">
                      {booking.services.map(s => s.name).join(', ')}
                    </span>
                    {booking.addOns && booking.addOns.length > 0 && (
                      <span className="text-gold-300 block text-[11px] mt-0.5">
                        + Addons: {booking.addOns.map(a => a.name).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Accept / Reject Buttons */}
                  {selectedBookingForReject === booking.id ? (
                    <div className="pt-2 space-y-2">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason (e.g. Stylist busy, please pick 3 PM)"
                        className="w-full bg-[#181824] border border-red-500/40 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBookingForReject(null)}
                          className="flex-1 py-1.5 rounded-lg bg-[#181824] text-gray-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectSubmit(booking.id)}
                          className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                        >
                          Send Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => setSelectedBookingForReject(booking.id)}
                        className="py-2.5 rounded-xl bg-[#251315] hover:bg-[#301619] border border-red-500/30 text-red-400 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="gold-gradient-btn py-2.5 rounded-xl text-xs font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-black font-bold" />
                        <span>Accept Appointment</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Confirmed Appointments */}
        {activeTab === 'confirmed' && (
          <div className="space-y-3">
            {confirmedBookings.length === 0 ? (
              <div className="glass-card p-6 text-center text-xs text-gray-400">
                No active confirmed appointments.
              </div>
            ) : (
              confirmedBookings.map(booking => (
                <div
                  key={booking.id}
                  className="glass-card p-4 rounded-2xl border border-emerald-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-mono text-xs font-bold text-gold-400">
                      #{booking.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Confirmed Slot
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{booking.customerName}</span>
                      <span className="text-gray-400 text-[11px]">{booking.customerPhone}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">{formatPrice(booking.totalAmount)}</span>
                      <span className="text-gray-500 text-[10px]">{booking.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="bg-[#12121B] p-2 rounded-xl border border-white/5 flex items-center justify-between text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-400" />
                      {booking.formattedDate}
                    </span>
                    <span className="flex items-center gap-1 text-gold-400 font-semibold">
                      <Clock className="w-3 h-3" />
                      {booking.timeSlot}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="flex-1 py-2 rounded-xl bg-[#181824] border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-400" />
                      <span>Call Client</span>
                    </a>

                    <button
                      onClick={() => handleComplete(booking.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Completed / History */}
        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedBookings.length === 0 ? (
              <div className="glass-card p-6 text-center text-xs text-gray-400">
                No past appointments yet.
              </div>
            ) : (
              completedBookings.map(booking => (
                <div
                  key={booking.id}
                  className="glass-card p-3.5 rounded-2xl border border-white/5 space-y-2 opacity-80"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-400">#{booking.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      booking.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-300">
                    <span>{booking.customerName} • {booking.formattedDate}</span>
                    <span className="font-bold text-white">{formatPrice(booking.totalAmount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
