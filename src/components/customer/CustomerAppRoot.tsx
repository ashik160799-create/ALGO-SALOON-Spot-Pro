import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabaseALGOClient';
import { SplashScreen } from './SplashScreen';
import { AuthScreen } from './AuthScreen';
import { HomeScreen } from './HomeScreen';
import { ServicesScreen } from './ServicesScreen';
import { SelectStaffScreen } from './SelectStaffScreen';
import { DateTimeScreen } from './DateTimeScreen';
import { AddOnsScreen } from './AddOnsScreen';
import { CartScreen } from './CartScreen';
import { PaymentScreen } from './PaymentScreen';
import { BookingConfirmedScreen } from './BookingConfirmedScreen';
import { MyBookingsScreen } from './MyBookingsScreen';
import { BookingDetailsScreen } from './BookingDetailsScreen';
import { WalletScreen } from './WalletScreen';
import { OffersScreen } from './OffersScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { ProfileScreen } from './ProfileScreen';
import { CustomerBottomNav } from '../layout/CustomerBottomNav';

export const CustomerAppRoot: React.FC = () => {
  const { customerScreen, customer, setCustomerScreen } = useApp();

  // Auto-advance authenticated users to Home from splash/auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if ((session || customer.isVerified) && (customerScreen === 'splash' || customerScreen === 'auth')) {
        setCustomerScreen('home');
      }
    }).catch(() => {});
  }, [customerScreen, customer.isVerified]);

  const renderScreen = () => {
    switch (customerScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'home':
        return <HomeScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'select_staff':
        return <SelectStaffScreen />;
      case 'choose_datetime':
        return <DateTimeScreen />;
      case 'add_ons':
        return <AddOnsScreen />;
      case 'cart':
        return <CartScreen />;
      case 'payment':
        return <PaymentScreen />;
      case 'booking_confirmed':
        return <BookingConfirmedScreen />;
      case 'my_bookings':
        return <MyBookingsScreen />;
      case 'booking_details':
        return <BookingDetailsScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Show bottom nav for standard browsing screens
  const showBottomNav = [
    'home',
    'services',
    'my_bookings',
    'wallet',
    'offers',
    'notifications',
    'profile'
  ].includes(customerScreen);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0F] text-white select-none">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </div>
      {showBottomNav && <CustomerBottomNav />}
    </div>
  );
};

