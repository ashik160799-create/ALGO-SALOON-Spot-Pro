import React from 'react';
import { useApp } from '../../context/AppContext';
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
  Clock
} from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { 
    setCustomerScreen, 
    setMode, 
    setBusinessScreen, 
    setAuthInitialRole, 
    setAuthInitialTab,
    shops
  } = useApp();

  const handleCustomerStart = () => {
    setAuthInitialRole('customer');
    setAuthInitialTab('signup');
    setMode('customer');
    setCustomerScreen('auth');
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
    <div className="relative min-h-[720px] h-full flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-[#11111A] via-[#0A0A0F] to-[#040407] text-white overflow-y-auto no-scrollbar select-none">
      {/* Ambient Radial Luxury Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-4 w-60 h-60 bg-amber-500/8 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Bar: Network Tag & Partner Link */}
      <div className="flex justify-between items-center z-10 pt-2 shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gold-300 bg-gold-500/10 border border-gold-400/25 px-3 py-1 rounded-full shadow-sm">
          <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
          <span>PREMIUM SALON NETWORK</span>
        </span>
        
        {/* Partner Login Quick Action */}
        <button
          onClick={handleBusinessLogin}
          className="text-[11px] text-gold-400 hover:text-gold-300 font-bold transition-all flex items-center gap-1.5 bg-[#161424] hover:bg-[#1E1C30] border border-gold-400/30 hover:border-gold-400/60 px-3 py-1.5 rounded-xl shadow-sm active:scale-95"
          title="Open Business Partner Portal"
        >
          <Store className="w-3.5 h-3.5 text-gold-400" />
          <span>Partner Portal</span>
        </button>
      </div>

      {/* Center Branding Hero */}
      <div className="flex flex-col items-center justify-center my-auto text-center z-10 py-4 shrink-0">
        {/* Animated Brand Emblem */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-300 via-gold-500 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center pulse-gold">
            <div className="w-full h-full bg-[#0D0D15] rounded-[22px] flex items-center justify-center">
              <Scissors className="w-12 h-12 text-gold-400 transform -rotate-45" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-gold-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
            EST. 2026
          </span>
        </div>

        {/* Brand Titles */}
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-white mb-1.5">
          ALGO <span className="gold-text-gradient">SALOON</span>
        </h1>
        <p className="font-serif italic text-gold-200 text-sm sm:text-base tracking-wider mb-2">
          Look Good. Feel Great.
        </p>
        <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
          Book verified luxury salon appointments with zero upfront payment required.
        </p>

        {/* 4 Trust Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 mt-5 w-full max-w-xs text-left">
          <div className="bg-[#12121D]/90 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">{shops.length > 0 ? `${shops.length}+ Salons` : 'Verified Salons'}</p>
              <p className="text-[10px] text-gray-400">Top Rated Venues</p>
            </div>
          </div>

          <div className="bg-[#12121D]/90 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">4.9 ★ Rating</p>
              <p className="text-[10px] text-gray-400">Verified Reviews</p>
            </div>
          </div>

          <div className="bg-[#12121D]/90 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">Pay at Salon</p>
              <p className="text-[10px] text-gray-400">Cash / UPI / Card</p>
            </div>
          </div>

          <div className="bg-[#12121D]/90 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">Instant Slot</p>
              <p className="text-[10px] text-gray-400">Live Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Customer Sign Up / Sign In + Business Quick Register */}
      <div className="flex flex-col gap-2.5 z-10 pb-2 w-full max-w-sm mx-auto shrink-0">
        {/* Primary CTA: Create Account / Get Started */}
        <button
          onClick={handleCustomerStart}
          className="gold-gradient-btn w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-gold-md hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <User className="w-4 h-4 text-black" />
          <span>GET STARTED (Create Free Account)</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        {/* Secondary Action: Already Registered Sign In */}
        <button
          onClick={handleCustomerLogin}
          className="w-full py-3 px-6 rounded-2xl bg-[#151522] hover:bg-[#1C1C2C] text-gray-200 hover:text-gold-300 border border-white/10 hover:border-gold-400/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
        >
          <LogIn className="w-3.5 h-3.5 text-gold-400" />
          <span>Already registered? Sign In</span>
        </button>

        {/* Salon Owner Link */}
        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-gray-400">
          <span>Are you a Salon Owner?</span>
          <button
            onClick={handleBusinessRegister}
            className="text-gold-400 hover:text-gold-300 font-bold underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <Store className="w-3 h-3" />
            <span>Register Your Salon</span>
          </button>
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Safe & Verified Salon Network • End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};
