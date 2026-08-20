import { Globe, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#080C17] border-t border-slate-800/80 text-slate-400 text-xs mt-20">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-sans">
                Stay<span className="text-rose-500">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Curated architectural masterpieces, cliffside villas, and luxury vacation escapes worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Explore Stays</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Beachfront Villas</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Infinity Pools</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Modern Architecture</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Private Treehouses</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Hosting</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">StayHub for Hosts</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">AirCover for Superhosts</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Hosting Resources</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Community Forum</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Trust & Safety</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Identity Verified</li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Cancellation Options</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Neighborhood Support</span></li>
              <li><span className="hover:text-rose-400 transition-colors cursor-pointer">Security Policies</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-slate-500">
            <span>© 2026 StayHub Platform, Inc.</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Sitemap</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
            <div className="text-slate-300 font-semibold">
              € EUR
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              Crafted with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> by alxnrocha
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
