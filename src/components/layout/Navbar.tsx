import { useState, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Shield, Home, Briefcase, CalendarCheck, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { UserRole } from '../../types/stayhub.ts';
import { DateRangePickerPopover } from '../ui/DateRangePickerPopover.tsx';
import { formatDateRange } from '../../utils/dateFormatters.ts';
import { MobileSearchModal } from './MobileSearchModal.tsx';

export function Navbar() {
  const { currentUser, setRole } = useAuthStore();
  const { destination, setDestination, guests, setGuests, checkIn, checkOut, setDates } = useFilterStore();
  const { currentView, setCurrentView, setSelectedPropertyId } = useBookingStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsDatePickerOpen(false);
        setIsGuestPopoverOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setIsUserMenuOpen(false);
    if (role === 'HOST') {
      setCurrentView('host-portal');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleLogoClick = () => {
    setSelectedPropertyId(null);
    setCurrentView('marketplace');
  };

  const handleQuickSearch = (dest: string) => {
    setDestination(dest);
    setIsSearchOpen(false);
    if (currentView !== 'marketplace') {
      setCurrentView('marketplace');
    }
  };

  const formattedDates = formatDateRange(checkIn, checkOut);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1D]/95 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Desktop and Tablet Topbar */}
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-2xl flex-shrink-0 cursor-pointer"
            aria-label="StayHub Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Stay<span className="text-rose-500">Hub</span>
            </span>
          </button>

          {/* Floating Pill Search Bar (Desktop / Tablet - Visible on Marketplace) */}
          <div
            ref={searchRef}
            className={`hidden md:flex items-center justify-center flex-1 max-w-3xl px-2 relative transition-opacity ${
              currentView === 'property-detail' ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="w-full flex items-center justify-between bg-[#151E32] border border-slate-700/80 hover:border-slate-600 rounded-full shadow-xl shadow-black/40 p-2 pl-6 text-xs text-slate-300 transition-all">
              {/* Destination Section */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsDatePickerOpen(false);
                  setIsGuestPopoverOpen(false);
                }}
                className="flex-1 px-4 py-1.5 text-left hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer min-w-[140px]"
              >
                <div className="font-bold text-white text-[13px] tracking-tight">Destination</div>
                <div className="text-slate-400 truncate max-w-[180px] text-xs font-normal mt-0.5">
                  {destination || 'Where are you going?'}
                </div>
              </button>

              <div className="w-px h-7 bg-slate-700 mx-1" />

              {/* Dates Section */}
              <button
                onClick={() => {
                  setIsDatePickerOpen(!isDatePickerOpen);
                  setIsSearchOpen(false);
                  setIsGuestPopoverOpen(false);
                }}
                className="flex-1 px-4 py-1.5 text-left hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer min-w-[170px]"
              >
                <div className="font-bold text-white text-[13px] tracking-tight">Check in – Check out</div>
                <div className={`text-xs mt-0.5 ${checkIn ? 'text-rose-400 font-bold' : 'text-slate-400 font-normal'}`}>
                  {formattedDates}
                </div>
              </button>

              <div className="w-px h-7 bg-slate-700 mx-1" />

              {/* Guests Section */}
              <button
                onClick={() => {
                  setIsGuestPopoverOpen(!isGuestPopoverOpen);
                  setIsSearchOpen(false);
                  setIsDatePickerOpen(false);
                }}
                className="px-4 py-1.5 text-left hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer min-w-[90px]"
              >
                <div className="font-bold text-white text-[13px] tracking-tight">Guests</div>
                <div className="text-slate-400 text-xs font-normal mt-0.5">
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </div>
              </button>

              {/* Search Action Button */}
              <button
                onClick={() => {
                  if (currentView !== 'marketplace') setCurrentView('marketplace');
                  setIsSearchOpen(false);
                  setIsDatePickerOpen(false);
                  setIsGuestPopoverOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center ml-2 shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                aria-label="Execute search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Destination Search Popover */}
            {isSearchOpen && (
              <div className="absolute top-16 left-0 right-0 bg-[#151E32] border border-slate-700 rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Search by Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Amalfi Coast, Bali, Santorini, Malibu, Tossa de Mar..."
                    className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                    autoFocus
                  />
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Popular Luxury Destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Barcelona', 'Madrid', 'Paris', 'Trancoso', 'Rio de Janeiro', 'Amalfi Coast', 'Costa Brava', 'Algarve', 'Saint-Tropez', 'Florianópolis', 'Santorini', 'Bali', 'Lake Como'].map(
                      (dest) => (
                        <button
                          key={dest}
                          onClick={() => handleQuickSearch(dest)}
                          className="px-3 py-1.5 bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-all font-medium cursor-pointer"
                        >
                          {dest}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Interactive Date Picker Popover */}
            {isDatePickerOpen && (
              <div className="absolute top-16 left-0 right-0 z-50 flex justify-center">
                <DateRangePickerPopover
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDates={(inDate, outDate) => setDates(inDate, outDate)}
                  onClose={() => setIsDatePickerOpen(false)}
                />
              </div>
            )}

            {/* Guests Popover */}
            {isGuestPopoverOpen && (
              <div className="absolute top-16 right-0 w-72 bg-[#151E32] border border-slate-700 rounded-3xl p-5 shadow-2xl z-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Guests</div>
                    <div className="text-xs text-slate-400">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-white text-sm">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(16, guests + 1))}
                      className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Navigation & RBAC User Menu */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* My Trips (Desktop) */}
            <button
              onClick={() => setCurrentView('my-trips')}
              className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'my-trips'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Trips</span>
            </button>

            {/* Host Portal Toggle (Desktop) */}
            <button
              onClick={() => setCurrentView(currentView === 'host-portal' ? 'marketplace' : 'host-portal')}
              className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'host-portal'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{currentView === 'host-portal' ? 'Exit Host Portal' : 'Host Portal'}</span>
            </button>

            {/* User Dropdown with RBAC switch */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 bg-[#151E32] border border-slate-700 hover:border-slate-600 rounded-full p-1.5 pl-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                aria-label="User account and RBAC menu"
              >
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-rose-400 font-mono font-semibold">{currentUser.role}</div>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-14 w-64 bg-[#151E32] border border-slate-700 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-800">
                    <div className="text-xs text-slate-400 font-medium">Logged in as</div>
                    <div className="text-sm font-bold text-white">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                  </div>

                  <div className="p-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Simulate RBAC Role
                    </div>
                    <button
                      onClick={() => handleRoleChange('GUEST')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        currentUser.role === 'GUEST'
                          ? 'bg-rose-500/10 text-rose-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5" /> Guest Mode
                      </span>
                      {currentUser.role === 'GUEST' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('HOST')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        currentUser.role === 'HOST'
                          ? 'bg-rose-500/10 text-rose-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5" /> Host / Superhost
                      </span>
                      {currentUser.role === 'HOST' && <span className="text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('ADMIN')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-rose-500/10 text-rose-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Platform Admin
                      </span>
                      {currentUser.role === 'ADMIN' && <span className="text-xs">✓</span>}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setCurrentView('my-trips');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      My Reservations
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('host-portal');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Host Management Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Elevated Luxury Mobile Search Pill (Airbnb App Style) */}
        {currentView === 'marketplace' && (
          <div className="md:hidden pb-4 pt-1">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="w-full flex items-center justify-between bg-[#121929] border border-slate-700/90 hover:border-slate-600 rounded-full p-2 pl-3 pr-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-left cursor-pointer group active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {destination || 'Where to?'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium truncate">
                    {formattedDates !== 'Add dates' ? formattedDates : 'Anywhere'} · {guests} {guests === 1 ? 'guest' : 'guests'}
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full border border-slate-700/80 bg-[#070B14] flex items-center justify-center text-slate-300 flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Mobile Search Modal (Rendered via React Portal) */}
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </header>
  );
}
