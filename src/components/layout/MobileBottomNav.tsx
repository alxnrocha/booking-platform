import { Compass, CalendarCheck, Briefcase } from 'lucide-react';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';

export function MobileBottomNav() {
  const { currentView, setCurrentView, reservations } = useBookingStore();
  const { currentUser } = useAuthStore();

  const userActiveBookings = reservations.filter(
    (r) => r.guestId === currentUser.id && r.status === 'CONFIRMED'
  ).length;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1D]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      {/* 1. Explore */}
      <button
        onClick={() => setCurrentView('marketplace')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          currentView === 'marketplace'
            ? 'text-rose-500 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Explore</span>
      </button>

      {/* 2. My Trips */}
      <button
        onClick={() => setCurrentView('my-trips')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
          currentView === 'my-trips'
            ? 'text-rose-500 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <CalendarCheck className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">My Trips</span>
        {userActiveBookings > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
            {userActiveBookings}
          </span>
        )}
      </button>

      {/* 3. Host Portal */}
      <button
        onClick={() => setCurrentView(currentView === 'host-portal' ? 'marketplace' : 'host-portal')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          currentView === 'host-portal'
            ? 'text-rose-500 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">
          {currentView === 'host-portal' ? 'Host Hub' : 'Host'}
        </span>
      </button>
    </nav>
  );
}
