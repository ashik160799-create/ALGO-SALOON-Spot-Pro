import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Store, 
  Download,
  FileSpreadsheet,
  BarChart3,
  PieChart
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { 
    bookings, 
    exportRevenueToCSV, 
    exportBookingsToCSV, 
    exportInventoryToCSV, 
    exportPayrollToCSV, 
    setBusinessScreen,
    formatPrice,
    currency 
  } = useApp();

  const confirmedOrCompleted = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
  const totalRevenue = confirmedOrCompleted.reduce((acc, b) => acc + b.totalAmount, 0);

  const payAtSalonCount = bookings.filter(b => b.paymentMethod === 'pay_at_salon').length;
  const upiCount = bookings.filter(b => b.paymentMethod === 'upi' || b.paymentMethod === 'wallet').length;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = daysOfWeek.map(day => {
    const dayBookings = confirmedOrCompleted.filter(b => {
      if (!b.date) return false;
      const bDate = new Date(b.date);
      const bDay = isNaN(bDate.getTime()) ? '' : bDate.toLocaleDateString('en-US', { weekday: 'short' });
      return bDay === day || (b.formattedDate && b.formattedDate.startsWith(day));
    });
    const rev = dayBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    return {
      day,
      revenue: rev,
      appointments: dayBookings.length
    };
  });

  const maxRev = Math.max(1, ...weeklyData.map(d => d.revenue));

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Reports & Analytics
            </h2>
            <p className="text-[10px] text-gold-400">Financial Statements ({currency.code})</p>
          </div>
        </div>

        <button
          onClick={exportRevenueToCSV}
          className="p-2 rounded-xl bg-[#161622] border border-white/10 hover:border-gold-400/40 text-gray-300 hover:text-gold-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Download Revenue CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Top Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 rounded-2xl border border-gold-400/30">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-gold-400" />
            </div>
            <p className="text-xl font-extrabold text-gold-400 font-heading mt-2">
              {formatPrice(totalRevenue)}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +18.4% this month
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Bookings</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-white font-heading mt-2">
              {bookings.length}
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {confirmedOrCompleted.length} Completed / Confirmed
            </span>
          </div>
        </div>

        {/* Weekly Revenue Bar Chart */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-gold-400" />
              Weekly Revenue Volume ({currency.code})
            </h3>
            <span className="text-[10px] text-gold-400 font-bold">This Week</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1">
            {weeklyData.map(d => {
              const heightPct = (d.revenue / maxRev) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] text-gray-400">{formatPrice(d.revenue)}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-md hover:brightness-110 transition-all min-h-[8px]"
                    title={`${d.day}: ${formatPrice(d.revenue)} (${d.appointments} appointments)`}
                  />
                  <span className="text-[10px] font-bold text-gray-300">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSV & Excel Data Export Suite */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
          <h3 className="font-heading text-xs font-bold text-white flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-gold-400" />
            Data Export & Financial Reports
          </h3>
          <p className="text-[11px] text-gray-400">
            Download formatted CSV files ready for accounting, Excel, or Google Sheets.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={exportRevenueToCSV}
              className="p-3 rounded-xl bg-[#161624] border border-white/10 hover:border-gold-400/40 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center justify-between text-gold-400">
                <DollarSign className="w-4 h-4" />
                <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="font-heading text-xs font-bold text-white block">Revenue Ledger</span>
              <span className="text-[10px] text-gray-400 block">All completed sales & tax</span>
            </button>

            <button
              onClick={exportBookingsToCSV}
              className="p-3 rounded-xl bg-[#161624] border border-white/10 hover:border-gold-400/40 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center justify-between text-blue-400">
                <Calendar className="w-4 h-4" />
                <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="font-heading text-xs font-bold text-white block">Bookings Log</span>
              <span className="text-[10px] text-gray-400 block">Full appointment queue</span>
            </button>

            <button
              onClick={exportInventoryToCSV}
              className="p-3 rounded-xl bg-[#161624] border border-white/10 hover:border-gold-400/40 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center justify-between text-emerald-400">
                <CreditCard className="w-4 h-4" />
                <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="font-heading text-xs font-bold text-white block">Inventory CSV</span>
              <span className="text-[10px] text-gray-400 block">Stock counts & valuation</span>
            </button>

            <button
              onClick={exportPayrollToCSV}
              className="p-3 rounded-xl bg-[#161624] border border-white/10 hover:border-gold-400/40 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center justify-between text-amber-400">
                <Store className="w-4 h-4" />
                <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <span className="font-heading text-xs font-bold text-white block">Payroll CSV</span>
              <span className="text-[10px] text-gray-400 block">Stylist commissions</span>
            </button>
          </div>
        </div>

        {/* Payment Channels Split */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
          <h3 className="font-heading text-xs font-bold text-white flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-gold-400" />
            Payment Methods Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-gray-300">Pay at Salon (Cash / Card at counter)</span>
              </div>
              <span className="font-bold text-white">{payAtSalonCount} Bookings</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-gray-300">Online & ALGO Wallet</span>
              </div>
              <span className="font-bold text-white">{upiCount} Bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
