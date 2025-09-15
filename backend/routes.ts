import type { Express } from "express";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { authenticateToken, generateToken, requireAdmin, type AuthRequest } from "./middleware/auth";
import { generateCertificatePdf } from "./certificate-generator";

// Multer setup for avatar uploads
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadAvatar = multer({ storage: avatarStorage });

export function registerRoutes(app: Express) {
  /**
   * @swagger
   * tags:
   *   - name: Health
   *     description: Health check
   *   - name: Authentication
   *     description: User authentication
   *   - name: Certificates
   *     description: Certificate management
   */
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: API is running
   */
  // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.json({ 
        message: "NITDA Certificate Portal API is running", 
        timestamp: new Date().toISOString() 
        });
    });

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    // Register new user
    app.post("/api/auth/register", async (req, res) => {
        try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const existingUsername = await storage.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const user = await storage.createUser({ username, email, password, role });
        const token = generateToken(user);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
            }
        });
        } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Bad request
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    // Login user
    app.post("/api/auth/login", async (req, res) => {
        try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await storage.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await storage.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
            }
        });
        } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /auth/profile:
     *   get:
     *     summary: Get current user profile
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    // Get current user profile
    app.get("/api/auth/profile", authenticateToken, async (req: AuthRequest, res) => {
        try {
        const user = await storage.getUser(req.user!.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                bio: user.bio,
                profilePictureUrl: user.profilePictureUrl,
            }
        });
        } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /auth/profile:
     *   put:
     *     summary: Update user profile
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               phoneNumber:
     *                 type: string
     *               address:
     *                 type: string
     *               dateOfBirth:
     *                 type: string
     *                 format: date
     *               bio:
     *                 type: string
     *     responses:
     *       200:
     *         description: Profile updated successfully
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    // Update user profile
    app.put("/api/auth/profile", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const updatedUser = await storage.updateUser(req.user!.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({
                message: "Profile updated successfully",
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    phoneNumber: updatedUser.phoneNumber,
                    address: updatedUser.address,
                    dateOfBirth: updatedUser.dateOfBirth,
                    bio: updatedUser.bio,
                    profilePictureUrl: updatedUser.profilePictureUrl,
                }
            });
        } catch (error) {
            console.error("Profile update error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /auth/profile/picture:
     *   post:
     *     summary: Upload profile picture
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               avatar:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Profile picture updated successfully
     *       400:
     *         description: No file uploaded
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    // Upload profile picture
    app.post("/api/auth/profile/picture", authenticateToken, uploadAvatar.single('avatar'), async (req: AuthRequest, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const updatedUser = await storage.updateUser(req.user!.id, { profilePictureUrl: req.file.path });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({
                message: "Profile picture updated successfully",
                profilePictureUrl: updatedUser.profilePictureUrl
            });
        } catch (error) {
            console.error("Profile picture upload error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates/verify/{certificateId}:
     *   get:
     *     summary: Verify a certificate
     *     tags: [Certificates]
     *     parameters:
     *       - in: path
     *         name: certificateId
     *         schema:
     *           type: string
     *         required: true
     *         description: The certificate ID
     *     responses:
     *       200:
     *         description: Certificate is valid
     *       400:
     *         description: Certificate ID is required
     *       404:
     *         description: Certificate not found
     *       500:
     *         description: Internal server error
     */
    // Certificate verification route (public)
    app.get("/api/certificates/verify/:certificateId", async (req, res) => {
        try {
        const { certificateId } = req.params;

        if (!certificateId) {
            return res.status(400).json({ message: "Certificate ID is required" });
        }

        const certificate = await storage.getCertificate(certificateId);
        if (!certificate) {
            return res.status(404).json({ 
            message: "Certificate not found",
            isValid: false 
            });
        }

        // Check if certificate is expired
        if (certificate.expiryDate && new Date() > certificate.expiryDate) {
            return res.json({
            message: "Certificate has expired",
            isValid: false,
            certificate: {
                certificateId: certificate.certificateId,
                recipientName: certificate.recipientName,
                courseName: certificate.courseName,
                status: "expired",
                issueDate: certificate.issueDate,
                expiryDate: certificate.expiryDate
            }
            });
        }

        // Check if certificate is revoked
        if (certificate.status === 'revoked') {
            return res.json({
            message: "Certificate has been revoked",
            isValid: false,
            certificate: {
                certificateId: certificate.certificateId,
                recipientName: certificate.recipientName,
                courseName: certificate.courseName,
                status: certificate.status,
                issueDate: certificate.issueDate
            }
            });
        }

        res.json({
            message: "Certificate is valid",
            isValid: true,
            certificate: {
            certificateId: certificate.certificateId,
            recipientName: certificate.recipientName,
            courseName: certificate.courseName,
            courseType: certificate.courseType,
            description: certificate.description,
            issueDate: certificate.issueDate,
            expiryDate: certificate.expiryDate,
            issuedBy: certificate.issuedBy,
            status: certificate.status
            }
        });
        } catch (error) {
        console.error("Certificate verification error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates:
     *   post:
     *     summary: Create a new certificate (admin only)
     *     tags: [Certificates]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               recipientName:
     *                 type: string
     *               recipientEmail:
     *                 type: string
     *               courseName:
     *                 type: string
     *               courseType:
     *                 type: string
     *               description:
     *                 type: string
     *               expiryDate:
     *                 type: string
     *                 format: date
     *               createdBy:
     *                 type: string
     *     responses:
     *       201:
     *         description: Certificate created successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    // Create new certificate (admin only)
    app.post("/api/certificates", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
        try {
        const {
            recipientName,
            recipientEmail,
            courseName,
            courseType,
            description,
            expiryDate,
            createdBy
        } = req.body;

        if (!recipientName || !recipientEmail || !courseName || !courseType) {
            return res.status(400).json({ 
            message: "Recipient name, email, course name, and course type are required" 
            });
        }

        const certificate = await storage.createCertificate({
            recipientName,
            recipientEmail,
            courseName,
            courseType,
            description,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            createdBy: createdBy || req.user!.id
        });

        res.status(201).json({
            message: "Certificate created successfully",
            certificate: {
            certificateId: certificate.certificateId,
            recipientName: certificate.recipientName,
            recipientEmail: certificate.recipientEmail,
            courseName: certificate.courseName,
            courseType: certificate.courseType,
            description: certificate.description,
            issueDate: certificate.issueDate,
            expiryDate: certificate.expiryDate,
            verificationHash: certificate.verificationHash,
            status: certificate.status
            }
        });
        } catch (error) {
        console.error("Certificate creation error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates:
     *   get:
     *     summary: Get all certificates (admin only)
     *     tags: [Certificates]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of certificates
     *       500:
     *         description: Internal server error
     */
    // Get all certificates (admin only)
    app.get("/api/certificates", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
        try {
        const certificates = await storage.getAllCertificates();
        
        res.json({
            certificates: certificates.map(cert => ({
            certificateId: cert.certificateId,
            recipientName: cert.recipientName,
            recipientEmail: cert.recipientEmail,
            courseName: cert.courseName,
            courseType: cert.courseType,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            status: cert.status,
            createdAt: cert.createdAt
            }))
        });
        } catch (error) {
        console.error("Get certificates error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates/my:
     *   get:
     *     summary: Get user's certificates
     *     tags: [Certificates]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of the user's certificates
     *       500:
     *         description: Internal server error
     */
    // Get user's certificates
    app.get("/api/certificates/my", authenticateToken, async (req: AuthRequest, res) => {
        try {
        const certificates = await storage.getUserCertificates(req.user!.id);
        
        res.json({
            certificates: certificates.map(cert => ({
            certificateId: cert.certificateId,
            recipientName: cert.recipientName,
            recipientEmail: cert.recipientEmail,
            courseName: cert.courseName,
            courseType: cert.courseType,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            status: cert.status,
            createdAt: cert.createdAt
            }))
        });
        } catch (error) {
        console.error("Get user certificates error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates/{certificateId}/status:
     *   patch:
     *     summary: Update certificate status (admin only)
     *     tags: [Certificates]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: certificateId
     *         schema:
     *           type: string
     *         required: true
     *         description: The certificate ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [active, revoked, expired]
     *     responses:
     *       200:
     *         description: Certificate status updated successfully
     *       400:
     *         description: Invalid status
     *       404:
     *         description: Certificate not found
     *       500:
     *         description: Internal server error
     */
    // Update certificate status (admin only)
    app.patch("/api/certificates/:certificateId/status", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
        try {
        const { certificateId } = req.params;
        const { status } = req.body;

        if (!['active', 'revoked', 'expired'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'active', 'revoked', or 'expired'" });
        }

        const certificate = await storage.updateCertificateStatus(certificateId, status);
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        res.json({
            message: "Certificate status updated successfully",
            certificate: {
            certificateId: certificate.certificateId,
            status: certificate.status,
            updatedAt: certificate.updatedAt
            }
        });
        } catch (error) {
        console.error("Update certificate status error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    });

    /**
     * @swagger
     * /certificates/{certificateId}/download:
     *   get:
     *     summary: Download certificate as PDF
     *     tags: [Certificates]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: certificateId
     *         schema:
     *           type: string
     *         required: true
     *         description: The certificate ID
     *     responses:
     *       200:
     *         description: Certificate PDF
     *         content:
     *           application/pdf:
     *             schema:
     *               type: string
     *               format: binary
     *       403:
     *         description: Not authorized to download this certificate
     *       404:
     *         description: Certificate not found
     *       500:
     *         description: Internal server error
     */
    // Download certificate as PDF
    app.get("/api/certificates/:certificateId/download", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { certificateId } = req.params;
            const certificate = await storage.getCertificate(certificateId);

            if (!certificate) {
                return res.status(404).json({ message: "Certificate not found" });
            }

            // Check if user is authorized to download the certificate
            const isOwner = certificate.createdBy.toString() === req.user!.id;
            const isAdmin = req.user!.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: "You are not authorized to download this certificate" });
            }

            const pdfBytes = await generateCertificatePdf(certificate);

            // Log the download
            await storage.createDownloadLog({
                certificate: certificate._id.toString(),
                user: req.user!.id,
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateId}.pdf"`);
            res.send(Buffer.from(pdfBytes));

        } catch (error) {
            console.error("Download certificate error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}