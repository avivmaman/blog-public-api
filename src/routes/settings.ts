import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { settingsService } from '../services/settingsService';
import { notFound } from '../utils/ApiError';
import { SettingGroup } from '../types';

const router = Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all public site settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: List of settings
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
 *                     $ref: '#/components/schemas/SiteSetting'
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getPublicSettings();
  res.json({ success: true, data: settings });
}));

/**
 * @swagger
 * /settings/object:
 *   get:
 *     summary: Get all settings as key-value object
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties: true
 */
router.get('/object', asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettingsObject();
  res.json({ success: true, data: settings });
}));

/**
 * @swagger
 * /settings/group/{group}:
 *   get:
 *     summary: Get settings by group
 *     tags: [Settings]
 *     parameters:
 *       - name: group
 *         in: path
 *         required: true
 *         description: Setting group
 *         schema:
 *           type: string
 *           enum: [general, seo, social, appearance, contact, analytics]
 *     responses:
 *       200:
 *         description: Settings in the group
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
 *                     $ref: '#/components/schemas/SiteSetting'
 */
router.get('/group/:group', asyncHandler(async (req: Request, res: Response) => {
  const group = req.params.group as SettingGroup;
  const validGroups: SettingGroup[] = ['general', 'seo', 'social', 'appearance', 'contact', 'analytics'];

  if (!validGroups.includes(group)) {
    throw notFound('Setting group');
  }

  const settings = await settingsService.getSettingsByGroup(group);
  res.json({ success: true, data: settings });
}));

/**
 * @swagger
 * /settings/{key}:
 *   get:
 *     summary: Get setting by key
 *     tags: [Settings]
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         description: Setting key
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SiteSetting'
 *       404:
 *         description: Setting not found
 */
router.get('/:key', asyncHandler(async (req: Request, res: Response) => {
  const setting = await settingsService.getSettingByKey(req.params.key as string);
  if (!setting) {
    throw notFound('Setting');
  }
  res.json({ success: true, data: setting });
}));

export default router;
