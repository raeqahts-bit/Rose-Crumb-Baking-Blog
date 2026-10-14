import React, { useState } from 'react';
import { Bookmark, Search, Menu, X, Sparkles, Scale } from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  savedCount: number;
  onOpenBookmarks: () => void;
  onOpenConverter: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onSelectCategory,
  activeCategory,
  savedCount,
  onOpenBookmarks,
  onOpenConverter,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Journal', category: 'All Articles' },
    { label: 'Cake Chemistry', category: 'Cake Chemistry' },
    { label: 'Sourdough & Bread', category: 'Sourdough & Bread' },
    { label: 'Pastry & Pies', category: 'Pastry & Pies' },
    { label: 'Equipment & Prep', category: 'Baking Equipment' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#F0E4E2] transition-all">
      {/* Top Bar Contract: Zone 1 (Brand), Zone 2 (Nav links), Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onNavigateHome}
            className="group flex flex-col items-start text-left shrink-0 cursor-pointer focus:outline-none"
            aria-label="Rose and Crumb Home"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#2D2424] group-hover:text-[#A35360] transition-colors">
              Rose &amp; Crumb
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9C797E] font-medium -mt-1 hidden sm:block">
              Artisanal Atelier &amp; Science Journal
            </span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#655255]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onSelectCategory(link.category);
                  onNavigateHome();
                }}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer relative hover:text-[#A35360] ${
                  activeCategory === link.category
                    ? 'text-[#A35360] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#A35360]'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary action + interactive utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Inline search bar toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-white border border-[#E8D4D6] rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
                  <Search className="w-4 h-4 text-[#A35360] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search recipes, science..."
                    className="w-full text-xs text-[#2D2424] bg-transparent outline-none placeholder:text-[#A9979A]"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#9C797E] hover:text-[#2D2424] p-0.5"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#655255] hover:text-[#A35360] hover:bg-[#F8ECEB] rounded-full transition-colors cursor-pointer"
                  title="Search articles"
                  aria-label="Open search input"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Baker's Conversion Calculator Tool */}
            <button
              onClick={onOpenConverter}
              className="p-2 text-[#655255] hover:text-[#A35360] hover:bg-[#F8ECEB] rounded-full transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              title="Baker's Weight & Ratio Converter"
              aria-label="Open Baker Converter"
            >
              <Scale className="w-5 h-5" />
            </button>

            {/* Saved Bookmarks Action */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 text-[#655255] hover:text-[#A35360] hover:bg-[#F8ECEB] rounded-full transition-colors cursor-pointer"
              title="View saved articles"
              aria-label={`Saved articles (${savedCount})`}
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#A35360] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <a
              href="#newsletter"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#A35360] hover:bg-[#8B424E] rounded-full shadow-xs hover:shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              <span>Newsletter</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#655255] hover:text-[#A35360] rounded-lg cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F0E4E2] bg-[#FCF9F7] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="pt-2 pb-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search guides, science, ingredients..."
              className="w-full px-3 py-2 text-sm bg-white border border-[#E8D4D6] rounded-xl outline-none focus:border-[#A35360]"
            />
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onSelectCategory(link.category);
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === link.category
                    ? 'bg-[#F9EAE8] text-[#A35360] font-semibold'
                    : 'text-[#5B494C] hover:bg-[#F8ECEB]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#F0E4E2] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenConverter();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-[#655255] hover:text-[#A35360] py-1"
            >
              <Scale className="w-4 h-4 text-[#A35360]" />
              <span>Baker's Converter Tool</span>
            </button>

            <button
              onClick={() => {
                onOpenBookmarks();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-[#655255] hover:text-[#A35360] py-1"
            >
              <Bookmark className="w-4 h-4 text-[#A35360]" />
              <span>Saved ({savedCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
