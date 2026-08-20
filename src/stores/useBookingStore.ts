import { create } from 'zustand';
import { Property, Reservation } from '../types/stayhub.ts';
import { mockProperties, mockReservations } from '../data/mockData.ts';
import { calculateBookingPrice } from '../utils/pricing.ts';

interface BookingStoreState {
  properties: Property[];
  selectedPropertyId: string | null;
  reservations: Reservation[];
  currentView: 'marketplace' | 'property-detail' | 'host-portal' | 'my-trips';
  
  // Actions
  setSelectedPropertyId: (id: string | null) => void;
  setCurrentView: (view: 'marketplace' | 'property-detail' | 'host-portal' | 'my-trips') => void;
  toggleFavorite: (propertyId: string) => void;
  
  // Booking operations
  createReservation: (params: {
    propertyId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
  }) => { success: boolean; reservation?: Reservation; error?: string };
  
  cancelReservation: (reservationId: string) => boolean;
  
  // Property management (Host)
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  toggleInstantBooking: (propertyId: string) => void;
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  properties: mockProperties,
  selectedPropertyId: 'prop_amalfi_villa',
  reservations: mockReservations,
  currentView: 'marketplace',

  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  
  setCurrentView: (view) => set({ currentView: view }),

  toggleFavorite: (propertyId) => {
    set((state) => ({
      properties: state.properties.map((prop) =>
        prop.id === propertyId ? { ...prop, isFavorite: !prop.isFavorite } : prop
      ),
    }));
  },

  createReservation: ({ propertyId, guestId, checkIn, checkOut, guestsCount }) => {
    const state = get();
    const property = state.properties.find((p) => p.id === propertyId);
    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return { success: false, error: 'Invalid dates selected' };
    }

    // Check for double booking collision with existing confirmed reservations
    const hasCollision = state.reservations.some((res) => {
      if (res.propertyId !== propertyId || res.status !== 'CONFIRMED') return false;
      const resIn = new Date(res.checkIn);
      const resOut = new Date(res.checkOut);
      return !(checkOutDate <= resIn || checkInDate >= resOut);
    });

    if (hasCollision) {
      return { success: false, error: 'Selected dates are already booked for this property.' };
    }

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const priceBreakdown = calculateBookingPrice(
      property.pricePerNight,
      nights,
      property.cleaningFee,
      property.serviceFeeRate
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const confirmationCode = `STAY-${property.location.slice(0, 3).toUpperCase()}-${randomSuffix}`;

    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      propertyId,
      property,
      guestId,
      guest: {
        id: guestId,
        name: 'Alex Vance',
        email: 'alex.vance@stayhub.test',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: 'GUEST',
        isSuperhost: false,
        yearsHosting: 0,
      },
      checkIn,
      checkOut,
      nights,
      guestsCount,
      basePrice: priceBreakdown.baseTotal,
      cleaningFee: priceBreakdown.cleaningFee,
      serviceFee: priceBreakdown.serviceFee,
      totalPrice: priceBreakdown.grandTotal,
      status: 'CONFIRMED',
      confirmationCode,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      reservations: [newReservation, ...state.reservations],
    }));

    return { success: true, reservation: newReservation };
  },

  cancelReservation: (reservationId) => {
    let updated = false;
    set((state) => ({
      reservations: state.reservations.map((res) => {
        if (res.id === reservationId) {
          updated = true;
          return { ...res, status: 'CANCELLED' };
        }
        return res;
      }),
    }));
    return updated;
  },

  updateProperty: (propertyId, updates) => {
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, ...updates } : p
      ),
    }));
  },

  toggleInstantBooking: (propertyId) => {
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, instantBooking: !p.instantBooking } : p
      ),
    }));
  },
}));
