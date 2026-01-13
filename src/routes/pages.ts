import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pageService } from '../services/pageService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Get all published pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: List of pages
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
 *                     $ref: '#/components/schemas/Page'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const pages = await pageService.getPages();
  res.json({ success: true, data: pages });
}));

/**
 * @swagger
 * /pages/group/{group}:
 *   get:
 *     summary: Get pages by group slug
 *     tags: [Pages]
 *     parameters:
 *       - name: group
 *         in: path
 *         required: true
 *         description: Group slug (e.g., "footer", "legal")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of pages in the group
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
 *                     $ref: '#/components/schemas/Page'
 */
router.get('/group/:group', asyncHandler(async (req: Request, res: Response) => {
  const pages = await pageService.getPagesByGroup(req.params.group as string);
  res.json({ success: true, data: pages });
}));

/**
 * @swagger
 * /pages/{slug}:
 *   get:
 *     summary: Get page by slug
 *     tags: [Pages]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Page details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 */
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const page = await pageService.getPageBySlug(req.params.slug as string);
  if (!page) {
    throw notFound('Page');
  }
  res.json({ success: true, data: page });
}));

export default router;
