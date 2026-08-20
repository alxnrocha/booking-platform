import { useState } from 'react';
import { X, Search, Calendar, Users, MapPin } from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { formatDateRange } from '../../utils/dateFormatters.ts';
import { DateRangePickerPopover } from '../ui/DateRangePickerPopover.tsx';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const { destination, setDestination, guests, setGuests, checkIn, checkOut, setDates } = useFilterStore();
  const { currentView, setCurrentView } = useBookingStore();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (currentView !== 'marketplace') {
      setCurrentView('marketplace');
    }
    onClose();
  };

  const handleSelectQuickDest = (dest: string) => {
    setDestination(dest);
    setIsCalendarOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0A0F1D] flex flex-col animate-in fade-in duration-200 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-white">Find Your Stay</span>
        <div className="w-9" />
      </div>

      {/* Main Accordion Search Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. Destination Section */}
        <div className="bg-[#151E32] border border-slate-700/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white">Where to?</h3>
            </div>
            {destination && (
              <span className="text-xs font-semibold text-rose-400 truncate max-w-[120px]">
                {destination}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search destinations (e.g. Amalfi, Bali)"
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Destinations
            </span>
            <div className="flex flex-wrap gap-2">
              {['Amalfi Coast', 'Costa Brava', 'Malibu', 'Santorini', 'Bali', 'Tulum', 'Dubai'].map(
                (dest) => (
                  <button
                    key={dest}
                    onClick={() => handleSelectQuickDest(dest)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {dest}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* 2. Dates Section */}
        <div className="bg-[#151E32] border border-slate-700/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white">When?</h3>
            </div>
            <span className="text-xs font-bold text-rose-400">
              {formatDateRange(checkIn, checkOut)}
            </span>
          </div>

          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full py-3 px-4 rounded-2xl bg-[#0A0F1D] border border-slate-700 hover:border-slate-600 text-left text-xs font-medium text-slate-300 flex items-center justify-between cursor-pointer"
          >
            <span>{checkIn && checkOut ? `${checkIn} to ${checkOut}` : 'Select check-in & check-out dates'}</span>
            <span className="text-rose-400 font-bold">{isCalendarOpen ? 'Close Calendar' : 'Open Calendar'}</span>
          </button>

          {isCalendarOpen && (
            <div className="pt-2">
              <DateRangePickerPopover
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectDates={(inDate, outDate) => {
                  setDates(inDate, outDate);
                  if (inDate && outDate) {
                    setIsCalendarOpen(false);
                  }
                }}
                onClose={() => setIsCalendarOpen(false)}
              />
            </div>
          )}
        </div>

        {/* 3. Guests Section */}
        <div className="bg-[#151E32] border border-slate-700/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white">Who?</h3>
            </div>
            <span className="text-xs font-bold text-white">
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#0A0F1D] border border-slate-700 rounded-2xl p-3">
            <span className="text-xs text-slate-300">Total number of travelers</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                className="w-8 h-8 rounded-full border border-slate-700 text-white disabled:opacity-30 flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-bold text-white">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(16, guests + 1))}
                className="w-8 h-8 rounded-full border border-slate-700 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 border-t border-slate-800 bg-[#0A0F1D] flex items-center justify-between gap-4">
        <button
          onClick={() => {
            setDestination('');
            setDates(null, null);
            setGuests(1);
          }}
          className="text-xs font-bold text-slate-400 underline cursor-pointer"
        >
          Clear all
        </button>

        <button
          onClick={handleSearch}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/30 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Search Stays</span>
        </button>
      </div>
    </div>
  );
}
