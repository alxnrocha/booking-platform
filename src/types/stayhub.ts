export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type PropertyCategory =
  | 'Beachfront'
  | 'Modern Cabins'
  | 'Luxury Villas'
  | 'Infinity Pools'
  | 'Tiny Homes'
  | 'Treehouses'
  | 'Design Homes'
  | 'Lakefront'
  | 'Ski Chalets'
  | 'Amazing Views';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  isSuperhost: boolean;
  yearsHosting: number;
}

export interface SleepingDetail {
  roomName: string;
  bedType: string;
  bedCount: number;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Property {
  id: string;
  hostId: string;
  host: User;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  country: string;
  category: PropertyCategory;
  pricePerNight: number;
  cleaningFee: number;
  serviceFeeRate: number;
  rating: number;
  reviewCount: number;
  isSuperhost: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  images: string[];
  amenities: Amenity[];
  sleepingDetails: SleepingDetail[];
  cancellationDays: number;
  instantBooking: boolean;
  isFavorite?: boolean;
}

export interface Reservation {
  id: string;
  propertyId: string;
  property: Property;
  guestId: string;
  guest: User;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  nights: number;
  guestsCount: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: ReservationStatus;
  confirmationCode: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface FilterState {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  category: PropertyCategory | 'All';
  minPrice: number;
  maxPrice: number;
  superhostOnly: boolean;
  instantBookingOnly: boolean;
}
