import { 
  CustomerProfile, 
  BusinessShop, 
  Stylist, 
  ServiceItem, 
  AddOnItem, 
  Booking, 
  WalletTransaction, 
  Offer, 
  AppNotification, 
  InventoryItem, 
  PayrollRecord, 
  CurrencyInfo 
} from '../types';

export const supportedCurrencies: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India', rateFromINR: 1, flag: '🇮🇳' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', country: 'United Arab Emirates', rateFromINR: 0.044, flag: '🇦🇪' },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', rateFromINR: 0.012, flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', rateFromINR: 0.0095, flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', rateFromINR: 0.011, flag: '🇪🇺' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore', rateFromINR: 0.016, flag: '🇸🇬' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia', rateFromINR: 0.045, flag: '🇸🇦' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada', rateFromINR: 0.016, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', rateFromINR: 0.018, flag: '🇦🇺' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', country: 'Qatar', rateFromINR: 0.044, flag: '🇶🇦' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait', rateFromINR: 0.0037, flag: '🇰🇼' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', country: 'Oman', rateFromINR: 0.0046, flag: '🇴🇲' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar', country: 'Bahrain', rateFromINR: 0.0045, flag: '🇧🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia', rateFromINR: 0.057, flag: '🇲🇾' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan', rateFromINR: 1.85, flag: '🇯🇵' }
];

export const initialCustomer: CustomerProfile = {
  id: '',
  name: '',
  phone: '',
  email: '',
  avatar: '',
  walletBalance: 0,
  isVerified: false,
  savedAddresses: []
};

export const initialShops: BusinessShop[] = [];
export const initialStylists: Stylist[] = [];
export const initialServices: ServiceItem[] = [];
export const initialAddOns: AddOnItem[] = [];
export const initialOffers: Offer[] = [];
export const initialBookings: Booking[] = [];
export const initialTransactions: WalletTransaction[] = [];
export const initialNotifications: AppNotification[] = [];
export const initialInventory: InventoryItem[] = [];
export const initialPayrolls: PayrollRecord[] = [];
