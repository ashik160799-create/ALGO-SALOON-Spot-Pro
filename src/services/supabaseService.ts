import { supabase } from '../supabaseALGOClient';
import { SupabaseStorage } from './supabaseStorageService';
import {
  BusinessShop,
  Stylist,
  ServiceItem,
  Booking,
  Offer,
  InventoryItem,
  PayrollRecord,
  WalletTransaction,
  AppNotification
} from '../types';

// ============================================================================
// Realtime & Supabase Data Service for ALGO Saloon Spot
// ============================================================================

// Transform database row to BusinessShop
export const mapShopFromDB = (row: any): BusinessShop => ({
  id: row.id,
  ownerId: row.owner_id || undefined,
  name: row.name,
  ownerName: row.owner_name || '',
  phone: row.phone || '',
  email: row.email || '',
  address: row.address || '',
  city: row.city || '',
  country: row.country || 'India',
  businessType: row.business_type || ['Salon', 'Barber'],
  staffCount: row.staff_count || 5,
  openingTime: row.opening_time || '09:00 AM',
  closingTime: row.closing_time || '09:00 PM',
  workingDays: row.working_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  rating: Number(row.rating) || 4.9,
  reviewCount: Number(row.review_count) || 0,
  distance: row.distance || '1.2 km',
  image: row.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
  bannerImage: row.banner_image || undefined,
  bannerVideoUrl: row.banner_video_url || undefined,
  promoVideos: Array.isArray(row.promo_videos) ? row.promo_videos : [],
  galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
  isOpen: row.is_open ?? true,
  tradeLicenseNo: row.trade_license_no || '',
  taxVatNo: row.tax_vat_no || undefined,
  tradeLicenseDocumentUrl: row.trade_license_doc_url || undefined,
  taxVatDocumentUrl: row.tax_vat_doc_url || undefined,
  isVerified: row.is_verified ?? true,
  googleMapsUrl: row.google_maps_url || undefined,
  latitude: Number(row.latitude) || (row.city === 'Dubai' ? 25.2048 : 13.0827),
  longitude: Number(row.longitude) || (row.city === 'Dubai' ? 55.2708 : 80.2707),
  priceTier: (row.price_tier as any) || 'budget',
  avgPrice: Number(row.avg_price) || 250
});

// Transform BusinessShop to database row
export const mapShopToDB = (shop: BusinessShop) => ({
  id: shop.id,
  owner_id: shop.ownerId,
  name: shop.name,
  owner_name: shop.ownerName,
  phone: shop.phone,
  email: shop.email,
  address: shop.address,
  city: shop.city,
  country: shop.country,
  business_type: shop.businessType,
  staff_count: shop.staffCount,
  opening_time: shop.openingTime,
  closing_time: shop.closingTime,
  working_days: shop.workingDays,
  rating: shop.rating,
  review_count: shop.reviewCount,
  distance: shop.distance,
  image: shop.image,
  banner_image: shop.bannerImage,
  banner_video_url: shop.bannerVideoUrl,
  promo_videos: shop.promoVideos || [],
  gallery_images: shop.galleryImages || [],
  is_open: shop.isOpen,
  trade_license_no: shop.tradeLicenseNo,
  tax_vat_no: shop.taxVatNo,
  trade_license_doc_url: shop.tradeLicenseDocumentUrl,
  tax_vat_doc_url: shop.taxVatDocumentUrl,
  is_verified: shop.isVerified,
  google_maps_url: shop.googleMapsUrl,
  latitude: shop.latitude || 13.0827,
  longitude: shop.longitude || 80.2707,
  price_tier: shop.priceTier || 'budget',
  avg_price: shop.avgPrice || 250,
  updated_at: new Date().toISOString()
});

// Transform database row to Stylist
export const mapStylistFromDB = (row: any): Stylist => ({
  id: row.id,
  shopId: row.shop_id || 'shop-1',
  name: row.name,
  role: row.role || 'Stylist',
  rating: Number(row.rating) || 4.9,
  reviewCount: Number(row.review_count) || 0,
  experience: row.experience || '5+ Years',
  avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  specialties: row.specialties || ['Hair Styling'],
  isAvailable: row.is_available ?? true,
  baseSalary: Number(row.base_salary) || 30000,
  commissionRate: Number(row.commission_rate) || 15
});

// Transform Stylist to database row
export const mapStylistToDB = (stylist: Stylist) => ({
  id: stylist.id,
  shop_id: stylist.shopId,
  name: stylist.name,
  role: stylist.role,
  rating: stylist.rating,
  review_count: stylist.reviewCount,
  experience: stylist.experience,
  avatar: stylist.avatar,
  specialties: stylist.specialties,
  is_available: stylist.isAvailable,
  base_salary: stylist.baseSalary,
  commission_rate: stylist.commissionRate,
  updated_at: new Date().toISOString()
});

// Transform database row to ServiceItem
export const mapServiceFromDB = (row: any): ServiceItem => ({
  id: row.id,
  shopId: row.shop_id || 'shop-1',
  name: row.name,
  category: row.category || 'Hair',
  description: row.description || '',
  price: Number(row.price) || 0,
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  discountPercent: row.discount_percent ? Number(row.discount_percent) : undefined,
  durationMinutes: Number(row.duration_minutes) || 30,
  image: row.image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80',
  isPopular: Boolean(row.is_popular)
});

// Transform ServiceItem to database row
export const mapServiceToDB = (service: ServiceItem) => ({
  id: service.id,
  shop_id: service.shopId || 'shop-1',
  name: service.name,
  category: service.category,
  description: service.description,
  price: service.price,
  original_price: service.originalPrice,
  discount_percent: service.discountPercent,
  duration_minutes: service.durationMinutes,
  image: service.image,
  is_popular: service.isPopular,
  updated_at: new Date().toISOString()
});

// Transform database row to Booking
export const mapBookingFromDB = (row: any): Booking => ({
  id: row.id,
  customerId: row.customer_id || 'cust-1',
  customerName: row.customer_name,
  customerPhone: row.customer_phone || '',
  shopId: row.shop_id || 'shop-1',
  shopName: row.shop_name,
  shopAddress: row.shop_address || '',
  shopGoogleMapsUrl: row.shop_google_maps_url || undefined,
  services: Array.isArray(row.services) ? row.services : [],
  addOns: Array.isArray(row.add_ons) ? row.add_ons : [],
  stylist: row.stylist,
  date: row.date,
  formattedDate: row.formatted_date || row.date,
  timeSlot: row.time_slot,
  totalAmount: Number(row.total_amount) || 0,
  subtotal: Number(row.subtotal) || 0,
  discountAmount: Number(row.discount_amount) || 0,
  couponCode: row.coupon_code || undefined,
  paymentMethod: row.payment_method || 'pay_at_salon',
  paymentStatus: row.payment_status || 'pay_at_salon',
  status: row.status || 'pending',
  createdAt: row.created_at || new Date().toISOString(),
  shopNotes: row.shop_notes || undefined
});

// Transform Booking to database row
export const mapBookingToDB = (booking: Booking) => ({
  id: booking.id,
  customer_id: booking.customerId,
  customer_name: booking.customerName,
  customer_phone: booking.customerPhone,
  customer_email: (booking as any).customerEmail || undefined,
  shop_id: booking.shopId,
  shop_name: booking.shopName,
  shop_address: booking.shopAddress,
  shop_google_maps_url: booking.shopGoogleMapsUrl,
  services: booking.services,
  add_ons: booking.addOns,
  stylist: booking.stylist,
  date: booking.date,
  formatted_date: booking.formattedDate,
  time_slot: booking.timeSlot,
  total_amount: booking.totalAmount,
  subtotal: booking.subtotal,
  discount_amount: booking.discountAmount,
  coupon_code: booking.couponCode,
  payment_method: booking.paymentMethod,
  payment_status: booking.paymentStatus,
  status: booking.status,
  shop_notes: booking.shopNotes,
  updated_at: new Date().toISOString()
});

// Transform database row to Offer
export const mapOfferFromDB = (row: any): Offer => ({
  id: row.id,
  code: row.code,
  title: row.title,
  subtitle: row.subtitle || '',
  discountPercent: Number(row.discount_percent) || 0,
  discountAmount: row.discount_amount ? Number(row.discount_amount) : undefined,
  minSpend: Number(row.min_spend) || 0,
  validTill: row.valid_till || '31 Dec 2026',
  category: row.category || 'General',
  image: row.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&auto=format&fit=crop&q=80'
});

// Transform Offer to database row
export const mapOfferToDB = (offer: Offer, shopId?: string) => ({
  id: offer.id,
  shop_id: (offer as any).shopId || shopId || 'shop-1',
  code: offer.code,
  title: offer.title,
  subtitle: offer.subtitle,
  discount_percent: offer.discountPercent,
  discount_amount: offer.discountAmount,
  min_spend: offer.minSpend,
  valid_till: offer.validTill,
  category: offer.category,
  image: offer.image
});

// Transform database row to InventoryItem
export const mapInventoryFromDB = (row: any): InventoryItem => ({
  id: row.id,
  shopId: row.shop_id || 'shop-1',
  name: row.name,
  category: row.category || 'Hair Care',
  brand: row.brand || '',
  stockQty: Number(row.stock_qty) || 0,
  minThreshold: Number(row.min_threshold) || 5,
  unit: row.unit || 'Bottles',
  unitCostPrice: Number(row.unit_cost_price) || 0,
  sellingPrice: row.selling_price ? Number(row.selling_price) : undefined,
  supplier: row.supplier || '',
  lastRestocked: row.last_restocked || 'Recent'
});

// Transform InventoryItem to database row
export const mapInventoryToDB = (item: InventoryItem, shopId?: string) => ({
  id: item.id,
  shop_id: item.shopId || shopId || 'shop-1',
  name: item.name,
  category: item.category,
  brand: item.brand,
  stock_qty: item.stockQty,
  min_threshold: item.minThreshold,
  unit: item.unit,
  unit_cost_price: item.unitCostPrice,
  selling_price: item.sellingPrice,
  supplier: item.supplier,
  last_restocked: item.lastRestocked,
  updated_at: new Date().toISOString()
});

// Transform database row to PayrollRecord
export const mapPayrollFromDB = (row: any): PayrollRecord => ({
  id: row.id,
  shopId: row.shop_id || 'shop-1',
  stylistId: row.stylist_id || '',
  stylistName: row.stylist_name,
  role: row.role || 'Stylist',
  month: row.month,
  baseSalary: Number(row.base_salary) || 0,
  servicesRenderedCount: Number(row.services_rendered_count) || 0,
  serviceRevenueGenerated: Number(row.service_revenue_generated) || 0,
  commissionRate: Number(row.commission_rate) || 15,
  commissionAmount: Number(row.commission_amount) || 0,
  bonus: Number(row.bonus) || 0,
  deductions: Number(row.deductions) || 0,
  netPayout: Number(row.net_payout) || 0,
  status: row.status || 'Pending Approval',
  paidOn: row.paid_on || undefined
});

// Transform PayrollRecord to database row
export const mapPayrollToDB = (record: PayrollRecord, shopId?: string) => ({
  id: record.id,
  shop_id: record.shopId || shopId || 'shop-1',
  stylist_id: record.stylistId,
  stylist_name: record.stylistName,
  role: record.role,
  month: record.month,
  base_salary: record.baseSalary,
  services_rendered_count: record.servicesRenderedCount,
  service_revenue_generated: record.serviceRevenueGenerated,
  commission_rate: record.commissionRate,
  commission_amount: record.commissionAmount,
  bonus: record.bonus,
  deductions: record.deductions,
  net_payout: record.netPayout,
  status: record.status,
  paid_on: record.paidOn,
  updated_at: new Date().toISOString()
});

// Transform database row to WalletTransaction
export const mapTransactionFromDB = (row: any): WalletTransaction => ({
  id: row.id,
  type: row.type || 'credit',
  title: row.title || 'Wallet Update',
  amount: Number(row.amount) || 0,
  date: row.date || (row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'),
  status: row.status || 'Completed',
  bookingId: row.booking_id || undefined
});

// Transform WalletTransaction to database row
export const mapTransactionToDB = (tx: WalletTransaction, userId: string) => ({
  id: tx.id,
  user_id: userId,
  customer_id: userId,
  type: tx.type,
  title: tx.title,
  amount: tx.amount,
  date: tx.date,
  status: tx.status,
  booking_id: tx.bookingId || null,
  created_at: new Date().toISOString()
});

// Transform AppNotification to database row
export const mapNotificationFromDB = (row: any): AppNotification => ({
  id: row.id,
  title: row.title || 'Notification',
  message: row.message || '',
  time: row.time || (row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'),
  type: row.type || 'system',
  isRead: Boolean(row.is_read),
  bookingId: row.booking_id || undefined
});

// Transform AppNotification to database row
export const mapNotificationToDB = (notif: AppNotification, userId: string) => ({
  id: notif.id,
  user_id: userId,
  title: notif.title,
  message: notif.message,
  time: notif.time,
  type: notif.type,
  is_read: notif.isRead,
  booking_id: notif.bookingId || null,
  created_at: new Date().toISOString()
});

// API Helper Methods
export const SupabaseAPI = {
  // Fetch All Initial Public Marketplace Data (Shops, Services, Stylists, Offers)
  async fetchAll() {
    try {
      const [
        shopsRes,
        stylistsRes,
        servicesRes,
        offersRes
      ] = await Promise.allSettled([
        supabase.from('shops').select('*').order('created_at', { ascending: true }),
        supabase.from('stylists').select('*').order('created_at', { ascending: true }),
        supabase.from('services').select('*').order('created_at', { ascending: true }),
        supabase.from('offers').select('*').order('created_at', { ascending: true })
      ]);

      return {
        shops: shopsRes.status === 'fulfilled' && shopsRes.value.data?.length ? shopsRes.value.data.map(mapShopFromDB) : null,
        stylists: stylistsRes.status === 'fulfilled' && stylistsRes.value.data?.length ? stylistsRes.value.data.map(mapStylistFromDB) : null,
        services: servicesRes.status === 'fulfilled' && servicesRes.value.data?.length ? servicesRes.value.data.map(mapServiceFromDB) : null,
        offers: offersRes.status === 'fulfilled' && offersRes.value.data?.length ? offersRes.value.data.map(mapOfferFromDB) : null
      };
    } catch (err) {
      console.warn('Supabase fetchAll warning:', err);
      return null;
    }
  },

  // Fetch Real Customer Data (Profile, Bookings, Wallet, Notifications)
  async fetchCustomerData(userId: string) {
    try {
      if (!userId) return null;

      const [profileRes, bookingsRes, txRes, notifRes] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('bookings').select('*').eq('customer_id', userId).order('created_at', { ascending: false }),
        supabase.from('wallet_transactions').select('*').eq('customer_id', userId).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      const profileData = profileRes.status === 'fulfilled' ? profileRes.value.data : null;

      return {
        profile: profileData,
        bookings: bookingsRes.status === 'fulfilled' && bookingsRes.value.data ? bookingsRes.value.data.map(mapBookingFromDB) : [],
        transactions: txRes.status === 'fulfilled' && txRes.value.data ? txRes.value.data.map(mapTransactionFromDB) : [],
        notifications: notifRes.status === 'fulfilled' && notifRes.value.data ? notifRes.value.data.map(mapNotificationFromDB) : []
      };
    } catch (err) {
      console.warn('fetchCustomerData error:', err);
      return null;
    }
  },

  // Fetch Real Business / Salon Data
  async fetchBusinessShopData(ownerId: string) {
    try {
      if (!ownerId) return null;

      const { data: shopsData, error: shopErr } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (shopErr || !shopsData || shopsData.length === 0) return null;

      const shop = mapShopFromDB(shopsData[0]);
      const shopId = shop.id;

      const [servicesRes, stylistsRes, bookingsRes, inventoryRes, payrollsRes] = await Promise.allSettled([
        supabase.from('services').select('*').eq('shop_id', shopId).order('created_at', { ascending: true }),
        supabase.from('stylists').select('*').eq('shop_id', shopId).order('created_at', { ascending: true }),
        supabase.from('bookings').select('*').eq('shop_id', shopId).order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').eq('shop_id', shopId).order('created_at', { ascending: true }),
        supabase.from('payrolls').select('*').eq('shop_id', shopId).order('created_at', { ascending: true })
      ]);

      return {
        shop,
        services: servicesRes.status === 'fulfilled' && servicesRes.value.data ? servicesRes.value.data.map(mapServiceFromDB) : [],
        stylists: stylistsRes.status === 'fulfilled' && stylistsRes.value.data ? stylistsRes.value.data.map(mapStylistFromDB) : [],
        bookings: bookingsRes.status === 'fulfilled' && bookingsRes.value.data ? bookingsRes.value.data.map(mapBookingFromDB) : [],
        inventory: inventoryRes.status === 'fulfilled' && inventoryRes.value.data ? inventoryRes.value.data.map(mapInventoryFromDB) : [],
        payrolls: payrollsRes.status === 'fulfilled' && payrollsRes.value.data ? payrollsRes.value.data.map(mapPayrollFromDB) : []
      };
    } catch (err) {
      console.warn('fetchBusinessShopData error:', err);
      return null;
    }
  },

  // Wallet Transaction & Recharge API
  async rechargeWallet(amount: number, title: string = 'Wallet Recharge'): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('recharge_wallet', {
        p_amount: amount,
        p_title: title
      });
      if (error) return { success: false, error: error.message };
      return { success: true, newBalance: data?.new_balance };
    } catch (err: any) {
      return { success: false, error: err.message || 'Wallet recharge failed' };
    }
  },

  async addWalletTransaction(tx: WalletTransaction, userId: string) {
    try {
      const { error } = await supabase.from('wallet_transactions').insert(mapTransactionToDB(tx, userId));
      if (error) console.warn('addWalletTransaction error:', error.message);
    } catch (err) {
      console.warn('addWalletTransaction failed:', err);
    }
  },

  // Notification API
  async addNotification(notif: AppNotification, userId: string) {
    try {
      const { error } = await supabase.from('notifications').insert(mapNotificationToDB(notif, userId));
      if (error) console.warn('addNotification error:', error.message);
    } catch (err) {
      console.warn('addNotification failed:', err);
    }
  },

  async markNotificationRead(notifId: string) {
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
      if (error) console.warn('markNotificationRead error:', error.message);
    } catch (err) {
      console.warn('markNotificationRead failed:', err);
    }
  },

  // Bookings API
  async createBooking(booking: Booking): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapBookingToDB(booking);
      const { error } = await supabase.from('bookings').insert(dbRow);
      if (error) {
        console.warn('Supabase createBooking error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase createBooking failed:', err);
      return { success: false, error: err.message || 'Booking creation failed' };
    }
  },

  async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (notes) updateData.shop_notes = notes;
      const { error } = await supabase.from('bookings').update(updateData).eq('id', bookingId);
      if (error) console.warn('Supabase updateBookingStatus error:', error.message);
    } catch (err) {
      console.warn('Supabase updateBookingStatus failed:', err);
    }
  },

  async rescheduleBooking(bookingId: string, date: string, formattedDate: string, timeSlot: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          date,
          formatted_date: formattedDate,
          time_slot: timeSlot,
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
      if (error) console.warn('Supabase rescheduleBooking error:', error.message);
    } catch (err) {
      console.warn('Supabase rescheduleBooking failed:', err);
    }
  },

  // Services API
  async addService(service: ServiceItem) {
    try {
      const { error } = await supabase.from('services').insert(mapServiceToDB(service));
      if (error) console.warn('Supabase addService error:', error.message);
    } catch (err) {
      console.warn('Supabase addService failed:', err);
    }
  },

  async updateService(service: ServiceItem) {
    try {
      const { error } = await supabase.from('services').update(mapServiceToDB(service)).eq('id', service.id);
      if (error) console.warn('Supabase updateService error:', error.message);
    } catch (err) {
      console.warn('Supabase updateService failed:', err);
    }
  },

  async deleteService(serviceId: string) {
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) console.warn('Supabase deleteService error:', error.message);
    } catch (err) {
      console.warn('Supabase deleteService failed:', err);
    }
  },

  // Stylists API
  async addStylist(stylist: Stylist) {
    try {
      const { error } = await supabase.from('stylists').insert(mapStylistToDB(stylist));
      if (error) console.warn('Supabase addStylist error:', error.message);
    } catch (err) {
      console.warn('Supabase addStylist failed:', err);
    }
  },

  async updateStylist(stylist: Stylist) {
    try {
      const { error } = await supabase.from('stylists').update(mapStylistToDB(stylist)).eq('id', stylist.id);
      if (error) console.warn('Supabase updateStylist error:', error.message);
    } catch (err) {
      console.warn('Supabase updateStylist failed:', err);
    }
  },

  async deleteStylist(stylistId: string) {
    try {
      const { error } = await supabase.from('stylists').delete().eq('id', stylistId);
      if (error) console.warn('Supabase deleteStylist error:', error.message);
    } catch (err) {
      console.warn('Supabase deleteStylist failed:', err);
    }
  },

  // Inventory API
  async addInventoryItem(item: InventoryItem) {
    try {
      const { error } = await supabase.from('inventory').insert(mapInventoryToDB(item));
      if (error) console.warn('Supabase addInventory error:', error.message);
    } catch (err) {
      console.warn('Supabase addInventory failed:', err);
    }
  },

  async updateStock(itemId: string, qty: number, restockedDate: string) {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ stock_qty: qty, last_restocked: restockedDate, updated_at: new Date().toISOString() })
        .eq('id', itemId);
      if (error) console.warn('Supabase updateStock error:', error.message);
    } catch (err) {
      console.warn('Supabase updateStock failed:', err);
    }
  },

  async deleteInventoryItem(itemId: string) {
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', itemId);
      if (error) console.warn('Supabase deleteInventoryItem error:', error.message);
    } catch (err) {
      console.warn('Supabase deleteInventoryItem failed:', err);
    }
  },

  // Offers API
  async addOffer(offer: Offer, shopId?: string) {
    try {
      const { error } = await supabase.from('offers').insert(mapOfferToDB(offer, shopId));
      if (error) console.warn('Supabase addOffer error:', error.message);
    } catch (err) {
      console.warn('Supabase addOffer failed:', err);
    }
  },

  async deleteOffer(offerId: string) {
    try {
      const { error } = await supabase.from('offers').delete().eq('id', offerId);
      if (error) console.warn('Supabase deleteOffer error:', error.message);
    } catch (err) {
      console.warn('Supabase deleteOffer failed:', err);
    }
  },

  // Payroll API
  async updatePayrollStatus(payrollId: string, status: string, paidOn?: string) {
    try {
      const { error } = await supabase
        .from('payrolls')
        .update({ status, paid_on: paidOn, updated_at: new Date().toISOString() })
        .eq('id', payrollId);
      if (error) console.warn('Supabase updatePayrollStatus error:', error.message);
    } catch (err) {
      console.warn('Supabase updatePayrollStatus failed:', err);
    }
  },

  // Shop / Profile API
  async upsertShop(shop: BusinessShop) {
    try {
      const { error } = await supabase.from('shops').upsert(mapShopToDB(shop));
      if (error) console.warn('Supabase upsertShop error:', error.message);
    } catch (err) {
      console.warn('Supabase upsertShop failed:', err);
    }
  },

  async upsertProfile(profile: { id?: string; name?: string; email?: string; phone?: string; avatar_url?: string; role?: 'customer' | 'business' }) {
    try {
      let existing: any = null;
      const cleanEmail = profile.email ? profile.email.trim().toLowerCase() : undefined;
      
      if (profile.id && !profile.id.startsWith('cust-') && !profile.id.startsWith('shop-')) {
        const { data } = await supabase.from('profiles').select('*').eq('id', profile.id).maybeSingle();
        existing = data;
      }
      if (!existing && cleanEmail) {
        const { data } = await supabase.from('profiles').select('*').eq('email', cleanEmail).maybeSingle();
        existing = data;
      }

      const targetId = existing?.id || (profile.id && !profile.id.startsWith('cust-') && !profile.id.startsWith('shop-') ? profile.id : undefined);

      const payload: any = {
        updated_at: new Date().toISOString()
      };
      if (targetId) payload.id = targetId;

      if (profile.name !== undefined && profile.name.trim() !== '') {
        payload.full_name = profile.name.trim();
      } else if (existing?.full_name) {
        payload.full_name = existing.full_name;
      }

      if (cleanEmail) {
        payload.email = cleanEmail;
      } else if (existing?.email) {
        payload.email = existing.email;
      }

      if (profile.phone !== undefined && profile.phone.trim() !== '') {
        payload.phone = profile.phone.trim();
      } else if (existing?.phone) {
        payload.phone = existing.phone;
      }

      if (profile.avatar_url !== undefined) {
        payload.avatar_url = profile.avatar_url;
      } else if (existing?.avatar_url) {
        payload.avatar_url = existing.avatar_url;
      }

      if (profile.role) {
        payload.role = profile.role;
      } else if (existing?.role) {
        payload.role = existing.role;
      }

      if (existing?.id) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', existing.id);
        if (error) console.warn('Supabase updateProfile error:', error.message);
      } else if (targetId) {
        const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
        if (error) console.warn('Supabase upsertProfile error:', error.message);
      }

      // Also update Supabase Auth user metadata so session stays completely synchronized
      try {
        const metadataUpdate: any = {};
        if (payload.full_name) metadataUpdate.full_name = payload.full_name;
        if (payload.phone) metadataUpdate.phone = payload.phone;
        if (payload.avatar_url) metadataUpdate.avatar_url = payload.avatar_url;
        if (Object.keys(metadataUpdate).length > 0) {
          await supabase.auth.updateUser({ data: metadataUpdate });
        }
      } catch (e) {
        // silent auth metadata update
      }
    } catch (err) {
      console.warn('Supabase upsertProfile failed:', err);
    }
  },

  // Permanent Media Upload & Subspace Linking Helpers with Safe Replacement
  async uploadAndSaveCustomerAvatar(userId: string, file: File | Blob | string, oldAvatarUrl?: string | null) {
    const res = await SupabaseStorage.uploadCustomerAvatar(userId, file, oldAvatarUrl);
    if (res.success && res.publicUrl) {
      await this.upsertProfile({
        id: userId,
        avatar_url: res.publicUrl,
        role: 'customer'
      });
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  },

  async deleteCustomerAvatar(userId: string, oldAvatarUrl?: string | null) {
    try {
      if (oldAvatarUrl) {
        await SupabaseStorage.deleteFileByUrl(oldAvatarUrl);
      }
      await this.upsertProfile({
        id: userId,
        avatar_url: '',
        role: 'customer'
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete avatar' };
    }
  },

  async uploadAndSaveShopAvatar(shopId: string, file: File | Blob | string, oldImageUrl?: string | null) {
    const res = await SupabaseStorage.uploadShopAvatar(shopId, file, oldImageUrl);
    if (res.success && res.publicUrl) {
      await supabase.from('shops').update({ image: res.publicUrl, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  },

  async deleteShopAvatar(shopId: string, oldImageUrl?: string | null, defaultImage: string = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80') {
    try {
      if (oldImageUrl) {
        await SupabaseStorage.deleteFileByUrl(oldImageUrl);
      }
      await supabase.from('shops').update({ image: defaultImage, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete shop logo' };
    }
  },

  async uploadAndSaveShopBanner(shopId: string, file: File | Blob | string, oldBannerUrl?: string | null) {
    const res = await SupabaseStorage.uploadShopBanner(shopId, file, oldBannerUrl);
    if (res.success && res.publicUrl) {
      await supabase.from('shops').update({ banner_image: res.publicUrl, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  },

  async deleteShopBanner(shopId: string, oldBannerUrl?: string | null) {
    try {
      if (oldBannerUrl) {
        await SupabaseStorage.deleteFileByUrl(oldBannerUrl);
      }
      await supabase.from('shops').update({ banner_image: null, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete shop banner' };
    }
  },

  async uploadAndSaveShopVideo(shopId: string, file: File | Blob, mimeType: string = 'video/mp4', oldVideoUrl?: string | null) {
    const res = await SupabaseStorage.uploadShopBannerVideo(shopId, file, mimeType, oldVideoUrl);
    if (res.success && res.publicUrl) {
      await supabase.from('shops').update({ banner_video_url: res.publicUrl, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  },

  async deleteShopVideo(shopId: string, oldVideoUrl?: string | null) {
    try {
      if (oldVideoUrl) {
        await SupabaseStorage.deleteFileByUrl(oldVideoUrl);
      }
      await supabase.from('shops').update({ banner_video_url: null, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete shop video' };
    }
  },

  async deleteShopGalleryImage(shopId: string, targetImageUrl: string, updatedGallery: string[]) {
    try {
      await SupabaseStorage.deleteFileByUrl(targetImageUrl);
      await supabase.from('shops').update({ gallery_images: updatedGallery, updated_at: new Date().toISOString() }).eq('id', shopId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete gallery image' };
    }
  },

  async uploadAndSaveServiceImage(shopId: string, serviceId: string, file: File | Blob | string, oldImageUrl?: string | null) {
    const res = await SupabaseStorage.uploadServiceImage(shopId, serviceId, file, oldImageUrl);
    if (res.success && res.publicUrl) {
      await supabase.from('services').update({ image: res.publicUrl, updated_at: new Date().toISOString() }).eq('id', serviceId);
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  },

  async uploadAndSaveStylistAvatar(shopId: string, stylistId: string, file: File | Blob | string, oldAvatarUrl?: string | null) {
    const res = await SupabaseStorage.uploadStylistAvatar(shopId, stylistId, file, oldAvatarUrl);
    if (res.success && res.publicUrl) {
      await supabase.from('stylists').update({ avatar: res.publicUrl, updated_at: new Date().toISOString() }).eq('id', stylistId);
      return { success: true, publicUrl: res.publicUrl };
    }
    return { success: false, error: res.error };
  }
};
