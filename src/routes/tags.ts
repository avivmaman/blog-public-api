import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { tagService } from '../services/tagService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
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
 *                     $ref: '#/components/schemas/Tag'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const tags = await tagService.getTags();
  res.json({ success: true, data: tags });
}));

/**
 * @swagger
 * /tags/{slug}:
 *   get:
 *     summary: Get tag by slug
 *     tags: [Tags]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const tag = await tagService.getTagBySlug(req.params.slug as string);
  if (!tag) {
    throw notFound('Tag');
  }
  res.json({ success: true, data: tag });
}));

/**
 * @swagger
 * /tags/{slug}/articles:
 *   get:
 *     summary: Get articles by tag
 *     tags: [Tags]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Articles with the tag
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

  const result = await tagService.getArticlesByTag(req.params.slug as string, { page, limit, sort });

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
