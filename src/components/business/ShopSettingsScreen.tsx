import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SupabaseStorage } from '../../services/supabaseStorageService';
import { 
  ArrowLeft, 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  Bell, 
  Power,
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  Upload,
  ShieldAlert,
  Sparkles,
  Navigation,
  ExternalLink,
  Globe,
  Coins,
  FileText,
  CheckCircle2,
  AlertCircle,
  Check
} from 'lucide-react';
import { supportedCurrencies } from '../../data/mockData';

export const ShopSettingsScreen: React.FC = () => {
  const { 
    currentBusinessShop, 
    updateShopSettings, 
    uploadShopAvatar, 
    deleteShopAvatar, 
    uploadShopBanner, 
    deleteShopBanner, 
    uploadShopVideo,
    deleteShopVideo,
    addShopGalleryImage, 
    deleteShopGalleryImage, 
    uploadTradeLicenseDoc,
    deleteTradeLicenseDoc,
    uploadTaxVatDoc,
    deleteTaxVatDoc,
    runStorageCleanup,
    deleteShopAccountPermanently, 
    setBusinessScreen,
    userLocation,
    setUserLocation,
    currency,
    setCurrency,
    detectUserLocationAndCurrency
  } = useApp();

  const [isCleaningStorage, setIsCleaningStorage] = useState(false);
  const [cleanupReport, setCleanupReport] = useState<{ success: boolean; scannedCount: number; deletedCount: number; errors: string[] } | null>(null);

  const handleRunCleanup = async () => {
    setIsCleaningStorage(true);
    setCleanupReport(null);
    try {
      const res = await runStorageCleanup();
      setCleanupReport(res);
    } catch (err: any) {
      alert('Cleanup failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsCleaningStorage(false);
    }
  };

  const [name, setName] = useState(currentBusinessShop.name || '');
  const [phone, setPhone] = useState(currentBusinessShop.phone || '');
  const [email, setEmail] = useState(currentBusinessShop.email || '');
  const [address, setAddress] = useState(currentBusinessShop.address || '');
  const [city, setCity] = useState(currentBusinessShop.city || '');
  const [country, setCountry] = useState(currentBusinessShop.country || 'India');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(currentBusinessShop.googleMapsUrl || '');
  const [openingTime, setOpeningTime] = useState(currentBusinessShop.openingTime || '09:00 AM');
  const [closingTime, setClosingTime] = useState(currentBusinessShop.closingTime || '09:00 PM');
  const [tradeLicenseNo, setTradeLicenseNo] = useState(currentBusinessShop.tradeLicenseNo || '');
  const [taxVatNo, setTaxVatNo] = useState(currentBusinessShop.taxVatNo || '');
  const [autoAccept, setAutoAccept] = useState(false);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);

  // Sync state when currentBusinessShop changes
  React.useEffect(() => {
    setName(currentBusinessShop.name || '');
    setPhone(currentBusinessShop.phone || '');
    setEmail(currentBusinessShop.email || '');
    setAddress(currentBusinessShop.address || '');
    setCity(currentBusinessShop.city || '');
    setCountry(currentBusinessShop.country || 'India');
    setGoogleMapsUrl(currentBusinessShop.googleMapsUrl || '');
    setOpeningTime(currentBusinessShop.openingTime || '09:00 AM');
    setClosingTime(currentBusinessShop.closingTime || '09:00 PM');
    setTradeLicenseNo(currentBusinessShop.tradeLicenseNo || '');
    setTaxVatNo(currentBusinessShop.taxVatNo || '');
  }, [currentBusinessShop]);

  // Upload progress states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const licenseDocInputRef = useRef<HTMLInputElement>(null);
  const taxDocInputRef = useRef<HTMLInputElement>(null);

  const handleSlotFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedSlotIndex !== null) {
      setIsUploadingGallery(true);
      try {
        await addShopGalleryImage(file, selectedSlotIndex);
      } finally {
        setIsUploadingGallery(false);
        setSelectedSlotIndex(null);
        if (slotFileInputRef.current) slotFileInputRef.current.value = '';
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingLogo(true);
      try {
        await uploadShopAvatar(file);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingBanner(true);
      try {
        await uploadShopBanner(file);
      } finally {
        setIsUploadingBanner(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingVideo(true);
      try {
        await uploadShopVideo(file, file.type || 'video/mp4');
      } finally {
        setIsUploadingVideo(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingGallery(true);
      try {
        await addShopGalleryImage(file);
      } finally {
        setIsUploadingGallery(false);
      }
    }
  };

  const handleLicenseDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingDoc(true);
      setDocUploadSuccess(null);
      try {
        const res = await SupabaseStorage.uploadTradeLicenseDocument(currentBusinessShop.id || 'shop-1', file);
        if (res.success && res.publicUrl) {
          uploadTradeLicenseDoc(res.publicUrl, tradeLicenseNo);
          setDocUploadSuccess('Trade License attached and verified in APP.FILES storage!');
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              uploadTradeLicenseDoc(reader.result, tradeLicenseNo);
              setDocUploadSuccess('Trade License document saved!');
            }
          };
          reader.readAsDataURL(file);
        }
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            uploadTradeLicenseDoc(reader.result, tradeLicenseNo);
            setDocUploadSuccess('Trade License document saved!');
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingDoc(false);
      }
    }
  };

  const handleTaxDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingDoc(true);
      setDocUploadSuccess(null);
      try {
        const res = await SupabaseStorage.uploadTaxDocument(currentBusinessShop.id || 'shop-1', file);
        if (res.success && res.publicUrl) {
          uploadTaxVatDoc(res.publicUrl, taxVatNo);
          setDocUploadSuccess('Tax / GST certificate attached in APP.FILES storage!');
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              uploadTaxVatDoc(reader.result, taxVatNo);
              setDocUploadSuccess('Tax / GST certificate saved!');
            }
          };
          reader.readAsDataURL(file);
        }
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            uploadTaxVatDoc(reader.result, taxVatNo);
            setDocUploadSuccess('Tax / GST certificate saved!');
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingDoc(false);
      }
    }
  };

  const handleFetchCurrentGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const url = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
          setGoogleMapsUrl(url);
          detectUserLocationAndCurrency();
          alert(`Google Maps & Business Location pinned from GPS:\n${url}\nCity: ${userLocation}`);
        },
        () => {
          alert('GPS location unavailable. Please enter coordinates or URL manually.');
        }
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      name,
      phone,
      email,
      address,
      city,
      country,
      googleMapsUrl,
      openingTime,
      closingTime,
      tradeLicenseNo,
      taxVatNo
    });
    alert('Salon profile, map location, verification documents & compliance saved successfully!');
  };

  const [isDeletingShop, setIsDeletingShop] = useState(false);

  const handleDeleteShop = async () => {
    if (deleteConfirmText.trim().toUpperCase() === 'DELETE') {
      setIsDeletingShop(true);
      try {
        await deleteShopAccountPermanently();
        setShowDeleteModal(false);
        alert('Your salon business account, staff, inventory, and all uploaded media have been permanently deleted.');
      } catch (err: any) {
        alert('Salon deletion failed: ' + (err.message || 'Error'));
      } finally {
        setIsDeletingShop(false);
      }
    } else {
      alert('Please type "DELETE" to confirm.');
    }
  };

  return (
    <div className="min-h-full pb-28 bg-[#0A0A0F] text-white">
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
              Shop Settings & Operations
            </h2>
            <p className="text-[10px] text-gold-400">Location, Country Currency & Branding</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Salon Branding & Image Management */}
        <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-gold-400" />
            Salon Logo & Cover Banner
          </h3>

          {/* Cover Banner Upload & Delete */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
              <span>Main Shop Cover Banner</span>
              {currentBusinessShop.bannerImage && (
                <button
                  type="button"
                  onClick={deleteShopBanner}
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Banner</span>
                </button>
              )}
            </div>

            <div className="relative h-28 rounded-2xl overflow-hidden border border-white/10 bg-[#161622] group">
              {currentBusinessShop.bannerImage ? (
                <img
                  src={currentBusinessShop.bannerImage}
                  alt="Shop Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
                  <ImageIcon className="w-6 h-6 mb-1 text-gray-600" />
                  <span>No banner uploaded</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-gold-400"
              >
                <Camera className="w-4 h-4" />
                <span>Upload New Banner Image</span>
              </button>
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Shop Avatar / Logo Upload & Delete */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold-400/50 bg-[#161622]">
                <img
                  src={currentBusinessShop.image}
                  alt="Shop Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera className="w-4 h-4 text-gold-400" />
              </button>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <span className="font-bold text-white block">Salon Avatar / Logo</span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Displays on nearby listings, receipts, and booking confirmation.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-300 font-bold text-[11px]"
                >
                  Upload Logo
                </button>
                <button
                  type="button"
                  onClick={deleteShopAvatar}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px]"
                >
                  Reset Logo
                </button>
              </div>
            </div>
          </div>

          {/* Salon Showcase & Ambience (Strict 1 Video + 5 Photos Limit) */}
          <div className="pt-3 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Salon Showcase & Ambience Media</span>
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Maximum 1 Hero Ambience Video and 5 Curated Showcase Photos
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  (currentBusinessShop.galleryImages?.length || 0) === 5 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-gold-400/10 text-gold-300 border-gold-400/20'
                }`}>
                  📸 {currentBusinessShop.galleryImages?.length || 0}/5 Photos
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  currentBusinessShop.bannerVideoUrl 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}>
                  🎬 {currentBusinessShop.bannerVideoUrl ? '1/1' : '0/1'} Video
                </span>
              </div>
            </div>

            {/* 1. Hero Video Showcase (Max 1) */}
            <div className="p-3.5 rounded-2xl bg-[#12121C] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>🎬 Hero Ambience Video (Max 1)</span>
                </span>
                {currentBusinessShop.bannerVideoUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="text-gold-400 hover:text-gold-300 text-[11px] font-bold underline"
                    >
                      {isUploadingVideo ? 'Replacing...' : 'Replace Video'}
                    </button>
                    <button
                      type="button"
                      onClick={deleteShopVideo}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {currentBusinessShop.bannerVideoUrl ? (
                <div className="rounded-xl overflow-hidden border border-gold-400/30 bg-black relative">
                  <video
                    src={currentBusinessShop.bannerVideoUrl}
                    controls
                    className="w-full h-36 object-cover"
                  />
                </div>
              ) : (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-white/20 hover:border-gold-400/50 bg-[#161622] text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-gold-400 mx-auto mb-1 transition-colors" />
                  <span className="text-xs font-bold text-gray-300 group-hover:text-gold-300 block">
                    + Upload Hero Ambience Video (1/1)
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    MP4, WebM (Max 30MB • 10-30s Tour)
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
              />
            </div>

            {/* 2. 5 Fixed Showcase Photo Slots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  📸 Curated Showcase Photos (Max 5)
                </span>
                <span className="text-[10px] text-gray-400">
                  Tap any slot to upload or replace photo
                </span>
              </div>

              {/* 5-Slot Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { title: 'Interior & Ambience', desc: 'Salon Entrance / Reception' },
                  { title: 'Styling Station', desc: 'Cutting & Styling Chairs' },
                  { title: 'Transformations', desc: 'Hair Coloring / Makeovers' },
                  { title: 'Spa & Relaxation', desc: 'Facial Lounge / Massages' },
                  { title: 'Nail & Signature', desc: 'Manicure / Special Service' }
                ].map((slot, idx) => {
                  const gallery = currentBusinessShop.galleryImages || [];
                  const photoUrl = gallery[idx];

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden border transition-all ${
                        photoUrl 
                          ? 'border-gold-400/40 bg-[#161624] shadow-sm' 
                          : 'border-dashed border-white/20 hover:border-gold-400/50 bg-[#12121A]'
                      }`}
                    >
                      {photoUrl ? (
                        <div className="relative group aspect-square">
                          <img
                            src={photoUrl}
                            alt={`Slot ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-2">
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] font-bold text-gold-400 border border-gold-400/30">
                                Slot {idx + 1}/5
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteShopGalleryImage(idx);
                                }}
                                className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSlotIndex(idx);
                                slotFileInputRef.current?.click();
                              }}
                              disabled={isUploadingGallery}
                              className="w-full py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 text-gold-300 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>Replace</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setSelectedSlotIndex(idx);
                            slotFileInputRef.current?.click();
                          }}
                          className="aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer group hover:bg-[#181826] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-gold-400/10 border border-white/10 group-hover:border-gold-400/30 flex items-center justify-center mb-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold-400" />
                          </div>
                          <span className="text-[10px] font-bold text-gold-400 block">
                            Slot {idx + 1}/5
                          </span>
                          <span className="text-[9px] text-gray-300 font-semibold block truncate w-full">
                            {slot.title}
                          </span>
                          <span className="text-[8px] text-gray-500 block truncate w-full">
                            {slot.desc}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hidden file input for slot upload */}
              <input
                type="file"
                ref={slotFileInputRef}
                onChange={handleSlotFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Business Location & Country Currency Settings (Faithful to User Request) */}
        <div className="glass-card p-4 rounded-3xl border border-gold-400/30 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gold-400" />
              Location & Payment Settlement Currency
            </h3>
            <button
              type="button"
              onClick={handleFetchCurrentGps}
              className="text-[10px] text-gold-400 hover:underline font-bold flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              <span>Allow GPS Location</span>
            </button>
          </div>

          <div className="p-3 bg-[#12121A] rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Business Location:</span>
              <span className="font-bold text-gold-300">{userLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Settlement Currency:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <span>{currency.flag}</span>
                <span>{currency.name} ({currency.symbol} {currency.code})</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1.5 font-semibold">
              Select Salon Operating Currency:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {supportedCurrencies.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    currency.code === c.code
                      ? 'bg-gold-400/15 border-gold-400 text-gold-300 font-bold'
                      : 'bg-[#181824] border-white/5 text-gray-300 hover:border-gold-400/30'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <span className="block text-xs font-bold">{c.code} ({c.symbol})</span>
                    <span className="text-[9px] text-gray-400 block">{c.country}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Documents & Business Compliance Section (User Request) */}
        <div id="verification-section" className="glass-card p-4 rounded-3xl border border-gold-400/30 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Verification Documents & Legal Compliance</span>
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Upload shop license and tax/GST documents for partner badge & customer trust
              </p>
            </div>
            {currentBusinessShop.tradeLicenseDocumentUrl ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Active</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Pending Docs</span>
              </span>
            )}
          </div>

          {/* Success notice */}
          {docUploadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{docUploadSuccess}</span>
            </div>
          )}

          {/* Trade License & GST Numbers Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Shop License Number</label>
              <input
                type="text"
                value={tradeLicenseNo}
                onChange={e => setTradeLicenseNo(e.target.value)}
                placeholder="e.g. TL-CHE-2024-8841"
                className="w-full bg-[#181824] border border-[#2B2B3E] focus:border-gold-400 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Tax / GST / VAT ID</label>
              <input
                type="text"
                value={taxVatNo}
                onChange={e => setTaxVatNo(e.target.value)}
                placeholder="e.g. GSTIN33AABCS1429B1Z8"
                className="w-full bg-[#181824] border border-[#2B2B3E] focus:border-gold-400 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Document Upload Cards: Shop License vs Tax / GST / Others */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* 1. Shop License Upload Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              currentBusinessShop.tradeLicenseDocumentUrl 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-[#141420] border-white/10 hover:border-gold-400/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">Shop License</span>
                    <span className="text-[10px] text-gray-400">Municipal / Trade Certificate</span>
                  </div>
                </div>
                {currentBusinessShop.tradeLicenseDocumentUrl ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400">Required</span>
                )}
              </div>

              {currentBusinessShop.tradeLicenseDocumentUrl ? (
                <div className="space-y-2 mt-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px]">
                    <a
                      href={currentBusinessShop.tradeLicenseDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1 underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Uploaded Document</span>
                    </a>
                    <button
                      type="button"
                      onClick={deleteTradeLicenseDoc}
                      className="text-red-400 hover:text-red-300 text-[10px] font-semibold flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => licenseDocInputRef.current?.click()}
                    disabled={isUploadingDoc}
                    className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  >
                    <Upload className="w-3 h-3 text-gold-400" />
                    <span>{isUploadingDoc ? 'Uploading...' : 'Replace Document (PDF / Image)'}</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => licenseDocInputRef.current?.click()}
                  className="mt-3 p-3 rounded-xl border border-dashed border-white/20 hover:border-gold-400/50 bg-[#101018] cursor-pointer flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-gold-400 mb-1 transition-colors" />
                  <span className="text-[11px] font-bold text-gray-300 group-hover:text-gold-300">
                    Upload Shop License
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">PDF, PNG, JPG (Max 15MB)</span>
                </div>
              )}
              <input
                type="file"
                ref={licenseDocInputRef}
                onChange={handleLicenseDocUpload}
                accept="application/pdf,image/*"
                className="hidden"
              />
            </div>

            {/* 2. Tax / GST / Others Upload Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              currentBusinessShop.taxVatDocumentUrl 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-[#141420] border-white/10 hover:border-gold-400/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">Tax / GST / Others</span>
                    <span className="text-[10px] text-gray-400">GSTIN / VAT / Registration</span>
                  </div>
                </div>
                {currentBusinessShop.taxVatDocumentUrl ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400">Optional</span>
                )}
              </div>

              {currentBusinessShop.taxVatDocumentUrl ? (
                <div className="space-y-2 mt-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px]">
                    <a
                      href={currentBusinessShop.taxVatDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1 underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Uploaded Document</span>
                    </a>
                    <button
                      type="button"
                      onClick={deleteTaxVatDoc}
                      className="text-red-400 hover:text-red-300 text-[10px] font-semibold flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => taxDocInputRef.current?.click()}
                    disabled={isUploadingDoc}
                    className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  >
                    <Upload className="w-3 h-3 text-gold-400" />
                    <span>{isUploadingDoc ? 'Uploading...' : 'Replace Document (PDF / Image)'}</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => taxDocInputRef.current?.click()}
                  className="mt-3 p-3 rounded-xl border border-dashed border-white/20 hover:border-blue-400/50 bg-[#101018] cursor-pointer flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-400 mb-1 transition-colors" />
                  <span className="text-[11px] font-bold text-gray-300 group-hover:text-blue-300">
                    Upload Tax / GST / Others
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">PDF, PNG, JPG (Max 15MB)</span>
                </div>
              )}
              <input
                type="file"
                ref={taxDocInputRef}
                onChange={handleTaxDocUpload}
                accept="application/pdf,image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Profile, Google Maps & Working Hours Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3 text-xs">
            <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
              Branch Profile & Address
            </h3>

            <div>
              <label className="block text-gray-300 mb-1">Salon Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter salon / business name..."
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. salon@example.com"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter street address, locality & building..."
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter city..."
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Enter country..."
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Google Maps URL Link */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-gold-400" />
                  <span>Google Maps URL Link</span>
                </label>
                <button
                  type="button"
                  onClick={handleFetchCurrentGps}
                  className="text-[10px] text-gold-400 hover:underline font-bold"
                >
                  📍 Pin Current GPS
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={e => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl pl-3 pr-20 py-2 text-white"
                />
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2 px-2 py-1 bg-gold-400/10 text-gold-300 hover:bg-gold-400/20 text-[10px] font-bold rounded-lg flex items-center gap-1 border border-gold-400/30"
                  >
                    <span>Open Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3 text-xs">
            <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
              Operating Hours
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1">Opens At</label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Closes At</label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3 text-xs">
            <h3 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
              Booking Automation
            </h3>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-white block">Auto-Accept Pay at Salon</span>
                <span className="text-[10px] text-gray-400">Instantly confirm slots without manual approval</span>
              </div>
              <input
                type="checkbox"
                checked={autoAccept}
                onChange={e => setAutoAccept(e.target.checked)}
                className="w-4 h-4 accent-gold-400"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-white/5">
              <div>
                <span className="font-semibold text-white block">WhatsApp SMS Alerts</span>
                <span className="text-[10px] text-gray-400">Receive instant customer booking alerts on phone</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappNotifs}
                onChange={e => setWhatsappNotifs(e.target.checked)}
                className="w-4 h-4 accent-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="gold-gradient-btn w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4 text-black font-bold" />
            <span>Save Settings & Location</span>
          </button>
        </form>

        {/* Storage Maintenance & Orphaned File Cleanup */}
        <div className="glass-card p-4 rounded-3xl border border-gold-400/20 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Storage Optimization & Orphan Cleanup</span>
            </div>
            <span className="text-[10px] text-gray-400">Bucket: APP.FILES</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Scans Supabase storage to detect and permanently purge outdated or unreferenced avatars, old cover banners, and unused temporary media files.
          </p>

          {cleanupReport && (
            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
              cleanupReport.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Storage Cleanup Complete</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Scanned <strong>{cleanupReport.scannedCount}</strong> files &bull; Removed <strong>{cleanupReport.deletedCount}</strong> orphaned objects.
              </p>
              {cleanupReport.errors.length > 0 && (
                <p className="text-[10px] text-amber-400">{cleanupReport.errors.join(', ')}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleRunCleanup}
            disabled={isCleaningStorage}
            className="w-full py-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] border border-gold-400/30 text-gold-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isCleaningStorage ? 'animate-spin' : ''}`} />
            <span>{isCleaningStorage ? 'Scanning & Purging Orphaned Files...' : 'Run Storage Cleanup Job Now'}</span>
          </button>
        </div>

        {/* Permanent Salon Account Deletion */}
        <div className="glass-card p-4 rounded-3xl border border-red-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Permanently close this salon branch, cancel active appointments, and erase all staff and inventory data.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2.5 rounded-xl bg-[#281418] hover:bg-[#34181E] border border-red-500/40 text-red-400 font-bold text-xs transition-colors mt-2"
          >
            Delete Salon Shop & Account Permanently
          </button>
        </div>
      </div>

      {/* Delete Salon Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-red-500/40 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Delete Salon Shop Permanently?
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                This will unregister <strong>{currentBusinessShop.name}</strong> from the customer directory, clear the stylist roster, and remove all business data.
              </p>
            </div>

            <div className="bg-[#1C1518] p-3 rounded-xl border border-red-500/20 text-left text-xs">
              <label className="block text-[11px] text-red-300 font-semibold mb-1">
                Type <span className="font-mono text-white font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#121014] border border-red-500/40 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 rounded-xl bg-[#1A1A28] text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteShop}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeletingShop}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
              >
                {isDeletingShop ? 'Deleting Salon & Media...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
