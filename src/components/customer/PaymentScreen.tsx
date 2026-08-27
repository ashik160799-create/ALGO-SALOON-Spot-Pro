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
    currency 
  } = useApp();

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
      icon: <Store className="w-5 h-5 text-gold-400" />,
      badge: 'Zero Upfront Payment • Recommended',
      isHighlight: true
    },
    {
      id: 'wallet',
      name: `ALGO Wallet Balance (${formatPrice(customer.walletBalance)})`,
      description: 'Instant 1-click contactless checkout from your wallet credits.',
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      badge: customer.walletBalance >= totalAmount ? 'Available' : 'Low Balance'
    },
    {
      id: 'upi',
      name: 'Google Pay / PhonePe / UPI',
      description: 'Pay directly using your preferred UPI app with zero transaction charges.',
      icon: <CreditCard className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      description: 'Visa, MasterCard, RuPay & American Express accepted securely.',
      icon: <Building className="w-5 h-5 text-amber-400" />
    }
  ];

  return (
    <div className="relative min-h-[720px] h-full flex flex-col justify-between bg-[#0A0A0F] text-white">
      <div>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('cart')}
              className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Payment Option
              </h2>
              <p className="text-[10px] text-gold-400">Step 6 of 6 • Currency: {currency.code}</p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Amount to Pay Card */}
          <div className="glass-card p-4 rounded-2xl border border-gold-400/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                Amount to Pay
              </span>
              <span className="text-2xl font-black text-gold-400 font-heading">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Safe Booking</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
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
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      opt.isHighlight
                        ? isSelected
                          ? 'bg-gradient-to-r from-[#2B2313] to-[#181824] border-gold-400 shadow-gold-sm ring-1 ring-gold-400'
                          : 'bg-[#18161D] border-gold-400/40 hover:border-gold-400'
                        : isSelected
                        ? 'bg-[#191928] border-gold-400 shadow-gold-sm'
                        : 'glass-card border-white/10 hover:border-white/20'
                    } ${isWalletDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#14141F] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          {opt.icon}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-heading text-xs font-bold text-white">
                              {opt.name}
                            </h4>
                            {opt.badge && (
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                opt.isHighlight
                                  ? 'bg-gold-400/20 text-gold-300 border border-gold-400/30'
                                  : 'bg-white/10 text-gray-300'
                              }`}>
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      {/* Radio button */}
                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-gold-400 border-gold-400 text-black font-bold shadow-sm'
                              : 'border-[#3E3E54] bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-500 pt-2">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>End-to-end encrypted booking & slot reservation</span>
          </div>
        </div>
      </div>

      {/* Bottom Submit Button */}
      <div className="p-4 sticky bottom-0 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/5">
        <button
          onClick={handleConfirmBooking}
          disabled={processing}
          className="gold-gradient-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-sm disabled:opacity-50"
        >
          {processing ? (
            <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : selectedMethod === 'pay_at_salon' ? (
            <>
              <Clock className="w-4 h-4 text-black" />
              <span>Send Booking Request (Pay at Salon)</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-black" />
              <span>Pay {formatPrice(totalAmount)} & Confirm</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
