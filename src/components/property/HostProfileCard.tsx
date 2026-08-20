import { Star, ShieldCheck, Award, Calendar } from 'lucide-react';
import { Property } from '../../types/stayhub.ts';

interface HostProfileCardProps {
  property: Property;
}

export function HostProfileCard({ property }: HostProfileCardProps) {
  const host = property.host;

  return (
    <div className="py-6 border-b border-slate-800 space-y-6">
      {/* Host Profile Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={host.avatarUrl}
            alt={host.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/40"
          />
          {host.isSuperhost && (
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-rose-500 text-white shadow-md">
              <Award className="w-3 h-3" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            Hosted by {host.name}
          </h3>
          <p className="text-xs text-slate-400">
            {host.isSuperhost ? 'Superhost' : 'Host'} · {host.yearsHosting} years hosting
          </p>
        </div>
      </div>

      {/* 4 Metric Badges matching mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#151E32] border border-slate-800">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <div>
            <div className="text-xs font-bold text-white">{property.reviewCount}</div>
            <div className="text-[10px] text-slate-400">Reviews</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#151E32] border border-slate-800">
          <Award className="w-4 h-4 text-rose-400" />
          <div>
            <div className="text-xs font-bold text-white">{property.rating.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400">Overall rating</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#151E32] border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">Superhost</div>
            <div className="text-[10px] text-slate-400">Verified identity</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#151E32] border border-slate-800">
          <Calendar className="w-4 h-4 text-sky-400" />
          <div>
            <div className="text-xs font-bold text-white">{host.yearsHosting} Years</div>
            <div className="text-[10px] text-slate-400">Hosting experience</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {property.description}
      </p>
    </div>
  );
}
