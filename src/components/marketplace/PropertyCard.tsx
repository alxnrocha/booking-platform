import React, { useState } from 'react';
import { Heart, Star, MapPin, ChevronLeft, ChevronRight, Crown, ArrowRight } from 'lucide-react';
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

  const totalPhotosCount = property.images.length >= 5 ? 28 : property.images.length + 6;

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-[#070D18] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1"
    >
      {/* 1. IMMERSIVE HERO IMAGE & OVERLAYS */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9.8] w-full overflow-hidden bg-slate-900">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges & Actions */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          {/* Exclusive Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg">
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Exclusive</span>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white hover:text-rose-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            aria-label={property.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                property.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/90 stroke-[2]'
              }`}
            />
          </button>
        </div>

        {/* Gradient Overlay with Title, Location, and Rating - pointer-events-none so it doesn't block arrow clicks */}
        <div className="absolute -bottom-0.5 inset-x-0 bg-gradient-to-t from-[#070D18] from-45% via-[#070D18]/90 via-75% to-transparent pt-28 pb-3.5 px-5 flex items-end justify-between gap-3 z-10 pointer-events-none">
          {/* Left: Title & Location */}
          <div className="min-w-0 flex-1 pointer-events-auto">
            <h3 className="font-extrabold text-white text-base sm:text-lg lg:text-xl tracking-tight leading-snug drop-shadow-md line-clamp-1 group-hover:text-amber-300 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          {/* Right: Rating & Reviews */}
          <div className="flex-shrink-0 text-right pointer-events-auto">
            <div className="flex items-center justify-end gap-1.5 text-base sm:text-lg font-black text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{property.rating.toFixed(2)}</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 whitespace-nowrap">
              {property.reviewCount} reviews
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Arrows - positioned above gradient overlay with z-30 */}
        {property.images.length > 1 && (
          <div className="z-30 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-2xl z-30 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black/95 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-2xl z-30 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* 2. BOTTOM ACTION & THUMBNAIL BAR */}
      <div className="px-5 pb-4 pt-1 bg-[#070D18] flex items-center justify-between gap-3 relative z-10">
        {/* Left: Mini Thumbnails + Photo Count */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Thumbnail 1 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(0);
            }}
            className={`w-13 h-10 sm:w-15 sm:h-11 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all hover:opacity-90 ${
              currentImageIndex === 0 ? 'border-2 border-amber-400' : 'border border-slate-700/80 hover:border-slate-500'
            }`}
          >
            <img src={property.images[0]} alt="Thumbnail 1" className="w-full h-full object-cover" />
          </div>

          {/* Thumbnail 2 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(1 % property.images.length);
            }}
            className={`w-13 h-10 sm:w-15 sm:h-11 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all hover:opacity-90 ${
              currentImageIndex === 1 ? 'border-2 border-amber-400' : 'border border-slate-700/80 hover:border-slate-500'
            }`}
          >
            <img
              src={property.images[1 % property.images.length]}
              alt="Thumbnail 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* +X photos badge */}
          <div
            onClick={handleCardClick}
            className="h-10 sm:h-11 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-200 hover:text-white shadow-md cursor-pointer transition-all whitespace-nowrap"
          >
            +{totalPhotosCount > 10 ? 9 : totalPhotosCount} photos
          </div>
        </div>

        {/* Right: Price & Golden Explore Button */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
          {/* Price */}
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-white tracking-tight">€{property.pricePerNight}</span>
            <span className="text-xs text-slate-400 font-medium"> / night</span>
          </div>

          {/* Yellow Explore Button */}
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FBBF24] hover:bg-[#F59E0B] active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
