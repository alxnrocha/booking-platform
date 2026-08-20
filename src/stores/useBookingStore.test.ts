import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from './useBookingStore.ts';
import { mockProperties } from '../data/mockData.ts';

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.setState({
      properties: mockProperties,
      reservations: [],
      selectedPropertyId: 'prop_amalfi_villa',
      currentView: 'marketplace',
    });
  });

  it('creates a new reservation successfully and calculates price breakdown', () => {
    const store = useBookingStore.getState();
    const result = store.createReservation({
      propertyId: 'prop_amalfi_villa',
      guestId: 'usr_guest_alex',
      checkIn: '2026-07-01',
      checkOut: '2026-07-04',
      guestsCount: 2,
    });

    expect(result.success).toBe(true);
    expect(result.reservation).toBeDefined();
    expect(result.reservation?.nights).toBe(3);
    expect(result.reservation?.basePrice).toBe(960);
    expect(result.reservation?.cleaningFee).toBe(75);
    expect(result.reservation?.serviceFee).toBe(110);
    expect(result.reservation?.totalPrice).toBe(1145);
    expect(result.reservation?.status).toBe('CONFIRMED');
    expect(useBookingStore.getState().reservations.length).toBe(1);
  });

  it('prevents double booking when dates overlap with an existing confirmed reservation', () => {
    const store = useBookingStore.getState();
    
    // First booking: July 1 to July 4
    store.createReservation({
      propertyId: 'prop_amalfi_villa',
      guestId: 'usr_guest_alex',
      checkIn: '2026-07-01',
      checkOut: '2026-07-04',
      guestsCount: 2,
    });

    // Overlapping booking: July 2 to July 5
    const collisionResult = store.createReservation({
      propertyId: 'prop_amalfi_villa',
      guestId: 'usr_guest_alex',
      checkIn: '2026-07-02',
      checkOut: '2026-07-05',
      guestsCount: 2,
    });

    expect(collisionResult.success).toBe(false);
    expect(collisionResult.error).toContain('already booked');
    expect(useBookingStore.getState().reservations.length).toBe(1);
  });

  it('cancels an existing reservation and updates its status', () => {
    const store = useBookingStore.getState();
    const result = store.createReservation({
      propertyId: 'prop_amalfi_villa',
      guestId: 'usr_guest_alex',
      checkIn: '2026-08-10',
      checkOut: '2026-08-15',
      guestsCount: 2,
    });

    const resId = result.reservation!.id;
    const cancelSuccess = store.cancelReservation(resId);
    expect(cancelSuccess).toBe(true);

    const cancelledRes = useBookingStore.getState().reservations.find((r) => r.id === resId);
    expect(cancelledRes?.status).toBe('CANCELLED');
  });

  it('toggles property favorite state', () => {
    const store = useBookingStore.getState();
    const initialFav = store.properties.find((p) => p.id === 'prop_amalfi_villa')?.isFavorite;
    
    store.toggleFavorite('prop_amalfi_villa');
    const updatedFav = useBookingStore.getState().properties.find((p) => p.id === 'prop_amalfi_villa')?.isFavorite;
    expect(updatedFav).toBe(!initialFav);
  });

  it('toggles instant booking flag for a property', () => {
    const store = useBookingStore.getState();
    const initialInstant = store.properties.find((p) => p.id === 'prop_amalfi_villa')?.instantBooking;
    
    store.toggleInstantBooking('prop_amalfi_villa');
    const updatedInstant = useBookingStore.getState().properties.find((p) => p.id === 'prop_amalfi_villa')?.instantBooking;
    expect(updatedInstant).toBe(!initialInstant);
  });

  it('updates property details partially', () => {
    const store = useBookingStore.getState();
    store.updateProperty('prop_amalfi_villa', { pricePerNight: 395 });
    
    const updatedProp = useBookingStore.getState().properties.find((p) => p.id === 'prop_amalfi_villa');
    expect(updatedProp?.pricePerNight).toBe(395);
  });
});
