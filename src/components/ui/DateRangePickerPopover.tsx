import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, Check } from 'lucide-react';
import { formatDateRange } from '../../utils/dateFormatters.ts';

interface DateRangePickerPopoverProps {
  checkIn: string | null;
  checkOut: string | null;
  onSelectDates: (checkIn: string | null, checkOut: string | null) => void;
  onClose: () => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const toDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function DateRangePickerPopover({
  checkIn,
  checkOut,
  onSelectDates,
  onClose,
}: DateRangePickerPopoverProps) {
  // Normalize today at midnight
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Determine starting month from checkIn or current live date
  const initialDate = useMemo(() => {
    if (checkIn) {
      const parsed = new Date(checkIn);
      if (!isNaN(parsed.getTime()) && parsed >= today) {
        return parsed;
      }
    }
    return today;
  }, [checkIn, today]);

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(initialDate.getMonth());

  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [tempCheckIn, setTempCheckIn] = useState<string | null>(checkIn || toDateString(today));
  const [tempCheckOut, setTempCheckOut] = useState<string | null>(() => {
    if (checkOut) return checkOut;
    const defaultOut = new Date(today);
    defaultOut.setDate(today.getDate() + 3);
    return toDateString(defaultOut);
  });

  // Next Month calculation for side-by-side view
  const nextMonthYear = currentMonthIndex === 11 ? currentYear + 1 : currentYear;
  const nextMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;

  // Prevent going back to past months
  const isPastMonth =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonthIndex <= today.getMonth());

  const handlePrevMonth = () => {
    if (isPastMonth) return;
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handleDayClick = (year: number, monthIndex: number, day: number) => {
    const clickedDate = new Date(year, monthIndex, day);
    clickedDate.setHours(0, 0, 0, 0);

    // Guard: ignore past days
    if (clickedDate.getTime() < today.getTime()) {
      return;
    }

    const dateStr = toDateString(clickedDate);
    const clickedTime = clickedDate.getTime();

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      // Start new range
      setTempCheckIn(dateStr);
      setTempCheckOut(null);
    } else if (tempCheckIn && !tempCheckOut) {
      const inTime = new Date(tempCheckIn).getTime();
      if (clickedTime < inTime) {
        // If clicked date is earlier, make it the new check-in
        setTempCheckIn(dateStr);
      } else if (clickedTime === inTime) {
        // Same date: 1-night stay
        const nextDay = new Date(clickedTime + 24 * 60 * 60 * 1000);
        setTempCheckOut(toDateString(nextDay));
      } else {
        // Valid check-out date
        setTempCheckOut(dateStr);
      }
    }
  };

  const getDayState = (year: number, monthIndex: number, day: number) => {
    const dayDate = new Date(year, monthIndex, day);
    dayDate.setHours(0, 0, 0, 0);
    const time = dayDate.getTime();

    const isPast = time < today.getTime();
    const isToday = time === today.getTime();
    const dateStr = toDateString(dayDate);

    const isStart = tempCheckIn === dateStr;
    const isEnd = tempCheckOut === dateStr;

    let isInRange = false;
    if (tempCheckIn && tempCheckOut) {
      const inTime = new Date(tempCheckIn).getTime();
      const outTime = new Date(tempCheckOut).getTime();
      isInRange = time > inTime && time < outTime;
    } else if (tempCheckIn && !tempCheckOut && hoverDate) {
      const inTime = new Date(tempCheckIn).getTime();
      const hTime = new Date(hoverDate).getTime();
      isInRange = time > inTime && time <= hTime;
    }

    return { isPast, isToday, isStart, isEnd, isInRange, dateStr };
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

  // Dynamic presets relative to today
  const applyPreset = (type: 'weekend' | 'week' | 'two-weeks') => {
    const start = new Date(today);
    const end = new Date(today);

    if (type === 'weekend') {
      // Find upcoming Friday
      const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
      start.setDate(today.getDate() + daysUntilFriday);
      end.setDate(start.getDate() + 2); // Friday to Sunday
    } else if (type === 'week') {
      end.setDate(start.getDate() + 7);
    } else if (type === 'two-weeks') {
      end.setDate(start.getDate() + 14);
    }

    setTempCheckIn(toDateString(start));
    setTempCheckOut(toDateString(end));
    setCurrentYear(start.getFullYear());
    setCurrentMonthIndex(start.getMonth());
  };

  // Helper to render a single month calendar block
  const renderMonthBlock = (year: number, monthIndex: number) => {
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    const dayOfWeek = new Date(year, monthIndex, 1).getDay();
    const offset = (dayOfWeek + 6) % 7; // Monday-start

    return (
      <div className="space-y-2.5">
        <div className="text-center font-bold text-sm text-white py-0.5">
          {monthNames[monthIndex]} {year}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
          {Array.from({ length: offset }).map((_, idx) => (
            <div key={`offset-${year}-${monthIndex}-${idx}`} className="h-8 sm:h-9 w-full" />
          ))}

          {Array.from({ length: daysCount }).map((_, idx) => {
            const day = idx + 1;
            const { isPast, isToday, isStart, isEnd, isInRange, dateStr } = getDayState(
              year,
              monthIndex,
              day
            );

            if (isPast) {
              return (
                <div
                  key={`day-${year}-${monthIndex}-${day}`}
                  className="h-8 sm:h-9 w-full flex items-center justify-center text-xs font-semibold text-slate-600 bg-slate-900/30 opacity-30 cursor-not-allowed select-none rounded-full"
                  title="Past date"
                >
                  {day}
                </div>
              );
            }

            return (
              <button
                key={`day-${year}-${monthIndex}-${day}`}
                onClick={() => handleDayClick(year, monthIndex, day)}
                onMouseEnter={() => setHoverDate(dateStr)}
                className={`h-8 sm:h-9 w-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer relative ${
                  isStart
                    ? 'bg-rose-500 text-white font-extrabold rounded-l-full shadow-md shadow-rose-500/30 ring-2 ring-rose-400 z-10'
                    : isEnd
                    ? 'bg-rose-500 text-white font-extrabold rounded-r-full shadow-md shadow-rose-500/30 ring-2 ring-rose-400 z-10'
                    : isInRange
                    ? 'bg-rose-500/20 text-rose-200'
                    : isToday
                    ? 'border border-rose-500/60 text-white font-bold rounded-full hover:bg-slate-800'
                    : 'hover:bg-slate-800 text-slate-200 hover:text-white rounded-full'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#151E32] border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 text-white max-w-lg md:max-w-2xl lg:max-w-3xl w-full max-h-[90dvh] overflow-y-auto animate-in zoom-in-95 relative z-[101]">
      {/* Header & Quick Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 flex-shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Dates</h4>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {tempCheckIn && tempCheckOut
                ? `${calculateNights()} nights (${formatDateRange(tempCheckIn, tempCheckOut)})`
                : tempCheckIn
                ? `In: ${formatDateRange(tempCheckIn, null)} · Select out`
                : 'Select check-in date'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Dynamic Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => applyPreset('weekend')}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Next Weekend (2n)
        </button>
        <button
          onClick={() => applyPreset('week')}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          1 Week (7n)
        </button>
        <button
          onClick={() => applyPreset('two-weeks')}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          2 Weeks (14n)
        </button>
      </div>

      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handlePrevMonth}
          disabled={isPastMonth}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isPastMonth
              ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer active:scale-95'
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:inline">
          Dual-Month Planner
        </span>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold active:scale-95"
          aria-label="Next month"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Single Month on Mobile, Dual Month on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Primary Month (Visible on all screens) */}
        <div>{renderMonthBlock(currentYear, currentMonthIndex)}</div>

        {/* Second Month (Visible on md+ screens) */}
        <div className="hidden md:block">{renderMonthBlock(nextMonthYear, nextMonthIndex)}</div>
      </div>

      {/* Footer Details & Apply Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected</span>
          <span className="font-bold text-rose-400 text-xs sm:text-sm">
            {tempCheckIn && tempCheckOut
              ? formatDateRange(tempCheckIn, tempCheckOut)
              : tempCheckIn
              ? `${formatDateRange(tempCheckIn, null)} → Select`
              : 'No dates'}
          </span>
        </div>

        <button
          onClick={handleApply}
          disabled={!tempCheckIn}
          className="flex items-center gap-1.5 px-5 sm:px-6 py-2 bg-rose-500 hover:bg-rose-600 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Dates</span>
        </button>
      </div>
    </div>
  );
}
