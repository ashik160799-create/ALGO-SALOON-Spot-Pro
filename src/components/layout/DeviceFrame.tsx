import React from 'react';
import { useApp } from '../../context/AppContext';

interface DeviceFrameProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  title?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, bottomNav, title }) => {
  const { deviceViewMode, theme } = useApp();
  const isWhite = theme === 'white';

  if (deviceViewMode === 'fullscreen') {
    return (
      <div 
        data-theme={theme}
        className={`w-full max-w-5xl mx-auto min-h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col justify-between my-0 sm:my-4 transition-colors duration-300 ${
          isWhite 
            ? 'theme-white bg-[#F8F9FD] text-[#111827] sm:border sm:border-[#EDE9FE] shadow-[0_12px_45px_rgba(126,34,206,0.08)]' 
            : 'theme-dark bg-[#0A0A0F] text-[#F3F4F6] sm:border sm:border-gold-400/20 shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.08)]'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {bottomNav && <div>{bottomNav}</div>}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-0 sm:py-3 sm:px-2">
      {title && (
        <span className={`text-xs font-bold uppercase tracking-wider mb-2 drop-shadow-sm ${
          isWhite ? 'text-purple-700' : 'text-gold-300'
        }`}>
          {title}
        </span>
      )}

      {/* Full Responsive Mobile Application Container */}
      <div 
        data-theme={theme}
        className={`relative w-full sm:max-w-[430px] min-h-screen sm:min-h-[850px] sm:h-[850px] sm:rounded-[40px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${
          isWhite
            ? 'theme-white bg-[#F8F9FD] text-[#111827] sm:border-[7px] sm:border-[#EDE9FE] shadow-[0_20px_50px_rgba(126,34,206,0.14),0_0_25px_rgba(0,0,0,0.04)] ring-0 sm:ring-1 sm:ring-purple-300/40'
            : 'theme-dark bg-[#0A0A0F] text-[#F3F4F6] sm:border-[7px] sm:border-[#1A1A26] shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.15)] ring-0 sm:ring-1 sm:ring-gold-400/25'
        }`}
      >
        {/* Scrollable Mobile Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* Bottom Navigation */}
        {bottomNav && <div className="shrink-0">{bottomNav}</div>}
      </div>
    </div>
  );
};
