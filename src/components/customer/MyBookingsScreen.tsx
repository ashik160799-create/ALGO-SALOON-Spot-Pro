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
    currency,
    theme
  } = useApp();

  const isWhite = theme === 'white';

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
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-300 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Expired / Slot Passed
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-300 flex items-center gap-1 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          Pending Acceptance
        </span>
      );
    }

    if (booking.status === 'confirmed') {
      if (isPast) {
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300 border border-gray-300 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Service Done (Past)
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Confirmed
        </span>
      );
    }

    if (booking.status === 'in-progress') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-300 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          In Service
        </span>
      );
    }

    if (booking.status === 'cancelled') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-300">
          Cancelled
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300 border border-gray-300">
        Completed
      </span>
    );
  };

  return (
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 pt-3 pb-2.5 shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-heading text-lg font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            My Appointments
          </h2>
          <button
            onClick={() => setCustomerScreen('services')}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-all shadow-sm ${
              isWhite 
                ? 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200' 
                : 'text-gold-300 hover:text-gold-200 bg-gold-400/15 border border-gold-400/30'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex p-1 rounded-2xl border shadow-inner ${
          isWhite ? 'bg-gray-100 border-purple-100' : 'bg-[#14141E] border-white/10'
        }`}>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn text-black shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pending'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn text-black shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Pending</span>
            {pendingBookings.length > 0 && (
              <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-sm ${
                activeTab === 'pending' ? 'bg-white text-purple-700' : 'bg-amber-400 text-black'
              }`}>
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn text-black shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
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
          <div className={`p-8 rounded-3xl text-center space-y-3 my-6 border ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm border ${
              isWhite ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gold-400/10 border border-gold-400/20 text-gold-400'
            }`}>
              <Calendar className="w-6 h-6" />
            </div>
            <p className={`text-sm font-black ${isWhite ? 'text-gray-900' : 'text-gray-300'}`}>No appointments found</p>
            <p className={`text-xs max-w-xs mx-auto font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              {activeTab === 'pending' 
                ? 'You have no pending requests awaiting shop acceptance.' 
                : 'Book a fresh styling appointment with top salons near you.'}
            </p>
            <button
              onClick={() => setCustomerScreen('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2 transition-all ${
                isWhite 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                  : 'gold-gradient-btn text-black'
              }`}
            >
              Browse Services
            </button>
          </div>
        ) : (
          displayBookings.map(booking => (
            <div
              key={booking.id}
              onClick={() => handleCardClick(booking)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 shadow-sm group ${
                isWhite 
                  ? 'bg-white border-purple-100 hover:border-purple-300 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' 
                  : 'glass-card-obsidian border-white/10 hover:border-gold-400/40'
              }`}
            >
              {/* Header: ID + Status */}
              <div className={`flex items-center justify-between pb-2 border-b ${
                isWhite ? 'border-gray-100' : 'border-white/10'
              }`}>
                <span className={`font-mono text-xs font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                  #{booking.id}
                </span>
                {getStatusBadge(booking)}
              </div>

              {/* Body: Stylist, Services, Date/Time */}
              <div className="flex gap-3 items-center">
                <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm border ${
                  isWhite ? 'border-purple-200' : 'border-gold-400/30'
                }`}>
                  <img
                    src={booking.stylist.avatar}
                    alt={booking.stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Live Date & Time Highlight */}
                  <div className="flex items-center justify-between">
                    <h3 className={`font-heading text-xs font-black flex items-center gap-1.5 truncate transition-colors ${
                      isWhite ? 'text-gray-900 group-hover:text-purple-700' : 'text-white group-hover:text-gold-300'
                    }`}>
                      <Calendar className={`w-3 h-3 shrink-0 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                      <span>{booking.formattedDate}</span>
                      <span className={`font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>• {booking.timeSlot}</span>
                    </h3>
                    <span className={`text-xs font-black shrink-0 ml-1 ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>

                  <p className={`text-[11px] truncate mt-0.5 font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                    {booking.services.map(s => s.name).join(', ')}
                  </p>

                  <div className={`flex items-center gap-2 mt-1 text-[10px] font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className={`font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>{booking.stylist.name}</span>
                    <span>•</span>
                    <span className="truncate max-w-[140px]">{booking.shopName}</span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-all shrink-0 ${
                  isWhite ? 'text-purple-600' : 'text-gray-400 group-hover:text-gold-300'
                }`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
