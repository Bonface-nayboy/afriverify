
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ShieldCheck, 
  Building2, 
  Globe, 
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing and small startups.",
    features: [
      "100 KYC Verifications/mo",
      "Basic OCR Extraction",
      "Standard Support",
      "Single Region Data"
    ],
    cta: "Current Plan",
    variant: "outline" as const,
    highlight: false
  },
  {
    name: "Professional",
    price: "$499",
    period: "/mo",
    description: "For growing platforms scaling across borders.",
    features: [
      "5,000 KYC Verifications/mo",
      "Biometric Liveness Detection",
      "API Access (REST)",
      "Multi-region Residency",
      "Priority Email Support"
    ],
    cta: "Upgrade to Pro",
    variant: "default" as const,
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored security for large-scale institutions.",
    features: [
      "Unlimited Verifications",
      "Facial Recognition Attendance",
      "Thermal Imaging Support",
      "HR Software Integrations",
      "Dedicated Account Manager",
      "Custom SLA"
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
    highlight: false
  }
];

export default function PricingPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [company, setCompany] = useState('');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company) return;
    setLoading(true);
    try {
      await api.submitEnterpriseLead({
        userId: user.uid,
        email: user.email || 'N/A',
        company,
        featureOfInterest: 'Full Enterprise Plan'
      });
      setSubmitted(true);
      toast({
        title: "Inquiry Sent",
        description: "An enterprise consultant will reach out shortly.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: string) => {
    if (plan === "Professional") {
      toast({
        title: "Redirecting...",
        description: "Taking you to the secure checkout for the Professional plan.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Flexible Plans for Every Scale</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transparent pricing designed to grow with your business. Secure your platform with confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={cn(
              "relative flex flex-col h-full transition-all duration-300 hover:shadow-xl",
              plan.highlight ? "border-primary shadow-lg scale-105 z-10" : "border-border"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="h-px bg-border w-full my-2" />
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.name === "Enterprise" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={plan.variant} className="w-full h-12 font-bold">{plan.cta}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" /> Enterprise Request
                      </DialogTitle>
                      <DialogDescription>
                        Please provide your company details to receive a tailored quote.
                      </DialogDescription>
                    </DialogHeader>
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold">Request Received</h4>
                        <p className="text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
                        <Button variant="outline" onClick={() => setSubmitted(false)}>Close</Button>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input 
                            required 
                            placeholder="e.g. Global Identity Ltd" 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Business Email</Label>
                          <Input value={user?.email || ''} disabled className="bg-muted/50" />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          {loading ? "Sending..." : "Request Proposal"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  variant={plan.variant} 
                  className="w-full h-12 font-bold" 
                  disabled={plan.name === "Starter"}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.cta} {plan.name !== "Starter" && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <Card className="bg-muted/20 border-none">
          <CardContent className="p-8 grid md:grid-cols-3 gap-8 text-center">
            <FeatureInfo 
              icon={ShieldCheck} 
              title="Global Compliance" 
              desc="Bank-grade security compliant with GDPR, POPIA, and NDPR." 
            />
            <FeatureInfo 
              icon={Globe} 
              title="Multi-Company Ready" 
              desc="Isolated data environments for enterprise group structures." 
            />
            <FeatureInfo 
              icon={Clock} 
              title="99.99% Uptime" 
              desc="Reliable infrastructure powering mission-critical platforms." 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureInfo({ icon: Icon, title, desc }: any) {
  return (
    <div className="space-y-2 flex flex-col items-center">
      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm mb-2">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
