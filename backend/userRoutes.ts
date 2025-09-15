import express from 'express';
import { storage } from './storage';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
import { authenticateToken, requireAdmin } from './middleware/auth';
import crypto from 'crypto';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
// GET /api/users - Get all users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await storage.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// POST /api/users/:id/reset-password - Reset a user's password
router.post('/:id/reset-password', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const newPassword = crypto.randomBytes(8).toString('hex'); // Generate a random password
        const user = await storage.resetUserPassword(id, newPassword);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // In a real app, you would email this new password to the user.
        res.json({ message: `Password for ${user.username} has been reset successfully. New password: ${newPassword}` });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// DELETE /api/users/:id - Delete a user
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await storage.deleteUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
