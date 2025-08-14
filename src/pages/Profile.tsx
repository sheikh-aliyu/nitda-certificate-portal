import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { ChevronLeft, Camera } from "lucide-react";

const Profile = () => {
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
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                  OB
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera size={14} />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Oguike Benjamin</h3>
                <p className="text-gray-600 text-sm">Member since 2024</p>
                <Button variant="outline" size="sm" className="mt-2">
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
            <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Oguike" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Benjamin" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">📧 Email Address</Label>
              <Input id="email" type="email" defaultValue="oguike.benjamin@gmail.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">📱 Phone Number</Label>
              <Input id="phone" defaultValue="+234 907 234 5678" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">📍 Address</Label>
              <Input id="address" placeholder="Enter your address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">📅 Date of Birth</Label>
              <Input id="dob" type="date" defaultValue="1995-05-15" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Software developer, passionate about technology and continuous learning"
                rows={3}
              />
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
                    <div>
                      <Label>Email notifications for new certificates</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS notifications for important updates</Label>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="font-semibold mb-4">Security</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="px-8">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;