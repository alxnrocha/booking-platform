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
    <div className="py-6 border-b border-slate-800 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">
        What this place offers
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity.iconName] || Sparkles;

          return (
            <div key={amenity.id} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#151E32] border border-slate-800 text-slate-300">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{amenity.name}</div>
                <div className="text-[11px] text-slate-400">{amenity.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
