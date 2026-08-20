import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid } from 'lucide-react';

interface PropertyGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
}

export function PropertyGalleryModal({ isOpen, onClose, title, images }: PropertyGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  if (!isOpen) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0F1D]/80">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
          <p className="text-xs text-slate-400">
            {currentIndex + 1} of {images.length} photos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{viewMode === 'single' ? 'Grid View' : 'Single View'}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close photo gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8">
        {viewMode === 'single' ? (
          <div className="relative max-w-5xl w-full flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`${title} - Photo ${currentIndex + 1}`}
              className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Prev/Next Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setViewMode('single');
                }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800"
              >
                <img
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white">
                  Photo {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
