import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase, signInWithGoogle } from '../../supabaseALGOClient';
import { SupabaseAuth } from '../../services/supabaseAuthService';
import { 
  Scissors, 
  User, 
  Store, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Check,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthScreen: React.FC = () => {
  const { 
    setMode, 
    setCustomerScreen, 
    setBusinessScreen,
    registerCustomerAccount,
    authInitialTab,
    setAuthInitialTab
  } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(authInitialTab || 'signin');

  // Customer Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI / Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync auth mode when authInitialTab changes
  useEffect(() => {
    if (authInitialTab) {
      setAuthMode(authInitialTab);
    }
  }, [authInitialTab]);

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 65,
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

  // Check if user returned from email verification link in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('type=signup') || hash.includes('access_token') || search.includes('type=signup')) {
      setSuccessMsg('✅ Email confirmed successfully! Please enter your password to sign in.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please provide a valid email format (e.g. yourname@example.com).');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('For your security, password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify and re-type.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please agree to the Terms of Service & Privacy Policy to proceed.');
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        // Real Supabase Customer Sign Up
        const result = await SupabaseAuth.signUpCustomer({
          name: name.trim(),
          email: cleanEmail,
          password,
          phone: phone.trim()
        });

        if (!result.success) {
          setErrorMsg(result.error || 'Failed to create account. Please check your details and try again.');
          return;
        }

        // Security UX:
        // 1. Do NOT auto-login without email confirmation.
        // 2. Redirect user to the Sign In tab.
        // 3. Keep the email field prefilled.
        // 4. Clear password inputs from memory.
        // 5. Display high-contrast success notification.
        setAuthMode('signin');
        setAuthInitialTab('signin');
        setEmail(cleanEmail);
        setPassword('');
        setConfirmPassword('');
        triggerSuccessCelebration();
        setSuccessMsg(
          `🎉 Account created successfully! A confirmation link was sent to ${cleanEmail}. Please check your email to verify your account, then sign in below.`
        );
      } else {
        // Real Supabase Customer Sign In
        const result = await SupabaseAuth.signInCustomer({
          email: cleanEmail,
          password
        });

        if (!result.success || !result.data?.session) {
          setErrorMsg(result.error || 'Invalid email or password. Please verify your credentials or confirm your email.');
          return;
        }

        triggerSuccessCelebration();
        setSuccessMsg(`Welcome back, ${result.data?.profile.name || 'valued customer'}!`);
        
        setTimeout(() => {
          registerCustomerAccount({
            name: result.data?.profile.name || cleanEmail.split('@')[0],
            email: result.data?.profile.email || cleanEmail
          });
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Real Supabase Google OAuth Login
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      localStorage.setItem('algo_auth_intended_role', 'customer');

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
    <div className="relative min-h-[720px] h-full flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-[#101018] via-[#0A0A0E] to-[#060609] text-white overflow-y-auto no-scrollbar">
      {/* Ambient Luxury Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex items-center justify-between z-10 pt-1 pb-3 shrink-0">
        <button
          onClick={() => setCustomerScreen('splash')}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors shadow-sm active:scale-95"
          title="Back to Welcome Screen"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 bg-[#14141E] border border-gold-400/20 px-3 py-1 rounded-full shadow-sm">
          <User className="w-3 h-3 text-gold-400" />
          <span className="text-[11px] font-bold text-gold-300 uppercase tracking-wider">
            Customer Portal
          </span>
        </div>

        {/* Direct Link to Partner Portal */}
        <button
          onClick={() => {
            setMode('business');
            setBusinessScreen('auth');
          }}
          className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/25 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Partner Login</span>
        </button>
      </div>

      <div className="z-10 flex-1 flex flex-col max-w-sm mx-auto w-full my-auto py-2">
        {/* Brand Banner */}
        <div className="text-center mb-4 shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-300 via-gold-500 to-amber-600 p-0.5 shadow-gold-sm mb-2">
            <div className="w-full h-full bg-[#0E0E16] rounded-[14px] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-gold-400 -rotate-45" />
            </div>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-wide text-white">
            {authMode === 'signin' ? 'Customer Sign In' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {authMode === 'signin' 
              ? 'Sign in to book top stylists & manage appointments' 
              : 'Join ALGO to book luxury salons with zero advance fees'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Create Account) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#151522] border border-white/10 rounded-2xl mb-4 shrink-0 shadow-inner">
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
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
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
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/10 to-emerald-500/15 border border-emerald-500/35 flex items-start gap-3 text-emerald-200 text-xs shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-300">Account Notification:</span>
              <p className="leading-relaxed text-[11px] text-gray-200">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ashik Kumar"
                    required
                    className="w-full bg-[#141420] border border-[#2A2A3E] focus:border-gold-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#141420] border border-[#2A2A3E] focus:border-gold-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                required
                className="w-full bg-[#141420] border border-[#2A2A3E] focus:border-gold-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-medium text-gray-300">Password</label>
              {authMode === 'signup' && password && (
                <span className={`text-[10px] font-semibold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={authMode === 'signup' ? 8 : 6}
                className="w-full bg-[#141420] border border-[#2A2A3E] focus:border-gold-400 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Progress Bar for Sign Up */}
            {authMode === 'signup' && password.length > 0 && (
              <div className="mt-1.5 w-full bg-[#1F1F2E] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
            )}
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#141420] border border-[#2A2A3E] focus:border-gold-400 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Terms & Privacy Notice for Sign Up */}
          {authMode === 'signup' && (
            <label className="flex items-start gap-2 pt-1 text-[10.5px] text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-600 text-gold-500 focus:ring-gold-400"
              />
              <span>
                I agree to the <span className="text-gold-400 underline">Terms of Service</span> and <span className="text-gold-400 underline">Privacy Policy</span>.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-btn w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-md mt-2 disabled:opacity-50 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{authMode === 'signin' ? 'Sign In as Customer' : 'Create Customer Account'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3.5 flex items-center justify-center shrink-0">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0A0A0E] px-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
            Or Quick Access
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Google Auth & Quick Demo Buttons */}
        <div className="space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A2A] border border-white/10 hover:border-gold-400/40 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 active:scale-98"
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
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="z-10 pt-3 text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5 shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-End Encrypted & Verified with Supabase Auth</span>
      </div>
    </div>
  );
};