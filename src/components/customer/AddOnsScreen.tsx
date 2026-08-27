import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { AddOnItem } from '../../types';

export const AddOnsScreen: React.FC = () => {
  const { 
    addOns, 
    selectedAddOns, 
    toggleAddOn, 
    setCustomerScreen,
    formatPrice,
    currency,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const isSelected = (addon: AddOnItem) => {
    return selectedAddOns.some(a => a.id === addon.id);
  };

  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);

  return (
    <div className={`min-h-full pb-24 font-body flex flex-col justify-between transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      <div>
        {/* Top Header */}
        <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
          isWhite 
            ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
            : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('choose_datetime')}
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
                Add-On Extras
              </h2>
              <p className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                Enhance your session with quick treatments
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomerScreen('cart')}
            className={`text-xs font-bold underline-offset-2 hover:underline transition-colors ${
              isWhite ? 'text-purple-700 hover:text-purple-900' : 'text-gray-400 hover:text-gold-300'
            }`}
          >
            Skip
          </button>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className={`rounded-xl p-3 flex items-center justify-between shadow-sm border ${
            isWhite 
              ? 'bg-purple-50 border-purple-200' 
              : 'glass-card-gilded border-gold-400/30'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
              <span className={`text-xs font-bold ${isWhite ? 'text-purple-900' : 'text-gold-300'}`}>
                Recommended with your styling
              </span>
            </div>
            {selectedAddOns.length > 0 && (
              <span className={`text-xs font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                +{selectedAddOns.length} Added
              </span>
            )}
          </div>

          {/* Add-ons List */}
          <div className="space-y-2.5">
            {addOns.map(addon => {
              const active = isSelected(addon);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 shadow-sm ${
                    active
                      ? isWhite
                        ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300'
                        : 'glass-card-gilded border-gold-400 shadow-gold-sm ring-1 ring-gold-400/40'
                      : isWhite
                        ? 'bg-white border-purple-100 hover:border-purple-300 shadow-sm'
                        : 'glass-card-obsidian border-white/10 hover:border-gold-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border ${
                      isWhite ? 'border-purple-200' : 'border-gold-400/30'
                    }`}>
                      <img
                        src={addon.image}
                        alt={addon.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                        {addon.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-black font-heading ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                          {formatPrice(addon.price)}
                        </span>
                        <span className={`text-[11px] font-medium flex items-center gap-1 ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Clock className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                          {addon.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                    active 
                      ? isWhite ? 'bg-purple-600 text-white font-bold' : 'bg-gold-400 text-black font-bold shadow-gold-sm' 
                      : isWhite ? 'bg-gray-100 border border-gray-200 text-gray-400' : 'bg-[#14141E] border border-white/10 text-gray-400'
                  }`}>
                    {active ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action */}
      <div className={`sticky bottom-0 p-4 backdrop-blur-xl border-t transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.08)]' 
          : 'bg-[#0A0A10]/95 border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="flex items-center justify-between gap-3 max-w-sm mx-auto">
          <div>
            <span className={`text-[10px] block uppercase tracking-widest font-bold ${
              isWhite ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Add-ons Total
            </span>
            <span className={`font-heading text-base font-black ${
              isWhite ? 'text-purple-700' : 'text-gold-300'
            }`}>
              {formatPrice(addOnsTotal)}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('cart')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all ${
              isWhite 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                : 'gold-gradient-btn text-black shadow-gold-sm'
            }`}
          >
            <span>Continue to Cart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
