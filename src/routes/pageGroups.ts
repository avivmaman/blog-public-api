import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pageService } from '../services/pageService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /page-groups:
 *   get:
 *     summary: Get all page groups
 *     tags: [Page Groups]
 *     responses:
 *       200:
 *         description: List of page groups
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
 *                     $ref: '#/components/schemas/PageGroup'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const groups = await pageService.getPageGroups();
  res.json({ success: true, data: groups });
}));

/**
 * @swagger
 * /page-groups/{slug}:
 *   get:
 *     summary: Get page group by slug with its pages
 *     tags: [Page Groups]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Page group with pages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     group:
 *                       $ref: '#/components/schemas/PageGroup'
 *                     pages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page group not found
 */
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const result = await pageService.getPageGroupBySlug(req.params.slug as string);
  if (!result) {
    throw notFound('Page group');
  }
  res.json({ success: true, data: result });
}));

export default router;
