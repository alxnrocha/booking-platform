import { AppShell } from './components/layout/AppShell.tsx';
import { useBookingStore } from './stores/useBookingStore.ts';

export default function App() {
  const { currentView } = useBookingStore();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Welcome to StayHub</h2>
          <p className="text-sm text-slate-400">Current View: {currentView}</p>
        </div>
      </div>
    </AppShell>
  );
}
