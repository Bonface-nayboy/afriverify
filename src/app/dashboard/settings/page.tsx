
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
  Sliders
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  
  // Simulated Settings State
  const [threshold, setThreshold] = useState([85]);
  const [retention, setRetention] = useState(true);
  const [saving, setSaving] = useState(false);

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const handleSaveProfile = () => {
    setSaving(true);
    // Simulate API delay
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved to the AfriVerify directory.",
      });
    }, 1000);
  };

  const handleAdjustThreshold = (val: number[]) => {
    setThreshold(val);
    toast({
      title: "Threshold Updated",
      description: `Biometric confidence threshold set to ${val[0]}%.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
          System Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your corporate account, security preferences, and biometric thresholds.</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          <SettingsNavButton icon={User} label="Profile" active />
          <SettingsNavButton icon={Shield} label="Security" />
          <SettingsNavButton icon={Bell} label="Notifications" />
          <SettingsNavButton icon={Globe} label="Region & Compliance" />
          <SettingsNavButton icon={Key} label="API Keys" />
          <SettingsNavButton icon={Database} label="Data Management" />
        </aside>

        <div className="space-y-6">
          {/* Profile Section */}
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
                <Button onClick={handleSaveProfile} disabled={saving} className="min-w-[120px]">
                  {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Config Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" /> System Configuration
              </CardTitle>
              <CardDescription>Adjust the sensitivity and behavior of the biometric engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Confidence Threshold</p>
                    <p className="text-xs text-muted-foreground">Minimum match score to automatically verify a user.</p>
                  </div>
                  <Badge variant="secondary" className="font-mono">{threshold[0]}%</Badge>
                </div>
                <Slider 
                  value={threshold} 
                  max={100} 
                  step={1} 
                  onValueChange={setThreshold}
                  onValueCommit={handleAdjustThreshold}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Data Retention Policy</p>
                  <p className="text-xs text-muted-foreground">Automatically purge biometric logs after 90 days for GDPR compliance.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={retention ? "default" : "outline"} className={cn(retention ? "bg-green-100 text-green-700 hover:bg-green-100" : "")}>
                    {retention ? "Active" : "Disabled"}
                  </Badge>
                  <Switch 
                    checked={retention} 
                    onCheckedChange={(val) => {
                      setRetention(val);
                      toast({
                        title: `Retention ${val ? 'Enabled' : 'Disabled'}`,
                        description: val ? "Data will be purged after 90 days." : "Data will be stored indefinitely.",
                      });
                    }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Liveness "Nod" Requirement</p>
                  <p className="text-xs text-muted-foreground">Require physical nodding during biometric liveness sessions.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsNavButton({ icon: Icon, label, active = false }: any) {
  return (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full justify-start font-medium h-11",
        active ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="mr-3 h-4 w-4" /> {label}
    </Button>
  );
}
