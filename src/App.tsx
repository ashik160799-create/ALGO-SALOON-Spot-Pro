import React from 'react';
import { useApp } from './context/AppContext';
import { TopControlBar } from './components/layout/TopControlBar';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { CustomerAppRoot } from './components/customer/CustomerAppRoot';
import { BusinessAppRoot } from './components/business/BusinessAppRoot';
import { DualLiveView } from './components/layout/DualLiveView';

export const App: React.FC = () => {
  const { mode, deviceViewMode } = useApp();

  return (
    <div className="min-h-screen bg-[#07070B] text-white flex flex-col selection:bg-gold-400 selection:text-black">
      {/* Sticky Top Control Header */}
      <TopControlBar />

      {/* Main View Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        {deviceViewMode === 'dual' ? (
          <DualLiveView />
        ) : mode === 'customer' ? (
          <DeviceFrame>
            <CustomerAppRoot />
          </DeviceFrame>
        ) : (
          <DeviceFrame>
            <BusinessAppRoot />
          </DeviceFrame>
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-2 text-center text-[11px] text-gray-500 border-t border-white/5 bg-[#0A0A0F]">
        <span>ALGO Saloon Spot &copy; 2026 • Premium Salon & Spa Booking Ecosystem</span>
      </footer>
    </div>
  );
};

export default App;
