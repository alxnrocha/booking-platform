import React, { useState } from 'react';
import { Heart, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { setSelectedPropertyId, setCurrentView, toggleFavorite } = useBookingStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = () => {
    setSelectedPropertyId(property.id);
    setCurrentView('property-detail');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-[#151E32] rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 transition-all hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
    >
      {/* Photo Carousel Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/70 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95"
          aria-label={property.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              property.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/90 stroke-[2]'
            }`}
          />
        </button>

        {/* Superhost Badge */}
        {property.isSuperhost && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
            Superhost
          </div>
        )}

        {/* Carousel Prev/Next Controls (visible on hover) */}
        {property.images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel Pagination Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-sm tracking-tight leading-snug group-hover:text-rose-400 transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-white flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating.toFixed(2)}</span>
            </div>
          </div>

          {/* Subtitle Highlight */}
          <div className="text-xs font-medium text-slate-300 mb-1.5 line-clamp-1">
            {property.subtitle}
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-white">€{property.pricePerNight}</span>
            <span className="text-xs text-slate-400"> / night</span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            {property.reviewCount} reviews
          </div>
        </div>
      </div>
    </div>
  );
}
