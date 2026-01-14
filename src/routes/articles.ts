import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { validateQuery, validateParams, paginationSchema, slugSchema } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - name: category
 *         in: query
 *         description: Filter by category slug
 *         schema:
 *           type: string
 *       - name: tag
 *         in: query
 *         description: Filter by tag slug
 *         schema:
 *           type: string
 *       - name: featured
 *         in: query
 *         description: Filter featured articles only
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of articles
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
router.get('/', validateQuery(paginationSchema), articleController.getArticles);

/**
 * @swagger
 * /articles/trending:
 *   get:
 *     summary: Get trending articles
 *     tags: [Articles]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of articles to return
 *         schema:
 *           type: integer
 *           default: 5
 *           maximum: 20
 *     responses:
 *       200:
 *         description: List of trending articles
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
 */
router.get('/trending', articleController.getTrending);

/**
 * @swagger
 * /articles/search:
 *   get:
 *     summary: Search articles
 *     tags: [Articles]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         description: Search query
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Search results
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
router.get('/search', articleController.search);

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     tags: [Articles]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 */
router.get('/:slug', validateParams(slugSchema), articleController.getBySlug);

/**
 * @swagger
 * /articles/{slug}/related:
 *   get:
 *     summary: Get related articles
 *     tags: [Articles]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *       - name: limit
 *         in: query
 *         description: Number of related articles to return
 *         schema:
 *           type: integer
 *           default: 3
 *           maximum: 10
 *     responses:
 *       200:
 *         description: List of related articles
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
 */
router.get('/:slug/related', validateParams(slugSchema), articleController.getRelated);

/**
 * @swagger
 * /articles/{slug}/comments:
 *   get:
 *     summary: Get comments for an article
 *     tags: [Articles]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: List of comments with nested replies
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
 *                     $ref: '#/components/schemas/Comment'
 */
router.get('/:slug/comments', validateParams(slugSchema), articleController.getComments);

export default router;
