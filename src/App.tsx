/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { Footer } from './components/Footer';
import { BakingConversionModal } from './components/BakingConversionModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { ARTICLES } from './data/articles';
import { Article } from './types/blog';
import { Sparkles, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All Articles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rose_crumb_saved_articles');
      if (stored) {
        setSavedArticleIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save bookmarks to localStorage
  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedArticleIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('rose_crumb_saved_articles', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearAllBookmarks = () => {
    setSavedArticleIds([]);
    try {
      localStorage.removeItem('rose_crumb_saved_articles');
    } catch {
      // ignore
    }
  };

  // Browser History & Clean URL Slug Router
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace(/\/$/, '');
        const found = ARTICLES.find((a) => a.slug === slug);
        if (found) {
          setSelectedSlug(slug);
          return;
        }
      }
      setSelectedSlug(null);
    };

    // Check initial path on mount
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToArticle = (slug: string) => {
    setSelectedSlug(slug);
    const newPath = `/blog/${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ slug }, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setSelectedSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currently viewed article
  const currentArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return ARTICLES.find((a) => a.slug === selectedSlug) || null;
  }, [selectedSlug]);

  // Filtered articles for home listing
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === 'All Articles' || article.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.sections.some((s) => s.content.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Saved article objects
  const savedArticles = useMemo(() => {
    return ARTICLES.filter((a) => savedArticleIds.includes(a.id));
  }, [savedArticleIds]);

  // Sync document head when returning home
  useEffect(() => {
    if (!currentArticle) {
      document.title = 'Rose & Crumb | Artisanal Baking Atelier & Science Journal';
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Discover the art and precise science of baking with in-depth masterclasses, foolproof cake chemistry, sourdough fermentation guides, flaky pie crusts, and curated tools.'
        );
      }
    }
  }, [currentArticle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7] text-[#2D2424] selection:bg-[#F3C5C5] selection:text-[#5B2931]">
      
      {/* Top Header */}
      <Header
        onNavigateHome={navigateToHome}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        savedCount={savedArticleIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area: Article View OR Home Grid */}
      <div className="flex-1">
        {currentArticle ? (
          <ArticleView
            article={currentArticle}
            onBack={navigateToHome}
            onNavigateArticle={navigateToArticle}
            isSaved={savedArticleIds.includes(currentArticle.id)}
            onToggleSave={(id) => handleToggleSave(id)}
          />
        ) : (
          <div>
            {/* Hero Section */}
            <Hero
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onSelectFeatured={() =>
                navigateToArticle('science-behind-cake-failures-how-to-fix')
              }
              totalArticles={ARTICLES.length}
            />

            {/* Articles Grid Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Search or Filter Status bar if search active */}
              {searchQuery && (
                <div className="mb-8 p-4 bg-white rounded-2xl border border-[#F0E4E2] flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-[#655255]">
                    Found <span className="font-semibold text-[#A35360]">{filteredArticles.length}</span>{' '}
                    masterclass{filteredArticles.length === 1 ? '' : 'es'} matching "
                    <span className="font-medium text-[#2D2424]">{searchQuery}</span>"
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#A35360] hover:underline font-medium cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Grid of 10 articles */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelect={navigateToArticle}
                      isSaved={savedArticleIds.includes(article.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#F0E4E2] p-8 max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF2F4] text-[#A35360] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#2D2424]">No Articles Found</h3>
                  <p className="text-xs sm:text-sm text-[#655255]">
                    We couldn’t find any baking masterclasses matching "{searchQuery}" in{' '}
                    {activeCategory}.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All Articles');
                    }}
                    className="px-5 py-2.5 bg-[#A35360] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#8B424E] transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          navigateToHome();
        }}
        onNavigateArticle={navigateToArticle}
      />

      {/* Interactive Tool Modals */}
      <BakingConversionModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={navigateToArticle}
        onRemoveBookmark={(id) => handleToggleSave(id)}
        onClearAll={handleClearAllBookmarks}
      />
    </div>
  );
}
