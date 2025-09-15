import dotenv from 'dotenv';
dotenv.config();
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

export const connectDatabase = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in your .env file');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; // Re-throw to handle in main server
    }
};

export const disconnectDatabase = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
    }
};

// User Interface
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt: Date;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: Date;
    bio?: string;
    profilePictureUrl?: string;
}

// Certificate Interface
export interface ICertificate extends Document {
    _id: mongoose.Types.ObjectId;
    certificateId: string;
    recipientName: string;
    recipientEmail: string;
    courseName: string;
    courseType: 'Digital Skills' | 'Cybersecurity' | 'Data Analytics' | 'AI/ML' | 'Software Development' | 'Other';
    issueDate: Date;
    expiryDate?: Date;
    description?: string;
    status: 'active' | 'revoked' | 'expired';
    issuedBy: string;
    verificationHash: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Template Interface
export interface ITemplate extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    fileName: string;
    filePath: string;
    isActive: boolean;
    createdAt: Date;
}

// DownloadLog Interface
export interface IDownloadLog extends Document {
    _id: mongoose.Types.ObjectId;
    certificate: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    downloadedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    bio: { type: String, trim: true },
    profilePictureUrl: { type: String, trim: true },
});

// Certificate Schema
const certificateSchema = new Schema<ICertificate>({
    certificateId: { type: String, required: true, unique: true, trim: true },
    recipientName: { type: String, required: true, trim: true },
    recipientEmail: { type: String, required: true, trim: true, lowercase: true },
    courseName: { type: String, required: true, trim: true },
    courseType: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: false },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
    issuedBy: { type: String, required: true, default: 'National Information Technology Development Agency (NITDA)' },
    verificationHash: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

certificateSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export const User = mongoose.model<IUser>('User', userSchema);
export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);

// Template Schema
const templateSchema = new Schema<ITemplate>({
    name: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Template = mongoose.model<ITemplate>('Template', templateSchema);

// DownloadLog Schema
const downloadLogSchema = new Schema<IDownloadLog>({
    certificate: { type: Schema.Types.ObjectId, ref: 'Certificate', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    downloadedAt: { type: Date, default: Date.now }
});

export const DownloadLog = mongoose.model<IDownloadLog>('DownloadLog', downloadLogSchema);

// Setting Interface
export interface ISetting extends Document {
    key: string;
    value: any;
}

// Setting Schema
const settingSchema = new Schema<ISetting>({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
});

export const Setting = mongoose.model<ISetting>('Setting', settingSchema);

// UploadedFile Interface
export interface IUploadedFile extends Document {
    _id: mongoose.Types.ObjectId;
    originalName: string;
    filePath: string;
    fileSize: number;
    participantCount: number;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
}

// UploadedFile Schema
const uploadedFileSchema = new Schema<IUploadedFile>({
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    participantCount: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const UploadedFile = mongoose.model<IUploadedFile>('UploadedFile', uploadedFileSchema);