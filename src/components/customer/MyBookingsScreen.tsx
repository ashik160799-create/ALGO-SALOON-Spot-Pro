import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  Scissors, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Plus
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

export const MyBookingsScreen: React.FC = () => {
  const { 
    bookings, 
    setCurrentBookingDetail, 
    setCustomerScreen,
    formatPrice,
    currency 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'completed'>('upcoming');

  // Helper to check if an appointment date/time has already passed
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

  // Active upcoming bookings (future only)
  const upcomingBookings = bookings.filter(
    b => (b.status === 'confirmed' || b.status === 'in-progress') && !isBookingPast(b)
  );

  // Active pending requests (future only)
  const pendingBookings = bookings.filter(
    b => b.status === 'pending' && !isBookingPast(b)
  );

  // Past appointments (completed, cancelled, or passed date/time)
  const completedBookings = bookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled' || isBookingPast(b)
  );

  let displayBookings: Booking[] = [];
  if (activeTab === 'upcoming') displayBookings = upcomingBookings;
  else if (activeTab === 'pending') displayBookings = pendingBookings;
  else displayBookings = completedBookings;

  const handleCardClick = (booking: Booking) => {
    setCurrentBookingDetail(booking);
    setCustomerScreen('booking_details');
  };

  const getStatusBadge = (booking: Booking) => {
    const isPast = isBookingPast(booking);
    
    if (booking.status === 'pending') {
      if (isPast) {
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Expired / Slot Passed
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          Pending Acceptance
        </span>
      );
    }

    if (booking.status === 'confirmed') {
      if (isPast) {
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-300 border border-gray-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Service Done (Past)
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Confirmed
        </span>
      );
    }

    if (booking.status === 'in-progress') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          In Service
        </span>
      );
    }

    if (booking.status === 'cancelled') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
          Cancelled
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-300 border border-gray-500/30">
        Completed
      </span>
    );
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-bold text-white">
            My Appointments
          </h2>
          <button
            onClick={() => setCustomerScreen('services')}
            className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 bg-gold-400/10 border border-gold-400/20 px-2.5 py-1 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#161622] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Pending</span>
            {pendingBookings.length > 0 && (
              <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                activeTab === 'pending' ? 'bg-black text-gold-400' : 'bg-amber-400 text-black'
              }`}>
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past ({completedBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 pt-3 space-y-3">
        {displayBookings.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-3 my-6 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-300">No appointments found</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {activeTab === 'pending' 
                ? 'You have no pending requests awaiting shop acceptance.' 
                : 'Book a fresh styling appointment with top salons near you.'}
            </p>
            <button
              onClick={() => setCustomerScreen('services')}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2"
            >
              Browse Services
            </button>
          </div>
        ) : (
          displayBookings.map(booking => (
            <div
              key={booking.id}
              onClick={() => handleCardClick(booking)}
              className="glass-card p-4 rounded-2xl border border-white/10 hover:border-gold-400/40 cursor-pointer transition-all space-y-3"
            >
              {/* Header: ID + Status */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold text-gold-400">
                  #{booking.id}
                </span>
                {getStatusBadge(booking)}
              </div>

              {/* Body: Stylist, Services, Date/Time */}
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-400/30 shrink-0">
                  <img
                    src={booking.stylist.avatar}
                    alt={booking.stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Live Date & Time Highlight */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <Calendar className="w-3 h-3 text-gold-400 shrink-0" />
                      <span>{booking.formattedDate}</span>
                      <span className="text-gold-300">• {booking.timeSlot}</span>
                    </h3>
                    <span className="text-xs font-extrabold text-gold-400 shrink-0 ml-1">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300 truncate mt-0.5">
                    {booking.services.map(s => s.name).join(', ')}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                    <span className="text-gold-300 font-medium">{booking.stylist.name}</span>
                    <span>•</span>
                    <span className="truncate max-w-[140px]">{booking.shopName}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
