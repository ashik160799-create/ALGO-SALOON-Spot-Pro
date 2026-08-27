import React from 'react';
import { useApp } from '../../context/AppContext';
import { supportedCurrencies } from '../../data/mockData';
import { Globe, Check, X, MapPin, Sparkles } from 'lucide-react';
import { CurrencyInfo } from '../../types';

interface CurrencySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencySwitcherModal: React.FC<CurrencySwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currency, setCurrency, userLocation, setUserLocation, detectUserLocationAndCurrency } = useApp();

  if (!isOpen) return null;

  const handleSelect = (c: CurrencyInfo) => {
    setCurrency(c);
    onClose();
  };

  const handleAutoDetect = () => {
    detectUserLocationAndCurrency();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12121A] border border-gold-400/30 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gold-400" />
            <div>
              <h3 className="font-heading text-sm font-bold text-white">
                Currency & Country
              </h3>
              <p className="text-[10px] text-gray-400">
                Current: {currency.name} ({currency.symbol})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Auto-Detect Button */}
        <button
          onClick={handleAutoDetect}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#2B2312] to-[#181826] border border-gold-400/40 text-left text-xs flex items-center justify-between group shadow-sm hover:brightness-110 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="font-bold text-gold-300 block text-xs">
                Auto-Detect Live Location & Currency
              </span>
              <span className="text-[10px] text-gray-400">
                GPS Geolocation & Country Detection
              </span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Supported Currencies Grid */}
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar pt-1">
          {supportedCurrencies.map(c => {
            const isSelected = currency.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() => handleSelect(c)}
                className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-gold-400/15 border-gold-400 text-gold-300 font-bold shadow-sm'
                    : 'bg-[#181824] border-white/5 text-gray-300 hover:border-gold-400/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <span className="text-white block font-medium">
                      {c.name} ({c.symbol})
                    </span>
                    <span className="text-[10px] text-gray-400">{c.country} • {c.code}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gold-400 text-black flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
