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
    formatPrice 
  } = useApp();

  const booking = currentBookingDetail || bookings[0];

  const handleAddToCalendar = () => {
    alert(`Added Appointment #${booking?.id || 'AS123456'} to Google & Apple Calendar for ${booking?.formattedDate || '28 May 2026'}!`);
  };

  const isPending = booking?.status === 'pending';
  const mapsUrl = booking?.shopGoogleMapsUrl || (booking?.shopAddress ? `https://maps.google.com/?q=${encodeURIComponent(booking.shopAddress)}` : 'https://maps.google.com');

  return (
    <div className="min-h-full pb-20 p-5 bg-[#0A0A0F] text-white flex flex-col justify-between text-center overflow-y-auto">
      <div className="my-auto space-y-6 max-w-sm mx-auto w-full pt-4">
        {/* Animated Status Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isPending 
              ? 'bg-amber-500/10 border-2 border-amber-400 text-amber-400 shadow-amber-500/20' 
              : 'bg-emerald-500/10 border-2 border-emerald-400 text-emerald-400 shadow-emerald-500/20'
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
          <h2 className="font-heading text-2xl font-extrabold text-white">
            {isPending ? 'Booking Request Placed!' : 'Your booking is confirmed!'}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            {isPending 
              ? `Request sent to ${booking?.shopName || 'the salon'} with Pay at Salon. Waiting for shop confirmation.` 
              : 'Your grooming appointment has been confirmed with your chosen specialist.'}
          </p>
        </div>

        {/* Receipt / Booking Card (Faithful to Image 1) */}
        <div className="glass-card p-5 rounded-3xl border border-gold-400/30 text-left space-y-3.5 shadow-gold-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-gray-400">Booking ID</span>
            <span className="font-mono text-xs font-extrabold text-gold-400">
              #{booking?.id || 'AS123456'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-gold-400" />
                Service
              </span>
              <span className="font-semibold text-white text-right truncate">
                {booking?.services.map(s => s.name).join(', ') || 'Hair Cut, Beard Trim'}
                {booking?.addOns && booking.addOns.length > 0 && ` + ${booking.addOns.length} Add-ons`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-gold-400" />
                Staff
              </span>
              <span className="font-semibold text-white">
                {booking?.stylist?.name || 'Arun Stylist'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                Date & Time
              </span>
              <span className="font-semibold text-white">
                {booking?.formattedDate || '28 May 2026'}, {booking?.timeSlot || '10:00 AM'}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 pt-1">
              <span className="text-gray-400 flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                Location
              </span>
              <span className="font-semibold text-gold-300 text-right text-[11px] truncate max-w-[200px]">
                {booking?.shopName || 'Salon Branch'}
              </span>
            </div>
          </div>

          {/* Direct Google Maps Directions link */}
          <div className="pt-2 border-t border-white/5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-gold-400" />
              <span>Get Directions in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Status Badge */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">Status</span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isPending 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {isPending ? 'Pending Shop Acceptance' : 'Confirmed'}
            </span>
          </div>
        </div>

        {/* Live Partner Portal Simulation Link */}
        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">Want to test shop acceptance?</span>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Switch to the Business Portal to review and click "Accept Appointment".
              </p>
              <button
                onClick={() => {
                  setMode('business');
                  setBusinessScreen('appointments');
                }}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-black bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors"
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
          className="w-full py-3 rounded-xl bg-[#181824] hover:bg-[#202030] text-gray-200 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <CalendarPlus className="w-4 h-4 text-gold-400" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={() => setCustomerScreen('home')}
          className="gold-gradient-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-gold-sm"
        >
          Explore More Salons
        </button>
      </div>
    </div>
  );
};
