import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supportedCountries, getCountryByCode } from '../../data/mockData';
import { parseCoordinatesFromMapUrl, resolveCountryFromCoordinates } from '../../utils/geoUtils';
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
  ExternalLink,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegisterShopScreen: React.FC = () => {
  const { registerShop, setBusinessScreen, setMode, userLocation, supabaseSession, customer, theme } = useApp();
  const isWhite = theme === 'white';

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState(supabaseSession?.user?.user_metadata?.full_name || customer.name || '');
  const [phone, setPhone] = useState(supabaseSession?.user?.user_metadata?.phone || customer.phone || '');
  const [email, setEmail] = useState(supabaseSession?.user?.email || customer.email || '');
  const [address, setAddress] = useState(userLocation || '');
  const [city, setCity] = useState('Dubai');
  const [selectedCountryCode, setSelectedCountryCode] = useState('AE');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [customLat, setCustomLat] = useState<number | undefined>(undefined);
  const [customLng, setCustomLng] = useState<number | undefined>(undefined);
  const [detectedGeoBadge, setDetectedGeoBadge] = useState<string | null>(null);

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

  const handleGoogleMapsUrlChange = (val: string) => {
    setGoogleMapsUrl(val);
    if (!val.trim()) {
      setDetectedGeoBadge(null);
      setCustomLat(undefined);
      setCustomLng(undefined);
      return;
    }
    const parsed = parseCoordinatesFromMapUrl(val);
    if (parsed) {
      setCustomLat(parsed.latitude);
      setCustomLng(parsed.longitude);
      const resolved = resolveCountryFromCoordinates(parsed.latitude, parsed.longitude);
      setSelectedCountryCode(resolved.code);
      setDetectedGeoBadge(`📍 GPS Point Extracted: ${parsed.latitude.toFixed(4)}, ${parsed.longitude.toFixed(4)} (${resolved.name} • ${resolved.currencyCode})`);
    } else {
      setDetectedGeoBadge(null);
    }
  };

  const handleFetchCurrentGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCustomLat(lat);
          setCustomLng(lng);
          const resolved = resolveCountryFromCoordinates(lat, lng);
          setSelectedCountryCode(resolved.code);
          const url = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
          setGoogleMapsUrl(url);
          setDetectedGeoBadge(`📍 GPS Coordinates Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)} (${resolved.name} • ${resolved.currencyCode})`);
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

    const countryObj = getCountryByCode(selectedCountryCode);
    const finalLat = customLat ?? countryObj.defaultLat;
    const finalLng = customLng ?? countryObj.defaultLng;
    const finalMapsUrl = googleMapsUrl || (address ? `https://maps.google.com/?q=${finalLat.toFixed(6)},${finalLng.toFixed(6)}` : '');

    registerShop({
      name: shopName.trim() || 'New Salon Branch',
      ownerName: ownerName.trim() || 'Owner',
      phone: phone.trim(),
      email: email.trim(),
      address: `${address}${city ? ', ' + city : ''}`,
      city: city.trim() || countryObj.defaultCity,
      country: countryObj.name,
      countryCode: countryObj.code,
      currency: countryObj.currencyCode,
      currencySymbol: countryObj.currencySymbol,
      phoneCountryCode: countryObj.phoneCountryCode,
      latitude: finalLat,
      longitude: finalLng,
      googleMapsUrl: finalMapsUrl,
      businessType: selectedTypes as any,
      staffCount: Number(staffCount) || 3,
      openingTime,
      closingTime,
      workingDays,
      tradeLicenseNo: tradeLicense.trim(),
      taxVatNo: taxVat.trim(),
      tradeLicenseDocumentUrl: tradeLicenseDocUrl,
      taxVatDocumentUrl: taxDocUrl,
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
    <div className={`min-h-full pb-24 font-body overflow-y-auto transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      {/* Header Bar */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
        isWhite
          ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]'
          : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWhite 
                ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' 
                : 'bg-[#14141E] border border-white/10 text-gray-300 hover:text-gold-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest font-heading block ${
              isWhite ? 'text-purple-700' : 'text-gold-300'
            }`}>
              Business Partner Portal
            </span>
            <h2 className={`font-heading text-base font-black ${
              isWhite ? 'text-gray-900' : 'text-white'
            }`}>
              Register Your Shop
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            setMode('customer');
          }}
          className={`text-xs font-bold transition-colors ${
            isWhite ? 'text-purple-700 hover:text-purple-900' : 'text-gray-400 hover:text-gold-300'
          }`}
        >
          Customer App
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* Brand Banner */}
        <div className="text-center py-2">
          <div className={`w-12 h-12 rounded-2xl p-0.5 mx-auto mb-2 shadow-sm ${
            isWhite ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500' : 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-sm'
          }`}>
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isWhite ? 'bg-white text-purple-700' : 'bg-[#0E0E16] text-gold-400'
            }`}>
              <Scissors className="w-6 h-6" />
            </div>
          </div>
          <h1 className={`font-heading text-lg font-black ${isWhite ? 'text-gray-900' : 'text-white'}`}>
            ALGO Salon Business Management
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
            Join the premier network of salons & accept appointments online
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* 1. Shop Information */}
          <div className={`p-4 rounded-3xl border space-y-3.5 shadow-sm ${
            isWhite 
              ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' 
              : 'glass-card-obsidian border-white/10'
          }`}>
            <div className={`flex items-center gap-2 pb-2 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
              <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-sm font-heading ${
                isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
              }`}>
                1
              </div>
              <h3 className={`font-heading text-sm font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Shop Information
              </h3>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                Shop / Salon Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="e.g. ALGO Luxe Salon"
                required
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all ${
                  isWhite 
                    ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                    : 'bg-[#14141E] border border-white/10 text-white placeholder-gray-500 focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Owner / Manager Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="Owner name"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500 focus:border-gold-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500 focus:border-gold-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all ${
                  isWhite 
                    ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                    : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500 focus:border-gold-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                Shop Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Street address & locality"
                required
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all ${
                  isWhite 
                    ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                    : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500 focus:border-gold-400'
                }`}
              />
            </div>

            {/* Google Maps URL Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-[11px] font-bold flex items-center gap-1 ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                  <Navigation className="w-3 h-3 text-current" />
                  <span>Google Maps Location URL</span>
                </label>
                <button
                  type="button"
                  onClick={handleFetchCurrentGps}
                  className={`text-[10px] hover:underline font-bold ${isWhite ? 'text-purple-700' : 'text-gold-400'}`}
                >
                  📍 Use My GPS
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={e => handleGoogleMapsUrlChange(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className={`w-full rounded-xl pl-3.5 pr-20 py-2.5 text-xs outline-none transition-all ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500 focus:border-gold-400'
                  }`}
                />
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`absolute right-2 px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 border ${
                      isWhite 
                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' 
                        : 'bg-gold-400/10 text-gold-300 hover:bg-gold-400/20 border-gold-400/30'
                    }`}
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {detectedGeoBadge && (
                <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
                  <span>{detectedGeoBadge}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Dubai"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] focus:border-gold-400 text-white placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Country & Settlement Currency
                </label>
                <select
                  value={selectedCountryCode}
                  onChange={e => {
                    setSelectedCountryCode(e.target.value);
                    const selected = getCountryByCode(e.target.value);
                    if (selected && !city) {
                      setCity(selected.defaultCity);
                    }
                  }}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-colors cursor-pointer ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] focus:border-gold-400 text-white'
                  }`}
                >
                  {supportedCountries.map(c => (
                    <option key={c.code} value={c.code} className={isWhite ? 'bg-white text-gray-900' : 'bg-[#181824] text-white'}>
                      {c.flag} {c.name} ({c.currencyCode} - {c.phoneCountryCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Operations & Timings */}
          <div className={`p-4 rounded-3xl border space-y-3.5 shadow-sm ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card border-white/10'
          }`}>
            <div className={`flex items-center gap-2 pb-2 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
              <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-sm font-heading ${
                isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
              }`}>
                2
              </div>
              <h3 className={`font-heading text-sm font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Operations & Working Hours
              </h3>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-2 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                Business Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTypes.includes(t)
                        ? isWhite 
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-gold-400 text-black border-gold-400 shadow-sm'
                        : isWhite
                          ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          : 'bg-[#181824] text-gray-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Opening Time
                </label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 focus:border-purple-500 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Closing Time
                </label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 focus:border-purple-500 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-2 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
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
                        ? isWhite 
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-gold-400 text-black border-gold-400'
                        : isWhite
                          ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
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
          <div className={`p-4 rounded-3xl border space-y-3.5 shadow-sm ${
            isWhite ? 'bg-white border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.06)]' : 'glass-card border-white/10'
          }`}>
            <div className={`flex items-center gap-2 pb-2 border-b ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
              <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-sm font-heading ${
                isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
              }`}>
                3
              </div>
              <h3 className={`font-heading text-sm font-bold ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                Verification Documents
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Shop License No.
                </label>
                <input
                  type="text"
                  value={tradeLicense}
                  onChange={e => setTradeLicense(e.target.value)}
                  placeholder="e.g. TL-CHE-2024-8841"
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isWhite ? 'text-gray-800' : 'text-gray-200'}`}>
                  Tax / GST / VAT ID
                </label>
                <input
                  type="text"
                  value={taxVat}
                  onChange={e => setTaxVat(e.target.value)}
                  placeholder="e.g. GSTIN33AABCS1429B1Z8"
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${
                    isWhite 
                      ? 'bg-white border border-[#EDE9FE] text-gray-900 placeholder-gray-400 shadow-sm' 
                      : 'bg-[#181824] border border-[#2B2B3E] text-white placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Dual Upload Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => licenseInputRef.current?.click()}
                className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  tradeLicenseDocUrl
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                    : isWhite
                      ? 'border-purple-200 hover:border-purple-400 bg-purple-50/50 text-gray-700'
                      : 'border-white/15 hover:border-gold-400/40 text-gray-400'
                }`}
              >
                <Upload className={`w-5 h-5 mb-1 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
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

              <div
                onClick={() => taxInputRef.current?.click()}
                className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                  taxDocUrl
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                    : isWhite
                      ? 'border-blue-200 hover:border-blue-400 bg-blue-50/50 text-gray-700'
                      : 'border-white/15 hover:border-blue-400/40 text-gray-400'
                }`}
              >
                <Upload className="w-5 h-5 mb-1 text-blue-500" />
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
            className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all ${
              isWhite 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                : 'gold-gradient-btn shadow-gold-md text-black'
            }`}
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
