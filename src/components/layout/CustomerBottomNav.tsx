import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerTab } from '../../types';
import { 
  Home, 
  Scissors, 
  Calendar, 
  Wallet, 
  User 
} from 'lucide-react';

export const CustomerBottomNav: React.FC = () => {
  const { customerActiveTab, setCustomerScreen, bookings, theme } = useApp();
  const isWhite = theme === 'white';

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const tabs: { id: CustomerTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: CustomerTab) => {
    if (tabId === 'home') setCustomerScreen('home', 'home');
    else if (tabId === 'services') setCustomerScreen('services', 'services');
    else if (tabId === 'bookings') setCustomerScreen('my_bookings', 'bookings');
    else if (tabId === 'wallet') setCustomerScreen('wallet', 'wallet');
    else if (tabId === 'profile') setCustomerScreen('profile', 'profile');
  };

  return (
    <nav className={`sticky bottom-0 z-40 backdrop-blur-xl px-3 py-2 flex items-center justify-around transition-colors duration-300 ${
      isWhite
        ? 'bg-white/95 border-t border-gray-100 shadow-[0_-4px_25px_rgba(126,34,206,0.06)]'
        : 'bg-[#0A0A10]/95 border-t border-gold-400/15 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
    }`}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = customerActiveTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? isWhite
                  ? 'text-purple-700 bg-purple-50 border border-purple-200/70 shadow-[0_0_12px_rgba(126,34,206,0.12)]'
                  : 'text-gold-300 bg-gold-400/15 border border-gold-400/25 shadow-[0_0_12px_rgba(212,175,55,0.15)]' 
                : isWhite
                  ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                isActive 
                  ? isWhite 
                    ? 'scale-110 text-purple-700 drop-shadow-[0_0_8px_rgba(126,34,206,0.3)]' 
                    : 'scale-110 text-gold-300 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                  : ''
              }`} />
              {tab.id === 'bookings' && pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] bg-pink-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 animate-pulse shadow-md">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight font-medium ${
              isActive 
                ? isWhite ? 'text-purple-700 font-bold' : 'text-gold-300 font-bold' 
                : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <span className={`absolute -bottom-1 w-5 h-0.5 rounded-full ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_8px_rgba(126,34,206,0.6)]'
                  : 'bg-gradient-to-r from-gold-400 to-amber-300 shadow-[0_0_8px_rgba(212,175,55,0.9)]'
              }`} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
