import { Star, ShieldCheck, Award, Calendar } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';

interface HostProfileCardProps {
  property: Property;
}

export function HostProfileCard({ property }: HostProfileCardProps) {
  const host = property.host;

  return (
    <div className="py-8 border-b border-slate-800/80 space-y-6 px-2 sm:px-0">
      {/* Host Profile Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={host.avatarUrl}
            alt={host.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/40 shadow-lg"
          />
          {host.isSuperhost && (
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#E51D52] text-white shadow-md">
              <Award className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
            Hosted by {host.name}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {host.isSuperhost ? 'Superhost' : 'Host'} · {host.yearsHosting} years hosting
          </p>
        </div>
      </div>

      {/* 4 Clean Stats - Inset slightly from edges with perfect icon alignment */}
      <div className="grid grid-cols-2 md:flex md:items-center md:justify-evenly gap-y-3.5 gap-x-6 sm:gap-x-12 py-3.5 px-3 sm:px-4 md:px-0 border-y border-slate-800/60">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-white">{property.reviewCount}</span>
          <span className="text-xs text-slate-400">Reviews</span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-white">{property.rating.toFixed(2)}</span>
          <span className="text-xs text-slate-400">Overall rating</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-white">Superhost</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-white">{host.yearsHosting} Years</span>
          <span className="text-xs text-slate-400">Hosting</span>
        </div>
      </div>

      {/* Description Paragraph */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {property.description}
      </p>
    </div>
  );
}
