
'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  label?: string;
  aspectRatio?: 'portrait' | 'video';
}

export function CameraCapture({ onCapture, label = "Capture Photo", aspectRatio = 'portrait' }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    // Stop any existing stream before starting a new one
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasCameraPermission(true);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this app.',
      });
    }
  }, [stopCamera, toast]);

  // Manage camera lifecycle based on capturedImage state
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup: always stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [capturedImage, startCamera, stopCamera]);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Match canvas dimensions to video stream
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw the current frame
        context.drawImage(videoRef.current, 0, 0);
        
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        onCapture(dataUrl);
        
        // Explicitly stop camera stream after capture
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  const retake = () => {
    setCapturedImage(null);
    // startCamera will be re-triggered by the useEffect
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Card className={`relative overflow-hidden w-full max-w-sm bg-black border-2 ${hasCameraPermission ? 'border-primary' : 'border-border'}`}>
        <div className={`relative aspect-[${aspectRatio === 'portrait' ? '3/4' : '16/9'}] flex items-center justify-center`}>
          {/* Always show video tag irrespective of hasCameraPermission check to prevent race condition */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${capturedImage ? 'hidden' : 'block'}`} 
          />

          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover" 
            />
          )}

          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-6 text-center">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        {!capturedImage && hasCameraPermission && (
          <Button onClick={capture} className="rounded-full px-6 bg-primary hover:bg-primary/90">
            <Camera className="w-4 h-4 mr-2" /> {label}
          </Button>
        )}
        
        {capturedImage && (
          <Button onClick={retake} variant="outline" className="rounded-full px-6">
            <RefreshCw className="w-4 h-4 mr-2" /> Retake
          </Button>
        )}
      </div>
    </div>
  );
}
