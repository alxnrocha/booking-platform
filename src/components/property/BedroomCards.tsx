import { BedDouble, BedSingle, Crown, Check } from 'lucide-react';
import { SleepingDetail } from '../../types/stayhub.ts';

interface BedroomCardsProps {
  sleepingDetails: SleepingDetail[];
}

interface RoomMeta {
  Icon: typeof Crown;
  tag: string;
  features: string[];
}

function getRoomMeta(roomName: string, idx: number): RoomMeta {
  const name = roomName.toLowerCase();
  if (name.includes('master') || idx === 0) {
    return {
      Icon: Crown,
      tag: 'Master Suite',
      features: ['Ensuite bathroom', 'Panoramic balcony view', 'King size mattress'],
    };
  }
  if (name.includes('guest') || name.includes('suite') || idx === 1) {
    return {
      Icon: BedDouble,
      tag: 'Deluxe Suite',
      features: ['Smart 4K TV', 'Silent air conditioning', 'Organic cotton linens'],
    };
  }
  return {
    Icon: BedSingle,
    tag: 'Twin Suite',
    features: ['Blackout curtains', 'High-speed Wi-Fi', 'Bedside USB charging'],
  };
}

export function BedroomCards({ sleepingDetails }: BedroomCardsProps) {
  return (
    <div className="pt-5 pb-8 border-b border-slate-800/80 space-y-5 px-1 sm:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Where you'll sleep
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {sleepingDetails.length} private bedrooms configured for maximum comfort
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sleepingDetails.map((room, idx) => {
          const { Icon, tag, features } = getRoomMeta(room.roomName, idx);

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#121929] border border-slate-800 hover:border-slate-700 space-y-4 shadow-lg transition-all group flex flex-col justify-between"
            >
              {/* Top Row: Lucide Icon + Room Type Tag */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#080D1A] border border-slate-800 flex items-center justify-center text-slate-200 shadow-sm group-hover:border-rose-500/40 group-hover:text-rose-400 transition-colors">
                  <Icon className="w-6 h-6 text-rose-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 bg-[#080D1A] px-2.5 py-1 rounded-lg border border-slate-800 tracking-wider uppercase">
                  {tag}
                </span>
              </div>

              {/* Title & Main Bed Info */}
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold text-white leading-tight">
                  {room.roomName}
                </div>
                <div className="text-sm font-semibold text-rose-400/90 leading-snug">
                  {room.bedCount} {room.bedType}
                </div>
              </div>

              {/* Contextual Room Perks & Details */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
