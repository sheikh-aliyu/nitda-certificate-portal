import express from 'express';
import { storage } from './storage';
import { authenticateToken, requireAdmin } from './middleware/auth';

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Log management
 */
const router = express.Router();

/**
 * @swagger
 * /logs/downloads:
 *   get:
 *     summary: Get all download logs
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of download logs
 *       500:
 *         description: Internal server error
 */
// GET /api/logs/downloads - Get all download logs
router.get('/downloads', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const logs = await storage.getDownloadLogs();
        res.json(logs);
    } catch (error) {
        console.error('Get download logs error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
