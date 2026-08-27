import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tag, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight,
  Gift,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Offer } from '../../types';

export const OffersScreen: React.FC = () => {
  const { offers, appliedOffer, applyOfferCode, setCustomerScreen, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApply = (offer: Offer) => {
    applyOfferCode(offer.code);
    setCopiedCode(offer.code);
    setTimeout(() => {
      setCustomerScreen('cart');
    }, 400);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-white/5">
        <h2 className="font-heading text-lg font-bold text-white mb-3">
          Special Discounts & Offers
        </h2>

        {/* Tabs */}
        <div className="flex bg-[#161622] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Offers ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'my'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            VIP Vouchers
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3.5">
        {offers.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-3 my-6 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gold-400">
              <Tag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-200">No active promotions yet</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Real promo discounts and VIP coupons will appear here when salon partners launch seasonal campaigns.
            </p>
            <button
              onClick={() => setCustomerScreen('home')}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2"
            >
              Browse Salons
            </button>
          </div>
        ) : (
          offers.map(offer => {
            const isApplied = appliedOffer?.code === offer.code;
            return (
            <div
              key={offer.id}
              className={`glass-card p-4 rounded-2xl border transition-all duration-200 ${
                isApplied
                  ? 'bg-gradient-to-br from-[#282110] to-[#151522] border-gold-400 shadow-gold-sm'
                  : 'border-white/10 hover:border-gold-400/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gold-400/30 shrink-0">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider text-black bg-gold-400 px-1.5 py-0.5 rounded mb-1">
                      {offer.category}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-white">
                      {offer.title}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {offer.subtitle}
                    </p>
                    <span className="text-[10px] text-amber-300/80 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {offer.validTill}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Pill */}
                <div className="text-right shrink-0">
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-gold-300 bg-gold-400/10 border border-gold-400/30 px-2 py-1 rounded-lg hover:bg-gold-400/20"
                    title="Click to copy code"
                  >
                    <span>{offer.code}</span>
                    {copiedCode === offer.code ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Apply Action */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  Min spend: {formatPrice(offer.minSpend)}
                </span>

                <button
                  onClick={() => handleApply(offer)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isApplied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'gold-gradient-btn'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <span>Apply to Cart</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
