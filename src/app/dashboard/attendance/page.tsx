"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/camera-capture';
import { api, AttendanceResult } from '@/lib/api';
import { 
  ScanFace, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  History,
  Info
} from 'lucide-react';

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [history, setHistory] = useState<AttendanceResult[]>([]);

  const handleCapture = async (img: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.recognizeFace(img);
      setResult(res);
      setHistory(prev => [res, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Face Recognition Attendance</h1>
          <p className="text-muted-foreground mt-2">Touchless access control with millisecond recognition speed.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          System Online
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scanner Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <CameraCapture onCapture={handleCapture} aspectRatio="video" />
              
              <div className="mt-8 flex flex-col items-center justify-center min-h-[120px]">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium animate-pulse">Identifying employee...</p>
                  </div>
                ) : result ? (
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 w-full animate-in slide-in-from-bottom-4 duration-500">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                      {result.userName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{result.userName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(result.timestamp).toLocaleTimeString()}</span>
                        <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle2 className="w-3 h-3" /> {result.confidence}% Match</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase font-bold text-muted-foreground">ID</p>
                      <p className="font-mono font-bold text-primary">{result.userId}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ScanFace className="h-10 w-10 opacity-20" />
                    <p className="text-sm">Stand in front of the camera to check in</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-none">
            <CardContent className="p-4 flex gap-4 items-start">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary/80 leading-relaxed">
                Our Face Recognition system uses 128-dimensional biometric embeddings. Data is encrypted and anonymized to ensure employee privacy and GDPR/POPIA compliance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* History / Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" /> Recent Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.length > 0 ? history.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {entry.userName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{entry.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-green-600 uppercase">Match</p>
                      <p className="text-xs font-mono">{entry.confidence.toFixed(0)}%</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No activity logs yet.
                  </div>
                )}
              </div>
              {history.length > 0 && (
                <Button variant="link" className="w-full text-xs mt-4">View All Activity Logs</Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-accent text-white border-none">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold">Upgrade for Enterprise</h4>
              <p className="text-sm opacity-90">Unlock multi-camera support, thermal imaging, and HR software integrations (BambooHR, Workday).</p>
              <Button variant="secondary" className="w-full bg-white text-accent hover:bg-white/90">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}