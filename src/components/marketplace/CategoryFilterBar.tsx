import React, { useState } from 'react';
import {
  Sparkles,
  Umbrella,
  Home,
  Crown,
  Waves,
  Box,
  Trees,
  LayoutGrid,
  Sailboat,
  MountainSnow,
  Eye,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore.ts';
import { PropertyCategory } from '../../types/stayhub.ts';
import { FilterModal } from './FilterModal.tsx';

interface CategoryItem {
  name: PropertyCategory | 'All';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  { name: 'All', label: 'All Stays', icon: Sparkles },
  { name: 'Beachfront', label: 'Beachfront', icon: Umbrella },
  { name: 'Modern Cabins', label: 'Modern Cabins', icon: Home },
  { name: 'Luxury Villas', label: 'Luxury Villas', icon: Crown },
  { name: 'Infinity Pools', label: 'Infinity Pools', icon: Waves },
  { name: 'Tiny Homes', label: 'Tiny Homes', icon: Box },
  { name: 'Treehouses', label: 'Treehouses', icon: Trees },
  { name: 'Design Homes', label: 'Design Homes', icon: LayoutGrid },
  { name: 'Lakefront', label: 'Lakefront', icon: Sailboat },
  { name: 'Ski Chalets', label: 'Ski Chalets', icon: MountainSnow },
  { name: 'Amazing Views', label: 'Amazing Views', icon: Eye },
];

export function CategoryFilterBar() {
  const { category, setCategory, minPrice, maxPrice, superhostOnly, instantBookingOnly, resetFilters, destination } =
    useFilterStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeCustomFiltersCount =
    (minPrice > 0 || maxPrice < 1500 ? 1 : 0) +
    (superhostOnly ? 1 : 0) +
    (instantBookingOnly ? 1 : 0) +
    (destination ? 1 : 0) +
    (category !== 'All' ? 1 : 0);

  return (
    <div className="py-4 border-b border-slate-800/80 mb-8">
      <div className="flex items-center justify-between gap-4">
        {/* Horizontal Category Pill List */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex flex-col items-center gap-2 pb-2 px-1 border-b-2 whitespace-nowrap transition-all group focus:outline-none ${
                  isActive
                    ? 'border-rose-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 shadow-inner'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters & Reset Buttons */}
        <div className="flex items-center gap-2 pl-2 flex-shrink-0">
          {activeCustomFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              activeCustomFiltersCount > 0
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                : 'bg-[#151E32] border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeCustomFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCustomFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
}
