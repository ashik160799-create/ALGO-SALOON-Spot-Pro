import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  ArrowRight,
  UserCheck,
  Zap,
  CheckCircle2,
  Sparkles 
} from 'lucide-react';

export const DateTimeScreen: React.FC = () => {
  const { 
    selectedStylist, 
    selectedDate, 
    setSelectedDate, 
    selectedTimeSlot, 
    setSelectedTimeSlot, 
    setCustomerScreen,
    formatBookingDate,
    theme
  } = useApp();

  const isWhite = theme === 'white';

  const [liveCurrentTime, setLiveCurrentTime] = useState<string>('');

  // Ticking live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate 14 dynamic live days starting from Today!
  const generateDynamicLiveDates = () => {
    const datesList = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const isoDate = `${yyyy}-${mm}-${dd}`;

      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      const dateNum = String(d.getDate()).padStart(2, '0');

      let labelTag = '';
      if (i === 0) labelTag = 'Today';
      else if (i === 1) labelTag = 'Tomorrow';

      datesList.push({
        day: dayShort,
        date: dateNum,
        month: monthShort,
        full: isoDate,
        labelTag
      });
    }
    return datesList;
  };

  const dates = generateDynamicLiveDates();

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  const eveningSlots = ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '08:30 PM'];

  const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];

  // Helper to check if a specific time slot has already passed for Today's date
  const isSlotPassed = (slotTimeStr: string, dateIso: string): boolean => {
    const todayIso = dates[0]?.full;
    if (dateIso !== todayIso) {
      return false;
    }

    try {
      const match = slotTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return false;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const now = new Date();
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      // Disable if slot is strictly before now + 15 minutes buffer
      return slotTime.getTime() <= (now.getTime() + 15 * 60 * 1000);
    } catch {
      return false;
    }
  };

  // Check if today is selected and all slots for today have already passed
  const isTodaySelected = selectedDate === dates[0]?.full;
  const areAllTodaySlotsPassed = isTodaySelected && allSlots.every(slot => isSlotPassed(slot, selectedDate));

  // Initialize with a valid non-passed slot
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(dates[0]?.full || '');
    }

    const currentSlotPassed = isSlotPassed(selectedTimeSlot, selectedDate);
    if (currentSlotPassed || !selectedTimeSlot) {
      // Find first available slot
      const firstAvailable = allSlots.find(s => !isSlotPassed(s, selectedDate));
      if (firstAvailable) {
        setSelectedTimeSlot(firstAvailable);
      } else if (isTodaySelected && dates[1]) {
        // If today is completely booked/passed, auto-switch to Tomorrow morning!
        setSelectedDate(dates[1].full);
        setSelectedTimeSlot(morningSlots[0]);
      }
    }
  }, [selectedDate]);

  // Instant 15-min walk-in handler
  const handleInstantLiveWalkin = () => {
    const now = new Date();
    const todayIso = dates[0]?.full;
    
    // Check if salon is still open (before 08:30 PM)
    if (now.getHours() >= 20 && now.getMinutes() > 30) {
      alert('Salon is currently closed for today (open 09:00 AM - 09:00 PM). Booking for tomorrow instead!');
      if (dates[1]) {
        setSelectedDate(dates[1].full);
        setSelectedTimeSlot(morningSlots[0]);
      }
      return;
    }

    setSelectedDate(todayIso || '');

    // Calculate nearest 15-minute slot
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    now.setMinutes(roundedMinutes);
    const instantSlot = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setSelectedTimeSlot(instantSlot);
  };

  return (
    <div className={`min-h-full pb-28 font-body flex flex-col justify-between transition-colors duration-300 ${
      isWhite ? 'bg-[#F8F9FD] text-[#111827]' : 'bg-[#08080C] text-[#F3F4F6]'
    }`}>
      <div>
        {/* Top Header */}
        <div className={`sticky top-0 z-30 backdrop-blur-xl px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${
          isWhite 
            ? 'bg-white/95 border-b border-purple-100 shadow-[0_2px_12px_rgba(126,34,206,0.04)]' 
            : 'bg-[#0A0A10]/95 border-b border-gold-400/15'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('select_staff')}
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
                Live Date & Time
              </h2>
              <p className={`text-[10px] font-bold ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                Step 3 of 4 • Real-time slot booking
              </p>
            </div>
          </div>

          {selectedStylist && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] shadow-sm border ${
              isWhite 
                ? 'bg-purple-50 border-purple-200 text-purple-800' 
                : 'bg-[#14141E] border-gold-400/25 text-gray-300'
            }`}>
              <UserCheck className={`w-3 h-3 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
              <span className="truncate max-w-[80px] font-bold">{selectedStylist.name}</span>
            </div>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Live Clock & Instant Walk-in Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-sm ${
            isWhite 
              ? 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200 shadow-sm' 
              : 'glass-card-gilded border-gold-400/35 shadow-gold-sm'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                isWhite ? 'bg-purple-100 text-purple-700' : 'bg-gold-400/20 text-gold-300'
              }`}>
                <Clock className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isWhite ? 'text-gray-600' : 'text-gray-400'}`}>
                    Live Salon Time
                  </span>
                </div>
                <span className={`font-heading font-black text-sm ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                  {liveCurrentTime || 'Loading...'}
                </span>
              </div>
            </div>

            <button
              onClick={handleInstantLiveWalkin}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 transition-all ${
                isWhite 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                  : 'gold-gradient-btn text-black'
              }`}
              title="Book for today within the next 15 minutes"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant (15 mins)</span>
            </button>
          </div>

          {/* If all today's slots have passed */}
          {areAllTodaySlotsPassed && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-600 dark:text-amber-300 flex items-center gap-2 shadow-sm font-medium">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>All appointment slots for today have ended. Please choose tomorrow or a future date.</span>
            </div>
          )}

          {/* Dynamic 14-Day Calendar Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-heading text-xs font-bold flex items-center gap-1.5 ${isWhite ? 'text-gray-900' : 'text-white'}`}>
                <CalendarIcon className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                Select Appointment Date
              </h3>
              <span className={`text-[10px] font-black ${isWhite ? 'text-purple-700' : 'text-gold-300'}`}>
                {formatBookingDate(selectedDate)}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {dates.map(d => {
                const isSelected = selectedDate === d.full;
                return (
                  <button
                    key={d.full}
                    onClick={() => setSelectedDate(d.full)}
                    className={`flex flex-col items-center justify-center min-w-[62px] py-3 rounded-2xl border transition-all duration-300 relative ${
                      isSelected
                        ? isWhite
                          ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold shadow-md scale-105 ring-2 ring-purple-300 border-transparent'
                          : 'gold-gradient-btn border-gold-300 font-bold shadow-gold-sm scale-105 ring-2 ring-gold-400/40 text-black'
                        : isWhite
                          ? 'bg-white text-gray-700 border-purple-100 hover:border-purple-300 hover:text-purple-700 shadow-sm'
                          : 'bg-[#14141E] text-gray-400 border-white/10 hover:border-gold-400/25 hover:text-gray-200'
                    }`}
                  >
                    {d.labelTag && (
                      <span className={`absolute -top-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-sm ${
                        isSelected 
                          ? isWhite ? 'bg-white text-purple-700' : 'bg-black text-gold-300' 
                          : isWhite ? 'bg-purple-600 text-white' : 'bg-gold-400 text-black'
                      }`}>
                        {d.labelTag}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold">
                      {d.day}
                    </span>
                    <span className="text-base font-black mt-0.5 font-heading">
                      {d.date}
                    </span>
                    <span className="text-[9px] font-medium opacity-85">
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-4 pt-1">
            {/* Morning */}
            <div>
              <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Morning Slots (09:00 AM - 12:00 PM)</span>
                </div>
                {isTodaySelected && (
                  <span className={`text-[10px] font-medium ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Auto-filtered</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map(slot => {
                  const isPassed = isSlotPassed(slot, selectedDate);
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isPassed}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isPassed
                          ? isWhite ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-40 line-through' : 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? isWhite 
                            ? 'bg-purple-600 text-white border-purple-600 font-black shadow-md scale-105' 
                            : 'gold-gradient-btn border-gold-400 font-extrabold shadow-sm scale-105 text-black'
                          : isWhite 
                            ? 'bg-white text-gray-800 border-purple-100 hover:border-purple-300 hover:text-purple-700 shadow-sm' 
                            : 'bg-[#14141E] text-gray-200 border-white/10 hover:border-gold-400/30 hover:text-white'
                      }`}
                      title={isPassed ? `${slot} has already passed for today` : `Book at ${slot}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="flex items-center gap-1.5">
                  <Sunset className={`w-3.5 h-3.5 ${isWhite ? 'text-purple-600' : 'text-gold-400'}`} />
                  <span>Afternoon Slots (12:00 PM - 05:00 PM)</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map(slot => {
                  const isPassed = isSlotPassed(slot, selectedDate);
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isPassed}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isPassed
                          ? isWhite ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-40 line-through' : 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? isWhite 
                            ? 'bg-purple-600 text-white border-purple-600 font-black shadow-md scale-105' 
                            : 'gold-gradient-btn border-gold-400 font-extrabold shadow-sm scale-105 text-black'
                          : isWhite 
                            ? 'bg-white text-gray-800 border-purple-100 hover:border-purple-300 hover:text-purple-700 shadow-sm' 
                            : 'bg-[#14141E] text-gray-200 border-white/10 hover:border-gold-400/30 hover:text-white'
                      }`}
                      title={isPassed ? `${slot} has already passed for today` : `Book at ${slot}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening */}
            <div>
              <div className={`flex items-center justify-between text-xs font-bold mb-2 ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Evening & Night Slots (05:00 PM - 09:00 PM)</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {eveningSlots.map(slot => {
                  const isPassed = isSlotPassed(slot, selectedDate);
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isPassed}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isPassed
                          ? isWhite ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-40 line-through' : 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? isWhite 
                            ? 'bg-purple-600 text-white border-purple-600 font-black shadow-md scale-105' 
                            : 'gold-gradient-btn border-gold-400 font-extrabold shadow-sm scale-105 text-black'
                          : isWhite 
                            ? 'bg-white text-gray-800 border-purple-100 hover:border-purple-300 hover:text-purple-700 shadow-sm' 
                            : 'bg-[#14141E] text-gray-200 border-white/10 hover:border-gold-400/30 hover:text-white'
                      }`}
                      title={isPassed ? `${slot} has already passed for today` : `Book at ${slot}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className={`p-4 sticky bottom-0 backdrop-blur-xl border-t z-40 transition-colors duration-300 ${
        isWhite 
          ? 'bg-white/95 border-purple-100 shadow-[0_-4px_25px_rgba(126,34,206,0.08)]' 
          : 'bg-[#0A0A10]/95 border-gold-400/20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className={`text-[10px] uppercase tracking-widest block font-bold ${
              isWhite ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Selected Slot
            </span>
            <span className={`text-xs font-black font-heading ${
              isWhite ? 'text-purple-700' : 'text-gold-300'
            }`}>
              {formatBookingDate(selectedDate)} at {selectedTimeSlot}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('add_ons')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all ${
              isWhite 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                : 'gold-gradient-btn text-black shadow-gold-sm'
            }`}
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
