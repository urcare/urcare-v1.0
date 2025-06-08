
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Search,
  Wrench,
  FileText,
  Database,
  HardDrive,
  RefreshCw,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface IntegrityCheck {
  id: string;
  name: string;
  type: 'checksum' | 'structure' | 'corruption' | 'redundancy';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  itemsChecked: number;
  itemsTotal: number;
  errorsFound: number;
  lastRun: string;
  nextRun: string;
}

interface CorruptionIssue {
  id: string;
  file: string;
  type: 'checksum_mismatch' | 'structural_damage' | 'partial_corruption' | 'access_error';
  severity: 'critical' | 'high' | 'medium' | 'low';
  detected: string;
  affectedRecords: number;
  repairStatus: 'pending' | 'repairing' | 'repaired' | 'failed';
  recommendation: string;
}

export const DataIntegrityVerification = () => {
  const [activeScans, setActiveScans] = useState<string[]>([]);

  const integrityChecks: IntegrityCheck[] = [
    {
      id: 'check-1',
      name: 'Medical Records Database Checksum',
      type: 'checksum',
      status: 'running',
      progress: 67,
      itemsChecked: 156789,
      itemsTotal: 234567,
      errorsFound: 3,
      lastRun: '2024-01-20 02:00:00',
      nextRun: '2024-01-21 02:00:00'
    },
    {
      id: 'check-2',
      name: 'Document Archive Structure Validation',
      type: 'structure',
      status: 'completed',
      progress: 100,
      itemsChecked: 89456,
      itemsTotal: 89456,
      errorsFound: 0,
      lastRun: '2024-01-19 14:30:00',
      nextRun: '2024-01-20 14:30:00'
    },
    {
      id: 'check-3',
      name: 'Backup Storage Corruption Scan',
      type: 'corruption',
      status: 'completed',
      progress: 100,
      itemsChecked: 45123,
      itemsTotal: 45123,
      errorsFound: 2,
      lastRun: '2024-01-19 08:00:00',
      nextRun: '2024-01-22 08:00:00'
    },
    {
      id: 'check-4',
      name: 'Redundancy Verification',
      type: 'redundancy',
      status: 'scheduled',
      progress: 0,
      itemsChecked: 0,
      itemsTotal: 123456,
      errorsFound: 0,
      lastRun: '2024-01-18 20:00:00',
      nextRun: '2024-01-21 20:00:00'
    }
  ];

  const corruptionIssues: CorruptionIssue[] = [
    {
      id: 'issue-1',
      file: '/medical_records/patient_12345.dat',
      type: 'checksum_mismatch',
      severity: 'high',
      detected: '2024-01-20 02:15:00',
      affectedRecords: 1,
      repairStatus: 'pending',
      recommendation: 'Restore from most recent backup'
    },
    {
      id: 'issue-2',
      file: '/imaging/xray_archive_2023.img',
      type: 'partial_corruption',
      severity: 'medium',
      detected: '2024-01-19 08:30:00',
      affectedRecords: 15,
      repairStatus: 'repairing',
      recommendation: 'Rebuild corrupted sectors from redundant copies'
    },
    {
      id: 'issue-3',
      file: '/backup/daily_backup_20240118.bak',
      type: 'structural_damage',
      severity: 'critical',
      detected: '2024-01-19 09:00:00',
      affectedRecords: 234,
      repairStatus: 'failed',
      recommendation: 'Use alternative backup source'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'repairing': return 'bg-blue-100 text-blue-800';
      case 'repaired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checksum': return Shield;
      case 'structure': return FileText;
      case 'corruption': return AlertTriangle;
      case 'redundancy': return Database;
      default: return Search;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return RefreshCw;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      case 'scheduled': return Clock;
      default: return Search;
    }
  };

  const handleStartIntegrityCheck = (checkId: string) => {
    setActiveScans(prev => [...prev, checkId]);
    toast.success('Integrity check started');
    
    setTimeout(() => {
      setActiveScans(prev => prev.filter(id => id !== checkId));
      toast.success('Integrity check completed');
    }, 5000);
  };

  const handleRepairIssue = (issueId: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Starting automated repair...',
        success: 'Repair process completed successfully',
        error: 'Repair process failed'
      }
    );
  };

  const handleManualIntegrityCheck = () => {
    toast.success('Manual integrity scan initiated across all systems');
  };

  const totalItemsChecked = integrityChecks.reduce((sum, check) => sum + check.itemsChecked, 0);
  const totalItemsToCheck = integrityChecks.reduce((sum, check) => sum + check.itemsTotal, 0);
  const totalErrorsFound = integrityChecks.reduce((sum, check) => sum + check.errorsFound, 0);
  const overallIntegrity = ((totalItemsChecked - totalErrorsFound) / totalItemsChecked * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Integrity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Overall Integrity</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{overallIntegrity.toFixed(2)}%</div>
            <p className="text-sm text-gray-600">Data verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Items Checked</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalItemsChecked.toLocaleString()}</div>
            <p className="text-sm text-gray-600">of {totalItemsToCheck.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Issues Found</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{totalErrorsFound}</div>
            <p className="text-sm text-gray-600">Corruption detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Active Scans</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{activeScans.length}</div>
            <p className="text-sm text-gray-600">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrity Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Integrity Verification Jobs
            </CardTitle>
            <CardDescription>Automated checksum validation and corruption detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrityChecks.map((check) => {
              const TypeIcon = getTypeIcon(check.type);
              const StatusIcon = getStatusIcon(check.status);
              const isActive = activeScans.includes(check.id);
              
              return (
                <div key={check.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="h-4 w-4" />
                      <h4 className="font-medium">{check.name}</h4>
                    </div>
                    <Badge className={getStatusColor(isActive ? 'running' : check.status)}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${isActive ? 'animate-spin' : ''}`} />
                      {isActive ? 'running' : check.status}
                    </Badge>
                  </div>
                  
                  {(check.status === 'running' || isActive) && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{check.itemsChecked.toLocaleString()} / {check.itemsTotal.toLocaleString()}</span>
                      </div>
                      <Progress value={check.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Errors Found:</span>
                      <span className="ml-2 font-medium">{check.errorsFound}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Run:</span>
                      <span className="ml-2 font-medium">{check.lastRun}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStartIntegrityCheck(check.id)}
                    disabled={check.status === 'running' || isActive}
                    className="w-full"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Run Check Now
                  </Button>
                </div>
              );
            })}
            
            <Button onClick={handleManualIntegrityCheck} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Start Full System Scan
            </Button>
          </CardContent>
        </Card>

        {/* Corruption Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Detected Issues
            </CardTitle>
            <CardDescription>Corruption detection and repair recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {corruptionIssues.map((issue) => (
              <div key={issue.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{issue.file}</h4>
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{issue.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Detected:</span>
                    <span>{issue.detected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affected Records:</span>
                    <span>{issue.affectedRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repair Status:</span>
                    <Badge className={getStatusColor(issue.repairStatus)} variant="secondary">
                      {issue.repairStatus}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-2 bg-blue-50 rounded text-sm">
                  <p className="font-medium">Recommendation:</p>
                  <p className="text-blue-800">{issue.recommendation}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRepairIssue(issue.id)}
                    disabled={issue.repairStatus === 'repairing' || issue.repairStatus === 'repaired'}
                    className="flex-1"
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    Auto Repair
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
