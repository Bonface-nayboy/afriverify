
"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ClipboardList, 
  Search, 
  FileText, 
  ScanFace,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { KYCResult, AttendanceResult } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const firestore = useFirestore();

  // Fetch KYC Logs
  const kycQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'verifications'), orderBy('createdAt', 'desc'), limit(50));
  }, [firestore]);
  const { data: kycLogs, loading: kycLoading } = useCollection<KYCResult>(kycQuery);

  // Fetch Attendance Logs
  const attQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'attendance'), orderBy('createdAt', 'desc'), limit(50));
  }, [firestore]);
  const { data: attLogs, loading: attLoading } = useCollection<AttendanceResult>(attQuery);

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredKyc = kycLogs.filter(log => 
    log.ocrData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAtt = attLogs.filter(log => 
    log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" /> Activity Logs
          </h1>
          <p className="text-muted-foreground mt-1">Audit trail for all verification and biometric activities.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or status..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8">
        {/* KYC Logs */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> KYC Verifications
              </CardTitle>
              <CardDescription>Records of identity document processing.</CardDescription>
            </div>
            <Badge variant="outline">{filteredKyc.length} Records</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Biometric Confidence</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycLoading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
                ) : filteredKyc.length > 0 ? filteredKyc.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-bold">{log.ocrData?.name || 'Biometric Session'}</TableCell>
                    <TableCell className="text-xs uppercase">{log.ocrData?.documentType || 'N/A'}</TableCell>
                    <TableCell>{log.ocrData?.country || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{log.faceMatchScore?.toFixed(1)}%</span>
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", log.faceMatchScore > 80 ? "bg-green-500" : "bg-orange-500")} 
                            style={{ width: `${log.faceMatchScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {log.timestamp ? format(new Date(log.timestamp), 'MMM dd, HH:mm') : 'N/A'}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No records found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Attendance Logs */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-accent" /> Attendance Records
              </CardTitle>
              <CardDescription>Facial recognition check-in logs.</CardDescription>
            </div>
            <Badge variant="outline" className="border-accent text-accent">{filteredAtt.length} Records</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Match confidence</TableHead>
                  <TableHead className="text-right">Check-in Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attLoading ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
                ) : filteredAtt.length > 0 ? filteredAtt.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-bold">{log.userName}</TableCell>
                    <TableCell className="font-mono text-xs">{log.userId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                        {log.confidence.toFixed(1)}% Match
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {log.timestamp ? format(new Date(log.timestamp), 'MMM dd, HH:mm:ss') : 'N/A'}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No check-ins logged.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'VERIFIED':
    case 'SUCCESS':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none flex gap-1 items-center w-fit"><CheckCircle2 className="w-3 h-3" /> VERIFIED</Badge>;
    case 'SUSPICIOUS':
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none shadow-none flex gap-1 items-center w-fit"><AlertTriangle className="w-3 h-3" /> SUSPICIOUS</Badge>;
    case 'FAILED':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-none flex gap-1 items-center w-fit"><XCircle className="w-3 h-3" /> FAILED</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
