import React from 'react';
import { useApp } from './context/AppContext';
import { TopControlBar } from './components/layout/TopControlBar';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { CustomerAppRoot } from './components/customer/CustomerAppRoot';
import { BusinessAppRoot } from './components/business/BusinessAppRoot';

export const App: React.FC = () => {
  const { mode } = useApp();

  return (
    <div className="min-h-screen bg-[#07070B] text-white flex flex-col selection:bg-gold-400 selection:text-black">
      {/* Top Header Navigation */}
      <TopControlBar />

      {/* Full Mobile App Main View */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 w-full">
        {mode === 'customer' ? (
          <DeviceFrame>
            <CustomerAppRoot />
          </DeviceFrame>
        ) : (
          <DeviceFrame>
            <BusinessAppRoot />
          </DeviceFrame>
        )}
      </main>

      {/* App Footer */}
      <footer className="py-2 text-center text-[11px] text-gray-500 border-t border-white/5 bg-[#0A0A0F]">
        <span>ALGO Saloon Spot &copy; 2026 • Real-Time Mobile Platform</span>
      </footer>
    </div>
  );
};

export default App;
