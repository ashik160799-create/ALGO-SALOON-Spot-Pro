import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Search, 
  Bell, 
  Sparkles, 
  Star, 
  ChevronRight, 
  Clock, 
  Scissors, 
  ShieldCheck,
  Tag, 
  Compass, 
  SlidersHorizontal,
  Image as ImageIcon,
  Navigation,
  ExternalLink,
  Globe,
  Store,
  Play,
  Video,
  ChevronLeft,
  Eye,
  Camera,
  CheckCircle2,
  X,
  Heart,
  LayoutGrid,
  User
} from 'lucide-react';
import { BusinessShop } from '../../types';
import { CustomerLocationModal } from '../common/CustomerLocationModal';
import { generateGoogleMapsDirectionsUrl } from '../../utils/geoUtils';

export const HomeScreen: React.FC = () => {
  const [activeShowcaseShop, setActiveShowcaseShop] = useState<BusinessShop | null>(null);
  const [showcaseTab, setShowcaseTab] = useState<'video' | 'photos'>('photos');
  const [activePhotoLightboxIdx, setActivePhotoLightboxIdx] = useState<number | null>(null);
  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>([]);

  const toggleFavorite = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteShopIds(prev => 
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };

  const { 
    customerLocation,
    userLocation, 
    setUserLocation, 
    shops, 
    services, 
    offers,
    notifications, 
    setCustomerScreen, 
    setSelectedShop,
    addToCart,
    applyOfferCode,
    currency,
    formatPrice,
    detectUserLocationAndCurrency,
    calculateDistanceToShop,
    setMode,
    setBusinessScreen,
    setAuthInitialRole,
    setAuthInitialTab,
    isLocationModalOpen,
    setIsLocationModalOpen,
    theme,
    customer
  } = useApp();

  const isWhite = theme === 'white';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceTier, setSelectedPriceTier] = useState<'all' | 'budget' | 'premium' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'low_price' | 'high_price' | 'rating'>('nearest');

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const categories = ['All', 'Hair', 'Beard', 'Spa', 'Skin', 'Packages'];

  const locations = [
    'Anna Nagar, Chennai',
    'T. Nagar, Chennai',
    'Nungambakkam, Chennai',
    'Downtown Dubai, UAE',
    'Manhattan, New York, USA',
    'Central London, UK',
    'Orchard Road, Singapore',
    'Riyadh, Saudi Arabia',
    'Toronto, Canada',
    'Sydney, Australia',
    'Doha, Qatar',
    'Tokyo, Japan'
  ];

  // Dynamic filter & nearest / price tier sorting with strict geographic proximity
  const filteredAndSortedShops = shops
    .map(shop => ({
      ...shop,
      calculatedDistanceKm: calculateDistanceToShop(shop)
    }))
    .filter(shop => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        return (
          shop.name.toLowerCase().includes(q) ||
          shop.address.toLowerCase().includes(q) ||
          shop.city.toLowerCase().includes(q) ||
          (shop.country && shop.country.toLowerCase().includes(q)) ||
          shop.businessType.some(bt => bt.toLowerCase().includes(q))
        );
      }

      // When browsing nearby without keyword search:
      // Show salons in customer's active country/region or within reachable radius (< 150 km)
      const customerCountry = customerLocation?.countryCode;
      const isCountryMatch = !customerCountry || !shop.countryCode || shop.countryCode === customerCountry;
      const isDistanceReasonable = shop.calculatedDistanceKm <= 150;

      const matchesTier = 
        selectedPriceTier === 'all' || 
        shop.priceTier === selectedPriceTier;
      
      return (isCountryMatch || isDistanceReasonable) && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') {
        return a.calculatedDistanceKm - b.calculatedDistanceKm;
      }
      if (sortBy === 'low_price') {
        const priceA = a.avgPrice || (a.priceTier === 'budget' ? 200 : a.priceTier === 'premium' ? 650 : 1800);
        const priceB = b.avgPrice || (b.priceTier === 'budget' ? 200 : b.priceTier === 'premium' ? 650 : 1800);
        return priceA - priceB;
      }
      if (sortBy === 'high_price') {
        const priceA = a.avgPrice || (a.priceTier === 'budget' ? 200 : a.priceTier === 'premium' ? 650 : 1800);
        const priceB = b.avgPrice || (b.priceTier === 'budget' ? 200 : b.priceTier === 'premium' ? 650 : 1800);
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <div className={`min-h-full pb-20 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Location Bar & Notifications */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 pt-3 pb-2.5 transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100/80 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          {isWhite ? (
            <div className="flex items-center gap-2">
              <div>
                <span className="font-heading text-xl font-black tracking-tight bg-gradient-to-r from-purple-800 via-purple-600 to-pink-600 bg-clip-text text-transparent block leading-tight">
                  ALGO
                </span>
                <span className="text-[10px] font-semibold text-gray-500 tracking-tight block -mt-0.5">
                  Salon & Beauty
                </span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-300 group-hover:bg-gold-400/25 transition-all shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">Your Location</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors truncate max-w-[180px]">
                    {customerLocation?.address || userLocation}
                  </span>
                  <span className="text-gold-400 text-[10px]">▼</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {!isWhite && (
              /* Country & Currency Badge (Dark mode) */
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#14141E] border border-gold-400/20 text-xs font-bold text-gold-300 hover:border-gold-400/50 hover:bg-gold-400/10 transition-all shadow-sm"
                title="Change Your Location / Country"
              >
                <span>{customerLocation?.currencySymbol || currency.symbol}</span>
                <span className="text-[10px] text-gray-400 font-mono">({customerLocation?.countryCode || currency.countryCode || 'AE'})</span>
              </button>
            )}

            <button
              onClick={() => setCustomerScreen('notifications')}
              className={`relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                isWhite
                  ? 'bg-[#FAF5FF] border border-purple-100 text-purple-700 hover:bg-purple-100'
                  : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className={`absolute -top-1 -right-1 min-w-[16px] h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-sm ${
                isWhite ? 'bg-pink-500' : 'bg-gold-400 text-black'
              }`}>
                {unreadNotifs > 0 ? unreadNotifs : 3}
              </span>
            </button>

            {isWhite && (
              <div 
                onClick={() => setCustomerScreen('profile')}
                className="w-9 h-9 rounded-2xl overflow-hidden border border-purple-200 bg-purple-50 cursor-pointer flex items-center justify-center transition-all shadow-sm shrink-0"
              >
                {customer.avatar ? (
                  <img src={customer.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3.5 space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className={`absolute left-3.5 w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400/70'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search salons, services..."
            className={`w-full rounded-2xl pl-10 pr-10 py-3 text-xs outline-none transition-all ${
              isWhite
                ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
                : 'bg-[#12121A] border border-white/10 text-white placeholder-gray-500 focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 shadow-inner'
            }`}
          />
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className={`absolute right-3.5 transition-transform active:scale-95 ${
              isWhite ? 'text-purple-600 hover:text-purple-700' : 'text-gold-400 hover:text-gold-300'
            }`}
            title="Filter by City / Location"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Location Selector Bar (as shown in reference screenshot) */}
        {isWhite && (
          <div className="flex items-center justify-between pt-0.5">
            <div 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="text-xs font-bold text-gray-900 group-hover:text-purple-700 truncate max-w-[200px]">
                {customerLocation?.city || 'Dubai'}, {customerLocation?.countryCode || 'UAE'}
              </span>
              <span className="text-[10px] text-purple-600">▼</span>
            </div>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              Change
            </button>
          </div>
        )}

        {/* 6 Category Circular Icons (Matching Screenshot) */}
        {isWhite ? (
          <div className="grid grid-cols-6 gap-2 pt-1">
            {[
              { id: 'Hair', label: 'Haircut', icon: Scissors },
              { id: 'Skin', label: 'Beauty', icon: Sparkles },
              { id: 'Spa', label: 'Spa', icon: Tag },
              { id: 'Nails', label: 'Nails', icon: CheckCircle2 },
              { id: 'Beard', label: 'Barber', icon: Scissors },
              { id: 'All', label: 'More', icon: LayoutGrid },
            ].map(cat => (
              <button
                key={cat.label}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCustomerScreen('services');
                }}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-purple-700 shadow-sm group-hover:bg-purple-100 group-hover:scale-105 transition-all">
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-gray-800 tracking-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Category Filter Chips for Dark Mode */
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-widest">
                Service Categories
              </h3>
              <span className="text-[10px] text-gold-300 font-bold">{categories.length - 1} Specialties</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'gold-gradient-btn'
                      : 'bg-[#14141E] text-gray-400 border border-white/5 hover:text-white hover:border-gold-400/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Promo Banner ("Look Good. Feel Amazing.") */}
        <div className={`relative overflow-hidden rounded-3xl p-5 shadow-lg transition-all ${
          isWhite
            ? 'bg-gradient-to-r from-[#180F2A] via-[#2A134A] to-[#120822] text-white shadow-[0_10px_30px_rgba(126,34,206,0.18)]'
            : 'bg-gradient-to-br from-[#241C0E] via-[#161622] to-[#0A0A10] border border-gold-400/35 text-white shadow-[0_8px_30px_rgba(212,175,55,0.12)]'
        }`}>
          <div className="relative z-10 max-w-[210px] space-y-1">
            <h3 className="font-heading text-lg font-black text-white leading-tight">
              Look Good.<br />
              <span className={isWhite ? 'text-pink-400' : 'gold-text-gradient'}>Feel Amazing.</span>
            </h3>
            <p className={`text-[11px] mt-1 ${isWhite ? 'text-purple-200' : 'text-gray-300'}`}>
              Book best salons & get exciting offers!
            </p>
            <button
              onClick={() => setCustomerScreen('services')}
              className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all ${
                isWhite
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'gold-gradient-btn'
              }`}
            >
              <span>Explore Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-44 overflow-hidden rounded-r-3xl pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              alt="Promo Ambient"
              className="w-full h-full object-cover opacity-85"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${isWhite ? 'from-[#180F2A] via-transparent to-transparent' : 'from-[#241C0E] via-transparent to-transparent'}`} />
          </div>
        </div>

        {/* Featured Salons (Horizontal Carousel) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className={`font-heading text-sm font-bold tracking-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Featured Salons
            </h3>
            <button
              onClick={() => setCustomerScreen('services')}
              className={`text-xs font-bold flex items-center gap-0.5 ${isWhite ? 'text-purple-700 hover:text-purple-800' : 'text-gold-400 hover:text-gold-300'}`}
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {filteredAndSortedShops.map(shop => {
              const isFav = favoriteShopIds.includes(shop.id);
              return (
                <div
                  key={shop.id}
                  onClick={() => {
                    setSelectedShop(shop);
                    setCustomerScreen('services');
                  }}
                  className={`min-w-[210px] max-w-[210px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group shrink-0 ${
                    isWhite
                      ? 'bg-white border border-[#EDE9FE] shadow-sm hover:shadow-md'
                      : 'glass-card-obsidian hover:border-gold-400/40 shadow-md'
                  }`}
                >
                  <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-700/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-wider uppercase shadow">
                      ★ TOP RATED
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(shop.id, e)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-pink-400 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                    </button>
                  </div>

                  <div className="p-2.5 space-y-1.5">
                    <h4 className={`font-heading text-xs font-bold truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                      {shop.name}
                    </h4>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                        <span className={isWhite ? 'text-gray-500 font-normal' : 'text-gray-400 font-normal'}>({shop.reviewCount || 320})</span>
                      </span>
                      <span className={isWhite ? 'text-gray-500' : 'text-gray-400'}>
                        📍 {shop.calculatedDistanceKm} km
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-gray-100">
                      <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-600 font-bold text-[9px]">
                        20% OFF
                      </span>
                      <span className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                        From {formatPrice(shop.avgPrice || 150, shop)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Services Section (Matching Screenshot) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className={`font-heading text-sm font-bold tracking-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Popular Services
            </h3>
            <button
              onClick={() => setCustomerScreen('services')}
              className={`text-xs font-bold flex items-center gap-0.5 ${isWhite ? 'text-purple-700 hover:text-purple-800' : 'text-gold-400 hover:text-gold-300'}`}
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {(services.length > 0 ? services : [
              { id: 's1', name: 'Haircut', price: 60, duration: '30 min', category: 'Hair' },
              { id: 's2', name: 'Hair Color', price: 150, duration: '60 min', category: 'Hair' },
              { id: 's3', name: 'Facial', price: 120, duration: '45 min', category: 'Skin' },
              { id: 's4', name: 'Manicure', price: 80, duration: '30 min', category: 'Nails' },
            ]).slice(0, 6).map((srv: any) => (
              <div
                key={srv.id}
                onClick={() => {
                  addToCart(srv);
                  setCustomerScreen('services');
                }}
                className={`min-w-[170px] rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shrink-0 ${
                  isWhite
                    ? 'bg-white border border-[#EDE9FE] shadow-sm hover:shadow-md'
                    : 'glass-card-obsidian hover:border-gold-400/30'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  isWhite ? 'bg-[#FAF5FF] text-purple-700 border border-purple-100' : 'bg-[#14141E] text-gold-300 border border-white/10'
                }`}>
                  <Scissors className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h5 className={`text-xs font-bold truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                    {srv.name}
                  </h5>
                  <div className={`text-[11px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                    From {formatPrice(srv.price)}
                  </div>
                  <div className={`text-[10px] ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>
                    ⏱ {srv.duration || '30 min'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Salons Section (Matching Screenshot) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className={`font-heading text-sm font-bold tracking-tight ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Nearby Salons
            </h3>
            <button
              onClick={() => setCustomerScreen('services')}
              className={`text-xs font-bold flex items-center gap-0.5 ${isWhite ? 'text-purple-700 hover:text-purple-800' : 'text-gold-400 hover:text-gold-300'}`}
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredAndSortedShops.length === 0 ? (
              <div className={`p-6 rounded-2xl text-center space-y-2 border ${
                isWhite ? 'bg-white border-purple-100 text-gray-800' : 'glass-card-obsidian border-white/10 text-white'
              }`}>
                <MapPin className={`w-8 h-8 mx-auto ${isWhite ? 'text-purple-400' : 'text-gold-400/50'}`} />
                <p className="text-xs font-bold">No salons match your search</p>
                <p className={`text-[11px] ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Try changing your location, search keywords, or price tier filter.</p>
              </div>
            ) : (
              filteredAndSortedShops.map(shop => {
                const mapsLink = shop.googleMapsUrl || generateGoogleMapsDirectionsUrl(shop.latitude || 25.2048, shop.longitude || 55.2708, shop.address);
                return (
                  <div
                    key={shop.id}
                    className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                      isWhite
                        ? 'bg-white border border-[#EDE9FE] shadow-sm hover:shadow-md'
                        : 'glass-card-obsidian hover:border-gold-400/35 shadow-md'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className={`font-heading text-xs font-bold truncate ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                          {shop.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className="flex items-center gap-0.5 font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{shop.rating}</span>
                            <span className={isWhite ? 'text-gray-500 font-normal' : 'text-gray-400 font-normal'}>({shop.reviewCount || 150})</span>
                          </span>
                          <span>•</span>
                          <span className={isWhite ? 'text-gray-500' : 'text-gray-400'}>
                            📍 {shop.calculatedDistanceKm} km
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className="text-emerald-600 font-semibold">Open now</span>
                          <span>•</span>
                          <span className={isWhite ? 'text-gray-500' : 'text-gray-400'}>
                            {shop.openingTime} - {shop.closingTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100">
                        <a
                          href={mapsLink}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-[10px] font-bold flex items-center gap-1 ${
                            isWhite ? 'text-purple-700 hover:text-purple-800' : 'text-gold-300 hover:text-gold-200'
                          }`}
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Map</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedShop(shop);
                            setCustomerScreen('services');
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                            isWhite
                              ? 'bg-[#7E22CE] hover:bg-[#6B21A8] text-white'
                              : 'gold-gradient-btn'
                          }`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Salon Owner Partner Registration CTA Banner */}
        <div className={`rounded-2xl border p-4 flex items-center justify-between shadow-sm mt-4 ${
          isWhite
            ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-white border-purple-200 text-gray-900'
            : 'bg-gradient-to-r from-[#1C160B] via-[#14141E] to-[#12121A] border-gold-400/30 text-white'
        }`}>
          <div className="space-y-1 max-w-[210px]">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isWhite ? 'text-purple-700 bg-purple-100 border-purple-200' : 'text-gold-400 bg-gold-400/10 border-gold-400/20'
            }`}>
              For Salon Owners
            </span>
            <h4 className={`font-heading text-sm font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              List Your Salon on ALGO
            </h4>
            <p className={`text-[11px] ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
              Reach thousands of clients, manage bookings, staff & payroll.
            </p>
          </div>

          <button
            onClick={() => {
              setAuthInitialRole('business');
              setAuthInitialTab('signup');
              setMode('business');
              setBusinessScreen('auth');
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all ${
              isWhite
                ? 'bg-[#7E22CE] hover:bg-[#6B21A8] text-white'
                : 'gold-gradient-btn'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Register Salon</span>
          </button>
        </div>
      </div>

      {/* Luxury Salon Showcase & Ambience Modal (1 Video + 5 Photos) */}
      {activeShowcaseShop && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-[#14141F] border border-gold-400/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-3 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 pb-2 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gold-400/40 shrink-0 bg-black">
                  <img
                    src={activeShowcaseShop.image}
                    alt={activeShowcaseShop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-white truncate">
                      {activeShowcaseShop.name}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    📍 {activeShowcaseShop.address || activeShowcaseShop.city} &bull; ⭐ {activeShowcaseShop.rating}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveShowcaseShop(null);
                  setActivePhotoLightboxIdx(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Navigation (1 Video • 5 Photos) */}
            <div className="px-4 shrink-0">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0D0D14] border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowcaseTab('photos');
                    setActivePhotoLightboxIdx(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    showcaseTab === 'photos'
                      ? 'bg-gold-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Curated Photos ({activeShowcaseShop.galleryImages?.length || 0}/5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowcaseTab('video');
                    setActivePhotoLightboxIdx(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    showcaseTab === 'video'
                      ? 'bg-gold-400 text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Ambience Reel ({activeShowcaseShop.bannerVideoUrl ? '1/1' : '0/1'})</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 pt-1 overflow-y-auto flex-1 space-y-3">
              {showcaseTab === 'video' ? (
                /* Video Tab */
                <div className="space-y-2">
                  {activeShowcaseShop.bannerVideoUrl ? (
                    <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gold-400/30 shadow-lg">
                      <video
                        src={activeShowcaseShop.bannerVideoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center text-gray-400 text-xs bg-[#101018] space-y-1">
                      <Video className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="font-bold text-gray-300">No Ambience Video Uploaded Yet</p>
                      <p className="text-[10px] text-gray-500">This salon has not published its 360° tour reel.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Photos Tab */
                <div className="space-y-3">
                  {/* Lightbox Zoom Preview if selected */}
                  {activePhotoLightboxIdx !== null && activeShowcaseShop.galleryImages?.[activePhotoLightboxIdx] ? (
                    <div className="space-y-2">
                      <div className="relative rounded-2xl overflow-hidden bg-black border border-gold-400/40 aspect-[4/3] flex items-center justify-center group shadow-xl">
                        <img
                          src={activeShowcaseShop.galleryImages[activePhotoLightboxIdx]}
                          alt="Showcase Full"
                          className="w-full h-full object-contain"
                        />

                        {/* Navigation Arrows */}
                        {activePhotoLightboxIdx > 0 && (
                          <button
                            onClick={() => setActivePhotoLightboxIdx(prev => Math.max(0, (prev || 0) - 1))}
                            className="absolute left-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {activePhotoLightboxIdx < (activeShowcaseShop.galleryImages.length - 1) && (
                          <button
                            onClick={() => setActivePhotoLightboxIdx(prev => Math.min((activeShowcaseShop.galleryImages?.length || 1) - 1, (prev || 0) + 1))}
                            className="absolute right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm text-[11px] text-white flex items-center justify-between border border-white/10">
                          <span className="font-bold text-gold-400">
                            Photo {activePhotoLightboxIdx + 1} of {activeShowcaseShop.galleryImages.length}
                          </span>
                          <button
                            onClick={() => setActivePhotoLightboxIdx(null)}
                            className="text-gray-300 hover:text-white text-[10px] underline"
                          >
                            Close Lightbox
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* 5-Slot Showcase Gallery Grid */}
                  {activeShowcaseShop.galleryImages && activeShowcaseShop.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { title: 'Interior & Ambience' },
                        { title: 'Styling Station' },
                        { title: 'Transformations' },
                        { title: 'Spa & Relaxation' },
                        { title: 'Nail & Signature' }
                      ].map((slot, idx) => {
                        const img = activeShowcaseShop.galleryImages?.[idx];
                        if (!img) return null;

                        return (
                          <div
                            key={idx}
                            onClick={() => setActivePhotoLightboxIdx(idx)}
                            className={`relative rounded-xl overflow-hidden aspect-square border cursor-pointer group transition-all ${
                              activePhotoLightboxIdx === idx ? 'border-gold-400 ring-2 ring-gold-400/50' : 'border-white/10 hover:border-gold-400/50'
                            }`}
                          >
                            <img
                              src={img}
                              alt={slot.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 opacity-90 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] font-bold text-gold-400">Slot {idx + 1}/5</span>
                              <span className="text-[10px] font-bold text-white truncate">{slot.title}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center text-gray-400 text-xs bg-[#101018] space-y-1">
                      <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="font-bold text-gray-300">No Showcase Photos Uploaded</p>
                      <p className="text-[10px] text-gray-500">This salon has not attached its 5 showcase photos yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 pt-2 border-t border-white/10 shrink-0 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedShop(activeShowcaseShop);
                  setActiveShowcaseShop(null);
                  setCustomerScreen('services');
                }}
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Book Appointment at {activeShowcaseShop.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Location Modal */}
      <CustomerLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
