/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { BakingConversionPage } from './components/BakingConversionPage';
import { SavedRecipesPage } from './components/SavedRecipesPage';
import { Footer } from './components/Footer';
import { ARTICLES, CATEGORIES, CATEGORY_SLUG_MAP, CATEGORY_TO_SLUG } from './data/articles';
import { Article } from './types/blog';
import { Search, ArrowLeft, Sparkles, Scale, Bookmark } from 'lucide-react';

type AppRoute = 
  | { type: 'home' }
  | { type: 'article'; slug: string }
  | { type: 'category'; categorySlug: string; categoryName: string }
  | { type: 'converter' }
  | { type: 'saved' };

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);

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

  // Save/Remove bookmark
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

      if (path === '/converter') {
        setCurrentRoute({ type: 'converter' });
        return;
      }

      if (path === '/saved-recipes') {
        setCurrentRoute({ type: 'saved' });
        return;
      }

      if (path.startsWith('/category/')) {
        const catSlug = path.replace('/category/', '').replace(/\/$/, '');
        const catName = CATEGORY_SLUG_MAP[catSlug];
        if (catName) {
          setCurrentRoute({ type: 'category', categorySlug: catSlug, categoryName: catName });
          return;
        }
      }

      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace(/\/$/, '');
        const found = ARTICLES.find((a) => a.slug === slug);
        if (found) {
          setCurrentRoute({ type: 'article', slug });
          return;
        }
      }

      // Default to Home
      setCurrentRoute({ type: 'home' });
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Navigation handlers with clean URL pushing
  const navigateTo = (path: string, route: AppRoute) => {
    setCurrentRoute(route);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (slug: string) => {
    navigateTo(`/blog/${slug}`, { type: 'article', slug });
  };

  const navigateToHome = () => {
    navigateTo('/', { type: 'home' });
  };

  const navigateToCategory = (catName: string) => {
    if (catName === 'All Articles') {
      navigateToHome();
      return;
    }
    const catSlug = CATEGORY_TO_SLUG[catName] || 'cake-chemistry';
    navigateTo(`/category/${catSlug}`, {
      type: 'category',
      categorySlug: catSlug,
      categoryName: catName,
    });
  };

  const navigateToConverter = () => {
    navigateTo('/converter', { type: 'converter' });
  };

  const navigateToSaved = () => {
    navigateTo('/saved-recipes', { type: 'saved' });
  };

  // Currently viewed article
  const currentArticle = useMemo(() => {
    if (currentRoute.type !== 'article') return null;
    return ARTICLES.find((a) => a.slug === currentRoute.slug) || null;
  }, [currentRoute]);

  // Active Category Name
  const activeCategoryName = useMemo(() => {
    if (currentRoute.type === 'category') {
      return currentRoute.categoryName;
    }
    return 'All Articles';
  }, [currentRoute]);

  // Filtered articles for home & category listings
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategoryName === 'All Articles' || article.category === activeCategoryName;

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
  }, [activeCategoryName, searchQuery]);

  // Saved article objects
  const savedArticles = useMemo(() => {
    return ARTICLES.filter((a) => savedArticleIds.includes(a.id));
  }, [savedArticleIds]);

  // Document Title & Meta Description SEO Management
  useEffect(() => {
    if (currentRoute.type === 'home') {
      document.title = 'Rose & Crumb | Artisanal Baking Atelier & Science Journal';
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Master the science and art of baking with foolproof pastry guides, cake chemistry fixes, and sourdough tips. Explore expert masterclasses to elevate your bakes.'
        );
      }
    } else if (currentRoute.type === 'category') {
      document.title = `${currentRoute.categoryName} Masterclasses & Guides | Rose & Crumb`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `Explore our comprehensive ${currentRoute.categoryName.toLowerCase()} masterclasses. Understand food science formulas, troubleshooting, and techniques to elevate your baking.`
        );
      }
    }
  }, [currentRoute]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7] text-[#2D2424] selection:bg-[#F3C5C5] selection:text-[#5B2931]">
      
      {/* Top Header */}
      <Header
        onNavigateHome={navigateToHome}
        onSelectCategory={navigateToCategory}
        activeCategory={activeCategoryName}
        savedCount={savedArticleIds.length}
        onOpenBookmarks={navigateToSaved}
        onOpenConverter={navigateToConverter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        
        {/* Route 1: Article Masterclass View */}
        {currentRoute.type === 'article' && currentArticle && (
          <ArticleView
            article={currentArticle}
            onBack={navigateToHome}
            onNavigateArticle={navigateToArticle}
            isSaved={savedArticleIds.includes(currentArticle.id)}
            onToggleSave={(id) => handleToggleSave(id)}
          />
        )}

        {/* Route 2: Dedicated Baker's Math & Measurement Converter (/converter) */}
        {currentRoute.type === 'converter' && (
          <BakingConversionPage
            onBack={navigateToHome}
            onNavigateHome={navigateToHome}
          />
        )}

        {/* Route 3: Dedicated Saved Recipes Library (/saved-recipes) */}
        {currentRoute.type === 'saved' && (
          <SavedRecipesPage
            savedArticles={savedArticles}
            onSelectArticle={navigateToArticle}
            onRemoveBookmark={(id) => handleToggleSave(id)}
            onClearAll={handleClearAllBookmarks}
            onNavigateHome={navigateToHome}
          />
        )}

        {/* Route 4: Home (/) OR Category View (/category/:catSlug) */}
        {(currentRoute.type === 'home' || currentRoute.type === 'category') && (
          <div>
            {/* Hero Section */}
            {currentRoute.type === 'home' && (
              <Hero
                activeCategory={activeCategoryName}
                onSelectCategory={navigateToCategory}
                onSelectFeatured={() =>
                  navigateToArticle('science-behind-cake-failures-how-to-fix')
                }
                totalArticles={ARTICLES.length}
              />
            )}

            {/* Category Header Strip if on /category/:slug */}
            {currentRoute.type === 'category' && (
              <div className="bg-[#FAF4F2] border-b border-[#F0E4E2] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#655255]">
                    <button
                      onClick={navigateToHome}
                      className="hover:text-[#A35360] font-medium transition-colors cursor-pointer"
                      aria-label="Return to Rose and Crumb Homepage"
                    >
                      Journal Home
                    </button>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#A35360] font-semibold">{currentRoute.categoryName}</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl text-[#2D2424] font-medium tracking-tight">
                    {currentRoute.categoryName} Masterclasses
                  </h1>
                  <p className="text-sm sm:text-base text-[#655255] max-w-2xl font-light">
                    Peer-reviewed culinary science guides, precision formulas, and troubleshooting manuals focused on {currentRoute.categoryName.toLowerCase()}.
                  </p>
                </div>
              </div>
            )}

            {/* Articles Grid Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              {/* Category selector pills on Home */}
              {currentRoute.type === 'category' && (
                <div className="mb-8 flex items-center justify-between border-b border-[#F0E4E2] pb-4">
                  <button
                    onClick={navigateToHome}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A35360] hover:text-[#8B424E] transition-colors cursor-pointer"
                    aria-label="View all published baking masterclasses"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>View all published volumes</span>
                  </button>
                  <span className="text-xs text-[#9C797E] font-medium">
                    {filteredArticles.length} Masterclass{filteredArticles.length === 1 ? '' : 'es'} in {currentRoute.categoryName}
                  </span>
                </div>
              )}

              {/* Search match status bar */}
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
                    aria-label="Clear active search filter"
                  >
                    Clear search filter
                  </button>
                </div>
              )}

              {/* Grid of articles */}
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
                  <h3 className="font-serif text-2xl text-[#2D2424]">No Masterclasses Found</h3>
                  <p className="text-xs sm:text-sm text-[#655255]">
                    We couldn’t find any baking masterclasses matching "{searchQuery}" in{' '}
                    {activeCategoryName}.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      navigateToHome();
                    }}
                    className="px-5 py-2.5 bg-[#A35360] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#8B424E] transition-colors cursor-pointer"
                    aria-label="Reset all search filters and return to all masterclasses"
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
        onSelectCategory={navigateToCategory}
        onNavigateArticle={navigateToArticle}
      />

    </div>
  );
}
