import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Wifi, WifiOff, Download, sync, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

interface SyncStatus {
  lastSync: Date | null;
  pendingUploads: number;
  offlineStorage: number; // MB
  cloudStorage: number; // MB
}

export const AccessModeToggle = () => {
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: new Date(),
    pendingUploads: 3,
    offlineStorage: 245,
    cloudStorage: 1024
  });

  const handleModeToggle = (enabled: boolean) => {
    setIsOnlineMode(enabled);
    if (enabled) {
      toast.success('Switched to online mode - cloud sync enabled');
    } else {
      toast.info('Switched to offline mode - data stored locally');
    }
  };

  const handleAutoSyncToggle = (enabled: boolean) => {
    setIsAutoSync(enabled);
    toast.success(enabled ? 'Auto-sync enabled' : 'Auto-sync disabled');
  };

  const handleManualSync = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Syncing with cloud...',
        success: 'Successfully synced with cloud',
        error: 'Sync failed'
      }
    );

    // Update sync status after successful sync
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingUploads: 0
      }));
    }, 2000);
  };

  const handleDownloadOffline = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Downloading records for offline access...',
        success: 'Records downloaded for offline access',
        error: 'Download failed'
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnlineMode ? <Cloud className="h-5 w-5" /> : <HardDrive className="h-5 w-5" />}
            Access Mode Settings
          </CardTitle>
          <CardDescription>
            Control how your medical records are accessed and synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isOnlineMode ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-gray-600" />}
                <span className="font-medium">
                  {isOnlineMode ? 'Online Mode' : 'Offline Mode'}
                </span>
                <Badge variant={isOnlineMode ? 'default' : 'secondary'}>
                  {isOnlineMode ? 'Cloud + Local' : 'Local Only'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {isOnlineMode 
                  ? 'Records synced with cloud storage for access anywhere'
                  : 'Records stored locally for privacy and offline access'
                }
              </p>
            </div>
            <Switch
              checked={isOnlineMode}
              onCheckedChange={handleModeToggle}
            />
          </div>

          {/* Auto-sync Toggle (only in online mode) */}
          {isOnlineMode && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <sync className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Auto-Sync</span>
                  <Badge variant={isAutoSync ? 'default' : 'outline'}>
                    {isAutoSync ? 'Enabled' : 'Manual'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Automatically sync changes to cloud storage
                </p>
              </div>
              <Switch
                checked={isAutoSync}
                onCheckedChange={handleAutoSyncToggle}
              />
            </div>
          )}

          {/* Storage Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Local Storage</span>
                </div>
                <div className="text-2xl font-bold">{syncStatus.offlineStorage} MB</div>
                <p className="text-sm text-gray-600">Stored offline</p>
              </CardContent>
            </Card>

            {isOnlineMode && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Cloud Storage</span>
                  </div>
                  <div className="text-2xl font-bold">{syncStatus.cloudStorage} MB</div>
                  <p className="text-sm text-gray-600">Synced to cloud</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sync Status & Controls */}
          {isOnlineMode && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Last Sync</p>
                  <p className="text-sm text-gray-600">
                    {syncStatus.lastSync ? syncStatus.lastSync.toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Pending Uploads</p>
                  <p className="text-sm text-gray-600">{syncStatus.pendingUploads} files</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleManualSync} variant="outline">
                  <sync className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button onClick={handleDownloadOffline} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Offline
                </Button>
              </div>
            </div>
          )}

          {/* Offline Mode Actions */}
          {!isOnlineMode && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Offline Mode Active</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Your records are stored locally and won't sync until you switch back to online mode.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleModeToggle(true)}
              >
                Switch to Online Mode
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
