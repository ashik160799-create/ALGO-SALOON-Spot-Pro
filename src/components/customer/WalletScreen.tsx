import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  History,
  CheckCircle2,
  Globe,
  MapPin
} from 'lucide-react';
import { CustomerLocationModal } from '../common/CustomerLocationModal';

export const WalletScreen: React.FC = () => {
  const { customer, customerLocation, transactions, addWalletMoney, formatPrice, currency, theme } = useApp();
  const isWhite = theme === 'white';

  const [showAddModal, setShowAddModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);

  const quickAmounts = [200, 500, 1000, 2000];

  const handleTopUp = () => {
    if (topUpAmount > 0) {
      addWalletMoney(topUpAmount);
      setShowAddModal(false);
    }
  };

  return (
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <h2 className={`font-heading text-lg font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
          ALGO Wallet
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocationModal(true)}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border shadow-sm ${
              isWhite 
                ? 'text-purple-700 bg-purple-50 border-purple-200' 
                : 'text-gold-300 bg-[#14141E] border-gold-400/25'
            }`}
            title="Customer Currency & Location"
          >
            <span>{customerLocation?.currencySymbol || currency.symbol}</span>
            <span className={`text-[10px] font-mono ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>({customerLocation?.countryCode || 'AE'})</span>
          </button>
          <span className={`text-xs font-bold flex items-center gap-1 ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secure Vault
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Wallet Balance Card */}
        <div className={`relative overflow-hidden rounded-3xl p-5 border shadow-sm ${
          isWhite 
            ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200 shadow-[0_4px_20px_rgba(126,34,206,0.08)]' 
            : 'glass-card-gilded border-gold-400/40 shadow-gold-md'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                isWhite ? 'bg-purple-100 text-purple-700' : 'bg-gold-400/20 text-gold-300'
              }`}>
                <WalletIcon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                isWhite ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Wallet Balance ({currency.code})
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm">
              Active Wallet
            </span>
          </div>

          <div className="mb-4">
            <span className={`text-3xl font-black font-heading tracking-tight ${
              isWhite ? 'text-gray-900' : 'text-white'
            }`}>
              {formatPrice(customer.walletBalance)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2 font-bold">
              Available Credits
            </span>
          </div>

          <div className={`pt-3 border-t flex items-center justify-between ${
            isWhite ? 'border-gray-200' : 'border-gold-400/20'
          }`}>
            <span className={`text-[11px] font-medium ${
              isWhite ? 'text-gray-600' : 'text-gray-300'
            }`}>
              1-Click Instant Salon Checkout
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 transition-all ${
                isWhite 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                  : 'gold-gradient-btn text-black'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Money</span>
            </button>
          </div>
        </div>

        {/* Transactions History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-heading text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isWhite ? 'text-gray-700' : 'text-gray-400'
            }`}>
              <History className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
              Recent Transactions
            </h3>
            <span className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>{transactions.length} Activity</span>
          </div>

          <div className="space-y-2.5">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                  isWhite 
                    ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' 
                    : 'glass-card-obsidian border-white/10 hover:border-gold-400/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
                    tx.type === 'credit'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className={`font-heading text-xs font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                      {tx.title}
                    </h4>
                    <span className={`text-[10px] font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black font-heading ${
                    tx.type === 'credit' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : isWhite ? 'text-gray-900' : 'text-gray-200'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatPrice(tx.amount)}
                  </span>
                  <span className={`block text-[9px] font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl ${
            isWhite ? 'bg-white border-purple-200' : 'bg-[#14141E] border-gold-400/30'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-heading font-black text-base flex items-center gap-2 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                <CreditCard className={`w-5 h-5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Add Money to Wallet
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 font-bold ${isWhite ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                Enter Top-Up Amount ({currency.symbol})
              </label>
              <input
                type="number"
                value={topUpAmount}
                onChange={e => setTopUpAmount(Number(e.target.value))}
                min="50"
                className={`w-full rounded-xl px-3 py-2.5 text-base font-black text-center outline-none ${
                  isWhite 
                    ? 'bg-purple-50 border border-purple-200 text-purple-700 focus:border-purple-500' 
                    : 'bg-[#181824] border border-[#2B2B3E] text-gold-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    topUpAmount === amt
                      ? isWhite ? 'bg-purple-600 text-white border-purple-600' : 'bg-gold-400 text-black border-gold-400'
                      : isWhite ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50' : 'bg-[#181824] text-gray-300 border-white/10'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              className={`w-full py-3 rounded-xl text-xs font-bold mt-2 shadow-md transition-all ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
                  : 'gold-gradient-btn text-black'
              }`}
            >
              Recharge {formatPrice(topUpAmount)}
            </button>
          </div>
        </div>
      )}

      {/* Customer Location & Currency Modal */}
      <CustomerLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
};
