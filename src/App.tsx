import React from 'react';
import { useApp } from './context/AppContext';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { CustomerAppRoot } from './components/customer/CustomerAppRoot';
import { BusinessAppRoot } from './components/business/BusinessAppRoot';

export const App: React.FC = () => {
  const { mode, theme } = useApp();
  const isWhite = theme === 'white';

  return (
    <div className={`min-h-screen font-body flex flex-col relative overflow-x-hidden transition-colors duration-300 ${
      isWhite 
        ? 'bg-[#F0F2F9] text-[#111827] selection:bg-purple-600 selection:text-white' 
        : 'bg-[#07070B] text-[#F3F4F6] selection:bg-gold-400 selection:text-black'
    }`}>
      {/* Background ambient lighting */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] blur-3xl pointer-events-none -z-10 ${
        isWhite 
          ? 'bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent' 
          : 'bg-gradient-to-b from-gold-500/10 via-amber-500/5 to-transparent'
      }`} />

      {/* Full Mobile App Main View */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-2 w-full">
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
    </div>
  );
};

export default App;

