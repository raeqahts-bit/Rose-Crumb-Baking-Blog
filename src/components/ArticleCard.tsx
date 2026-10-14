import React from 'react';
import { Bookmark, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '../types/blog';

interface ArticleCardProps {
  article: Article;
  onSelect: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  return (
    <article
      onClick={() => onSelect(article.slug)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#F0E4E2] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      {/* Visual Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF4F2]">
        <img
          src={article.coverImage}
          alt={article.coverImageAlt}
          className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback container if local or network image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern underneath if image fails */}
        <div className={`absolute inset-0 bg-gradient-to-br ${article.fallbackGradient} -z-10 flex items-center justify-center p-6 text-center`}>
          <span className="font-serif text-lg text-[#A35360] font-medium opacity-70">
            {article.category}
          </span>
        </div>

        {/* Floating Bookmark Button */}
        <button
          onClick={(e) => onToggleSave(article.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            isSaved
              ? 'bg-[#A35360] text-white'
              : 'bg-white/90 text-[#655255] hover:text-[#A35360] hover:bg-white'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save article'}
          aria-label={isSaved ? 'Remove from saved' : 'Save article'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div className="space-y-3">
          {/* Clean unboxed metadata with dot separators (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-[#9C797E] font-medium">
            <span className="text-[#A35360] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A9979A]" />
              <span>{article.readTime}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.difficulty}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl sm:text-2xl text-[#2D2424] font-medium leading-snug group-hover:text-[#A35360] transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[#655255] leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        {/* Author Footer & Read Link */}
        <div className="pt-5 mt-5 border-t border-[#F5EBE9] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full object-cover border border-[#F0E4E2]"
              referrerPolicy="no-referrer"
            />
            <span className="text-[#5B494C] font-medium">{article.author.name}</span>
          </div>

          <span className="inline-flex items-center gap-1 font-medium text-[#A35360] group-hover:translate-x-0.5 transition-transform">
            <span>Read guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
