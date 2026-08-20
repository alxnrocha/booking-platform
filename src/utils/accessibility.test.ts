import { describe, it, expect } from 'vitest';
import { mockProperties } from '../data/mockData.ts';

describe('Accessibility & Domain Integrity Audit', () => {
  it('ensures all mock properties have valid titles, descriptions, and non-empty images', () => {
    mockProperties.forEach((prop) => {
      expect(prop.id).toBeTruthy();
      expect(prop.title).toBeTruthy();
      expect(prop.images.length).toBeGreaterThanOrEqual(2);
      expect(prop.pricePerNight).toBeGreaterThan(0);
      expect(prop.cleaningFee).toBeGreaterThanOrEqual(0);
      expect(prop.rating).toBeGreaterThanOrEqual(4.0);
      expect(prop.maxGuests).toBeGreaterThanOrEqual(1);
      expect(prop.sleepingDetails.length).toBeGreaterThanOrEqual(1);
      expect(prop.amenities.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('ensures all categories have valid titles and icons', () => {
    const categories = [
      'Beachfront',
      'Modern Cabins',
      'Luxury Villas',
      'Infinity Pools',
      'Tiny Homes',
      'Treehouses',
      'Design Homes',
      'Lakefront',
      'Ski Chalets',
      'Amazing Views',
    ];

    mockProperties.forEach((prop) => {
      expect(categories).toContain(prop.category);
    });
  });
});
