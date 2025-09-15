import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Upload, Download, Shield, Users, TrendingUp, TrendingDown, Search, MoreHorizontal,
    Settings, LogOut, Eye, FileText, Mail, Send} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("upload");
    const [metrics, setMetrics] = useState<any>({});
    const [users, setUsers] = useState<any[]>([]);
    const [downloads, setDownloads] = useState<any[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedTemplateFile, setSelectedTemplateFile] = useState<File | null>(null);
    const [templateName, setTemplateName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState("Your Certificate is Ready!");
    const [emailContent, setEmailContent] = useState(`Dear {name},

    We are pleased to inform you that your certificate is now ready for download. Please log in to your account to access your certificate.

    Best regards,
    NITDA Team`);

    const fetchAllData = async () => {
        try {
            const [metricsRes, usersRes, downloadsRes, uploadedFilesRes, templatesRes] = await Promise.all([
                api.getMetrics(),
                api.getAllUsers(),
                api.getDownloadLogs(),
                api.getUploadedFiles(),
                api.getTemplates(),
            ]);
            setMetrics({
                totalUploads: { ...metricsRes.totalUploads, icon: Upload },
                totalDownloads: { ...metricsRes.totalDownloads, icon: Download },
                activeCertificates: { ...metricsRes.activeCertificates, icon: Shield },
                totalUsers: { ...metricsRes.totalUsers, icon: Users },
            });
            setUsers(usersRes || []);
            setDownloads(downloadsRes || []);
            setUploadedFiles(uploadedFilesRes.files || []);
            setTemplates(templatesRes || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await api.deleteUser(userId);
            fetchAllData(); // Refresh data
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setDeletingUserId(null);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleTemplateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedTemplateFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("excel", selectedFile);
        try {
            const response = await api.uploadBulkCertificates(formData);
            toast({
                title: "Success",
                description: response.message || "File uploaded and processed successfully.",
            });
            fetchAllData(); // Refresh data
            setSelectedFile(null); // Clear file input
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "An unknown error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleTemplateUpload = async () => {
        if (!selectedTemplateFile || !templateName) {
            toast({
                title: "Missing Information",
                description: "Please provide a name for the template.",
                variant: "destructive",
            });
            return;
        };
        // Add uploading state for templates as well for consistency
        const formData = new FormData();
        formData.append("template", selectedTemplateFile);
        formData.append("name", templateName);
        try {
            await api.uploadTemplate(formData);
            toast({
                title: "Success",
                description: "Template uploaded successfully.",
            });
            fetchAllData(); // Refresh data
            setSelectedTemplateFile(null);
            setTemplateName("");
        } catch (error: any) {
            console.error("Error uploading template:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "An unknown error occurred.",
                variant: "destructive",
            });
        }
    };

    const handleSendEmail = async () => {
        try {
            await api.sendEmail(emailSubject, emailContent);
            alert("Email sent (simulated).");
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    const handleViewTemplate = (filePath: string) => {
        const baseUrl = import.meta.env.DEV ? 'http://localhost:5001' : '';
        window.open(`${baseUrl}/${filePath}`, '_blank');
    };

    const handleDownloadTemplate = (filePath: string, fileName: string) => {
        const baseUrl = import.meta.env.DEV ? 'http://localhost:5001' : '';
        const link = document.createElement('a');
        link.href = `${baseUrl}/${filePath}`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-dashboard-bg">
            <header className="bg-background border-b border-border">
                <div className="flex h-16 items-center justify-between px-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Manage certificates and user accounts</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild><Link to="/settings"><Settings className="h-4 w-4 mr-2" />Settings</Link></Button>
                        <Button variant="outline" size="sm" asChild><Link to="/login"><LogOut className="h-4 w-4 mr-2" />Logout</Link></Button>
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.keys(metrics).length > 0 ? (
                        Object.entries(metrics).map(([key, metric]: [string, any]) => (
                            <Card key={key} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <p className="text-sm font-medium text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                                        {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-metric-up" />}
                                        {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-metric-down" />}
                                        {metric.icon && <metric.icon className="h-4 w-4 text-metric-neutral" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold">{metric.value}</div>
                                        <p className="text-xs text-muted-foreground">{metric.change}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>Loading metrics...</p>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="upload">Upload Management</TabsTrigger>
                        <TabsTrigger value="download">Download History</TabsTrigger>
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="templates">Template Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Upload Excel File</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                        <Input type="file" onChange={handleFileChange} disabled={isUploading} />
                                        <Button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
                                            {isUploading ? "Uploading..." : "Upload File"}
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-medium">Select from Uploaded Files</h4>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-sm">{file.originalName}</p>
                                                    <p className="text-xs text-muted-foreground">{file.participantCount} participants • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "This feature is under development." })}>Select</Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Email Composition</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Subject</label>
                                        <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Content</label>
                                        <Textarea className="min-h-[120px]" value={emailContent} onChange={(e) => setEmailContent(e.target.value)} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Use {"{name}"} to personalize emails with recipient names.</p>
                                    <Button className="w-full" onClick={handleSendEmail}><Send className="h-4 w-4 mr-2" />Send Email to 0 Recipients</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="download" className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>Recent Downloads</CardTitle><p className="text-sm text-muted-foreground">Track certificate download activity</p></CardHeader>
                            <CardContent>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="p-2">Certificate ID</th>
                                            <th className="p-2">User</th>
                                            <th className="p-2">Download Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {downloads.map((log) => (
                                            <tr key={log._id}>
                                                <td className="p-2">{log.certificate?.certificateId || 'N/A'}</td>
                                                <td className="p-2">{log.user?.username || 'N/A'}</td>
                                                <td className="p-2">{new Date(log.downloadedAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>User Management</CardTitle><p className="text-sm text-muted-foreground">Manage user accounts and their profiles</p></CardHeader>
                            <CardContent>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="p-2">Username</th>
                                            <th className="p-2">Email</th>
                                            <th className="p-2">Role</th>
                                            <th className="p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td className="p-2">{user.username}</td>
                                                <td className="p-2">{user.email}</td>
                                                <td className="p-2">{user.role}</td>
                                                <td className="p-2">
                                                    <Dialog open={deletingUserId === user._id} onOpenChange={(isOpen) => !isOpen && setDeletingUserId(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="destructive" size="sm" onClick={() => setDeletingUserId(user._id)}>Delete</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone. This will permanently delete the user's account.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button variant="secondary" onClick={() => setDeletingUserId(null)}>Cancel</Button>
                                                                <Button variant="destructive" onClick={() => handleDeleteUser(user._id)}>Delete User</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>Certificate Templates</CardTitle><p className="text-sm text-muted-foreground">Manage certificate design templates and formats</p></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Current Templates</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {templates.map((template) => (
                                            <Card key={template._id} className="border border-border">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h5 className="font-medium">{template.name}</h5>
                                                            <p className="text-sm text-muted-foreground">{template.description}</p>
                                                        </div>
                                                        {template.isActive && <Badge variant="secondary">Active</Badge>}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => handleViewTemplate(template.filePath)}><Eye className="h-4 w-4" /></Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleDownloadTemplate(template.filePath, template.fileName)}><Download className="h-4 w-4" /></Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <Card className="border border-dashed border-border">
                                            <CardContent className="p-4 text-center space-y-3">
                                                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                                <Input
                                                    placeholder="Template Name"
                                                    value={templateName}
                                                    onChange={(e) => setTemplateName(e.target.value)}
                                                    className="mb-2"
                                                />
                                                <Input type="file" onChange={handleTemplateFileChange} />
                                                <Button onClick={handleTemplateUpload} disabled={!selectedTemplateFile || !templateName}>Upload New Template</Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
