import { Author } from '../models/Author';
import { Article } from '../models/Article';
import { IAuthorDocument, IArticleDocument } from '../types';

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
      return { views: -1, publishedAt: -1 };
    case 'oldest':
      return { publishedAt: 1 };
    case 'latest':
    default:
      return { publishedAt: -1 };
  }
};

export const authorService = {
  // Get all authors
  async getAuthors(): Promise<IAuthorDocument[]> {
    return Author.find()
      .sort({ name: 1 })
      .lean() as Promise<IAuthorDocument[]>;
  },

  // Get author by slug
  async getAuthorBySlug(slug: string): Promise<IAuthorDocument | null> {
    return Author.findOne({ slug }).lean() as Promise<IAuthorDocument | null>;
  },

  // Get articles by author
  async getArticlesByAuthor(authorSlug: string, options: PaginationOptions): Promise<ArticleListResult> {
    const author = await Author.findOne({ slug: authorSlug }).lean();
    if (!author) {
      return { articles: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ author: author._id, status: 'published' })
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .populate('tags', 'name slug color')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ author: author._id, status: 'published' }),
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
