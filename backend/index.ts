import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import templateRoutes from "./templateRoutes.js";
import userRoutes from "./userRoutes.js";
import bulkUploadRoutes from "./bulkUploadRoutes.js";
import logRoutes from "./logRoutes.js";
import settingRoutes from "./settingRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import { connectDatabase } from "./database";
import { setupSwagger } from "./swagger";
import fs from 'fs';
import path from 'path';

const app = express();

async function startServer() {
    try {
        // Ensure upload directories exist
        const excelDir = path.resolve('uploads', 'excel');
        const templateDir = path.resolve('uploads', 'templates');
        if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });
        if (!fs.existsSync(templateDir)) fs.mkdirSync(templateDir, { recursive: true });

        // CORS configuration for separate frontend/backend
        app.use(cors({
            origin: process.env.NODE_ENV === 'production'
                ? ['https://yourdomain.com']
                : ['http://localhost:3000', 'http://localhost:5173'],
            credentials: true
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Connect to MongoDB
        await connectDatabase();

        // Serve static files from the "uploads" directory
        app.use('/uploads', express.static('uploads'));

        // Request logging middleware
        app.use((req, res, next) => {
            const start = Date.now();
            const path = req.path;
            let capturedJsonResponse: Record<string, any> | undefined = undefined;

            const originalResJson = res.json;
            res.json = function (bodyJson, ...args) {
                capturedJsonResponse = bodyJson;
                return originalResJson.apply(res, [bodyJson, ...args]);
            };

            res.on("finish", () => {
                const duration = Date.now() - start;
                if (path.startsWith("/api")) {
                    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
                    if (capturedJsonResponse) {
                        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
                    }
                    if (logLine.length > 80) {
                        logLine = logLine.slice(0, 79) + "…";
                    }
                    console.log(logLine);
                }
            });

            next();
        });

        // Setup Swagger
        setupSwagger(app);

        // Register API routes
        registerRoutes(app);
        app.use('/api/templates', templateRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/bulk', bulkUploadRoutes);
        app.use('/api/logs', logRoutes);
        app.use('/api/settings', settingRoutes);
        app.use('/api', dashboardRoutes); // Mount dashboard routes at /api

        // Error handling middleware
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json({ message });
            console.error(err);
        });

        // Start server
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`🚀 Backend server running on port ${port}`);
            console.log(`📡 API available at: http://localhost:${port}/api`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();