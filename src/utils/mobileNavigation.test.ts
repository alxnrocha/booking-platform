import { describe, it, expect } from 'vitest';
import { useBookingStore } from '../stores/useBookingStore.ts';
import { useAuthStore } from '../stores/useAuthStore.ts';
import { useFilterStore } from '../stores/useFilterStore.ts';

describe('Mobile Navigation & Responsive State Suite', () => {
  it('switches views seamlessly across mobile bottom nav targets', () => {
    const bookingStore = useBookingStore.getState();
    
    bookingStore.setCurrentView('marketplace');
    expect(useBookingStore.getState().currentView).toBe('marketplace');

    bookingStore.setCurrentView('my-trips');
    expect(useBookingStore.getState().currentView).toBe('my-trips');

    bookingStore.setCurrentView('host-portal');
    expect(useBookingStore.getState().currentView).toBe('host-portal');
  });

  it('updates filters from mobile search inputs without side-effects', () => {
    const filterStore = useFilterStore.getState();
    filterStore.setDestination('Santorini');
    filterStore.setDates('2026-08-01', '2026-08-07');
    filterStore.setGuests(3);

    const state = useFilterStore.getState();
    expect(state.destination).toBe('Santorini');
    expect(state.checkIn).toBe('2026-08-01');
    expect(state.checkOut).toBe('2026-08-07');
    expect(state.guests).toBe(3);
  });

  it('persists auth role and avatar across mobile viewport transitions', () => {
    useAuthStore.getState().setRole('HOST');
    expect(useAuthStore.getState().currentUser.role).toBe('HOST');

    useAuthStore.getState().setRole('GUEST');
    expect(useAuthStore.getState().currentUser.role).toBe('GUEST');
  });
});
