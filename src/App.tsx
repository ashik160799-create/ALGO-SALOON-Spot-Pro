import React from 'react';
import { useApp } from './context/AppContext';
import { TopControlBar } from './components/layout/TopControlBar';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { CustomerAppRoot } from './components/customer/CustomerAppRoot';
import { BusinessAppRoot } from './components/business/BusinessAppRoot';

export const App: React.FC = () => {
  const { mode } = useApp();

  return (
    <div className="min-h-screen bg-[#07070B] text-[#F3F4F6] font-body flex flex-col selection:bg-gold-400 selection:text-black relative overflow-x-hidden">
      {/* Background ambient luxury lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

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
      <footer className="py-2.5 text-center text-[11px] text-gray-400 border-t border-white/5 bg-[#09090E]/90 backdrop-blur-md">
        <span className="font-medium tracking-wide">
          ALGO <span className="text-gold-400 font-bold">SALOON</span> Spot Pro &copy; 2026 • Exclusive Luxury & Grooming Platform
        </span>
      </footer>
    </div>
  );
};

export default App;
