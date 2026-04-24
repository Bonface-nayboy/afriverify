"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 500 },
  { name: 'Sat', count: 200 },
  { name: 'Sun', count: 100 },
];

const activity = [
  { id: 1, user: 'John D.', type: 'KYC', status: 'Verified', time: '2 mins ago' },
  { id: 2, user: 'Sarah K.', type: 'Liveness', status: 'Failed', time: '15 mins ago' },
  { id: 3, user: 'Michael R.', type: 'Attendance', status: 'Verified', time: '45 mins ago' },
  { id: 4, user: 'Elena V.', type: 'KYC', status: 'Pending', time: '1 hour ago' },
];

export default function DashboardOverview() {
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
          value="12,842" 
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
          value="24" 
          change="-4.2%" 
          trend="down" 
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
                <AreaChart data={data}>
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
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs",
                      item.status === 'Verified' ? "bg-green-100 text-green-700" :
                      item.status === 'Failed' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {item.user[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.time}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    item.status === 'Verified' ? "bg-green-50 text-green-700 border border-green-200" :
                    item.status === 'Failed' ? "bg-red-50 text-red-700 border border-red-200" : 
                    "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  )}>
                    {item.status}
                  </div>
                </div>
              ))}
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
