import React from 'react';
import { useApp } from '../../context/AppContext';

interface DeviceFrameProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  title?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, bottomNav, title }) => {
  const { deviceViewMode } = useApp();

  if (deviceViewMode === 'fullscreen') {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[90vh] bg-[#0A0A0F] sm:rounded-2xl sm:border sm:border-[#232332] shadow-2xl overflow-hidden flex flex-col justify-between my-0 sm:my-4">
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
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
          {title}
        </span>
      )}

      {/* Full Responsive Mobile Application Container */}
      <div className="relative w-full sm:max-w-[430px] min-h-screen sm:min-h-[850px] sm:h-[850px] bg-[#0A0A0F] sm:rounded-[36px] sm:border-[6px] sm:border-[#1C1C26] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.12)] flex flex-col justify-between overflow-hidden ring-0 sm:ring-1 sm:ring-gold-400/20">
        
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
