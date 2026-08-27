import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Scissors, 
  Share2, 
  CalendarPlus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const BookingConfirmedScreen: React.FC = () => {
  const { 
    currentBookingDetail, 
    bookings, 
    setCustomerScreen, 
    setMode, 
    setBusinessScreen,
    formatPrice,
    theme
  } = useApp();

  const isWhite = theme === 'white';
  const booking = currentBookingDetail || bookings[0];

  const handleAddToCalendar = () => {
    alert(`Added Appointment #${booking?.id || 'AS123456'} to Google & Apple Calendar for ${booking?.formattedDate || '28 May 2026'}!`);
  };

  const isPending = booking?.status === 'pending';
  const mapsUrl = booking?.shopGoogleMapsUrl || (booking?.shopAddress ? `https://maps.google.com/?q=${encodeURIComponent(booking.shopAddress)}` : 'https://maps.google.com');

  return (
    <div className={`min-h-full pb-20 p-5 font-body flex flex-col justify-between text-center overflow-y-auto transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      <div className="my-auto space-y-6 max-w-sm mx-auto w-full pt-4">
        {/* Animated Status Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isPending 
              ? 'bg-amber-500/15 border-2 border-amber-400 text-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.25)]' 
              : 'bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
          } shadow-xl animate-bounce`}>
            {isPending ? (
              <Clock className="w-12 h-12" />
            ) : (
              <CheckCircle2 className="w-12 h-12" />
            )}
          </div>
          <div className={`absolute -inset-2 rounded-full ${
            isPending ? 'bg-amber-400/20' : 'bg-emerald-400/20'
          } blur-xl -z-10`} />
        </div>

        {/* Title & Tagline */}
        <div>
          <h2 className={`font-heading text-2xl font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            {isPending ? 'Booking Request Placed!' : 'Your booking is confirmed!'}
          </h2>
          <p className={`text-xs mt-1 max-w-xs mx-auto font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            {isPending 
              ? `Request sent to ${booking?.shopName || 'the salon'} with Pay at Salon. Waiting for shop confirmation.` 
              : 'Your grooming appointment has been confirmed with your chosen specialist.'}
          </p>
        </div>

        {/* Receipt / Booking Card */}
        <div className={`p-5 rounded-3xl border text-left space-y-3.5 shadow-sm ${
          isWhite 
            ? 'bg-white border-purple-100 shadow-[0_4px_20px_rgba(126,34,206,0.08)]' 
            : 'glass-card-gilded border-gold-400/35 shadow-gold-sm'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isWhite ? 'border-gray-100' : 'border-gold-400/20'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Booking ID</span>
            <span className={`font-mono text-xs font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
              #{booking?.id || 'AS123456'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className={`flex items-center gap-1.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                <Scissors className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Service
              </span>
              <span className={`font-bold text-right truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {booking?.services.map(s => s.name).join(', ') || 'Hair Cut, Beard Trim'}
                {booking?.addOns && booking.addOns.length > 0 && ` + ${booking.addOns.length} Add-ons`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className={`flex items-center gap-1.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                <UserCheck className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Staff
              </span>
              <span className={`font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {booking?.stylist?.name || 'Arun Stylist'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className={`flex items-center gap-1.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                <Calendar className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Date & Time
              </span>
              <span className={`font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {booking?.formattedDate || '28 May 2026'}, {booking?.timeSlot || '10:00 AM'}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 pt-1">
              <span className={`flex items-center gap-1.5 shrink-0 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                <MapPin className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Location
              </span>
              <span className={`font-bold text-right text-[11px] truncate max-w-[200px] ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                {booking?.shopName || 'Salon Branch'}
              </span>
            </div>
          </div>

          {/* Direct Google Maps Directions link */}
          <div className={`pt-2 border-t ${isWhite ? 'border-gray-100' : 'border-gold-400/20'}`}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                isWhite 
                  ? 'bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700' 
                  : 'bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-300'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
              <span>Get Directions in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Status Badge */}
          <div className={`pt-2 border-t flex items-center justify-between ${isWhite ? 'border-gray-100' : 'border-gold-400/20'}`}>
            <span className={`text-xs font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Status</span>
            <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isPending 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 animate-pulse' 
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300'
            }`}>
              {isPending ? 'Pending Shop Acceptance' : 'Confirmed'}
            </span>
          </div>
        </div>

        {/* Live Partner Portal Simulation Link */}
        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-left flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-300 block">Want to test shop acceptance?</span>
              <p className={`text-[11px] mt-0.5 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                Switch to the Business Portal to review and click "Accept Appointment".
              </p>
              <button
                onClick={() => {
                  setMode('business');
                  setBusinessScreen('appointments');
                }}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-black bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
              >
                <span>Open Shop Dashboard to Accept</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2.5 max-w-sm mx-auto w-full pt-4">
        <button
          onClick={handleAddToCalendar}
          className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
            isWhite 
              ? 'bg-white hover:bg-purple-50 text-gray-800 border border-purple-200' 
              : 'bg-[#14141E] hover:bg-[#1A1A28] text-gray-200 border border-white/10 hover:border-gold-400/30'
          }`}
        >
          <CalendarPlus className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={() => setCustomerScreen('home')}
          className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all ${
            isWhite
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
              : 'gold-gradient-btn text-black shadow-gold-sm'
          }`}
        >
          Explore More Salons
        </button>
      </div>
    </div>
  );
};
