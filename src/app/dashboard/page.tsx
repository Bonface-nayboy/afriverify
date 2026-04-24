
"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Clock
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
import { api, KYCResult } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

const staticData = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 500 },
  { name: 'Sat', count: 200 },
  { name: 'Sun', count: 100 },
];

export default function DashboardOverview() {
  const [recentVerifications, setRecentVerifications] = useState<KYCResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getRecentVerifications(10);
        setRecentVerifications(data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCount = recentVerifications.length > 0 ? 12842 + recentVerifications.length : 12842;
  const fraudCount = recentVerifications.filter(v => v.status === 'SUSPICIOUS').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">Monitor your identity verification performance in real-time.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Verifications" 
          value={totalCount.toLocaleString()} 
          change="+12.5%" 
          trend="up" 
          icon={Users} 
        />
        <MetricCard 
          title="Success Rate" 
          value="98.2%" 
          change="+0.4%" 
          trend="up" 
          icon={CheckCircle2} 
        />
        <MetricCard 
          title="Fraud Alerts" 
          value={(24 + fraudCount).toString()} 
          change={fraudCount > 0 ? `+${fraudCount}` : "0"} 
          trend={fraudCount > 0 ? "up" : "down"} 
          icon={AlertTriangle} 
        />
        <MetricCard 
          title="Avg. Latency" 
          value="1.2s" 
          change="+0.1s" 
          trend="down" 
          icon={TrendingUp} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Verification Trends Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Verification Trends</CardTitle>
            <CardDescription>Daily volume of identity checks across all products.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staticData}>
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
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>The latest verification logs from your API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading logs...</div>
              ) : recentVerifications.length > 0 ? recentVerifications.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                      item.status === 'VERIFIED' ? "bg-green-100 text-green-700" :
                      item.status === 'FAILED' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {item.ocr.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.ocr.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(item.timestamp))} ago
                      </p>
                      {item.aiExplanation && (
                        <p className="text-[10px] text-orange-600 font-medium mt-1 leading-tight flex items-start gap-1">
                          <ShieldAlert className="w-3 h-3 shrink-0" />
                          {item.aiExplanation.substring(0, 80)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0",
                    item.status === 'VERIFIED' ? "bg-green-50 text-green-700 border border-green-200" :
                    item.status === 'FAILED' ? "bg-red-50 text-red-700 border border-red-200" : 
                    "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  )}>
                    {item.status}
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No activity found. Start a verification to see results.
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs font-medium flex items-center mt-1",
          trend === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
