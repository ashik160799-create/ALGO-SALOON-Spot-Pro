import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  Clock, 
  Info, 
  ArrowRight,
  Tag 
} from 'lucide-react';
import { ServiceItem } from '../../types';

export const ServicesScreen: React.FC = () => {
  const { 
    services, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    setCustomerScreen, 
    selectedShop,
    formatPrice,
    currency
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'budget' | 'premium' | 'vip'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'low_price' | 'high_price'>('default');

  const categories = ['All', 'Hair', 'Beard', 'Skin', 'Spa', 'Packages'];

  const filteredServices = services
    .filter(service => {
      const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
      let matchesPrice = true;
      if (priceFilter === 'budget') matchesPrice = service.price <= 350;
      else if (priceFilter === 'premium') matchesPrice = service.price > 350 && service.price <= 1000;
      else if (priceFilter === 'vip') matchesPrice = service.price > 1000;

      return matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'low_price') return a.price - b.price;
      if (sortBy === 'high_price') return b.price - a.price;
      return 0;
    });

  const cartTotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getItemQuantity = (serviceId: string) => {
    const item = cart.find(i => i.service.id === serviceId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-full pb-28 bg-[#0A0A0F] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('home')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Services Catalog
            </h2>
            <p className="text-[10px] text-gold-400 truncate max-w-[200px]">
              {selectedShop?.name || 'ALGO Luxury Salon'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCustomerScreen('cart')}
          className="relative p-2 rounded-xl bg-[#181824] border border-white/10 text-gray-300 hover:text-white"
        >
          <ShoppingBag className="w-4 h-4 text-gold-400" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-gradient-to-r from-amber-400 to-gold-500 text-black text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black shadow-gold-sm font-bold'
                  : 'bg-[#181824] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Tier Recommendation Chips (Low Price, Premium, VIP) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              priceFilter === 'all'
                ? 'bg-gold-400 text-black font-bold'
                : 'bg-[#161622] text-gray-400 border border-white/5'
            }`}
          >
            All Prices
          </button>
          <button
            onClick={() => setPriceFilter('budget')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              priceFilter === 'budget'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-[#161622] text-emerald-400 border border-emerald-500/20'
            }`}
          >
            💚 Budget (&le; {formatPrice(350)})
          </button>
          <button
            onClick={() => setPriceFilter('premium')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              priceFilter === 'premium'
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-[#161622] text-blue-400 border border-blue-500/20'
            }`}
          >
            💎 Premium ({formatPrice(350)} - {formatPrice(1000)})
          </button>
          <button
            onClick={() => setPriceFilter('vip')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              priceFilter === 'vip'
                ? 'bg-gradient-to-r from-amber-400 to-gold-400 text-black font-bold'
                : 'bg-[#161622] text-gold-300 border border-gold-400/30'
            }`}
          >
            👑 VIP Luxury (&gt; {formatPrice(1000)})
          </button>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
          <span>{filteredServices.length} Services Available</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('default')}
              className={sortBy === 'default' ? 'text-gold-400 font-bold' : 'hover:text-white'}
            >
              Featured
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy('low_price')}
              className={sortBy === 'low_price' ? 'text-emerald-400 font-bold' : 'hover:text-white'}
            >
              Price: Low to High
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy('high_price')}
              className={sortBy === 'high_price' ? 'text-gold-300 font-bold' : 'hover:text-white'}
            >
              VIP: High to Low
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center space-y-2 border border-white/5 my-4">
              <Sparkles className="w-8 h-8 text-gold-400/50 mx-auto" />
              <p className="text-sm font-bold text-white">No services found</p>
              <p className="text-xs text-gray-400">
                Services will appear here in real-time as salons list and update their services catalog.
              </p>
            </div>
          ) : (
            filteredServices.map(srv => {
              const qty = getItemQuantity(srv.id);
              return (
                <div
                  key={srv.id}
                  className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-gold-400/30 transition-all group"
                >
                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/80 bg-gold-400/10 px-2 py-0.5 rounded-md border border-gold-400/20">
                      {srv.category}
                    </span>
                    {srv.discountPercent && (
                      <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        {srv.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                    {srv.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {srv.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-heading text-sm font-extrabold text-gold-400">
                      {formatPrice(srv.price)}
                    </span>
                    {srv.originalPrice && (
                      <span className="line-through text-gray-500 text-xs">
                        {formatPrice(srv.originalPrice)}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {srv.durationMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Add / Quantity Counter Button */}
                <div className="shrink-0">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(srv)}
                      className="w-9 h-9 rounded-xl bg-[#1D1D2B] border border-gold-400/30 hover:border-gold-400 hover:bg-gold-400/10 text-gold-400 flex items-center justify-center transition-all shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center bg-gold-400/10 border border-gold-400 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartQuantity(srv.id, qty - 1)}
                        className="w-7 h-7 rounded-lg bg-gold-400 text-black font-bold flex items-center justify-center hover:bg-gold-300 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-gold-400">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(srv.id, qty + 1)}
                        className="w-7 h-7 rounded-lg bg-gold-400 text-black font-bold flex items-center justify-center hover:bg-gold-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Floating Bottom Bar if Cart has items */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0E0E16]/95 backdrop-blur-xl border-t border-white/10 z-40 max-w-[430px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Total Services ({cartItemCount})
              </span>
              <span className="font-heading text-lg font-black text-gold-400">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setCustomerScreen('select_staff')}
              className="gold-gradient-btn px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Select Stylist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
