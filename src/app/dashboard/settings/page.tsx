"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database,
  Key,
  Globe,
  Save,
  Sliders,
  Fingerprint,
  Smartphone,
  Download,
  Trash2,
  Plus,
  Palette,
  Check
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';

type SettingsTab = 'profile' | 'appearance' | 'security' | 'notifications' | 'compliance' | 'api' | 'data';

const colorThemes = [
  { id: 'default', name: 'Standard Blue', color: 'bg-blue-500' },
  { id: 'green', name: 'Emerald Green', color: 'bg-emerald-500' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
  { id: 'orange', name: 'Amber Orange', color: 'bg-orange-500' },
];

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState([85]);
  const [retention, setRetention] = useState(true);
  const [colorTheme, setColorTheme] = useState('default');

  useEffect(() => {
    const savedColor = localStorage.getItem('app-color-theme') || 'default';
    setColorTheme(savedColor);
    
    // Apply theme logic: color themes should NOT be applied on system default mode
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-color-theme');
    } else {
      if (savedColor !== 'default') {
        document.documentElement.setAttribute('data-color-theme', savedColor);
      } else {
        document.documentElement.removeAttribute('data-color-theme');
      }
    }
  }, [theme]);

  const handleColorThemeChange = (id: string) => {
    if (theme === 'system') {
      toast({
        variant: "destructive",
        title: "Feature Restricted",
        description: "Color themes are disabled in 'System Default' mode. Switch to Light or Dark mode to change colors.",
      });
      return;
    }

    setColorTheme(id);
    localStorage.setItem('app-color-theme', id);
    if (id === 'default') {
      document.documentElement.removeAttribute('data-color-theme');
    } else {
      document.documentElement.setAttribute('data-color-theme', id);
    }
    toast({
      title: "Theme Updated",
      description: `Switched to ${id.charAt(0).toUpperCase() + id.slice(1)} theme.`,
    });
  };

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    }, 800);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your public identity on the AfriVerify platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-4 border-primary/10">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-[10px] text-muted-foreground">JPG, PNG or WEBP. Max size of 1MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.displayName || 'Authorized Admin'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" defaultValue={user?.email || ''} disabled className="bg-muted/50 cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" /> Visual Preferences
                </CardTitle>
                <CardDescription>Customize the look and feel of your command center.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {colorThemes.map((t) => (
                      <button
                        key={t.id}
                        disabled={theme === 'system'}
                        onClick={() => handleColorThemeChange(t.id)}
                        className={cn(
                          "group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed",
                          colorTheme === t.id ? "border-primary bg-primary/5" : "border-transparent"
                        )}
                      >
                        <div className={cn("h-8 w-8 rounded-full shadow-inner", t.color)} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.name}</span>
                        {colorTheme === t.id && (
                          <div className="absolute top-2 right-2 h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center">
                            <Check className="h-2 w-2" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {theme === 'system' && (
                    <p className="text-xs text-orange-600 font-medium">Color themes are disabled when using System Default mode.</p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block">Biometric Threshold</Label>
                      <p className="text-[10px] text-muted-foreground">Adjust sensitivity for auto-approvals</p>
                    </div>
                    <Badge variant="secondary">{threshold[0]}%</Badge>
                  </div>
                  <Slider value={threshold} onValueChange={setThreshold} max={100} step={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Security</CardTitle>
                <CardDescription>Manage your sign-in methods and 2FA settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">Biometric Sign-in</p>
                      <p className="text-xs text-muted-foreground">Use Windows Hello or Touch ID</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Authenticator app or SMS codes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Configure when you receive email and push notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>High-Risk Fraud Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Weekly Performance Reports</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>New Integration Successful</Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Region & Data Privacy</CardTitle>
                <CardDescription>Configure storage regions and compliance frameworks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Preferred Data Residency</Label>
                  <Select defaultValue="ng-lagos">
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ng-lagos">Lagos, Nigeria (Afri-West-1)</SelectItem>
                      <SelectItem value="za-joburg">Johannesburg, SA (Afri-South-2)</SelectItem>
                      <SelectItem value="ke-nairobi">Nairobi, Kenya (Afri-East-1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">GDPR/POPIA Compliance Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable specialized processing for regional privacy laws.</p>
                  </div>
                  <Switch checked={retention} onCheckedChange={setRetention} />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Production API Keys</CardTitle>
                  <CardDescription>Use these keys to integrate AfriVerify with your applications.</CardDescription>
                </div>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Key</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border font-mono text-xs flex items-center justify-between">
                  <span>live_pk_********************8a3f</span>
                  <Badge>Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or permanently remove your biometric datasets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" /> Export All Verification Logs (.csv)
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete All Compliance Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure your personal and system-wide preferences.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          <SettingsNavButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SettingsNavButton icon={Palette} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
          <SettingsNavButton icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <SettingsNavButton icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SettingsNavButton icon={Globe} label="Compliance" active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} />
          <SettingsNavButton icon={Key} label="API Keys" active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
          <SettingsNavButton icon={Database} label="Data" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
        </aside>

        <div className="min-h-[500px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function SettingsNavButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "w-full justify-start font-medium h-11 transition-all",
        active ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm" : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="mr-3 h-4 w-4" /> {label}
    </Button>
  );
}
