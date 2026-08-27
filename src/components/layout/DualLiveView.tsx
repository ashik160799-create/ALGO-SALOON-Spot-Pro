import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerAppRoot } from '../customer/CustomerAppRoot';
import { BusinessAppRoot } from '../business/BusinessAppRoot';
import { ArrowRight, Sparkles, Store, User, CheckCircle2, Clock } from 'lucide-react';

export const DualLiveView: React.FC = () => {
  const { bookings } = useApp();
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      {/* Unified Platform Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 bg-gold-400/10 border border-gold-400/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Real-Time Live Ecosystem
        </span>
        <h2 className="font-heading text-xl font-black text-white">
          Unified Customer & Salon Business Platform
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Connected live to PostgreSQL Supabase database & real-time sync
        </p>
      </div>

      {/* Side-by-side devices layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-center">
        {/* Customer App Container */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 bg-[#161622] px-3 py-1.5 rounded-xl border border-gold-400/30">
            <User className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Mobile App
            </span>
          </div>

          <div className="w-full max-w-[390px] h-[800px] bg-[#0A0A0F] rounded-[44px] border-[8px] border-[#1C1C26] shadow-2xl flex flex-col justify-between overflow-hidden ring-1 ring-gold-400/20">
            <CustomerAppRoot />
          </div>
        </div>

        {/* Business Management Portal Container */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 bg-[#161622] px-3 py-1.5 rounded-xl border border-gold-400/30">
            <Store className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Shop Partner Portal
            </span>
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>

          <div className="w-full max-w-[390px] h-[800px] bg-[#0A0A0F] rounded-[44px] border-[8px] border-[#1C1C26] shadow-2xl flex flex-col justify-between overflow-hidden ring-1 ring-gold-400/20">
            <BusinessAppRoot />
          </div>
        </div>
      </div>
    </div>
  );
};
