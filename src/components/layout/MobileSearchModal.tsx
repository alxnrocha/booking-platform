import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { formatDateRange } from '../../utils/dateFormatters.ts';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AccordionSection = 'where' | 'when' | 'who';

interface RegionItem {
  id: string;
  name: string;
  country: string;
  image: string;
}

const popularRegions: RegionItem[] = [
  {
    id: 'anywhere',
    name: "I'm flexible",
    country: 'Explore world',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'costa_brava',
    name: 'Costa Brava',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tulum',
    name: 'Tulum',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=300&q=80',
  },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const { destination, setDestination, guests, setGuests, checkIn, checkOut, setDates } = useFilterStore();
  const { currentView, setCurrentView } = useBookingStore();

  const [activeSection, setActiveSection] = useState<AccordionSection>('where');

  // Granular guest counts
  const [adults, setAdults] = useState(Math.max(1, guests));
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Calendar State
  const initialDate = checkIn ? new Date(checkIn) : new Date(2026, 5, 1);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    isNaN(initialDate.getMonth()) ? 5 : initialDate.getMonth()
  );
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [tempCheckIn, setTempCheckIn] = useState<string | null>(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState<string | null>(checkOut);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  const buildDateString = (day: number) => {
    const m = (currentMonthIndex + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const handleDayClick = (day: number) => {
    const dateStr = buildDateString(day);
    const clickedTime = new Date(dateStr).getTime();

    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      setTempCheckIn(dateStr);
      setTempCheckOut(null);
    } else if (tempCheckIn && !tempCheckOut) {
      const inTime = new Date(tempCheckIn).getTime();
      if (clickedTime < inTime) {
        setTempCheckIn(dateStr);
      } else if (clickedTime === inTime) {
        const nextDay = new Date(clickedTime + 24 * 60 * 60 * 1000);
        const nextM = (nextDay.getMonth() + 1).toString().padStart(2, '0');
        const nextD = nextDay.getDate().toString().padStart(2, '0');
        setTempCheckOut(`${nextDay.getFullYear()}-${nextM}-${nextD}`);
      } else {
        setTempCheckOut(dateStr);
      }
    }
  };

  const getDayState = (day: number) => {
    const dateStr = buildDateString(day);
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

    return { isStart, isEnd, isInRange };
  };

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const dayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startDayOffset = (dayOfWeek + 6) % 7; // Monday-start

  const handleSelectRegion = (region: RegionItem) => {
    if (region.id === 'anywhere') {
      setDestination('');
    } else {
      setDestination(region.name);
    }
    setActiveSection('when');
  };

  const handleClearAll = () => {
    setDestination('');
    setTempCheckIn(null);
    setTempCheckOut(null);
    setDates(null, null);
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setPets(0);
    setGuests(1);
  };

  const handleFinalSearch = () => {
    setDates(tempCheckIn, tempCheckOut);
    const totalGuests = adults + children;
    setGuests(Math.max(1, totalGuests));
    if (currentView !== 'marketplace') {
      setCurrentView('marketplace');
    }
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 w-full h-[100dvh] z-[99999] bg-[#070B14] text-white flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#070B14] flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg"
          aria-label="Close search modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab pills */}
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-white border-b-2 border-rose-500 pb-1 cursor-pointer">
            Stays
          </button>
          <button className="text-sm font-semibold text-slate-400 hover:text-slate-200 pb-1 cursor-pointer">
            Experiences
          </button>
        </div>

        <div className="w-9" />
      </div>

      {/* 2. SCROLLABLE ACCORDION BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-none pb-28">
        {/* CARD 1: WHERE TO? */}
        <div className="bg-[#121929] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl transition-all">
          {activeSection !== 'where' ? (
            /* Collapsed View */
            <button
              onClick={() => setActiveSection('where')}
              className="w-full p-4 px-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Where</span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[180px]">
                {destination || "I'm flexible"}
              </span>
            </button>
          ) : (
            /* Expanded View */
            <div className="p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-white tracking-tight">Where to?</h3>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded uppercase">
                  Step 1
                </span>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations (e.g. Amalfi, Bali)"
                  className="w-full bg-[#070B14] border border-slate-700 rounded-2xl pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                  autoFocus
                />
                {destination && (
                  <button
                    onClick={() => setDestination('')}
                    className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Search by Region
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {popularRegions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleSelectRegion(region)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-[#070B14] border border-slate-800 hover:border-rose-500/60 hover:scale-[1.02] transition-all text-center cursor-pointer group"
                    >
                      <img
                        src={region.image}
                        alt={region.name}
                        className="w-full aspect-square rounded-xl object-cover group-hover:ring-2 group-hover:ring-rose-500/50"
                      />
                      <span className="text-[11px] font-bold text-slate-200 line-clamp-1">
                        {region.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: WHEN'S YOUR TRIP? */}
        <div className="bg-[#121929] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl transition-all">
          {activeSection !== 'when' ? (
            /* Collapsed View */
            <button
              onClick={() => setActiveSection('when')}
              className="w-full p-4 px-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">When</span>
              </div>
              <span className="text-xs font-bold text-white">
                {tempCheckIn ? formatDateRange(tempCheckIn, tempCheckOut) : 'Add dates'}
              </span>
            </button>
          ) : (
            /* Expanded View */
            <div className="p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">When's your trip?</h3>
                  <p className="text-xs text-slate-400">
                    {tempCheckIn && tempCheckOut
                      ? formatDateRange(tempCheckIn, tempCheckOut)
                      : tempCheckIn
                      ? 'Select checkout date'
                      : 'Choose check-in date'}
                  </p>
                </div>
                {tempCheckIn && (
                  <button
                    onClick={() => {
                      setTempCheckIn(null);
                      setTempCheckOut(null);
                    }}
                    className="text-xs text-rose-400 font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between px-1 bg-[#070B14] border border-slate-700/80 rounded-2xl p-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-bold text-white">
                  {monthNames[currentMonthIndex]} {currentYear}
                </span>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`offset-mob-${idx}`} className="h-9 w-full" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const { isStart, isEnd, isInRange } = getDayState(day);
                  const dateStr = buildDateString(day);

                  return (
                    <button
                      key={`mob-day-${day}`}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => setHoverDate(dateStr)}
                      className={`h-9 w-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                        isStart
                          ? 'bg-rose-500 text-white font-extrabold rounded-l-full shadow-md shadow-rose-500/40 ring-2 ring-rose-400'
                          : isEnd
                          ? 'bg-rose-500 text-white font-extrabold rounded-r-full shadow-md shadow-rose-500/40 ring-2 ring-rose-400'
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

              {/* Next Step Trigger */}
              <button
                onClick={() => setActiveSection('who')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer text-center"
              >
                Next: Guests
              </button>
            </div>
          )}
        </div>

        {/* CARD 3: WHO'S COMING? */}
        <div className="bg-[#121929] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl transition-all">
          {activeSection !== 'who' ? (
            /* Collapsed View */
            <button
              onClick={() => setActiveSection('who')}
              className="w-full p-4 px-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Who</span>
              </div>
              <span className="text-xs font-bold text-white">
                {adults + children} {adults + children === 1 ? 'guest' : 'guests'}
                {infants > 0 ? `, ${infants} infant` : ''}
              </span>
            </button>
          ) : (
            /* Expanded View with Steppers */
            <div className="p-5 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Who's coming?</h3>

              {/* 1. Adults */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">Adults</div>
                  <div className="text-xs text-slate-400">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{adults}</span>
                  <button
                    onClick={() => setAdults(Math.min(16, adults + 1))}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. Children */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">Children</div>
                  <div className="text-xs text-slate-400">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{children}</span>
                  <button
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3. Infants */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">Infants</div>
                  <div className="text-xs text-slate-400">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    disabled={infants <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{infants}</span>
                  <button
                    onClick={() => setInfants(Math.min(5, infants + 1))}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4. Pets */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-bold text-white">Pets</div>
                  <div className="text-xs text-slate-400">Bringing a service animal?</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPets(Math.max(0, pets - 1))}
                    disabled={pets <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{pets}</span>
                  <button
                    onClick={() => setPets(Math.min(3, pets + 1))}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. SOLID BOTTOM STICKY ACTION BAR */}
      <div className="flex-shrink-0 p-4 px-6 border-t border-slate-800 bg-[#070B14] flex items-center justify-between gap-4 shadow-2xl">
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer py-2 px-1"
        >
          Clear all
        </button>

        <button
          onClick={handleFinalSearch}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Search Stays</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
