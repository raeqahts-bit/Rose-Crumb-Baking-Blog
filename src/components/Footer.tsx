import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Heart, Mail } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onNavigateArticle: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigateArticle }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer id="newsletter" className="bg-[#FAF4F2] border-t border-[#EFE3E0] mt-24">
      {/* Newsletter Curated Dispatch Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 border-b border-[#E8DAD7]">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#A35360]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Weekend Baker’s Letter</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2424] font-medium tracking-tight">
            Elevate Your Baking Intuition
          </h2>
          <p className="text-sm sm:text-base text-[#6F5C60] max-w-xl mx-auto font-light leading-relaxed">
            Delivered every Friday morning: seasonal formulas, crumb troubleshooting guides, and test-kitchen discoveries straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-[#EAF5EE] border border-[#C5E5D0] text-[#28643C] rounded-full text-xs font-medium animate-fadeIn">
                <Check className="w-4 h-4 text-[#28643C]" />
                <span>Merci! You are now subscribed to the weekend dispatch.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-[#E3D1CF] rounded-full shadow-xs focus-within:border-[#A35360] focus-within:ring-2 focus-within:ring-[#A35360]/10 transition-all">
                <div className="flex items-center pl-3.5 w-full">
                  <Mail className="w-4 h-4 text-[#A9979A] shrink-0 mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for the weekly bake..."
                    className="w-full text-xs sm:text-sm text-[#2D2424] bg-transparent outline-none placeholder:text-[#A9979A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#A35360] hover:bg-[#8B424E] text-white text-xs font-medium rounded-full shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-[#A9979A] mt-2">Zero spam. Pure food chemistry &amp; pastry artistry. Unsubscribe anytime.</p>
          </form>
        </div>
      </div>

      {/* Editorial Manifesto: Exact Prompt Baking Topic Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Brand & Editorial Description */}
          <div className="lg:col-span-6 space-y-4">
            <span className="font-serif text-2xl text-[#2D2424] tracking-tight block">
              Rose &amp; Crumb
            </span>
            <p className="text-xs uppercase tracking-widest text-[#A35360] font-semibold">
              The Art &amp; Science of Baking
            </p>
            <div className="text-sm text-[#5B494C] space-y-3 font-normal leading-relaxed">
              <p>
                Baking is both an art and a precise science, transforming humble pantry staples—flour, sugar, eggs, butter, and leaveners—into an infinite variety of comfort foods and delicate treats. At its core, baking relies on chemical reactions: proteins build structure, fats create tenderness, and heat activates agents that allow doughs and batters to rise into airy breads, flaky pastries, decadent cakes, and chewy cookies.
              </p>
              <p>
                Beyond the chemistry, baking is a sensory and emotional experience. The process invites mindfulness, from the tactile feedback of kneading bread dough to the rewarding aroma that fills a kitchen as a fresh batch warms in the oven. It bridges traditions and cultures across the globe, serving as a cornerstone for celebrations, daily meals, and shared gatherings.
              </p>
              <p>
                Whether you are mastering delicate technical creations like French macarons or whipping up a simple batch of chocolate chip cookies, baking blends creative expression with culinary discipline—offering a deeply satisfying journey from raw ingredients to warm, shared moments.
              </p>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2424]">
              Explore Topics
            </h4>
            <ul className="space-y-2 text-sm text-[#655255]">
              <li>
                <button
                  onClick={() => onSelectCategory('Cake Chemistry')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                >
                  Cake Chemistry &amp; Structure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Ingredients & Prep')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                >
                  Ingredients, Dairy &amp; Substitutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Sourdough & Bread')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                >
                  Sourdough &amp; Fermentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Pastry & Pies')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                >
                  Pastry, Pies &amp; Lamination
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Baking Equipment')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                >
                  Equipment &amp; Kitchen Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Decorating & Science')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left"
                  aria-label="Browse Botanical Colorings and Macaron guides"
                >
                  Botanical Colorings &amp; Macarons
                </button>
              </li>
              <li className="pt-2 border-t border-[#E8DAD7]">
                <a
                  href="/converter"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', '/converter');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left font-medium block"
                  aria-label="Open Baker's Precision Weight and Measurement Converter"
                >
                  Baker's Weight &amp; Ratio Converter
                </a>
              </li>
              <li>
                <a
                  href="/saved-recipes"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', '/saved-recipes');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left font-medium block"
                  aria-label="View your personal saved recipes archive"
                >
                  Personal Recipe Archive
                </a>
              </li>
            </ul>
          </div>

          {/* Recommended Masterclasses */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2424]">
              Featured Masterclasses
            </h4>
            <ul className="space-y-2.5 text-xs text-[#655255]">
              <li>
                <button
                  onClick={() => onNavigateArticle('science-behind-cake-failures-how-to-fix')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left block"
                >
                  <span className="font-medium text-[#2D2424] block hover:text-[#A35360]">The Science Behind Cake Failures</span>
                  <span className="text-[#9C797E]">Crumb analysis &amp; leavener fixes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateArticle('mastering-sourdough-starter-7-day-guide')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left block"
                >
                  <span className="font-medium text-[#2D2424] block hover:text-[#A35360]">7-Day Sourdough Starter Guide</span>
                  <span className="text-[#9C797E]">Cultivate wild yeasts &amp; lactobacilli</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateArticle('beginners-guide-french-macarons-french-vs-italian')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left block"
                >
                  <span className="font-medium text-[#2D2424] block hover:text-[#A35360]">French vs. Italian Macarons</span>
                  <span className="text-[#9C797E]">Ruffled feet &amp; hollow shell cures</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateArticle('secrets-to-flaky-pie-crusts-every-single-time')}
                  className="hover:text-[#A35360] transition-colors cursor-pointer text-left block"
                >
                  <span className="font-medium text-[#2D2424] block hover:text-[#A35360]">Flaky Butter Pie Crusts</span>
                  <span className="text-[#9C797E]">Steam pocket lamination secrets</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-16 pt-8 border-t border-[#E8DAD7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9C797E] gap-4">
          <p>© {new Date().getFullYear()} Rose &amp; Crumb Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Clean, food science-grounded culinary journalism</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-[#A35360]">
              <span>Baked with</span>
              <Heart className="w-3 h-3 fill-[#A35360]" />
              <span>and culinary precision</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
