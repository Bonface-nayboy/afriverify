"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/camera-capture';
import { api, KYCResult } from '@/lib/api';
import { 
  Upload, 
  CheckCircle2, 
  Loader2, 
  User, 
  FileText,
  Calendar,
  Globe,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Step = 'UPLOAD_ID' | 'SELFIE' | 'PROCESSING' | 'RESULT';

export default function KYCPage() {
  const [step, setStep] = useState<Step>('UPLOAD_ID');
  const [idFront, setIdFront] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [result, setResult] = useState<KYCResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIdFront(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startVerification = async () => {
    if (!idFront || !selfie) return;
    setStep('PROCESSING');
    setLoading(true);
    try {
      const res = await api.verifyIdentity(idFront, '', selfie);
      setResult(res);
      setStep('RESULT');
    } catch (err) {
      console.error(err);
      setStep('UPLOAD_ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Identity Verification Demo</h1>
        <p className="text-muted-foreground mt-2">Test our AI document extraction and facial matching technology.</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <StepperItem active={step === 'UPLOAD_ID'} completed={step !== 'UPLOAD_ID'} label="Upload ID" />
        <div className="h-px w-8 bg-border" />
        <StepperItem active={step === 'SELFIE'} completed={['PROCESSING', 'RESULT'].includes(step)} label="Take Selfie" />
        <div className="h-px w-8 bg-border" />
        <StepperItem active={step === 'RESULT'} completed={false} label="Verify" />
      </div>

      <Card className="min-h-[400px] flex flex-col justify-center">
        <CardContent className="pt-6">
          {step === 'UPLOAD_ID' && (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl border-primary/20 bg-primary/5">
                {idFront ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border shadow-lg">
                    <img src={idFront} alt="ID Front" className="w-full h-full object-cover" />
                    <Button 
                      variant="secondary" 
                      className="absolute bottom-4 right-4"
                      onClick={() => setIdFront(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upload Identity Document</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">Support for Passports, National IDs, and Driver's Licenses from 150+ countries.</p>
                    <input 
                      type="file" 
                      id="id-upload" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleIdUpload}
                    />
                    <Button onClick={() => document.getElementById('id-upload')?.click()}>
                      Select Image
                    </Button>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <Button disabled={!idFront} onClick={() => setStep('SELFIE')}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 'SELFIE' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Facial Biometrics</h3>
                <p className="text-muted-foreground">Take a clear photo of your face to match against the ID document.</p>
              </div>
              <CameraCapture onCapture={(img) => setSelfie(img)} />
              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep('UPLOAD_ID')}>Back</Button>
                <Button disabled={!selfie} onClick={startVerification}>Verify My Identity</Button>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center p-12 space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Processing Verification</h3>
                <p className="text-muted-foreground animate-pulse">Running OCR, FaceMatch, and Liveness checks...</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Extracting Data</span>
                  <span>65%</span>
                </div>
              </div>
            </div>
          )}

          {step === 'RESULT' && result && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className={cn(
                "flex items-center gap-6 p-6 rounded-2xl border",
                result.status === 'VERIFIED' ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
              )}>
                {result.status === 'VERIFIED' ? (
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                ) : (
                  <ShieldCheck className="h-12 w-12 text-orange-600" />
                )}
                <div>
                  <h3 className={cn("text-2xl font-bold", result.status === 'VERIFIED' ? "text-green-800" : "text-orange-800")}>
                    {result.status === 'VERIFIED' ? "Identity Verified" : "Suspicious Activity Detected"}
                  </h3>
                  <p className={result.status === 'VERIFIED' ? "text-green-700" : "text-orange-700"}>
                    {result.status === 'VERIFIED' 
                      ? "Verification successful. All checks passed with high confidence." 
                      : "The AI analyst flagged some inconsistencies. Review required."}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Extracted Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 p-4 bg-muted/30 rounded-xl border">
                    <DataField icon={User} label="Full Name" value={result.ocrData.name} />
                    <DataField icon={CheckCircle2} label="Document #" value={result.ocrData.idNumber} />
                    <DataField icon={Calendar} label="Date of Birth" value={result.ocrData.dob} />
                    <DataField icon={Calendar} label="Expiry Date" value={result.ocrData.expiry} />
                    <DataField icon={Globe} label="Issuing Country" value={result.ocrData.country} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Confidence Scores
                  </h4>
                  <div className="space-y-6 p-6 bg-muted/30 rounded-xl border">
                    <ScoreIndicator label="Face Matching" score={result.faceMatchScore} color="bg-primary" />
                    <ScoreIndicator label="Liveness Score" score={result.livenessScore} color="bg-accent" />
                    <ScoreIndicator label="Data Integrity" score={99.4} color="bg-green-500" />
                  </div>
                </div>
              </div>

              {result.aiExplanation && (
                <Card className="bg-orange-50 border-orange-100">
                  <CardContent className="pt-6">
                    <h4 className="text-sm font-bold text-orange-800 uppercase flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4" /> AI Analyst Commentary
                    </h4>
                    <p className="text-sm text-orange-700 leading-relaxed">{result.aiExplanation}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center pt-4">
                <Button variant="outline" size="lg" onClick={() => setStep('UPLOAD_ID')}>
                  Start New Verification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepperItem({ active, completed, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center transition-all border-2",
        completed ? "bg-primary border-primary text-white" :
        active ? "bg-white border-primary text-primary" : "bg-white border-muted text-muted-foreground"
      )}>
        {completed ? <CheckCircle2 className="h-6 w-6" /> : <div className="h-2 w-2 rounded-full bg-current" />}
      </div>
      <span className={cn("text-xs font-bold uppercase tracking-wider", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
    </div>
  );
}

function DataField({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-6 w-6 text-muted-foreground shrink-0"><Icon className="w-4 h-4" /></div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ScoreIndicator({ label, score, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{score.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", color)} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}