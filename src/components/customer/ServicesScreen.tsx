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
    currency,
    theme
  } = useApp();

  const isWhite = theme === 'white';

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
    <div className={`min-h-full pb-28 font-body transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Top Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerScreen('home')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className={`font-heading text-base font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
              Services Catalog
            </h2>
            <p className={`text-[10px] truncate max-w-[200px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
              {selectedShop?.name || 'ALGO Luxury Salon'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCustomerScreen('cart')}
          className={`relative p-2 rounded-xl transition-all ${
            isWhite 
              ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
              : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-white hover:border-gold-400/30'
          }`}
        >
          <ShoppingBag className={`w-4 h-4 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
          {cartItemCount > 0 && (
            <span className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] text-[9px] font-black rounded-full flex items-center justify-center px-0.5 shadow-md ${
              isWhite ? 'bg-purple-600 text-white' : 'bg-gradient-to-r from-amber-400 to-gold-500 text-black'
            }`}>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? isWhite 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                    : 'gold-gradient-btn text-black shadow-sm'
                  : isWhite
                    ? 'bg-white text-gray-700 hover:text-purple-700 border border-purple-100 hover:border-purple-300 shadow-sm'
                    : 'bg-[#14141E] text-gray-300 hover:text-white border border-white/5 hover:border-gold-400/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Tier Recommendation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              priceFilter === 'all'
                ? isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black font-black'
                : isWhite ? 'bg-white text-gray-700 border border-gray-200' : 'bg-[#14141E] text-gray-300 border border-white/5'
            }`}
          >
            All Prices
          </button>
          <button
            onClick={() => setPriceFilter('budget')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              priceFilter === 'budget'
                ? 'bg-emerald-500 text-white font-black'
                : isWhite ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#14141E] text-emerald-400 border border-emerald-500/20'
            }`}
          >
            💚 Budget (&le; {formatPrice(350)})
          </button>
          <button
            onClick={() => setPriceFilter('premium')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              priceFilter === 'premium'
                ? 'bg-blue-600 text-white font-black'
                : isWhite ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-[#14141E] text-blue-400 border border-blue-500/20'
            }`}
          >
            💎 Premium ({formatPrice(350)} - {formatPrice(1000)})
          </button>
          <button
            onClick={() => setPriceFilter('vip')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              priceFilter === 'vip'
                ? isWhite ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black' : 'bg-gradient-to-r from-amber-400 to-gold-400 text-black font-black'
                : isWhite ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-[#18140E] text-gold-300 border border-gold-400/30'
            }`}
          >
            👑 VIP Luxury (&gt; {formatPrice(1000)})
          </button>
        </div>

        {/* Sort Bar */}
        <div className={`flex items-center justify-between text-[11px] px-1 font-medium ${
          isWhite ? 'text-gray-600' : 'text-gray-300'
        }`}>
          <span className="font-bold">{filteredServices.length} Services Available</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('default')}
              className={sortBy === 'default' ? (isWhite ? 'text-purple-700 font-extrabold' : 'text-gold-300 font-extrabold') : 'hover:underline'}
            >
              Featured
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy('low_price')}
              className={sortBy === 'low_price' ? 'text-emerald-500 font-extrabold' : 'hover:underline'}
            >
              Price: Low to High
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy('high_price')}
              className={sortBy === 'high_price' ? (isWhite ? 'text-purple-700 font-extrabold' : 'text-gold-300 font-extrabold') : 'hover:underline'}
            >
              VIP: High to Low
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className={`p-8 rounded-3xl text-center space-y-2 border my-4 ${
              isWhite ? 'bg-white border-purple-100 shadow-sm' : 'glass-card-obsidian border-white/10'
            }`}>
              <Sparkles className={`w-8 h-8 mx-auto ${isWhite ? 'text-purple-400' : 'text-gold-400/50'}`} />
              <p className={`text-sm font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>No services found</p>
              <p className={`text-xs ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
                Services will appear here in real-time as salons list and update their services catalog.
              </p>
            </div>
          ) : (
            filteredServices.map(srv => {
              const qty = getItemQuantity(srv.id);
              return (
                <div
                  key={srv.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all group ${
                    isWhite 
                      ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)] hover:border-purple-300' 
                      : 'glass-card-obsidian border-white/10 hover:border-gold-400/35'
                  }`}
                >
                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isWhite 
                          ? 'text-purple-700 bg-purple-50 border-purple-200' 
                          : 'text-gold-300 bg-gold-400/10 border border-gold-400/20'
                      }`}>
                        {srv.category}
                      </span>
                      {srv.discountPercent && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          {srv.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <h4 className={`font-heading text-sm font-black transition-colors ${
                      isWhite ? 'text-gray-900 group-hover:text-purple-700' : 'text-white group-hover:text-gold-300'
                    }`}>
                      {srv.name}
                    </h4>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 font-medium ${
                      isWhite ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {srv.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className={`font-heading text-sm font-black ${
                        isWhite ? 'text-purple-700' : 'text-gold-300'
                      }`}>
                        {formatPrice(srv.price)}
                      </span>
                      {srv.originalPrice && (
                        <span className="line-through text-gray-400 text-xs font-medium">
                          {formatPrice(srv.originalPrice)}
                        </span>
                      )}
                      <span className={`text-[11px] font-medium flex items-center gap-1 ${
                        isWhite ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        <Clock className="w-3 h-3 text-current" />
                        {srv.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Add / Quantity Counter Button */}
                  <div className="shrink-0">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(srv)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                          isWhite 
                            ? 'bg-purple-50 border border-purple-200 hover:bg-purple-600 hover:text-white text-purple-700' 
                            : 'bg-[#181824] border border-gold-400/30 hover:border-gold-400 hover:bg-gold-400/15 text-gold-300'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className={`flex items-center rounded-xl p-0.5 shadow-sm border ${
                        isWhite ? 'bg-purple-50 border-purple-200' : 'bg-gold-400/15 border-gold-400/50'
                      }`}>
                        <button
                          onClick={() => updateCartQuantity(srv.id, qty - 1)}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors ${
                            isWhite ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gold-400 text-black hover:bg-gold-300'
                          }`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={`w-7 text-center text-xs font-black ${
                          isWhite ? 'text-purple-700' : 'text-gold-300'
                        }`}>
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(srv.id, qty + 1)}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors ${
                            isWhite ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gold-400 text-black hover:bg-gold-300'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Bottom Bar if Cart has items */}
      {cartItemCount > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl z-40 max-w-[430px] mx-auto transition-colors duration-300 ${
          isWhite 
            ? 'bg-white/95 border-t border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.1)]' 
            : 'bg-[#0A0A10]/95 border-t border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`text-[10px] uppercase tracking-widest block font-bold ${
                isWhite ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Total Services ({cartItemCount})
              </span>
              <span className={`font-heading text-lg font-black ${
                isWhite ? 'text-purple-700' : 'text-gold-300'
              }`}>
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setCustomerScreen('select_staff')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all ${
                isWhite 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                  : 'gold-gradient-btn text-black shadow-gold-sm'
              }`}
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
