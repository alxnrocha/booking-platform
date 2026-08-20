import { create } from 'zustand';
import { PropertyCategory } from '../types/stayhub.ts';

interface FilterState {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  category: PropertyCategory | 'All';
  minPrice: number;
  maxPrice: number;
  superhostOnly: boolean;
  instantBookingOnly: boolean;
  setDestination: (dest: string) => void;
  setDates: (checkIn: string | null, checkOut: string | null) => void;
  setGuests: (guests: number) => void;
  setCategory: (category: PropertyCategory | 'All') => void;
  setPriceRange: (min: number, max: number) => void;
  toggleSuperhostOnly: () => void;
  toggleInstantBookingOnly: () => void;
  resetFilters: () => void;
}

const initialFilters = {
  destination: '',
  checkIn: null,
  checkOut: null,
  guests: 1,
  category: 'Beachfront' as PropertyCategory | 'All',
  minPrice: 0,
  maxPrice: 1500,
  superhostOnly: false,
  instantBookingOnly: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,
  setDestination: (destination) => set({ destination }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  setCategory: (category) => set({ category }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  toggleSuperhostOnly: () => set((state) => ({ superhostOnly: !state.superhostOnly })),
  toggleInstantBookingOnly: () => set((state) => ({ instantBookingOnly: !state.instantBookingOnly })),
  resetFilters: () => set({ ...initialFilters }),
}));
