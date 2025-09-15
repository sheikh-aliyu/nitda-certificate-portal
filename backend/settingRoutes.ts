import express from 'express';
import { storage } from './storage';
import { authenticateToken, requireAdmin } from './middleware/auth';

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Settings management
 */
const router = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A key-value object of settings
 *       500:
 *         description: Internal server error
 */
// GET /api/settings - Get all settings
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const settings = await storage.getSettings();
        // Convert array of settings to a key-value object
        const settingsObj = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, any>);
        res.json(settingsObj);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteName:
 *                 type: string
 *               sessionTimeout:
 *                 type: number
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       500:
 *         description: Internal server error
 */
// PUT /api/settings - Update settings
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const settingsToUpdate = req.body;
        for (const key in settingsToUpdate) {
            await storage.updateSetting(key, settingsToUpdate[key]);
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
