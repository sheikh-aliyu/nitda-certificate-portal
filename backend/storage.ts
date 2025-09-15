import { User, Certificate, Template, DownloadLog, Setting, UploadedFile, type IUser, type ICertificate, type ITemplate, type IDownloadLog, type ISetting, type IUploadedFile } from "./database";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface IStorage {
    // User operations
    getAllUsers(): Promise<IUser[]>;
    getUser(id: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    createUser(user: { username: string; email: string; password: string; role?: string }): Promise<IUser>;
    updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
    resetUserPassword(id: string, newPassword: string): Promise<IUser | null>;
    deleteUser(id: string): Promise<IUser | null>;
    
    // Certificate operations
    getCertificate(certificateId: string): Promise<ICertificate | null>;
    getCertificateByHash(verificationHash: string): Promise<ICertificate | null>;
    createCertificate(certificate: {
        recipientName: string; recipientEmail: string; courseName: string;
        courseType: string; description?: string; expiryDate?: Date; createdBy: string;
    }): Promise<ICertificate>;
    getAllCertificates(): Promise<ICertificate[]>;
    getUserCertificates(userId: string): Promise<ICertificate[]>;
    updateCertificateStatus(certificateId: string, status: 'active' | 'revoked' | 'expired'): Promise<ICertificate | null>;

    // Template operations
    createTemplate(template: { name: string; fileName: string; filePath: string; }): Promise<ITemplate>;
    getTemplates(): Promise<ITemplate[]>;
    getTemplate(id: string): Promise<ITemplate | null>;
    getActiveTemplate(): Promise<ITemplate | null>;
    setTemplateActive(id: string): Promise<ITemplate | null>;
    deleteTemplate(id: string): Promise<ITemplate | null>;

    // DownloadLog operations
    createDownloadLog(log: { certificate: string; user: string; }): Promise<IDownloadLog>;
    getDownloadLogs(): Promise<IDownloadLog[]>;

    // Settings operations
    getSettings(): Promise<ISetting[]>;
    updateSetting(key: string, value: any): Promise<ISetting | null>;

    // Dashboard operations
    getDashboardMetrics(): Promise<any>;

    // UploadedFile operations
    createUploadedFile(fileData: { originalName: string; filePath: string; fileSize: number; participantCount: number; uploadedBy: string; }): Promise<IUploadedFile>;
    getUploadedFiles(): Promise<IUploadedFile[]>;
}

    export class MongoStorage implements IStorage {
    // User operations
    async getAllUsers(): Promise<IUser[]> {
        return await User.find().select('-password'); // Exclude passwords from the result
    }

    async getUser(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        return await User.findOne({ username });
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async createUser(user: { username: string; email: string; password: string; role?: string }): Promise<IUser> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        
        const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role || 'user'
        });

        return await newUser.save();
    }

    async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async resetUserPassword(id: string, newPassword: string): Promise<IUser | null> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        return await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    }

    async deleteUser(id: string): Promise<IUser | null> {
        return await User.findByIdAndDelete(id);
    }

    // Certificate operations
    async getCertificate(certificateId: string): Promise<ICertificate | null> {
        return await Certificate.findOne({ certificateId });
    }

    async getCertificateByHash(verificationHash: string): Promise<ICertificate | null> {
        return await Certificate.findOne({ verificationHash });
    }

    async createCertificate(certificate: {
        recipientName: string; recipientEmail: string; courseName: string;
        courseType: string; description?: string; expiryDate?: Date; createdBy: string;
    }): Promise<ICertificate> {
        // Generate unique certificate ID
        const certificateId = `NITDA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Generate verification hash
        const verificationHash = crypto.createHash('sha256')
        .update(`${certificateId}-${certificate.recipientEmail}-${certificate.courseName}-${Date.now()}`)
        .digest('hex');

        const newCertificate = new Certificate({
        certificateId,
        recipientName: certificate.recipientName,
        recipientEmail: certificate.recipientEmail,
        courseName: certificate.courseName,
        courseType: certificate.courseType,
        description: certificate.description,
        expiryDate: certificate.expiryDate,
        verificationHash,
        createdBy: certificate.createdBy
        });

        return await newCertificate.save();
    }

    async getAllCertificates(): Promise<ICertificate[]> {
        return await Certificate.find().populate('createdBy', 'username email');
    }

    async getUserCertificates(userId: string): Promise<ICertificate[]> {
        return await Certificate.find({ createdBy: userId });
    }

    async updateCertificateStatus(certificateId: string, status: 'active' | 'revoked' | 'expired'): Promise<ICertificate | null> {
        return await Certificate.findOneAndUpdate(
        { certificateId },
        { status, updatedAt: new Date() },
        { new: true }
        );
    }

    // Template operations
    async createTemplate(template: { name: string; fileName: string; filePath: string; }): Promise<ITemplate> {
        const newTemplate = new Template(template);
        return await newTemplate.save();
    }

    async getTemplates(): Promise<ITemplate[]> {
        return await Template.find();
    }

    async getTemplate(id: string): Promise<ITemplate | null> {
        return await Template.findById(id);
    }

    async getActiveTemplate(): Promise<ITemplate | null> {
        return await Template.findOne({ isActive: true });
    }

    async setTemplateActive(id: string): Promise<ITemplate | null> {
        // First, set all other templates to inactive
        await Template.updateMany({ _id: { $ne: id } }, { isActive: false });
        // Then, set the specified template to active
        return await Template.findByIdAndUpdate(id, { isActive: true }, { new: true });
    }

    async deleteTemplate(id: string): Promise<ITemplate | null> {
        return await Template.findByIdAndDelete(id);
    }

    // DownloadLog operations
    async createDownloadLog(log: { certificate: string; user: string; }): Promise<IDownloadLog> {
        const newLog = new DownloadLog(log);
        return await newLog.save();
    }

    async getDownloadLogs(): Promise<IDownloadLog[]> {
        return await DownloadLog.find().populate('certificate').populate('user');
    }

    // Settings operations
    async getSettings(): Promise<any> {
        const settings = await Setting.find();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as any);
    }

    async updateSetting(key: string, value: any): Promise<ISetting | null> {
        return await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    }

    // Dashboard operations
    async getDashboardMetrics(): Promise<any> {
        const totalUploads = await Certificate.countDocuments();
        const totalDownloads = await DownloadLog.countDocuments();
        const activeCertificates = await Certificate.countDocuments({ status: 'active' });
        const totalUsers = await User.countDocuments();

        // The trend and change data would be calculated based on a time period,
        // but for now, we'll return static mock data for the UI.
        return {
            totalUploads: { value: totalUploads, trend: 'up', change: '+20.1% from last month' },
            totalDownloads: { value: totalDownloads, trend: 'up', change: '+180.1% from last month' },
            activeCertificates: { value: activeCertificates, trend: 'down', change: '-1.4% from last month' },
            totalUsers: { value: totalUsers, trend: 'up', change: '+2 since last hour' },
        };
    }

    // UploadedFile operations
    async createUploadedFile(fileData: { originalName: string; filePath: string; fileSize: number; participantCount: number; uploadedBy: string; }): Promise<IUploadedFile> {
        const newFile = new UploadedFile(fileData);
        return await newFile.save();
    }

    async getUploadedFiles(): Promise<IUploadedFile[]> {
        return await UploadedFile.find().sort({ uploadedAt: -1 }).populate('uploadedBy', 'username');
    }
}

export const storage = new MongoStorage();