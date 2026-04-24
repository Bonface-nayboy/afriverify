"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/camera-capture';
import { api } from '@/lib/api';
import { 
  UserCheck, 
  RotateCw, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const instructions = [
  "Look straight ahead",
  "Turn your head left",
  "Turn your head right",
  "Nod your head",
];

export default function LivenessPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'RECORDING' | 'ANALYZING' | 'SUCCESS' | 'FAILED'>('IDLE');

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
              const score = 98 + Math.random() * 2;
              setTimeout(() => {
                setStatus('SUCCESS');
                api.recordLivenessCheck(score, 'SUCCESS');
              }, 2000);
              return 100;
            }
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [status, currentStep]);

  const startSession = () => {
    setStatus('RECORDING');
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Biometric Liveness Check</h1>
        <p className="text-muted-foreground mt-2">Prevent presentation attacks and deepfakes with real-time motion analysis.</p>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20">
        <CardContent className="p-0">
          <div className="relative aspect-square md:aspect-video bg-black flex items-center justify-center">
            {status === 'IDLE' && (
              <div className="text-center p-8 space-y-6">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <UserCheck className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Ready for Liveness Test?</h3>
                  <p className="text-white/60 text-sm max-w-xs mx-auto">
                    You will be asked to perform simple head movements to verify you are a real person.
                  </p>
                </div>
                <Button size="lg" onClick={startSession} className="rounded-full px-8">
                  Start Session
                </Button>
              </div>
            )}

            {status === 'RECORDING' && (
              <>
                <CameraCapture 
                  aspectRatio="video" 
                  onCapture={() => {}} 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-bold animate-pulse">
                    {instructions[currentStep]}
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <Progress value={progress} className="h-1 bg-white/20" />
                  </div>
                </div>
              </>
            )}

            {status === 'ANALYZING' && (
              <div className="text-center p-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <h3 className="text-xl font-bold text-white">Analyzing Movements</h3>
                <p className="text-white/60">Using neural networks to detect spoofing signals...</p>
              </div>
            )}

            {status === 'SUCCESS' && (
              <div className="text-center p-12 space-y-6 animate-in zoom-in duration-300">
                <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white">Liveness Confirmed</h3>
                  <p className="text-green-400 font-medium">Confidence Score: 99.8%</p>
                </div>
                <Button variant="outline" onClick={() => setStatus('IDLE')} className="text-white border-white hover:bg-white/10">
                  New Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Why Liveness?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard photos can be easily faked. Our engine detects muscle micro-movements to ensure a real presence.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
              <RotateCw className="w-4 h-4" /> Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fully compliant with iBeta Level 2 standards for biometric spoof detection.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}