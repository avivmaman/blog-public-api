import { Article } from '../models/Article';
import { IArticleDocument } from '../types';

interface PaginationOptions {
  page: number;
  limit: number;
  sort: 'latest' | 'popular' | 'trending';
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
      // Trending: combination of views and recency
      return { views: -1, publishedAt: -1 };
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
      Article.find()
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(),
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
    const article = await Article.findOne({ slug })
      .populate('category', 'name slug description icon gradient accentClass')
      .populate('author', 'name slug avatar role bio')
      .lean();

    return article as IArticleDocument | null;
  },

  async getTrendingArticles(limit: number = 5): Promise<IArticleDocument[]> {
    const articles = await Article.find()
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .sort({ views: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    return articles as IArticleDocument[];
  },

  async getRelatedArticles(slug: string, limit: number = 3): Promise<IArticleDocument[]> {
    const article = await Article.findOne({ slug }).lean();

    if (!article) {
      return [];
    }

    // Find articles in the same category or with similar tags, excluding current article
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { tags: { $in: article.tags } },
      ],
    })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
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
      Article.find({ category: categoryId })
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ category: categoryId }),
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
};
