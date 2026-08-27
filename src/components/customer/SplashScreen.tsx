import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLocationModal } from '../common/CustomerLocationModal';
import { 
  Scissors, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  User, 
  LogIn, 
  Star, 
  CheckCircle,
  Building2,
  Clock,
  MapPin
} from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { 
    setCustomerScreen, 
    setMode, 
    setBusinessScreen, 
    setAuthInitialRole, 
    setAuthInitialTab,
    customerLocation,
    shops,
    theme
  } = useApp();

  const isWhite = theme === 'white';
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleAdvanceToSignup = () => {
    setAuthInitialRole('customer');
    setAuthInitialTab('signup');
    setMode('customer');
    setCustomerScreen('auth');
  };

  const handleCustomerStart = () => {
    const hasPrompted = localStorage.getItem('algo_location_prompted') === 'true';
    if (hasPrompted) {
      handleAdvanceToSignup();
    } else {
      setShowLocationModal(true);
    }
  };

  const handleCustomerLogin = () => {
    setAuthInitialRole('customer');
    setAuthInitialTab('signin');
    setMode('customer');
    setCustomerScreen('auth');
  };

  const handleBusinessLogin = () => {
    setAuthInitialRole('business');
    setAuthInitialTab('signin');
    setMode('business');
    setBusinessScreen('auth');
  };

  const handleBusinessRegister = () => {
    setAuthInitialRole('business');
    setAuthInitialTab('signup');
    setMode('business');
    setBusinessScreen('auth');
  };

  return (
    <div className={`relative min-h-[720px] h-full flex flex-col justify-between p-5 sm:p-6 font-body overflow-y-auto no-scrollbar select-none transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Ambient Radial Luxury Glows */}
      <div className={`absolute top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isWhite ? 'bg-purple-300/20' : 'bg-gold-400/10'
      }`} />
      <div className={`absolute bottom-16 right-4 w-60 h-60 rounded-full blur-2xl pointer-events-none ${
        isWhite ? 'bg-pink-300/15' : 'bg-gold-600/5'
      }`} />

      {/* Top Header Bar: Network Tag & Partner Link */}
      <div className="flex justify-between items-center z-10 pt-2 shrink-0">
        <span className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm ${
          isWhite 
            ? 'text-purple-700 bg-purple-50 border border-purple-200' 
            : 'text-gold-300 bg-gold-400/15 border border-gold-400/30'
        }`}>
          <Sparkles className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'} animate-pulse`} />
          <span>PREMIUM SALON NETWORK</span>
        </span>
        
        {/* Partner Login Quick Action */}
        <button
          onClick={handleBusinessLogin}
          className={`text-[11px] font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-sm active:scale-95 ${
            isWhite
              ? 'bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 text-purple-700'
              : 'bg-[#14141E] hover:bg-[#1A1A28] border border-gold-400/30 hover:border-gold-400/60 text-gold-300'
          }`}
          title="Open Business Partner Portal"
        >
          <Store className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
          <span>Partner Portal</span>
        </button>
      </div>

      {/* Center Branding Hero */}
      <div className="flex flex-col items-center justify-center my-auto text-center z-10 py-4 shrink-0">
        {/* Animated Brand Emblem */}
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-3xl p-0.5 flex items-center justify-center pulse-gold ${
            isWhite
              ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 shadow-[0_0_35px_rgba(126,34,206,0.25)]'
              : 'bg-gradient-to-br from-gold-300 via-gold-500 to-amber-600 shadow-[0_0_35px_rgba(212,175,55,0.4)]'
          }`}>
            <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${
              isWhite ? 'bg-white' : 'bg-[#0E0E16]'
            }`}>
              <Scissors className={`w-12 h-12 transform -rotate-45 ${
                isWhite ? 'text-purple-700' : 'text-gold-400'
              }`} />
            </div>
          </div>
          <span className={`absolute -bottom-2 -right-2 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md font-heading ${
            isWhite ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gradient-to-r from-amber-400 to-gold-400 text-black'
          }`}>
            EST. 2026
          </span>
        </div>

        {/* Brand Titles */}
        <h1 className={`font-heading text-3xl sm:text-4xl font-black tracking-wider uppercase mb-1.5 ${
          isWhite ? 'text-gray-900' : 'text-white'
        }`}>
          ALGO <span className={isWhite ? 'bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent' : 'gold-text-gradient'}>SALOON</span>
        </h1>
        <p className={`font-editorial italic text-sm sm:text-base tracking-wider mb-2 ${
          isWhite ? 'text-purple-700 font-bold' : 'text-gold-300'
        }`}>
          Look Good. Feel Great.
        </p>
        <p className={`text-xs max-w-xs leading-relaxed font-body ${
          isWhite ? 'text-gray-600 font-medium' : 'text-gray-300'
        }`}>
          Book verified luxury salon appointments with zero upfront payment required.
        </p>

        {/* 4 Trust Highlights Grid (Crystal Clear High Contrast) */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 w-full max-w-xs text-left">
          <div className={`rounded-2xl p-3 flex items-center gap-2.5 transition-all shadow-sm ${
            isWhite 
              ? 'bg-white border border-purple-200/90 shadow-[0_2px_10px_rgba(126,34,206,0.06)]' 
              : 'bg-[#13131F] border border-gold-400/35 shadow-md'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700' 
                : 'bg-gold-400/20 border border-gold-400/35 text-gold-300'
            }`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-black text-xs leading-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {shops.length > 0 ? `${shops.length}+ Salons` : 'Verified Salons'}
              </p>
              <p className={`text-[11px] font-bold leading-tight mt-0.5 ${isWhite ? 'text-purple-700' : 'text-gold-200'}`}>
                Top Rated Venues
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-3 flex items-center gap-2.5 transition-all shadow-sm ${
            isWhite 
              ? 'bg-white border border-purple-200/90 shadow-[0_2px_10px_rgba(126,34,206,0.06)]' 
              : 'bg-[#13131F] border border-gold-400/35 shadow-md'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isWhite 
                ? 'bg-amber-50 border border-amber-200 text-amber-600' 
                : 'bg-amber-400/20 border border-amber-400/35 text-amber-300'
            }`}>
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className={`font-black text-xs leading-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                4.9 ★ Rating
              </p>
              <p className={`text-[11px] font-bold leading-tight mt-0.5 ${isWhite ? 'text-purple-700' : 'text-gold-200'}`}>
                Verified Reviews
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-3 flex items-center gap-2.5 transition-all shadow-sm ${
            isWhite 
              ? 'bg-white border border-purple-200/90 shadow-[0_2px_10px_rgba(126,34,206,0.06)]' 
              : 'bg-[#13131F] border border-gold-400/35 shadow-md'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isWhite 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' 
                : 'bg-emerald-400/20 border border-emerald-400/35 text-emerald-300'
            }`}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-black text-xs leading-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Pay at Salon
              </p>
              <p className={`text-[11px] font-bold leading-tight mt-0.5 ${isWhite ? 'text-purple-700' : 'text-gold-200'}`}>
                Cash / UPI / Card
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-3 flex items-center gap-2.5 transition-all shadow-sm ${
            isWhite 
              ? 'bg-white border border-purple-200/90 shadow-[0_2px_10px_rgba(126,34,206,0.06)]' 
              : 'bg-[#13131F] border border-gold-400/35 shadow-md'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isWhite 
                ? 'bg-blue-50 border border-blue-200 text-blue-600' 
                : 'bg-blue-400/20 border border-blue-400/35 text-blue-300'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-black text-xs leading-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Instant Slot
              </p>
              <p className={`text-[11px] font-bold leading-tight mt-0.5 ${isWhite ? 'text-purple-700' : 'text-gold-200'}`}>
                Live Booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2.5 z-10 pb-2 w-full max-w-sm mx-auto shrink-0">
        {/* Primary CTA */}
        <button
          onClick={handleCustomerStart}
          className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all ${
            isWhite
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
              : 'gold-gradient-btn shadow-gold-md'
          }`}
        >
          <User className={`w-4 h-4 ${isWhite ? 'text-white' : 'text-black'}`} />
          <span>GET STARTED (Create Free Account)</span>
          <ArrowRight className={`w-4 h-4 ${isWhite ? 'text-white' : 'text-black'}`} />
        </button>

        {/* Secondary Action */}
        <button
          onClick={handleCustomerLogin}
          className={`w-full py-3 px-6 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
            isWhite
              ? 'bg-white hover:bg-purple-50 text-gray-800 hover:text-purple-800 border border-purple-200 hover:border-purple-300'
              : 'bg-[#14141E] hover:bg-[#1A1A28] text-gray-200 hover:text-gold-300 border border-white/10 hover:border-gold-400/40'
          }`}
        >
          <LogIn className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
          <span>Already registered? Sign In</span>
        </button>

        {/* Salon Owner Quick Registration Banner Card */}
        <div className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all shadow-sm ${
          isWhite 
            ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200' 
            : 'bg-gradient-to-r from-[#141422] via-[#181828] to-[#141422] border-gold-400/35'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
              isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
            }`}>
              <Store className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className={`text-xs font-black block leading-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Salon Owner / Partner?
              </span>
              <span className={`text-[10.5px] block font-medium ${isWhite ? 'text-gray-600' : 'text-gold-200'}`}>
                Grow bookings & manage stylists
              </span>
            </div>
          </div>
          <button
            onClick={handleBusinessRegister}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm shrink-0 flex items-center gap-1 ${
              isWhite
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
                : 'gold-gradient-btn text-black'
            }`}
          >
            <span>Register Shop</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Security Trust Note */}
        <div className={`flex items-center justify-center gap-1.5 pt-1 text-[10px] ${
          isWhite ? 'text-gray-500 font-medium' : 'text-gray-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Safe & Verified Salon Network • End-to-End Encrypted</span>
        </div>
      </div>

      {/* Location Permission / Country Selection Gate */}
      <CustomerLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onComplete={handleAdvanceToSignup}
        onSkip={handleAdvanceToSignup}
      />
    </div>
  );
};
