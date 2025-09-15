const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

class ApiService {
    private token: string | null;

    constructor() {
        this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        };

        if (this.token) {
        (config.headers as any).Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(url, config);
        
        if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
        }

        const data = await response.json();
        
        if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
        }

        return data;
    }

    // Auth methods
    async login(email: string, password: string) {
        const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async register(userData: {
        username: string;
        email: string;
        password: string;
        role?: string;
    }) {
        const data = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        });
        this.setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    // Certificate methods
    async verifyCertificate(certificateId: string) {
        return this.request(`/certificates/verify/${certificateId}`);
    }

    async createCertificate(certificateData: {
        recipientName: string;
        recipientEmail: string;
        courseName: string;
        courseType: string;
        description?: string;
        expiryDate?: string;
    }) {
        return this.request('/certificates', {
        method: 'POST',
        body: JSON.stringify(certificateData),
        });
    }

    async getAllCertificates() {
        return this.request('/certificates');
    }

    async getMyCertificates() {
        return this.request('/certificates/my');
    }

    async updateCertificateStatus(certificateId: string, status: 'active' | 'revoked' | 'expired') {
        return this.request(`/certificates/${certificateId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        });
    }

    async updateProfile(data: any) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async uploadProfilePicture(formData: FormData) {
        const url = `${API_BASE_URL}/auth/profile/picture`;
        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            this.clearToken();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    }

    // Download logs
    async getDownloadLogs() {
        return this.request('/logs/downloads');
    }

    // Settings
    async getSettings() {
        return this.request('/settings');
    }

    async updateSettings(settings: any) {
        return this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async downloadCertificate(certificateId: string): Promise<Blob> {
        const url = `${API_BASE_URL}/certificates/${certificateId}/download`;
        const config: RequestInit = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            this.clearToken();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const data = await response.json().catch(() => ({ message: 'Failed to download certificate' }));
            throw new Error(data.message || 'Failed to download certificate');
        }

        return await response.blob();
    }

    // Template methods
    async uploadTemplate(formData: FormData) {
        const url = `${API_BASE_URL}/templates/upload`;
        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            this.clearToken();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    }

    async getTemplates() {
        return this.request('/templates');
    }

    async activateTemplate(id: string) {
        return this.request(`/templates/${id}/activate`, {
            method: 'PATCH',
        });
    }

    async deleteTemplate(id: string) {
        return this.request(`/templates/${id}`, {
            method: 'DELETE',
        });
    }

    // Bulk upload
    async uploadBulkCertificates(formData: FormData) {
        const url = `${API_BASE_URL}/bulk/upload`;
        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            this.clearToken();
            window.location.href = '/login';
            throw new Error('Unauthorized');
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    }

    // User management methods
    async getAllUsers() {
        return this.request('/users');
    }

    async resetPassword(userId: string) {
        return this.request(`/users/${userId}/reset-password`, {
            method: 'POST',
        });
    }

    async deleteUser(userId: string) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE',
        });
    }

    // Dashboard methods
    async getMetrics() {
        return this.request('/metrics');
    }

    async getUploadedFiles() {
        return this.request('/uploaded-files');
    }

    async sendEmail(subject: string, content: string) {
        return this.request('/send-email', {
            method: 'POST',
            body: JSON.stringify({ subject, content }),
        });
    }

    // Auth utilities
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }
    }

    // Export interfaces
    export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    }

    export interface AuthResponse {
    message: string;
    token: string;
    user: User;
    }

    export interface Certificate {
    certificateId: string;
    recipientName: string;
    recipientEmail: string;
    courseName: string;
    courseType: string;
    description?: string;
    issueDate: string;
    expiryDate?: string;
    issuedBy: string;
    status: string;
    }

    export interface IDownloadLog {
        _id: string;
        certificate: Certificate;
        user: User;
        downloadedAt: string;
    }

    export interface ITemplate {
        _id: string;
        name: string;
        fileName: string;
        isActive: boolean;
    }

    export interface VerificationResponse {
    message: string;
    isValid: boolean;
    certificate?: Certificate;
}

export default new ApiService();