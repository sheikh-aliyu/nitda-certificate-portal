import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Eye, Download, Search } from "lucide-react";
import { useAuth } from "@/contexts/authcontext";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import CertificatePreview from "@/components/CertificatePreview";

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
        const response = await api.getMyCertificates();
        setCertificates(response.certificates || []);
        } catch (error) {
        console.error("Error fetching certificates:", error);
        } finally {
        setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDownload = async (certificateId: string) => {
        setDownloadingId(certificateId);
        try {
            const blob = await api.downloadCertificate(certificateId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate-${certificateId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast({
                title: "Download Started",
                description: "Your certificate download has started.",
            });
        } catch (error) {
            console.error("Download error:", error);
            toast({
                title: "Download Failed",
                description: "Could not download the certificate. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredCertificates = certificates.filter((cert: any) =>
        cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const metrics = [
        { title: "Total Certificates", value: certificates.length, icon: "📜" },
        { title: "Completed Courses", value: certificates.length, icon: "📈" },
        { title: "Active Certificates", value: certificates.filter((c: any) => c.status === 'active').length, icon: "📋" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.username || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
            <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                <User size={16} />
                Profile
                </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
            </Button>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </div>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="text-center py-8">Loading certificates...</div>
            ) : filteredCertificates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No certificates found matching your search." : "You don't have any certificates yet."}
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCertificates.map((cert: any) => (
                    <TableRow key={cert.certificateId}>
                        <TableCell className="font-medium">{cert.certificateId}</TableCell>
                        <TableCell>
                        <div>
                            <div className="font-medium">{cert.courseName}</div>
                            <div className="text-sm text-gray-600">{cert.courseType}</div>
                        </div>
                        </TableCell>
                        <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            cert.status === 'active' ? 'bg-green-100 text-green-800' :
                            cert.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {cert.status}
                        </span>
                        </TableCell>
                        <TableCell>
                        <div className="flex gap-2">
                            <CertificatePreview certificateId={cert.certificateId} />
                            <Button
                                size="sm"
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleDownload(cert.certificateId)}
                                disabled={downloadingId === cert.certificateId}
                            >
                                {downloadingId === cert.certificateId ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={14} />
                                        <span>Download</span>
                                    </>
                                )}
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>
        </div>
    );
};

export default UserDashboard;