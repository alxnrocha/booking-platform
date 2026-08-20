interface BookingPolicyTimelineProps {
  cancellationDays: number;
}

export function BookingPolicyTimeline({ cancellationDays }: BookingPolicyTimelineProps) {
  const steps = [
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
      desc: `Free cancellation up to ${cancellationDays} days`,
    },
  ];

  return (
    <div className="py-6 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight">
        Booking policy
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
              {step.num}
            </div>
            <div className="text-xs font-bold text-white">{step.title}</div>
            <div className="text-[11px] text-slate-400 leading-snug">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
