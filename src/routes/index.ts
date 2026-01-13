import { Router, Request, Response } from 'express';
import articlesRouter from './articles';
import categoriesRouter from './categories';
import pagesRouter from './pages';
import pageGroupsRouter from './pageGroups';
import tagsRouter from './tags';
import authorsRouter from './authors';
import mediaRouter from './media';
import navigationRouter from './navigation';
import settingsRouter from './settings';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /meta:
 *   get:
 *     summary: API metadata
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API metadata
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
 *                     name:
 *                       type: string
 *                     version:
 *                       type: string
 *                     description:
 *                       type: string
 */
router.get('/meta', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'Generic Blog API',
      version: '1.0.0',
      description: 'A flexible, read-only blog API',
    },
  });
});

// Mount routes
router.use('/articles', articlesRouter);
router.use('/categories', categoriesRouter);
router.use('/pages', pagesRouter);
router.use('/page-groups', pageGroupsRouter);
router.use('/tags', tagsRouter);
router.use('/authors', authorsRouter);
router.use('/media', mediaRouter);
router.use('/navigation', navigationRouter);
router.use('/settings', settingsRouter);

export default router;
