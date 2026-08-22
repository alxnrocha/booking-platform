import { AppShell } from './components/layout/AppShell.tsx';
import { CategoryFilterBar } from './components/marketplace/CategoryFilterBar.tsx';
import { PropertyGrid } from './components/marketplace/PropertyGrid.tsx';
import { PropertyDetailView } from './components/property/PropertyDetailView.tsx';
import { MyTripsView } from './components/trips/MyTripsView.tsx';
import { HostDashboard } from './components/host/HostDashboard.tsx';
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

      {currentView === 'my-trips' && <MyTripsView />}

      {currentView === 'host-portal' && <HostDashboard />}
    </AppShell>
  );
}
