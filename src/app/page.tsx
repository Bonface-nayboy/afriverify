import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  UserCheck, 
  ScanFace, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  Zap 
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <ShieldCheck className="w-8 h-8" />
            <span>AfriVerify</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-8 overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              <Zap className="mr-2 h-4 w-4" />
              <span>Next-Gen Identity Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              AI-Powered <span className="text-primary">Identity Verification</span> for Modern Platforms
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Scale your business safely with AfriVerify’s seamless KYC, facial recognition, and biometric liveness detection. Designed for the African market, powered by world-class AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  Launch Demo Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                View Documentation
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="font-bold text-foreground">50+ startups</span> across Africa
              </p>
            </div>
          </div>
          <div className="relative h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src={heroImg?.imageUrl || ''} 
              alt="Security" 
              fill 
              className="object-cover"
              data-ai-hint="security technology"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white px-8">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">
              A comprehensive suite of identity tools to protect your platform and users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Identity OCR" 
              description="Extract data from IDs and Passports instantly with 99.9% accuracy across 150+ countries."
              color="bg-primary/10 text-primary"
            />
            <FeatureCard 
              icon={UserCheck} 
              title="Liveness Detection" 
              description="Prevent spoofing attempts with advanced facial motion analysis and session-based liveness."
              color="bg-accent/10 text-accent"
            />
            <FeatureCard 
              icon={ScanFace} 
              title="Face Recognition" 
              description="Secure attendance and access control using high-precision FaceNet embeddings."
              color="bg-cyan-100 text-cyan-600"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Integration in Minutes</h2>
              <div className="space-y-8">
                <Step 
                  num="01" 
                  title="Connect via API or SDK" 
                  description="Our developer-first API and lightweight mobile SDKs make integration a breeze." 
                />
                <Step 
                  num="02" 
                  title="Configure Workflows" 
                  description="Customize verification rules and risk thresholds for different user segments." 
                />
                <Step 
                  num="03" 
                  title="Real-time Results" 
                  description="Receive instant webhooks with detailed fraud analysis and confidence scores." 
                />
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-xl p-6 shadow-2xl font-mono text-sm text-green-400 overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="whitespace-pre-wrap">
{`// Verify identity in one call
const result = await afriVerify.verify({
  idFront: "data:image/jpeg;base64,...",
  selfie: "data:image/jpeg;base64,...",
  country: "NG"
});

console.log(result.score); // 98.4
console.log(result.status); // "VERIFIED"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="w-6 h-6" />
            <span>AfriVerify</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AfriVerify Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="p-8 rounded-2xl border bg-white hover:shadow-xl transition-all group">
      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-6", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ num, title, description }: any) {
  return (
    <div className="flex gap-6">
      <div className="text-4xl font-black text-primary/20 shrink-0">{num}</div>
      <div className="space-y-1">
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
