import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { categoryService } from '../services/categoryService';
import { articleService } from '../services/articleService';
import { notFound } from '../utils/ApiError';
import { PaginationQuery, SlugParams } from '../middleware/validation';

export const categoryController = {
  // GET /api/categories
  getAllCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  }),

  // GET /api/categories/:slug
  getCategoryBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = (res.locals.validatedParams || req.params) as SlugParams;
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      throw notFound('Category');
    }

    res.json({
      success: true,
      data: category,
    });
  }),

  // GET /api/categories/:slug/articles
  getCategoryArticles: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = (res.locals.validatedParams || req.params) as SlugParams;
    const { page = 1, limit = 10, sort = 'latest' } = (res.locals.validatedQuery || req.query) as PaginationQuery;

    // First get the category
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      throw notFound('Category');
    }

    // Then get articles for this category
    const result = await articleService.getArticlesByCategory(
      category._id.toString(),
      { page, limit, sort }
    );

    res.json({
      success: true,
      data: {
        category,
        articles: result.articles,
      },
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  }),
};
