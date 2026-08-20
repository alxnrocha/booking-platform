import { AppShell } from './components/layout/AppShell.tsx';
import { CategoryFilterBar } from './components/marketplace/CategoryFilterBar.tsx';
import { PropertyGrid } from './components/marketplace/PropertyGrid.tsx';
import { PropertyDetailView } from './components/property/PropertyDetailView.tsx';
import { useBookingStore } from './stores/useBookingStore.ts';

export default function App() {
  const { currentView } = useBookingStore();

  return (
    <AppShell>
      {currentView === 'marketplace' && (
        <div>
          <CategoryFilterBar />
          <PropertyGrid />
        </div>
      )}

      {currentView === 'property-detail' && <PropertyDetailView />}

      {currentView === 'host-portal' && (
        <div className="bg-[#151E32] border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Host Management Portal</h2>
          <p className="text-slate-400 text-sm">
            Milestone 3 feature — Under active development.
          </p>
        </div>
      )}

      {currentView === 'my-trips' && (
        <div className="bg-[#151E32] border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">My Booked Trips</h2>
          <p className="text-slate-400 text-sm">
            Milestone 3 feature — Under active development.
          </p>
        </div>
      )}
    </AppShell>
  );
}
