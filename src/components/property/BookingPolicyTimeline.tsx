import React from 'react';

interface BookingPolicyTimelineProps {
  cancellationDays: number;
}

export function BookingPolicyTimeline({ cancellationDays }: BookingPolicyTimelineProps) {
  const steps: { num: number; title: string; desc: React.ReactNode }[] = [
    {
      num: 1,
      title: 'Book',
      desc: 'Instant booking confirmation',
    },
    {
      num: 2,
      title: 'Check-in',
      desc: 'From 4:00 PM',
    },
    {
      num: 3,
      title: 'Check-out',
      desc: 'Until 10:00 AM',
    },
    {
      num: 4,
      title: 'Cancellation',
      desc: (
        <>
          Free cancellation
          <span className="block">up to {cancellationDays} days</span>
        </>
      ),
    },
  ];

  return (
    <div className="pt-3.5 pb-2 sm:pb-4 space-y-4 px-1 sm:px-0">
      <h3 className="text-xl font-extrabold text-white tracking-tight">
        Booking policy
      </h3>

      <div className="relative pt-2">
        {/* Glowing Gradient Connecting Progress Line */}
        <div className="absolute top-[16px] left-6 right-0 h-[2px] bg-gradient-to-r from-[#E51D52] via-[#E51D52]/50 to-transparent z-0 hidden sm:block" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
          {steps.map((step) => (
            <div key={step.num} className="space-y-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E51D52] text-white text-xs font-black flex items-center justify-center shadow-[0_0_16px_rgba(229,29,82,0.7)] ring-4 ring-[#0A0F1D]">
                {step.num}
              </div>
              <div className="pt-1 space-y-0.5">
                <div className="text-base sm:text-lg font-bold text-white leading-tight">{step.title}</div>
                <div className="text-sm text-slate-400 leading-snug">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
