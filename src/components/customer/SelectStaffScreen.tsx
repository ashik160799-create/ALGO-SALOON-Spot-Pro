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
    setCustomerScreen,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const handleSelect = (stylist: Stylist) => {
    setSelectedStylist(stylist);
  };

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
              onClick={() => setCustomerScreen('services')}
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
                Select Stylist / Staff
              </h2>
              <p className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                Step 2 of 4 • Choose your grooming specialist
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          <div className={`rounded-2xl p-3 flex items-center gap-2.5 shadow-sm border ${
            isWhite 
              ? 'bg-purple-50 border-purple-200 text-purple-800' 
              : 'bg-gold-400/10 border-gold-400/25 text-gold-200'
          }`}>
            <Sparkles className={`w-4 h-4 shrink-0 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
            <p className="text-xs font-semibold leading-snug">
              All stylists are certified master barbers with verified luxury salon experience.
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
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  selectedStylist?.id === 'stylist-auto'
                    ? isWhite
                      ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-400'
                      : 'glass-card-gilded shadow-gold-sm ring-1 ring-gold-400/40'
                    : isWhite
                      ? 'bg-white border-purple-100 hover:border-purple-300 shadow-sm'
                      : 'glass-card-obsidian border-white/10 hover:border-gold-400/30'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 ${
                    isWhite 
                      ? 'bg-purple-100 border-purple-300 text-purple-700' 
                      : 'bg-gold-400/15 border-gold-400/40 text-gold-400'
                  }`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                      Any Available Master Stylist
                    </h3>
                    <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
                      Auto-assigned upon salon arrival
                    </p>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                      ✓ Instant Allocation
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedStylist?.id === 'stylist-auto'
                      ? isWhite ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gold-400 border-gold-400 text-black shadow-sm'
                      : isWhite ? 'border-gray-300 bg-white' : 'border-[#3D3D52] bg-transparent'
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
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    isSelected
                      ? isWhite
                        ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-400'
                        : 'glass-card-gilded shadow-gold-sm ring-1 ring-gold-400/40'
                      : isWhite
                        ? 'bg-white border-purple-100 hover:border-purple-300 shadow-sm'
                        : 'glass-card-obsidian border-white/10 hover:border-gold-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shrink-0 shadow-md ${
                        isWhite ? 'border-purple-300' : 'border-gold-400/40'
                      }`}>
                        <img
                          src={stylist.avatar}
                          alt={stylist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {stylist.rating >= 4.9 && (
                        <span className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1 rounded-full shadow-sm ${
                          isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
                        }`}>
                          TOP
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                        {stylist.name}
                      </h3>
                      <p className={`text-[11px] font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
                        {stylist.role}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>{stylist.rating.toFixed(1)}</span>
                          <span className="text-gray-500 font-normal">({stylist.reviewCount})</span>
                        </div>

                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          isWhite ? 'text-purple-700' : 'text-gold-300'
                        }`}>
                          <Award className="w-3 h-3 text-current" />
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
                          ? isWhite ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gold-400 border-gold-400 text-black shadow-sm'
                          : isWhite ? 'border-gray-300 bg-white' : 'border-[#3D3D52] bg-transparent'
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
      <div className={`p-4 sticky bottom-0 backdrop-blur-xl border-t transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.08)]' 
          : 'bg-[#0A0A10]/95 border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <button
          onClick={() => setCustomerScreen('choose_datetime')}
          disabled={!selectedStylist}
          className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all ${
            isWhite
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
              : 'gold-gradient-btn text-black'
          }`}
        >
          <span>Continue to Date & Time</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
