export type AppMode = 'customer' | 'business';

export type CustomerTab = 'home' | 'services' | 'bookings' | 'wallet' | 'profile';
export type BusinessTab = 'home' | 'appointments' | 'services' | 'staff' | 'inventory' | 'payroll' | 'reports' | 'settings';

export type CustomerScreen = 
  | 'splash'
  | 'auth'
  | 'home'
  | 'services'
  | 'select_staff'
  | 'choose_datetime'
  | 'add_ons'
  | 'cart'
  | 'payment'
  | 'booking_confirmed'
  | 'my_bookings'
  | 'booking_details'
  | 'wallet'
  | 'offers'
  | 'notifications'
  | 'profile';

export type BusinessScreen =
  | 'auth'
  | 'dashboard'
  | 'appointments'
  | 'services_mgr'
  | 'staff_mgr'
  | 'inventory'
  | 'payroll'
  | 'reports'
  | 'settings'
  | 'register_shop';

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export type PaymentMethod = 
  | 'pay_at_salon'
  | 'upi'
  | 'gpay'
  | 'phonepe'
  | 'paytm'
  | 'card'
  | 'net_banking'
  | 'wallet';

export interface CurrencyInfo {
  code: string; // 'INR' | 'AED' | 'USD' | 'GBP' | 'EUR' | 'SGD' | 'SAR'
  symbol: string; // '₹' | 'AED' | '$' | '£' | '€' | 'S$' | 'SAR'
  name: string;
  rateFromINR: number;
  country: string;
  flag: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  walletBalance: number;
  savedAddresses: string[];
  authProvider?: 'google' | 'password';
  isVerified?: boolean;
}

export interface BusinessShop {
  id: string;
  ownerId?: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  businessType: ('Salon' | 'Barber' | 'Beauty' | 'Spa' | 'Unisex')[];
  staffCount: number;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  rating: number;
  reviewCount: number;
  distance: string;
  image: string; // Avatar / Logo
  bannerImage?: string; // Large Cover Banner
  bannerVideoUrl?: string; // Showcase promo video URL
  promoVideos?: string[]; // Multiple showcase video URLs
  galleryImages?: string[]; // Showcase photos
  isOpen: boolean;
  tradeLicenseNo: string;
  taxVatNo?: string;
  tradeLicenseDocumentUrl?: string; // Uploaded Shop License Doc
  taxVatDocumentUrl?: string; // Uploaded Tax / GST / Others Doc
  isVerified: boolean;
  googleMapsUrl?: string; // Google Maps URL link for navigation
  latitude?: number;
  longitude?: number;
  priceTier?: 'budget' | 'premium' | 'vip'; // Price categorization (Low Price, Premium, VIP)
  avgPrice?: number;
  authProvider?: 'google' | 'password';
}

export interface Stylist {
  id: string;
  shopId: string;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  experience: string;
  avatar: string;
  specialties: string[];
  isAvailable: boolean;
  baseSalary?: number;
  commissionRate?: number; // e.g. 15%
}

export interface ServiceItem {
  id: string;
  shopId?: string;
  name: string;
  category: 'Hair' | 'Beard' | 'Skin' | 'Spa' | 'Packages' | 'Add-ons';
  description: string;
  price: number;
  originalPrice?: number; // For discount strikethrough (e.g. ₹399 with original ₹499)
  discountPercent?: number; // e.g. 20%
  durationMinutes: number;
  image: string;
  isPopular?: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopGoogleMapsUrl?: string;
  services: {
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  addOns: {
    addOnId: string;
    name: string;
    price: number;
  }[];
  stylist: Stylist;
  date: string;
  formattedDate: string;
  timeSlot: string;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pay_at_salon';
  status: BookingStatus;
  createdAt: string;
  shopNotes?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending';
  bookingId?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discountPercent: number;
  discountAmount?: number;
  minSpend: number;
  validTill: string;
  category: string;
  image: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'offer' | 'wallet' | 'reminder' | 'system';
  isRead: boolean;
  bookingId?: string;
}

export interface InventoryItem {
  id: string;
  shopId?: string;
  name: string;
  category: 'Hair Care' | 'Beard & Shave' | 'Skin & Facial' | 'Color & Spa' | 'Equipment';
  brand: string;
  stockQty: number;
  minThreshold: number;
  unit: string;
  unitCostPrice: number;
  sellingPrice?: number;
  supplier: string;
  lastRestocked: string;
}

export interface PayrollRecord {
  id: string;
  shopId?: string;
  stylistId: string;
  stylistName: string;
  role: string;
  month: string;
  baseSalary: number;
  servicesRenderedCount: number;
  serviceRevenueGenerated: number;
  commissionRate: number;
  commissionAmount: number;
  bonus: number;
  deductions: number;
  netPayout: number;
  status: 'Paid' | 'Pending Approval';
  paidOn?: string;
}
