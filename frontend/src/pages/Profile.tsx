import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { ChevronLeft, Camera } from "lucide-react";
import { useAuth } from "@/contexts/authcontext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const Profile = () => {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        bio: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.getProfile();
                const profile = response.user;
                setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    email: profile.email || '',
                    phoneNumber: profile.phoneNumber || '',
                    address: profile.address || '',
                    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
                    bio: profile.bio || '',
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast({ title: "Error", description: "Failed to fetch profile data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await api.updateProfile(formData);
            setUser(response.user); // Update user in auth context
            toast({ title: "Success", description: "Profile updated successfully." });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        }
    };

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.uploadProfilePicture(formData);
            setUser(prevUser => prevUser ? { ...prevUser, profilePictureUrl: response.profilePictureUrl } : null);
            toast({ title: "Success", description: "Profile picture updated." });
        } catch (error) {
            console.error("Failed to upload profile picture", error);
            toast({ title: "Error", description: "Failed to upload profile picture.", variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ChevronLeft size={16} />
                        Back to Dashboard
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Picture Section */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={user?.profilePictureUrl ? `http://localhost:5000/${user.profilePictureUrl}` : `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" onClick={() => fileInputRef.current?.click()}>
                                    <Camera size={14} />
                                </Button>
                                <input type="file" ref={fileInputRef} onChange={handlePictureChange} className="hidden" accept="image/*" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-gray-600 text-sm">Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : ''}</p>
                                <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                                    Change Picture
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                👤 Personal Information
                            </CardTitle>
                            <p className="text-gray-600 text-sm mt-1">Update your personal details and contact information</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">📧 Email Address</Label>
                            <Input id="email" type="email" value={formData.email} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">📱 Phone Number</Label>
                            <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} disabled={!isEditing} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">📍 Address</Label>
                            <Input id="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">📅 Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!isEditing} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" value={formData.bio} onChange={handleInputChange} disabled={!isEditing} rows={3} />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Account Settings</CardTitle>
                        <p className="text-gray-600 text-sm">Manage your account preferences and security</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Notifications */}
                            <div>
                                <h3 className="font-semibold mb-4">Notifications</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div><Label>Email notifications for new certificates</Label></div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div><Label>SMS notifications for important updates</Label></div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>

                            {/* Security */}
                            <div>
                                <h3 className="font-semibold mb-4">Security</h3>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">Change Password</Button>
                                    <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
                                    <Button variant="destructive" className="w-full justify-start">Delete Account</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                {isEditing && (
                    <div className="flex justify-end">
                        <Button className="px-8" onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;