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
  Globe
} from 'lucide-react';
import { CurrencySwitcherModal } from '../common/CurrencySwitcherModal';

export const WalletScreen: React.FC = () => {
  const { customer, transactions, addWalletMoney, formatPrice, currency } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);

  const quickAmounts = [200, 500, 1000, 2000];

  const handleTopUp = () => {
    if (topUpAmount > 0) {
      addWalletMoney(topUpAmount);
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-white">
          ALGO Wallet
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-gold-400 bg-[#161622] px-2 py-1 rounded-lg border border-white/10"
          >
            <span>{currency.flag}</span>
            <span>{currency.code}</span>
          </button>
          <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Secure Vault
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Wallet Balance Gold Card (Faithful to Image 1) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D2513] via-[#1E1C25] to-[#12121B] border border-gold-400/40 p-5 shadow-gold-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400">
                <WalletIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Wallet Balance ({currency.code})
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Active Wallet
            </span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-black text-white font-heading tracking-tight">
              {formatPrice(customer.walletBalance)}
            </span>
            <span className="text-xs text-emerald-400 ml-2 font-semibold">
              Available Credits
            </span>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-gray-300">
              1-Click Instant Salon Checkout
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Money</span>
            </button>
          </div>
        </div>

        {/* Transactions History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-gold-400" />
              Recent Transactions
            </h3>
            <span className="text-[10px] text-gold-400 font-semibold">{transactions.length} Activity</span>
          </div>

          <div className="space-y-2.5">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-heading text-xs font-bold text-white">
                      {tx.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold font-heading ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-gray-200'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatPrice(tx.amount)}
                  </span>
                  <span className="block text-[9px] text-gray-500 font-medium">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-400" />
                Add Money to Wallet
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Enter Top-Up Amount ({currency.symbol})</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={e => setTopUpAmount(Number(e.target.value))}
                min="50"
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2.5 text-base font-bold text-gold-400 text-center"
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
                      ? 'bg-gold-400 text-black border-gold-400'
                      : 'bg-[#181824] text-gray-300 border-white/10'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold mt-2 shadow-md"
            >
              Recharge {formatPrice(topUpAmount)}
            </button>
          </div>
        </div>
      )}

      {/* Currency Switcher Modal */}
      <CurrencySwitcherModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />
    </div>
  );
};
