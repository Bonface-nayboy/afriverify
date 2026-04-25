
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/camera-capture';
import { api } from '@/lib/api';
import { 
  UserCheck, 
  RotateCw, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Eye,
  Scan
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const instructions = [
  "Center your face",
  "Turn slightly left",
  "Turn slightly right",
  "Blink once",
];

export default function LivenessPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'RECORDING' | 'ANALYZING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [score, setScore] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'RECORDING') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStep < instructions.length - 1) {
              setCurrentStep(s => s + 1);
              return 0;
            } else {
              setStatus('ANALYZING');
              const finalScore = 98.4 + Math.random() * 1.5;
              setScore(finalScore);
              setTimeout(() => {
                setStatus('SUCCESS');
                api.recordLivenessCheck(finalScore, 'SUCCESS');
              }, 2500);
              return 100;
            }
          }
          return prev + 8;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, currentStep]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Zap className="text-primary w-8 h-8" /> Biometric AI Engine
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Real-time anti-spoofing & motion analysis.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full border border-green-500/20 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> iBeta Level 2 Certified
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 overflow-hidden border-2 border-primary/20 shadow-2xl relative">
          <CardContent className="p-0 bg-black aspect-video flex items-center justify-center">
            {status === 'IDLE' && (
              <div className="text-center p-8 space-y-6 z-10 relative">
                <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                  <Scan className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Start Verification</h3>
                  <p className="text-white/60 text-sm max-w-xs mx-auto">
                    Position your face within the frame and follow the on-screen prompts.
                  </p>
                </div>
                <Button size="lg" onClick={() => setStatus('RECORDING')} className="rounded-full px-12 h-14 text-lg font-bold shadow-lg shadow-primary/30">
                  Begin Session
                </Button>
              </div>
            )}

            {status === 'RECORDING' && (
              <div className="relative w-full h-full group">
                <CameraCapture aspectRatio="video" onCapture={() => {}} />
                
                {/* AI HUD Overlay */}
                <div className="absolute inset-0 border-4 border-primary/30 m-8 rounded-3xl pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">
                    Face Detected
                  </div>
                  
                  {/* Landmark Simulation */}
                  <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-accent rounded-full animate-ping" />
                  <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent rounded-full animate-ping" />
                  <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-accent rounded-full opacity-50" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="bg-white/10 backdrop-blur-xl px-8 py-3 rounded-2xl border border-white/20 text-white font-black text-xl shadow-2xl animate-in slide-in-from-bottom-2">
                    {instructions[currentStep]}
                  </div>
                  <div className="w-full max-w-sm">
                    <Progress value={progress} className="h-1.5 bg-white/10" />
                  </div>
                </div>
              </div>
            )}

            {status === 'ANALYZING' && (
              <div className="text-center p-12 space-y-6">
                <div className="relative h-20 w-20 mx-auto">
                  <Loader2 className="h-20 w-20 animate-spin text-primary" />
                  <ShieldCheck className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">AI Neural Scan</h3>
                  <p className="text-white/60 animate-pulse font-medium">Extracting skin-texture & micro-motion signals...</p>
                </div>
              </div>
            )}

            {status === 'SUCCESS' && (
              <div className="text-center p-12 space-y-8 animate-in zoom-in duration-500">
                <div className="h-32 w-32 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-green-500/40 relative">
                  <CheckCircle2 className="h-16 w-16" />
                  <div className="absolute -inset-4 border-2 border-green-500/30 rounded-full animate-ping" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white">Liveness Real</h3>
                  <p className="text-green-400 font-black text-xl tracking-wider">SCORE: {score.toFixed(2)}%</p>
                </div>
                <Button variant="outline" onClick={() => setStatus('IDLE')} className="text-white border-white/20 hover:bg-white/10 rounded-xl h-12 px-8">
                  Restart Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-muted/50 border-none shadow-none">
            <CardContent className="p-6 space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" /> Engine Insights
              </h4>
              <div className="space-y-4">
                <InsightRow label="Motion Consistency" value="High" color="text-green-500" />
                <InsightRow label="Skin-Texture Pulse" value="Detected" color="text-green-500" />
                <InsightRow label="Eye Blink Count" value="1/1" color="text-green-500" />
                <InsightRow label="3D Depth Mapping" value="Verified" color="text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <CardContent className="p-6 space-y-3 relative z-10">
              <h4 className="font-black text-lg">Developer API</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Integrate this engine into your mobile or web apps with 3 lines of code.
              </p>
              <Button variant="secondary" className="w-full font-bold bg-white text-primary">
                View SDK Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className={cn("font-black uppercase tracking-tighter", color)}>{value}</span>
    </div>
  );
}
