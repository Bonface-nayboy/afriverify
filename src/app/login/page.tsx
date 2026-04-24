
"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, LogIn } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.code === 'auth/unauthorized-domain' 
          ? "This domain is not authorized. Please add it to your Firebase Console."
          : error.message || "Failed to sign in with Google.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">AfriVerify Hub</CardTitle>
            <CardDescription>Enterprise Identity Management System</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-muted-foreground px-4">
            Authorized access only. Sign in with your corporate account to access the verification dashboard.
          </p>
          <Button onClick={handleLogin} className="w-full h-12 text-lg font-medium" size="lg">
            <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
          <div className="pt-4 text-center">
            <Button variant="link" className="text-xs text-muted-foreground" onClick={() => router.push('/')}>
              Back to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
