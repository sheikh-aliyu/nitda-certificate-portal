import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Mail, Server } from "lucide-react";
import { Link } from "react-router-dom";
import SettingsSection from "@/components/SettingsSection";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">

      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and settings</p>
          </div>
          
          <div className="space-y-6">
            {/* General Settings */}
            <SettingsSection
              icon={<SettingsIcon className="w-5 h-5" />}
              title="General Settings"
              description="Basic system configuration"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    defaultValue="NITDA Certificate Portal"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    defaultValue="admin@nitda.gov.ng"
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  defaultValue="support@nitda.gov.ng"
                  className="bg-background"
                />
              </div>
            </SettingsSection>
            
            {/* Notification Settings */}
            <SettingsSection
              icon={<Bell className="w-5 h-5" />}
              title="Notification Settings"
              description="Configure system notifications"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Certificate Ready Notifications</p>
                    <p className="text-sm text-muted-foreground">Notify users when certificates are ready</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">System Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive system maintenance and error alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </SettingsSection>
            
            {/* Security Settings */}
            <SettingsSection
              icon={<Shield className="w-5 h-5" />}
              title="Security Settings"
              description="Configure security and access controls"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Require Email Verification</p>
                    <p className="text-sm text-muted-foreground">Users must verify their email before accessing the system</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      defaultValue="60"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      defaultValue="5"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>
            
            {/* Email Templates */}
            <SettingsSection
              icon={<Mail className="w-5 h-5" />}
              title="Email Templates"
              description="Customize email notification templates"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeTemplate">Welcome Email Template</Label>
                  <Textarea
                    id="welcomeTemplate"
                    defaultValue="Welcome to NITDA Certificate Portal! Your account has been created successfully."
                    className="bg-background min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certificateTemplate">Certificate Ready Email Template</Label>
                  <Textarea
                    id="certificateTemplate"
                    defaultValue="Your certificate is now ready for download. Please log in to your account to access it."
                    className="bg-background min-h-[80px]"
                  />
                </div>
              </div>
            </SettingsSection>
            
            {/* System Settings */}
            <SettingsSection
              icon={<Server className="w-5 h-5" />}
              title="System Settings"
              description="File upload and system configuration"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      defaultValue="10"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedTypes">Allowed File Types</Label>
                    <Input
                      id="allowedTypes"
                      defaultValue=".xlsx,.xls,.pdf"
                      className="bg-background"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Auto Backup</p>
                    <p className="text-sm text-muted-foreground">Automatically backup system data daily</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </SettingsSection>
            
            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button className="bg-nitda hover:bg-nitda-dark text-white px-8">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;