import express from 'express';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import { storage } from './storage';
import { sendEmail } from './emailService.js';
import { authenticateToken, requireAdmin } from './middleware/auth';

/**
 * @swagger
 * tags:
 *   name: Bulk Upload
 *   description: Bulk upload for certificate creation
 */
const router = express.Router();

// Extend Express Request type to include user
interface AuthenticatedRequest extends express.Request {
    user?: {
        id: string;
    }
}

// Multer setup for Excel file uploads
const uploadDir = 'uploads/excel';
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
 * /bulk/upload:
 *   post:
 *     summary: Upload an Excel file for bulk certificate creation
 *     tags: [Bulk Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excel:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Successfully created certificates
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
// POST /api/bulk/upload - Upload an Excel file for bulk certificate creation
router.post('/upload', authenticateToken, requireAdmin, upload.single('excel'), async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.file || !req.user) {
            return res.status(400).json({ message: 'No file uploaded or user not authenticated' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: any[] = xlsx.utils.sheet_to_json(sheet);

        let createdCount = 0;
        for (const row of data) {
            const { email, username, recipientName, courseName, courseType } = row;

            if (!email || !username || !recipientName || !courseName || !courseType) {
                console.warn('Skipping row due to missing data:', row);
                continue;
            }

            // Check if user exists, if not, create one
            let user = await storage.getUserByEmail(email);
            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8);
                user = await storage.createUser({
                    username,
                    email,
                    password: randomPassword,
                    role: 'user',
                });

                // Create certificate for the new user
                await storage.createCertificate({
                    recipientName,
                    recipientEmail: email,
                    courseName,
                    courseType,
                    createdBy: user._id.toString(),
                });

                // Send a single, combined email to the new user
                await sendEmail({
                    to: email,
                    subject: 'Welcome! Your New Account and Certificate are Ready!',
                    html: `<p>Hello ${username},</p>
                           <p>An account has been created for you on our certificate portal. Your password is: <strong>${randomPassword}</strong></p>
                           <p>Additionally, you have been issued a new certificate for completing the <strong>${courseName}</strong> course.</p>
                           <p>Please log in to change your password and to view and download your certificate.</p>`
                });
            } else {
                // User already exists, just create the certificate
                await storage.createCertificate({
                    recipientName,
                    recipientEmail: email,
                    courseName,
                    courseType,
                    createdBy: user._id.toString(),
                });

                // Email existing user about the new certificate
                await sendEmail({
                    to: email,
                    subject: 'You have a new certificate!',
                    html: `<p>Hello ${recipientName},</p><p>You have been issued a new certificate for completing the <strong>${courseName}</strong> course. Please log in to the portal to view and download it.</p>`
                });
            }

            createdCount++;
        }

        // Save metadata about the uploaded file
        await storage.createUploadedFile({
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            participantCount: data.length,
            uploadedBy: req.user.id,
        });

        res.status(201).json({ message: `Successfully created ${createdCount} certificates.` });

    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
