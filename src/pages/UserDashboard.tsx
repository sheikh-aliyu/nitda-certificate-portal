import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { User, LogOut, Eye, Download, Search } from "lucide-react";

const UserDashboard = () => {
    const metrics = [
        { title: "Total Certificates", value: 3, icon: "📜" },
        { title: "Completed Courses", value: 3, icon: "📈" },
        { title: "Recent Activity", value: 3, icon: "📋" }
    ];

    const certificates = [
        {
        id: "PYB-2025-001",
        course: "Python Beginners",
        instructor: "Oguike Benjamin",
        completionDate: "17TH March 2025"
        },
        {
        id: "PYA-2025-002", 
        course: "Python Advanced",
        instructor: "Oguike Benjamin",
        completionDate: "17TH March 2025"
        },
        {
        id: "DSB-2025-003",
        course: "Data Science Beginners", 
        instructor: "Oguike Benjamin",
        completionDate: "11th May 2025"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Oguike Benjamin</p>
            </div>
            <div className="flex items-center gap-4">
            <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                <User size={16} />
                Profile
                </Button>
            </Link>
            <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
                </Button>
            </Link>
            </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
            <Card key={index} className="bg-white">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-2xl">{metric.icon}</div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Certificates Section */}
        <Card className="bg-white">
            <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                <CardTitle className="text-xl font-semibold">My Certificates</CardTitle>
                <p className="text-gray-600 text-sm mt-1">View and download your earned certificates</p>
                </div>
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                    placeholder="Search certificates..." 
                    className="pl-10 w-64"
                />
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.id}</TableCell>
                    <TableCell>
                        <div>
                        <div className="font-medium">{cert.course}</div>
                        <div className="text-sm text-gray-600">{cert.instructor}</div>
                        </div>
                    </TableCell>
                    <TableCell>{cert.completionDate}</TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye size={14} />
                            Preview
                        </Button>
                        <Button size="sm" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                            <Download size={14} />
                            Download
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
    );
};

export default UserDashboard;