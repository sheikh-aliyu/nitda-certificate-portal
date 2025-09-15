import dotenv from "dotenv";
import mongoose from "mongoose";
import { storage } from "../storage";
import fs from "fs/promises";
import path from "path";

dotenv.config();

async function testUploads() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in your .env file");
        }
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("--- Starting Upload Tests ---");

        // 1. Test Template Creation
        console.log("\nTesting Template Creation...");
        const templateSourcePath = path.join(process.cwd(), 'frontend/public/certport.png');
        const templateDestPath = path.join(process.cwd(), 'uploads/templates/test-template.png');
        await fs.copyFile(templateSourcePath, templateDestPath);

        const newTemplate = await storage.createTemplate({
            name: "Test Template (from script)",
            fileName: "test-template.png",
            filePath: templateDestPath,
        });
        console.log("✅ Template created successfully:", newTemplate.name);

        // 2. Test Profile Picture "Upload"
        console.log("\nTesting Profile Picture Upload...");
        const user = await storage.getUserByEmail("user@nitda.gov.ng");
        if (!user) {
            throw new Error("User 'user@nitda.gov.ng' not found. Please run the seeder first (npm run db:seed).");
        }

        const avatarSourcePath = path.join(process.cwd(), 'frontend/public/logo.png');
        const avatarDestPath = path.join(process.cwd(), 'uploads/avatars/test-avatar.png');
        await fs.copyFile(avatarSourcePath, avatarDestPath);

        const updatedUser = await storage.updateUser(user._id.toString(), { profilePictureUrl: avatarDestPath });
        console.log("✅ Profile picture updated successfully for user:", updatedUser?.email);
        console.log("   New profile picture URL:", updatedUser?.profilePictureUrl);

        console.log("\n--- Upload Tests Completed Successfully ---");
        console.log("This confirms that the backend logic for creating templates and updating profile pictures is working correctly.");

    } catch (err) {
        console.error("\n--- Upload Test Failed ---");
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

testUploads();
