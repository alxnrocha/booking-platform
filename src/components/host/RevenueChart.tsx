import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 9200, bookings: 7 },
  { month: 'Feb', revenue: 11400, bookings: 8 },
  { month: 'Mar', revenue: 13800, bookings: 10 },
  { month: 'Apr', revenue: 15200, bookings: 11 },
  { month: 'May', revenue: 16900, bookings: 12 },
  { month: 'Jun', revenue: 18450, bookings: 14 },
];

export function RevenueChart() {
  return (
    <div className="p-6 rounded-3xl bg-[#151E32] border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Revenue Trajectory (H1 2026)
          </h3>
          <p className="text-xs text-slate-400">
            Monthly gross earnings from confirmed luxury stays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF385C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF385C" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `€${v / 1000}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0A0F1D] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <div className="font-bold text-white">{label} 2026</div>
                      <div className="text-rose-400 font-semibold">
                        Revenue: €{payload[0].value?.toLocaleString()} EUR
                      </div>
                      <div className="text-slate-400">
                        Bookings: {payload[0].payload.bookings} completed
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF385C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
