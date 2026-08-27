import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle2, 
  Tag, 
  Wallet, 
  Clock, 
  Info, 
  Trash2,
  CalendarCheck 
} from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    setCustomerScreen, 
    setCurrentBookingDetail, 
    bookings,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />;
      case 'offer':
        return <Tag className={`w-4 h-4 ${isWhite ? 'text-pink-600' : 'text-amber-400'}`} />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className={`w-4 h-4 ${isWhite ? 'text-gray-600' : 'text-gray-400'}`} />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.bookingId) {
      const b = bookings.find(item => item.id === notif.bookingId);
      if (b) {
        setCurrentBookingDetail(b);
        setCustomerScreen('booking_details');
      }
    }
  };

  return (
    <div className={`min-h-full pb-24 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('home')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className={`font-heading text-base font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            Notifications
          </h2>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-gray-400 hover:text-red-500 font-bold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className={`p-8 rounded-3xl text-center space-y-2 my-8 border ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card-obsidian border-white/10'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm border ${
              isWhite ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gold-400/10 border border-gold-400/20 text-gold-300'
            }`}>
              <Bell className="w-6 h-6" />
            </div>
            <p className={`text-sm font-black ${isWhite ? 'text-gray-900' : 'text-gray-300'}`}>No new notifications</p>
            <p className={`text-xs font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-sm ${
                notif.isRead
                  ? isWhite
                    ? 'bg-white/80 border-gray-100 opacity-75 hover:opacity-100'
                    : 'glass-card-obsidian border-white/5 opacity-80 hover:opacity-100 hover:border-white/15'
                  : isWhite
                    ? 'bg-white border-purple-200 shadow-[0_2px_12px_rgba(126,34,206,0.08)] ring-1 ring-purple-300'
                    : 'glass-card-gilded border-gold-400/35 shadow-gold-sm ring-1 ring-gold-400/20'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm border ${
                isWhite ? 'bg-purple-50 border-purple-200' : 'bg-[#14141E] border-white/10'
              }`}>
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-heading text-xs font-black ${
                    notif.isRead 
                      ? isWhite ? 'text-gray-600' : 'text-gray-300' 
                      : isWhite ? 'text-gray-900' : 'text-white'
                  }`}>
                    {notif.title}
                  </h4>
                  <span className={`text-[10px] shrink-0 font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                    {notif.time}
                  </span>
                </div>

                <p className={`text-[11px] mt-1 leading-snug font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                  {notif.message}
                </p>

                {notif.bookingId && (
                  <span className={`inline-block mt-1.5 text-[10px] font-bold hover:underline ${
                    isWhite ? 'text-purple-700' : 'text-gold-300'
                  }`}>
                    View Appointment #{notif.bookingId} →
                  </span>
                )}
              </div>

              {!notif.isRead && (
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1 shadow-sm ${
                  isWhite ? 'bg-purple-600' : 'bg-gold-400'
                }`} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
