import { supabase } from '../supabaseALGOClient';
import { CustomerProfile, BusinessShop } from '../types';
import { SupabaseAPI, mapShopFromDB } from './supabaseService';
import { SupabaseStorage } from './supabaseStorageService';

const DEFAULT_SHOP_IMAGE = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80';

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  requiresConfirmation?: boolean;
}

// ============================================================================
// Real Supabase Authentication & Profile Management Service
// Strictly Isolated for Customer and Business Portals
// ============================================================================

export const SupabaseAuth = {
  // 1. Customer Sign Up (Enforced Customer Role)
  async signUpCustomer(params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse<{ user: any; session: any; requiresConfirmation: boolean; profile: CustomerProfile }>> {
    try {
      const email = params.email.trim().toLowerCase();
      const name = params.name.trim();
      const phone = params.phone?.trim() || '';

      // Check if this email is already registered as a business account
      try {
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', email)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          const existing = existingProfiles[0];
          if (existing.role === 'business') {
            return {
              success: false,
              error: 'This email is already registered as a Salon Business account. Please use a distinct email for your Customer account.'
            };
          }
        }
      } catch (e) {
        // proceed with auth signup
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: params.password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            role: 'customer'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const session = data.session;
      const requiresConfirmation = !session;
      const userId = data.user?.id;

      if (!userId) {
        return { success: false, error: 'Failed to retrieve user ID during signup.' };
      }

      // Check existing profile
      let existingProfile: any = null;
      try {
        const { data: existingList } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1);
        existingProfile = existingList && existingList.length > 0 ? existingList[0] : null;
      } catch (e) {}

      const finalName = name || existingProfile?.full_name || email.split('@')[0];
      const finalPhone = phone || existingProfile?.phone || '';
      const finalAvatar = existingProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      const finalWallet = existingProfile?.wallet_balance !== undefined ? Number(existingProfile.wallet_balance) : 0;
      const finalAddresses = Array.isArray(existingProfile?.saved_addresses) ? existingProfile.saved_addresses : [];

      const profileData: any = {
        id: userId,
        role: 'customer',
        full_name: finalName,
        email: email,
        phone: finalPhone,
        avatar_url: finalAvatar,
        wallet_balance: finalWallet,
        saved_addresses: finalAddresses,
        auth_provider: 'email',
        is_verified: true,
        updated_at: new Date().toISOString()
      };

      try {
        await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
      } catch (e) {
        console.warn('Profile sync notice:', e);
      }

      const customerProfile: CustomerProfile = {
        id: userId,
        name: finalName,
        email: email,
        phone: finalPhone,
        avatar: finalAvatar,
        walletBalance: finalWallet,
        isVerified: Boolean(session),
        savedAddresses: finalAddresses
      };

      return {
        success: true,
        requiresConfirmation,
        data: {
          user: data.user,
          session: session,
          requiresConfirmation,
          profile: customerProfile
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
    }
  },

  // 2. Customer Sign In (Validates Customer Role)
  async signInCustomer(params: {
    email: string;
    password: string;
  }): Promise<AuthResponse<{ user: any; session: any; profile: CustomerProfile }>> {
    try {
      const email = params.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: params.password
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            error: 'Please check your email and confirm your account before logging in.'
          };
        }
        return { success: false, error: error.message };
      }

      if (!data.session) {
        return {
          success: false,
          error: 'Please check your email and confirm your account before logging in.'
        };
      }

      const userId = data.user?.id;
      if (!userId) {
        return { success: false, error: 'User session not found.' };
      }

      // Check account role from Supabase database
      let profileRow: any = null;
      try {
        const { data: profileList } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1);

        if (profileList && profileList.length > 0) {
          profileRow = profileList[0];
        }
      } catch (e) {
        console.warn('Profile fetch notice:', e);
      }

      // STRICT ROLE VALIDATION: If this account belongs to a business, reject from customer login
      const accountRole = profileRow?.role || data.user?.user_metadata?.role || 'customer';
      if (accountRole === 'business') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'This email is registered as a Salon Business account. Please sign in via the Business Partner Portal.'
        };
      }

      let dbName = profileRow?.full_name || data.user?.user_metadata?.full_name || email.split('@')[0];
      let dbPhone = profileRow?.phone || data.user?.user_metadata?.phone || '';
      let dbAvatar = profileRow?.avatar_url || data.user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      let dbWallet = profileRow?.wallet_balance !== undefined ? Number(profileRow.wallet_balance) : 0;
      let dbAddresses: string[] = Array.isArray(profileRow?.saved_addresses) ? profileRow.saved_addresses : [];

      if (!profileRow) {
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            role: 'customer',
            full_name: dbName,
            email: email,
            phone: dbPhone,
            avatar_url: dbAvatar,
            wallet_balance: dbWallet,
            is_verified: true
          });
        } catch (e) {}
      }

      const customerProfile: CustomerProfile = {
        id: userId,
        name: dbName,
        email: email,
        phone: dbPhone,
        avatar: dbAvatar,
        walletBalance: dbWallet,
        isVerified: true,
        savedAddresses: dbAddresses
      };

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          profile: customerProfile
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    }
  },

  // 3. Business Partner Sign Up (Enforced Business Role)
  async signUpBusiness(params: {
    shopName: string;
    ownerName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    googleMapsUrl?: string;
  }): Promise<AuthResponse<{ user: any; session: any; requiresConfirmation: boolean; shop: BusinessShop }>> {
    try {
      const email = params.email.trim().toLowerCase();
      const shopName = params.shopName.trim();
      const ownerName = params.ownerName.trim();
      const phone = params.phone.trim();
      const address = params.address.trim();
      const mapsUrl = params.googleMapsUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

      // Check if this email is already registered as a customer account
      try {
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', email)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          const existing = existingProfiles[0];
          if (existing.role === 'customer') {
            return {
              success: false,
              error: 'This email is already registered as a Customer account. Please use a distinct email address for your Salon Business portal.'
            };
          }
        }
      } catch (e) {}

      const { data, error } = await supabase.auth.signUp({
        email,
        password: params.password,
        options: {
          data: {
            full_name: ownerName,
            name: ownerName,
            shopName,
            ownerName,
            phone,
            role: 'business'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const session = data.session;
      const requiresConfirmation = !session;
      const userId = data.user?.id;

      if (!userId) {
        return { success: false, error: 'User ID not generated.' };
      }

      // Check if an existing shop already exists in database for this owner or email
      let existingShopRow: any = null;
      try {
        const { data: shops } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', userId)
          .limit(1);
        if (shops && shops.length > 0) existingShopRow = shops[0];
      } catch (e) {}

      const shopId = existingShopRow?.id || 'shop-' + Date.now();
      const existingShopMapped = existingShopRow ? mapShopFromDB(existingShopRow) : null;

      // Upsert profile in Supabase profiles
      try {
        await SupabaseAPI.upsertProfile({
          id: userId,
          name: ownerName,
          email: email,
          phone: phone,
          role: 'business'
        });
      } catch (e) {}

      // Preserve existing salon data or create new salon
      const newShop: BusinessShop = existingShopMapped ? {
        ...existingShopMapped,
        ownerId: userId,
        name: shopName || existingShopMapped.name,
        ownerName: ownerName || existingShopMapped.ownerName,
        phone: phone || existingShopMapped.phone,
        email: email || existingShopMapped.email,
        address: address || existingShopMapped.address,
        googleMapsUrl: mapsUrl || existingShopMapped.googleMapsUrl,
        isVerified: true
      } : {
        id: shopId,
        ownerId: userId,
        name: shopName,
        ownerName: ownerName,
        phone: phone,
        email: email,
        address: address,
        city: address.includes(',') ? address.split(',')[1].trim() : '',
        country: 'India',
        businessType: ['Salon', 'Barber'],
        staffCount: 5,
        openingTime: '09:00 AM',
        closingTime: '09:00 PM',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        rating: 5.0,
        reviewCount: 0,
        distance: '0.5 km',
        image: DEFAULT_SHOP_IMAGE,
        isOpen: true,
        tradeLicenseNo: '',
        taxVatNo: '',
        isVerified: true,
        googleMapsUrl: mapsUrl
      };

      try {
        await SupabaseAPI.upsertShop(newShop);
      } catch (e) {
        console.warn('Shop database sync notice:', e);
      }

      return {
        success: true,
        requiresConfirmation,
        data: {
          user: data.user,
          session: session,
          requiresConfirmation,
          shop: newShop
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Business signup failed.' };
    }
  },

  // 4. Business Partner Sign In (Validates Business Role)
  async signInBusiness(params: {
    email: string;
    password: string;
  }): Promise<AuthResponse<{ user: any; session: any; shop?: BusinessShop; requiresShopRegistration?: boolean }>> {
    try {
      const email = params.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: params.password
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            error: 'Please check your email and confirm your account before logging in.'
          };
        }
        return { success: false, error: error.message };
      }

      if (!data.session) {
        return {
          success: false,
          error: 'Please check your email and confirm your account before logging in.'
        };
      }

      const userId = data.user?.id;
      if (!userId) {
        return { success: false, error: 'User session not found.' };
      }

      // Check account role from Supabase database
      let profileRow: any = null;
      try {
        const { data: profileList } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1);

        if (profileList && profileList.length > 0) {
          profileRow = profileList[0];
        }
      } catch (e) {
        console.warn('Profile fetch notice:', e);
      }

      // STRICT ROLE VALIDATION: If this account is a customer account, reject from business login
      const accountRole = profileRow?.role || data.user?.user_metadata?.role;
      if (accountRole === 'customer') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'This email is registered as a Customer account. Please sign in via the Customer App, or create a dedicated Salon Business account.'
        };
      }

      // Fetch the partner's shop from Supabase shops table using owner_id
      let partnerShop: BusinessShop | undefined;
      try {
        const { data: shopRows } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (shopRows && shopRows.length > 0) {
          partnerShop = mapShopFromDB(shopRows[0]);
        }
      } catch (e) {
        console.warn('Shop fetch notice:', e);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          shop: partnerShop,
          requiresShopRegistration: !partnerShop
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Business login failed.' };
    }
  },

  // 5. Google OAuth Sign In via Supabase
  async signInWithGoogle(options?: { redirectTo?: string; role?: 'customer' | 'business' }): Promise<AuthResponse<{ url?: string; provider: string }>> {
    try {
      const redirectTo = options?.redirectTo || window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as any };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign in failed.' };
    }
  },

  // 6. Sign Out
  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout warning:', err);
    }
  },

  // 7. Permanently Delete User Account (Storage + Database + Auth Purge)
  async deleteAccount(): Promise<AuthResponse> {
    try {
      // 1. Determine user and purge owned storage folders
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const role = profile?.role || 'customer';

        if (role === 'business') {
          // Find and purge all storage folders for shops owned by this user
          const { data: userShops } = await supabase
            .from('shops')
            .select('id')
            .eq('owner_id', user.id);

          if (userShops && userShops.length > 0) {
            for (const shop of userShops) {
              await SupabaseStorage.deleteShopStorage(shop.id);
            }
          }
        } else {
          // Delete customer avatar and uploads folder
          await SupabaseStorage.deleteCustomerStorage(user.id);
        }
      }

      // 2. Execute atomic database records & auth.users row deletion
      const { data, error } = await supabase.rpc('delete_user_account');
      if (error) {
        return { success: false, error: error.message };
      }

      await this.signOut();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete account' };
    }
  },

  // 8. Get Current User Session
  async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }
};

export default SupabaseAuth;
