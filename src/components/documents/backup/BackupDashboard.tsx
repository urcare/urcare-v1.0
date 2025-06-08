
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Play, 
  Pause, 
  Settings, 
  Download, 
  Upload,
  Server,
  Database,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  dataSize: string;
  location: 'local' | 'cloud' | 'offsite';
}

export const BackupDashboard = () => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const backupJobs: BackupJob[] = [
    {
      id: 'job-1',
      name: 'Medical Records - Full Backup',
      type: 'full',
      status: 'running',
      progress: 67,
      startTime: '2024-01-20 02:00:00',
      estimatedCompletion: '2024-01-20 04:30:00',
      dataSize: '245 GB',
      location: 'cloud'
    },
    {
      id: 'job-2',
      name: 'Patient Documents - Incremental',
      type: 'incremental',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-20 01:00:00',
      estimatedCompletion: '2024-01-20 01:45:00',
      dataSize: '45 GB',
      location: 'offsite'
    },
    {
      id: 'job-3',
      name: 'System Configuration - Differential',
      type: 'differential',
      status: 'scheduled',
      progress: 0,
      startTime: '2024-01-21 03:00:00',
      estimatedCompletion: '2024-01-21 03:30:00',
      dataSize: '2.1 GB',
      location: 'local'
    }
  ];

  const storageLocations = [
    { name: 'Primary Cloud Storage', usage: 75, capacity: '5 TB', available: '1.25 TB' },
    { name: 'Offsite Backup Facility', usage: 45, capacity: '10 TB', available: '5.5 TB' },
    { name: 'Local Backup Array', usage: 90, capacity: '2 TB', available: '200 GB' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Play;
      case 'completed': return CheckCircle;
      case 'failed': return AlertCircle;
      case 'scheduled': return Clock;
      default: return FileText;
    }
  };

  const handleCreateBackup = (type: 'full' | 'incremental' | 'differential') => {
    toast.success(`${type} backup job created and scheduled`);
  };

  const handleJobAction = (jobId: string, action: 'pause' | 'resume' | 'cancel') => {
    toast.success(`Backup job ${action}ed successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Backup Scheduling & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Backup Scheduling
            </CardTitle>
            <CardDescription>Configure automated backup schedules and policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Automated Backups</span>
                </div>
                <p className="text-sm text-gray-600">Schedule regular backup operations</p>
              </div>
              <Switch checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Compression</label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleCreateBackup('full')} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Full Backup
              </Button>
              <Button onClick={() => handleCreateBackup('incremental')} variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Incremental
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Storage Utilization
            </CardTitle>
            <CardDescription>Monitor backup storage across all locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {storageLocations.map((location, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{location.name}</span>
                  <span className="text-sm text-gray-600">{location.usage}% used</span>
                </div>
                <Progress value={location.usage} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Capacity: {location.capacity}</span>
                  <span>Available: {location.available}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Backup Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Active Backup Jobs
          </CardTitle>
          <CardDescription>Monitor running and scheduled backup operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Data Size</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupJobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status);
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{job.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress value={job.progress} className="h-2" />
                        <span className="text-xs text-gray-600">{job.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{job.dataSize}</TableCell>
                    <TableCell className="capitalize">{job.location}</TableCell>
                    <TableCell className="text-sm">{job.estimatedCompletion}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {job.status === 'running' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleJobAction(job.id, 'pause')}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        {job.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Download started')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
