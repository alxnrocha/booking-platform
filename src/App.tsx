export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex items-center justify-center p-6">
      <div className="glass-panel p-8 rounded-2xl max-w-lg w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">StayHub Platform</h1>
        <p className="text-slate-400 text-sm">
          Plataforma de Reservas Multiusuário & Vacation Rentals de Luxo.
        </p>
      </div>
    </div>
  );
}
