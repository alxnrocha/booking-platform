import { Bed } from 'lucide-react';
import { SleepingDetail } from '../../types/stayhub.ts';

interface BedroomCardsProps {
  sleepingDetails: SleepingDetail[];
}

export function BedroomCards({ sleepingDetails }: BedroomCardsProps) {
  return (
    <div className="py-6 border-b border-slate-800 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">
        Where you'll sleep
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sleepingDetails.map((room, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#151E32] border border-slate-800 space-y-3"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-rose-400 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>

            <div>
              <div className="text-xs font-bold text-white">{room.roomName}</div>
              <div className="text-[11px] text-slate-400">
                {room.bedCount} {room.bedType}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
