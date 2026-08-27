import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  Lock,
  ArrowRight,
  Clock
} from 'lucide-react';
import { PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';

export const PaymentScreen: React.FC = () => {
  const { 
    cart, 
    selectedAddOns, 
    appliedOffer, 
    customer, 
    createBooking, 
    setCustomerScreen,
    formatPrice,
    currency,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pay_at_salon');
  const [processing, setProcessing] = useState(false);

  const servicesSubtotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0);
  const addOnsSubtotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
  const subtotal = servicesSubtotal + addOnsSubtotal;

  let discount = 0;
  if (appliedOffer) {
    discount = Math.round((subtotal * appliedOffer.discountPercent) / 100);
  }
  const totalAmount = Math.max(0, subtotal - discount);

  const handleConfirmBooking = () => {
    setProcessing(true);
    setTimeout(() => {
      createBooking(selectedMethod);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setProcessing(false);
      setCustomerScreen('booking_confirmed');
    }, 750);
  };

  const paymentOptions: {
    id: PaymentMethod;
    name: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    isHighlight?: boolean;
  }[] = [
    {
      id: 'pay_at_salon',
      name: 'Pay at Salon (No Online Payment)',
      description: 'Book online without paying now. Request is sent to shop to accept your slot.',
      icon: <Store className={`w-5 h-5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />,
      badge: 'Zero Upfront Payment • Recommended',
      isHighlight: true
    },
    {
      id: 'wallet',
      name: `ALGO Wallet Balance (${formatPrice(customer.walletBalance)})`,
      description: 'Instant 1-click contactless checkout from your wallet credits.',
      icon: <Wallet className="w-5 h-5 text-emerald-500" />,
      badge: customer.walletBalance >= totalAmount ? 'Available' : 'Low Balance'
    },
    {
      id: 'upi',
      name: 'Google Pay / PhonePe / UPI',
      description: 'Pay directly using your preferred UPI app with zero transaction charges.',
      icon: <CreditCard className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      description: 'Visa, MasterCard, RuPay & American Express accepted securely.',
      icon: <Building className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <div className={`relative min-h-[720px] h-full flex flex-col justify-between font-body transition-colors duration-300 ${
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
              onClick={() => setCustomerScreen('cart')}
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
                Payment Option
              </h2>
              <p className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                Step 6 of 6 • Currency: {currency.code}
              </p>
            </div>
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border ${
            isWhite ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gold-400/15 border-gold-400/30 text-gold-400'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Amount to Pay Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
            isWhite 
              ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200 shadow-sm' 
              : 'glass-card-gilded border-gold-400/35 shadow-gold-sm'
          }`}>
            <div>
              <span className={`text-[10px] block uppercase tracking-widest font-bold ${
                isWhite ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Amount to Pay
              </span>
              <span className={`text-2xl font-black font-heading ${
                isWhite ? 'text-purple-700' : 'text-gold-300'
              }`}>
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/35 px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-300 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Safe Booking</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-2 font-heading ${
              isWhite ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Select Booking & Payment Mode
            </h3>

            <div className="space-y-2.5">
              {paymentOptions.map(opt => {
                const isSelected = selectedMethod === opt.id;
                const isWalletDisabled = opt.id === 'wallet' && customer.walletBalance < totalAmount;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isWalletDisabled) setSelectedMethod(opt.id);
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                      opt.isHighlight
                        ? isSelected
                          ? isWhite
                            ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300'
                            : 'glass-card-gilded shadow-gold-sm ring-1 ring-gold-400/50'
                          : isWhite
                            ? 'bg-white border-purple-200 hover:border-purple-300 shadow-sm'
                            : 'glass-card-obsidian border-gold-400/40 hover:border-gold-400/70'
                        : isSelected
                        ? isWhite
                          ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300'
                          : 'glass-card-obsidian border-gold-400 shadow-gold-sm ring-1 ring-gold-400/30'
                        : isWhite
                          ? 'bg-white border-purple-100 hover:border-purple-300 shadow-sm'
                          : 'glass-card-obsidian border-white/10 hover:border-gold-400/25'
                    } ${isWalletDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm border ${
                          isWhite ? 'bg-purple-50 border-purple-200' : 'bg-[#14141E] border-white/10'
                        }`}>
                          {opt.icon}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`font-heading text-xs font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                              {opt.name}
                            </h4>
                            {opt.badge && (
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                opt.isHighlight
                                  ? isWhite 
                                    ? 'bg-purple-100 text-purple-800 border-purple-300' 
                                    : 'bg-gold-400/20 text-gold-300 border-gold-400/35'
                                  : isWhite
                                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                                    : 'bg-white/10 text-gray-300 border-white/10'
                              }`}>
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] mt-1 leading-snug font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      {/* Radio button */}
                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? isWhite ? 'bg-purple-600 border-purple-600 text-white font-bold' : 'bg-gold-400 border-gold-400 text-black font-bold shadow-sm'
                              : isWhite ? 'border-gray-300 bg-white' : 'border-[#3E3E54] bg-transparent'
                          }`}
                        >
                          {isSelected && <div className={`w-2 h-2 rounded-full ${isWhite ? 'bg-white' : 'bg-black'}`} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-center text-[11px] pt-2 font-medium">
            <Lock className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
            <span className={isWhite ? 'text-gray-600' : 'text-gray-400'}>End-to-end encrypted booking & slot reservation</span>
          </div>
        </div>
      </div>

      {/* Bottom Submit Button */}
      <div className={`p-4 sticky bottom-0 backdrop-blur-xl border-t z-40 transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.08)]' 
          : 'bg-[#0A0A10]/95 border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <button
          onClick={handleConfirmBooking}
          disabled={processing}
          className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all ${
            isWhite
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
              : 'gold-gradient-btn text-black shadow-gold-sm'
          }`}
        >
          {processing ? (
            <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : selectedMethod === 'pay_at_salon' ? (
            <>
              <Clock className="w-4 h-4" />
              <span>Send Booking Request (Pay at Salon)</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay {formatPrice(totalAmount)} & Confirm</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
