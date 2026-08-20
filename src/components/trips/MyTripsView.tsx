import { useState } from 'react';
import { Calendar, Users, MapPin, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';

export function MyTripsView() {
  const { currentUser } = useAuthStore();
  const { reservations, cancelReservation, setSelectedPropertyId, setCurrentView } = useBookingStore();

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Filter reservations for current guest
  const userReservations = reservations.filter((r) => r.guestId === currentUser.id);

  const displayedReservations = userReservations.filter((r) => {
    if (selectedFilter === 'CONFIRMED') return r.status === 'CONFIRMED';
    if (selectedFilter === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  const handleCancelClick = (id: string) => {
    cancelReservation(id);
    setCancellingId(null);
  };

  const handleViewProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    setCurrentView('property-detail');
  };

  return (
    <div className="animate-in fade-in space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Booked Trips
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your upcoming stays, view reservation codes and cancellation options.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 bg-[#151E32] p-1.5 rounded-2xl border border-slate-700/80 self-start">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({userReservations.length})
          </button>
          <button
            onClick={() => setSelectedFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'CONFIRMED'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Confirmed ({userReservations.filter((r) => r.status === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setSelectedFilter('CANCELLED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'CANCELLED'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled ({userReservations.filter((r) => r.status === 'CANCELLED').length})
          </button>
        </div>
      </div>

      {/* Reservation List or Empty State */}
      {displayedReservations.length === 0 ? (
        <div className="py-20 text-center bg-[#151E32]/50 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">No trips found</h3>
          <p className="text-sm text-slate-400 mb-6">
            You don't have any {selectedFilter !== 'ALL' ? selectedFilter.toLowerCase() : ''} bookings yet. Discover luxury stays on the marketplace!
          </p>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all"
          >
            <span>Explore Stays</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedReservations.map((res) => (
            <div
              key={res.id}
              className="bg-[#151E32] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
            >
              {/* Left thumbnail and info */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <img
                  src={res.property.images[0]}
                  alt={res.property.title}
                  className="w-full sm:w-36 h-28 rounded-2xl object-cover border border-slate-700"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        res.status === 'CONFIRMED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {res.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {res.confirmationCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-tight">
                    {res.property.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{res.property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {res.checkIn} — {res.checkOut} ({res.nights} {res.nights === 1 ? 'night' : 'nights'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{res.guestsCount} guests</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right price and actions */}
              <div className="w-full md:w-auto flex flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block md:text-right">Total Amount</span>
                  <span className="text-xl font-extrabold text-white">€{res.totalPrice} EUR</span>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleViewProperty(res.propertyId)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    View Stay
                  </button>

                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => setCancellingId(res.id)}
                      className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Cancellation Confirmation Modal */}
              {cancellingId === res.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-[#151E32] border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-base font-bold text-white mb-1">Cancel Reservation?</h4>
                      <p className="text-xs text-slate-400">
                        Are you sure you want to cancel your stay for {res.property.title}? A 100% full refund of €{res.totalPrice} EUR will be processed.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCancellingId(null)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
                      >
                        Keep Stay
                      </button>
                      <button
                        onClick={() => handleCancelClick(res.id)}
                        className="flex-1 py-2.5 rounded-xl bg-rose-500 text-xs font-bold text-white hover:bg-rose-600"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
