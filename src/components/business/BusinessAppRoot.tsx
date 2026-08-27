import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabaseALGOClient';
import { BusinessAuthScreen } from './BusinessAuthScreen';
import { RegisterShopScreen } from './RegisterShopScreen';
import { BusinessDashboard } from './BusinessDashboard';
import { AppointmentsManager } from './AppointmentsManager';
import { ServicesManager } from './ServicesManager';
import { StaffManager } from './StaffManager';
import { InventoryManager } from './InventoryManager';
import { PayrollManager } from './PayrollManager';
import { ReportsAnalytics } from './ReportsAnalytics';
import { ShopSettingsScreen } from './ShopSettingsScreen';
import { BusinessBottomNav } from '../layout/BusinessBottomNav';

export const BusinessAppRoot: React.FC = () => {
  const { businessScreen, currentBusinessShop, setBusinessScreen, supabaseSession } = useApp();

  const isShopRegistered = Boolean(
    currentBusinessShop && 
    currentBusinessShop.id && 
    currentBusinessShop.name && 
    currentBusinessShop.name !== 'Select or Register Salon'
  );

  // Auto-advance authenticated business users from auth screen
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && businessScreen === 'auth') {
        if (isShopRegistered) {
          setBusinessScreen('dashboard');
        } else {
          setBusinessScreen('register_shop');
        }
      }
    }).catch(() => {});
  }, [businessScreen, isShopRegistered]);

  const renderScreen = () => {
    // If shop is not registered, enforce Gate 2: only auth or register_shop
    if (!isShopRegistered && businessScreen !== 'auth') {
      return <RegisterShopScreen />;
    }

    switch (businessScreen) {
      case 'auth':
        return <BusinessAuthScreen />;
      case 'register_shop':
        return <RegisterShopScreen />;
      case 'dashboard':
        return <BusinessDashboard />;
      case 'appointments':
        return <AppointmentsManager />;
      case 'services_mgr':
        return <ServicesManager />;
      case 'staff_mgr':
        return <StaffManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'payroll':
        return <PayrollManager />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <ShopSettingsScreen />;
      default:
        return isShopRegistered ? <BusinessDashboard /> : <RegisterShopScreen />;
    }
  };

  const showBottomNav = isShopRegistered && businessScreen !== 'register_shop' && businessScreen !== 'auth';

  return (
    <div className="flex flex-col h-full bg-[#0A0A0F] text-white select-none">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </div>
      {showBottomNav && <BusinessBottomNav />}
    </div>
  );
};

