import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, Check } from 'lucide-react';

interface DateRangePickerPopoverProps {
  checkIn: string | null;
  checkOut: string | null;
  onSelectDates: (checkIn: string | null, checkOut: string | null) => void;
  onClose: () => void;
}

export function DateRangePickerPopover({
  checkIn,
  checkOut,
  onSelectDates,
  onClose,
}: DateRangePickerPopoverProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5); // June 2026
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [tempCheckIn, setTempCheckIn] = useState<string | null>(checkIn || '2026-06-10');
  const [tempCheckOut, setTempCheckOut] = useState<string | null>(checkOut || '2026-06-13');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = 30; // June 2026

  const handleDayClick = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-06-${formattedDay}`;

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      // Start new selection with Check-In
      setTempCheckIn(dateStr);
      setTempCheckOut(null);
    } else if (tempCheckIn && !tempCheckOut) {
      if (new Date(dateStr) < new Date(tempCheckIn)) {
        // If clicked day is before current checkIn, make it the new checkIn
        setTempCheckIn(dateStr);
      } else {
        // Complete range with Check-Out
        setTempCheckOut(dateStr);
      }
    }
  };

  const getDayState = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-06-${formattedDay}`;

    const isStart = tempCheckIn === dateStr;
    const isEnd = tempCheckOut === dateStr;

    let isInRange = false;
    if (tempCheckIn && tempCheckOut) {
      isInRange = new Date(dateStr) > new Date(tempCheckIn) && new Date(dateStr) < new Date(tempCheckOut);
    } else if (tempCheckIn && !tempCheckOut && hoverDate) {
      isInRange = new Date(dateStr) > new Date(tempCheckIn) && new Date(dateStr) <= new Date(hoverDate);
    }

    return { isStart, isEnd, isInRange };
  };

  const calculateNights = () => {
    if (!tempCheckIn || !tempCheckOut) return 0;
    const d1 = new Date(tempCheckIn);
    const d2 = new Date(tempCheckOut);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleApply = () => {
    onSelectDates(tempCheckIn, tempCheckOut);
    onClose();
  };

  const handleClear = () => {
    setTempCheckIn(null);
    setTempCheckOut(null);
    onSelectDates(null, null);
  };

  const handlePreset = (startDay: number, endDay: number) => {
    const inStr = `2026-06-${startDay < 10 ? '0' + startDay : startDay}`;
    const outStr = `2026-06-${endDay < 10 ? '0' + endDay : endDay}`;
    setTempCheckIn(inStr);
    setTempCheckOut(outStr);
  };

  return (
    <div className="bg-[#151E32] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-white max-w-md w-full animate-in zoom-in-95">
      {/* Header & Preset tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Dates</h4>
            <p className="text-[11px] text-slate-400">
              {tempCheckIn && tempCheckOut
                ? `${calculateNights()} nights selected`
                : tempCheckIn
                ? 'Now select check-out date'
                : 'Select check-in date'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => handlePreset(12, 14)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Weekend (Jun 12-14)
        </button>
        <button
          onClick={() => handlePreset(10, 17)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          1 Week (Jun 10-17)
        </button>
        <button
          onClick={() => handlePreset(5, 19)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          2 Weeks (Jun 5-19)
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))}
          disabled={currentMonthIndex === 0}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-bold text-white">
          {monthNames[currentMonthIndex]} 2026
        </span>

        <button
          onClick={() => setCurrentMonthIndex(Math.min(11, currentMonthIndex + 1))}
          disabled={currentMonthIndex === 11}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const { isStart, isEnd, isInRange } = getDayState(day);
          const formattedDay = day < 10 ? `0${day}` : `${day}`;
          const dateStr = `2026-06-${formattedDay}`;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHoverDate(dateStr)}
              className={`h-9 w-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                isStart
                  ? 'bg-rose-500 text-white font-extrabold rounded-l-full shadow-md shadow-rose-500/30'
                  : isEnd
                  ? 'bg-rose-500 text-white font-extrabold rounded-r-full shadow-md shadow-rose-500/30'
                  : isInRange
                  ? 'bg-rose-500/20 text-rose-200'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white rounded-full'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Footer Details & Apply Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected Span</span>
          <span className="font-bold text-white">
            {tempCheckIn ? tempCheckIn : '—'} → {tempCheckOut ? tempCheckOut : '—'}
          </span>
        </div>

        <button
          onClick={handleApply}
          disabled={!tempCheckIn}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Dates</span>
        </button>
      </div>
    </div>
  );
}
