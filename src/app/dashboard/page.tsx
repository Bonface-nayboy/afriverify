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
  Activity
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { cn } from '@/lib/utils';
import { KYCResult } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

const staticTrendData = [
  { name: 'Mon', count: 420 },
  { name: 'Tue', count: 380 },
  { name: 'Wed', count: 590 },
  { name: 'Thu', count: 720 },
  { name: 'Fri', count: 550 },
  { name: 'Sat', count: 280 },
  { name: 'Sun', count: 150 },
];

export default function DashboardOverview() {
  const firestore = useFirestore();

  const verificationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'verifications'), 
      orderBy('createdAt', 'desc'), 
      limit(10)
    );
  }, [firestore]);

  const { data: recentVerifications, loading } = useCollection<KYCResult>(verificationsQuery);

  const stats = useMemo(() => {
    const verified = recentVerifications.filter(v => v.status === 'VERIFIED').length;
    const suspicious = recentVerifications.filter(v => v.status === 'SUSPICIOUS').length;
    return { verified, suspicious };
  }, [recentVerifications]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Command Center</h1>
          <p className="text-muted-foreground">Monitoring active verification streams across Africa.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
          <Activity className="w-3 h-3 animate-pulse" /> Live Updates Enabled
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Daily Traffic" 
          value="14.2k" 
          change="+12.5%" 
          trend="up" 
          icon={Users} 
        />
        <MetricCard 
          title="Approval Rate" 
          value="98.2%" 
          change="+0.4%" 
          trend="up" 
          icon={CheckCircle2} 
        />
        <MetricCard 
          title="Active Fraud Alerts" 
          value={(24 + stats.suspicious).toString()} 
          change={stats.suspicious > 0 ? `+${stats.suspicious} now` : "Stable"} 
          trend={stats.suspicious > 0 ? "up" : "down"} 
          icon={AlertTriangle} 
        />
        <MetricCard 
          title="Global Latency" 
          value="1.1s" 
          change="-0.2s" 
          trend="down" 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Verification Trends Chart */}
        <Card className="lg:col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Volume Trends</CardTitle>
            <CardDescription>Historical verification volume by day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staticTrendData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} 
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card className="lg:col-span-3 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Live Feed
            </CardTitle>
            <CardDescription>Most recent verification attempts.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[400px] overflow-auto">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground animate-pulse text-sm font-medium">Listening for events...</div>
              ) : recentVerifications.length > 0 ? recentVerifications.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/10 transition-colors flex items-start gap-4 group">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-white shadow-sm",
                    item.status === 'VERIFIED' ? "bg-green-100 text-green-700" :
                    item.status === 'FAILED' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {item.ocr.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold truncate">{item.ocr.name}</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        item.status === 'VERIFIED' ? "bg-green-100 text-green-700" :
                        item.status === 'FAILED' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.timestamp ? formatDistanceToNow(new Date(item.timestamp)) : 'Recently'} ago
                    </p>
                    {item.aiExplanation && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-100 rounded-lg">
                        <p className="text-[10px] text-orange-700 font-medium leading-relaxed flex gap-1">
                          <ShieldAlert className="w-3 h-3 shrink-0" />
                          {item.aiExplanation.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No verification traffic yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-muted rounded-lg"><Icon className="h-4 w-4 text-primary" /></div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black">{value}</div>
        <p className={cn(
          "text-[10px] font-bold flex items-center mt-1",
          trend === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change} <span className="text-muted-foreground ml-1 font-normal">vs prev. month</span>
        </p>
      </CardContent>
    </Card>
  );
}
