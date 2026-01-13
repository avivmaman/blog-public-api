import { Article } from '../models/Article';
import { IArticleDocument } from '../types';

interface PaginationOptions {
  page: number;
  limit: number;
  sort: 'latest' | 'popular' | 'trending' | 'oldest';
}

interface ArticleListResult {
  articles: IArticleDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const getSortOptions = (sort: string): Record<string, 1 | -1> => {
  switch (sort) {
    case 'popular':
      return { views: -1, publishedAt: -1 };
    case 'trending':
      return { views: -1, publishedAt: -1 };
    case 'oldest':
      return { publishedAt: 1 };
    case 'latest':
    default:
      return { publishedAt: -1 };
  }
};

export const articleService = {
  async getArticles(options: PaginationOptions): Promise<ArticleListResult> {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ status: 'published' })
        .populate('category', 'name slug color icon')
        .populate('author', 'name avatar role')
        .populate('tags', 'name slug color')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ status: 'published' }),
    ]);

    return {
      articles: articles as IArticleDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getArticleBySlug(slug: string): Promise<IArticleDocument | null> {
    const article = await Article.findOne({ slug, status: 'published' })
      .populate('category', 'name slug description icon color')
      .populate('author', 'name slug avatar role bio social')
      .populate('tags', 'name slug color')
      .lean();

    return article as IArticleDocument | null;
  },

  async getTrendingArticles(limit: number = 5): Promise<IArticleDocument[]> {
    const articles = await Article.find({ status: 'published' })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .populate('tags', 'name slug color')
      .sort({ views: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    return articles as IArticleDocument[];
  },

  async getFeaturedArticles(limit: number = 5): Promise<IArticleDocument[]> {
    const articles = await Article.find({ status: 'published', isFeatured: true })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .populate('tags', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return articles as IArticleDocument[];
  },

  async getRelatedArticles(slug: string, limit: number = 3): Promise<IArticleDocument[]> {
    const article = await Article.findOne({ slug, status: 'published' }).lean();

    if (!article) {
      return [];
    }

    // Find articles in the same category or with similar tags, excluding current article
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      status: 'published',
      $or: [
        { category: article.category },
        { tags: { $in: article.tags } },
      ],
    })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .populate('tags', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return relatedArticles as IArticleDocument[];
  },

  async getArticlesByCategory(
    categoryId: string,
    options: PaginationOptions
  ): Promise<ArticleListResult> {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ category: categoryId, status: 'published' })
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .populate('tags', 'name slug color')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ category: categoryId, status: 'published' }),
    ]);

    return {
      articles: articles as IArticleDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async incrementViews(slug: string): Promise<void> {
    await Article.updateOne({ slug }, { $inc: { views: 1 } });
  },

  async searchArticles(
    query: string,
    options: { page: number; limit: number }
  ): Promise<ArticleListResult> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Create text search query
    const searchQuery = {
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { contentHtml: { $regex: query, $options: 'i' } },
      ],
    };

    const [articles, total] = await Promise.all([
      Article.find(searchQuery)
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .populate('tags', 'name slug color')
        .sort({ views: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(searchQuery),
    ]);

    return {
      articles: articles as IArticleDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
