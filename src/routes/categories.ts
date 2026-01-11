import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { validateQuery, validateParams, paginationSchema, slugSchema } from '../middleware/validation';

const router = Router();

// GET /api/categories - List all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:slug - Get single category by slug
router.get('/:slug', validateParams(slugSchema), categoryController.getCategoryBySlug);

// GET /api/categories/:slug/articles - Get articles by category
router.get(
  '/:slug/articles',
  validateParams(slugSchema),
  validateQuery(paginationSchema),
  categoryController.getCategoryArticles
);

export default router;
