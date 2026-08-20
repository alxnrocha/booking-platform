import { useMemo } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { PropertyCard } from './PropertyCard.tsx';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { useFilterStore } from '../../stores/useFilterStore.ts';

export function PropertyGrid() {
  const { properties } = useBookingStore();
  const { destination, guests, category, minPrice, maxPrice, superhostOnly, instantBookingOnly, resetFilters } =
    useFilterStore();

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Category filter
      if (category !== 'All' && prop.category !== category) {
        return false;
      }

      // Destination filter (case-insensitive substring)
      if (
        destination.trim() &&
        !prop.location.toLowerCase().includes(destination.toLowerCase().trim()) &&
        !prop.title.toLowerCase().includes(destination.toLowerCase().trim())
      ) {
        return false;
      }

      // Guests capacity filter
      if (guests > prop.maxGuests) {
        return false;
      }

      // Price range
      if (prop.pricePerNight < minPrice || prop.pricePerNight > maxPrice) {
        return false;
      }

      // Superhost toggle
      if (superhostOnly && !prop.isSuperhost) {
        return false;
      }

      // Instant booking toggle
      if (instantBookingOnly && !prop.instantBooking) {
        return false;
      }

      return true;
    });
  }, [properties, destination, guests, category, minPrice, maxPrice, superhostOnly, instantBookingOnly]);

  if (filteredProperties.length === 0) {
    return (
      <div className="py-20 text-center bg-[#151E32]/50 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">No properties found</h3>
        <p className="text-sm text-slate-400 mb-6">
          Try adjusting or clearing your search filters to find available vacation stays.
        </p>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset all filters</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>Featured Stays</span>
          <span className="text-xs font-normal text-slate-400">({filteredProperties.length} available)</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
