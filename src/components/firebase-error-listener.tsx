'use client';

import React, { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Surfacing contextual error for the developer overlay
      toast({
        variant: "destructive",
        title: "Security Rule Denied",
        description: `Operation: ${error.context.operation} at ${error.context.path}. Check your Firestore rules.`,
      });
      
      // In development, we throw to trigger the Next.js error overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
  }, [toast]);

  return null;
}
