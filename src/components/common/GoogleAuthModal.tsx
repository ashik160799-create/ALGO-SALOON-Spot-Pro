import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleAuthModalProps {
  role: 'customer' | 'business';
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ role, isOpen, onClose }) => {
  const { loginWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const customerAccounts = [
    {
      name: 'Ashik (Customer)',
      email: 'ashik.customer@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const businessAccounts = [
    {
      name: 'Ashik (Salon Owner)',
      email: 'ashik.salon@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Vikram Seth (ALGO Salons)',
      email: 'vikram.seth.salons@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Rohit Verma (Barber & Spa)',
      email: 'rohit.barber@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const mockGoogleAccounts = role === 'customer' ? customerAccounts : businessAccounts;

  const handleSelectAccount = (account: { name: string; email: string; avatar: string }) => {
    loginWithGoogle(role, account);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.toLowerCase().includes('@gmail.com') && !customEmail.toLowerCase().includes('@google.com')) {
      setError('Please enter a valid Gmail address (ending in @gmail.com)');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    loginWithGoogle(role, {
      name,
      email: customEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0A10] border border-gold-400/35 rounded-3xl w-full max-w-md p-6 shadow-gold-lg space-y-4 animate-in fade-in zoom-in-95 font-body">
        {/* Google Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gold-400/20">
          <div className="flex items-center gap-2.5">
            {/* Real SVG Google 'G' Logo */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <div>
              <h3 className="font-heading text-sm font-bold text-white">
                Sign In with Google
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                Choose an account for ALGO Saloon SPOT ({role === 'customer' ? 'Customer' : 'Salon Partner'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accounts List */}
        {!showCustomInput ? (
          <div className="space-y-2">
            {mockGoogleAccounts.map((acc, index) => (
              <button
                key={index}
                onClick={() => handleSelectAccount(acc)}
                className="w-full p-3 rounded-2xl bg-[#181826] hover:bg-[#202034] border border-white/5 hover:border-gold-400/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <span className="font-bold text-xs text-white group-hover:text-gold-300 transition-colors block">
                      {acc.name}
                    </span>
                    <span className="text-[11px] text-gray-400">{acc.email}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gold-400 transition-colors" />
              </button>
            ))}

            {/* Custom Google Account Option */}
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3 rounded-2xl border border-dashed border-white/15 hover:border-gold-400/40 text-xs font-semibold text-gray-300 hover:text-gold-300 flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <UserPlus className="w-4 h-4 text-gold-400" />
              <span>Use another @gmail.com account</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">Your Full Name</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Ashik"
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Gmail Address (@gmail.com)</label>
              <input
                type="email"
                value={customEmail}
                onChange={e => {
                  setCustomEmail(e.target.value);
                  setError('');
                }}
                placeholder="yourname@gmail.com"
                required
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            {error && (
              <p className="text-red-400 text-[10px] font-medium">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#181824] text-gray-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 gold-gradient-btn py-2.5 rounded-xl text-xs font-bold shadow-md"
              >
                Authenticate & Login
              </button>
            </div>
          </form>
        )}

        {/* Google OAuth Disclaimer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>To continue, Google will share your name, email address, and profile picture with ALGO Saloon.</span>
        </div>
      </div>
    </div>
  );
};
