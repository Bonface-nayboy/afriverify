
"use client"

import React from 'react';
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
  Globe
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const { user } = useUser();

  const initials = user?.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your corporate account and system preferences.</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          <SettingsNavButton icon={User} label="Profile" active />
          <SettingsNavButton icon={Shield} label="Security" />
          <SettingsNavButton icon={Bell} label="Notifications" />
          <SettingsNavButton icon={Globe} label="Region" />
          <SettingsNavButton icon={Key} label="API Keys" />
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your public identity on the AfriVerify platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-primary/10">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-white">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.displayName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" defaultValue={user?.email || ''} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uid">Internal User ID (UID)</Label>
                <Input id="uid" defaultValue={user?.uid || ''} disabled className="font-mono text-xs bg-muted" />
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">System Configuration</CardTitle>
              <CardDescription>Manage environment variables and core biometrics thresholds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Confidence Threshold</p>
                  <p className="text-xs text-muted-foreground">Minimum match score to auto-verify (Current: 85%)</p>
                </div>
                <Button variant="outline" size="sm">Adjust</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Data Retention</p>
                  <p className="text-xs text-muted-foreground">Automatically purge logs after 90 days.</p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
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
        "w-full justify-start font-medium",
        active ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"
      )}
    >
      <Icon className="mr-3 h-4 w-4" /> {label}
    </Button>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase", className)}>
      {children}
    </span>
  );
}
