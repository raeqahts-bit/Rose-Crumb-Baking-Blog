import React, { useState } from 'react';
import { X, Scale, Calculator, Mountain, ArrowRight } from 'lucide-react';

interface BakingConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BakingConversionModal: React.FC<BakingConversionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredient' | 'butter' | 'altitude'>('ingredient');

  // Ingredient Weight State
  const [ingredient, setIngredient] = useState('all-purpose-flour');
  const [cups, setCups] = useState<number>(1);

  // Butter State
  const [butterSticks, setButterSticks] = useState<number>(1);

  // Altitude State
  const [elevation, setElevation] = useState<number>(5000);

  if (!isOpen) return null;

  // Grams per cup mapping
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

  // Butter calculations
  const butterGrams = Math.round(butterSticks * 113.4);
  const butterTablespoons = Math.round(butterSticks * 8);
  const butterCups = (butterSticks * 0.5).toFixed(2);

  // Altitude calculations
  const isHighAltitude = elevation >= 3500;
  const leavenerReduction = elevation >= 7000 ? '30% - 40%' : elevation >= 5000 ? '20% - 25%' : '15%';
  const tempIncrease = elevation >= 5000 ? '+20°F to +25°F' : '+15°F';
  const liquidIncrease = elevation >= 5000 ? '+2 to 4 tbsp per cup' : '+1 to 2 tbsp per cup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#F0E4E2] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF4F2] border-b border-[#F0E4E2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FAF2F4] text-[#A35360] rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2D2424]">
                The Baker's Precision Converter
              </h3>
              <p className="text-[11px] text-[#9C797E]">Grams, ratios &amp; atmospheric calibration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9C797E] hover:text-[#2D2424] hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#F0E4E2] bg-[#FCF9F7] px-6 pt-3 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('ingredient')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ingredient'
                ? 'border-[#A35360] text-[#A35360] font-semibold'
                : 'border-transparent text-[#655255] hover:text-[#2D2424]'
            }`}
          >
            Ingredient Weights
          </button>
          <button
            onClick={() => setActiveTab('butter')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'butter'
                ? 'border-[#A35360] text-[#A35360] font-semibold'
                : 'border-transparent text-[#655255] hover:text-[#2D2424]'
            }`}
          >
            Butter Matrix
          </button>
          <button
            onClick={() => setActiveTab('altitude')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'altitude'
                ? 'border-[#A35360] text-[#A35360] font-semibold'
                : 'border-transparent text-[#655255] hover:text-[#2D2424]'
            }`}
          >
            Altitude Calculator
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'ingredient' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Select Ingredient
                </label>
                <select
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-3 py-2 text-[#2D2424] outline-none focus:border-[#A35360]"
                >
                  {Object.entries(DENSITY_MAP).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#9C797E] mt-1 italic">
                  {DENSITY_MAP[ingredient]?.notes}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Volume (Cups)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="20"
                    value={cups}
                    onChange={(e) => setCups(parseFloat(e.target.value) || 0)}
                    className="w-28 text-center text-sm font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-3 py-2 text-[#2D2424] outline-none focus:border-[#A35360]"
                  />
                  <div className="flex gap-1.5">
                    {[0.5, 1, 1.5, 2].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setCups(preset)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
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

              {/* Conversion Result Card */}
              <div className="p-4 bg-[#FAF2F4] rounded-2xl border border-[#F0D5DA] text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#A35360] font-semibold">
                  Precise Scaled Mass
                </span>
                <div className="font-serif text-3xl font-bold text-[#2D2424] tabular-nums">
                  {calculatedGrams} grams
                </div>
                <div className="text-xs text-[#9C797E]">
                  Equivalent to <span className="font-semibold text-[#655255]">{calculatedOunces} oz</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'butter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Number of Butter Sticks (Standard US Stick)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={butterSticks}
                    onChange={(e) => setButterSticks(parseFloat(e.target.value) || 0)}
                    className="w-28 text-center text-sm font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-3 py-2 text-[#2D2424] outline-none focus:border-[#A35360]"
                  />
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((st) => (
                      <button
                        key={st}
                        onClick={() => setButterSticks(st)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
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

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#FAF4F2] border border-[#F0E4E2] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#A35360] block">Grams</span>
                  <span className="font-serif text-xl font-bold text-[#2D2424] tabular-nums">{butterGrams}g</span>
                </div>
                <div className="p-3 bg-[#FAF4F2] border border-[#F0E4E2] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#A35360] block">Tbsp</span>
                  <span className="font-serif text-xl font-bold text-[#2D2424] tabular-nums">{butterTablespoons} tbsp</span>
                </div>
                <div className="p-3 bg-[#FAF4F2] border border-[#F0E4E2] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#A35360] block">Cups</span>
                  <span className="font-serif text-xl font-bold text-[#2D2424] tabular-nums">{butterCups} c</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'altitude' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Kitchen Elevation (Feet Above Sea Level)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    max="10000"
                    value={elevation}
                    onChange={(e) => setElevation(parseInt(e.target.value) || 0)}
                    className="w-36 text-center text-sm font-semibold bg-[#FCF9F7] border border-[#E8D4D6] rounded-xl px-3 py-2 text-[#2D2424] outline-none focus:border-[#A35360]"
                  />
                  <div className="flex gap-1.5 text-xs">
                    {[3500, 5280, 7000].map((elev) => (
                      <button
                        key={elev}
                        onClick={() => setElevation(elev)}
                        className={`px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          elevation === elev
                            ? 'bg-[#A35360] text-white border-[#A35360]'
                            : 'bg-white border-[#E8D4D6] text-[#655255] hover:bg-[#F8ECEB]'
                        }`}
                      >
                        {elev === 5280 ? 'Denver (5,280ft)' : `${elev}ft`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isHighAltitude ? (
                <div className="p-4 bg-[#FAF4F2] border border-[#F0E4E2] rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#A35360] font-semibold uppercase tracking-wider text-[11px]">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>Calculated Adjustments for {elevation.toLocaleString()} ft</span>
                  </div>
                  <div className="space-y-1.5 text-[#5B494C]">
                    <div className="flex justify-between py-1 border-b border-[#F5EBE9]">
                      <span>Baking Powder / Soda:</span>
                      <strong className="text-[#A35360]">Reduce by {leavenerReduction}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F5EBE9]">
                      <span>Oven Temperature:</span>
                      <strong className="text-[#2D2424]">Increase by {tempIncrease}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F5EBE9]">
                      <span>Recipe Liquids:</span>
                      <strong className="text-[#2D2424]">Increase by {liquidIncrease}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Sugar Content:</span>
                      <strong className="text-[#2D2424]">Reduce by 1 to 2 tbsp per cup</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F6FAF7] border border-[#D5EAD9] rounded-2xl text-xs text-emerald-800">
                  At elevations under 3,000 feet, atmospheric pressure deviations are negligible. Standard sea-level baking formulas operate optimally!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF4F2] border-t border-[#F0E4E2] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A35360] hover:bg-[#8B424E] text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
