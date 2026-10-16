import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/articles';

interface HeroProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectFeatured: () => void;
  totalArticles: number;
}

export const Hero: React.FC<HeroProps> = ({
  activeCategory,
  onSelectCategory,
  onSelectFeatured,
  totalArticles,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-[#FAF4F2] via-[#FCF9F7] to-[#FCF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header Section */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A35360] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Volume IV · The Autumn Atelier Collection</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2D2424] font-medium tracking-tight leading-[1.15] text-balance">
            Where Chemical Precision Meets Pastry Artistry
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-[#655255] font-light leading-relaxed max-w-2xl">
            Baking transforms humble pantry staples into infinite comfort and delicate wonder. Explore ten rigorous, food-science masterclasses crafted for passionate home bakers.
          </p>
        </div>

        {/* Featured Campaign Showcase Card (Hero Split Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl bg-white border border-[#F0E4E2] shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden mb-12">
          
          {/* Visual Showcase (Photo) */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] overflow-hidden bg-[#FDF2F4] group">
            <img
              src="/src/assets/images/hero_baking_atelier_1791948992592.jpg"
              alt="Artisanal French baking table with freshly baked tarts, croissants, and delicate flour dusting"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 lg:hidden text-white">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Featured Masterclass</span>
              <p className="font-serif text-lg font-medium">The Science Behind Cake Failures</p>
            </div>
          </div>

          {/* Editorial Content Side */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Clean unboxed metadata with dot separators */}
              <div className="flex items-center gap-2 text-xs text-[#9C797E] font-medium">
                <span className="text-[#A35360] font-semibold">Featured Study</span>
                <span aria-hidden="true">·</span>
                <span>Cake Chemistry</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>9 min read</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2424] font-medium leading-snug group-hover:text-[#A35360] transition-colors">
                The Science Behind Cake Failures (And How to Fix Them)
              </h2>

              <p className="text-sm text-[#655255] leading-relaxed">
                Sunken centers, dense gummy bottoms, and peaked cracked domes are not bad luck—they are thermodynamic signals. Learn how protein coagulation and leavening gases race against oven convection.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-[#7B6669]">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#F8ECEB]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Camille Laurent"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-medium text-[#2D2424] block">Camille Laurent</span>
                  <span className="text-[#9C797E]">Master Pastry Chef &amp; Food Scientist</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={onSelectFeatured}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#A35360] hover:bg-[#8B424E] text-white text-xs font-semibold rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer group"
                aria-label="Read the Cake Failures and Chemistry Masterclass"
              >
                <span>Read the Cake Failures Masterclass</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Segmented Control & Filter Bar */}
        <div className="pt-4 border-t border-[#F0E4E2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-xl text-[#2D2424] font-medium">Browse Journal Volumes</h3>
              <p className="text-xs text-[#9C797E] mt-0.5">Filter all {totalArticles} peer-reviewed guides by culinary discipline</p>
            </div>

            {/* Total Articles Count */}
            <div className="text-xs text-[#655255] font-medium hidden sm:block">
              Showing <span className="text-[#A35360] font-bold">{totalArticles}</span> Published Guides
            </div>
          </div>

          {/* Functional Button Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-[#A35360] text-white shadow-xs'
                    : 'bg-white text-[#655255] hover:text-[#2D2424] hover:bg-[#F8ECEB] border border-[#EFE3E0]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
