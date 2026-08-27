import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  Phone, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  XCircle,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
  Navigation,
  ExternalLink
} from 'lucide-react';

export const BookingDetailsScreen: React.FC = () => {
  const { 
    currentBookingDetail, 
    bookings, 
    setCustomerScreen, 
    rescheduleBooking, 
    cancelBooking, 
    setMode, 
    setBusinessScreen,
    formatPrice 
  } = useApp();

  const booking = currentBookingDetail || bookings[0];

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState(() => booking?.date || new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState(() => booking?.timeSlot || '11:30 AM');
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!booking) {
    return (
      <div className="p-6 text-center text-white">
        <p>No booking found.</p>
        <button onClick={() => setCustomerScreen('my_bookings')} className="text-gold-400 mt-2 underline">
          Back to Bookings
        </button>
      </div>
    );
  }

  const isPending = booking.status === 'pending';
  const mapsUrl = booking.shopGoogleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(booking.shopAddress)}`;

  const handleConfirmReschedule = () => {
    rescheduleBooking(booking.id, newDate, newTime);
    setShowRescheduleModal(false);
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id);
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('my_bookings')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Booking Details
            </h2>
            <span className="text-[10px] text-gold-400 font-mono">
              #{booking.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isPending
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
              : booking.status === 'confirmed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : booking.status === 'completed'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {isPending ? 'Pending Acceptance' : booking.status}
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Pending Acceptance Notice Banner */}
        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Awaiting Salon Acceptance</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Your booking request has been sent to <strong>{booking.shopName}</strong> with <em>Pay at Salon</em>. Once the shop accepts your slot, you'll receive a confirmation notice.
            </p>
            <button
              onClick={() => {
                setMode('business');
                setBusinessScreen('appointments');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Test Shop Partner View & Accept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stylist Section (Faithful to Image 1) */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/40 shrink-0">
              <img
                src={booking.stylist.avatar}
                alt={booking.stylist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-white">
                {booking.stylist.name}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                {booking.stylist.role}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-bold">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>{booking.stylist.rating.toFixed(1)}</span>
                <span className="text-gray-500 font-normal">({booking.stylist.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <a
            href={`tel:${booking.customerPhone}`}
            className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Services & Bill Breakdown with Multi-Currency */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Services Booked
          </h4>

          <div className="divide-y divide-white/5">
            {booking.services.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <div>
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-gray-500 block text-[10px]">Qty: {item.quantity}</span>
                </div>
                <span className="font-semibold text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            {booking.addOns && booking.addOns.map((addon, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <span className="text-gray-300">+ {addon.name}</span>
                <span className="font-semibold text-gold-300">
                  {formatPrice(addon.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>Subtotal</span>
              <span>{formatPrice(booking.subtotal)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 text-[11px]">
                <span>Coupon Discount ({booking.couponCode})</span>
                <span>-{formatPrice(booking.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-white/5">
              <span>Total Amount Payable</span>
              <span className="text-gold-400 font-heading">
                {formatPrice(booking.totalAmount)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Payment Option</span>
            <span className="font-bold text-gold-400 uppercase">
              {booking.paymentMethod === 'pay_at_salon' ? '💵 Pay at Salon (Cash / Card)' : booking.paymentMethod}
            </span>
          </div>
        </div>

        {/* Date, Time & Google Maps Location (Faithful to User Request 2) */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Appointment Schedule & Directions
          </h4>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-gray-400 block text-[10px]">Date & Time</span>
              <span className="font-bold text-white">{booking.formattedDate} at {booking.timeSlot}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-gray-400 block text-[10px]">Salon Address</span>
              <span className="font-bold text-gold-300">{booking.shopName}</span>
              <p className="text-gray-300 text-[11px] mt-0.5 leading-tight">
                {booking.shopAddress}
              </p>
            </div>
          </div>

          {/* Direct Google Maps Driving Directions Button */}
          <div className="pt-2 border-t border-white/5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#201A0E] to-[#161622] border border-gold-400/40 hover:border-gold-400 text-gold-300 text-xs font-bold flex items-center justify-center gap-2 transition-all group shadow-sm"
            >
              <Navigation className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              <span>Open in Google Maps (Driving Directions)</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Action Buttons: Reschedule & Cancel */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="py-3 px-4 rounded-xl bg-[#181826] border border-gold-400/30 text-gold-400 hover:bg-gold-400/10 text-xs font-bold transition-colors"
            >
              Reschedule
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="py-3 px-4 rounded-xl bg-[#251214] border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-gray-400">
              Select your preferred new date and time slot.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-gray-300 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-300 mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="py-2.5 rounded-xl bg-[#1A1A28] text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="gold-gradient-btn py-2.5 rounded-xl text-xs font-bold"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-red-500/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">
              Cancel Appointment?
            </h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to cancel booking #{booking.id}?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl bg-[#1A1A28] text-gray-300 text-xs font-semibold"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
