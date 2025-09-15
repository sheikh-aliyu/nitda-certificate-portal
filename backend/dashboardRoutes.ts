import express from 'express';
import { storage } from './storage';
import { authenticateToken, requireAdmin } from './middleware/auth';
import { sendEmail } from './emailService';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard and admin-related operations
 */
const router = express.Router();

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A key-value object of metrics
 *       500:
 *         description: Internal server error
 */
// GET /api/metrics
router.get('/metrics', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const metrics = await storage.getDashboardMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Get metrics error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /uploaded-files:
 *   get:
 *     summary: Get all uploaded files
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of uploaded files
 *       500:
 *         description: Internal server error
 */
// GET /api/uploaded-files
router.get('/uploaded-files', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const files = await storage.getUploadedFiles();
        res.json({ files: files });
    } catch (error) {
        console.error('Get uploaded files error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /downloads:
 *   get:
 *     summary: Get all download logs
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of download logs
 *       500:
 *         description: Internal server error
 */
// GET /api/downloads
router.get('/downloads', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const logs = await storage.getDownloadLogs();
        res.json(logs);
    } catch (error) {
        console.error('Get download logs error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send an email to all users (simulated)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sending process initiated
 *       500:
 *         description: Internal server error
 */
// POST /api/send-email
router.post('/send-email', authenticateToken, requireAdmin, async (req, res) => {
    const { subject, content } = req.body;
    try {
        // In a real app, you'd get the list of users to email.
        // For now, we'll just simulate the call to the email service.
        await sendEmail({
            to: 'all_users@example.com', // Placeholder
            subject,
            text: content,
            html: `<p>${content.replace(/\n/g, '<br>')}</p>`,
        });
        res.json({ message: 'Email sending process initiated (simulated).' });
    } catch (error) {
        console.error('Send email error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
