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
    currency
  } = useApp();

  const isSelected = (addon: AddOnItem) => {
    return selectedAddOns.some(a => a.id === addon.id);
  };

  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('choose_datetime')}
              className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Add-On Extras
              </h2>
              <p className="text-[10px] text-gold-400">
                Enhance your session with quick treatments
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomerScreen('cart')}
            className="text-xs text-gray-400 hover:text-white font-medium underline-offset-2 hover:underline"
          >
            Skip
          </button>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className="bg-gradient-to-r from-gold-500/10 to-amber-500/10 border border-gold-400/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs text-gold-200 font-medium">Recommended with your styling</span>
            </div>
            {selectedAddOns.length > 0 && (
              <span className="text-xs font-bold text-gold-400">+{selectedAddOns.length} Added</span>
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
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-[#181512] border-gold-400 shadow-gold-sm'
                      : 'glass-card border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gold-400/20 shrink-0">
                      <img
                        src={addon.image}
                        alt={addon.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-heading text-sm font-bold text-white">
                        {addon.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-gold-400">
                          {formatPrice(addon.price)}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {addon.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    active 
                      ? 'bg-gold-400 text-black font-bold shadow-sm' 
                      : 'bg-[#1E1E2C] border border-white/10 text-gray-400'
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
      <div className="sticky bottom-0 p-4 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-between gap-3 max-w-sm mx-auto">
          <div>
            <span className="text-[10px] text-gray-400 block">Add-ons Total</span>
            <span className="font-heading text-base font-extrabold text-gold-400">
              {formatPrice(addOnsTotal)}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('cart')}
            className="gold-gradient-btn px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Continue to Cart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
