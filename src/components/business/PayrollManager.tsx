import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  DollarSign, 
  Users, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  Award, 
  ShieldCheck,
  Scissors
} from 'lucide-react';
import { PayrollRecord } from '../../types';
import confetti from 'canvas-confetti';

export const PayrollManager: React.FC = () => {
  const { payrolls, markPayrollPaid, exportPayrollToCSV, setBusinessScreen, formatPrice, currency } = useApp();
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const totalPayout = payrolls.reduce((acc, p) => acc + p.netPayout, 0);
  const totalServicesCount = payrolls.reduce((acc, p) => acc + p.servicesRenderedCount, 0);
  const totalCommission = payrolls.reduce((acc, p) => acc + p.commissionAmount, 0);

  const handlePay = (id: string) => {
    markPayrollPaid(id);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-full pb-24 bg-[#08080C] text-[#F3F4F6] font-body">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A10]/95 backdrop-blur-xl px-4 py-3 border-b border-gold-400/15 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#14141E] border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-300 hover:border-gold-400/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Employee Payroll & Commissions
            </h2>
            <p className="text-[10px] text-gold-300 font-semibold">Monthly Compensation Ledger ({currency.code})</p>
          </div>
        </div>

        <button
          onClick={exportPayrollToCSV}
          className="p-2 rounded-xl bg-[#14141E] border border-white/10 hover:border-gold-400/40 text-gray-300 hover:text-gold-300 text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
          title="Download Payroll CSV"
        >
          <Download className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Metric Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card-gilded p-3 rounded-2xl border border-gold-400/35 text-center shadow-gold-sm">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-semibold font-heading">Total Payroll</span>
            <p className="text-sm font-black text-gold-300 font-heading mt-0.5">
              {formatPrice(totalPayout)}
            </p>
          </div>

          <div className="glass-card-obsidian p-3 rounded-2xl border border-white/10 text-center shadow-sm">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-semibold font-heading">Commissions</span>
            <p className="text-sm font-black text-emerald-400 font-heading mt-0.5">
              {formatPrice(totalCommission)}
            </p>
          </div>

          <div className="glass-card-obsidian p-3 rounded-2xl border border-white/10 text-center shadow-sm">
            <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-semibold font-heading">Total Services</span>
            <p className="text-sm font-black text-white font-heading mt-0.5">
              {totalServicesCount}
            </p>
          </div>
        </div>

        {/* Payroll Records List */}
        <div className="space-y-3">
          {payrolls.length === 0 ? (
            <div className="glass-card-obsidian p-8 rounded-3xl text-center space-y-3 my-4 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400 shadow-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-sm font-bold text-white">No Payroll Cycles Generated</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Staff commission records and salary disbursals will be automatically compiled as stylists complete appointments.
              </p>
            </div>
          ) : (
            payrolls.map(record => {
            const isPaid = record.status === 'Paid';
            return (
              <div
                key={record.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 shadow-sm ${
                  isPaid
                    ? 'glass-card-obsidian border-white/10'
                    : 'glass-card-gilded border-gold-400/40 shadow-gold-sm'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <div>
                    <span className="font-bold text-white block">{record.stylistName}</span>
                    <span className="text-[10px] text-gray-400">{record.role} • {record.month}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPaid ? 'status-badge-completed' : 'status-badge-pending animate-pulse'
                  }`}>
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-[#14141E] p-2 rounded-xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 block text-[9px]">Base Salary</span>
                    <span className="font-bold text-white">{formatPrice(record.baseSalary)}</span>
                  </div>
                  <div className="bg-[#14141E] p-2 rounded-xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 block text-[9px]">Commission</span>
                    <span className="font-bold text-emerald-400">{formatPrice(record.commissionAmount)}</span>
                  </div>
                  <div className="bg-[#14141E] p-2 rounded-xl border border-white/5 shadow-inner">
                    <span className="text-gray-400 block text-[9px]">Net Payout</span>
                    <span className="font-bold text-gold-300 font-heading">{formatPrice(record.netPayout)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-gray-400">
                    {record.servicesRenderedCount} services rendered ({formatPrice(record.serviceRevenueGenerated)} sales)
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPayslip(record)}
                      className="px-2.5 py-1 rounded-lg bg-[#14141E] hover:bg-gold-400/10 text-gray-300 hover:text-gold-300 text-[11px] font-semibold border border-white/10 transition-colors shadow-sm"
                    >
                      Payslip
                    </button>

                    {!isPaid && (
                      <button
                        onClick={() => handlePay(record.id)}
                        className="gold-gradient-btn px-3 py-1 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95"
                      >
                        Disburse Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/40 rounded-3xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gold-400" />
                <span>Payslip: {selectedPayslip.stylistName}</span>
              </h3>
              <button onClick={() => setSelectedPayslip(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-white/5">
              <div className="flex justify-between py-1 text-gray-300">
                <span>Month</span>
                <span className="font-bold text-white">{selectedPayslip.month}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-300">
                <span>Base Salary</span>
                <span className="font-bold text-white">{formatPrice(selectedPayslip.baseSalary)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-300">
                <span>Commission ({selectedPayslip.commissionRate}%)</span>
                <span className="font-bold text-emerald-400">+{formatPrice(selectedPayslip.commissionAmount)}</span>
              </div>
              {selectedPayslip.bonus > 0 && (
                <div className="flex justify-between py-1 text-gray-300">
                  <span>Performance Bonus</span>
                  <span className="font-bold text-emerald-400">+{formatPrice(selectedPayslip.bonus)}</span>
                </div>
              )}
              {selectedPayslip.deductions > 0 && (
                <div className="flex justify-between py-1 text-gray-300">
                  <span>TDS / Deductions</span>
                  <span className="font-bold text-red-400">-{formatPrice(selectedPayslip.deductions)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-extrabold text-white">
                <span>Net Compensation</span>
                <span className="text-gold-400 font-heading text-base">{formatPrice(selectedPayslip.netPayout)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Payslip for ${selectedPayslip.stylistName} sent to email.`);
                setSelectedPayslip(null);
              }}
              className="gold-gradient-btn w-full py-2.5 rounded-xl text-xs font-bold"
            >
              Email Official Payslip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
