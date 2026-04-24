
"use client"

import React, { useState } from 'react';
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
  Mail,
  Smartphone,
  Server,
  Download,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'compliance' | 'api' | 'data';

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // State for simulated settings
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState([85]);
  const [retention, setRetention] = useState(true);

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your system configuration has been updated successfully.",
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

                <div className="space-y-2">
                  <Label htmlFor="uid">Internal User ID (UID)</Label>
                  <div className="flex gap-2">
                    <Input id="uid" defaultValue={user?.uid || ''} disabled className="font-mono text-xs bg-muted/50 flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => {
                      navigator.clipboard.writeText(user?.uid || '');
                      toast({ description: "UID copied to clipboard" });
                    }}>Copy</Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" /> Biometric Sensitivity
                </CardTitle>
                <CardDescription>Adjust the thresholds for automated verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Confidence Threshold</Label>
                    <Badge variant="secondary">{threshold[0]}%</Badge>
                  </div>
                  <Slider value={threshold} onValueChange={setThreshold} max={100} step={1} />
                  <p className="text-xs text-muted-foreground">High sensitivity reduces false positives but increases manual reviews.</p>
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
                <div className="p-4 bg-muted/50 rounded-lg border font-mono text-xs flex items-center justify-between">
                  <span>test_sk_********************92b1</span>
                  <Badge variant="outline">Sandbox</Badge>
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
            System Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Global infrastructure, security, and profile orchestration.</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
          Project Status: Production
        </Badge>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          <SettingsNavButton 
            icon={User} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <SettingsNavButton 
            icon={Shield} 
            label="Security" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
          />
          <SettingsNavButton 
            icon={Bell} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
          <SettingsNavButton 
            icon={Globe} 
            label="Region & Compliance" 
            active={activeTab === 'compliance'} 
            onClick={() => setActiveTab('compliance')} 
          />
          <SettingsNavButton 
            icon={Key} 
            label="API Keys" 
            active={activeTab === 'api'} 
            onClick={() => setActiveTab('api')} 
          />
          <SettingsNavButton 
            icon={Database} 
            label="Data Management" 
            active={activeTab === 'data'} 
            onClick={() => setActiveTab('data')} 
          />
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
