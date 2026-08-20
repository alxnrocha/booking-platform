import { useState } from 'react';
import { PropertyHeader } from './PropertyHeader.tsx';
import { HostProfileCard } from './HostProfileCard.tsx';
import { BedroomCards } from './BedroomCards.tsx';
import { AmenitiesGrid } from './AmenitiesGrid.tsx';
import { BookingPolicyTimeline } from './BookingPolicyTimeline.tsx';
import { BookingWidget } from '../booking/BookingWidget.tsx';
import { BookingConfirmationModal } from '../booking/BookingConfirmationModal.tsx';
import { useBookingStore } from '../../stores/useBookingStore.ts';

export function PropertyDetailView() {
  const { properties, selectedPropertyId } = useBookingStore();

  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const [pendingReservation, setPendingReservation] = useState<{
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
  } | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleOpenConfirmation = (data: {
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    totalPrice: number;
  }) => {
    setPendingReservation(data);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="animate-in fade-in pb-16">
      {/* Top Header with breadcrumbs, title and 5-photo masonry gallery */}
      <PropertyHeader property={property} />

      {/* 2-Column Split: Content & Sticky Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        {/* Left Detailed Content Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2">
          <HostProfileCard property={property} />
          <BedroomCards sleepingDetails={property.sleepingDetails} />
          <AmenitiesGrid amenities={property.amenities} />
          <BookingPolicyTimeline cancellationDays={property.cancellationDays} />
        </div>

        {/* Right Sticky Booking Widget Column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <BookingWidget
            property={property}
            onOpenConfirmationModal={handleOpenConfirmation}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingReservation && (
        <BookingConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          property={property}
          bookingData={pendingReservation}
        />
      )}
    </div>
  );
}
