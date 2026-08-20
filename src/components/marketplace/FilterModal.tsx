import { X, Zap, ShieldCheck } from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore.ts';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const {
    minPrice,
    maxPrice,
    setPriceRange,
    superhostOnly,
    toggleSuperhostOnly,
    instantBookingOnly,
    toggleInstantBookingOnly,
    resetFilters,
  } = useFilterStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#151E32] border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Price Range (per night)</span>
              <span className="text-xs text-rose-400 font-medium">
                €{minPrice} – €{maxPrice}+
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Nightly prices before taxes and cleaning fees</p>

            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0A0F1D] border border-slate-700 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Min Price</span>
                  <span className="text-sm font-semibold text-white">€{minPrice}</span>
                </div>
                <div className="bg-[#0A0F1D] border border-slate-700 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Max Price</span>
                  <span className="text-sm font-semibold text-white">€{maxPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-800" />

          {/* Booking Options */}
          <div>
            <span className="text-sm font-semibold text-white block mb-3">Booking Options</span>
            <div className="space-y-3">
              {/* Instant Book */}
              <div
                onClick={toggleInstantBookingOnly}
                className="flex items-center justify-between p-3.5 bg-[#0A0F1D] border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Instant Book</div>
                    <div className="text-[11px] text-slate-400">Listings you can book without host approval</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={instantBookingOnly}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </div>

              {/* Superhost */}
              <div
                onClick={toggleSuperhostOnly}
                className="flex items-center justify-between p-3.5 bg-[#0A0F1D] border border-slate-700/80 rounded-xl cursor-pointer hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Superhost Only</div>
                    <div className="text-[11px] text-slate-400">Stay with recognized, highly rated hosts</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={superhostOnly}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A0F1D]/80 border-t border-slate-800">
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-slate-400 hover:text-white underline transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
