import React from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessTab } from '../../types';
import { 
  Home, 
  Users, 
  Scissors, 
  CalendarCheck, 
  BarChart3, 
  Settings 
} from 'lucide-react';

export const BusinessBottomNav: React.FC = () => {
  const { businessActiveTab, setBusinessScreen, bookings } = useApp();

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const tabs: { id: BusinessTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'appointments', label: 'Bookings', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: BusinessTab) => {
    if (tabId === 'home') setBusinessScreen('dashboard', 'home');
    else if (tabId === 'staff') setBusinessScreen('staff_mgr', 'staff');
    else if (tabId === 'services') setBusinessScreen('services_mgr', 'services');
    else if (tabId === 'appointments') setBusinessScreen('appointments', 'appointments');
    else if (tabId === 'reports') setBusinessScreen('reports', 'reports');
    else if (tabId === 'settings') setBusinessScreen('settings', 'settings');
  };

  return (
    <nav className="sticky bottom-0 z-40 bg-[#0B0B12]/95 backdrop-blur-xl border-t border-[#1F1F2E] px-2 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = businessActiveTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'text-gold-400 bg-gold-400/10 shadow-inner' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`} />
              {tab.id === 'appointments' && pendingCount > 0 && (
                <span className="absolute -top-1 -right-2.5 min-w-[16px] h-[16px] bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center px-1 animate-pulse shadow-md">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${isActive ? 'text-gold-400 font-bold' : 'text-gray-400'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-5 h-0.5 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
