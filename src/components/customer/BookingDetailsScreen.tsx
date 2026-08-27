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
    formatPrice,
    theme
  } = useApp();

  const isWhite = theme === 'white';
  const booking = currentBookingDetail || bookings[0];

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState(() => booking?.date || new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState(() => booking?.timeSlot || '11:30 AM');
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!booking) {
    return (
      <div className={`p-6 text-center ${isWhite ? 'text-gray-900' : 'text-white'}`}>
        <p>No booking found.</p>
        <button onClick={() => setCustomerScreen('my_bookings')} className={`mt-2 underline font-bold ${isWhite ? 'text-purple-700' : 'text-gold-400'}`}>
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
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('my_bookings')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className={`font-heading text-base font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Booking Details
            </h2>
            <span className={`text-[10px] font-mono font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
              #{booking.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isPending
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300 animate-pulse'
              : booking.status === 'confirmed'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300'
              : booking.status === 'completed'
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300 border border-gray-300'
              : 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300 border border-red-300'
          }`}>
            {isPending ? 'Pending Acceptance' : booking.status}
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Pending Acceptance Notice Banner */}
        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Awaiting Salon Acceptance</span>
            </div>
            <p className={`text-[11px] leading-relaxed font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
              Your booking request has been sent to <strong>{booking.shopName}</strong> with <em>Pay at Salon</em>. Once the shop accepts your slot, you'll receive a confirmation notice.
            </p>
            <button
              onClick={() => {
                setMode('business');
                setBusinessScreen('appointments');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
            >
              <span>Test Shop Partner View & Accept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stylist Section */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
          isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shrink-0 shadow-sm ${
              isWhite ? 'border-purple-300' : 'border-gold-400/40'
            }`}>
              <img
                src={booking.stylist.avatar}
                alt={booking.stylist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {booking.stylist.name}
              </h3>
              <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                {booking.stylist.role}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{booking.stylist.rating.toFixed(1)}</span>
                <span className="text-gray-500 font-normal">({booking.stylist.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <a
            href={`tel:${booking.customerPhone}`}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
              isWhite 
                ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-gold-400/10 border-gold-400/30 text-gold-300 hover:bg-gold-400 hover:text-black'
            }`}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Services & Bill Breakdown */}
        <div className={`p-4 rounded-2xl border space-y-3 shadow-sm ${
          isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
        }`}>
          <h4 className={`text-xs font-bold uppercase tracking-widest font-heading ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            Services Booked
          </h4>

          <div className={`divide-y ${isWhite ? 'divide-gray-100' : 'divide-white/5'}`}>
            {booking.services.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <div>
                  <span className={`font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>{item.name}</span>
                  <span className={`block text-[10px] ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Qty: {item.quantity}</span>
                </div>
                <span className={`font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            {booking.addOns && booking.addOns.map((addon, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <span className={`font-medium ${isWhite ? 'text-gray-800' : 'text-gray-300'}`}>+ {addon.name}</span>
                <span className={`font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                  {formatPrice(addon.price)}
                </span>
              </div>
            ))}
          </div>

          <div className={`pt-2 border-t space-y-1.5 text-xs ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
            <div className={`flex justify-between text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              <span>Subtotal</span>
              <span>{formatPrice(booking.subtotal)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold text-[11px]">
                <span>Coupon Discount ({booking.couponCode})</span>
                <span>-{formatPrice(booking.discountAmount)}</span>
              </div>
            )}
            <div className={`flex justify-between text-sm font-black pt-1.5 border-t ${
              isWhite ? 'border-gray-200 text-gray-900' : 'border-white/10 text-white'
            }`}>
              <span>Total Amount Payable</span>
              <span className={`font-heading font-black text-base ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                {formatPrice(booking.totalAmount)}
              </span>
            </div>
          </div>

          <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isWhite ? 'border-gray-100' : 'border-white/5'}`}>
            <span className={isWhite ? 'text-gray-500' : 'text-gray-400'}>Payment Option</span>
            <span className={`font-bold uppercase ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
              {booking.paymentMethod === 'pay_at_salon' ? '💵 Pay at Salon (Cash / Card)' : booking.paymentMethod}
            </span>
          </div>
        </div>

        {/* Date, Time & Google Maps Location */}
        <div className={`p-4 rounded-2xl border space-y-3 text-xs shadow-sm ${
          isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
        }`}>
          <h4 className={`text-xs font-bold uppercase tracking-widest font-heading ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            Appointment Schedule & Directions
          </h4>

          <div className="flex items-start gap-3">
            <Calendar className={`w-4 h-4 shrink-0 mt-0.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
            <div>
              <span className={`block text-[10px] font-bold ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Date & Time</span>
              <span className={`font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>{booking.formattedDate} at {booking.timeSlot}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
            <div className="flex-1">
              <span className={`block text-[10px] font-bold ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Salon Address</span>
              <span className={`font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>{booking.shopName}</span>
              <p className={`text-[11px] mt-0.5 leading-tight font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
                {booking.shopAddress}
              </p>
            </div>
          </div>

          {/* Direct Google Maps Driving Directions Button */}
          <div className={`pt-2 border-t ${isWhite ? 'border-gray-100' : 'border-white/5'}`}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                isWhite 
                  ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700' 
                  : 'bg-gradient-to-r from-[#201A0E] to-[#161622] border-gold-400/40 hover:border-gold-400 text-gold-300'
              }`}
            >
              <Navigation className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
              <span>Open in Google Maps (Driving Directions)</span>
              <ExternalLink className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-400' : 'text-gray-400'}`} />
            </a>
          </div>
        </div>

        {/* Action Buttons: Reschedule & Cancel */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowRescheduleModal(true)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-colors border shadow-sm ${
                isWhite 
                  ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' 
                  : 'bg-[#181826] border-gold-400/30 text-gold-400 hover:bg-gold-400/10'
              }`}
            >
              Reschedule
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors shadow-sm"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl ${
            isWhite ? 'bg-white border-purple-200' : 'bg-[#14141E] border-gold-400/30'
          }`}>
            <h3 className={`font-heading font-black text-base ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Reschedule Appointment
            </h3>
            <p className={`text-xs ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              Select your preferred new date and time slot.
            </p>

            <div className="space-y-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                    isWhite ? 'bg-purple-50 border-purple-200 text-gray-900' : 'bg-[#1A1A28] border-[#2B2B3E] text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>New Time Slot</label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${
                    isWhite ? 'bg-purple-50 border-purple-200 text-gray-900' : 'bg-[#1A1A28] border-[#2B2B3E] text-white'
                  }`}
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
                className={`py-2.5 rounded-xl text-xs font-semibold ${
                  isWhite ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A1A28] text-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className={`py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isWhite
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110'
                    : 'gold-gradient-btn text-black'
                }`}
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
          <div className={`border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl ${
            isWhite ? 'bg-white border-red-200' : 'bg-[#14141E] border-red-500/30'
          }`}>
            <h3 className={`font-heading font-black text-base ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Cancel Appointment?
            </h3>
            <p className={`text-xs ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              Are you sure you want to cancel booking #{booking.id}?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className={`py-2.5 rounded-xl text-xs font-semibold ${
                  isWhite ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-[#1A1A28] text-gray-300'
                }`}
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
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
