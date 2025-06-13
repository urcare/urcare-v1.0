
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  RotateCcw,
  Download,
  Upload,
  Shield
} from 'lucide-react';

export const BackupManagementInterface = () => {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  const backupJobs = [
    {
      id: '1',
      name: 'Database Full Backup',
      type: 'full',
      schedule: 'Daily 02:00 UTC',
      status: 'completed',
      lastRun: '2024-01-18 02:00 UTC',
      nextRun: '2024-01-19 02:00 UTC',
      duration: '45 minutes',
      size: '2.4 GB',
      retention: '30 days',
      success: true
    },
    {
      id: '2',
      name: 'Application Files Incremental',
      type: 'incremental',
      schedule: 'Every 6 hours',
      status: 'running',
      lastRun: '2024-01-18 14:00 UTC',
      nextRun: '2024-01-18 20:00 UTC',
      duration: '12 minutes',
      size: '156 MB',
      retention: '7 days',
      success: true
    },
    {
      id: '3',
      name: 'Configuration Backup',
      type: 'differential',
      schedule: 'Weekly Sunday 01:00 UTC',
      status: 'failed',
      lastRun: '2024-01-14 01:00 UTC',
      nextRun: '2024-01-21 01:00 UTC',
      duration: '8 minutes',
      size: '45 MB',
      retention: '90 days',
      success: false
    }
  ];

  const restorePoints = [
    {
      id: '1',
      timestamp: '2024-01-18 02:00 UTC',
      type: 'Full Backup',
      size: '2.4 GB',
      systems: ['Database', 'Application'],
      verified: true,
      retention: '29 days left'
    },
    {
      id: '2',
      timestamp: '2024-01-17 02:00 UTC',
      type: 'Full Backup',
      size: '2.3 GB',
      systems: ['Database', 'Application'],
      verified: true,
      retention: '28 days left'
    },
    {
      id: '3',
      timestamp: '2024-01-16 02:00 UTC',
      type: 'Full Backup',
      size: '2.2 GB',
      systems: ['Database', 'Application'],
      verified: false,
      retention: '27 days left'
    }
  ];

  const storageMetrics = {
    totalUsed: 45.8,
    totalCapacity: 100,
    monthlyGrowth: 12.5,
    compressionRatio: 65,
    deduplicationSavings: 23
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Play className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-purple-100 text-purple-800';
      case 'incremental': return 'bg-blue-100 text-blue-800';
      case 'differential': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup Management Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Restore Points</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{storageMetrics.totalUsed}TB</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">2hrs</div>
              <div className="text-sm text-gray-600">Last Backup</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backup Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backupJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedBackup === job.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedBackup(job.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <div>
                          <h4 className="font-semibold">{job.name}</h4>
                          <p className="text-sm text-gray-600">{job.schedule}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(job.type)}>
                          {job.type}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Last Run</div>
                        <div className="text-gray-600">{job.lastRun}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-600">{job.duration}</div>
                      </div>
                      <div>
                        <div className="font-medium">Size</div>
                        <div className="text-gray-600">{job.size}</div>
                      </div>
                      <div>
                        <div className="font-medium">Retention</div>
                        <div className="text-gray-600">{job.retention}</div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="font-medium">Next Run: {job.nextRun}</div>
                    </div>

                    <div className="flex gap-2">
                      {job.status === 'running' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Run Now
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Storage Utilization</span>
                  <span>{storageMetrics.totalUsed}TB / {storageMetrics.totalCapacity}TB</span>
                </div>
                <Progress 
                  value={(storageMetrics.totalUsed / storageMetrics.totalCapacity) * 100} 
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Monthly Growth</div>
                  <div className="text-2xl font-bold text-blue-600">{storageMetrics.monthlyGrowth}%</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Compression</div>
                  <div className="text-2xl font-bold text-green-600">{storageMetrics.compressionRatio}%</div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium">Deduplication Savings</div>
                <div className="text-2xl font-bold text-purple-600">{storageMetrics.deduplicationSavings}%</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Optimization Recommendations</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Archive old backups</span>
                    <Badge variant="outline">Save 2.1TB</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Enable compression</span>
                    <Badge variant="outline">Save 1.8TB</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cleanup failed backups</span>
                    <Badge variant="outline">Save 450GB</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Restore Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {restorePoints.map((point) => (
              <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {point.verified ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> : 
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    }
                    <div>
                      <h4 className="font-medium">{point.timestamp}</h4>
                      <p className="text-sm text-gray-600">{point.type} - {point.size}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">Systems: {point.systems.join(', ')}</div>
                    <div className="text-gray-600">{point.retention}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={point.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {point.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Shield className="h-3 w-3 mr-1" />
                    Verify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
