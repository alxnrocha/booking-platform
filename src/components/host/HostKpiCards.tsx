import { TrendingUp, Users, Award, Calendar, DollarSign } from 'lucide-react';

export function HostKpiCards() {
  const kpis = [
    {
      title: 'Total Monthly Revenue',
      value: '€18,450',
      change: '+14.2%',
      isPositive: true,
      subtext: 'vs previous month',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
    {
      title: 'Occupancy Rate',
      value: '88%',
      change: '+5.4%',
      isPositive: true,
      subtext: 'vs local market avg',
      icon: Calendar,
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-500/10',
    },
    {
      title: 'Active Bookings',
      value: '12 Guests',
      change: '3 Upcoming',
      isPositive: true,
      subtext: 'Next check-in tomorrow',
      icon: Users,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10',
    },
    {
      title: 'Superhost Rating',
      value: '4.96 ★',
      change: '100% Rate',
      isPositive: true,
      subtext: '186 verified reviews',
      icon: Award,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#151E32] border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
              <div className={`p-2 rounded-xl ${kpi.iconBg} ${kpi.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold text-white tracking-tight">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                <span>{kpi.change}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">{kpi.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
