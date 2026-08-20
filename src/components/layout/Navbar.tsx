import { useState, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Shield, Home, Briefcase, CalendarCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { UserRole } from '../../types/stayhub.ts';

export function Navbar() {
  const { currentUser, setRole } = useAuthStore();
  const { destination, setDestination, guests, setGuests, checkIn, checkOut, setDates } = useFilterStore();
  const { currentView, setCurrentView, setSelectedPropertyId } = useBookingStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl"
            aria-label="StayHub Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              Stay<span className="text-rose-500">Hub</span>
            </span>
          </button>

          {/* Floating Pill Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden md:flex items-center relative">
            <div className="flex items-center bg-[#151E32] border border-slate-700/60 rounded-full shadow-lg hover:border-slate-600 transition-all p-1.5 pl-6 text-xs text-slate-300">
              {/* Destination */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="px-3 py-1.5 text-left hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <div className="font-semibold text-white text-[11px]">Destination</div>
                <div className="text-slate-400 truncate max-w-[110px]">
                  {destination || 'Where are you going?'}
                </div>
              </button>

              <div className="w-px h-6 bg-slate-700 mx-1" />

              {/* Dates */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="px-3 py-1.5 text-left hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <div className="font-semibold text-white text-[11px]">Check in – Check out</div>
                <div className="text-slate-400 truncate max-w-[110px]">
                  {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Add dates'}
                </div>
              </button>

              <div className="w-px h-6 bg-slate-700 mx-1" />

              {/* Guests */}
              <button
                onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)}
                className="px-3 py-1.5 text-left hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <div className="font-semibold text-white text-[11px]">Guests</div>
                <div className="text-slate-400">
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </div>
              </button>

              {/* Search Action Button */}
              <button
                onClick={() => {
                  if (currentView !== 'marketplace') setCurrentView('marketplace');
                  setIsSearchOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center ml-2 shadow-md shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
                aria-label="Execute search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Popover */}
            {isSearchOpen && (
              <div className="absolute top-16 left-0 right-0 bg-[#151E32] border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="mb-3">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Search by Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Amalfi Coast, Bali, Santorini, Malibu"
                    className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn || ''}
                      onChange={(e) => setDates(e.target.value || null, checkOut)}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut || ''}
                      onChange={(e) => setDates(checkIn, e.target.value || null)}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Popular Destinations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Amalfi Coast', 'Costa Brava', 'Algarve', 'Malibu', 'Santorini', 'Bali', 'Lake Como', 'Tulum', 'Dubai'].map(
                      (dest) => (
                        <button
                          key={dest}
                          onClick={() => handleQuickSearch(dest)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-rose-500/20 hover:border-rose-500/40 border border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white transition-all"
                        >
                          {dest}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Guests Popover */}
            {isGuestPopoverOpen && (
              <div className="absolute top-16 right-0 w-64 bg-[#151E32] border border-slate-700 rounded-2xl p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Guests</div>
                    <div className="text-xs text-slate-400">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-white flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-semibold text-white text-sm">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(16, guests + 1))}
                      className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Navigation & RBAC User Menu */}
          <div className="flex items-center gap-3">
            {/* My Trips */}
            <button
              onClick={() => setCurrentView('my-trips')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentView === 'my-trips'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Trips</span>
            </button>

            {/* Host Portal Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'host-portal' ? 'marketplace' : 'host-portal')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                currentView === 'host-portal'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
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
                className="flex items-center gap-2 bg-[#151E32] border border-slate-700 hover:border-slate-600 rounded-full p-1.5 pl-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                aria-label="User account and RBAC menu"
              >
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-rose-400 font-mono font-medium">{currentUser.role}</div>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#151E32] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-800">
                    <div className="text-xs text-slate-400 font-medium">Logged in as</div>
                    <div className="text-sm font-bold text-white">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                  </div>

                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Simulate RBAC Role
                    </div>
                    <button
                      onClick={() => handleRoleChange('GUEST')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'GUEST'
                          ? 'bg-rose-500/10 text-rose-400 font-semibold'
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'HOST'
                          ? 'bg-rose-500/10 text-rose-400 font-semibold'
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-rose-500/10 text-rose-400 font-semibold'
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
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      My Reservations
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('host-portal');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      Host Management Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
