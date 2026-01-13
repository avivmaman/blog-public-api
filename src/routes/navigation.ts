import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { navigationService } from '../services/navigationService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /navigation:
 *   get:
 *     summary: Get all navigation menus
 *     tags: [Navigation]
 *     responses:
 *       200:
 *         description: List of navigation menus
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
 *                     $ref: '#/components/schemas/Navigation'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const navigations = await navigationService.getNavigations();
  res.json({ success: true, data: navigations });
}));

/**
 * @swagger
 * /navigation/{slug}:
 *   get:
 *     summary: Get navigation menu by slug
 *     tags: [Navigation]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Navigation menu details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Navigation'
 *       404:
 *         description: Navigation not found
 */
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const navigation = await navigationService.getNavigationBySlug(req.params.slug as string);
  if (!navigation) {
    throw notFound('Navigation');
  }
  res.json({ success: true, data: navigation });
}));

export default router;
