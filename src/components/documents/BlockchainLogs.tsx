
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Download, Eye, Lock, Unlock, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainLog {
  id: string;
  timestamp: Date;
  action: 'VIEW' | 'EDIT' | 'SHARE' | 'DELETE' | 'DOWNLOAD';
  documentId: string;
  documentName: string;
  userId: string;
  userName: string;
  ipAddress: string;
  blockHash: string;
  verified: boolean;
}

// Sample blockchain logs
const sampleLogs: BlockchainLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    action: 'VIEW',
    documentId: 'doc_001',
    documentName: 'Blood Test Results',
    userId: 'user_123',
    userName: 'John Doe',
    ipAddress: '192.168.1.100',
    blockHash: '0x1a2b3c4d5e6f...',
    verified: true
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T09:15:00'),
    action: 'DOWNLOAD',
    documentId: 'doc_002',
    documentName: 'X-Ray Report',
    userId: 'user_456',
    userName: 'Dr. Smith',
    ipAddress: '10.0.1.45',
    blockHash: '0x2b3c4d5e6f7a...',
    verified: true
  },
  {
    id: '3',
    timestamp: new Date('2024-01-14T16:45:00'),
    action: 'SHARE',
    documentId: 'doc_001',
    documentName: 'Blood Test Results',
    userId: 'user_123',
    userName: 'John Doe',
    ipAddress: '192.168.1.100',
    blockHash: '0x3c4d5e6f7a8b...',
    verified: true
  }
];

export const BlockchainLogs = () => {
  const [logs, setLogs] = useState<BlockchainLog[]>(sampleLogs);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    
    // Simulate blockchain verification
    setTimeout(() => {
      toast.success('All records verified on blockchain');
      setIsVerifying(false);
    }, 2000);
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Document', 'User', 'IP Address', 'Block Hash', 'Verified'],
      ...logs.map(log => [
        log.timestamp.toISOString(),
        log.action,
        log.documentName,
        log.userName,
        log.ipAddress,
        log.blockHash,
        log.verified.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blockchain-access-logs.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Blockchain logs exported successfully');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'VIEW': return <Eye className="h-4 w-4" />;
      case 'EDIT': return <FileText className="h-4 w-4" />;
      case 'SHARE': return <Unlock className="h-4 w-4" />;
      case 'DELETE': return <Lock className="h-4 w-4" />;
      case 'DOWNLOAD': return <Download className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'VIEW': return 'bg-blue-100 text-blue-800';
      case 'EDIT': return 'bg-yellow-100 text-yellow-800';
      case 'SHARE': return 'bg-green-100 text-green-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'DOWNLOAD': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain Access Logs
        </CardTitle>
        <CardDescription>
          Immutable security audit trail for all document access and modifications
        </CardDescription>
        <div className="flex gap-2">
          <Button 
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
            variant="outline"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isVerifying ? 'Verifying...' : 'Verify Integrity'}
          </Button>
          <Button onClick={handleExportLogs} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-sm text-gray-600">Records Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
                <p className="text-sm text-gray-600">Access Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">256-bit</div>
                <p className="text-sm text-gray-600">Encryption</p>
              </CardContent>
            </Card>
          </div>

          {/* Access Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Block Hash</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {log.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getActionColor(log.action)}>
                        <span className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {log.action}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.documentName}</TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.blockHash.substring(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.verified ? 'default' : 'destructive'}>
                        {log.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
