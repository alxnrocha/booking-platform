import { Plus, Sparkles } from 'lucide-react';
import { HostKpiCards } from './HostKpiCards.tsx';
import { RevenueChart } from './RevenueChart.tsx';
import { AvailabilityCalendar } from './AvailabilityCalendar.tsx';
import { useAuthStore } from '../../stores/useAuthStore.ts';
import { useBookingStore } from '../../stores/useBookingStore.ts';

export function HostDashboard() {
  const { currentUser } = useAuthStore();
  const { properties, setSelectedPropertyId, setCurrentView } = useBookingStore();

  const hostProperties = properties.filter((p) => p.hostId === currentUser.id || currentUser.role === 'ADMIN');

  const handleManageProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentView('property-detail');
  };

  return (
    <div className="animate-in fade-in space-y-8 pb-16">
      {/* Host Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Host Management Portal
            </span>
            <span className="text-xs text-slate-400">· {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Performance Hub
          </h1>
        </div>

        <button
          onClick={() => alert('Add Listing workflow available in Host Pro Edition.')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* 4 Executive KPI Cards */}
      <HostKpiCards />

      {/* Revenue Trajectory Chart */}
      <RevenueChart />

      {/* Interactive Availability Calendar */}
      <AvailabilityCalendar />

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              My Active Listings
            </h3>
            <p className="text-xs text-slate-400">
              Properties managed under your host account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#151E32] border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      {prop.category}
                    </span>
                    <span className="text-xs font-bold text-white">
                      €{prop.pricePerNight} / night
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{prop.title}</h4>
                  <p className="text-xs text-slate-400">{prop.location}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Book Active</span>
                </div>
                <button
                  onClick={() => handleManageProperty(prop.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
