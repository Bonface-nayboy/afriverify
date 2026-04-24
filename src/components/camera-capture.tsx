"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  label?: string;
  aspectRatio?: 'portrait' | 'video';
}

export function CameraCapture({ onCapture, label = "Capture Photo", aspectRatio = 'portrait' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError("Camera permission denied or not found.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsActive(false);
    }
  };

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  }, [onCapture]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Card className={`relative overflow-hidden w-full max-w-sm bg-black border-2 ${isActive ? 'border-primary' : 'border-border'}`}>
        <div className={`aspect-[${aspectRatio === 'portrait' ? '3/4' : '16/9'}] flex items-center justify-center`}>
          {!isActive && !capturedImage && (
            <div className="text-center p-8">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <Button onClick={startCamera} variant="outline" className="text-white border-white hover:bg-white/10">
                Open Camera
              </Button>
            </div>
          )}

          {isActive && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1]" 
            />
          )}

          {capturedImage && !isActive && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover" 
            />
          )}

          {error && <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center p-4 text-center text-white text-sm">{error}</div>}
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        {isActive && (
          <Button onClick={capture} className="rounded-full px-6 bg-primary hover:bg-primary/90">
            <Camera className="w-4 h-4 mr-2" /> Capture
          </Button>
        )}
        
        {capturedImage && !isActive && (
          <Button onClick={() => { setCapturedImage(null); startCamera(); }} variant="outline" className="rounded-full px-6">
            <RefreshCw className="w-4 h-4 mr-2" /> Retake
          </Button>
        )}
      </div>
    </div>
  );
}