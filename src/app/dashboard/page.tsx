
"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Clock,
  Activity,
  Zap,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { KYCResult } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

const staticTrendData = [
  { name: 'Mon', count: 420 }, { name: 'Tue', count: 380 },
  { name: 'Wed', count: 590 }, { name: 'Thu', count: 720 },
  { name: 'Fri', count: 550 }, { name: 'Sat', count: 280 },
  { name: 'Sun', count: 150 },
];

const riskDistribution = [
  { name: 'Low', value: 85, color: '#22c55e' },
  { name: 'Medium', value: 10, color: '#f59e0b' },
  { name: 'High', value: 3, color: '#ef4444' },
  { name: 'Critical', value: 2, color: '#000000' },
];

export default function DashboardOverview() {
  const firestore = useFirestore();

  const verificationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verifications'), orderBy('createdAt', 'desc'), limit(20));
  }, [firestore]);

  const { data: recentVerifications, loading } = useCollection<KYCResult>(verificationsQuery);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Command Center</h1>
          <p className="text-muted-foreground text-lg">Real-time intelligence and fraud monitoring.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-black text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-sm uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Stream Active
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="System Throughput" value="14.2k" change="+12.5%" trend="up" icon={Zap} />
        <MetricCard title="Decision Latency" value="1.1s" change="-0.2s" trend="down" icon={TrendingUp} />
        <MetricCard title="Fraud Suppression" value="99.9%" change="+0.1%" trend="up" icon={ShieldCheck} />
        <MetricCard title="Active Risks" value="42" change="+3 today" trend="up" icon={AlertCircle} />
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-wider">Volume Intelligence</CardTitle>
              <CardDescription>Verification traffic across all regions.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-primary/20" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staticTrendData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#888'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold', fill: '#888'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-muted/20">
            <CardTitle className="text-lg font-black uppercase tracking-wider">Risk Distribution</CardTitle>
            <CardDescription>AI-driven classification of all attempts.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px] w-full flex flex-col items-center">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 w-full px-8 mt-4">
                {riskDistribution.map((r) => (
                  <div key={r.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-xs font-bold text-muted-foreground uppercase">{r.name}</span>
                    <span className="ml-auto text-xs font-black">{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-xl font-black flex items-center gap-3">
            <Activity className="w-5 h-5" /> Live Verification Stream
          </CardTitle>
          <CardDescription className="text-white/60">Global event feed monitored by the Risk Engine.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-x divide-y">
            {recentVerifications.length > 0 ? recentVerifications.map((item) => (
              <div key={item.id} className="p-6 hover:bg-muted/10 transition-colors flex items-start gap-4 group cursor-pointer">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm",
                  item.status === 'VERIFIED' ? "bg-green-100 text-green-700" :
                  item.status === 'FAILED' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                )}>
                  {item.ocrData?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-black truncate">{item.ocrData?.name || 'Anonymous'}</p>
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase tracking-widest border-none",
                      item.riskLevel === 'LOW' ? "text-green-600 bg-green-50" :
                      item.riskLevel === 'MEDIUM' ? "text-orange-600 bg-orange-50" : "text-red-600 bg-red-50"
                    )}>
                      {item.riskLevel} RISK
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-bold">
                    <Clock className="w-3 h-3" />
                    {item.timestamp ? formatDistanceToNow(new Date(item.timestamp)) : 'Just now'} ago
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <ScoreStat label="BIO" score={item.livenessScore} />
                    <ScoreStat label="MATCH" score={item.faceMatchScore} />
                    <ScoreStat label="INTEG" score={99.4} />
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-20 text-center text-muted-foreground font-bold">
                No active traffic in this environment.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScoreStat({ label, score }: any) {
  return (
    <div className="space-y-1 flex-1">
      <p className="text-[8px] font-black text-muted-foreground uppercase">{label}</p>
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full", score > 85 ? "bg-primary" : score > 50 ? "bg-orange-500" : "bg-red-500")}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="h-16 w-16" />
        </div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{title}</p>
        <div className="text-3xl font-black mt-1">{value}</div>
        <p className={cn(
          "text-[10px] font-bold flex items-center mt-2",
          trend === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change} <span className="text-muted-foreground ml-1 font-normal italic">vs last month</span>
        </p>
      </CardContent>
    </Card>
  );
}
