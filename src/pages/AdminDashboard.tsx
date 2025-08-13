import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Shield, Users, TrendingUp, TrendingDown, Search, MoreHorizontal, 
    Settings, LogOut, Eye, FileText, Mail, Send} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("upload");

    const metrics = [
    {   title: "Total Uploads",
        value: "156",
        change: "+12% from last month",
        trend: "up",
        icon: Upload,
    },
    {   title: "Total Downloads", 
        value: "1243",
        change: "+23% from last month",
        trend: "up",
        icon: Download,
    },
    {   title: "Active Certificates",
        value: "89", 
        change: "Ready for download",
        trend: "neutral",
        icon: Shield,
    },
    {   title: "Total Users",
        value: "456",
        change: "Registered accounts",
        trend: "neutral", 
        icon: Users,
    }
];

    const users = [
    {   id: "JD",
        name: "John Doe",
        email: "john@example.com",
        department: "Engineering",
        password: "********"
    },
    {   id: "JS", 
        name: "Jane Smith",
        email: "jane@example.com",
        department: "Marketing",
        password: "********"
    },
    {   id: "MJ",
        name: "Mike Johnson", 
        email: "mike@example.com",
        department: "Operations",
        password: "********"
    }
];

    const downloads = [
    {   user: "John Doe",
        certificate: "Python Basics",
        date: "2025-01-20",
        time: "14:30"
    },
    {   user: "Jane Smith", 
        certificate: "Data Science",
        date: "2025-01-20",
        time: "13:45"
    },
    {   user: "Mike Johnson",
        certificate: "Web Development", 
        date: "2025-01-20",
        time: "12:15"
    }
];

    const uploadedFiles = [
    {   name: "Python_Training_Participants_2025.xlsx",
        participants: "45 participants",
        uploaded: "2025-01-18"
    },
    {   name: "Data_Science_Cohort_Jan2025.xlsx", 
        participants: "32 participants",
        uploaded: "2025-01-16"
    },
    {   name: "Web_Dev_Bootcamp_Batch1.xlsx",
        participants: "28 participants", 
        uploaded: "2025-01-05"
    }
];

    return (
        <div className="min-h-screen bg-dashboard-bg">
        {/* Header */}
        <header className="bg-background border-b border-border">
            <div className="flex h-16 items-center justify-between px-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage certificates and user accounts</p>
            </div>
            
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Link>
                </Button>
            </div>
            </div>
        </header>

        <div className="p-6 space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <Card key={metric.title} className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-metric-up" />}
                    {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-metric-down" />}
                    {metric.trend === "neutral" && <metric.icon className="h-4 w-4 text-metric-neutral" />}
                    </div>
                    <div className="space-y-1">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.change}</p>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload">Upload Management</TabsTrigger>
                <TabsTrigger value="download">Download History</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="templates">Template Management</TabsTrigger>
            </TabsList>

            {/* Upload Management */}
            <TabsContent value="upload" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Upload Excel File
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                        <p className="font-medium">Drop your Excel file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports Excel (.xlsx, .xls) files only</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="font-medium">Select from Uploaded Files</h4>
                        {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="space-y-1">
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.participants} • Uploaded {file.uploaded}</p>
                            </div>
                            <Button size="sm" variant="outline">Select</Button>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Composition
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Subject</label>
                        <Input defaultValue="Your Certificate is Ready!" />
                    </div>
                  
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Content</label>
                        <Textarea 
                        className="min-h-[120px]"
                        defaultValue={`Dear {name},

    We are pleased to inform you that your certificate is now ready for download. Please log in to your account to access your certificate.

    Best regards,
    NITDA Team`}
                        />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                        Use {"{name}"} to personalize emails with recipient names.
                    </p>
                    
                    <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Email to 0 Recipients
                    </Button>
                    </CardContent>
                </Card>
                </div>
            </TabsContent>

            {/* Download History */}
            <TabsContent value="download" className="space-y-4">
                <Card>
                <CardHeader>
                    <CardTitle>Recent Downloads</CardTitle>
                    <p className="text-sm text-muted-foreground">Track certificate download activity</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search downloads..." className="max-w-sm" />
                    </div>
                    
                    <div className="rounded-md border">
                        <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                        <div>User</div>
                        <div>Certificate</div>
                        <div>Date</div>
                        <div>Time</div>
                        </div>
                        {downloads.map((download, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                            <div className="font-medium">{download.user}</div>
                            <div>{download.certificate}</div>
                            <div>{download.date}</div>
                            <div>{download.time}</div>
                        </div>
                        ))}
                    </div>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users" className="space-y-4">
                <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage user accounts and their profiles</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="max-w-sm" />
                    </div>
                    
                    <div className="rounded-md border">
                        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                        <div>User</div>
                        <div>Email</div>
                        <div>Department</div>
                        <div>Password</div>
                        <div>Actions</div>
                        <div></div>
                        </div>
                        {users.map((user, index) => (
                        <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
                            <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {user.id}
                            </div>
                            <span className="font-medium">{user.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-sm">{user.department}</div>
                            <div className="text-sm">{user.password}</div>
                            <Button size="sm" variant="outline">
                            Reset Password
                            </Button>
                            <Button size="sm" variant="destructive">
                            Delete
                            </Button>
                        </div>
                        ))}
                    </div>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Template Management */}
            <TabsContent value="templates" className="space-y-4">
                <Card>
                <CardHeader>
                    <CardTitle>Certificate Templates</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage certificate design templates and formats</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-4 py-8">
                    <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">View Certificate Template</h3>
                        <p className="text-sm text-muted-foreground">Preview the current certificate design template</p>
                    </div>
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Template
                    </Button>
                    <p className="text-xs text-muted-foreground">See how certificates will look when generated</p>
                    </div>
                    
                    <div className="space-y-4">
                    <h4 className="font-medium">Current Templates</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border border-border">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                            <div>
                                <h5 className="font-medium">Default Certificate</h5>
                                <p className="text-sm text-muted-foreground">Standard NITDA certificate template</p>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                        
                        <Card className="border border-dashed border-border">
                        <CardContent className="p-4 text-center space-y-3">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div>
                            <h5 className="font-medium">Upload New Template</h5>
                            <p className="text-sm text-muted-foreground">Add a custom certificate design</p>
                            </div>
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