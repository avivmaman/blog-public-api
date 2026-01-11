import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { articleService } from '../services/articleService';
import { commentService } from '../services/commentService';
import { notFound } from '../utils/ApiError';
import { PaginationQuery, SlugParams } from '../middleware/validation';

export const articleController = {
  // GET /api/articles
  getArticles: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sort } = req.query as unknown as PaginationQuery;

    const result = await articleService.getArticles({ page, limit, sort });

    res.json({
      success: true,
      data: result.articles,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  }),

  // GET /api/articles/trending
  getTrending: asyncHandler(async (req: Request, res: Response) => {
    const limitParam = req.query.limit;
    const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : 5;
    const articles = await articleService.getTrendingArticles(Math.min(limit || 5, 20));

    res.json({
      success: true,
      data: articles,
    });
  }),

  // GET /api/articles/:slug
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params as unknown as SlugParams;
    const article = await articleService.getArticleBySlug(slug);

    if (!article) {
      throw notFound('Article');
    }

    // Increment view count (fire and forget)
    articleService.incrementViews(slug).catch(console.error);

    res.json({
      success: true,
      data: article,
    });
  }),

  // GET /api/articles/:slug/related
  getRelated: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params as unknown as SlugParams;
    const limitParam = req.query.limit;
    const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : 3;

    const articles = await articleService.getRelatedArticles(slug, Math.min(limit || 3, 10));

    res.json({
      success: true,
      data: articles,
    });
  }),

  // GET /api/articles/:slug/comments
  getComments: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params as unknown as SlugParams;
    const comments = await commentService.getCommentsByArticleSlug(slug);

    res.json({
      success: true,
      data: comments,
    });
  }),
};
