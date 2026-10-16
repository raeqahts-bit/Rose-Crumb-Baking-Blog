import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '../types/blog';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (slug: string) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#F0E4E2] animate-slideInRight">
        
        {/* Drawer Header */}
        <div className="p-6 bg-[#FAF4F2] border-b border-[#F0E4E2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#A35360] fill-current" />
            <h3 className="font-serif text-xl font-medium text-[#2D2424]">
              Saved Masterclasses ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9C797E] hover:text-[#2D2424] hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF2F4] text-[#A35360] flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-[#2D2424]">No Saved Guides Yet</h4>
              <p className="text-xs text-[#9C797E] max-w-xs mx-auto">
                Click the bookmark icon on any guide or masterclass to save it here for quick reference during your weekend bakes.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="group p-4 bg-[#FCF9F7] hover:bg-white border border-[#F0E4E2] hover:border-[#E8D4D6] rounded-2xl transition-all shadow-2xs hover:shadow-xs flex gap-3 items-start"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF4F2] shrink-0 border border-[#F0E4E2]">
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#A35360]">
                    {article.category} · {article.readTime}
                  </div>
                  <h4
                    onClick={() => {
                      onSelectArticle(article.slug);
                      onClose();
                    }}
                    className="font-serif text-sm font-medium text-[#2D2424] group-hover:text-[#A35360] transition-colors line-clamp-2 cursor-pointer"
                  >
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onSelectArticle(article.slug);
                        onClose();
                      }}
                      className="text-xs text-[#A35360] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      aria-label={`Open masterclass: ${article.title}`}
                    >
                      <span>Open masterclass</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(article.id)}
                      className="text-[#9C797E] hover:text-rose-700 p-1 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 bg-[#FAF4F2] border-t border-[#F0E4E2] flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-[#9C797E] hover:text-[#A35360] transition-colors cursor-pointer"
            >
              Clear all bookmarks
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#A35360] hover:bg-[#8B424E] text-white font-medium rounded-full transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
