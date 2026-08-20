import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useBookingStore } from '../../stores/useBookingStore.ts';

export function AvailabilityCalendar() {
  const { properties, reservations, selectedPropertyId } = useBookingStore();
  const [selectedMonth, setSelectedMonth] = useState(5); // June (0-indexed: 5)
  const [blockedDays, setBlockedDays] = useState<number[]>([18, 19, 24]);

  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = 30; // June has 30 days
  const startDayOffset = 0; // Monday start

  // Check which days have confirmed reservations in this month
  const getDayStatus = (day: number) => {
    const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
    const dateObj = new Date(dateStr);

    const isReserved = reservations.some((res) => {
      if (res.propertyId !== property.id || res.status !== 'CONFIRMED') return false;
      const dIn = new Date(res.checkIn);
      const dOut = new Date(res.checkOut);
      return dateObj >= dIn && dateObj < dOut;
    });

    if (isReserved) return 'CONFIRMED';
    if (blockedDays.includes(day)) return 'BLOCKED';
    return 'AVAILABLE';
  };

  const handleToggleBlock = (day: number) => {
    const status = getDayStatus(day);
    if (status === 'CONFIRMED') return; // Cannot block confirmed booking

    if (blockedDays.includes(day)) {
      setBlockedDays(blockedDays.filter((d) => d !== day));
    } else {
      setBlockedDays([...blockedDays, day]);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#151E32] border border-slate-800 space-y-6 shadow-xl">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-rose-400 font-semibold">
            <CalendarIcon className="w-4 h-4" />
            <span>Interactive Availability Manager</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Booking & Blocked Dates — {property.title}
          </h3>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 bg-[#0A0F1D] border border-slate-700/80 p-1.5 rounded-2xl self-start">
          <button
            onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
            disabled={selectedMonth === 0}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-3">
            {monthNames[selectedMonth]} 2026
          </span>
          <button
            onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
            disabled={selectedMonth === 11}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startDayOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const status = getDayStatus(day);

          return (
            <button
              key={day}
              onClick={() => handleToggleBlock(day)}
              className={`aspect-square rounded-2xl p-2 flex flex-col justify-between items-start border transition-all text-left ${
                status === 'CONFIRMED'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                  : status === 'BLOCKED'
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                  : 'bg-[#0A0F1D] border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/40 text-white'
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
              <span className="text-[10px] font-medium leading-none">
                {status === 'CONFIRMED'
                  ? 'Booked'
                  : status === 'BLOCKED'
                  ? 'Blocked'
                  : `€${property.pricePerNight}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-3.5 h-3.5 rounded-md bg-[#0A0F1D] border border-slate-700" />
          <span>Available (Click to block)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-3.5 h-3.5 rounded-md bg-emerald-500/20 border border-emerald-500/40" />
          <span className="text-emerald-400 font-medium">Confirmed Guest Reservation</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-3.5 h-3.5 rounded-md bg-slate-900 border border-slate-800" />
          <span className="text-slate-400">Blocked / Maintenance</span>
        </div>
      </div>
    </div>
  );
}
