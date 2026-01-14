import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { validateQuery, validateParams, paginationSchema, slugSchema } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:slug', validateParams(slugSchema), categoryController.getCategoryBySlug);

/**
 * @swagger
 * /categories/{slug}/articles:
 *   get:
 *     summary: Get articles by category
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/slugParam'
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *     responses:
 *       200:
 *         description: Articles in the category
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
router.get(
  '/:slug/articles',
  validateParams(slugSchema),
  validateQuery(paginationSchema),
  categoryController.getCategoryArticles
);

export default router;
