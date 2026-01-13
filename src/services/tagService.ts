import { Tag } from '../models/Tag';
import { Article } from '../models/Article';
import { ITagDocument, IArticleDocument } from '../types';

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

export const tagService = {
  // Get all tags
  async getTags(): Promise<ITagDocument[]> {
    return Tag.find()
      .sort({ name: 1 })
      .lean() as Promise<ITagDocument[]>;
  },

  // Get tag by slug
  async getTagBySlug(slug: string): Promise<ITagDocument | null> {
    return Tag.findOne({ slug }).lean() as Promise<ITagDocument | null>;
  },

  // Get articles by tag
  async getArticlesByTag(tagSlug: string, options: PaginationOptions): Promise<ArticleListResult> {
    const tag = await Tag.findOne({ slug: tagSlug }).lean();
    if (!tag) {
      return { articles: [], total: 0, page: options.page, limit: options.limit, totalPages: 0 };
    }

    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find({ tags: tag._id, status: 'published' })
        .populate('category', 'name slug')
        .populate('author', 'name avatar role')
        .populate('tags', 'name slug color')
        .sort(getSortOptions(sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments({ tags: tag._id, status: 'published' }),
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
