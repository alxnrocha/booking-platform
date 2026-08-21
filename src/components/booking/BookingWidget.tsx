import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ChevronDown, Calendar as CalendarIcon, AlertCircle, X } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { calculateBookingPrice } from '../../utils/pricing.ts';
import { DateRangePickerPopover } from '../ui/DateRangePickerPopover.tsx';

interface BookingWidgetProps {
  property: Property;
  onOpenConfirmationModal: (bookingData: {
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
  }) => void;
}

export function BookingWidget({
  property,
  onOpenConfirmationModal,
}: BookingWidgetProps) {
  const { reservations } = useBookingStore();
  const { checkIn: filterCheckIn, checkOut: filterCheckOut, setDates } = useFilterStore();
  const { currentUser } = useAuthStore();

  const [checkIn, setLocalCheckIn] = useState<string>(filterCheckIn || '2026-06-10');
  const [checkOut, setLocalCheckOut] = useState<string>(filterCheckOut || '2026-06-13');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Sync with global filter store if filter dates change
  useEffect(() => {
    if (filterCheckIn) setLocalCheckIn(filterCheckIn);
    if (filterCheckOut) setLocalCheckOut(filterCheckOut);
  }, [filterCheckIn, filterCheckOut]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
    if (isNaN(diff) || diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(checkIn, checkOut);
  const priceBreakdown = calculateBookingPrice(
    property.pricePerNight,
    nights,
    property.cleaningFee,
    property.serviceFeeRate
  );

  // Collision detection
  const isDateCollision = reservations.some((res) => {
    if (res.propertyId !== property.id || res.status !== 'CONFIRMED') return false;
    const resIn = new Date(res.checkIn).getTime();
    const resOut = new Date(res.checkOut).getTime();
    const curIn = new Date(checkIn).getTime();
    const curOut = new Date(checkOut).getTime();
    return !(curOut <= resIn || curIn >= resOut);
  });

  const handleReserveClick = () => {
    if (!checkIn || !checkOut) {
      setErrorMessage('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      setErrorMessage('Check-out date must be after check-in date.');
      return;
    }

    if (isDateCollision) {
      setErrorMessage('These dates are already booked. Please choose other dates.');
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
    <div
      ref={widgetRef}
      className="sticky top-28 bg-[#151E32] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6"
    >
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-white">€{property.pricePerNight}</span>
          <span className="text-sm text-slate-400 font-medium"> / night</span>
        </div>
      </div>

      {/* Date & Guest Picker Box Container */}
      <div className="space-y-2">
        <div className="border border-slate-700 rounded-2xl bg-[#0A0F1D]/80 divide-y divide-slate-700">
          {/* Date Selector Row */}
          <button
            onClick={() => {
              setIsDatePickerOpen(true);
              setIsGuestDropdownOpen(false);
            }}
            className="w-full grid grid-cols-2 rounded-t-2xl hover:bg-slate-800/40 transition-colors text-left cursor-pointer group"
          >
            <div className="p-3 border-r border-slate-700">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1 group-hover:text-rose-400 transition-colors">
                <CalendarIcon className="w-3 h-3 text-rose-500" />
                CHECK-IN
              </label>
              <div className="text-xs font-semibold text-white">{checkIn || 'Add date'}</div>
            </div>

            <div className="p-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1 group-hover:text-rose-400 transition-colors">
                <CalendarIcon className="w-3 h-3 text-rose-500" />
                CHECK-OUT
              </label>
              <div className="text-xs font-semibold text-white">{checkOut || 'Add date'}</div>
            </div>
          </button>

          {/* Guests Selector Row */}
          <div className="relative">
            <button
              onClick={() => {
                setIsGuestDropdownOpen(!isGuestDropdownOpen);
              }}
              className="w-full p-3 text-left flex items-center justify-between rounded-b-2xl hover:bg-slate-800/30 transition-colors cursor-pointer"
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#151E32] border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Guests</span>
                    <span className="text-[10px] text-slate-400">Max {property.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      disabled={guestsCount <= 1}
                      className="w-7 h-7 rounded-full border border-slate-700 text-white disabled:opacity-30 flex items-center justify-center text-xs cursor-pointer hover:border-slate-500"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{guestsCount}</span>
                    <button
                      onClick={() => setGuestsCount(Math.min(property.maxGuests, guestsCount + 1))}
                      disabled={guestsCount >= property.maxGuests}
                      className="w-7 h-7 rounded-full border border-slate-700 text-white disabled:opacity-30 flex items-center justify-center text-xs cursor-pointer hover:border-slate-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prominent Modal/Popover Calendar for Date Selection */}
        {isDatePickerOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative bg-[#151E32] border border-slate-700 rounded-3xl p-5 shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Select Travel Dates</h3>
                  <p className="text-xs text-slate-400">
                    {checkIn && checkOut ? `${checkIn} to ${checkOut} (${nights} nights)` : 'Pick check-in and check-out'}
                  </p>
                </div>
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center">
                <DateRangePickerPopover
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDates={(inDate, outDate) => {
                    if (inDate) {
                      setLocalCheckIn(inDate);
                    }
                    if (outDate) {
                      setLocalCheckOut(outDate);
                    }
                    setDates(inDate, outDate);
                    setErrorMessage(null);
                    if (inDate && outDate) {
                      setIsDatePickerOpen(false);
                    }
                  }}
                  onClose={() => setIsDatePickerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
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
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
