import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { validateQuery, validateParams, paginationSchema, slugSchema } from '../middleware/validation';

const router = Router();

// GET /api/articles - List all articles with pagination
router.get('/', validateQuery(paginationSchema), articleController.getArticles);

// GET /api/articles/trending - Get trending articles
// Note: This route must come before /:slug to avoid conflict
router.get('/trending', articleController.getTrending);

// GET /api/articles/:slug - Get single article by slug
router.get('/:slug', validateParams(slugSchema), articleController.getBySlug);

// GET /api/articles/:slug/related - Get related articles
router.get('/:slug/related', validateParams(slugSchema), articleController.getRelated);

// GET /api/articles/:slug/comments - Get comments for article
router.get('/:slug/comments', validateParams(slugSchema), articleController.getComments);

export default router;
