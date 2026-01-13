import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { mediaService } from '../services/mediaService';
import { notFound } from '../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /media:
 *   get:
 *     summary: Get all media assets
 *     tags: [Media]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: folder
 *         in: query
 *         description: Filter by folder
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of media assets
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
 *                     $ref: '#/components/schemas/Media'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);
  const folder = req.query.folder as string | undefined;

  const result = await mediaService.getMedia({ page, limit, folder });

  res.json({
    success: true,
    data: result.media,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}));

/**
 * @swagger
 * /media/folders:
 *   get:
 *     summary: Get all media folders
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: List of folder names
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
 *                     type: string
 */
router.get('/folders', asyncHandler(async (_req: Request, res: Response) => {
  const folders = await mediaService.getFolders();
  res.json({ success: true, data: folders });
}));

/**
 * @swagger
 * /media/{id}:
 *   get:
 *     summary: Get media by ID
 *     tags: [Media]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Media ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Media'
 *       404:
 *         description: Media not found
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const media = await mediaService.getMediaById(req.params.id as string);
  if (!media) {
    throw notFound('Media');
  }
  res.json({ success: true, data: media });
}));

export default router;
