import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Mail, Server } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SettingsSection from "@/components/SettingsSection";
import api from "@/services/api";

const Settings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<any>(null);
    const [initialSettings, setInitialSettings] = useState<any>(null);

    const fetchSettings = async () => {
        try {
            const settingsData = await api.getSettings();
            setSettings(settingsData);
            setInitialSettings(settingsData);
        } catch (error) {
            console.error("Error fetching settings:", error);
            // If settings are not found, maybe initialize with default values
            if (error.message.includes('404')) {
                const defaultSettings = { siteName: 'NITDA Certificate Portal', adminEmail: '', supportEmail: '', emailNotifications: true };
                setSettings(defaultSettings);
                setInitialSettings(defaultSettings);
            }
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.id]: e.target.value });
    };

    const handleSwitchChange = (id: string, checked: boolean) => {
        setSettings({ ...settings, [id]: checked });
    };

    const handleSaveChanges = async () => {
        try {
            await api.updateSettings(settings);
            fetchSettings(); // Refresh settings data
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    if (!settings) {
        return <div>Loading...</div>;
    }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/admin" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and settings</p>
          </div>
          <div className="space-y-6">
            <SettingsSection icon={<SettingsIcon className="w-5 h-5" />} title="General Settings" description="Basic system configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" value={settings.siteName} onChange={handleInputChange} className="bg-background"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" value={settings.adminEmail} onChange={handleInputChange} className="bg-background"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" value={settings.supportEmail} onChange={handleInputChange} className="bg-background"/>
              </div>
            </SettingsSection>
            <SettingsSection icon={<Bell className="w-5 h-5" />} title="Notification Settings" description="Configure system notifications">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-card-foreground">Email Notifications</p>
                  <Switch checked={settings.emailNotifications} onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)} />
                </div>
            </SettingsSection>
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveChanges} className="bg-nitda hover:bg-nitda-dark text-white px-8">
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
