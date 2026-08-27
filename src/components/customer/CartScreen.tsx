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
    currency,
    theme
  } = useApp();

  const isWhite = theme === 'white';

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
    <div className={`min-h-full pb-28 font-body flex flex-col justify-between transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      <div>
        {/* Header */}
        <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
          isWhite 
            ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
            : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('add_ons')}
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
                Booking Summary & Cart
              </h2>
              <p className={`text-[10px] font-bold truncate max-w-[200px] ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                {selectedShop?.name || 'ALGO Salon'} • Currency: {currency.code}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomerScreen('services')}
            className={`text-xs font-bold hover:underline ${
              isWhite ? 'text-purple-700 hover:text-purple-900' : 'text-gold-300 hover:text-gold-200'
            }`}
          >
            + Add More
          </button>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Appointment Schedule Card */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
            isWhite 
              ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' 
              : 'glass-card-obsidian border-white/10 hover:border-gold-400/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                isWhite ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gold-400/15 border-gold-400/30 text-gold-400'
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                  Schedule Slot
                </span>
                <span className={`font-black block ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                  {formattedDateStr()} • {selectedTimeSlot}
                </span>
                <span className={`text-[11px] flex items-center gap-1 mt-0.5 font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                  <UserCheck className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                  Stylist: {selectedStylist?.name || 'Any Available Expert'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCustomerScreen('choose_datetime')}
              className={`text-xs font-bold hover:underline ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}
            >
              Change
            </button>
          </div>

          {/* Selected Services List */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
          }`}>
            <h3 className={`font-heading text-xs font-bold uppercase tracking-widest ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              Selected Services ({cart.length})
            </h3>

            <div className={`divide-y space-y-2 ${isWhite ? 'divide-gray-100' : 'divide-white/5'}`}>
              {cart.map(item => (
                <div key={item.service.id} className="pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.service.image}
                      alt={item.service.name}
                      className={`w-10 h-10 rounded-lg object-cover shrink-0 shadow-sm border ${isWhite ? 'border-purple-100' : 'border-white/10'}`}
                    />
                    <div className="min-w-0">
                      <h4 className={`font-heading text-xs font-black truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                        {item.service.name}
                      </h4>
                      <span className={`text-[11px] font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                        {formatPrice(item.service.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`flex items-center rounded-xl p-0.5 border ${
                      isWhite ? 'bg-gray-50 border-gray-200' : 'bg-[#14141E] border-white/10'
                    }`}>
                      <button
                        onClick={() => updateCartQuantity(item.service.id, item.quantity - 1)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isWhite ? 'bg-white hover:bg-purple-600 hover:text-white text-gray-700' : 'bg-[#20202E] hover:bg-gold-400 hover:text-black text-gray-300'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`w-6 text-center text-xs font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.service.id, item.quantity + 1)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isWhite ? 'bg-white hover:bg-purple-600 hover:text-white text-gray-700' : 'bg-[#20202E] hover:bg-gold-400 hover:text-black text-gray-300'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.service.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
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
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-heading text-xs font-bold uppercase tracking-widest ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                  Selected Add-Ons ({selectedAddOns.length})
                </h3>
                <button
                  onClick={() => setCustomerScreen('add_ons')}
                  className={`text-[11px] font-bold hover:underline ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}
                >
                  Edit Add-Ons
                </button>
              </div>

              <div className="space-y-1.5">
                {selectedAddOns.map(addon => (
                  <div
                    key={addon.id}
                    className={`flex items-center justify-between text-xs py-1 border-b last:border-0 ${
                      isWhite ? 'border-gray-100' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isWhite ? 'text-purple-600' : 'text-gold-400'}`}>+</span>
                      <span className={`font-medium ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>{formatPrice(addon.price)}</span>
                      <button
                        onClick={() => toggleAddOn(addon)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                <Tag className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Apply Coupon / Voucher
              </span>
              <button
                onClick={() => setCustomerScreen('offers')}
                className={`text-[11px] font-bold hover:underline ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}
              >
                View Offers
              </button>
            </div>

            {appliedOffer ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="font-bold text-emerald-600">{appliedOffer.code} Applied</span>
                    <p className={`text-[10px] ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>{appliedOffer.title} ({appliedOffer.discountPercent}% OFF)</p>
                  </div>
                </div>
                <button
                  onClick={removeOffer}
                  className="text-xs text-red-500 hover:underline font-bold"
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
                  className={`flex-1 rounded-xl px-3 py-2 text-xs uppercase outline-none transition-colors ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 shadow-sm' 
                      : 'bg-[#14141E] border border-white/10 text-white placeholder-gray-500 focus:border-gold-400/60'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isWhite 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                      : 'gold-gradient-btn text-black'
                  }`}
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && !appliedOffer && (
              <p className={`text-[10px] font-bold ${couponMessage.isError ? 'text-red-500' : 'text-emerald-500'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Bill Summary with Multi-Currency */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs shadow-sm ${
            isWhite 
              ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200' 
              : 'glass-card-gilded border-gold-400/30 shadow-gold-sm'
          }`}>
            <h4 className={`font-heading font-black text-sm mb-2 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Bill Summary
            </h4>
            <div className={`flex justify-between font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>Item Total</span>
              <span>{formatPrice(servicesSubtotal)}</span>
            </div>
            {addOnsSubtotal > 0 && (
              <div className={`flex justify-between font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                <span>Add-Ons Total</span>
                <span>{formatPrice(addOnsSubtotal)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({appliedOffer?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className={`flex justify-between font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>Taxes & Convenience Fee</span>
              <span className="text-emerald-600 font-bold">FREE (Pay at Salon)</span>
            </div>
            <div className={`pt-2 border-t flex justify-between text-sm font-black ${
              isWhite ? 'border-purple-200 text-gray-900' : 'border-gold-400/20 text-white'
            }`}>
              <span>Grand Total</span>
              <span className={`font-heading text-base font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Proceed to Payment Button */}
      <div className={`p-4 sticky bottom-0 backdrop-blur-xl border-t z-40 transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.08)]' 
          : 'bg-[#0A0A10]/95 border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className={`text-[10px] block uppercase tracking-widest font-bold ${
              isWhite ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Total Amount
            </span>
            <span className={`text-lg font-black font-heading ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
              {formatPrice(total)}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('payment')}
            disabled={cart.length === 0}
            className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 ${
              isWhite 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                : 'gold-gradient-btn text-black shadow-gold-sm'
            }`}
          >
            <span>Choose Payment Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
