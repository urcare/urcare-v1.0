
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HardDrive, Cloud, Download, Upload, RefreshCw, Shield, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BackupInfo {
  id: string;
  date: Date;
  size: string;
  type: 'full' | 'incremental';
  location: 'cloud' | 'local';
  status: 'completed' | 'in_progress' | 'failed';
  recordCount: number;
}

const sampleBackups: BackupInfo[] = [
  {
    id: '1',
    date: new Date('2024-01-15T10:30:00'),
    size: '245 MB',
    type: 'full',
    location: 'cloud',
    status: 'completed',
    recordCount: 156
  },
  {
    id: '2',
    date: new Date('2024-01-14T02:00:00'),
    size: '45 MB',
    type: 'incremental',
    location: 'cloud',
    status: 'completed',
    recordCount: 23
  },
  {
    id: '3',
    date: new Date('2024-01-13T02:00:00'),
    size: '52 MB',
    type: 'incremental',
    location: 'local',
    status: 'completed',
    recordCount: 31
  }
];

export const BackupRecovery = () => {
  const [backups, setBackups] = useState<BackupInfo[]>(sampleBackups);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [backupLocation, setBackupLocation] = useState('cloud');
  const [currentBackupProgress, setCurrentBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setIsBackingUp(true);
    setCurrentBackupProgress(0);

    toast.promise(
      new Promise((resolve) => {
        const progressSteps = [0, 25, 50, 75, 100];
        let currentStep = 0;
        
        const updateProgress = () => {
          if (currentStep < progressSteps.length) {
            setCurrentBackupProgress(progressSteps[currentStep]);
            currentStep++;
            setTimeout(updateProgress, 1000);
          } else {
            const newBackup: BackupInfo = {
              id: Date.now().toString(),
              date: new Date(),
              size: type === 'full' ? '250 MB' : '45 MB',
              type,
              location: backupLocation as 'cloud' | 'local',
              status: 'completed',
              recordCount: type === 'full' ? 156 : 23
            };
            
            setBackups(prev => [newBackup, ...prev]);
            setIsBackingUp(false);
            setCurrentBackupProgress(0);
            resolve('Backup completed successfully');
          }
        };
        
        updateProgress();
      }),
      {
        loading: `Creating ${type} backup...`,
        success: `${type === 'full' ? 'Full' : 'Incremental'} backup completed successfully`,
        error: 'Backup failed'
      }
    );
  };

  const handleRestoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Restoring from backup...',
        success: 'Records restored successfully',
        error: 'Restore failed'
      }
    );

    setTimeout(() => {
      setIsRestoring(false);
    }, 3000);
  };

  const handleExportBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    toast.success(`Backup exported: ${backup.size} downloaded`);
  };

  const handleDeleteBackup = (backupId: string) => {
    setBackups(prev => prev.filter(b => b.id !== backupId));
    toast.success('Backup deleted successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-purple-100 text-purple-800';
      case 'incremental': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (location: string) => {
    return location === 'cloud' ? <Cloud className="h-4 w-4" /> : <HardDrive className="h-4 w-4" />;
  };

  const totalBackupSize = backups.reduce((total, backup) => {
    const size = parseFloat(backup.size.split(' ')[0]);
    return total + size;
  }, 0);

  const lastBackupDate = backups.length > 0 ? backups[0].date : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Backup & Recovery
          </CardTitle>
          <CardDescription>
            Secure backup and recovery options for your medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Backup Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Total Backups</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{backups.length}</div>
                <p className="text-sm text-gray-600">Available</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Storage Used</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{totalBackupSize.toFixed(0)} MB</div>
                <p className="text-sm text-gray-600">Total size</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Last Backup</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {lastBackupDate ? lastBackupDate.toLocaleDateString() : 'Never'}
                </div>
                <p className="text-sm text-gray-600">
                  {lastBackupDate ? 
                    `${Math.ceil((Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24))} days ago` :
                    'No backups'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Auto Backup</span>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {autoBackupEnabled ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-sm text-gray-600">{autoBackupEnabled ? backupFrequency : 'Manual only'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Backup Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Automatic Backups</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Automatically create backups on schedule
                  </p>
                </div>
                <Switch
                  checked={autoBackupEnabled}
                  onCheckedChange={setAutoBackupEnabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Location</label>
                  <Select value={backupLocation} onValueChange={setBackupLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="local">Local Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Backup Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manual Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isBackingUp && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Creating backup...</span>
                    <span>{currentBackupProgress}%</span>
                  </div>
                  <Progress value={currentBackupProgress} className="h-2" />
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={() => handleCreateBackup('full')}
                  disabled={isBackingUp}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Create Full Backup
                </Button>
                <Button 
                  onClick={() => handleCreateBackup('incremental')}
                  disabled={isBackingUp}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Incremental Backup
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Backup Types:</p>
                    <p className="text-blue-700">
                      <strong>Full:</strong> Complete backup of all records
                    </p>
                    <p className="text-blue-700">
                      <strong>Incremental:</strong> Only new/changed records since last backup
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup History */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Backup History</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{backup.date.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">
                          {backup.date.toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(backup.type)}>
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(backup.location)}
                        <span className="capitalize">{backup.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.recordCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={isRestoring || backup.status !== 'completed'}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExportBackup(backup.id)}
                          disabled={backup.status !== 'completed'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
