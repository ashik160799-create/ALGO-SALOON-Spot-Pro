import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  UserCheck, 
  Star, 
  Award, 
  Trash2, 
  Check, 
  Power,
  Sparkles,
  Camera,
  Upload
} from 'lucide-react';
import { Stylist } from '../../types';
import { SupabaseStorage } from '../../services/supabaseStorageService';
import { getAiStylistAvatar } from '../../utils/aiAvatarHelper';

export const StaffManager: React.FC = () => {
  const { stylists, addStylist, updateStylist, deleteStylist, currentBusinessShop, uploadStylistAvatarItem, setBusinessScreen } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Master Stylist');
  const [experience, setExperience] = useState('5+ Years Exp.');
  const [specialties, setSpecialties] = useState('Hair Cut, Beard Sculpting');
  const [avatar, setAvatar] = useState('');
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      try {
        const shopId = currentBusinessShop.id || 'shop-1';
        const stylistId = 'stylist-' + Date.now();
        const res = await SupabaseStorage.uploadStylistAvatar(shopId, stylistId, file);
        if (res.success && res.publicUrl) {
          setAvatar(res.publicUrl);
          setHasCustomAvatar(true);
        }
      } catch (err) {
        console.warn('Stylist avatar upload failed:', err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleAddStylist = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = (hasCustomAvatar && avatar) ? avatar : getAiStylistAvatar(name, role);

    addStylist({
      shopId: currentBusinessShop.id || 'shop-1',
      name,
      role,
      experience,
      rating: 5.0,
      reviewCount: 1,
      specialties: specialties.split(',').map(s => s.trim()),
      avatar: finalAvatar,
      isAvailable: true
    });
    setShowAddModal(false);
    setName('');
    setAvatar('');
    setHasCustomAvatar(false);
  };

  const toggleAvailability = (stylist: Stylist) => {
    updateStylist({
      ...stylist,
      isAvailable: !stylist.isAvailable
    });
  };

  return (
    <div className="min-h-full pb-24 bg-[#08080C] text-[#F3F4F6] font-body">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A10]/95 backdrop-blur-xl px-4 py-3 border-b border-gold-400/15 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#14141E] border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-300 hover:border-gold-400/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Staff & Stylist Roster
            </h2>
            <p className="text-[10px] text-gold-300 font-semibold">{stylists.length} Active Stylists</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="gold-gradient-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Stylists List */}
      <div className="px-4 pt-4 space-y-3">
        {stylists.length === 0 ? (
          <div className="glass-card-obsidian p-8 rounded-3xl text-center space-y-3 my-4 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400 shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-sm font-bold text-white">No Stylists on Roster</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Add your salon's barbers and stylists with their specialties so customers can pick them during booking.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Stylist</span>
            </button>
          </div>
        ) : (
          stylists.map(stylist => (
            <div
              key={stylist.id}
              className="glass-card-obsidian p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 hover:border-gold-400/40 transition-all shadow-sm"
            >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/40 shrink-0 shadow-sm">
                  <img
                    src={stylist.avatar}
                    alt={stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black shadow-sm ${
                  stylist.isAvailable ? 'bg-emerald-400' : 'bg-gray-500'
                }`} />
              </div>

              <div>
                <h3 className="font-heading text-sm font-bold text-white">
                  {stylist.name}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  {stylist.role}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px]">
                  <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-400/15 px-1.5 py-0.2 rounded shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {stylist.rating} ({stylist.reviewCount})
                  </span>
                  <span className="text-gold-300 font-medium">{stylist.experience}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleAvailability(stylist)}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                  stylist.isAvailable
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                    : 'bg-[#14141E] border-white/10 text-gray-400'
                }`}
                title={stylist.isAvailable ? 'On Duty' : 'Off Duty'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => deleteStylist(stylist.id)}
                className="p-2 rounded-xl bg-[#14141E] border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all shadow-sm"
                title="Remove staff"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>

      {/* Add Stylist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">
                Add Stylist to Shop
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStylist} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Stylist Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Stylist"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Senior Hair Specialist"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="e.g. 7+ Years Exp."
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Stylist Photo Upload */}
              <div>
                <label className="block text-gray-300 mb-1">Stylist Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-400/50 bg-[#161622] shrink-0 relative group">
                    <img src={avatar} alt="Stylist Preview" className="w-full h-full object-cover" />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[8px] text-gold-400 font-bold">
                        ...
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="px-3 py-1.5 rounded-lg bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs font-bold flex items-center gap-1.5 hover:bg-gold-400/25 transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isUploadingAvatar ? 'Uploading Photo...' : 'Upload Photo'}</span>
                    </button>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Stored permanently in Supabase APP.FILES storage
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Specialties</label>
                <input
                  type="text"
                  value={specialties}
                  onChange={e => setSpecialties(e.target.value)}
                  placeholder="Haircut, Fade, Hair Spa, Detan"
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold mt-2 shadow-md"
              >
                Add Stylist to Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
