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
  CurrencyInfo,
  CountryInfo
} from '../types';

export const supportedCurrencies: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India', rateFromINR: 1, flag: '🇮🇳', countryCode: 'IN', phoneCountryCode: '+91' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', country: 'United Arab Emirates', rateFromINR: 0.044, flag: '🇦🇪', countryCode: 'AE', phoneCountryCode: '+971' },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', rateFromINR: 0.012, flag: '🇺🇸', countryCode: 'US', phoneCountryCode: '+1' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', rateFromINR: 0.0095, flag: '🇬🇧', countryCode: 'GB', phoneCountryCode: '+44' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', rateFromINR: 0.011, flag: '🇪🇺', countryCode: 'EU', phoneCountryCode: '+49' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore', rateFromINR: 0.016, flag: '🇸🇬', countryCode: 'SG', phoneCountryCode: '+65' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia', rateFromINR: 0.045, flag: '🇸🇦', countryCode: 'SA', phoneCountryCode: '+966' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada', rateFromINR: 0.016, flag: '🇨🇦', countryCode: 'CA', phoneCountryCode: '+1' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', rateFromINR: 0.018, flag: '🇦🇺', countryCode: 'AU', phoneCountryCode: '+61' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal', country: 'Qatar', rateFromINR: 0.044, flag: '🇶🇦', countryCode: 'QA', phoneCountryCode: '+974' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait', rateFromINR: 0.0037, flag: '🇰🇼', countryCode: 'KW', phoneCountryCode: '+965' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', country: 'Oman', rateFromINR: 0.0046, flag: '🇴🇲', countryCode: 'OM', phoneCountryCode: '+968' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar', country: 'Bahrain', rateFromINR: 0.0045, flag: '🇧🇭', countryCode: 'BH', phoneCountryCode: '+973' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia', rateFromINR: 0.057, flag: '🇲🇾', countryCode: 'MY', phoneCountryCode: '+60' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan', rateFromINR: 1.85, flag: '🇯🇵', countryCode: 'JP', phoneCountryCode: '+81' }
];

export const supportedCountries: CountryInfo[] = [
  { code: 'AE', name: 'United Arab Emirates', currencyCode: 'AED', currencySymbol: 'AED', currencyName: 'UAE Dirham', phoneCountryCode: '+971', flag: '🇦🇪', defaultCity: 'Dubai', defaultLat: 25.2048, defaultLng: 55.2708 },
  { code: 'IN', name: 'India', currencyCode: 'INR', currencySymbol: '₹', currencyName: 'Indian Rupee', phoneCountryCode: '+91', flag: '🇮🇳', defaultCity: 'Chennai', defaultLat: 13.0827, defaultLng: 80.2707 },
  { code: 'US', name: 'United States', currencyCode: 'USD', currencySymbol: '$', currencyName: 'US Dollar', phoneCountryCode: '+1', flag: '🇺🇸', defaultCity: 'New York', defaultLat: 40.7128, defaultLng: -74.0060 },
  { code: 'GB', name: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£', currencyName: 'British Pound', phoneCountryCode: '+44', flag: '🇬🇧', defaultCity: 'London', defaultLat: 51.5074, defaultLng: -0.1278 },
  { code: 'SA', name: 'Saudi Arabia', currencyCode: 'SAR', currencySymbol: 'SAR', currencyName: 'Saudi Riyal', phoneCountryCode: '+966', flag: '🇸🇦', defaultCity: 'Riyadh', defaultLat: 24.7136, defaultLng: 46.6753 },
  { code: 'SG', name: 'Singapore', currencyCode: 'SGD', currencySymbol: 'S$', currencyName: 'Singapore Dollar', phoneCountryCode: '+65', flag: '🇸🇬', defaultCity: 'Singapore', defaultLat: 1.3521, defaultLng: 103.8198 },
  { code: 'QA', name: 'Qatar', currencyCode: 'QAR', currencySymbol: 'QAR', currencyName: 'Qatari Riyal', phoneCountryCode: '+974', flag: '🇶🇦', defaultCity: 'Doha', defaultLat: 25.2854, defaultLng: 51.5310 },
  { code: 'KW', name: 'Kuwait', currencyCode: 'KWD', currencySymbol: 'KWD', currencyName: 'Kuwaiti Dinar', phoneCountryCode: '+965', flag: '🇰🇼', defaultCity: 'Kuwait City', defaultLat: 29.3759, defaultLng: 47.9774 },
  { code: 'OM', name: 'Oman', currencyCode: 'OMR', currencySymbol: 'OMR', currencyName: 'Omani Rial', phoneCountryCode: '+968', flag: '🇴🇲', defaultCity: 'Muscat', defaultLat: 23.5880, defaultLng: 58.3829 },
  { code: 'BH', name: 'Bahrain', currencyCode: 'BHD', currencySymbol: 'BHD', currencyName: 'Bahraini Dinar', phoneCountryCode: '+973', flag: '🇧🇭', defaultCity: 'Manama', defaultLat: 26.2285, defaultLng: 50.5860 },
  { code: 'CA', name: 'Canada', currencyCode: 'CAD', currencySymbol: 'C$', currencyName: 'Canadian Dollar', phoneCountryCode: '+1', flag: '🇨🇦', defaultCity: 'Toronto', defaultLat: 43.6532, defaultLng: -79.3832 },
  { code: 'AU', name: 'Australia', currencyCode: 'AUD', currencySymbol: 'A$', currencyName: 'Australian Dollar', phoneCountryCode: '+61', flag: '🇦🇺', defaultCity: 'Sydney', defaultLat: -33.8688, defaultLng: 151.2093 },
  { code: 'MY', name: 'Malaysia', currencyCode: 'MYR', currencySymbol: 'RM', currencyName: 'Malaysian Ringgit', phoneCountryCode: '+60', flag: '🇲🇾', defaultCity: 'Kuala Lumpur', defaultLat: 3.1390, defaultLng: 101.6869 },
  { code: 'JP', name: 'Japan', currencyCode: 'JPY', currencySymbol: '¥', currencyName: 'Japanese Yen', phoneCountryCode: '+81', flag: '🇯🇵', defaultCity: 'Tokyo', defaultLat: 35.6762, defaultLng: 139.6503 },
  { code: 'DE', name: 'Germany', currencyCode: 'EUR', currencySymbol: '€', currencyName: 'Euro', phoneCountryCode: '+49', flag: '🇩🇪', defaultCity: 'Berlin', defaultLat: 52.5200, defaultLng: 13.4050 },
  { code: 'FR', name: 'France', currencyCode: 'EUR', currencySymbol: '€', currencyName: 'Euro', phoneCountryCode: '+33', flag: '🇫🇷', defaultCity: 'Paris', defaultLat: 48.8566, defaultLng: 2.3522 }
];

export const getCountryByCode = (code: string): CountryInfo => {
  const normalized = (code || '').toUpperCase().trim();
  const match = supportedCountries.find(c => c.code === normalized);
  return match || supportedCountries[0]; // Default AE/UAE or IN
};

export const getCountryByName = (name: string): CountryInfo => {
  const normalized = (name || '').toLowerCase().trim();
  const match = supportedCountries.find(c => 
    c.name.toLowerCase().includes(normalized) || 
    normalized.includes(c.name.toLowerCase()) ||
    c.defaultCity.toLowerCase().includes(normalized)
  );
  return match || supportedCountries[0];
};

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
