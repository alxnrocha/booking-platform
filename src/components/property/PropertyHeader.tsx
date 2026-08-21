import { useState } from 'react';
import { Share2, Heart, Star, MapPin, ChevronRight } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { PropertyGalleryModal } from './PropertyGalleryModal.tsx';

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyTitleBar({ property }: PropertyHeaderProps) {
  const { setCurrentView, toggleFavorite } = useBookingStore();
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
        <nav className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="hover:text-rose-400 transition-colors cursor-pointer"
          >
            Homes
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span>{property.country}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span>{property.location.split(',')[0]}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-none">
            {property.title}
          </span>
        </nav>

        {/* Share and Save Buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                property.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
              }`}
            />
            <span>{property.isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title & Rating Row */}
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {property.title}
          </h1>
          {property.isSuperhost && (
            <span className="px-2 py-0.5 rounded bg-[#E51D52] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              SUPERHOST
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
          <div className="flex items-center gap-1 text-rose-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-200">{property.location}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-white">{property.rating.toFixed(2)}</span>
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-slate-400 font-medium">({property.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyGallery({ property }: PropertyHeaderProps) {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const images = property.images;
  const heroImage = images[0];
  const gridImages = images.slice(1, 5);

  return (
    <div className="w-full">
      {/* 5-Photo Masonry Grid */}
      <div
        className="w-full grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-1.5 h-[350px] md:h-[450px] lg:h-[520px] xl:h-[600px]"
      >
        {/* Large Hero Photo (Left 2 columns) */}
        <div
          onClick={() => setIsGalleryModalOpen(true)}
          className="relative md:col-span-2 h-full overflow-hidden cursor-pointer group bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-700/50 shadow-xl"
        >
          <img
            src={heroImage}
            alt={`${property.title} main hero view`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 4-Grid Secondary Photos (Right 2 columns in 2x2 layout) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-1 md:gap-1.5 h-full">
          {gridImages.map((img, idx) => {
            const isLast = idx === 3;
            return (
              <div
                key={idx}
                onClick={() => setIsGalleryModalOpen(true)}
                className="relative h-full overflow-hidden cursor-pointer group bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-lg"
              >
                <img
                  src={img}
                  alt={`${property.title} shot ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Show All Photos Solid White Pill Button on the last photo */}
                {isLast && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryModalOpen(true);
                    }}
                    className="absolute bottom-3.5 right-3.5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-2xl transition-all hover:scale-105 cursor-pointer z-[2]"
                  >
                    <span>Show all {property.images.length >= 5 ? 28 : property.images.length} photos</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <PropertyGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={property.title}
        images={property.images}
      />
    </div>
  );
}
