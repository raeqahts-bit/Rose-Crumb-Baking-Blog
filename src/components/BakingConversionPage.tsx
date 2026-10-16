import React, { useState, useEffect } from 'react';
import { Scale, ArrowLeft, Mountain, CheckCircle2, Info } from 'lucide-react';

interface BakingConversionPageProps {
  onBack: () => void;
  onNavigateHome: () => void;
}

export const BakingConversionPage: React.FC<BakingConversionPageProps> = ({
  onBack,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredient' | 'butter' | 'altitude'>('ingredient');
  const [ingredient, setIngredient] = useState('all-purpose-flour');
  const [cups, setCups] = useState<number>(1);
  const [butterSticks, setButterSticks] = useState<number>(1);
  const [elevation, setElevation] = useState<number>(5000);

  useEffect(() => {
    document.title = 'Baker’s Precision Weight & Measurement Converter | Rose & Crumb';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Convert baking cups to precise grams for flour, sugar, and butter, and calculate high-altitude oven adjustments. Elevate your baking accuracy today.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const DENSITY_MAP: Record<string, { label: string; gramsPerCup: number; notes: string }> = {
    'all-purpose-flour': { label: 'All-Purpose Flour (unbleached)', gramsPerCup: 120, notes: 'Spoon-and-sweep standard density' },
    'bread-flour': { label: 'Bread Flour (High Protein)', gramsPerCup: 130, notes: 'Higher gluten density' },
    'cake-flour': { label: 'Cake Flour (Low Protein)', gramsPerCup: 114, notes: 'Silky, fine starch sifted' },
    'granulated-sugar': { label: 'Granulated White Sugar', gramsPerCup: 200, notes: 'Standard refined sucrose' },
    'brown-sugar': { label: 'Brown Sugar (firmly packed)', gramsPerCup: 213, notes: 'Includes molasses hydration' },
    'powdered-sugar': { label: 'Confectioners / Powdered Sugar', gramsPerCup: 120, notes: 'Contains 3% cornstarch' },
    'cocoa-powder': { label: 'Dutch-Process Cocoa Powder', gramsPerCup: 100, notes: 'Alkalized unsweetened cocoa' },
    'rolled-oats': { label: 'Old-Fashioned Rolled Oats', gramsPerCup: 90, notes: 'Whole oat groat flakes' },
    'almond-flour': { label: 'Super-Fine Blanched Almond Flour', gramsPerCup: 96, notes: 'Macaron standard grind' },
  };

  const calculatedGrams = Math.round(cups * (DENSITY_MAP[ingredient]?.gramsPerCup || 120));
  const calculatedOunces = (calculatedGrams / 28.3495).toFixed(1);

  const butterGrams = Math.round(butterSticks * 113.4);
  const butterTablespoons = Math.round(butterSticks * 8);
  const butterCups = (butterSticks * 0.5).toFixed(2);

  const isHighAltitude = elevation >= 3500;
  const leavenerReduction = elevation >= 7000 ? '30% - 40%' : elevation >= 5000 ? '20% - 25%' : '15%';
  const tempIncrease = elevation >= 5000 ? '+20°F to +25°F' : '+15°F';
  const liquidIncrease = elevation >= 5000 ? '+2 to 4 tbsp per cup' : '+1 to 2 tbsp per cup';

  return (
    <main className="min-h-screen bg-[#FCF9F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb with descriptive anchor text */}
        <div className="flex items-center gap-2 text-xs text-[#655255]">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#A35360] font-medium transition-colors cursor-pointer"
            aria-label="Return to Rose & Crumb Journal Homepage"
          >
            Rose &amp; Crumb Journal
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#A35360] font-semibold">Baker's Precision Converter</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A35360]">
            <Scale className="w-4 h-4" />
            <span>Culinary Math &amp; Measurements</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2D2424] font-medium tracking-tight">
            The Baker's Precision Weight &amp; Ratio Converter
          </h1>
          <p className="text-sm sm:text-base text-[#655255] font-light leading-relaxed">
            Eliminate cup-measuring discrepancies, convert butter units seamlessly, and calculate barometric altitude adjustments for foolproof baking results.
          </p>
        </div>

        {/* Dedicated Calculator Card */}
        <div className="bg-white rounded-3xl border border-[#F0E4E2] shadow-xs overflow-hidden">
          
          {/* Functional Tabs */}
          <div className="flex border-b border-[#F0E4E2] bg-[#FAF4F2] px-6 pt-4 gap-4 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('ingredient')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'ingredient'
                  ? 'border-[#A35360] text-[#A35360] font-semibold'
                  : 'border-transparent text-[#655255] hover:text-[#2D2424]'
              }`}
            >
              Ingredient Gram Conversions
            </button>
            <button
              onClick={() => setActiveTab('butter')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'butter'
                  ? 'border-[#A35360] text-[#A35360] font-semibold'
                  : 'border-transparent text-[#655255] hover:text-[#2D2424]'
              }`}
            >
              Butter Mass &amp; Volume Matrix
            </button>
            <button
              onClick={() => setActiveTab('altitude')}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'altitude'
                  ? 'border-[#A35360] text-[#A35360] font-semibold'
                  : 'border-transparent text-[#655255] hover:text-[#2D2424]'
              }`}
            >
              High-Altitude Leavening Formula
            </button>
          </div>

          {/* Calculator Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {activeTab === 'ingredient' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2424] mb-2 uppercase tracking-wider">
                    Select Dry Ingredient
                  </label>
                  <select
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    className="w-full text-sm sm:text-base bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-4 py-3 text-[#2D2424] outline-none focus:border-[#A35360] transition-colors"
                  >
                    {Object.entries(DENSITY_MAP).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label} ({item.gramsPerCup}g per cup)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#9C797E] mt-1.5 italic">
                    Density specification: {DENSITY_MAP[ingredient]?.notes}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2424] mb-2 uppercase tracking-wider">
                    Volume in US Cups
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="20"
                      value={cups}
                      onChange={(e) => setCups(parseFloat(e.target.value) || 0)}
                      className="w-32 text-center text-lg font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-4 py-2.5 text-[#2D2424] outline-none focus:border-[#A35360]"
                    />
                    <div className="flex gap-2">
                      {[0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setCups(preset)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            cups === preset
                              ? 'bg-[#A35360] text-white border-[#A35360]'
                              : 'bg-white border-[#E8D4D6] text-[#655255] hover:bg-[#F8ECEB]'
                          }`}
                        >
                          {preset}c
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scaled Result Display */}
                <div className="p-6 bg-[#FAF2F4] rounded-2xl border border-[#F0D5DA] text-center space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#A35360] font-bold">
                    Target Scaled Weight
                  </span>
                  <div className="font-serif text-4xl sm:text-5xl font-bold text-[#2D2424] tabular-nums">
                    {calculatedGrams} grams
                  </div>
                  <p className="text-xs sm:text-sm text-[#655255]">
                    Equivalent to <strong className="text-[#2D2424]">{calculatedOunces} ounces</strong> on digital kitchen scales.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'butter' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2424] mb-2 uppercase tracking-wider">
                    Quantity of Butter Sticks (Standard 4 oz US Stick)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={butterSticks}
                      onChange={(e) => setButterSticks(parseFloat(e.target.value) || 0)}
                      className="w-32 text-center text-lg font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-4 py-2.5 text-[#2D2424] outline-none focus:border-[#A35360]"
                    />
                    <div className="flex gap-2">
                      {[0.5, 1, 1.5, 2, 3, 4].map((st) => (
                        <button
                          key={st}
                          onClick={() => setButterSticks(st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            butterSticks === st
                              ? 'bg-[#A35360] text-white border-[#A35360]'
                              : 'bg-white border-[#E8D4D6] text-[#655255] hover:bg-[#F8ECEB]'
                          }`}
                        >
                          {st} stick{st > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-5 bg-[#FAF4F2] border border-[#F0E4E2] rounded-2xl space-y-1">
                    <span className="text-xs uppercase font-bold text-[#A35360] tracking-wider block">Grams</span>
                    <span className="font-serif text-3xl font-bold text-[#2D2424] tabular-nums">{butterGrams}g</span>
                    <span className="text-[11px] text-[#9C797E] block">Pure weighed metric mass</span>
                  </div>
                  <div className="p-5 bg-[#FAF4F2] border border-[#F0E4E2] rounded-2xl space-y-1">
                    <span className="text-xs uppercase font-bold text-[#A35360] tracking-wider block">Tablespoons</span>
                    <span className="font-serif text-3xl font-bold text-[#2D2424] tabular-nums">{butterTablespoons} tbsp</span>
                    <span className="text-[11px] text-[#9C797E] block">1 stick = 8 standard tbsp</span>
                  </div>
                  <div className="p-5 bg-[#FAF4F2] border border-[#F0E4E2] rounded-2xl space-y-1">
                    <span className="text-xs uppercase font-bold text-[#A35360] tracking-wider block">Volume in Cups</span>
                    <span className="font-serif text-3xl font-bold text-[#2D2424] tabular-nums">{butterCups} cups</span>
                    <span className="text-[11px] text-[#9C797E] block">1/2 cup per stick</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'altitude' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2424] mb-2 uppercase tracking-wider">
                    Kitchen Elevation (Feet Above Sea Level)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      step="500"
                      min="1000"
                      max="10000"
                      value={elevation}
                      onChange={(e) => setElevation(parseInt(e.target.value) || 0)}
                      className="w-40 text-center text-lg font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-4 py-2.5 text-[#2D2424] outline-none focus:border-[#A35360]"
                    />
                    <div className="flex gap-2">
                      {[3500, 5280, 7000].map((elev) => (
                        <button
                          key={elev}
                          onClick={() => setElevation(elev)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            elevation === elev
                              ? 'bg-[#A35360] text-white border-[#A35360]'
                              : 'bg-white border-[#E8D4D6] text-[#655255] hover:bg-[#F8ECEB]'
                          }`}
                        >
                          {elev === 5280 ? 'Denver (5,280 ft)' : `${elev.toLocaleString()} ft`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {isHighAltitude ? (
                  <div className="p-6 bg-[#FAF4F2] border border-[#F0E4E2] rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-[#A35360] font-semibold text-sm">
                      <Mountain className="w-5 h-5" />
                      <span>Recommended Adjustments for {elevation.toLocaleString()} Feet</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 bg-white rounded-xl border border-[#F0E4E2] space-y-1">
                        <span className="text-[#9C797E] text-xs font-medium block">Baking Powder / Soda:</span>
                        <strong className="text-[#A35360] text-base block">Reduce by {leavenerReduction}</strong>
                        <span className="text-[11px] text-[#655255]">Prevents over-rapid bubble rupture</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#F0E4E2] space-y-1">
                        <span className="text-[#9C797E] text-xs font-medium block">Oven Temperature:</span>
                        <strong className="text-[#2D2424] text-base block">Increase by {tempIncrease}</strong>
                        <span className="text-[11px] text-[#655255]">Sets protein structure faster</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#F0E4E2] space-y-1">
                        <span className="text-[#9C797E] text-xs font-medium block">Recipe Liquids:</span>
                        <strong className="text-[#2D2424] text-base block">Increase by {liquidIncrease}</strong>
                        <span className="text-[11px] text-[#655255]">Compensates for rapid atmospheric evaporation</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-[#F0E4E2] space-y-1">
                        <span className="text-[#9C797E] text-xs font-medium block">Granulated Sugar:</span>
                        <strong className="text-[#2D2424] text-base block">Decrease by 1 to 2 tbsp per cup</strong>
                        <span className="text-[11px] text-[#655255]">Avoids weakening fragile gluten networks</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[#F6FAF7] border border-[#D5EAD9] rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>At elevations under 3,000 feet, sea-level baking ratios remain optimal. No formula adjustments needed.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Link with descriptive anchor text */}
        <div className="text-center pt-4">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#655255] hover:text-[#A35360] transition-colors cursor-pointer"
            aria-label="Return to all baking masterclasses"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Baking Masterclasses &amp; Guides</span>
          </button>
        </div>

      </div>
    </main>
  );
};
