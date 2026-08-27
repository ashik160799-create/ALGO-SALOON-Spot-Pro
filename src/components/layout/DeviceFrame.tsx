import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  title?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, bottomNav, title }) => {
  const { deviceViewMode } = useApp();

  // Current time for status bar
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (deviceViewMode === 'fullscreen') {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[85vh] bg-[#0A0A0F] rounded-2xl border border-[#232332] shadow-2xl overflow-hidden flex flex-col justify-between my-4">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {bottomNav && <div>{bottomNav}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2">
      {title && (
        <span className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
          {title}
        </span>
      )}

      {/* Realistic Mobile Device Mockup */}
      <div className="relative w-full max-w-[400px] h-[820px] bg-[#0A0A0F] rounded-[48px] border-[10px] border-[#1C1C26] shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.15)] flex flex-col justify-between overflow-hidden ring-1 ring-gold-400/20">
        
        {/* Dynamic Island / Status Bar */}
        <div className="pt-3 px-6 pb-2 bg-[#0A0A0F] z-40 flex items-center justify-between text-xs text-gray-300 select-none shrink-0">
          <span className="font-semibold text-xs text-white">{timeString || '9:41'}</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span className="w-2 h-2 rounded-full bg-gold-400/20" />
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
        </div>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Bottom Nav Bar */}
        {bottomNav && <div className="shrink-0">{bottomNav}</div>}

        {/* Home Indicator Bar */}
        <div className="w-full bg-[#0A0A0F] pt-1 pb-2 flex justify-center shrink-0">
          <div className="w-32 h-1 bg-gray-500 rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};
