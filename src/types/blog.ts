export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  price: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  pros: string[];
  idealFor: string;
}

export interface ProsCons {
  title: string;
  description?: string;
  pros: string[];
  cons: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string; // rich text / markdown-like
  tips?: string[];
  callout?: {
    type: 'science' | 'tip' | 'warning';
    title: string;
    text: string;
  };
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Cake Chemistry' | 'Ingredients & Prep' | 'Sourdough & Bread' | 'Pastry & Pies' | 'Baking Equipment' | 'Decorating & Science';
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  fallbackGradient: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  sections: ArticleSection[];
  productRecommendations: ProductRecommendation[];
  prosCons: ProsCons;
  faqs: FaqItem[];
  relatedSlugIds: string[];
}
