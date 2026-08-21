import React from 'react';
import {
  Wifi,
  Laptop,
  Waves,
  Compass,
  Zap,
  Wind,
  Car,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Amenity } from '../../types/stayhub.ts';

interface AmenitiesGridProps {
  amenities: Amenity[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wifi,
  Laptop,
  Waves,
  Compass,
  Zap,
  Wind,
  Car,
  Shirt,
};

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div className="pt-3.5 pb-6 border-b border-slate-800/80 space-y-4 px-1 sm:px-0">
      <h3 className="text-xl font-extrabold text-white tracking-tight">
        What this place offers
      </h3>

      {/* 3-Column Grid matching target mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity.iconName] || Sparkles;

          return (
            <div key={amenity.id} className="flex items-center gap-4 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#121929] border border-slate-800 flex items-center justify-center text-slate-200 shadow-md flex-shrink-0 group-hover:border-rose-500/40 group-hover:text-rose-400 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-bold text-white leading-tight truncate">{amenity.name}</div>
                <div className="text-sm text-slate-400 leading-snug truncate mt-0.5">{amenity.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
