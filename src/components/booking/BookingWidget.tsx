import { useState, useMemo } from 'react';
import { ShieldCheck, AlertCircle, ChevronDown } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { calculateBookingPrice } from '../../utils/pricing.ts';

interface BookingWidgetProps {
  property: Property;
  onOpenConfirmationModal: (reservationData: {
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
  }) => void;
}

export function BookingWidget({ property, onOpenConfirmationModal }: BookingWidgetProps) {
  const { currentUser } = useAuthStore();
  const { reservations } = useBookingStore();

  const [checkIn, setCheckIn] = useState('2026-06-10');
  const [checkOut, setCheckOut] = useState('2026-06-13');
  const [guestsCount, setGuestsCount] = useState(2);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic night calculation
  const nights = useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) return 1;
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  // Price calculations
  const priceBreakdown = useMemo(() => {
    return calculateBookingPrice(
      property.pricePerNight,
      nights,
      property.cleaningFee,
      property.serviceFeeRate
    );
  }, [property, nights]);

  // Check collision for dates
  const isDateCollision = useMemo(() => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    return reservations.some((res) => {
      if (res.propertyId !== property.id || res.status !== 'CONFIRMED') return false;
      const resIn = new Date(res.checkIn);
      const resOut = new Date(res.checkOut);
      return !(d2 <= resIn || d1 >= resOut);
    });
  }, [reservations, property.id, checkIn, checkOut]);

  const handleReserveClick = () => {
    if (isDateCollision) {
      setErrorMessage('These dates are already booked for this property. Please pick alternative dates.');
      return;
    }

    setErrorMessage(null);
    onOpenConfirmationModal({
      propertyId: property.id,
      guestId: currentUser.id,
      checkIn,
      checkOut,
      guestsCount,
      totalPrice: priceBreakdown.grandTotal,
    });
  };

  return (
    <div className="sticky top-28 bg-[#151E32] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-white">€{property.pricePerNight}</span>
          <span className="text-sm text-slate-400 font-medium"> / night</span>
        </div>
      </div>

      {/* Date & Guest Picker Box */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-[#0A0F1D]/80">
        {/* Date Row */}
        <div className="grid grid-cols-2 border-b border-slate-700">
          <div className="p-3 border-r border-slate-700">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              CHECK-IN
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
            />
          </div>

          <div className="p-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              CHECK-OUT
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Guests Row */}
        <div className="relative">
          <button
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                GUESTS
              </span>
              <span className="text-xs font-semibold text-white">
                {guestsCount} {guestsCount === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isGuestDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#151E32] border border-slate-700 rounded-b-2xl p-4 shadow-xl z-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Guests count</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    disabled={guestsCount <= 1}
                    className="w-7 h-7 rounded-full border border-slate-700 text-white disabled:opacity-30 flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white">{guestsCount}</span>
                  <button
                    onClick={() => setGuestsCount(Math.min(property.maxGuests, guestsCount + 1))}
                    disabled={guestsCount >= property.maxGuests}
                    className="w-7 h-7 rounded-full border border-slate-700 text-white disabled:opacity-30 flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collision Warning */}
      {isDateCollision && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>These dates are already reserved by another guest.</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Reserve Now CTA Button */}
      <button
        onClick={handleReserveClick}
        disabled={isDateCollision}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Reserve Now
      </button>

      <p className="text-center text-[11px] text-slate-400">
        You won't be charged yet
      </p>

      {/* Transparent Pricing Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span>
            €{property.pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span>€{priceBreakdown.baseTotal}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span>Cleaning fee</span>
          <span>€{priceBreakdown.cleaningFee}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span>StayHub service fee</span>
          <span>€{priceBreakdown.serviceFee}</span>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-extrabold text-sm text-white">
          <span>Total</span>
          <span className="text-rose-400">€{priceBreakdown.grandTotal} EUR</span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Free cancellation up to {property.cancellationDays} days before check-in</span>
      </div>
    </div>
  );
}
