
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Clock, 
  Database, 
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Search,
  Download,
  Play,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface RestorePoint {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'differential';
  size: string;
  location: string;
  systemsIncluded: string[];
  verified: boolean;
  description: string;
}

interface SelectiveRestoreItem {
  id: string;
  name: string;
  type: 'database' | 'files' | 'configuration' | 'application';
  size: string;
  selected: boolean;
}

export const SystemRestore = () => {
  const [selectedRestorePoint, setSelectedRestorePoint] = useState<string>('');
  const [restoreMode, setRestoreMode] = useState<'full' | 'selective'>('full');
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectiveItems, setSelectiveItems] = useState<SelectiveRestoreItem[]>([
    { id: 'db-1', name: 'Patient Database', type: 'database', size: '245 GB', selected: false },
    { id: 'db-2', name: 'Administrative Database', type: 'database', size: '89 GB', selected: false },
    { id: 'files-1', name: 'Medical Images', type: 'files', size: '1.2 TB', selected: false },
    { id: 'files-2', name: 'Document Archive', type: 'files', size: '567 GB', selected: false },
    { id: 'config-1', name: 'System Configuration', type: 'configuration', size: '2.1 GB', selected: false },
    { id: 'app-1', name: 'Application Binaries', type: 'application', size: '45 GB', selected: false }
  ]);

  const restorePoints: RestorePoint[] = [
    {
      id: 'rp-1',
      timestamp: '2024-01-20 02:00:00',
      type: 'full',
      size: '2.4 TB',
      location: 'Cloud Storage',
      systemsIncluded: ['Database', 'Application', 'Files', 'Configuration'],
      verified: true,
      description: 'Scheduled full system backup'
    },
    {
      id: 'rp-2',
      timestamp: '2024-01-19 14:30:00',
      type: 'incremental',
      size: '156 GB',
      location: 'Offsite Backup',
      systemsIncluded: ['Database', 'Files'],
      verified: true,
      description: 'Incremental backup - Pre-maintenance'
    },
    {
      id: 'rp-3',
      timestamp: '2024-01-19 02:00:00',
      type: 'full',
      size: '2.3 TB',
      location: 'Local Storage',
      systemsIncluded: ['Database', 'Application', 'Files', 'Configuration'],
      verified: true,
      description: 'Scheduled full system backup'
    },
    {
      id: 'rp-4',
      timestamp: '2024-01-18 18:45:00',
      type: 'differential',
      size: '324 GB',
      location: 'Cloud Storage',
      systemsIncluded: ['Database', 'Files'],
      verified: false,
      description: 'Emergency backup before critical update'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-blue-100 text-blue-800';
      case 'incremental': return 'bg-green-100 text-green-800';
      case 'differential': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'files': return HardDrive;
      case 'configuration': return Settings;
      case 'application': return Play;
      default: return HardDrive;
    }
  };

  const handleSelectiveItemToggle = (itemId: string) => {
    setSelectiveItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleStartRestore = () => {
    if (!selectedRestorePoint) {
      toast.error('Please select a restore point');
      return;
    }

    if (restoreMode === 'selective' && !selectiveItems.some(item => item.selected)) {
      toast.error('Please select at least one item to restore');
      return;
    }

    setIsRestoring(true);
    setRestoreProgress(0);

    toast.promise(
      new Promise((resolve) => {
        const progressSteps = [0, 15, 35, 60, 85, 100];
        let currentStep = 0;
        
        const updateProgress = () => {
          if (currentStep < progressSteps.length) {
            setRestoreProgress(progressSteps[currentStep]);
            currentStep++;
            setTimeout(updateProgress, 3000);
          } else {
            setIsRestoring(false);
            setRestoreProgress(0);
            resolve('System restore completed successfully');
          }
        };
        
        updateProgress();
      }),
      {
        loading: 'System restore in progress...',
        success: 'System restore completed successfully',
        error: 'System restore failed'
      }
    );
  };

  const handleVerifyRestorePoint = (pointId: string) => {
    toast.success('Restore point verification initiated');
  };

  const selectedRestoreData = restorePoints.find(rp => rp.id === selectedRestorePoint);
  const selectedItems = selectiveItems.filter(item => item.selected);
  const totalSelectedSize = selectedItems.reduce((total, item) => {
    const size = parseFloat(item.size.split(' ')[0]);
    const unit = item.size.split(' ')[1];
    return total + (unit === 'TB' ? size * 1024 : size);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Restore Progress Alert */}
      {isRestoring && (
        <Alert className="border-blue-200 bg-blue-50">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>System restore is in progress. Please do not interrupt the process.</span>
              <div className="flex items-center gap-2">
                <Progress value={restoreProgress} className="w-32 h-2" />
                <span className="text-sm font-medium">{restoreProgress}%</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Restore Point Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Point-in-Time Recovery
              </CardTitle>
              <CardDescription>Select a restore point and configure recovery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {restorePoints.map((point) => (
                  <div
                    key={point.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRestorePoint === point.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRestorePoint(point.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedRestorePoint === point.id}
                          onChange={() => setSelectedRestorePoint(point.id)}
                        />
                        <div>
                          <h4 className="font-medium">{point.timestamp}</h4>
                          <p className="text-sm text-gray-600">{point.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(point.type)}>
                          {point.type}
                        </Badge>
                        {point.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium">{point.size}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{point.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Systems:</span>
                        <span className="ml-2 font-medium">{point.systemsIncluded.length}</span>
                      </div>
                    </div>
                    
                    {!point.verified && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyRestorePoint(point.id);
                          }}
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Verify Integrity
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restore Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restore Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Restore Mode</label>
                <Select value={restoreMode} onValueChange={(value: 'full' | 'selective') => setRestoreMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full System Restore</SelectItem>
                    <SelectItem value="selective">Selective Restore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRestoreData && (
                <div className="p-3 bg-gray-50 rounded space-y-2">
                  <h4 className="font-medium text-sm">Selected Restore Point</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Timestamp:</span>
                      <span>{selectedRestoreData.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{selectedRestoreData.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{selectedRestoreData.type}</span>
                    </div>
                  </div>
                </div>
              )}

              {restoreMode === 'selective' && selectedItems.length > 0 && (
                <div className="p-3 bg-blue-50 rounded space-y-2">
                  <h4 className="font-medium text-sm">Selected Items ({selectedItems.length})</h4>
                  <div className="text-xs">
                    <div className="flex justify-between">
                      <span>Total Size:</span>
                      <span>{totalSelectedSize.toFixed(1)} GB</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleStartRestore}
                disabled={!selectedRestorePoint || isRestoring}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Restore
              </Button>
            </CardContent>
          </Card>

          {restoreMode === 'selective' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selective Restore Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectiveItems.map((item) => {
                  const ItemIcon = getItemTypeIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={() => handleSelectiveItemToggle(item.id)}
                        />
                        <ItemIcon className="h-4 w-4" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.size}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
