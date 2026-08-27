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
    formatBookingDate 
  } = useApp();

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
      // Future dates are always fully open
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
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);

      // 10 minutes buffer so customers cannot book a slot starting in the past or immediately right now
      return now.getTime() + 10 * 60 * 1000 > slotDate.getTime();
    } catch {
      return false;
    }
  };

  const isTodaySelected = selectedDate === dates[0]?.full;
  const passedTodayCount = isTodaySelected ? allSlots.filter(s => isSlotPassed(s, selectedDate)).length : 0;
  const areAllTodaySlotsPassed = isTodaySelected && passedTodayCount === allSlots.length;

  // Automatically select the next available future slot when selecting Today
  useEffect(() => {
    if (isTodaySelected) {
      if (isSlotPassed(selectedTimeSlot, selectedDate)) {
        const nextAvailable = allSlots.find(s => !isSlotPassed(s, selectedDate));
        if (nextAvailable) {
          setSelectedTimeSlot(nextAvailable);
        } else if (dates[1]) {
          // If tonight's slots have all passed, auto switch to tomorrow's first slot
          setSelectedDate(dates[1].full);
          setSelectedTimeSlot(morningSlots[0]);
        }
      }
    }
  }, [selectedDate]);

  const handleInstantLiveWalkin = () => {
    const now = new Date();
    const todayIso = dates[0]?.full || new Date().toISOString().split('T')[0];
    
    // If working hours for today are done (> 8:30 PM), book for tomorrow morning
    if (now.getHours() >= 20 && now.getMinutes() >= 30) {
      if (dates[1]) {
        setSelectedDate(dates[1].full);
        setSelectedTimeSlot(morningSlots[0]);
      }
      return;
    }

    setSelectedDate(todayIso);

    // Calculate nearest 15-minute slot
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15 + 15;
    now.setMinutes(roundedMinutes);
    const instantSlot = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setSelectedTimeSlot(instantSlot);
  };

  return (
    <div className="min-h-full pb-28 bg-[#0A0A0F] text-white flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomerScreen('select_staff')}
              className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Live Date & Time
              </h2>
              <p className="text-[10px] text-gold-400">
                Step 3 of 4 • Real-time slot booking
              </p>
            </div>
          </div>

          {selectedStylist && (
            <div className="flex items-center gap-1.5 bg-[#161622] px-2.5 py-1 rounded-full border border-gold-400/20 text-[10px] text-gray-300">
              <UserCheck className="w-3 h-3 text-gold-400" />
              <span className="truncate max-w-[80px]">{selectedStylist.name}</span>
            </div>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Live Clock & Instant Walk-in Banner */}
          <div className="bg-gradient-to-r from-[#2B2211] via-[#1B1925] to-[#12121A] p-3.5 rounded-2xl border border-gold-400/30 shadow-gold-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Live Salon Time
                  </span>
                </div>
                <span className="font-heading font-extrabold text-sm text-gold-300">
                  {liveCurrentTime || 'Loading...'}
                </span>
              </div>
            </div>

            <button
              onClick={handleInstantLiveWalkin}
              className="gold-gradient-btn px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-md hover:brightness-110"
              title="Book for today within the next 15 minutes"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant (15 mins)</span>
            </button>
          </div>

          {/* If all today's slots have passed */}
          {areAllTodaySlotsPassed && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>All appointment slots for today have ended. Please choose tomorrow or a future date.</span>
            </div>
          )}

          {/* Dynamic 14-Day Calendar Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xs font-bold text-white flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-gold-400" />
                Select Appointment Date
              </h3>
              <span className="text-[10px] text-gold-400 font-bold">
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
                    className={`flex flex-col items-center justify-center min-w-[62px] py-3 rounded-2xl border transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-gold-500 to-gold-400 text-black border-gold-300 font-bold shadow-gold-sm scale-105'
                        : 'bg-[#14141E] text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {d.labelTag && (
                      <span className={`absolute -top-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-black text-gold-400' : 'bg-gold-400 text-black'
                      }`}>
                        {d.labelTag}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-semibold">
                      {d.day}
                    </span>
                    <span className="text-base font-extrabold mt-0.5">
                      {d.date}
                    </span>
                    <span className="text-[9px] opacity-80">
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section with Auto Past-Disabling */}
          <div className="space-y-4 pt-1">
            {/* Morning */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Morning Slots (09:00 AM - 12:00 PM)</span>
                </div>
                {isTodaySelected && (
                  <span className="text-[10px] text-gray-500">Auto-filtered</span>
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
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isPassed
                          ? 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? 'bg-gold-400 text-black border-gold-400 font-extrabold shadow-sm scale-105'
                          : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
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
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
                <div className="flex items-center gap-1.5">
                  <Sunset className="w-3.5 h-3.5 text-gold-400" />
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
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isPassed
                          ? 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? 'bg-gold-400 text-black border-gold-400 font-extrabold shadow-sm scale-105'
                          : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
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
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
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
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isPassed
                          ? 'bg-[#0E0E16] text-gray-600 border-white/5 cursor-not-allowed opacity-35 line-through'
                          : isSelected
                          ? 'bg-gold-400 text-black border-gold-400 font-extrabold shadow-sm scale-105'
                          : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
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

      {/* Floating Bottom Bar showing selected Live Date & Time */}
      <div className="p-4 sticky bottom-0 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/5 z-40">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Selected Slot
            </span>
            <span className="text-xs font-bold text-gold-400 font-heading">
              {formatBookingDate(selectedDate)} at {selectedTimeSlot}
            </span>
          </div>

          <button
            onClick={() => setCustomerScreen('add_ons')}
            className="gold-gradient-btn px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
