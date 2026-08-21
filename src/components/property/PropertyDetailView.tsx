import { useState } from 'react';
import { PropertyTitleBar, PropertyGallery } from './PropertyHeader.tsx';
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
    <div className="max-w-[1680px] mx-auto w-full px-6 sm:px-8 lg:px-8 pb-20 pt-4 md:pt-6 animate-in fade-in">
      
      {/* Title Bar is placed above the grid to ensure photos align with the booking widget */}
      <PropertyTitleBar property={property} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 w-full items-start">
        {/* Left Detailed Content Column (7 of 12 cols / 8 of 12 on large screens) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
          <PropertyGallery property={property} />
          
          <div className="flex flex-col gap-10 px-3 sm:px-4 lg:px-0">
            <HostProfileCard property={property} />
            <BedroomCards sleepingDetails={property.sleepingDetails} />
            <AmenitiesGrid amenities={property.amenities} />
            <BookingPolicyTimeline cancellationDays={property.cancellationDays} />
          </div>
        </div>

        {/* Right Sticky Booking Widget Column */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
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
