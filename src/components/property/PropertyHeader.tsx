import { useState } from 'react';
import { Share2, Heart, Star, MapPin, ChevronRight, Grid } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';
import { PropertyGalleryModal } from './PropertyGalleryModal.tsx';

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const { setCurrentView, toggleFavorite } = useBookingStore();
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const images = property.images;
  const heroImage = images[0];
  const gridImages = images.slice(1, 5);

  return (
    <div className="space-y-4 mb-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <button
          onClick={() => setCurrentView('marketplace')}
          className="hover:text-rose-400 transition-colors"
        >
          Homes
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span>{property.country}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300">{property.location}</span>
      </nav>

      {/* Title & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {property.title}
            </h1>
            {property.isSuperhost && (
              <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Superhost
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-medium text-white">{property.location}</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{property.rating.toFixed(2)}</span>
              <span className="text-slate-400 underline">({property.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Share and Save Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151E32] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151E32] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all active:scale-95"
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

      {/* 5-Photo Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden aspect-auto md:aspect-[2.1/1] max-h-[520px]">
        {/* Large Hero Photo (Left 2 columns on desktop) */}
        <div
          onClick={() => setIsGalleryModalOpen(true)}
          className="relative md:col-span-2 aspect-[4/3] md:aspect-auto h-full overflow-hidden cursor-pointer group bg-slate-900"
        >
          <img
            src={heroImage}
            alt={`${property.title} main hero view`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 4-Grid Secondary Photos (Right 2 columns) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {gridImages.map((img, idx) => {
            const isLast = idx === 3;
            return (
              <div
                key={idx}
                onClick={() => setIsGalleryModalOpen(true)}
                className="relative aspect-[4/3] overflow-hidden cursor-pointer group bg-slate-900 rounded-lg"
              >
                <img
                  src={img}
                  alt={`${property.title} shot ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Show All Photos Button on the last photo */}
                {isLast && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryModalOpen(true);
                    }}
                    className="absolute bottom-3 right-3 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white text-xs font-bold shadow-xl backdrop-blur-md transition-all hover:scale-105"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Show all {property.images.length} photos</span>
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
