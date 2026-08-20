import { useState } from 'react';
import { X, CheckCircle2, Calendar, Users, MapPin, Sparkles } from 'lucide-react';
import { Property, Reservation } from '../../types/stayhub.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
  };
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  property,
  bookingData,
}: BookingConfirmationModalProps) {
  const { currentUser } = useAuthStore();
  const { createReservation, setCurrentView } = useBookingStore();

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setBookingError(null);

    setTimeout(() => {
      const result = createReservation({
        propertyId: property.id,
        guestId: currentUser.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guestsCount: bookingData.guestsCount,
      });

      setIsProcessing(false);
      if (result.success && result.reservation) {
        setConfirmedReservation(result.reservation);
      } else {
        setBookingError(result.error || 'Failed to complete reservation');
      }
    }, 600);
  };

  const handleGoToTrips = () => {
    onClose();
    setCurrentView('my-trips');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#151E32] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0F1D]/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {confirmedReservation ? 'Booking Confirmed!' : 'Review & Confirm Reservation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!confirmedReservation ? (
            <>
              {/* Property Card Mini */}
              <div className="flex items-center gap-4 p-3.5 bg-[#0A0F1D] border border-slate-800 rounded-2xl">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                    {property.category}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{property.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>

              {/* Trip Summary Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0A0F1D] border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>Dates</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {bookingData.checkIn} to {bookingData.checkOut}
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0F1D] border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5 text-rose-400" />
                    <span>Guests</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {bookingData.guestsCount} {bookingData.guestsCount === 1 ? 'Guest' : 'Guests'}
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="p-4 bg-[#0A0F1D] border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total amount to charge</span>
                  <span className="text-base font-extrabold text-white">
                    €{bookingData.totalPrice} EUR
                  </span>
                </div>
                <div className="text-right text-[11px] text-emerald-400 font-medium">
                  Instant Confirmation
                </div>
              </div>

              {bookingError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  {bookingError}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing reservation...' : 'Confirm & Guarantee Stay'}
              </button>
            </>
          ) : (
            /* Boarding Pass Voucher Screen */
            <div className="text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1">You're All Set!</h4>
                <p className="text-xs text-slate-400">
                  Your reservation is confirmed. We sent confirmation details to {currentUser.email}.
                </p>
              </div>

              {/* Voucher Ticket */}
              <div className="p-5 bg-[#0A0F1D] border border-dashed border-slate-700 rounded-2xl text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Reservation Code
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {confirmedReservation.confirmationCode}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">{property.title}</div>
                  <div className="text-slate-400">{property.location}</div>
                  <div className="text-slate-300 font-medium">
                    {confirmedReservation.checkIn} — {confirmedReservation.checkOut} ({confirmedReservation.nights} nights)
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToTrips}
                className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all"
              >
                View in My Trips
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
