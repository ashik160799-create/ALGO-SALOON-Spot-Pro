import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  Check, 
  Award, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Stylist } from '../../types';

export const SelectStaffScreen: React.FC = () => {
  const { 
    stylists, 
    selectedStylist, 
    setSelectedStylist, 
    setCustomerScreen 
  } = useApp();

  const handleSelect = (stylist: Stylist) => {
    setSelectedStylist(stylist);
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('services')}
              className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Select Stylist / Staff
              </h2>
              <p className="text-[10px] text-gold-400">
                Step 2 of 4 • Choose your grooming specialist
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-3 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <p className="text-xs text-gold-200 leading-snug">
              All stylists are certified master barbers with verified experience.
            </p>
          </div>

          {/* Stylists List */}
          <div className="space-y-3 pt-1">
            {stylists.length === 0 ? (
              <div
                onClick={() => handleSelect({
                  id: 'stylist-auto',
                  shopId: 'shop-current',
                  name: 'Any Available Master Stylist',
                  role: 'Senior Stylist',
                  rating: 5.0,
                  reviewCount: 1,
                  experience: '5+ Years',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  specialties: ['Haircut', 'Beard Grooming'],
                  isAvailable: true
                })}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  selectedStylist?.id === 'stylist-auto'
                    ? 'bg-[#181512] border-gold-400 shadow-gold-sm'
                    : 'glass-card border-white/10 hover:border-gold-400/30'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-400 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white">
                      Any Available Master Stylist
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Auto-assigned upon salon arrival
                    </p>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">
                      ✓ Instant Allocation
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedStylist?.id === 'stylist-auto'
                      ? 'bg-gold-400 border-gold-400 text-black shadow-sm'
                      : 'border-[#3D3D52] bg-transparent'
                  }`}>
                    {selectedStylist?.id === 'stylist-auto' && <Check className="w-3.5 h-3.5 font-bold" />}
                  </div>
                </div>
              </div>
            ) : (
              stylists.map(stylist => {
                const isSelected = selectedStylist?.id === stylist.id;
                return (
                <div
                  key={stylist.id}
                  onClick={() => handleSelect(stylist)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#181512] border-gold-400 shadow-gold-sm'
                      : 'glass-card border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/40 shrink-0">
                        <img
                          src={stylist.avatar}
                          alt={stylist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {stylist.rating >= 4.9 && (
                        <span className="absolute -bottom-1 -right-1 bg-gold-400 text-black text-[8px] font-extrabold px-1 rounded-full">
                          TOP
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-heading text-sm font-bold text-white">
                        {stylist.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {stylist.role}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                          <Star className="w-2.5 h-2.5 fill-emerald-400" />
                          <span>{stylist.rating.toFixed(1)}</span>
                          <span className="text-gray-400 font-normal">({stylist.reviewCount})</span>
                        </div>

                        <span className="text-[10px] text-gold-300 font-medium flex items-center gap-1">
                          <Award className="w-3 h-3 text-gold-400" />
                          {stylist.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Selector */}
                  <div className="shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-gold-400 border-gold-400 text-black shadow-sm'
                          : 'border-[#3D3D52] bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* Bottom Continue Button */}
      <div className="p-4 sticky bottom-0 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/5">
        <button
          onClick={() => setCustomerScreen('choose_datetime')}
          disabled={!selectedStylist}
          className="gold-gradient-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
