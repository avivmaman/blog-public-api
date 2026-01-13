import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authorService } from '../services/authorService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const authors = await authorService.getAuthors();
  res.json({ success: true, data: authors });
}));

/**
 * @swagger
 * /authors/{slug}:
 *   get:
 *     summary: Get author by slug
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 */
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const author = await authorService.getAuthorBySlug(req.params.slug as string);
  if (!author) {
    throw notFound('Author');
  }
  res.json({ success: true, data: author });
}));

/**
 * @swagger
 * /authors/{slug}/articles:
 *   get:
 *     summary: Get articles by author
 *     tags: [Authors]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Articles by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get('/:slug/articles', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
  const sort = (req.query.sort as 'latest' | 'popular' | 'trending') || 'latest';

  const result = await authorService.getArticlesByAuthor(req.params.slug as string, { page, limit, sort });

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
}));

export default router;
