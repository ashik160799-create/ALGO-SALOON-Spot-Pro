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
    bookings 
  } = useApp();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-gold-400" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-amber-400" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
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
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('home')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-heading text-base font-bold text-white">
            Notifications
          </h2>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-gray-400 hover:text-red-400 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center space-y-2 my-8 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-300">No new notifications</p>
            <p className="text-xs text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                notif.isRead
                  ? 'glass-card border-white/5 opacity-80'
                  : 'bg-[#181622] border-gold-400/30 shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#14141E] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-heading text-xs font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-gray-500 shrink-0">
                    {notif.time}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                  {notif.message}
                </p>

                {notif.bookingId && (
                  <span className="inline-block mt-1.5 text-[10px] text-gold-400 font-semibold hover:underline">
                    View Appointment #{notif.bookingId} →
                  </span>
                )}
              </div>

              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
