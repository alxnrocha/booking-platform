import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
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

const formatISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function BookingWidget({
  property,
  onOpenConfirmationModal,
}: BookingWidgetProps) {
  const { reservations } = useBookingStore();
  const { checkIn: filterCheckIn, checkOut: filterCheckOut, setDates } = useFilterStore();
  const { currentUser } = useAuthStore();

  const [checkIn, setLocalCheckIn] = useState<string>(() => {
    if (filterCheckIn) return filterCheckIn;
    return formatISODate(new Date());
  });

  const [checkOut, setLocalCheckOut] = useState<string>(() => {
    if (filterCheckOut) return filterCheckOut;
    const out = new Date();
    out.setDate(out.getDate() + 3);
    return formatISODate(out);
  });

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);

  const totalGuests = adults + children;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Touch gesture drag state for mobile drawer
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const currentDragRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    currentDragRef.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      currentDragRef.current = deltaY;
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentDragRef.current > 55) {
      setIsMobileExpanded(false);
    }
    setDragOffset(0);
    currentDragRef.current = 0;
    touchStartYRef.current = null;
    setIsDragging(false);
  };

  const widgetRef = useRef<HTMLDivElement>(null);

  // Sync with global filter store if filter dates change
  useEffect(() => {
    if (filterCheckIn) setLocalCheckIn(filterCheckIn);
    if (filterCheckOut) setLocalCheckOut(filterCheckOut);
  }, [filterCheckIn, filterCheckOut]);

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
    if (isNaN(diff) || diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Add date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return 'Add date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
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
    setIsMobileExpanded(false);
    onOpenConfirmationModal({
      propertyId: property.id,
      guestId: currentUser.id,
      checkIn,
      checkOut,
      guestsCount: totalGuests,
      totalPrice: priceBreakdown.grandTotal,
    });
  };

  // Reusable Date & Guest Picker Controls
  const renderPickerControls = () => (
    <div className="space-y-2">
      <div className="border border-slate-700/80 rounded-2xl bg-[#080D1A] divide-y divide-slate-800 shadow-inner">
        {/* Date Selector Row */}
        <button
          type="button"
          onClick={() => {
            setIsDatePickerOpen(true);
            setIsGuestDropdownOpen(false);
          }}
          className="w-full grid grid-cols-2 hover:bg-slate-800/40 transition-colors text-left cursor-pointer rounded-t-2xl group"
        >
          <div className="p-3.5 border-r border-slate-800">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 group-hover:text-rose-400 transition-colors">
              CHECK-IN
            </label>
            <div className="text-sm font-semibold text-white">{formatDisplayDate(checkIn)}</div>
          </div>

          <div className="p-3.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 group-hover:text-rose-400 transition-colors">
              CHECK-OUT
            </label>
            <div className="text-sm font-semibold text-white">{formatDisplayDate(checkOut)}</div>
          </div>
        </button>

        {/* Guests Selector Row */}
        <div className="rounded-b-2xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsGuestDropdownOpen((prev) => !prev);
            }}
            className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer rounded-b-2xl"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                GUESTS
              </span>
              <span className="text-sm font-semibold text-white">
                {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
                {infants > 0 && `, ${infants} infant${infants > 1 ? 's' : ''}`}
                {pets > 0 && `, ${pets} pet${pets > 1 ? 's' : ''}`}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isGuestDropdownOpen ? 'rotate-180 text-rose-400' : ''}`} />
          </button>

          {/* Full Professional Multi-Category Guest Stepper Panel */}
          {isGuestDropdownOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="p-4 space-y-3.5 bg-[#121929] border-t border-slate-700/80 rounded-b-2xl animate-in fade-in duration-150 text-left"
            >
              {/* 1. Adults */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <div>
                  <div className="text-sm font-bold text-white">Adults</div>
                  <div className="text-xs text-slate-400">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Decrease adults"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(property.maxGuests - children, adults + 1))}
                    disabled={totalGuests >= property.maxGuests}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Increase adults"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. Children */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <div>
                  <div className="text-sm font-bold text-white">Children</div>
                  <div className="text-xs text-slate-400">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Decrease children"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(property.maxGuests - adults, children + 1))}
                    disabled={totalGuests >= property.maxGuests}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3. Infants */}
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <div>
                  <div className="text-sm font-bold text-white">Infants</div>
                  <div className="text-xs text-slate-400">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    disabled={infants <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Decrease infants"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(Math.min(5, infants + 1))}
                    disabled={infants >= 5}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Increase infants"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 4. Pets */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-bold text-white">Pets</div>
                  <div className="text-xs text-slate-400">Bringing a service animal?</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPets(Math.max(0, pets - 1))}
                    disabled={pets <= 0}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Decrease pets"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white text-sm">{pets}</span>
                  <button
                    type="button"
                    onClick={() => setPets(Math.min(3, pets + 1))}
                    disabled={pets >= 3}
                    className="w-8 h-8 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-800 text-white disabled:opacity-30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all active:scale-95"
                    aria-label="Increase pets"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Max capacity info note */}
              <p className="text-[11px] text-slate-400 pt-2 leading-relaxed border-t border-slate-800">
                This place has a maximum of <strong className="text-white">{property.maxGuests} guests</strong>, not including infants. Pets may be subject to house rules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Reusable Price Breakdown
  const renderPriceBreakdown = () => (
    <div className="space-y-3 pt-2 text-sm">
      <div className="flex items-center justify-between text-slate-300">
        <span>
          €{property.pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span className="font-semibold text-white">€{priceBreakdown.baseTotal}</span>
      </div>

      <div className="flex items-center justify-between text-slate-300">
        <span>Cleaning fee</span>
        <span className="font-semibold text-white">€{priceBreakdown.cleaningFee}</span>
      </div>

      <div className="flex items-center justify-between text-slate-300">
        <span>Service fee</span>
        <span className="font-semibold text-white">€{priceBreakdown.serviceFee}</span>
      </div>

      <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between font-black text-base text-white">
        <span>Total</span>
        <span className="text-white">€{priceBreakdown.grandTotal.toLocaleString()} EUR</span>
      </div>
    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP INLINE STICKY CARD (Visible on lg screens and above)            */}
      {/* ========================================================================= */}
      <div
        ref={widgetRef}
        className="hidden lg:block relative bg-[#101726] border border-slate-800/90 rounded-3xl p-7 shadow-2xl space-y-6"
      >
        {/* Price Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-white tracking-tight">€{property.pricePerNight}</span>
            <span className="text-sm text-slate-400 font-medium ml-1.5">/ night</span>
          </div>
        </div>

        {/* Date & Guest Picker Controls */}
        {renderPickerControls()}

        {/* Pricing Breakdown */}
        {renderPriceBreakdown()}

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

        {/* Big Glowing Reserve Now CTA Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleReserveClick}
            disabled={isDateCollision}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E51D52] hover:from-[#E51D52] hover:to-[#D41446] text-white text-base font-extrabold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Reserve Now
          </button>

          <p className="text-center text-xs text-slate-400">
            You won't be charged yet
          </p>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 pt-3 text-xs text-slate-400 border-t border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>Free cancellation up to {property.cancellationDays} days before check-in</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE STICKY BOTTOM BAR (Always visible at the bottom on mobile)      */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1526]/95 backdrop-blur-xl border-t border-slate-700/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-4 sm:px-6 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] flex items-center justify-between">
        {/* Left price & dates summary info */}
        <div 
          onClick={() => setIsMobileExpanded(true)}
          className="flex flex-col cursor-pointer group"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-white">€{property.pricePerNight}</span>
            <span className="text-xs text-slate-400">/ night</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsDatePickerOpen(true);
            }}
            className="text-[11px] font-bold text-rose-400 underline underline-offset-2 hover:text-rose-300 text-left flex items-center gap-1 cursor-pointer"
          >
            <span>{formatShortDate(checkIn)} – {formatShortDate(checkOut)}</span>
            <span className="text-slate-400 font-normal">({nights}n)</span>
          </button>
        </div>

        {/* Right actions: Expand arrow button + Quick Reserve button */}
        <div className="flex items-center gap-2">
          {/* Beautiful arrow button with glowing hover effect */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="w-10 h-10 rounded-full bg-[#161F33] border border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 text-rose-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer group"
            aria-label="Expand booking summary details"
            title="Expand summary"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Reserve CTA */}
          <button
            onClick={handleReserveClick}
            disabled={isDateCollision}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF385C] to-[#E51D52] hover:from-[#E51D52] hover:to-[#D41446] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE EXPANDED BOTTOM SHEET DRAWER (Slides up smoothly on mobile)     */}
      {/* ========================================================================= */}
      {isMobileExpanded && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileExpanded(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          />

          {/* Bottom Sheet Drawer Modal - Live Interactive Drag & Gesture support */}
          <div 
            style={{
              transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#101726] border-t border-slate-700/90 rounded-t-[28px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] p-4 sm:p-5 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] max-h-[85dvh] overflow-y-auto lg:hidden animate-in slide-in-from-bottom duration-300 space-y-3"
          >
            {/* Top Interactive Touch Drag Pill Area */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex flex-col items-center py-2 -mx-4 cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  isDragging ? 'w-16 bg-rose-500 scale-105 shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'w-12 bg-slate-500 hover:bg-slate-400'
                }`} 
              />
            </div>
              
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">€{property.pricePerNight}</span>
                  <span className="text-xs text-slate-400 font-medium">/ night</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {formatDisplayDate(checkIn)} to {formatDisplayDate(checkOut)} ({nights} nights)
                </div>
              </div>

              {/* Smooth downward collapse arrow button */}
              <button
                onClick={() => setIsMobileExpanded(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"
                aria-label="Collapse drawer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Date & Guest Picker Controls */}
            {renderPickerControls()}

            {/* Price Breakdown */}
            {renderPriceBreakdown()}

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

            {/* Reserve CTA in Mobile Drawer */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={handleReserveClick}
                disabled={isDateCollision}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E51D52] hover:from-[#E51D52] hover:to-[#D41446] text-white text-sm font-extrabold shadow-lg shadow-rose-500/30 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                Reserve Now
              </button>
              <p className="text-center text-[11px] text-slate-400">
                You won't be charged yet
              </p>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Free cancellation up to {property.cancellationDays} days before check-in</span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. DUAL-MONTH CALENDAR MODAL (Shared by Desktop & Mobile)                 */}
      {/* ========================================================================= */}
      {isDatePickerOpen && (
        <div
          onClick={() => setIsDatePickerOpen(false)}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-2xl lg:max-w-3xl w-full flex justify-center">
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
      )}
    </>
  );
}
