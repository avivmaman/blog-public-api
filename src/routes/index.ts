import { Router, Request, Response } from 'express';
import articlesRouter from './articles';
import categoriesRouter from './categories';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/articles', articlesRouter);
router.use('/categories', categoriesRouter);

export default router;
