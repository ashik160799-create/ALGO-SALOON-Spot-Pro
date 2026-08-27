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
  X
} from 'lucide-react';
import { BusinessShop } from '../../types';
import { CurrencySwitcherModal } from '../common/CurrencySwitcherModal';

export const HomeScreen: React.FC = () => {
  const [activeShowcaseShop, setActiveShowcaseShop] = useState<BusinessShop | null>(null);
  const [showcaseTab, setShowcaseTab] = useState<'video' | 'photos'>('photos');
  const [activePhotoLightboxIdx, setActivePhotoLightboxIdx] = useState<number | null>(null);
  const { 
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
    setAuthInitialTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceTier, setSelectedPriceTier] = useState<'all' | 'budget' | 'premium' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'low_price' | 'high_price' | 'rating'>('nearest');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

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

  // Dynamic filter & nearest / price tier sorting
  const filteredAndSortedShops = shops
    .filter(shop => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        shop.name.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q) ||
        shop.city.toLowerCase().includes(q) ||
        (shop.country && shop.country.toLowerCase().includes(q)) ||
        shop.businessType.some(bt => bt.toLowerCase().includes(q));
      
      const matchesTier = 
        selectedPriceTier === 'all' || 
        shop.priceTier === selectedPriceTier;
      
      return matchesSearch && matchesTier;
    })
    .map(shop => ({
      ...shop,
      calculatedDistanceKm: calculateDistanceToShop(shop)
    }))
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
    <div className="min-h-full pb-20 bg-[#0A0A0F] text-white">
      {/* Top Location Bar & Notifications */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-400/20 transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Current Location</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors truncate max-w-[180px]">
                  {userLocation}
                </span>
                <span className="text-gold-400 text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency Pill */}
            <button
              onClick={() => setShowCurrencyModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#161622] border border-white/10 text-xs font-bold text-gold-400 hover:border-gold-400/40 transition-colors"
              title="Currency & Country"
            >
              <span>{currency.flag}</span>
              <span>{currency.symbol}</span>
            </button>

            <button
              onClick={() => setCustomerScreen('notifications')}
              className="relative w-8 h-8 rounded-xl bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-400 text-black text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Search & Radius Filter Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search salon, service, or stylist nearby..."
            className="w-full bg-[#181824] border border-[#2D2D3F] rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 shadow-inner"
          />
          <button
            onClick={() => setShowLocationModal(true)}
            className="absolute right-3 text-gold-400 hover:text-gold-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Banner: Luxury Salon Booking */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#20180A] via-[#151522] to-[#0A0A0F] border border-gold-400/40 p-5 shadow-gold-sm">
          <div className="relative z-10 max-w-[220px]">
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full border border-gold-400/30 mb-2">
              <Sparkles className="w-3 h-3" />
              Pay at Salon Available
            </span>
            <h3 className="font-heading text-lg font-black text-white leading-tight">
              Book Luxury Salons in {currency.country}
            </h3>
            <p className="text-[11px] text-gray-300 mt-1">
              Zero upfront online fee. Currency: <strong>{currency.symbol} ({currency.code})</strong>.
            </p>
            <button
              onClick={() => setCustomerScreen('services')}
              className="mt-3 gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 opacity-30 pointer-events-none">
            <Scissors className="w-full h-full text-gold-400" />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-wider">
              Service Categories
            </h3>
            <span className="text-[10px] text-gold-400 font-semibold">{categories.length - 1} Specialities</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold shadow-sm'
                    : 'bg-[#161622] text-gray-400 border border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Services with Multi-Currency Price & Discounts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">
              Popular Services
            </h3>
            <button
              onClick={() => setCustomerScreen('services')}
              className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold"
            >
              View All
            </button>
          </div>

          {services.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#14141E] border border-white/5 text-center text-xs text-gray-400">
              <Scissors className="w-5 h-5 text-gold-400/50 mx-auto mb-1" />
              <span>Real-time salon services will appear here as registered salons list their services.</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {services.slice(0, 4).map(srv => (
                <div
                  key={srv.id}
                  onClick={() => {
                    addToCart(srv);
                    setCustomerScreen('services');
                  }}
                  className="group cursor-pointer flex flex-col items-center text-center p-2 rounded-2xl bg-[#14141E] border border-white/5 hover:border-gold-400/30 transition-all relative"
                >
                  {srv.discountPercent && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black px-1 rounded shadow z-10">
                      {srv.discountPercent}%
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-1.5 border border-gold-400/20 group-hover:scale-105 transition-transform">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-200 line-clamp-1 group-hover:text-gold-300">
                    {srv.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gold-400 font-bold">
                      {formatPrice(srv.price)}
                    </span>
                    {srv.originalPrice && (
                      <span className="line-through text-gray-500 text-[8px]">
                        {formatPrice(srv.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Offer Banner */}
        {offers.length > 0 ? (
          <div className="relative overflow-hidden rounded-2xl bg-[#17141E] border border-gold-400/20 p-3.5 flex items-center justify-between">
            <div className="z-10">
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mb-1">
                <Tag className="w-3 h-3" />
                <span>SPECIAL PROMOTION</span>
              </div>
              <h4 className="font-heading text-base font-bold text-white">
                {offers[0].title} <span className="text-gold-400">({offers[0].code})</span>
              </h4>
              <p className="text-[11px] text-gray-400">{offers[0].subtitle || `Flat ${offers[0].discountPercent}% OFF on all salon services`}</p>
              <button
                onClick={() => {
                  applyOfferCode(offers[0].code);
                  setCustomerScreen('services');
                }}
                className="mt-2 text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                <span>Apply & Book Now</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-gold-400/30 shrink-0">
              <img
                src={offers[0].image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80'}
                alt={offers[0].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B14] to-[#12121A] border border-gold-400/20 p-3.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>DIRECT SALON BOOKING</span>
              </div>
              <h4 className="font-heading text-sm font-bold text-white">
                Book Verified Stylists in {currency.country}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Pay at salon after service • Real-time live confirmations</p>
            </div>
            <button
              onClick={() => setCustomerScreen('services')}
              className="gold-gradient-btn px-3 py-1.5 rounded-xl text-xs font-bold shrink-0"
            >
              Explore
            </button>
          </div>
        )}

        {/* Recommended Salons & Worldwide Search Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-heading text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Salons & Studios</span>
              </h3>
              <p className="text-[10px] text-gray-400">
                {sortBy === 'nearest' ? 'Sorted by nearest GPS distance to you' : 'Curated luxury & budget salons'}
              </p>
            </div>
            <span className="text-xs text-gold-400 font-bold bg-gold-400/10 px-2 py-0.5 rounded-full border border-gold-400/20">
              {filteredAndSortedShops.length} Found
            </span>
          </div>

          {/* Price Tier Recommendation Chips (User Request 3: Low Price, Expensive, VIP) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2.5">
            <button
              onClick={() => setSelectedPriceTier('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPriceTier === 'all'
                  ? 'bg-gold-400 text-black font-extrabold shadow-sm'
                  : 'bg-[#161622] text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              All Tiers ({shops.length})
            </button>
            <button
              onClick={() => setSelectedPriceTier('budget')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedPriceTier === 'budget'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                  : 'bg-[#161622] text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10'
              }`}
            >
              <span>💚 Budget (Low Price)</span>
            </button>
            <button
              onClick={() => setSelectedPriceTier('premium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedPriceTier === 'premium'
                  ? 'bg-blue-500 text-white font-extrabold shadow-sm'
                  : 'bg-[#161622] text-blue-400 border border-blue-500/20 hover:bg-blue-500/10'
              }`}
            >
              <span>💎 Premium Studios</span>
            </button>
            <button
              onClick={() => setSelectedPriceTier('vip')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedPriceTier === 'vip'
                  ? 'bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 text-black font-extrabold shadow-gold-sm'
                  : 'bg-[#1E1810] text-gold-300 border border-gold-400/40 hover:bg-gold-400/10'
              }`}
            >
              <span>👑 VIP Luxury</span>
            </button>
          </div>

          {/* Quick Sort Options Bar */}
          <div className="flex items-center justify-between pb-2 text-[11px] text-gray-400 border-b border-white/5 mb-3">
            <span className="font-semibold text-gray-400">Sort by:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('nearest')}
                className={`transition-colors font-medium ${sortBy === 'nearest' ? 'text-gold-400 font-bold underline underline-offset-4' : 'hover:text-white'}`}
              >
                📍 Nearest
              </button>
              <span>•</span>
              <button
                onClick={() => setSortBy('low_price')}
                className={`transition-colors font-medium ${sortBy === 'low_price' ? 'text-emerald-400 font-bold underline underline-offset-4' : 'hover:text-white'}`}
              >
                🏷️ Low Price
              </button>
              <span>•</span>
              <button
                onClick={() => setSortBy('high_price')}
                className={`transition-colors font-medium ${sortBy === 'high_price' ? 'text-gold-300 font-bold underline underline-offset-4' : 'hover:text-white'}`}
              >
                👑 VIP Luxury
              </button>
              <span>•</span>
              <button
                onClick={() => setSortBy('rating')}
                className={`transition-colors font-medium ${sortBy === 'rating' ? 'text-amber-400 font-bold underline underline-offset-4' : 'hover:text-white'}`}
              >
                ⭐ Rating
              </button>
            </div>
          </div>

          {/* Salon Cards List */}
          <div className="space-y-3">
            {filteredAndSortedShops.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5 my-3">
                <MapPin className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-xs font-bold text-white">No salons match your search</p>
                <p className="text-[11px] text-gray-400">Try changing your location, search keywords, or price tier filter.</p>
              </div>
            ) : (
              filteredAndSortedShops.map(shop => {
                const mapsLink = shop.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(shop.address)}`;
                return (
                  <div
                    key={shop.id}
                    className={`glass-card p-3.5 rounded-2xl border transition-all overflow-hidden relative ${
                      shop.priceTier === 'vip'
                        ? 'border-gold-400/40 shadow-gold-sm bg-gradient-to-br from-[#1C170E] via-[#12121A] to-[#0E0E16]'
                        : shop.priceTier === 'premium'
                        ? 'border-blue-500/20 bg-[#12121D]'
                        : 'border-white/10 hover:border-gold-400/30'
                    }`}
                  >
                    {/* Cover Banner if available */}
                    {shop.bannerImage && (
                      <div className="h-20 -mx-3.5 -mt-3.5 mb-3 overflow-hidden relative">
                        <img src={shop.bannerImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E16] via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 relative">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/85 backdrop-blur-sm text-gold-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-gold-400" />
                          <span>{shop.calculatedDistanceKm} km</span>
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-heading text-xs font-bold text-white truncate">
                              {shop.name}
                            </h4>
                            <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold shrink-0">
                              <Star className="w-2.5 h-2.5 fill-emerald-400" />
                              <span>{shop.rating}</span>
                            </div>
                          </div>

                          {/* Price Tier & Category Badge */}
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {shop.priceTier === 'budget' && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                💚 Budget Friendly
                              </span>
                            )}
                            {shop.priceTier === 'premium' && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                💎 Premium Studio
                              </span>
                            )}
                            {shop.priceTier === 'vip' && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/50 shadow-gold-sm">
                                👑 VIP Ultra Luxury
                              </span>
                            )}
                            <span className="text-[10px] text-gold-400 font-semibold">
                              From {formatPrice(shop.avgPrice || (shop.priceTier === 'budget' ? 200 : shop.priceTier === 'premium' ? 650 : 1800))}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 truncate mt-1">
                            {shop.address}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                            <span className="text-emerald-400 font-semibold">● Open</span>
                            <span>•</span>
                            <span>{shop.openingTime} - {shop.closingTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                          <div className="flex items-center gap-1.5">
                            {/* Direct Google Maps Link */}
                            <a
                              href={mapsLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-[#181824] hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/40 text-gold-400 text-[10px] font-bold flex items-center gap-1 transition-colors"
                              title="Open Google Maps Location"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Map</span>
                            </a>

                            {/* Salon Media Showcase Button (1 Video + 5 Photos) */}
                            {(shop.bannerVideoUrl || (shop.galleryImages && shop.galleryImages.length > 0)) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveShowcaseShop(shop);
                                  setShowcaseTab(shop.bannerVideoUrl ? 'video' : 'photos');
                                  setActivePhotoLightboxIdx(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-gold-400/15 hover:bg-gold-400/25 border border-gold-400/30 text-gold-300 text-[10px] font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                                title="View Salon Ambience Showcase (1 Video • 5 Photos)"
                              >
                                <Sparkles className="w-3 h-3 text-gold-400" />
                                <span>Showcase ({shop.galleryImages?.length || 0}/5{shop.bannerVideoUrl ? ' • 🎬' : ''})</span>
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedShop(shop);
                              setCustomerScreen('services');
                            }}
                            className="gold-gradient-btn px-3 py-1 rounded-lg text-[11px] font-bold"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Salon Owner Partner Registration CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1C160B] via-[#14141E] to-[#12121A] border border-gold-400/30 p-4 flex items-center justify-between shadow-gold-sm mt-4">
          <div className="space-y-1 max-w-[210px]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-md border border-gold-400/20">
              For Salon Owners
            </span>
            <h4 className="font-heading text-sm font-bold text-white">
              List Your Salon on ALGO
            </h4>
            <p className="text-[11px] text-gray-400">
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
            className="gold-gradient-btn px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md shrink-0 flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Register Salon</span>
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                Select Your Location
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <button
              onClick={() => {
                detectUserLocationAndCurrency();
                setShowLocationModal(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gold-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Use Current GPS Live Location</span>
            </button>

            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setUserLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                    userLocation === loc
                      ? 'bg-gold-400/15 border-gold-400 text-gold-300'
                      : 'bg-[#181824] border-white/5 text-gray-300 hover:border-gold-400/30'
                  }`}
                >
                  <span>{loc}</span>
                  {userLocation === loc && (
                    <span className="text-gold-400 font-bold">✓ Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Currency Switcher Modal */}
      <CurrencySwitcherModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />
    </div>
  );
};
