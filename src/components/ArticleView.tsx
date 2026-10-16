import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Printer,
  Clock,
  Calendar,
  Check,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Star,
  Copy,
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Type
} from 'lucide-react';
import { Article } from '../types/blog';
import { ARTICLES } from '../data/articles';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onNavigateArticle: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onNavigateArticle,
  isSaved,
  onToggleSave,
}) => {
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [productToast, setProductToast] = useState<string | null>(null);

  // Scroll spy & reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check sections for active TOC
      const sectionElements = article.sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 160;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveHeading(article.sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  // Dynamic SEO & Structured Data (Applet SEO Skill)
  useEffect(() => {
    document.title = `${article.metaTitle} | Rose & Crumb`;

    // Meta description update
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.metaDescription);
    }

    // Canonical link update
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('content', `${window.location.origin}/blog/${article.slug}`);

    // Schema.org Article and FAQPage JSON-LD
    const jsonLdScriptId = 'article-json-ld';
    let script = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${window.location.origin}/blog/${article.slug}#article`,
          headline: article.title,
          description: article.metaDescription,
          datePublished: '2026-10-10T08:00:00+00:00',
          dateModified: '2026-10-12T10:00:00+00:00',
          author: {
            '@type': 'Person',
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Rose & Crumb',
            logo: {
              '@type': 'ImageObject',
              url: typeof article.coverImage === 'string' && article.coverImage.startsWith('http') ? article.coverImage : `${window.location.origin}${article.coverImage}`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${window.location.origin}/blog/${article.slug}`,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${window.location.origin}/blog/${article.slug}#faq`,
          mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };

    script.textContent = JSON.stringify(structuredData);

    // Scroll to top upon opening article
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      // Clean up script on unmount
      const existing = document.getElementById(jsonLdScriptId);
      if (existing) existing.remove();
    };
  }, [article]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnSocial = (platform: 'twitter' | 'facebook' | 'pinterest') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    let shareUrl = '';

    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'pinterest') {
      shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=500');
  };

  const handleProductClick = (productName: string) => {
    setProductToast(`Redirecting to verified supplier for "${productName}"...`);
    setTimeout(() => setProductToast(null), 3000);
  };

  // Find related articles
  const relatedArticles = ARTICLES.filter((a) =>
    article.relatedSlugIds.includes(a.slug)
  ).slice(0, 3);

  // Font size classes
  const proseSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="min-h-screen bg-[#FCF9F7]">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F5E6E8] z-50">
        <div
          className="h-full bg-[#A35360] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Utility Bar */}
      <div className="sticky top-20 z-30 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#F0E4E2] py-3 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#655255] hover:text-[#A35360] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Journal</span>
          </button>

          {/* Reading Actions: Font size, Print, Share, Bookmark */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-[#E8D4D6] rounded-full px-2 py-1 text-[#655255]">
              <Type className="w-3.5 h-3.5 text-[#9C797E] mr-1" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-[#A35360] text-white' : 'hover:text-[#A35360]'
                }`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  fontSize === 'large' ? 'bg-[#A35360] text-white' : 'hover:text-[#A35360]'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  fontSize === 'xlarge' ? 'bg-[#A35360] text-white' : 'hover:text-[#A35360]'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Print Recipe / Guide */}
            <button
              onClick={() => window.print()}
              className="p-2 text-[#655255] hover:text-[#A35360] hover:bg-[#F8ECEB] rounded-full transition-colors cursor-pointer"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Link / Share */}
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8D4D6] hover:border-[#A35360] text-[#655255] hover:text-[#A35360] rounded-full transition-all cursor-pointer shadow-xs"
              title="Copy link to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleSave(article.id)}
              className={`p-2 rounded-full transition-all cursor-pointer shadow-xs ${
                isSaved
                  ? 'bg-[#A35360] text-white'
                  : 'bg-white border border-[#E8D4D6] text-[#655255] hover:text-[#A35360]'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save article'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Editorial Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#9C797E] font-medium">
            <span className="text-[#A35360] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.difficulty} Level</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{article.publishedDate}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2D2424] font-medium tracking-tight leading-[1.18] text-balance">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-[#655255] font-light leading-relaxed max-w-3xl mx-auto">
            {article.subtitle}
          </p>

          {/* Author Byline */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E8D4D6]"
              referrerPolicy="no-referrer"
            />
            <div className="text-left text-xs">
              <span className="font-medium text-[#2D2424] block">{article.author.name}</span>
              <span className="text-[#9C797E]">{article.author.role}</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Photography */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#F0E4E2] bg-white shadow-xs mb-16">
          <div className="relative aspect-[16/9] w-full bg-[#FAF4F2]">
            <img
              src={article.coverImage}
              alt={article.coverImageAlt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </div>
          <div className="p-3 bg-[#FAF4F2] text-center border-t border-[#F0E4E2]">
            <p className="text-xs text-[#9C797E] italic font-serif">
              {article.coverImageAlt} — Test Kitchen Archive Collection
            </p>
          </div>
        </div>

        {/* 2-Column Editorial Reading Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-36 space-y-6 self-start no-print">
            <div className="p-6 bg-white rounded-2xl border border-[#F0E4E2] shadow-xs">
              <h3 className="font-serif text-base font-semibold text-[#2D2424] mb-3 pb-2 border-b border-[#F5EBE9]">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs">
                {article.sections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(section.id);
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 130;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                    className={`block py-1 pl-2 border-l-2 transition-all ${
                      activeHeading === section.id
                        ? 'border-[#A35360] text-[#A35360] font-semibold pl-3'
                        : 'border-transparent text-[#655255] hover:text-[#2D2424]'
                    }`}
                  >
                    <span className="text-[#9C797E] mr-1.5">{String(idx + 1).padStart(2, '0')}.</span>
                    {section.title}
                  </a>
                ))}
                <a
                  href="#recommendations"
                  className="block py-1 pl-2 border-l-2 border-transparent text-[#655255] hover:text-[#2D2424]"
                >
                  Product Recommendations
                </a>
                <a
                  href="#pros-and-cons"
                  className="block py-1 pl-2 border-l-2 border-transparent text-[#655255] hover:text-[#2D2424]"
                >
                  Pros &amp; Cons Analysis
                </a>
                <a
                  href="#faqs"
                  className="block py-1 pl-2 border-l-2 border-transparent text-[#655255] hover:text-[#2D2424]"
                >
                  Frequently Asked Questions
                </a>
              </nav>
            </div>

            {/* Quick Baker's Note */}
            <div className="p-5 bg-[#FAF4F2] rounded-2xl border border-[#F0E4E2] text-xs text-[#655255] space-y-2">
              <div className="flex items-center gap-1.5 text-[#A35360] font-semibold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Kitchen Verified</span>
              </div>
              <p>
                Every formula, temperature, and ratio in this masterclass was tested 3+ times in both conventional and convection home ovens.
              </p>
            </div>
          </aside>

          {/* Right Column: In-Depth Article Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Sections */}
            {article.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-36 space-y-5">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2424] font-medium tracking-tight">
                  {section.title}
                </h2>

                {/* Body Prose with Drop Cap on first section */}
                <div
                  className={`text-[#3A2F31] font-light space-y-4 ${proseSizeClasses} ${
                    index === 0 ? 'editorial-drop-cap' : ''
                  }`}
                >
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Optional Mid-Section Step-by-Step Image */}
                {section.image && (
                  <div className="rounded-2xl overflow-hidden border border-[#F0E4E2] bg-white shadow-xs my-6">
                    <img
                      src={section.image}
                      alt={section.imageAlt || article.coverImageAlt}
                      className="w-full aspect-[16/9] object-cover"
                      loading="lazy"
                    />
                    {section.imageCaption && (
                      <p className="p-3 text-xs text-[#9C797E] bg-[#FAF4F2] italic font-serif text-center border-t border-[#F0E4E2]">
                        {section.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Callout Box if present */}
                {section.callout && (
                  <div
                    className={`p-5 rounded-2xl border ${
                      section.callout.type === 'science'
                        ? 'bg-[#FAF4F8] border-[#E8D0DF] text-[#4A2840]'
                        : section.callout.type === 'warning'
                        ? 'bg-[#FFF9F5] border-[#FCE2D4] text-[#7A3E1E]'
                        : 'bg-[#F4F9F6] border-[#D1EADB] text-[#1E5236]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs uppercase tracking-wider">
                      {section.callout.type === 'science' && <Sparkles className="w-4 h-4 text-[#A35360]" />}
                      {section.callout.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {section.callout.type === 'tip' && <Lightbulb className="w-4 h-4 text-emerald-600" />}
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal opacity-95">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Key Bullet Tips if present */}
                {section.tips && (
                  <div className="p-5 bg-white rounded-2xl border border-[#F0E4E2] space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A35360] block">
                      Key Kitchen Rules
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#5B494C]">
                      {section.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#A35360] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}

            {/* Product Recommendations Module */}
            <section id="recommendations" className="scroll-mt-36 pt-8 border-t border-[#F0E4E2] space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#A35360] mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Curated Kitchen Gear</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2424] font-medium">
                  Tested Equipment &amp; Product Recommendations
                </h2>
                <p className="text-xs sm:text-sm text-[#655255] mt-1">
                  Tools rigorously tested in our test kitchen to ensure repeatability, heat conductivity, and long-term durability.
                </p>
              </div>

              <div className="space-y-4">
                {article.productRecommendations.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 sm:p-6 bg-white rounded-2xl border border-[#F0E4E2] shadow-xs hover:border-[#E8D4D6] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        {prod.badge && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A35360] bg-[#FAF2F4] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                            {prod.badge}
                          </span>
                        )}
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#2D2424]">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-[#9C797E] font-medium">{prod.brand}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-base sm:text-lg font-serif font-bold text-[#A35360] tabular-nums block">
                          {prod.price}
                        </span>
                        <div className="flex items-center sm:justify-end gap-1 text-[11px] text-[#A9979A]">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span>({prod.reviewsCount.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5B494C] leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FCF9F7] p-3.5 rounded-xl border border-[#F5EBE9]">
                      <div>
                        <span className="font-semibold text-[#2D2424] block mb-1">Key Strengths:</span>
                        <ul className="space-y-1 text-[#655255]">
                          {prod.pros.map((p, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-[#2D2424] block mb-1">Ideal For:</span>
                        <p className="text-[#655255] italic">{prod.idealFor}</p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-[#A9979A]">Verified Kitchen Tested</span>
                      <button
                        onClick={() => handleProductClick(prod.name)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#A35360] hover:bg-[#8B424E] text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
                      >
                        <span>Check Availability</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pros and Cons Component */}
            <section id="pros-and-cons" className="scroll-mt-36 pt-8 border-t border-[#F0E4E2] space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#A35360] block mb-1">
                  Comparative Analysis
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2424] font-medium">
                  {article.prosCons.title}
                </h2>
                {article.prosCons.description && (
                  <p className="text-xs sm:text-sm text-[#655255] mt-1">
                    {article.prosCons.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros Column */}
                <div className="p-6 bg-[#F6FAF7] border border-[#D5EAD9] rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Advantages &amp; Strengths</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#274B35]">
                    {article.prosCons.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons Column */}
                <div className="p-6 bg-[#FCF6F6] border border-[#F5D8D8] rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-[#7C353C] font-semibold text-sm">
                    <XCircle className="w-5 h-5 text-[#A35360]" />
                    <span>Trade-Offs &amp; Considerations</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#5B2931]">
                    {article.prosCons.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A35360] shrink-0 mt-1.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Frequently Asked Questions (FAQ Section with Accordion) */}
            <section id="faqs" className="scroll-mt-36 pt-8 border-t border-[#F0E4E2] space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#A35360] block mb-1">
                  Culinary Answers
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2424] font-medium">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-[#655255] mt-1">
                  Food science answers to reader inquiries from our baking masterclass community.
                </p>
              </div>

              <div className="space-y-3">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#F0E4E2] bg-white rounded-2xl overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FCF9F7] transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif text-base sm:text-lg font-medium text-[#2D2424]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#A35360] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5B494C] leading-relaxed border-t border-[#FAF2F2]">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Social Share Bar */}
            <div className="pt-8 border-t border-[#F0E4E2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#655255]">
                Share this Masterclass:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="px-3.5 py-2 bg-white border border-[#E8D4D6] hover:border-[#A35360] text-xs font-medium text-[#655255] rounded-full transition-colors cursor-pointer"
                >
                  Twitter / X
                </button>
                <button
                  onClick={() => shareOnSocial('pinterest')}
                  className="px-3.5 py-2 bg-white border border-[#E8D4D6] hover:border-[#A35360] text-xs font-medium text-[#655255] rounded-full transition-colors cursor-pointer"
                >
                  Pinterest
                </button>
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="px-3.5 py-2 bg-white border border-[#E8D4D6] hover:border-[#A35360] text-xs font-medium text-[#655255] rounded-full transition-colors cursor-pointer"
                >
                  Facebook
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-[#FAF2F4] text-[#A35360] rounded-full hover:bg-[#F5E5E8] transition-colors cursor-pointer"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#F0E4E2] shadow-xs flex flex-col sm:flex-row items-center gap-6">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#F9EAE8] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <h3 className="font-serif text-xl font-medium text-[#2D2424]">
                    {article.author.name}
                  </h3>
                  <span className="text-xs text-[#A35360] font-semibold">{article.author.role}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#655255] leading-relaxed">
                  Trained at the Ferrandi School of Culinary Arts in Paris. Camille spent a decade directing pastry research laboratories before founding Rose &amp; Crumb to bridge culinary chemistry and domestic baking.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-16 border-t border-[#F0E4E2]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#A35360] block mb-1">
                Further Reading
              </span>
              <h2 className="font-serif text-3xl text-[#2D2424] font-medium">
                Related Masterclasses &amp; Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateArticle(rel.slug)}
                  className="group bg-white rounded-2xl border border-[#F0E4E2] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#FAF4F2]">
                    <img
                      src={rel.coverImage}
                      alt={rel.coverImageAlt}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#A35360] font-semibold">
                        {rel.category} · {rel.readTime}
                      </div>
                      <h3 className="font-serif text-lg font-medium text-[#2D2424] group-hover:text-[#A35360] transition-colors line-clamp-2">
                        {rel.title}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-[#A35360] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Read guide on {rel.title.split(':')[0]}</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Product Toast Notification */}
      {productToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D2424] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-3 animate-fadeIn">
          <Info className="w-4 h-4 text-[#E89CA7]" />
          <span>{productToast}</span>
        </div>
      )}
    </div>
  );
};
