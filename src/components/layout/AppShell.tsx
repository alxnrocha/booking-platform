import React from 'react';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { MobileBottomNav } from './MobileBottomNav.tsx';
import { useBookingStore } from '../../stores/useBookingStore.ts';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentView } = useBookingStore();
  const isPropertyDetail = currentView === 'property-detail';

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-400">
      <Navbar />
      <main 
        className={`flex-1 w-full mx-auto ${
          isPropertyDetail 
            ? 'max-w-none px-0 py-2 pb-4 md:py-6 md:pb-12' 
            : 'max-w-[1720px] px-4 sm:px-8 lg:px-12 py-6 pb-24 md:pb-12'
        }`}
      >
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
