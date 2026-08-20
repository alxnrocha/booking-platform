import { useState } from 'react';
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

export function DateRangePickerPopover({
  checkIn,
  checkOut,
  onSelectDates,
  onClose,
}: DateRangePickerPopoverProps) {
  // Parse initial month from checkIn or default to current date / June 2026
  const initialDate = checkIn ? new Date(checkIn) : new Date(2026, 5, 1);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    isNaN(initialDate.getMonth()) ? 5 : initialDate.getMonth()
  );

  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [tempCheckIn, setTempCheckIn] = useState<string | null>(checkIn || '2026-06-10');
  const [tempCheckOut, setTempCheckOut] = useState<string | null>(checkOut || '2026-06-13');

  // Next Month calculation for side-by-side view
  const nextMonthYear = currentMonthIndex === 11 ? currentYear + 1 : currentYear;
  const nextMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;

  const handlePrevMonth = () => {
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
    const m = (monthIndex + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    const clickedTime = new Date(dateStr).getTime();

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      // Start new selection
      setTempCheckIn(dateStr);
      setTempCheckOut(null);
    } else if (tempCheckIn && !tempCheckOut) {
      const inTime = new Date(tempCheckIn).getTime();
      if (clickedTime < inTime) {
        // If clicked date is before checkIn, make it the new checkIn
        setTempCheckIn(dateStr);
      } else if (clickedTime === inTime) {
        // Same date: 1-night stay next day
        const nextDay = new Date(clickedTime + 24 * 60 * 60 * 1000);
        const nextM = (nextDay.getMonth() + 1).toString().padStart(2, '0');
        const nextD = nextDay.getDate().toString().padStart(2, '0');
        setTempCheckOut(`${nextDay.getFullYear()}-${nextM}-${nextD}`);
      } else {
        // Complete valid range
        setTempCheckOut(dateStr);
      }
    }
  };

  const getDayState = (year: number, monthIndex: number, day: number) => {
    const m = (monthIndex + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    const time = new Date(dateStr).getTime();

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

    return { isStart, isEnd, isInRange, dateStr };
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

  const handlePreset = (monthOffset: number, startDay: number, endDay: number) => {
    const m = (monthOffset + 1).toString().padStart(2, '0');
    const inStr = `2026-${m}-${startDay.toString().padStart(2, '0')}`;
    const outStr = `2026-${m}-${endDay.toString().padStart(2, '0')}`;
    setTempCheckIn(inStr);
    setTempCheckOut(outStr);
    setCurrentMonthIndex(monthOffset);
  };

  // Helper to render a single month calendar block
  const renderMonthBlock = (year: number, monthIndex: number) => {
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    const dayOfWeek = new Date(year, monthIndex, 1).getDay();
    const offset = (dayOfWeek + 6) % 7; // Monday-start

    return (
      <div className="space-y-3">
        <div className="text-center font-bold text-sm text-white py-1">
          {monthNames[monthIndex]} {year}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
          {Array.from({ length: offset }).map((_, idx) => (
            <div key={`offset-${year}-${monthIndex}-${idx}`} className="h-9 w-full" />
          ))}

          {Array.from({ length: daysCount }).map((_, idx) => {
            const day = idx + 1;
            const { isStart, isEnd, isInRange, dateStr } = getDayState(year, monthIndex, day);

            return (
              <button
                key={`day-${year}-${monthIndex}-${day}`}
                onClick={() => handleDayClick(year, monthIndex, day)}
                onMouseEnter={() => setHoverDate(dateStr)}
                className={`h-9 w-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                  isStart
                    ? 'bg-rose-500 text-white font-extrabold rounded-l-full shadow-md shadow-rose-500/30 ring-2 ring-rose-400'
                    : isEnd
                    ? 'bg-rose-500 text-white font-extrabold rounded-r-full shadow-md shadow-rose-500/30 ring-2 ring-rose-400'
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
      </div>
    );
  };

  return (
    <div className="bg-[#151E32] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 text-white max-w-2xl lg:max-w-3xl w-full animate-in zoom-in-95">
      {/* Header & Quick Presets */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Dates</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              {tempCheckIn && tempCheckOut
                ? `${calculateNights()} nights selected (${formatDateRange(tempCheckIn, tempCheckOut)})`
                : tempCheckIn
                ? `Check-in: ${formatDateRange(tempCheckIn, null)} · Select check-out date`
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
          onClick={() => handlePreset(5, 12, 14)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Jun 12 – 14 (Weekend)
        </button>
        <button
          onClick={() => handlePreset(7, 3, 10)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Aug 3 – 10 (1 Week)
        </button>
        <button
          onClick={() => handlePreset(8, 1, 15)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Sep 1 – 15 (2 Weeks)
        </button>
      </div>

      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between px-2 pt-1">
        <button
          onClick={handlePrevMonth}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
          Dual-Month Planner
        </span>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold"
          aria-label="Next month"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dual Month Grids Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Left Month */}
        <div>{renderMonthBlock(currentYear, currentMonthIndex)}</div>

        {/* Right Month */}
        <div>{renderMonthBlock(nextMonthYear, nextMonthIndex)}</div>
      </div>

      {/* Footer Details & Apply Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected Dates</span>
          <span className="font-bold text-rose-400 text-sm">
            {tempCheckIn && tempCheckOut
              ? formatDateRange(tempCheckIn, tempCheckOut)
              : tempCheckIn
              ? `${formatDateRange(tempCheckIn, null)} → Select checkout`
              : 'No dates selected'}
          </span>
        </div>

        <button
          onClick={handleApply}
          disabled={!tempCheckIn}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Dates</span>
        </button>
      </div>
    </div>
  );
}
