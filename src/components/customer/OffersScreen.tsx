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
  const { offers, appliedOffer, applyOfferCode, setCustomerScreen, formatPrice, theme } = useApp();
  const isWhite = theme === 'white';

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
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 pt-3 pb-2.5 shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <h2 className={`font-heading text-lg font-black mb-3 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
          Special Discounts & Offers
        </h2>

        {/* Tabs */}
        <div className={`flex p-1 rounded-2xl border shadow-inner ${
          isWhite ? 'bg-gray-100 border-purple-100' : 'bg-[#14141E] border-white/10'
        }`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn text-black shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            All Offers ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn text-black shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            VIP Vouchers
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3.5">
        {offers.length === 0 ? (
          <div className={`p-8 rounded-3xl text-center space-y-3 my-6 border ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm border ${
              isWhite ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gold-400/10 border border-gold-400/20 text-gold-300'
            }`}>
              <Tag className="w-6 h-6" />
            </div>
            <p className={`text-sm font-black ${isWhite ? 'text-gray-900' : 'text-gray-200'}`}>No active promotions yet</p>
            <p className={`text-xs max-w-xs mx-auto font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              Real promo discounts and VIP coupons will appear here when salon partners launch seasonal campaigns.
            </p>
            <button
              onClick={() => setCustomerScreen('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2 transition-all ${
                isWhite 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                  : 'gold-gradient-btn text-black'
              }`}
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
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isApplied
                  ? isWhite
                    ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300'
                    : 'glass-card-gilded border-gold-400 shadow-gold-sm ring-1 ring-gold-400/40'
                  : isWhite
                    ? 'bg-white border-purple-100 hover:border-purple-300 shadow-[0_2px_12px_rgba(126,34,206,0.06)]'
                    : 'glass-card-obsidian border-white/10 hover:border-gold-400/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border ${
                    isWhite ? 'border-purple-200' : 'border-gold-400/30'
                  }`}>
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded mb-1 shadow-sm ${
                      isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
                    }`}>
                      {offer.category}
                    </span>
                    <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                      {offer.title}
                    </h3>
                    <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                      {offer.subtitle}
                    </p>
                    <span className={`text-[10px] flex items-center gap-1 mt-1 font-bold ${
                      isWhite ? 'text-purple-700' : 'text-amber-300'
                    }`}>
                      <Clock className="w-3 h-3 text-current" />
                      {offer.validTill}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Pill */}
                <div className="text-right shrink-0">
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className={`flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg transition-colors shadow-sm border ${
                      isWhite 
                        ? 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200' 
                        : 'text-gold-300 bg-gold-400/10 hover:bg-gold-400/20 border-gold-400/30'
                    }`}
                    title="Click to copy code"
                  >
                    <span>{offer.code}</span>
                    {copiedCode === offer.code ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Apply Action */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
                isWhite ? 'border-gray-100' : 'border-white/10'
              }`}>
                <span className={`text-[10px] font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                  Min spend: {formatPrice(offer.minSpend)}
                </span>

                <button
                  onClick={() => handleApply(offer)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                    isApplied
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                      : isWhite
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
                        : 'gold-gradient-btn hover:brightness-110 active:scale-95 text-black'
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
