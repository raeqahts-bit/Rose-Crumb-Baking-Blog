import React, { useEffect } from 'react';
import { Bookmark, ArrowLeft, Trash2, ArrowRight } from 'lucide-react';
import { Article } from '../types/blog';

interface SavedRecipesPageProps {
  savedArticles: Article[];
  onSelectArticle: (slug: string) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onNavigateHome: () => void;
}

export const SavedRecipesPage: React.FC<SavedRecipesPageProps> = ({
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
  onNavigateHome,
}) => {
  useEffect(() => {
    document.title = 'Saved Baking Masterclasses & Bookmarked Guides | Rose & Crumb';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Review your curated library of saved baking masterclasses, cake troubleshooting formulas, and sourdough guides. Continue your weekend bakes with ease.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="min-h-screen bg-[#FCF9F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Breadcrumb with descriptive anchor text */}
        <div className="flex items-center gap-2 text-xs text-[#655255]">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#A35360] font-medium transition-colors cursor-pointer"
            aria-label="Return to Rose & Crumb Journal Homepage"
          >
            Rose &amp; Crumb Journal
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#A35360] font-semibold">Saved Masterclasses</span>
        </div>

        {/* Page Title & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F0E4E2] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A35360]">
              <Bookmark className="w-4 h-4 fill-current" />
              <span>Personal Culinary Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2424] font-medium tracking-tight">
              Saved Baking Masterclasses ({savedArticles.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#655255]">
              Your personally bookmarked test-kitchen guides and food-science formulas, saved for offline kitchen prep.
            </p>
          </div>

          {savedArticles.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-[#9C797E] hover:text-[#A35360] font-medium transition-colors self-start sm:self-auto cursor-pointer"
              aria-label="Clear all bookmarked baking masterclasses"
            >
              Clear entire archive
            </button>
          )}
        </div>

        {/* Content Grid */}
        {savedArticles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#F0E4E2] p-8 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF2F4] text-[#A35360] flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#2D2424]">Your Archive is Empty</h2>
            <p className="text-xs sm:text-sm text-[#655255]">
              As you explore our guides, click the bookmark icon to save any masterclass here for easy access at your kitchen counter.
            </p>
            <button
              onClick={onNavigateHome}
              className="px-6 py-2.5 bg-[#A35360] hover:bg-[#8B424E] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
              aria-label="Browse all baking masterclasses on the homepage"
            >
              Explore Published Masterclasses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedArticles.map((article) => (
              <div
                key={article.id}
                className="group p-5 bg-white rounded-2xl border border-[#F0E4E2] hover:border-[#E8D4D6] shadow-xs hover:shadow-md transition-all flex gap-4 items-start"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF4F2] shrink-0 border border-[#F0E4E2]">
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#A35360] tracking-wider">
                      {article.category} · {article.readTime}
                    </div>
                    <h3
                      onClick={() => onSelectArticle(article.slug)}
                      className="font-serif text-base font-medium text-[#2D2424] group-hover:text-[#A35360] transition-colors line-clamp-2 cursor-pointer mt-1"
                    >
                      {article.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF2F2]">
                    <button
                      onClick={() => onSelectArticle(article.slug)}
                      className="text-xs text-[#A35360] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      aria-label={`Open and read masterclass on ${article.title}`}
                    >
                      <span>Read guide on {article.title.split(':')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(article.id)}
                      className="p-1 text-[#9C797E] hover:text-rose-700 transition-colors cursor-pointer"
                      title="Remove from saved archive"
                      aria-label={`Remove ${article.title} from saved masterclasses`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link with descriptive anchor text */}
        <div className="text-center pt-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#655255] hover:text-[#A35360] transition-colors cursor-pointer"
            aria-label="Return to all published baking masterclasses"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Published Baking Masterclasses</span>
          </button>
        </div>

      </div>
    </main>
  );
};
