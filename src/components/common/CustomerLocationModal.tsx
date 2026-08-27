import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supportedCountries } from '../../data/mockData';
import { CountryInfo } from '../../types';
import { 
  MapPin, 
  Navigation, 
  Globe, 
  Search, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomerLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  initialStep?: 'prompt' | 'country_picker';
}

export const CustomerLocationModal: React.FC<CustomerLocationModalProps> = ({ 
  isOpen, 
  onClose,
  onComplete,
  onSkip,
  initialStep = 'prompt'
}) => {
  const { 
    customerLocation, 
    requestCustomerGpsLocation, 
    setCustomerManualCountry,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const [step, setStep] = useState<'prompt' | 'country_picker'>(initialStep);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAllowLocation = async () => {
    setIsDetecting(true);
    setGpsError(null);
    try {
      const res = await requestCustomerGpsLocation();
      localStorage.setItem('algo_location_prompted', 'true');
      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        onComplete?.();
        onClose();
      } else {
        setGpsError(res.message || 'GPS location unavailable. Please select your country manually.');
        setStep('country_picker');
      }
    } catch {
      localStorage.setItem('algo_location_prompted', 'true');
      setGpsError('Could not detect location. Please choose your country manually.');
      setStep('country_picker');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectCountry = (country: CountryInfo) => {
    setCustomerManualCountry(country.code);
    localStorage.setItem('algo_location_prompted', 'true');
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('algo_location_prompted', 'true');
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
    onClose();
  };

  const filteredCountries = supportedCountries.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.currencyCode.toLowerCase().includes(q) ||
      c.phoneCountryCode.includes(q) ||
      c.defaultCity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-3xl w-full max-w-sm p-5 space-y-4 font-body animate-in fade-in zoom-in-95 shadow-xl ${
        isWhite ? 'bg-white border-purple-200 text-[#111827]' : 'bg-[#0A0A10] border-gold-400/35 text-white shadow-gold-lg'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isWhite ? 'border-gray-100' : 'border-gold-400/20'
        }`}>
          <div className="flex items-center gap-2.5">
            {step === 'country_picker' ? (
              <button
                onClick={() => setStep('prompt')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isWhite 
                    ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                    : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${
                isWhite ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gold-400/15 border-gold-400/30 text-gold-400'
              }`}>
                <Compass className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 className={`font-heading text-sm font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                {step === 'prompt' ? 'Your Location & Country' : 'Select Your Country'}
              </h3>
              <p className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gray-400'}`}>
                {customerLocation?.countryName || 'Current'}: {customerLocation?.currencyCode || 'AED'} ({customerLocation?.phoneCountryCode || '+971'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isWhite ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Permission Prompt & Explanation */}
        {step === 'prompt' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border space-y-2.5 text-left shadow-sm ${
              isWhite ? 'bg-purple-50/70 border-purple-200' : 'glass-card-gilded border-gold-400/35'
            }`}>
              <div className={`flex items-center gap-2 font-black text-xs font-heading ${
                isWhite ? 'text-purple-900' : 'text-gold-300'
              }`}>
                <MapPin className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                <span>Why Location is Needed</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                Allowing location helps us automatically find salons in your city, calculate accurate driving distance, and set your local phone code & default currency.
              </p>
              <div className={`pt-2 border-t grid grid-cols-2 gap-2 text-[10px] ${
                isWhite ? 'border-purple-200/60' : 'border-gold-400/15'
              }`}>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Real Distance in KM
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Native Salon Prices
                </span>
              </div>
            </div>

            {gpsError && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{gpsError}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleAllowLocation}
                disabled={isDetecting}
                className={`w-full py-3 rounded-2xl font-black text-xs font-heading flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-50 ${
                  isWhite 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                    : 'gold-gradient-btn text-black shadow-gold-sm hover:brightness-110'
                }`}
              >
                {isDetecting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Detecting GPS Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Allow Location</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('country_picker')}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 border ${
                  isWhite 
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700' 
                    : 'bg-[#14141E] hover:bg-gold-400/10 border-white/10 hover:border-gold-400/30 text-gray-300 hover:text-gold-300'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                <span>Select Country Manually</span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className={`w-full text-center text-[11px] py-1 transition-colors font-bold ${
                  isWhite ? 'text-gray-500 hover:text-purple-700' : 'text-gray-400 hover:text-gold-300'
                }`}
              >
                Not Now &bull; Continue as {customerLocation?.countryName || 'UAE'} ({customerLocation?.phoneCountryCode || '+971'})
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Searchable Country Picker */}
        {step === 'country_picker' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search country, currency, or dial code..."
                className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none border transition-all shadow-sm ${
                  isWhite 
                    ? 'bg-purple-50/60 border-purple-200 focus:border-purple-600 text-gray-900 placeholder-gray-400' 
                    : 'bg-[#14141E] border-white/10 focus:border-gold-400/60 text-white placeholder-gray-500'
                }`}
                autoFocus
              />
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto no-scrollbar pt-1">
              {filteredCountries.map(c => {
                const isSelected = customerLocation?.countryCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? isWhite
                          ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold shadow-sm'
                          : 'bg-gold-400/15 border-gold-400 text-gold-300 font-bold shadow-sm'
                        : isWhite
                          ? 'bg-gray-50 border-gray-100 text-gray-800 hover:bg-purple-50 hover:border-purple-200'
                          : 'bg-[#14141E] border-white/5 text-gray-300 hover:border-gold-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>{c.name}</span>
                          <span className={`text-[10px] font-mono font-bold ${isWhite ? 'text-purple-700' : 'text-gold-400'}`}>({c.phoneCountryCode})</span>
                        </div>
                        <span className={`text-[10px] block mt-0.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                          Currency: {c.currencyName} ({c.currencySymbol} {c.currencyCode})
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
