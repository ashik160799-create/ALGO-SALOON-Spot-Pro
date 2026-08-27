import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    selectedAddOns, 
    toggleAddOn, 
    selectedStylist, 
    selectedDate, 
    selectedTimeSlot, 
    appliedOffer, 
    applyOfferCode, 
    removeOffer, 
    setCustomerScreen, 
    selectedShop,
    formatPrice,
    currency 
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const servicesSubtotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0);
  const addOnsSubtotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
  const subtotal = servicesSubtotal + addOnsSubtotal;

  let discount = 0;
  if (appliedOffer) {
    discount = Math.round((subtotal * appliedOffer.discountPercent) / 100);
  }
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyOfferCode(couponInput);
    setCouponMessage({
      text: res.message,
      isError: !res.success
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const formattedDateStr = () => {
    const d = new Date(selectedDate);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '28 May 2026';
  };

  return (
    <div className="min-h-full pb-28 bg-[#0A0A0F] text-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('add_ons')}
              className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Booking Summary & Cart
              </h2>
              <p className="text-[10px] text-gold-400 truncate max-w-[200px]">
                {selectedShop?.name || 'ALGO Salon'} • Currency: {currency.code}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomerScreen('services')}
            className="text-xs text-gold-400 hover:underline font-semibold"
          >
            + Add More
          </button>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Appointment Schedule Card */}
          <div className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181826] border border-gold-400/30 flex items-center justify-center text-gold-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Schedule Slot</span>
                <span className="font-bold text-white block">
                  {formattedDateStr()} • {selectedTimeSlot}
                </span>
                <span className="text-[11px] text-gold-300 flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3 h-3 text-gold-400" />
                  Stylist: {selectedStylist?.name || 'Any Available Expert'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCustomerScreen('choose_datetime')}
              className="text-xs text-gold-400 hover:underline font-bold"
            >
              Change
            </button>
          </div>

          {/* Selected Services List */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-wider">
              Selected Services ({cart.length})
            </h3>

            <div className="divide-y divide-white/5 space-y-2">
              {cart.map(item => (
                <div key={item.service.id} className="pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.service.image}
                      alt={item.service.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading text-xs font-bold text-white truncate">
                        {item.service.name}
                      </h4>
                      <span className="text-[11px] text-gold-400 font-bold">
                        {formatPrice(item.service.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-[#181824] border border-white/10 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.service.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-[#222234] hover:bg-gold-400 hover:text-black text-gray-300 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.service.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-[#222234] hover:bg-gold-400 hover:text-black text-gray-300 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.service.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Add-Ons */}
          {selectedAddOns.length > 0 && (
            <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Selected Add-Ons ({selectedAddOns.length})
                </h3>
                <button
                  onClick={() => setCustomerScreen('add_ons')}
                  className="text-[11px] text-gold-400 hover:underline font-semibold"
                >
                  Edit Add-Ons
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedAddOns.map(addon => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gold-400 font-bold">+</span>
                      <span className="text-gray-200">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gold-400 font-bold">{formatPrice(addon.price)}</span>
                      <button
                        onClick={() => toggleAddOn(addon)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          <div className="glass-card p-3.5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gold-400" />
                Apply Coupon / Voucher
              </span>
              <button
                onClick={() => setCustomerScreen('offers')}
                className="text-[11px] text-gold-400 hover:underline font-semibold"
              >
                View Offers
              </button>
            </div>

            {appliedOffer ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-emerald-400">{appliedOffer.code} Applied</span>
                    <p className="text-[10px] text-gray-300">{appliedOffer.title} ({appliedOffer.discountPercent}% OFF)</p>
                  </div>
                </div>
                <button
                  onClick={removeOffer}
                  className="text-xs text-red-400 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Enter code (e.g. ALGOLOOK30)"
                  className="flex-1 bg-[#1A1A28] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && !appliedOffer && (
              <p className={`text-[10px] font-medium ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Bill Summary with Multi-Currency */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <h4 className="font-heading font-bold text-sm text-white mb-2">
              Bill Summary
            </h4>
            <div className="flex justify-between text-gray-300">
              <span>Item Total</span>
              <span>{formatPrice(servicesSubtotal)}</span>
            </div>
            {addOnsSubtotal > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Add-Ons Total</span>
                <span>{formatPrice(addOnsSubtotal)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount ({appliedOffer?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>Taxes & Convenience Fee</span>
              <span className="text-emerald-400 font-semibold">FREE (Pay at Salon)</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
              <span>Grand Total</span>
              <span className="text-gold-400 font-heading text-base">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Proceed to Payment Button */}
      <div className="p-4 sticky bottom-0 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
              Total Amount
            </span>
            <span className="text-lg font-black text-gold-400 font-heading">
              {formatPrice(total)}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('payment')}
            disabled={cart.length === 0}
            className="gold-gradient-btn px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <span>Choose Payment Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
