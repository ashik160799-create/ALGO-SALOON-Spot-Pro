import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppMode, 
  CustomerScreen, 
  BusinessScreen, 
  CustomerTab, 
  BusinessTab, 
  CustomerProfile, 
  BusinessShop, 
  Stylist, 
  ServiceItem, 
  AddOnItem, 
  CartItem, 
  Booking, 
  PaymentMethod, 
  WalletTransaction, 
  Offer, 
  AppNotification, 
  InventoryItem, 
  PayrollRecord, 
  CurrencyInfo 
} from '../types';
import { 
  initialCustomer, 
  initialShops, 
  initialStylists, 
  initialServices, 
  initialAddOns, 
  initialOffers, 
  initialBookings, 
  initialTransactions, 
  initialNotifications,
  initialInventory,
  initialPayrolls,
  supportedCurrencies
} from '../data/mockData';
import { supabase } from '../supabaseALGOClient';
import { SupabaseAuth } from '../services/supabaseAuthService';
import { SupabaseStorage } from '../services/supabaseStorageService';
import {
  SupabaseAPI,
  mapBookingFromDB,
  mapServiceFromDB,
  mapStylistFromDB,
  mapInventoryFromDB,
  mapShopFromDB,
  mapOfferFromDB
} from '../services/supabaseService';
import { getAiServiceAvatar, getAiStylistAvatar } from '../utils/aiAvatarHelper';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  customerScreen: CustomerScreen;
  setCustomerScreen: (screen: CustomerScreen, tab?: CustomerTab) => void;
  customerActiveTab: CustomerTab;
  setCustomerActiveTab: (tab: CustomerTab) => void;
  businessScreen: BusinessScreen;
  setBusinessScreen: (screen: BusinessScreen, tab?: BusinessTab) => void;
  businessActiveTab: BusinessTab;
  setBusinessActiveTab: (tab: BusinessTab) => void;
  deviceViewMode: 'mobile' | 'fullscreen' | 'dual';
  setDeviceViewMode: (view: 'mobile' | 'fullscreen' | 'dual') => void;

  customer: CustomerProfile;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerProfile>>;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  authInitialRole: 'customer' | 'business';
  setAuthInitialRole: (role: 'customer' | 'business') => void;
  authInitialTab: 'signin' | 'signup';
  setAuthInitialTab: (tab: 'signin' | 'signup') => void;

  userLocation: string;
  setUserLocation: (loc: string) => void;
  userCoords: { latitude: number; longitude: number } | null;
  isLocationDetected: boolean;
  detectUserLocationAndCurrency: () => void;
  calculateDistanceToShop: (shop: BusinessShop) => number;

  // Supabase Session State & Protection
  supabaseSession: any;
  checkAuthSession: () => Promise<boolean>;
  signOutSupabase: () => Promise<void>;

  // Currency System
  currency: CurrencyInfo;
  setCurrency: (c: CurrencyInfo) => void;
  formatPrice: (amountInINR: number) => string;

  shops: BusinessShop[];
  selectedShop: BusinessShop | null;
  setSelectedShop: (shop: BusinessShop | null) => void;
  currentBusinessShop: BusinessShop;
  stylists: Stylist[];
  services: ServiceItem[];
  addOns: AddOnItem[];
  offers: Offer[];
  bookings: Booking[];
  transactions: WalletTransaction[];
  notifications: AppNotification[];
  inventory: InventoryItem[];
  payrolls: PayrollRecord[];

  // Customer Cart & Checkout Flow State
  cart: CartItem[];
  selectedStylist: Stylist | null;
  selectedDate: string;
  selectedTimeSlot: string;
  selectedAddOns: AddOnItem[];
  appliedOffer: Offer | null;
  currentBookingDetail: Booking | null;
  setCurrentBookingDetail: (booking: Booking | null) => void;

  // Date Formatting Helper
  formatBookingDate: (dateStr: string) => string;

  // Actions
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  toggleAddOn: (addon: AddOnItem) => void;
  setSelectedStylist: (stylist: Stylist | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTimeSlot: (slot: string) => void;
  applyOfferCode: (code: string) => { success: boolean; message: string };
  removeOffer: () => void;
  
  createBooking: (paymentMethod: PaymentMethod) => Booking;
  acceptBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  completeBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTime: string) => void;
  cancelBooking: (bookingId: string) => void;

  addWalletMoney: (amount: number) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Dedicated Registration & Authentication Actions
  registerCustomerAccount: (data: { name: string; email: string; password?: string }) => void;
  registerBusinessOwnerAccount: (data: { shopName: string; phone: string; email: string; password?: string; address: string; googleMapsUrl: string }) => void;

  // Business Actions
  registerShop: (shopData: Partial<BusinessShop>) => BusinessShop;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;
  addStylist: (stylist: Omit<Stylist, 'id'>) => void;
  updateStylist: (stylist: Stylist) => void;
  deleteStylist: (stylistId: string) => void;
  updateShopSettings: (settings: Partial<BusinessShop>) => void;
  
  // Advanced Business Features (Inventory, Payroll, CSV Export)
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateStock: (itemId: string, newQty: number) => void;
  deleteInventoryItem: (itemId: string) => void;
  markPayrollPaid: (payrollId: string) => void;
  exportBookingsToCSV: () => void;
  exportRevenueToCSV: () => void;
  exportInventoryToCSV: () => void;
  exportPayrollToCSV: () => void;

  // Google / Gmail Auth
  loginWithGoogle: (role: 'customer' | 'business', user: { name: string; email: string; avatar: string }) => void;

  // Avatar, Banner, Video & Document Upload / Delete
  uploadCustomerAvatar: (file: File | Blob | string) => Promise<string | undefined>;
  deleteCustomerAvatar: () => void;
  uploadShopAvatar: (file: File | Blob | string) => Promise<string | undefined>;
  deleteShopAvatar: () => void;
  uploadShopBanner: (file: File | Blob | string) => Promise<string | undefined>;
  deleteShopBanner: () => void;
  uploadShopVideo: (file: File | Blob, mimeType?: string) => Promise<string | undefined>;
  deleteShopVideo: () => void;
  addShopGalleryImage: (file: File | Blob | string, slotIndex?: number) => Promise<string | undefined>;
  deleteShopGalleryImage: (index: number) => void;
  uploadServiceImageItem: (serviceId: string, file: File | Blob | string) => Promise<string | undefined>;
  uploadStylistAvatarItem: (stylistId: string, file: File | Blob | string) => Promise<string | undefined>;
  uploadTradeLicenseDoc: (docUrlOrBase64: string, docNo?: string) => Promise<any>;
  deleteTradeLicenseDoc: () => void;
  uploadTaxVatDoc: (docUrlOrBase64: string, taxNo?: string) => Promise<any>;
  deleteTaxVatDoc: () => void;
  runStorageCleanup: () => Promise<{ success: boolean; scannedCount: number; deletedCount: number; errors: string[] }>;

  // Permanent Account Deletion
  deleteCustomerAccountPermanently: () => void;
  deleteShopAccountPermanently: () => void;

  // Service Offers & Discounts
  setServiceDiscount: (serviceId: string, discountPercent: number) => void;
  removeServiceDiscount: (serviceId: string) => void;
  bulkApplyDiscountToAllServices: (discountPercent: number) => void;
  createShopOffer: (offer: Omit<Offer, 'id'>) => void;
  deleteOffer: (offerId: string) => void;
  
  resetDemoData: () => void;
}

const STORAGE_KEY = 'algo_saloon_spot_real_v10';

// Auto-purge any legacy mock caches from older versions
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('algo_saloon_spot') && !k.startsWith('algo_saloon_spot_real_v10')) {
        localStorage.removeItem(k);
      }
    });
  }
} catch (e) {
  // ignore in SSR or restricted environments
}

const DEFAULT_AVATAR = '';
const DEFAULT_SHOP_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80';

// Live Date Helper
const getLiveTodayDate = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatLiveBookingDate = (dateStr: string): string => {
  if (!dateStr) {
    const d = new Date();
    return 'Today, ' + d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const todayStr = getLiveTodayDate();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const parts = dateStr.split('-');
  let targetDate = new Date(dateStr);
  if (parts.length === 3) {
    targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  const formattedBase = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (dateStr === todayStr) {
    return `Today, ${formattedBase}`;
  }
  if (dateStr === tomorrowStr) {
    return `Tomorrow, ${formattedBase}`;
  }
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName}, ${formattedBase}`;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultEmptyCustomer: CustomerProfile = {
  id: '',
  name: '',
  phone: '',
  email: '',
  avatar: '',
  walletBalance: 0,
  isVerified: false,
  savedAddresses: []
};

const defaultEmptyBusinessShop: BusinessShop = {
  id: '',
  name: '',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  country: 'India',
  businessType: ['Salon'],
  staffCount: 1,
  openingTime: '09:00 AM',
  closingTime: '09:00 PM',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  rating: 5.0,
  reviewCount: 0,
  distance: '0.1 km',
  image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
  isOpen: true,
  tradeLicenseNo: '',
  taxVatNo: '',
  isVerified: false,
  priceTier: 'budget',
  avgPrice: 200
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // App Navigation & Role Mode State (Persisted in localStorage across refreshes)
  const [mode, setModeState] = useState<AppMode>(() => {
    return (localStorage.getItem(STORAGE_KEY + '_mode') as AppMode) || 'customer';
  });
  const [customerScreen, setCustomerScreenState] = useState<CustomerScreen>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_customerScreen') as CustomerScreen;
    if (saved && saved !== 'splash' && saved !== 'auth') return saved;
    const savedCust = localStorage.getItem(STORAGE_KEY + '_customer');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        if (parsed.isVerified || parsed.id) return saved || 'home';
      } catch {}
    }
    return 'splash';
  });
  const [customerActiveTab, setCustomerActiveTab] = useState<CustomerTab>(() => {
    return (localStorage.getItem(STORAGE_KEY + '_customerTab') as CustomerTab) || 'home';
  });
  const [businessScreen, setBusinessScreenState] = useState<BusinessScreen>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_businessScreen') as BusinessScreen;
    return saved || 'auth';
  });
  const [businessActiveTab, setBusinessActiveTab] = useState<BusinessTab>(() => {
    return (localStorage.getItem(STORAGE_KEY + '_businessTab') as BusinessTab) || 'home';
  });
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'fullscreen' | 'dual'>('mobile');
  const [authInitialRole, setAuthInitialRole] = useState<'customer' | 'business'>('customer');
  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY + '_userLocation') || 'Select Location';
  });
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocationDetected, setIsLocationDetected] = useState<boolean>(false);

  // Supabase Session State
  const [supabaseSession, setSupabaseSession] = useState<any>(null);

  // Currency State
  const [currency, setCurrency] = useState<CurrencyInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_currency');
    return saved ? JSON.parse(saved) : supportedCurrencies[0]; // INR default
  });

  // Loaded Data from localStorage or Clean Real State
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_customer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phone && (parsed.phone.includes('98765') || parsed.phone.includes('43210'))) {
          parsed.phone = '';
        }
        return parsed;
      } catch {
        return defaultEmptyCustomer;
      }
    }
    return defaultEmptyCustomer;
  });

  const [shops, setShops] = useState<BusinessShop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_shops');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedShop, setSelectedShop] = useState<BusinessShop | null>(null);

  const [currentBusinessShop, setCurrentBusinessShop] = useState<BusinessShop>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_businessShop');
    return saved ? JSON.parse(saved) : defaultEmptyBusinessShop;
  });

  const [stylists, setStylists] = useState<Stylist[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_stylists');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_services');
    return saved ? JSON.parse(saved) : [];
  });

  const [addOns] = useState<AddOnItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_offers');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_payrolls');
    return saved ? JSON.parse(saved) : [];
  });

  // Booking Flow State with Live Real Date & Time
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getLiveTodayDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnItem[]>([]);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [currentBookingDetail, setCurrentBookingDetail] = useState<Booking | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_stylists', JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_payrolls', JSON.stringify(payrolls));
  }, [payrolls]);

  // Sync Navigation & Active Screens to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_customerScreen', customerScreen);
  }, [customerScreen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_customerTab', customerActiveTab);
  }, [customerActiveTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_businessScreen', businessScreen);
  }, [businessScreen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_businessTab', businessActiveTab);
  }, [businessActiveTab]);

  // Live Supabase Data Fetching & Realtime Sync with supabase.auth.getUser()
  useEffect(() => {
    let isMounted = true;

    const hydrateAppData = async () => {
      try {
        // A. Load public marketplace (shops, services, stylists, offers)
        const liveData = await SupabaseAPI.fetchAll();
        if (isMounted) {
          if (liveData?.shops && liveData.shops.length > 0) {
            setShops(liveData.shops);
            setSelectedShop(prev => (prev ? liveData.shops?.find(s => s.id === prev.id) || liveData.shops![0] : liveData.shops![0]));
            setCurrentBusinessShop(prev => liveData.shops?.find(s => s.id === prev.id) || prev);
          } else {
            setShops([]);
            setSelectedShop(null);
          }
          setStylists(liveData?.stylists || []);
          setServices(liveData?.services || []);
          setOffers(liveData?.offers || []);
        }

        // B. Securely verify user with Supabase Auth Server (getUser)
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (user && !userErr && isMounted) {
          setSupabaseSession({ user });
          const userMeta = user.user_metadata || {};
          
          // Query database profile for canonical role
          let dbProfile: any = null;
          try {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
            dbProfile = data;
          } catch (e) {}

          const intendedRole = localStorage.getItem('algo_auth_intended_role');
          const role = dbProfile?.role || (intendedRole === 'business' ? 'business' : userMeta.role) || 'customer';
          const fallbackName = dbProfile?.full_name || userMeta.full_name || userMeta.name || user.email?.split('@')[0] || (role === 'business' ? 'Salon Partner' : 'Valued Customer');
          const fallbackAvatar = dbProfile?.avatar_url || userMeta.avatar_url || userMeta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

          // Auto-provision profile row if not present
          if (!dbProfile) {
            try {
              await supabase.from('profiles').upsert({
                id: user.id,
                role,
                full_name: fallbackName,
                email: user.email,
                phone: userMeta.phone || '',
                avatar_url: fallbackAvatar,
                wallet_balance: 0,
                is_verified: true,
                auth_provider: 'google',
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' });
            } catch (e) {
              console.warn('Auto profile sync notice:', e);
            }
          }

          // 1. Fetch Business Shop Data
          const bizData = await SupabaseAPI.fetchBusinessShopData(user.id);
          const hasRegisteredShop = Boolean(bizData?.shop && bizData.shop.id && bizData.shop.name && bizData.shop.isVerified);

          if (hasRegisteredShop && isMounted) {
            setCurrentBusinessShop(bizData!.shop);
            if (bizData!.services.length) setServices(bizData!.services);
            if (bizData!.stylists.length) setStylists(bizData!.stylists);
            if (role === 'business') {
              setBookings(bizData!.bookings);
              setInventory(bizData!.inventory);
              setPayrolls(bizData!.payrolls);
            }
          } else if (isMounted && role === 'business') {
            const pendingShop: BusinessShop = {
              ...defaultEmptyBusinessShop,
              ownerName: fallbackName,
              email: user.email || '',
              phone: dbProfile?.phone || userMeta.phone || '',
              isVerified: false
            };
            setCurrentBusinessShop(pendingShop);
          }

          // 2. Fetch Customer Profile Data
          const custData = await SupabaseAPI.fetchCustomerData(user.id);
          const profileRow = custData?.profile || dbProfile;
          const fullName = profileRow?.full_name || fallbackName;
          const avatarUrl = profileRow?.avatar_url || fallbackAvatar;

          if (isMounted) {
            const rawCustPhone = profileRow?.phone || userMeta.phone || '';
            const sanitizedPhone = (rawCustPhone.includes('98765') || rawCustPhone.includes('43210')) ? '' : rawCustPhone;

            setCustomer({
              id: user.id,
              name: fullName,
              email: user.email || '',
              phone: sanitizedPhone,
              avatar: avatarUrl,
              walletBalance: Number(profileRow?.wallet_balance) || 0,
              savedAddresses: Array.isArray(profileRow?.saved_addresses) ? profileRow.saved_addresses : [],
              isVerified: true
            });
            if (role === 'customer') {
              if (custData?.bookings) setBookings(custData.bookings);
              if (custData?.transactions) setTransactions(custData.transactions);
              if (custData?.notifications) setNotifications(custData.notifications);
            }
          }

          // 3. Set Screen Routing based on Role & Gate status (Preserving current screen)
          if (role === 'business') {
            setModeState('business');
            setBusinessScreenState(prev => {
              if (prev === 'auth') {
                return hasRegisteredShop ? 'dashboard' : 'register_shop';
              }
              if (prev === 'register_shop' && hasRegisteredShop) {
                return 'dashboard';
              }
              return prev; // Preserve current business screen (e.g. 'settings', 'inventory', 'staff_mgr', 'payroll')
            });
          } else {
            setModeState('customer');
            setCustomerScreenState(prev => {
              if (prev === 'splash' || prev === 'auth') {
                return 'home';
              }
              return prev; // Preserve current customer screen (e.g. 'profile', 'wallet', 'my_bookings', 'services')
            });
          }
          localStorage.removeItem('algo_auth_intended_role');
        }
      } catch (err) {
        console.warn('Hydrate data notice:', err);
      }
    };

    hydrateAppData();

    // C. Real-time PostgreSQL sync channel
    const channel = supabase.channel('realtime:saloonspot_live_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newBooking = mapBookingFromDB(payload.new);
          setBookings(prev => {
            if (prev.some(b => b.id === newBooking.id)) return prev;
            return [newBooking, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapBookingFromDB(payload.new);
          setBookings(prev => prev.map(b => b.id === updated.id ? { ...b, ...updated } : b));
          setCurrentBookingDetail(prev => prev?.id === updated.id ? { ...prev, ...updated } : prev);
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) setBookings(prev => prev.filter(b => b.id !== oldId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, payload => {
        if (payload.eventType === 'INSERT') {
          setServices(prev => [mapServiceFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapServiceFromDB(payload.new);
          setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) setServices(prev => prev.filter(s => s.id !== oldId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stylists' }, payload => {
        if (payload.eventType === 'INSERT') {
          setStylists(prev => [mapStylistFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapStylistFromDB(payload.new);
          setStylists(prev => prev.map(s => s.id === updated.id ? updated : s));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) setStylists(prev => prev.filter(s => s.id !== oldId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, payload => {
        if (payload.eventType === 'INSERT') {
          setInventory(prev => [mapInventoryFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapInventoryFromDB(payload.new);
          setInventory(prev => prev.map(i => i.id === updated.id ? updated : i));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) setInventory(prev => prev.filter(i => i.id !== oldId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const updatedShop = mapShopFromDB(payload.new);
          setShops(prev => {
            const exists = prev.some(s => s.id === updatedShop.id);
            if (exists) return prev.map(s => s.id === updatedShop.id ? updatedShop : s);
            return [updatedShop, ...prev];
          });
          setCurrentBusinessShop(prev => prev.id === updatedShop.id ? updatedShop : prev);
          setSelectedShop(prev => prev?.id === updatedShop.id ? updatedShop : prev);
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) {
            setShops(prev => prev.filter(s => s.id !== oldId));
            setSelectedShop(prev => prev?.id === oldId ? null : prev);
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, payload => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const row = payload.new;
          setCustomer(prev => {
            if (prev.id === row.id || (prev.email && prev.email.toLowerCase() === row.email?.toLowerCase())) {
              return {
                ...prev,
                name: row.full_name || prev.name,
                phone: row.phone || prev.phone,
                avatar: row.avatar_url || prev.avatar,
                walletBalance: row.wallet_balance !== undefined ? Number(row.wallet_balance) : prev.walletBalance,
                savedAddresses: Array.isArray(row.saved_addresses) ? row.saved_addresses : prev.savedAddresses
              };
            }
            return prev;
          });
          setCurrentBusinessShop(prev => {
            if (prev.ownerId === row.id || (prev.email && prev.email.toLowerCase() === row.email?.toLowerCase())) {
              return {
                ...prev,
                ownerName: row.full_name || prev.ownerName,
                phone: row.phone || prev.phone,
                email: row.email || prev.email
              };
            }
            return prev;
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, payload => {
        if (payload.eventType === 'INSERT') {
          setOffers(prev => [mapOfferFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapOfferFromDB(payload.new);
          setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any)?.id;
          if (oldId) setOffers(prev => prev.filter(o => o.id !== oldId));
        }
      })
      .subscribe();

    // D. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseSession(session);
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        
        let dbProfile: any = null;
        try {
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
          dbProfile = data;
        } catch (e) {}

        const intendedRole = localStorage.getItem('algo_auth_intended_role');
        const role = dbProfile?.role || (intendedRole === 'business' ? 'business' : userMeta.role) || 'customer';
        const fallbackName = dbProfile?.full_name || userMeta.full_name || userMeta.name || session.user.email?.split('@')[0] || (role === 'business' ? 'Salon Partner' : 'Valued Customer');
        const fallbackAvatar = dbProfile?.avatar_url || userMeta.avatar_url || userMeta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        // Auto-provision profile row if not present
        if (!dbProfile) {
          try {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              role,
              full_name: fallbackName,
              email: session.user.email,
              phone: userMeta.phone || '',
              avatar_url: fallbackAvatar,
              wallet_balance: 0,
              is_verified: true,
              auth_provider: 'google',
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
          } catch (e) {
            console.warn('Auto profile sync notice:', e);
          }
        }

        if (role === 'business') {
          const bizData = await SupabaseAPI.fetchBusinessShopData(session.user.id);
          const hasRegisteredShop = Boolean(bizData?.shop && bizData.shop.id && bizData.shop.name && bizData.shop.isVerified);

          if (hasRegisteredShop && isMounted) {
            setCurrentBusinessShop(bizData!.shop);
            if (bizData!.services.length) setServices(bizData!.services);
            if (bizData!.stylists.length) setStylists(bizData!.stylists);
            setBookings(bizData!.bookings);
            setInventory(bizData!.inventory);
            setPayrolls(bizData!.payrolls);
            setModeState('business');
            setBusinessScreenState(prev => {
              if (prev === 'auth' || prev === 'register_shop') {
                return 'dashboard';
              }
              return prev; // Preserve active business screen (e.g. 'settings', 'staff_mgr', 'inventory')
            });
          } else if (isMounted) {
            const pendingShop: BusinessShop = {
              ...defaultEmptyBusinessShop,
              ownerName: fallbackName,
              email: session.user.email || '',
              phone: dbProfile?.phone || userMeta.phone || '',
              isVerified: false
            };
            setCurrentBusinessShop(pendingShop);
            setModeState('business');
            setBusinessScreenState(prev => {
              if (prev === 'auth') {
                return 'register_shop';
              }
              return prev;
            });
          }
          localStorage.removeItem('algo_auth_intended_role');
        } else {
          const custData = await SupabaseAPI.fetchCustomerData(session.user.id);
          const profileRow = custData?.profile || dbProfile;
          if (isMounted) {
            const rawCustPhone = profileRow?.phone || userMeta.phone || '';
            const sanitizedPhone = (rawCustPhone.includes('98765') || rawCustPhone.includes('43210')) ? '' : rawCustPhone;
            const finalAvatar = profileRow?.avatar_url || fallbackAvatar;

            setCustomer({
              id: session.user.id,
              name: profileRow?.full_name || fallbackName,
              email: session.user.email || '',
              phone: sanitizedPhone,
              avatar: finalAvatar,
              walletBalance: Number(profileRow?.wallet_balance) || 0,
              savedAddresses: Array.isArray(profileRow?.saved_addresses) ? profileRow.saved_addresses : [],
              isVerified: true
            });
            if (custData?.bookings) setBookings(custData.bookings);
            if (custData?.transactions) setTransactions(custData.transactions);
            if (custData?.notifications) setNotifications(custData.notifications);
            setModeState('customer');
            setCustomerScreenState(prev => {
              if (prev === 'splash' || prev === 'auth') {
                return 'home';
              }
              return prev; // Preserve current screen ('profile', 'wallet', 'my_bookings', etc.)
            });
          }
          localStorage.removeItem('algo_auth_intended_role');
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setCustomer(defaultEmptyCustomer);
          setBookings([]);
          setTransactions([]);
          setNotifications([]);
          setInventory([]);
          setPayrolls([]);
        }
      }
    });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, []);

  // Check Active Session helper using server-verified getUser()
  const checkAuthSession = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSupabaseSession({ user });
        return true;
      }
      return Boolean(customer.isVerified);
    } catch {
      return Boolean(customer.isVerified);
    }
  };

  const signOutSupabase = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setSupabaseSession(null);
    setCustomer(defaultEmptyCustomer);
    setBookings([]);
    setTransactions([]);
    setNotifications([]);
    setInventory([]);
    setPayrolls([]);
    setCurrentBusinessShop(prev => ({ ...prev, isVerified: false }));
    setCustomerScreen('splash');
  };

  // Haversine formula to compute distance in km between userCoords and a shop
  const calculateDistanceToShop = (shop: BusinessShop): number => {
    if (!userCoords || !shop.latitude || !shop.longitude) {
      const match = (shop.distance || '').match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 1.2;
    }
    const lat1 = userCoords.latitude;
    const lon1 = userCoords.longitude;
    const lat2 = shop.latitude;
    const lon2 = shop.longitude;

    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const mapCountryToCurrency = (countryCode: string): CurrencyInfo | undefined => {
    const code = countryCode.toUpperCase();
    return supportedCurrencies.find(c => {
      if (code === 'IN' && c.code === 'INR') return true;
      if (code === 'AE' && c.code === 'AED') return true;
      if (code === 'US' && c.code === 'USD') return true;
      if (code === 'GB' && c.code === 'GBP') return true;
      if (['DE','FR','IT','ES','NL','BE','AT','GR','PT','IE','FI'].includes(code) && c.code === 'EUR') return true;
      if (code === 'SG' && c.code === 'SGD') return true;
      if (code === 'SA' && c.code === 'SAR') return true;
      if (code === 'CA' && c.code === 'CAD') return true;
      if (code === 'AU' && c.code === 'AUD') return true;
      if (code === 'QA' && c.code === 'QAR') return true;
      if (code === 'KW' && c.code === 'KWD') return true;
      if (code === 'OM' && c.code === 'OMR') return true;
      if (code === 'BH' && c.code === 'BHD') return true;
      if (code === 'MY' && c.code === 'MYR') return true;
      if (code === 'JP' && c.code === 'JPY') return true;
      return false;
    });
  };

  const applyTimezoneFallback = (lat?: number, lng?: number) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    let detectedCurrency = supportedCurrencies[0];
    let detectedCity = '';

    if (timeZone.includes('Dubai') || timeZone.includes('Asia/Dubai') || timeZone.includes('Muscat')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'AED') || supportedCurrencies[1];
      detectedCity = 'Downtown Dubai, UAE';
    } else if (timeZone.includes('America') || timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'USD') || supportedCurrencies[2];
      detectedCity = 'Manhattan, New York, USA';
    } else if (timeZone.includes('London') || timeZone.includes('Europe/London')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'GBP') || supportedCurrencies[3];
      detectedCity = 'Central London, UK';
    } else if (timeZone.includes('Europe') || timeZone.includes('Paris') || timeZone.includes('Berlin') || timeZone.includes('Rome') || timeZone.includes('Madrid')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'EUR') || supportedCurrencies[4];
      detectedCity = 'Western Europe';
    } else if (timeZone.includes('Riyadh')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'SAR') || supportedCurrencies[6];
      detectedCity = 'Riyadh, Saudi Arabia';
    } else if (timeZone.includes('Singapore')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'SGD') || supportedCurrencies[5];
      detectedCity = 'Orchard Road, Singapore';
    } else if (timeZone.includes('Toronto') || timeZone.includes('Vancouver')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'CAD') || supportedCurrencies[2];
      detectedCity = 'Toronto, Canada';
    } else if (timeZone.includes('Sydney') || timeZone.includes('Melbourne')) {
      detectedCurrency = supportedCurrencies.find(c => c.code === 'AUD') || supportedCurrencies[2];
      detectedCity = 'Sydney, Australia';
    } else {
      detectedCurrency = supportedCurrencies[0];
      detectedCity = lat && lng ? `Location (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)` : '';
    }

    if (detectedCity) {
      setUserLocation(detectedCity);
    }
    setCurrency(detectedCurrency);
    setIsLocationDetected(true);
  };

  // Automatic Background GPS & IP Location and Currency Detection
  const detectUserLocationAndCurrency = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ latitude: lat, longitude: lng });

          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            if (res.ok) {
              const geo = await res.json();
              const countryCode = geo.countryCode || '';
              const city = geo.city || geo.locality || geo.principalSubdivision || 'Nearby';
              const country = geo.countryName || 'Current Location';
              const matchedCurrency = mapCountryToCurrency(countryCode);
              if (matchedCurrency) {
                setCurrency(matchedCurrency);
              }
              setUserLocation(`${city}, ${country}`);
              setIsLocationDetected(true);
              return;
            }
          } catch {}

          applyTimezoneFallback(lat, lng);
        },
        async _err => {
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              const countryCode = ipData.country_code || '';
              const city = ipData.city || 'Local Area';
              const country = ipData.country_name || 'Current Country';
              if (ipData.latitude && ipData.longitude) {
                setUserCoords({ latitude: Number(ipData.latitude), longitude: Number(ipData.longitude) });
              }
              const matchedCurrency = mapCountryToCurrency(countryCode);
              if (matchedCurrency) {
                setCurrency(matchedCurrency);
              }
              setUserLocation(`${city}, ${country}`);
              setIsLocationDetected(true);
              return;
            }
          } catch {}

          applyTimezoneFallback();
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      applyTimezoneFallback();
    }
  };

  useEffect(() => {
    detectUserLocationAndCurrency();
  }, []);

  // Universal Price Formatter
  const formatPrice = (amountInINR: number): string => {
    if (currency.code === 'INR') {
      return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
    }
    const converted = amountInINR * currency.rateFromINR;
    if (converted < 10) {
      return `${currency.symbol} ${converted.toFixed(2)}`;
    }
    return `${currency.symbol} ${Math.round(converted)}`;
  };

  // Screen Navigators with tab synchronization
  const setCustomerScreen = (screen: CustomerScreen, tab?: CustomerTab) => {
    setCustomerScreenState(screen);
    if (tab) {
      setCustomerActiveTab(tab);
    } else {
      if (screen === 'home') setCustomerActiveTab('home');
      else if (screen === 'services') setCustomerActiveTab('services');
      else if (screen === 'my_bookings') setCustomerActiveTab('bookings');
      else if (screen === 'wallet') setCustomerActiveTab('wallet');
      else if (screen === 'profile') setCustomerActiveTab('profile');
    }
  };

  const setBusinessScreen = (screen: BusinessScreen, tab?: BusinessTab) => {
    setBusinessScreenState(screen);
    if (tab) {
      setBusinessActiveTab(tab);
    } else {
      if (screen === 'dashboard') setBusinessActiveTab('home');
      else if (screen === 'appointments') setBusinessActiveTab('appointments');
      else if (screen === 'services_mgr') setBusinessActiveTab('services');
      else if (screen === 'staff_mgr') setBusinessActiveTab('staff');
      else if (screen === 'inventory') setBusinessActiveTab('inventory');
      else if (screen === 'payroll') setBusinessActiveTab('payroll');
      else if (screen === 'reports') setBusinessActiveTab('reports');
      else if (screen === 'settings') setBusinessActiveTab('settings');
    }
  };

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
  };

  // Dedicated Registration & Authentication Actions
  const registerCustomerAccount = async (data: { name: string; email: string; password?: string }) => {
    detectUserLocationAndCurrency();
    const cleanEmail = data.email.trim().toLowerCase();
    let existingProfile: any = null;
    try {
      const { data: existing } = await supabase.from('profiles').select('*').eq('email', cleanEmail).maybeSingle();
      existingProfile = existing;
    } catch (e) {}

    const finalName = data.name.trim() || existingProfile?.full_name || 'Valued Customer';
    const finalAvatar = existingProfile?.avatar_url || '';
    const finalPhone = existingProfile?.phone || '';
    const finalWallet = existingProfile?.wallet_balance !== undefined ? Number(existingProfile.wallet_balance) : 0;
    const finalAddresses = Array.isArray(existingProfile?.saved_addresses) ? existingProfile.saved_addresses : [];
    const targetUserId = existingProfile?.id || customer.id || supabaseSession?.user?.id || 'cust-' + Date.now();

    const updatedCustomer: CustomerProfile = {
      id: targetUserId,
      name: finalName,
      email: cleanEmail,
      phone: finalPhone,
      avatar: finalAvatar,
      walletBalance: finalWallet,
      savedAddresses: finalAddresses,
      isVerified: true
    };
    setCustomer(updatedCustomer);
    setMode('customer');
    setCustomerScreen('home');

    await SupabaseAPI.upsertProfile({
      id: targetUserId,
      name: finalName,
      email: cleanEmail,
      phone: finalPhone,
      avatar_url: finalAvatar,
      role: 'customer'
    });

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Welcome to ALGO Saloon!',
        message: `Account verified for ${finalName}. Location allowed: ${userLocation}. Currency: ${currency.symbol} (${currency.code}).`,
        time: 'Just now',
        type: 'system',
        isRead: false
      },
      ...prev
    ]);
  };

  const registerBusinessOwnerAccount = async (data: { 
    shopName: string; 
    phone: string; 
    email: string; 
    password?: string; 
    address: string; 
    googleMapsUrl: string 
  }) => {
    detectUserLocationAndCurrency();
    const cleanEmail = data.email.trim().toLowerCase();
    const targetOwnerId = supabaseSession?.user?.id;

    let existingShop: BusinessShop | null = null;
    try {
      const query = targetOwnerId
        ? supabase.from('shops').select('*').or(`owner_id.eq.${targetOwnerId},email.eq.${cleanEmail}`)
        : supabase.from('shops').select('*').eq('email', cleanEmail);
      const { data: shopRows } = await query.order('updated_at', { ascending: false }).limit(1);
      if (shopRows && shopRows.length > 0) {
        existingShop = mapShopFromDB(shopRows[0]);
      }
    } catch (e) {}

    const targetShopId = existingShop?.id || (currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now());

    const updatedShop: BusinessShop = existingShop ? {
      ...existingShop,
      id: targetShopId,
      ownerId: targetOwnerId || existingShop.ownerId,
      name: data.shopName.trim() || existingShop.name,
      phone: data.phone.trim() || existingShop.phone,
      email: cleanEmail,
      address: data.address.trim() || existingShop.address,
      googleMapsUrl: data.googleMapsUrl.trim() || existingShop.googleMapsUrl || (data.address.trim() ? `https://maps.google.com/?q=${encodeURIComponent(data.address)}` : ''),
      isVerified: true
    } : {
      ...currentBusinessShop,
      id: targetShopId,
      ownerId: targetOwnerId,
      name: data.shopName.trim() || 'ALGO Salon',
      phone: data.phone.trim() || '',
      email: cleanEmail,
      address: data.address.trim() || '',
      city: currentBusinessShop.city || '',
      googleMapsUrl: data.googleMapsUrl.trim() || (data.address.trim() ? `https://maps.google.com/?q=${encodeURIComponent(data.address)}` : ''),
      isVerified: true
    };

    setCurrentBusinessShop(updatedShop);
    setShops(prev => {
      const exists = prev.some(s => s.id === targetShopId || (s.email && s.email.toLowerCase() === cleanEmail));
      if (exists) {
        return prev.map(s => (s.id === targetShopId || (s.email && s.email.toLowerCase() === cleanEmail)) ? updatedShop : s);
      }
      return [updatedShop, ...prev];
    });
    setSelectedShop(prev => prev?.id === targetShopId ? updatedShop : prev);
    setMode('business');
    setBusinessScreen('dashboard');

    await SupabaseAPI.upsertProfile({
      id: targetOwnerId || targetShopId,
      name: data.shopName.trim() || updatedShop.ownerName || 'Salon Owner',
      email: cleanEmail,
      phone: data.phone.trim() || updatedShop.phone,
      role: 'business'
    });
    await SupabaseAPI.upsertShop(updatedShop);
  };

  // Google Authentication Handler (With Strict Role Isolation)
  const loginWithGoogle = async (role: 'customer' | 'business', user: { name: string; email: string; avatar: string }) => {
    detectUserLocationAndCurrency();
    const cleanEmail = user.email.trim().toLowerCase();

    // Check existing profile in database for this email
    let existingProfile: any = null;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('email', cleanEmail).maybeSingle();
      existingProfile = data;
    } catch (e) {}

    if (role === 'customer') {
      // Cross-role validation: Cannot use a Business email for customer account
      if (existingProfile?.role === 'business') {
        alert(`This Google account (${cleanEmail}) is registered as a Salon Business account.\n\nPlease use a separate Gmail address for your Customer account, or sign in via the Partner Portal.`);
        return;
      }

      const finalName = existingProfile?.full_name || user.name;
      const finalAvatar = existingProfile?.avatar_url || user.avatar || '';
      const finalPhone = existingProfile?.phone || '';
      const finalWallet = existingProfile?.wallet_balance !== undefined ? Number(existingProfile.wallet_balance) : 0;
      const finalAddresses = Array.isArray(existingProfile?.saved_addresses) ? existingProfile.saved_addresses : [];
      const targetUserId = existingProfile?.id || supabaseSession?.user?.id || 'cust-' + Date.now();

      const updatedCust: CustomerProfile = {
        id: targetUserId,
        name: finalName,
        email: cleanEmail,
        phone: finalPhone,
        avatar: finalAvatar,
        walletBalance: finalWallet,
        savedAddresses: finalAddresses,
        authProvider: 'google' as const,
        isVerified: true
      };
      setCustomer(updatedCust);
      setMode('customer');
      setCustomerScreen('home');

      await SupabaseAPI.upsertProfile({
        id: targetUserId,
        name: finalName,
        email: cleanEmail,
        phone: finalPhone,
        avatar_url: finalAvatar,
        role: 'customer'
      });

      setNotifications(prev => [
        {
          id: 'notif-' + Date.now(),
          title: 'Google Login Verified',
          message: `Welcome back, ${finalName}! Location allowed: ${userLocation}. Currency: ${currency.symbol} (${currency.code}).`,
          time: 'Just now',
          type: 'system',
          isRead: false
        },
        ...prev
      ]);
    } else {
      // Cross-role validation: Cannot use a Customer email for business account
      if (existingProfile?.role === 'customer') {
        alert(`This Google account (${cleanEmail}) is registered as a Customer account.\n\nPlease use a separate Gmail address for your Salon Business portal.`);
        return;
      }

      const targetOwnerId = existingProfile?.id || supabaseSession?.user?.id || 'biz-' + Date.now();

      // Ensure profile row exists as business
      await SupabaseAPI.upsertProfile({
        id: targetOwnerId,
        name: user.name,
        email: cleanEmail,
        phone: existingProfile?.phone || '',
        avatar_url: user.avatar || '',
        role: 'business'
      });

      let existingShop: BusinessShop | null = null;
      try {
        const { data: shopRows } = await supabase
          .from('shops')
          .select('*')
          .eq('email', cleanEmail)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (shopRows && shopRows.length > 0) existingShop = mapShopFromDB(shopRows[0]);
      } catch (e) {}

      if (existingShop && existingShop.id && existingShop.name && existingShop.isVerified) {
        // Registered salon exists for this Google account (Gate 2 passed)
        const updatedShop: BusinessShop = {
          ...existingShop,
          ownerId: targetOwnerId,
          ownerName: user.name || existingShop.ownerName,
          email: cleanEmail,
          authProvider: 'google' as const,
          isVerified: true
        };
        setCurrentBusinessShop(updatedShop);
        setShops(prev => {
          const exists = prev.some(s => s.id === updatedShop.id || (s.email && s.email.toLowerCase() === cleanEmail));
          if (exists) return prev.map(s => (s.id === updatedShop.id || (s.email && s.email.toLowerCase() === cleanEmail)) ? updatedShop : s);
          return [updatedShop, ...prev];
        });
        setSelectedShop(prev => prev?.id === updatedShop.id ? updatedShop : prev);
        setMode('business');
        setBusinessScreen('dashboard', 'home');
      } else {
        // New Business Google Account registration (Gate 2: Register Salon)
        const pendingShop: BusinessShop = {
          ...defaultEmptyBusinessShop,
          id: 'shop-' + Date.now(),
          ownerId: targetOwnerId,
          ownerName: user.name,
          email: cleanEmail,
          authProvider: 'google' as const,
          isVerified: false
        };
        setCurrentBusinessShop(pendingShop);
        setMode('business');
        setBusinessScreen('register_shop');
      }
    }
  };

  // Customer Profile Updates
  const updateCustomerProfile = async (data: Partial<CustomerProfile>) => {
    const updated = { ...customer, ...data };
    setCustomer(updated);
    const targetUserId = customer.id || supabaseSession?.user?.id;
    try {
      await SupabaseAPI.upsertProfile({
        id: targetUserId,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar_url: updated.avatar,
        role: 'customer'
      });
    } catch (err) {
      console.warn('Profile update notice:', err);
    }
  };

  // Avatar, Banner, Video & Document Upload Handlers (Permanent Supabase Storage APP.FILES with Safe-Replace)
  const uploadCustomerAvatar = async (file: File | Blob | string): Promise<string | undefined> => {
    try {
      const targetUserId = customer.id || supabaseSession?.user?.id || 'cust-' + Date.now();
      const oldAvatar = customer.avatar;
      const res = await SupabaseStorage.uploadCustomerAvatar(targetUserId, file, oldAvatar);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : undefined);
      if (finalUrl) {
        setCustomer(prev => ({ ...prev, avatar: finalUrl }));
        await SupabaseAPI.upsertProfile({
          id: targetUserId,
          email: customer.email,
          avatar_url: finalUrl,
          role: 'customer'
        });
        return finalUrl;
      }
    } catch (err) {
      console.warn('Customer avatar upload notice:', err);
    }
    return undefined;
  };

  const deleteCustomerAvatar = async () => {
    const oldAvatar = customer.avatar;
    setCustomer(prev => ({ ...prev, avatar: '' }));
    const targetUserId = customer.id || supabaseSession?.user?.id;
    if (targetUserId) {
      await SupabaseAPI.deleteCustomerAvatar(targetUserId, oldAvatar);
    } else if (oldAvatar) {
      await SupabaseStorage.deleteFileByUrl(oldAvatar);
    }
  };

  const uploadShopAvatar = async (file: File | Blob | string): Promise<string | undefined> => {
    try {
      const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
      const oldImage = currentBusinessShop.image;
      const res = await SupabaseStorage.uploadShopAvatar(targetShopId, file, oldImage);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : DEFAULT_SHOP_IMAGE);
      const updated = { ...currentBusinessShop, id: targetShopId, image: finalUrl };
      setCurrentBusinessShop(updated);
      setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
      setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
      await SupabaseAPI.upsertShop(updated);
      return finalUrl;
    } catch (err) {
      console.warn('Shop avatar upload notice:', err);
    }
    return undefined;
  };

  const deleteShopAvatar = async () => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldImage = currentBusinessShop.image;
    const updated = { ...currentBusinessShop, id: targetShopId, image: DEFAULT_SHOP_IMAGE };
    setCurrentBusinessShop(updated);
    setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.deleteShopAvatar(targetShopId, oldImage, DEFAULT_SHOP_IMAGE);
  };

  const uploadShopBanner = async (file: File | Blob | string): Promise<string | undefined> => {
    try {
      const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
      const oldBanner = currentBusinessShop.bannerImage;
      const res = await SupabaseStorage.uploadShopBanner(targetShopId, file, oldBanner);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : undefined);
      if (finalUrl) {
        const updated = { ...currentBusinessShop, id: targetShopId, bannerImage: finalUrl };
        setCurrentBusinessShop(updated);
        setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
        setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
        await SupabaseAPI.upsertShop(updated);
        return finalUrl;
      }
    } catch (err) {
      console.warn('Shop banner upload notice:', err);
    }
    return undefined;
  };

  const deleteShopBanner = async () => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldBanner = currentBusinessShop.bannerImage;
    const updated = { ...currentBusinessShop, id: targetShopId, bannerImage: undefined };
    setCurrentBusinessShop(updated);
    setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.deleteShopBanner(targetShopId, oldBanner);
  };

  const uploadShopVideo = async (file: File | Blob, mimeType: string = 'video/mp4'): Promise<string | undefined> => {
    try {
      const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
      const oldVideo = currentBusinessShop.bannerVideoUrl;
      const res = await SupabaseStorage.uploadShopBannerVideo(targetShopId, file, mimeType, oldVideo);
      if (res.success && res.publicUrl) {
        const updated = { ...currentBusinessShop, id: targetShopId, bannerVideoUrl: res.publicUrl };
        setCurrentBusinessShop(updated);
        setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
        setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
        await SupabaseAPI.upsertShop(updated);
        return res.publicUrl;
      }
    } catch (err) {
      console.warn('Shop video upload notice:', err);
    }
    return undefined;
  };

  const deleteShopVideo = async () => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldVideo = currentBusinessShop.bannerVideoUrl;
    const updated = { ...currentBusinessShop, id: targetShopId, bannerVideoUrl: undefined };
    setCurrentBusinessShop(updated);
    setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.deleteShopVideo(targetShopId, oldVideo);
  };

  const addShopGalleryImage = async (file: File | Blob | string, slotIndex?: number): Promise<string | undefined> => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    try {
      const gallery = currentBusinessShop.galleryImages ? [...currentBusinessShop.galleryImages] : [];
      const targetSlot = (slotIndex !== undefined && slotIndex >= 0 && slotIndex < 5) ? slotIndex : Math.min(gallery.length, 4);
      const oldImageForSlot = gallery[targetSlot] || null;

      const res = await SupabaseStorage.uploadShopGalleryPhoto(targetShopId, file, targetSlot, oldImageForSlot);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : undefined);
      if (finalUrl) {
        if (targetSlot < gallery.length) {
          gallery[targetSlot] = finalUrl;
        } else if (gallery.length < 5) {
          gallery.push(finalUrl);
        }
        // Clamped to maximum 5 showcase images
        const updatedGallery = gallery.slice(0, 5);
        const updated = { ...currentBusinessShop, id: targetShopId, galleryImages: updatedGallery };
        setCurrentBusinessShop(updated);
        setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
        setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
        await SupabaseAPI.upsertShop(updated);
        return finalUrl;
      }
    } catch (err) {
      console.warn('Gallery image upload notice:', err);
    }
    return undefined;
  };

  const deleteShopGalleryImage = async (index: number) => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const gallery = currentBusinessShop.galleryImages || [];
    const targetUrl = gallery[index];
    const updatedGallery = gallery.filter((_, i) => i !== index);
    const updated = { ...currentBusinessShop, id: targetShopId, galleryImages: updatedGallery };
    setCurrentBusinessShop(updated);
    setShops(prev => prev.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    if (targetUrl) {
      await SupabaseAPI.deleteShopGalleryImage(targetShopId, targetUrl, updatedGallery);
    } else {
      await SupabaseAPI.upsertShop(updated);
    }
  };

  const uploadServiceImageItem = async (serviceId: string, file: File | Blob | string): Promise<string | undefined> => {
    const targetShopId = currentBusinessShop.id || 'shop-1';
    const oldService = services.find(s => s.id === serviceId);
    try {
      const res = await SupabaseStorage.uploadServiceImage(targetShopId, serviceId, file, oldService?.image);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : undefined);
      if (finalUrl) {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, image: finalUrl } : s));
        await supabase.from('services').update({ image: finalUrl, updated_at: new Date().toISOString() }).eq('id', serviceId);
        return finalUrl;
      }
    } catch (err) {
      console.warn('Service image upload notice:', err);
    }
    return undefined;
  };

  const uploadStylistAvatarItem = async (stylistId: string, file: File | Blob | string): Promise<string | undefined> => {
    const targetShopId = currentBusinessShop.id || 'shop-1';
    const oldStylist = stylists.find(s => s.id === stylistId);
    try {
      const res = await SupabaseStorage.uploadStylistAvatar(targetShopId, stylistId, file, oldStylist?.avatar);
      const finalUrl = res.publicUrl || (typeof file === 'string' ? file : undefined);
      if (finalUrl) {
        setStylists(prev => prev.map(st => st.id === stylistId ? { ...st, avatar: finalUrl } : st));
        await supabase.from('stylists').update({ avatar: finalUrl, updated_at: new Date().toISOString() }).eq('id', stylistId);
        return finalUrl;
      }
    } catch (err) {
      console.warn('Stylist avatar upload notice:', err);
    }
    return undefined;
  };

  const uploadTradeLicenseDoc = async (docUrlOrBase64: string | File | Blob, docNo?: string) => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldDoc = currentBusinessShop.tradeLicenseDocumentUrl;
    let finalDocUrl = typeof docUrlOrBase64 === 'string' ? docUrlOrBase64 : '';
    try {
      const res = await SupabaseStorage.uploadTradeLicenseDocument(targetShopId, docUrlOrBase64, undefined, oldDoc);
      if (res.publicUrl) finalDocUrl = res.publicUrl;
    } catch (err) {
      console.warn('License storage upload notice:', err);
    }
    const updated = {
      ...currentBusinessShop,
      id: targetShopId,
      tradeLicenseDocumentUrl: finalDocUrl || undefined,
      ...(docNo ? { tradeLicenseNo: docNo } : {})
    };
    setCurrentBusinessShop(updated);
    setShops(all => all.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.upsertShop(updated);
    return updated;
  };

  const deleteTradeLicenseDoc = async () => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldDoc = currentBusinessShop.tradeLicenseDocumentUrl;
    if (oldDoc) {
      await SupabaseStorage.deleteFileByUrl(oldDoc);
    }
    const updated = {
      ...currentBusinessShop,
      id: targetShopId,
      tradeLicenseDocumentUrl: undefined
    };
    setCurrentBusinessShop(updated);
    setShops(all => all.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.upsertShop(updated);
    return updated;
  };

  const uploadTaxVatDoc = async (docUrlOrBase64: string | File | Blob, taxNo?: string) => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldDoc = currentBusinessShop.taxVatDocumentUrl;
    let finalDocUrl = typeof docUrlOrBase64 === 'string' ? docUrlOrBase64 : '';
    try {
      const res = await SupabaseStorage.uploadTaxDocument(targetShopId, docUrlOrBase64, undefined, oldDoc);
      if (res.publicUrl) finalDocUrl = res.publicUrl;
    } catch (err) {
      console.warn('Tax storage upload notice:', err);
    }
    const updated = {
      ...currentBusinessShop,
      id: targetShopId,
      taxVatDocumentUrl: finalDocUrl || undefined,
      ...(taxNo ? { taxVatNo: taxNo } : {})
    };
    setCurrentBusinessShop(updated);
    setShops(all => all.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.upsertShop(updated);
    return updated;
  };

  const deleteTaxVatDoc = async () => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const oldDoc = currentBusinessShop.taxVatDocumentUrl;
    if (oldDoc) {
      await SupabaseStorage.deleteFileByUrl(oldDoc);
    }
    const updated = {
      ...currentBusinessShop,
      id: targetShopId,
      taxVatDocumentUrl: undefined
    };
    setCurrentBusinessShop(updated);
    setShops(all => all.map(s => s.id === targetShopId ? updated : s));
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.upsertShop(updated);
    return updated;
  };

  const runStorageCleanup = async () => {
    return await SupabaseStorage.cleanupOrphanedFiles();
  };

  // Permanent Account Deletion
  const deleteCustomerAccountPermanently = async () => {
    try {
      await SupabaseAuth.deleteAccount();
    } catch (e) {
      console.warn('Account deletion notice:', e);
    }
    localStorage.removeItem(STORAGE_KEY + '_customer');
    localStorage.removeItem(STORAGE_KEY + '_transactions');
    localStorage.removeItem(STORAGE_KEY + '_bookings');
    setCustomer(initialCustomer);
    setCart([]);
    signOutSupabase();
    setCustomerScreen('splash');
  };

  const deleteShopAccountPermanently = async () => {
    try {
      await SupabaseAuth.deleteAccount();
    } catch (e) {
      console.warn('Shop deletion notice:', e);
    }
    localStorage.removeItem(STORAGE_KEY + '_shops');
    localStorage.removeItem(STORAGE_KEY + '_inventory');
    localStorage.removeItem(STORAGE_KEY + '_payrolls');
    setShops(initialShops);
    setCurrentBusinessShop(initialShops[0]);
    signOutSupabase();
    setBusinessScreen('auth');
  };

  // Service Offers & Discounts
  const setServiceDiscount = (serviceId: string, discountPercent: number) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id !== serviceId) return s;
        const originalPrice = s.originalPrice || s.price;
        const discountedPrice = Math.max(1, Math.round(originalPrice * (1 - discountPercent / 100)));
        return {
          ...s,
          originalPrice,
          price: discountedPrice,
          discountPercent
        };
      })
    );
  };

  const removeServiceDiscount = (serviceId: string) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          price: s.originalPrice || s.price,
          originalPrice: undefined,
          discountPercent: undefined
        };
      })
    );
  };

  const bulkApplyDiscountToAllServices = (discountPercent: number) => {
    setServices(prev =>
      prev.map(s => {
        const originalPrice = s.originalPrice || s.price;
        if (discountPercent <= 0) {
          return {
            ...s,
            price: originalPrice,
            originalPrice: undefined,
            discountPercent: undefined
          };
        }
        const discountedPrice = Math.max(1, Math.round(originalPrice * (1 - discountPercent / 100)));
        return {
          ...s,
          originalPrice,
          price: discountedPrice,
          discountPercent
        };
      })
    );
  };

  const createShopOffer = (offer: Omit<Offer, 'id'>) => {
    const targetShopId = currentBusinessShop.id || 'shop-1';
    const newOffer: Offer = {
      ...offer,
      id: 'off-' + Date.now(),
      code: offer.code.trim().toUpperCase()
    };
    (newOffer as any).shopId = targetShopId;
    setOffers(prev => [newOffer, ...prev]);
    SupabaseAPI.addOffer(newOffer, targetShopId);
  };

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    SupabaseAPI.deleteOffer(offerId);
  };

  // Cart Management
  const addToCart = (service: ServiceItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(item => item.service.id !== serviceId));
  };

  const updateCartQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedAddOns([]);
    setAppliedOffer(null);
  };

  const toggleAddOn = (addon: AddOnItem) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const applyOfferCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = offers.find(o => o.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Please try another.' };
    }
    setAppliedOffer(found);
    return { success: true, message: `Coupon ${found.code} applied! ${found.discountPercent}% discount added.` };
  };

  const removeOffer = () => {
    setAppliedOffer(null);
  };

  // Booking Lifecycle Actions with Real Live Date & Time Formatting
  const createBooking = (paymentMethod: PaymentMethod): Booking => {
    const subtotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0) +
      selectedAddOns.reduce((acc, addon) => acc + addon.price, 0);

    let discount = 0;
    if (appliedOffer) {
      discount = Math.round((subtotal * appliedOffer.discountPercent) / 100);
    }
    const totalAmount = Math.max(0, subtotal - discount);

    const newId = 'AS' + Math.floor(100000 + Math.random() * 900000);
    const status = paymentMethod === 'pay_at_salon' ? 'pending' : 'confirmed';

    // Format dynamic live booking date
    const formattedDate = formatLiveBookingDate(selectedDate);

    const activeShop = selectedShop || shops[0] || currentBusinessShop;
    const activeShopName = activeShop?.name || 'ALGO Salon';
    const activeShopAddress = activeShop?.address || 'Salon Location';
    const activeShopId = activeShop?.id || 'shop-1';
    const activeStylist: Stylist = selectedStylist || stylists[0] || {
      id: 'stylist-default',
      shopId: activeShopId,
      name: 'Any Master Stylist',
      role: 'Master Stylist',
      rating: 5.0,
      reviewCount: 0,
      experience: '5+ Years',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialties: ['Hair Styling', 'Grooming'],
      isAvailable: true
    };

    const newBooking: Booking = {
      id: newId,
      customerId: customer.id || 'cust-direct',
      customerName: customer.name || 'Valued Customer',
      customerPhone: customer.phone || '',
      shopId: activeShopId,
      shopName: activeShopName,
      shopAddress: activeShopAddress,
      shopGoogleMapsUrl: activeShop?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(activeShopAddress)}`,
      services: cart.map(item => ({
        serviceId: item.service.id,
        name: item.service.name,
        price: item.service.price,
        quantity: item.quantity
      })),
      addOns: selectedAddOns.map(a => ({
        addOnId: a.id,
        name: a.name,
        price: a.price
      })),
      stylist: activeStylist,
      date: selectedDate,
      formattedDate: formattedDate,
      timeSlot: selectedTimeSlot,
      subtotal,
      discountAmount: discount,
      couponCode: appliedOffer?.code,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'pay_at_salon' ? 'pay_at_salon' : 'paid',
      status: status,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setCurrentBookingDetail(newBooking);

    // Persist real booking to Supabase Database
    SupabaseAPI.createBooking(newBooking);

    if (paymentMethod === 'wallet') {
      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        type: 'debit',
        title: 'Booking Payment - ' + newBooking.shopName,
        amount: totalAmount,
        date: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        status: 'Completed',
        bookingId: newId
      };
      setCustomer(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - totalAmount)
      }));
      setTransactions(prev => [newTx, ...prev]);
      if (customer.id) {
        SupabaseAPI.addWalletTransaction(newTx, customer.id);
      }
    }

    const notifMsg = paymentMethod === 'pay_at_salon'
      ? `Booking request ${newId} sent for ${formattedDate} at ${selectedTimeSlot}. Waiting for ${activeShopName} confirmation.`
      : `Your booking ${newId} is confirmed with ${newBooking.stylist.name} for ${formattedDate} at ${selectedTimeSlot}.`;

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: paymentMethod === 'pay_at_salon' ? 'Booking Request Placed 🕒' : 'Booking Confirmed! ✂️',
      message: notifMsg,
      time: 'Just now',
      type: 'booking',
      isRead: false,
      bookingId: newId
    };

    setNotifications(prev => [newNotif, ...prev]);
    if (customer.id) {
      SupabaseAPI.addNotification(newNotif, customer.id);
    }

    return newBooking;
  };

  const acceptBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );

    // Persist update to Supabase
    SupabaseAPI.updateBookingStatus(bookingId, 'confirmed');

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      if (currentBookingDetail?.id === bookingId) {
        setCurrentBookingDetail(prev => (prev ? { ...prev, status: 'confirmed' } : null));
      }
      setNotifications(prev => [
        {
          id: 'notif-' + Date.now(),
          title: 'Salon Accepted Your Booking! 🎉',
          message: `${booking.shopName} accepted appointment ${bookingId} for ${booking.formattedDate} at ${booking.timeSlot}.`,
          time: 'Just now',
          type: 'booking',
          isRead: false,
          bookingId
        },
        ...prev
      ]);
    }
  };

  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled', shopNotes: reason || 'Declined by salon' } : b))
    );

    // Persist update to Supabase
    SupabaseAPI.updateBookingStatus(bookingId, 'cancelled', reason);

    if (currentBookingDetail?.id === bookingId) {
      setCurrentBookingDetail(prev => (prev ? { ...prev, status: 'cancelled' } : null));
    }
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Booking Request Update',
        message: `Appointment ${bookingId} could not be accepted at this time. ${reason || 'Please choose another slot.'}`,
        time: 'Just now',
        type: 'booking',
        isRead: false,
        bookingId
      },
      ...prev
    ]);
  };

  const completeBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'completed' } : b))
    );

    // Persist update to Supabase
    SupabaseAPI.updateBookingStatus(bookingId, 'completed');

    if (currentBookingDetail?.id === bookingId) {
      setCurrentBookingDetail(prev => (prev ? { ...prev, status: 'completed' } : null));
    }
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Service Completed! ✨',
        message: `Thank you for visiting! How was your grooming experience? Leave a review for ${currentBookingDetail?.stylist.name || 'your stylist'}.`,
        time: 'Just now',
        type: 'booking',
        isRead: false,
        bookingId
      },
      ...prev
    ]);
  };

  const rescheduleBooking = (bookingId: string, newDate: string, newTime: string) => {
    const formatted = formatLiveBookingDate(newDate);

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              date: newDate,
              formattedDate: formatted,
              timeSlot: newTime,
              status: 'confirmed'
            }
          : b
      )
    );

    // Persist update to Supabase
    SupabaseAPI.rescheduleBooking(bookingId, newDate, formatted, newTime);

    if (currentBookingDetail?.id === bookingId) {
      setCurrentBookingDetail(prev =>
        prev
          ? {
              ...prev,
              date: newDate,
              formattedDate: formatted,
              timeSlot: newTime,
              status: 'confirmed'
            }
          : null
      );
    }

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Booking Rescheduled',
        message: `Your appointment ${bookingId} is now set for ${formatted} at ${newTime}.`,
        time: 'Just now',
        type: 'reminder',
        isRead: false,
        bookingId
      },
      ...prev
    ]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Persist update to Supabase
    SupabaseAPI.updateBookingStatus(bookingId, 'cancelled');

    if (currentBookingDetail?.id === bookingId) {
      setCurrentBookingDetail(prev => (prev ? { ...prev, status: 'cancelled' } : null));
    }
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Booking Cancelled',
        message: `Appointment ${bookingId} has been successfully cancelled.`,
        time: 'Just now',
        type: 'booking',
        isRead: false,
        bookingId
      },
      ...prev
    ]);
  };

  const addWalletMoney = async (amount: number) => {
    let newBal = customer.walletBalance + amount;
    try {
      const res = await SupabaseAPI.rechargeWallet(amount, 'Wallet Recharge');
      if (res.success && res.newBalance !== undefined) {
        newBal = res.newBalance;
      }
    } catch (e) {
      console.warn('Wallet recharge sync note:', e);
    }

    setCustomer(prev => ({
      ...prev,
      walletBalance: newBal
    }));
    setTransactions(prev => [
      {
        id: 'tx-' + Date.now(),
        type: 'credit',
        title: 'Add Money',
        amount,
        date: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        status: 'Completed'
      },
      ...prev
    ]);
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Wallet Recharged',
        message: `${formatPrice(amount)} added to your ALGO Wallet successfully. Current balance: ${formatPrice(newBal)}`,
        time: 'Just now',
        type: 'wallet',
        isRead: false
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Business Management Actions
  const registerShop = (shopData: Partial<BusinessShop>): BusinessShop => {
    const targetOwnerId = supabaseSession?.user?.id || shopData.ownerId;
    const targetEmail = (shopData.email || supabaseSession?.user?.email || customer.email || '').trim().toLowerCase();
    const targetOwnerName = shopData.ownerName || customer.name || supabaseSession?.user?.user_metadata?.full_name || 'Shop Owner';

    const newShop: BusinessShop = {
      id: shopData.id || ('shop-' + Date.now()),
      ownerId: targetOwnerId,
      name: shopData.name || 'New Salon Branch',
      ownerName: targetOwnerName,
      phone: shopData.phone || '',
      email: targetEmail,
      address: shopData.address || '',
      city: shopData.city || '',
      country: shopData.country || 'India',
      businessType: shopData.businessType || ['Salon', 'Barber'],
      staffCount: Number(shopData.staffCount) || 3,
      openingTime: shopData.openingTime || '09:00 AM',
      closingTime: shopData.closingTime || '09:00 PM',
      workingDays: shopData.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      rating: 5.0,
      reviewCount: 0,
      distance: '0.2 km',
      image: shopData.image || DEFAULT_SHOP_IMAGE,
      bannerImage: shopData.bannerImage,
      galleryImages: shopData.galleryImages || [],
      isOpen: true,
      tradeLicenseNo: shopData.tradeLicenseNo || '',
      taxVatNo: shopData.taxVatNo || '',
      tradeLicenseDocumentUrl: shopData.tradeLicenseDocumentUrl,
      taxVatDocumentUrl: shopData.taxVatDocumentUrl,
      isVerified: true,
      googleMapsUrl: shopData.googleMapsUrl || (shopData.address ? `https://maps.google.com/?q=${encodeURIComponent(shopData.address)}` : '')
    };

    setShops(prev => [newShop, ...prev.filter(s => s.id !== newShop.id)]);
    setCurrentBusinessShop(newShop);
    setSelectedShop(newShop);
    SupabaseAPI.upsertShop(newShop);

    if (targetOwnerId) {
      SupabaseAPI.upsertProfile({
        id: targetOwnerId,
        name: targetOwnerName,
        email: targetEmail,
        role: 'business'
      });
    }

    return newShop;
  };

  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const targetShopId = currentBusinessShop.id || 'shop-1';
    const finalImage = service.image || getAiServiceAvatar(service.name, service.category);
    const newSrv: ServiceItem = {
      shopId: targetShopId,
      ...service,
      image: finalImage,
      id: 'srv-' + Date.now()
    };
    setServices(prev => [newSrv, ...prev]);
    SupabaseAPI.addService(newSrv);
  };

  const updateService = (service: ServiceItem) => {
    const targetShopId = service.shopId || currentBusinessShop.id || 'shop-1';
    const finalImage = service.image || getAiServiceAvatar(service.name, service.category);
    const updatedSrv = { ...service, shopId: targetShopId, image: finalImage };
    setServices(prev => prev.map(s => (s.id === service.id ? updatedSrv : s)));
    SupabaseAPI.updateService(updatedSrv);
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    SupabaseAPI.deleteService(serviceId);
  };

  const addStylist = (stylist: Omit<Stylist, 'id'>) => {
    const targetShopId = stylist.shopId || currentBusinessShop.id || 'shop-1';
    const finalAvatar = stylist.avatar || getAiStylistAvatar(stylist.name, stylist.role);
    const newSty: Stylist = {
      ...stylist,
      avatar: finalAvatar,
      shopId: targetShopId,
      id: 'stylist-' + Date.now()
    };
    setStylists(prev => [newSty, ...prev]);
    SupabaseAPI.addStylist(newSty);
  };

  const updateStylist = (stylist: Stylist) => {
    const targetShopId = stylist.shopId || currentBusinessShop.id || 'shop-1';
    const updatedSty = { ...stylist, shopId: targetShopId };
    setStylists(prev => prev.map(s => (s.id === stylist.id ? updatedSty : s)));
    SupabaseAPI.updateStylist(updatedSty);
  };

  const deleteStylist = (stylistId: string) => {
    setStylists(prev => prev.filter(s => s.id !== stylistId));
    SupabaseAPI.deleteStylist(stylistId);
  };

  const updateShopSettings = async (settings: Partial<BusinessShop>) => {
    const targetShopId = currentBusinessShop.id && currentBusinessShop.id.trim() !== '' ? currentBusinessShop.id : 'shop-' + Date.now();
    const targetOwnerId = supabaseSession?.user?.id || currentBusinessShop.ownerId;
    const updated: BusinessShop = { ...currentBusinessShop, id: targetShopId, ownerId: targetOwnerId, ...settings };
    setCurrentBusinessShop(updated);
    setShops(prev => {
      const exists = prev.some(s => s.id === targetShopId || (s.email && updated.email && s.email.toLowerCase() === updated.email.toLowerCase()));
      if (exists) {
        return prev.map(s => (s.id === targetShopId || (s.email && updated.email && s.email.toLowerCase() === updated.email.toLowerCase())) ? updated : s);
      }
      return [updated, ...prev];
    });
    setSelectedShop(prev => prev?.id === targetShopId ? updated : prev);
    await SupabaseAPI.upsertShop(updated);
    if (updated.ownerName || updated.email || updated.phone) {
      await SupabaseAPI.upsertProfile({
        id: targetOwnerId || targetShopId,
        name: updated.ownerName,
        email: updated.email,
        phone: updated.phone,
        role: 'business'
      });
    }
  };

  // Inventory Management Actions
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const targetShopId = currentBusinessShop.id || 'shop-1';
    const newItem: InventoryItem = {
      shopId: targetShopId,
      ...item,
      id: 'inv-' + Date.now(),
      lastRestocked: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setInventory(prev => [newItem, ...prev]);
    SupabaseAPI.addInventoryItem(newItem);
  };

  const updateStock = (itemId: string, newQty: number) => {
    const restockedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              stockQty: Math.max(0, newQty),
              lastRestocked: restockedDate
            }
          : item
      )
    );
    SupabaseAPI.updateStock(itemId, Math.max(0, newQty), restockedDate);
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
    SupabaseAPI.deleteInventoryItem(itemId);
  };

  // Payroll Actions
  const markPayrollPaid = (payrollId: string) => {
    const paidOn = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPayrolls(prev =>
      prev.map(p =>
        p.id === payrollId
          ? {
              ...p,
              status: 'Paid',
              paidOn
            }
          : p
      )
    );
    SupabaseAPI.updatePayrollStatus(payrollId, 'Paid', paidOn);
  };

  // Generic CSV Download Helper
  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBookingsToCSV = () => {
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Stylist', 'Date', 'Time Slot', 'Services', `Total (${currency.code})`, 'Payment Mode', 'Status', 'Created At'];
    const rows = bookings.map(b => [
      b.id,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.stylist.name}"`,
      b.formattedDate,
      b.timeSlot,
      `"${b.services.map(s => s.name).join('; ')}"`,
      formatPrice(b.totalAmount),
      b.paymentMethod,
      b.status,
      b.createdAt
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`algo_saloon_bookings_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const exportRevenueToCSV = () => {
    const headers = ['Date', 'Booking ID', 'Customer', 'Stylist', 'Services Total', 'AddOns Total', 'Discount', `Net Collected (${currency.code})`, 'Payment Mode'];
    const rows = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').map(b => [
      b.formattedDate,
      b.id,
      `"${b.customerName}"`,
      `"${b.stylist.name}"`,
      b.subtotal - (b.addOns?.reduce((acc, a) => acc + a.price, 0) || 0),
      b.addOns?.reduce((acc, a) => acc + a.price, 0) || 0,
      b.discountAmount,
      formatPrice(b.totalAmount),
      b.paymentMethod
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`algo_saloon_revenue_statement_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const exportInventoryToCSV = () => {
    const headers = ['Item ID', 'Product Name', 'Category', 'Brand', 'Current Stock', 'Min Threshold', 'Unit', `Unit Cost (${currency.code})`, `Selling Price (${currency.code})`, 'Supplier', 'Last Restocked'];
    const rows = inventory.map(i => [
      i.id,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.brand}"`,
      i.stockQty,
      i.minThreshold,
      i.unit,
      formatPrice(i.unitCostPrice),
      i.sellingPrice ? formatPrice(i.sellingPrice) : 'N/A',
      `"${i.supplier}"`,
      i.lastRestocked
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`algo_saloon_inventory_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const exportPayrollToCSV = () => {
    const headers = ['Payroll ID', 'Stylist Name', 'Role', 'Month', `Base Salary (${currency.code})`, 'Services Count', `Revenue Generated (${currency.code})`, 'Commission Rate (%)', `Commission Amount (${currency.code})`, `Bonus (${currency.code})`, `Deductions (${currency.code})`, `Net Payout (${currency.code})`, 'Status', 'Paid On'];
    const rows = payrolls.map(p => [
      p.id,
      `"${p.stylistName}"`,
      `"${p.role}"`,
      p.month,
      formatPrice(p.baseSalary),
      p.servicesRenderedCount,
      formatPrice(p.serviceRevenueGenerated),
      p.commissionRate,
      formatPrice(p.commissionAmount),
      formatPrice(p.bonus),
      formatPrice(p.deductions),
      formatPrice(p.netPayout),
      p.status,
      p.paidOn || 'N/A'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`algo_saloon_payroll_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCustomer(defaultEmptyCustomer);
    setShops([]);
    setSelectedShop(null);
    setCurrentBusinessShop(defaultEmptyBusinessShop);
    setStylists([]);
    setServices([]);
    setOffers([]);
    setBookings([]);
    setTransactions([]);
    setNotifications([]);
    setInventory([]);
    setPayrolls([]);
    setCurrency(supportedCurrencies[0]);
    setSelectedDate(getLiveTodayDate());
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        customerScreen,
        setCustomerScreen,
        customerActiveTab,
        setCustomerActiveTab,
        businessScreen,
        setBusinessScreen,
        businessActiveTab,
        setBusinessActiveTab,
        deviceViewMode,
        setDeviceViewMode,
        authInitialRole,
        setAuthInitialRole,
        authInitialTab,
        setAuthInitialTab,
        userLocation,
        setUserLocation,
        userCoords,
        isLocationDetected,
        detectUserLocationAndCurrency,
        calculateDistanceToShop,
        supabaseSession,
        checkAuthSession,
        signOutSupabase,
        currency,
        setCurrency,
        formatPrice,
        formatBookingDate: formatLiveBookingDate,
        customer,
        setCustomer,
        updateCustomerProfile,
        shops,
        selectedShop,
        setSelectedShop,
        currentBusinessShop,
        stylists,
        services,
        addOns,
        offers,
        bookings,
        transactions,
        notifications,
        inventory,
        payrolls,
        cart,
        selectedStylist,
        selectedDate,
        selectedTimeSlot,
        selectedAddOns,
        appliedOffer,
        currentBookingDetail,
        setCurrentBookingDetail,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleAddOn,
        setSelectedStylist,
        setSelectedDate,
        setSelectedTimeSlot,
        applyOfferCode,
        removeOffer,
        createBooking,
        acceptBooking,
        rejectBooking,
        completeBooking,
        rescheduleBooking,
        cancelBooking,
        addWalletMoney,
        markNotificationAsRead,
        clearAllNotifications,
        registerCustomerAccount,
        registerBusinessOwnerAccount,
        registerShop,
        addService,
        updateService,
        deleteService,
        addStylist,
        updateStylist,
        deleteStylist,
        updateShopSettings,
        addInventoryItem,
        updateStock,
        deleteInventoryItem,
        markPayrollPaid,
        exportBookingsToCSV,
        exportRevenueToCSV,
        exportInventoryToCSV,
        exportPayrollToCSV,
        loginWithGoogle,
        uploadCustomerAvatar,
        deleteCustomerAvatar,
        uploadShopAvatar,
        deleteShopAvatar,
        uploadShopBanner,
        deleteShopBanner,
        uploadShopVideo,
        deleteShopVideo,
        addShopGalleryImage,
        deleteShopGalleryImage,
        uploadServiceImageItem,
        uploadStylistAvatarItem,
        uploadTradeLicenseDoc,
        deleteTradeLicenseDoc,
        uploadTaxVatDoc,
        deleteTaxVatDoc,
        runStorageCleanup,
        deleteCustomerAccountPermanently,
        deleteShopAccountPermanently,
        setServiceDiscount,
        removeServiceDiscount,
        bulkApplyDiscountToAllServices,
        createShopOffer,
        deleteOffer,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
