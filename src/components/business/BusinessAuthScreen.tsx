import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase, signInWithGoogle } from '../../supabaseALGOClient';
import { SupabaseAuth } from '../../services/supabaseAuthService';
import { 
  Store, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  FileText,
  Navigation,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BusinessAuthScreen: React.FC = () => {
  const { 
    registerBusinessOwnerAccount, 
    setBusinessScreen, 
    setMode, 
    setCustomerScreen,
    userLocation,
    authInitialTab,
    setAuthInitialTab,
    theme
  } = useApp();

  const isWhite = theme === 'white';
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(authInitialTab || 'signin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState(userLocation || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [agreePartnerTerms, setAgreePartnerTerms] = useState(true);

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Sync auth mode when authInitialTab changes
  useEffect(() => {
    if (authInitialTab) {
      setAuthMode(authInitialTab);
    }
  }, [authInitialTab]);

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // RFC Email Validation Helper
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Real-time Password Strength Evaluation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak (8+ chars recommended)', color: 'bg-red-500', text: 'text-red-400', percent: 25 };
      case 2:
        return { score: 2, label: 'Fair (Add letters & numbers)', color: 'bg-amber-500', text: 'text-amber-400', percent: 50 };
      case 3:
        return { score: 3, label: 'Good (Almost there)', color: 'bg-yellow-400', text: 'text-yellow-400', percent: 75 };
      case 4:
        return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-400', percent: 100 };
      default:
        return { score: 0, label: 'Too short (min 8 chars)', color: 'bg-red-600', text: 'text-red-400', percent: 15 };
    }
  }, [password]);

  // Check if partner returned from email verification link in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('type=signup') || hash.includes('access_token') || search.includes('type=signup')) {
      setSuccessMsg('✅ Business email confirmed successfully! Please enter your password to sign in.');
      setAuthMode('signin');
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      });
    } else if (hash.includes('error_description')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const desc = params.get('error_description');
      if (desc) {
        setErrorMsg(decodeURIComponent(desc.replace(/\+/g, ' ')));
      }
    }
  }, []);

  const handleFetchCurrentGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const url = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
          setGoogleMapsUrl(url);
          setSuccessMsg(`Google Maps GPS coordinates pinned successfully!`);
        },
        () => {
          setGoogleMapsUrl(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both business email and password.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    if (authMode === 'signup') {
      if (!shopName.trim()) {
        setErrorMsg('Please enter your Salon / Shop name.');
        return;
      }
      if (!ownerName.trim()) {
        setErrorMsg('Please enter the owner or manager name.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Partner account password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreePartnerTerms) {
        setErrorMsg('Please agree to the Salon Partner Terms & Merchant Agreement.');
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        // Real Supabase Business Partner Sign Up
        const result = await SupabaseAuth.signUpBusiness({
          shopName: shopName.trim(),
          ownerName: ownerName.trim(),
          email: cleanEmail,
          password,
          phone: phone.trim(),
          address: address.trim(),
          googleMapsUrl: googleMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(address)}`
        });

        if (!result.success) {
          setErrorMsg(result.error || 'Partner registration failed. Please try again.');
          return;
        }

        triggerSuccessCelebration();
        registerBusinessOwnerAccount({
          shopName: result.data?.shop?.name || shopName.trim(),
          phone: result.data?.shop?.phone || phone.trim(),
          email: cleanEmail,
          address: result.data?.shop?.address || address.trim(),
          googleMapsUrl: result.data?.shop?.googleMapsUrl || googleMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(address)}`
        });
        setMode('business');
        setBusinessScreen('dashboard', 'home');
      } else {
        // Real Supabase Business Partner Sign In
        const result = await SupabaseAuth.signInBusiness({
          email: cleanEmail,
          password
        });

        if (!result.success || !result.data?.session) {
          setErrorMsg(result.error || 'Invalid business credentials. Please verify your email and password.');
          return;
        }

        if (result.data.requiresShopRegistration || !result.data.shop) {
          // Account exists in Supabase Auth (e.g. from Customer signup), but no Salon registered yet (Gate 2)
          triggerSuccessCelebration();
          setSuccessMsg(`Account verified! No Salon is registered under this email yet. Please complete Salon Business Registration to unlock your Business Portal.`);
          setMode('business');
          setTimeout(() => {
            setBusinessScreen('register_shop');
          }, 800);
          return;
        }

        triggerSuccessCelebration();
        setSuccessMsg(`Welcome back to ${result.data.shop.name}!`);
        
        registerBusinessOwnerAccount({
          shopName: result.data.shop.name,
          phone: result.data.shop.phone || '',
          email: cleanEmail,
          address: result.data.shop.address || '',
          googleMapsUrl: result.data.shop.googleMapsUrl || ''
        });
        setMode('business');
        setBusinessScreen('dashboard', 'home');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Partner authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Real Supabase Google OAuth Login
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      localStorage.setItem('algo_auth_intended_role', 'business');

      const { error } = await signInWithGoogle({
        redirectTo: window.location.origin
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed.');
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-[720px] h-full flex flex-col justify-between p-5 sm:p-6 font-body overflow-y-auto no-scrollbar transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Ambient Glows */}
      <div className={`absolute top-0 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
        isWhite ? 'bg-purple-300/20' : 'bg-gold-400/10'
      }`} />
      <div className={`absolute bottom-10 left-0 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
        isWhite ? 'bg-pink-300/15' : 'bg-gold-500/5'
      }`} />

      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 pt-1 pb-3 shrink-0">
        <button
          onClick={() => {
            setMode('customer');
            setCustomerScreen('splash');
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 ${
            isWhite
              ? 'bg-white hover:bg-purple-50 border border-purple-200 text-gray-700 hover:text-purple-700'
              : 'bg-[#14141E] hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 text-gray-300 hover:text-gold-300'
          }`}
          title="Back to Welcome Screen"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm ${
          isWhite 
            ? 'bg-purple-50 border border-purple-200 text-purple-700' 
            : 'bg-[#14141E] border border-gold-400/30 text-gold-300'
        }`}>
          <Store className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-widest font-heading">
            Business Partner Portal
          </span>
        </div>

        <button
          onClick={() => {
            setMode('customer');
            setCustomerScreen('auth');
          }}
          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm ${
            isWhite
              ? 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300'
              : 'text-gold-300 bg-[#14141E] hover:bg-gold-400/15 border border-gold-400/30'
          }`}
        >
          Customer App
        </button>
      </div>

      <div className="z-10 flex-1 flex flex-col max-w-sm mx-auto w-full my-auto py-2">
        {/* Banner */}
        <div className="text-center mb-4 shrink-0">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl p-0.5 mb-2 shadow-sm ${
            isWhite 
              ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500' 
              : 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-sm'
          }`}>
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isWhite ? 'bg-white text-purple-700' : 'bg-[#0E0E16] text-gold-400'
            }`}>
              <Store className="w-6 h-6" />
            </div>
          </div>
          <h2 className={`font-heading text-2xl font-black tracking-wide ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            {authMode === 'signin' ? 'Partner Sign In' : 'Register Your Shop'}
          </h2>
          <p className={`text-xs mt-1 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            {authMode === 'signin' 
              ? 'Access appointments, stylist management, inventory & payouts'
              : 'Join ALGO salon network and grow your client bookings'
            }
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Register) */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-2xl mb-4 shrink-0 shadow-inner ${
          isWhite ? 'bg-gray-100 border border-gray-200' : 'bg-[#14141E] border border-white/10'
        }`}>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setAuthInitialTab('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              authMode === 'signin'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            Partner Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthInitialTab('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              authMode === 'signup'
                ? isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'gold-gradient-btn shadow-sm'
                : isWhite
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            Register Your Shop
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/10 to-emerald-500/15 border border-emerald-500/35 flex items-start gap-3 text-emerald-400 text-xs shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-500">Partner Notice:</span>
              <p className="leading-relaxed text-[11px] font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Partner Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'signup' && (
            <>
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Salon / Business Name</label>
                <div className="relative">
                  <Store className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    placeholder="e.g. Royal Crown Salon & Spa"
                    required
                    className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors ${
                      isWhite 
                        ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                        : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Owner / Manager Name</label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="e.g. Mohammed Al-Rashid"
                    required
                    className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors ${
                      isWhite 
                        ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                        : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Email Address</label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="partner@salon.com"
                required
                className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors ${
                  isWhite 
                    ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                    : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-[11px] font-bold ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Password</label>
              {authMode === 'signup' && password && (
                <span className={`text-[10px] font-bold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={authMode === 'signup' ? 8 : 6}
                className={`w-full rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none transition-colors ${
                  isWhite 
                    ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                    : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Progress Bar for Sign Up */}
            {authMode === 'signup' && password.length > 0 && (
              <div className={`mt-1.5 w-full h-1.5 rounded-full overflow-hidden ${isWhite ? 'bg-gray-200' : 'bg-[#1F1F2E]'}`}>
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
            )}
          </div>

          {authMode === 'signup' && (
            <>
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Confirm Password</label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none transition-colors ${
                      isWhite 
                        ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                        : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Physical Address</label>
                <div className="relative">
                  <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Al Wasl Road, Jumeirah 1, Dubai"
                    required
                    className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors ${
                      isWhite 
                        ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                        : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>Google Maps Share URL</label>
                <div className="relative">
                  <Navigation className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={e => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors ${
                      isWhite 
                        ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm'
                        : 'bg-[#161424] border border-[#2D2A44] focus:border-gold-400 text-white placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Terms & Privacy Notice for Sign Up */}
          {authMode === 'signup' && (
            <label className={`flex items-start gap-2 pt-1 text-[11px] cursor-pointer select-none ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
              <input
                type="checkbox"
                checked={agreePartnerTerms}
                onChange={e => setAgreePartnerTerms(e.target.checked)}
                className={`mt-0.5 rounded ${isWhite ? 'text-purple-600 focus:ring-purple-400' : 'text-amber-500 focus:ring-amber-400'}`}
              />
              <span>
                I agree to the <span className={isWhite ? 'text-purple-700 underline font-bold' : 'text-amber-400 underline font-bold'}>Partner Merchant Agreement</span> and <span className={isWhite ? 'text-purple-700 underline font-bold' : 'text-amber-400 underline font-bold'}>Salon Standards</span>.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-all hover:brightness-110 active:scale-[0.98] ${
              isWhite
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-md'
                : 'gold-gradient-btn shadow-gold-md text-black'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{authMode === 'signin' ? 'Sign In to Partner Dashboard' : 'Register & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3.5 flex items-center justify-center shrink-0">
          <div className={`border-t w-full ${isWhite ? 'border-gray-200' : 'border-white/10'}`} />
          <span className={`px-2 text-[10px] uppercase tracking-wider font-bold ${
            isWhite ? 'bg-[#F8F9FD] text-gray-500' : 'bg-[#0A0A0E] text-gray-400'
          }`}>
            Or Quick Access
          </span>
          <div className={`border-t w-full ${isWhite ? 'border-gray-200' : 'border-white/10'}`} />
        </div>

        {/* Google & Demo Partner Buttons */}
        <div className="space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 active:scale-98 ${
              isWhite
                ? 'bg-white hover:bg-gray-50 border border-purple-200 text-gray-800 shadow-sm'
                : 'bg-[#161424] hover:bg-[#1E1C30] border border-white/10 hover:border-amber-400/40 text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.98 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Partner Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className={`z-10 pt-3 text-center text-[10px] flex items-center justify-center gap-1.5 shrink-0 ${
        isWhite ? 'text-gray-500 font-medium' : 'text-gray-400'
      }`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Verified Partner Portal with Supabase Protected Session</span>
      </div>
    </div>
  );
};
