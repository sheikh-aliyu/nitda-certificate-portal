import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { storage } from './storage';
import { authenticateToken, requireAdmin } from './middleware/auth';

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Template management
 */
const router = express.Router();

// Multer setup for file uploads
const uploadDir = 'uploads/templates';
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storageConfig });

/**
 * @swagger
 * /templates/upload:
 *   post:
 *     summary: Upload a new template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               template:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
// POST /api/templates/upload - Upload a new template
router.post('/upload', authenticateToken, requireAdmin, upload.single('template'), async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name } = req.body;
        if (!name) {
            // If no name is provided, delete the uploaded file
            await fs.unlink(req.file.path);
            return res.status(400).json({ message: 'Template name is required' });
        }

        console.log('Uploading template. File path:', req.file.path);
        const newTemplate = await storage.createTemplate({
            name,
            fileName: req.file.filename,
            filePath: req.file.path
        });

        res.status(201).json(newTemplate);
    } catch (error) {
        console.error('Template upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of templates
 *       500:
 *         description: Internal server error
 */
// GET /api/templates - Get all templates
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const templates = await storage.getTemplates();
        res.json(templates);
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /templates/{id}/activate:
 *   patch:
 *     summary: Set a template as active
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The template ID
 *     responses:
 *       200:
 *         description: Template activated successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 */
// PATCH /api/templates/:id/activate - Set a template as active
router.patch('/:id/activate', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const template = await storage.setTemplateActive(id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.json(template);
    } catch (error) {
        console.error('Activate template error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     summary: Delete a template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal server error
 */
// DELETE /api/templates/:id - Delete a template
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const template = await storage.deleteTemplate(id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Delete the file from the filesystem
        console.log('Deleting template. File path:', template.filePath);
        await fs.unlink(template.filePath);

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
