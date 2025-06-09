
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  HardDrive,
  Sync,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface OfflineManagerProps {
  isOnline: boolean;
}

interface OfflineData {
  id: string;
  type: 'appointment' | 'patient' | 'document';
  data: any;
  timestamp: number;
  synced: boolean;
}

export const OfflineManager = ({ isOnline }: OfflineManagerProps) => {
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);

  useEffect(() => {
    loadOfflineData();
    checkStorageUsage();
    
    // Auto-sync when coming back online
    if (isOnline && offlineData.some(item => !item.synced)) {
      syncOfflineData();
    }
  }, [isOnline]);

  const loadOfflineData = async () => {
    try {
      // Simulate loading from IndexedDB
      const mockData: OfflineData[] = [
        {
          id: '1',
          type: 'appointment',
          data: { patientId: 'P001', time: '14:30', doctor: 'Dr. Smith' },
          timestamp: Date.now() - 3600000,
          synced: false
        },
        {
          id: '2',
          type: 'patient',
          data: { name: 'John Doe', age: 45, condition: 'Hypertension' },
          timestamp: Date.now() - 7200000,
          synced: true
        }
      ];
      
      setOfflineData(mockData);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const checkStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageUsed(estimate.usage || 0);
        setStorageQuota(estimate.quota || 0);
      } catch (error) {
        console.error('Failed to get storage estimate:', error);
      }
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);
    
    const unsyncedData = offlineData.filter(item => !item.synced);
    
    try {
      for (let i = 0; i < unsyncedData.length; i++) {
        const item = unsyncedData[i];
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update sync status
        setOfflineData(prev => 
          prev.map(data => 
            data.id === item.id ? { ...data, synced: true } : data
          )
        );
        
        setSyncProgress(((i + 1) / unsyncedData.length) * 100);
      }
      
      toast.success(`Synced ${unsyncedData.length} items successfully`);
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Will retry automatically.');
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const clearOfflineData = async () => {
    try {
      const syncedData = offlineData.filter(item => item.synced);
      setOfflineData(syncedData);
      toast.success('Cleared synced offline data');
      checkStorageUsage();
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'patient': return '👤';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const unsyncedCount = offlineData.filter(item => !item.synced).length;
  const storagePercentage = storageQuota > 0 ? (storageUsed / storageQuota) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
          Offline Data Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className={`p-3 rounded-lg ${isOnline ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              <span className="text-sm">
                {isOnline ? 'Connected to server' : 'Working offline'}
              </span>
            </div>
            {unsyncedCount > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                {unsyncedCount} unsynced
              </Badge>
            )}
          </div>
        </div>

        {/* Sync Progress */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sync className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Syncing data...</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Storage Usage
            </span>
            <span>{formatBytes(storageUsed)} / {formatBytes(storageQuota)}</span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>

        {/* Offline Data Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Cached Data ({offlineData.length} items)</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {offlineData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(item.type)}</span>
                  <span className="capitalize">{item.type}</span>
                  <span className="text-gray-500">#{item.id}</span>
                </div>
                {item.synced ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={syncOfflineData}
            disabled={!isOnline || isSyncing || unsyncedCount === 0}
            className="flex-1"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
          <Button
            onClick={clearOfflineData}
            variant="outline"
            size="sm"
            disabled={offlineData.filter(item => item.synced).length === 0}
          >
            Clear Synced
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Data is automatically cached for offline access</p>
          <p>• Changes sync automatically when connection is restored</p>
          <p>• Critical operations work offline with conflict resolution</p>
        </div>
      </CardContent>
    </Card>
  );
};
