import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from './useFilterStore.ts';

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it('initializes with default state values', () => {
    const state = useFilterStore.getState();
    expect(state.destination).toBe('');
    expect(state.category).toBe('Beachfront');
    expect(state.guests).toBe(1);
    expect(state.minPrice).toBe(0);
    expect(state.maxPrice).toBe(1500);
    expect(state.superhostOnly).toBe(false);
    expect(state.instantBookingOnly).toBe(false);
  });

  it('updates destination correctly', () => {
    useFilterStore.getState().setDestination('Amalfi Coast');
    expect(useFilterStore.getState().destination).toBe('Amalfi Coast');
  });

  it('updates check-in and check-out dates', () => {
    useFilterStore.getState().setDates('2026-07-01', '2026-07-10');
    expect(useFilterStore.getState().checkIn).toBe('2026-07-01');
    expect(useFilterStore.getState().checkOut).toBe('2026-07-10');
  });

  it('toggles superhost and instant booking filters', () => {
    useFilterStore.getState().toggleSuperhostOnly();
    expect(useFilterStore.getState().superhostOnly).toBe(true);

    useFilterStore.getState().toggleInstantBookingOnly();
    expect(useFilterStore.getState().instantBookingOnly).toBe(true);
  });

  it('resets all filters back to original initial values', () => {
    useFilterStore.getState().setDestination('Bali');
    useFilterStore.getState().setGuests(4);
    useFilterStore.getState().setCategory('Luxury Villas');
    useFilterStore.getState().toggleSuperhostOnly();

    useFilterStore.getState().resetFilters();

    const state = useFilterStore.getState();
    expect(state.destination).toBe('');
    expect(state.guests).toBe(1);
    expect(state.category).toBe('Beachfront');
    expect(state.superhostOnly).toBe(false);
  });
});
