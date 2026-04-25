
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Terminal, 
  Key, 
  Copy, 
  RotateCw, 
  Plus,
  Webhook,
  Code2,
  Check,
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function DeveloperPlatform() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [creating, setCreating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourcompany.com/webhooks");

  const keyQuery = React.useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apikeys'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: keys, loading: keysLoading } = useCollection<any>(keyQuery);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "API Key copied to clipboard." });
  };

  const handleCreateKey = async () => {
    setCreating(true);
    try {
      await api.generateAPIKey(`Key ${new Date().toLocaleDateString()}`);
      toast({ title: "Success", description: "New API Key generated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate key." });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'apikeys', id));
      toast({ title: "Deleted", description: "API Key revoked." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to revoke key." });
    }
  };

  const handleSaveWebhook = () => {
    toast({ title: "Updated", description: "Webhook endpoint updated successfully." });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Code2 className="text-primary w-10 h-10" /> Developer Hub
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Build secure verification flows with the AfriVerify API.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold">
            <Terminal className="w-4 h-4 mr-2" /> API Specs
          </Button>
          <Button className="font-bold" onClick={handleCreateKey} disabled={creating}>
            {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Create New Key
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> Access Credentials
              </CardTitle>
              <CardDescription>Manage your production and sandbox API keys.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {keysLoading ? (
                  <div className="p-12 text-center text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading keys...</div>
                ) : keys.length > 0 ? keys.map((k) => (
                  <div key={k.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm">{k.name}</p>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">{k.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg border">
                        <span className="truncate">{k.key}</span>
                        <button onClick={() => copyToClipboard(k.key)} className="hover:text-primary shrink-0">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(k.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-muted-foreground">No API keys found. Create your first one to get started.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground">Quick Start Guide</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <GuideStep 
                num="01" 
                title="Initialize SDK" 
                code={`import { AfriVerify } from '@afriverify/node';\nconst client = new AfriVerify('YOUR_KEY');`} 
              />
              <GuideStep 
                num="02" 
                title="Run Verification" 
                code={`const res = await client.verify({\n  selfie: base64Img,\n  document: base64Doc\n});`} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Webhook className="w-5 h-5 text-accent" /> Webhooks
              </CardTitle>
              <CardDescription>Real-time event notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Endpoint URL</p>
                <div className="flex gap-2">
                  <Input 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs" 
                  />
                  <Button size="sm" onClick={handleSaveWebhook}>Save</Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Event Subscriptions</p>
                <EventToggle label="verification.completed" checked />
                <EventToggle label="verification.suspicious" checked />
                <EventToggle label="fraud_alert.critical" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white border-none overflow-hidden group">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black tracking-tight">Full Documentation</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Explore our exhaustive API references, sample codes, and Postman collections.
                </p>
              </div>
              <Button variant="secondary" className="w-full bg-white text-black font-black">
                Open DevPortal <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GuideStep({ num, title, code }: any) {
  return (
    <div className="p-5 rounded-2xl bg-muted/30 border space-y-3 hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">{num}</span>
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      <pre className="bg-zinc-950 p-4 rounded-xl text-[10px] text-green-400 font-mono overflow-auto leading-relaxed shadow-inner">
        {code}
      </pre>
    </div>
  );
}

function EventToggle({ label, checked: initialChecked }: any) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/50 cursor-pointer group" onClick={() => setChecked(!checked)}>
      <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
      <div className={cn(
        "h-4 w-4 rounded border flex items-center justify-center transition-all",
        checked ? "bg-primary border-primary text-white" : "border-muted-foreground"
      )}>
        {checked && <Check className="w-3 h-3" />}
      </div>
    </div>
  );
}
