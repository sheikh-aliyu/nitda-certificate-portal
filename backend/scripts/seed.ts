import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../database";

dotenv.config();

async function seedDatabase() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in your .env file");
        }
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing users to avoid conflicts
        await User.deleteMany({});
        console.log("Cleared existing users.");

        // Create admin user
        const adminUser = await User.create({
            username: "admin",
            email: "admin@nitda.gov.ng",
            password: await bcrypt.hash("admin123", 10),
            role: "admin",
        });
        console.log("Admin user created:", adminUser.email);

        // Create regular user
        const regularUser = await User.create({
            username: "user",
            email: "user@nitda.gov.ng",
            password: await bcrypt.hash("user123", 10),
            role: "user",
        });
        console.log("Regular user created:", regularUser.email);

    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

seedDatabase();
