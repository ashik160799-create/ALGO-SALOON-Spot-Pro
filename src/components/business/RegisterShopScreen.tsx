import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Store, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  Upload, 
  Lock, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Navigation,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegisterShopScreen: React.FC = () => {
  const { registerShop, setBusinessScreen, setMode, userLocation, supabaseSession, customer } = useApp();

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState(supabaseSession?.user?.user_metadata?.full_name || customer.name || '');
  const [phone, setPhone] = useState(supabaseSession?.user?.user_metadata?.phone || customer.phone || '');
  const [email, setEmail] = useState(supabaseSession?.user?.email || customer.email || '');
  const [address, setAddress] = useState(userLocation || '');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  React.useEffect(() => {
    if (!email && (supabaseSession?.user?.email || customer.email)) {
      setEmail(supabaseSession?.user?.email || customer.email || '');
    }
    if (!ownerName && (supabaseSession?.user?.user_metadata?.full_name || customer.name)) {
      setOwnerName(supabaseSession?.user?.user_metadata?.full_name || customer.name || '');
    }
  }, [supabaseSession, customer]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Salon', 'Barber']);
  const [staffCount, setStaffCount] = useState('3');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('09:00 PM');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  const [tradeLicense, setTradeLicense] = useState('');
  const [taxVat, setTaxVat] = useState('');
  const [tradeLicenseDocUrl, setTradeLicenseDocUrl] = useState<string | undefined>();
  const [taxDocUrl, setTaxDocUrl] = useState<string | undefined>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const licenseInputRef = React.useRef<HTMLInputElement>(null);
  const taxInputRef = React.useRef<HTMLInputElement>(null);

  const businessTypes = ['Salon', 'Barber', 'Beauty', 'Spa', 'Unisex'];
  const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleType = (t: string) => {
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const toggleDay = (d: string) => {
    setWorkingDays(prev =>
      prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]
    );
  };

  const handleFetchCurrentGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const url = `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
          setGoogleMapsUrl(url);
          alert(`Google Maps URL pinned to your GPS location:\n${url}`);
        },
        () => {
          alert('GPS location unavailable. Please enter address or Maps URL manually.');
        }
      );
    }
  };

  const handleLicenseDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setTradeLicenseDocUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaxDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setTaxDocUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    registerShop({
      name: shopName.trim() || 'New Salon Branch',
      ownerName: ownerName.trim() || 'Owner',
      phone: phone.trim(),
      email: email.trim(),
      address: `${address}${city ? ', ' + city : ''}`,
      city: city.trim(),
      country,
      businessType: selectedTypes as any,
      staffCount: Number(staffCount) || 3,
      openingTime,
      closingTime,
      workingDays,
      tradeLicenseNo: tradeLicense.trim(),
      taxVatNo: taxVat.trim(),
      tradeLicenseDocumentUrl: tradeLicenseDocUrl,
      taxVatDocumentUrl: taxDocUrl,
      googleMapsUrl: googleMapsUrl || (address ? `https://maps.google.com/?q=${encodeURIComponent(address + ' ' + city)}` : ''),
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=80',
      isVerified: true
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setMode('business');
    setBusinessScreen('dashboard', 'home');
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white overflow-y-auto">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
              Business Partner Portal
            </span>
            <h2 className="font-heading text-base font-bold text-white">
              Register Your Shop
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            setMode('customer');
          }}
          className="text-xs text-gray-400 hover:text-gold-300 font-semibold"
        >
          Customer App
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* Brand Banner */}
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-gold-sm mx-auto mb-2">
            <div className="w-full h-full bg-[#101018] rounded-[14px] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <h1 className="font-heading text-lg font-bold text-white">
            ALGO Salon Business Management
          </h1>
          <p className="text-xs text-gray-400">
            Join the premier network of salons & accept appointments online
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* 1. Shop Information (Faithful to Image 2) */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="w-6 h-6 rounded-full bg-gold-400 text-black font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-heading text-sm font-bold text-white">
                Shop Information
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                Shop / Salon Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="e.g. ALGO Luxe Salon"
                required
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Owner / Manager Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="Owner name"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                Shop Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Street address & locality"
                required
                className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* Google Maps URL Input (Faithful to User Request 2) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-gold-300 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-gold-400" />
                  <span>Google Maps Location URL</span>
                </label>
                <button
                  type="button"
                  onClick={handleFetchCurrentGps}
                  className="text-[10px] text-gold-400 hover:underline font-bold"
                >
                  📍 Use My GPS
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={e => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2 px-2 py-1 bg-gold-400/10 text-gold-300 hover:bg-gold-400/20 text-[10px] font-bold rounded-lg flex items-center gap-1 border border-gold-400/30"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Operations & Timings */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="w-6 h-6 rounded-full bg-gold-400 text-black font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-heading text-sm font-bold text-white">
                Operations & Working Hours
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-2">
                Business Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTypes.includes(t)
                        ? 'bg-gold-400 text-black border-gold-400 shadow-sm'
                        : 'bg-[#181824] text-gray-300 border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Opening Time
                </label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Closing Time
                </label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-2">
                Working Days
              </label>
              <div className="flex justify-between gap-1">
                {allDays.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      workingDays.includes(d)
                        ? 'bg-gold-400 text-black border-gold-400'
                        : 'bg-[#181824] text-gray-400 border-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Verification Documents & Compliance */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="w-6 h-6 rounded-full bg-gold-400 text-black font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-heading text-sm font-bold text-white">
                Verification Documents
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Shop License No.
                </label>
                <input
                  type="text"
                  value={tradeLicense}
                  onChange={e => setTradeLicense(e.target.value)}
                  placeholder="e.g. TL-CHE-2024-8841"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Tax / GST / VAT ID
                </label>
                <input
                  type="text"
                  value={taxVat}
                  onChange={e => setTaxVat(e.target.value)}
                  placeholder="e.g. GSTIN33AABCS1429B1Z8"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Dual Upload Cards: Shop License vs Tax / GST / Others */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Shop License Upload */}
              <div
                onClick={() => licenseInputRef.current?.click()}
                className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  tradeLicenseDocUrl
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/15 hover:border-gold-400/40 text-gray-400'
                }`}
              >
                <Upload className="w-5 h-5 mb-1 text-gold-400" />
                <span className="text-xs font-bold">
                  {tradeLicenseDocUrl ? '✓ Shop License Attached' : 'Upload Shop License'}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">
                  PDF, JPG or PNG (Max 15MB)
                </span>
                <input
                  type="file"
                  ref={licenseInputRef}
                  onChange={handleLicenseDoc}
                  accept="application/pdf,image/*"
                  className="hidden"
                />
              </div>

              {/* Tax / GST / Others Upload */}
              <div
                onClick={() => taxInputRef.current?.click()}
                className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  taxDocUrl
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/15 hover:border-blue-400/40 text-gray-400'
                }`}
              >
                <Upload className="w-5 h-5 mb-1 text-blue-400" />
                <span className="text-xs font-bold">
                  {taxDocUrl ? '✓ Tax / GST Attached' : 'Upload Tax / GST / Others'}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">
                  PDF, JPG or PNG (Max 15MB)
                </span>
                <input
                  type="file"
                  ref={taxInputRef}
                  onChange={handleTaxDoc}
                  accept="application/pdf,image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="gold-gradient-btn w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
