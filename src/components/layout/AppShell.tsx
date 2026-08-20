import React from 'react';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { MobileBottomNav } from './MobileBottomNav.tsx';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-400">
      <Navbar />
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 pb-24 md:pb-12">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
