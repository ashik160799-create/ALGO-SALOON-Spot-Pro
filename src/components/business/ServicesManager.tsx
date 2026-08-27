import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Scissors, 
  Edit3, 
  Trash2, 
  Clock, 
  Check, 
  Sparkles,
  Tag, 
  Percent, 
  Zap, 
  Gift,
  Upload,
  Camera
} from 'lucide-react';
import { ServiceItem } from '../../types';
import confetti from 'canvas-confetti';
import { SupabaseStorage } from '../../services/supabaseStorageService';
import { getAiServiceAvatar } from '../../utils/aiAvatarHelper';

export const ServicesManager: React.FC = () => {
  const { 
    services, 
    addService, 
    updateService, 
    deleteService, 
    setServiceDiscount, 
    removeServiceDiscount, 
    bulkApplyDiscountToAllServices, 
    createShopOffer,
    uploadServiceImageItem,
    currentBusinessShop,
    setBusinessScreen 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Hair' | 'Beard' | 'Skin' | 'Spa' | 'Packages'>('Hair');
  const [price, setPrice] = useState(299);
  const [duration, setDuration] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const serviceImageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const shopId = currentBusinessShop.id || 'shop-1';
        const serviceId = editingService?.id || 'srv-' + Date.now();
        const res = await SupabaseStorage.uploadServiceImage(shopId, serviceId, file);
        if (res.success && res.publicUrl) {
          setImageUrl(res.publicUrl);
          setHasCustomImage(true);
          if (editingService) {
            uploadServiceImageItem(editingService.id, res.publicUrl);
          }
        }
      } catch (err) {
        console.warn('Service image upload failed:', err);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  // Bulk discount state
  const [bulkPercent, setBulkPercent] = useState<number>(20);

  // New Coupon Offer State
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('Festive Special Discount');
  const [couponDiscount, setCouponDiscount] = useState(25);
  const [couponMinSpend, setCouponMinSpend] = useState(300);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOriginalPrice = discountPercent > 0 ? (editingService?.originalPrice || price) : undefined;
    const finalPrice = discountPercent > 0 ? Math.max(1, Math.round(price * (1 - discountPercent / 100))) : price;
    const finalImageUrl = (hasCustomImage && imageUrl) ? imageUrl : getAiServiceAvatar(name, category);

    if (editingService) {
      updateService({
        ...editingService,
        name,
        category,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        durationMinutes: duration,
        description,
        image: finalImageUrl
      });
      setEditingService(null);
    } else {
      addService({
        name,
        category,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        durationMinutes: duration,
        description,
        image: finalImageUrl,
        isPopular: true
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleApplyBulk = () => {
    bulkApplyDiscountToAllServices(bulkPercent);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
    alert(`Applied ${bulkPercent}% promotional discount to all services!`);
  };

  const handleClearDiscounts = () => {
    bulkApplyDiscountToAllServices(0);
    alert('Cleared all service discounts.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    createShopOffer({
      code: couponCode,
      title: couponTitle,
      subtitle: `Flat ${couponDiscount}% OFF on all salon services`,
      discountPercent: couponDiscount,
      minSpend: couponMinSpend,
      validTill: 'Valid till 30 Jun 2026',
      category: 'All',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80'
    });
    setShowOfferModal(false);
    setCouponCode('');
    alert(`Coupon ${couponCode.toUpperCase()} created successfully!`);
  };

  const resetForm = () => {
    setName('');
    setCategory('Hair');
    setPrice(299);
    setDuration(30);
    setDiscountPercent(0);
    setDescription('');
    setEditingService(null);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category as any);
    setPrice(s.originalPrice || s.price);
    setDuration(s.durationMinutes);
    setDiscountPercent(s.discountPercent || 0);
    setDescription(s.description);
    setImageUrl(s.image);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Services & Pricing Catalog
            </h2>
            <p className="text-[10px] text-gold-400">{services.length} Services</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOfferModal(true)}
            className="p-2 rounded-xl bg-[#161622] border border-gold-400/30 text-gold-300 hover:text-gold-200 text-xs font-bold flex items-center gap-1"
            title="Create Custom Voucher"
          >
            <Gift className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Voucher</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="gold-gradient-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Bulk Discount Promotion Campaign Banner */}
        <div className="glass-card-gilded p-4 rounded-3xl border border-gold-400/40 shadow-gold-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-300 font-bold text-xs font-heading">
              <Zap className="w-4 h-4 text-gold-400" />
              <span>Bulk Service Discount Campaign</span>
            </div>
            <span className="text-[10px] bg-gold-400 text-black font-extrabold px-2 py-0.5 rounded-full font-heading">
              PROMOTIONAL
            </span>
          </div>

          <p className="text-[11px] text-gray-300">
            Apply a seasonal festival offer discount to <strong>all services</strong> with 1-click:
          </p>

          <div className="flex items-center gap-2">
            {[10, 15, 20, 30].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => setBulkPercent(pct)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  bulkPercent === pct
                    ? 'bg-gold-400 text-black border-gold-400 shadow-sm'
                    : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-gold-400/30'
                }`}
              >
                {pct}% OFF
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleApplyBulk}
              className="flex-1 gold-gradient-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Apply {bulkPercent}% to ALL Services</span>
            </button>

            <button
              onClick={handleClearDiscounts}
              className="px-3 py-2.5 rounded-xl bg-[#241416] text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Services List with Discount Display */}
        <div className="space-y-3">
          {services.length === 0 ? (
            <div className="glass-card-obsidian p-8 rounded-3xl text-center space-y-3 my-4 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400 shadow-sm">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-sm font-bold text-white">No Services in Catalog Yet</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Add your salon's services, prices, duration and categories so customers can book in real-time.
              </p>
              <button
                onClick={() => {
                  setEditingService(null);
                  setName('');
                  setPrice(299);
                  setDuration(30);
                  setDescription('');
                  setDiscountPercent(0);
                  setShowAddModal(true);
                }}
                className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Service</span>
              </button>
            </div>
          ) : (
            services.map(service => (
              <div
                key={service.id}
                className="glass-card-obsidian p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-gold-400/40 transition-all shadow-sm"
              >
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-gold-400/25 shrink-0 relative shadow-sm">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {service.discountPercent && (
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-black px-1 rounded shadow-sm">
                    {service.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold-400/10 text-gold-300 font-bold border border-gold-400/20">
                    {service.category}
                  </span>
                  <h3 className="font-heading text-xs font-bold text-white truncate">
                    {service.name}
                  </h3>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-bold text-gold-300 font-heading">₹{service.price}</span>
                  {service.originalPrice && (
                    <span className="line-through text-gray-500 text-[11px]">
                      ₹{service.originalPrice}
                    </span>
                  )}
                  <span className="text-gray-400 text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400" />
                    {service.durationMinutes} mins
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(service)}
                  className="w-8 h-8 rounded-lg bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300 hover:border-gold-400/30 flex items-center justify-center transition-all shadow-sm"
                  title="Edit service & discounts"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="w-8 h-8 rounded-lg bg-[#181824] border border-white/10 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">
                {editingService ? 'Edit Service & Discount' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Service Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Keratin Hair Treatment"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Hair">Hair</option>
                  <option value="Beard">Beard</option>
                  <option value="Skin">Skin</option>
                  <option value="Spa">Spa</option>
                  <option value="Packages">Packages</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    required
                    min="1"
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white font-bold text-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    required
                    min="5"
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Service Discount Percentage */}
              <div>
                <label className="block text-gray-300 mb-1">Promotional Discount (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    min="0"
                    max="90"
                    placeholder="0"
                    className="w-24 bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white font-bold text-amber-300"
                  />
                  {discountPercent > 0 && (
                    <span className="text-emerald-400 font-bold text-xs">
                      Offer Price: ₹{Math.max(1, Math.round(price * (1 - discountPercent / 100)))}
                    </span>
                  )}
                </div>
              </div>

              {/* Service Image Upload & Preview */}
              <div>
                <label className="block text-gray-300 mb-1">Service Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gold-400/40 bg-[#161622] shrink-0 relative group">
                    <img src={imageUrl} alt="Service Preview" className="w-full h-full object-cover" />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[9px] text-gold-400 font-bold">
                        Uploading...
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => serviceImageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-3 py-1.5 rounded-lg bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs font-bold flex items-center gap-1.5 hover:bg-gold-400/25 transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Photo from Device'}</span>
                    </button>
                    <input
                      type="file"
                      ref={serviceImageInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <span className="text-[10px] text-gray-400 block mt-1">
                      Stored permanently in Supabase APP.FILES storage
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of service benefits"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold mt-2 shadow-md"
              >
                {editingService ? 'Save Changes' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Coupon Voucher Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-gold-400" />
                Create Promo Voucher
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Promo Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="e.g. SUMMER30"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white uppercase font-bold text-gold-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Offer Title</label>
                <input
                  type="text"
                  value={couponTitle}
                  onChange={e => setCouponTitle(e.target.value)}
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={couponDiscount}
                    onChange={e => setCouponDiscount(Number(e.target.value))}
                    min="5"
                    max="90"
                    required
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={couponMinSpend}
                    onChange={e => setCouponMinSpend(Number(e.target.value))}
                    min="50"
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold mt-2 shadow-md"
              >
                Publish Voucher to Customer App
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
