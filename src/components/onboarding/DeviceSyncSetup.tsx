
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'wearable';
  lastSync: string;
  status: 'online' | 'offline';
}

const DeviceSyncSetup = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [backgroundSync, setBackgroundSync] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Current Device',
      type: 'mobile',
      lastSync: new Date().toISOString(),
      status: 'online',
    },
    {
      id: '2',
      name: 'Home Computer',
      type: 'desktop',
      lastSync: '2023-05-15T08:30:00Z',
      status: 'offline',
    },
    {
      id: '3',
      name: 'Tablet',
      type: 'tablet',
      lastSync: '2023-05-20T14:15:00Z',
      status: 'offline',
    }
  ]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  useEffect(() => {
    // Simulate a sync status check
    const timer = setTimeout(() => {
      setSyncStatus('success');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSync = () => {
    setSyncStatus('syncing');
    toast.info('Syncing your profile across devices...');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('success');
      
      // Update last sync time for current device
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === '1' 
            ? { ...device, lastSync: new Date().toISOString() } 
            : device
        )
      );
      
      toast.success('Sync completed successfully');
    }, 2000);
  };
  
  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        );
      case 'tablet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        );
      case 'desktop':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'wearable':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="7" />
            <polyline points="12 9 12 12 13.5 13.5" />
            <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
          </svg>
        );
    }
  };
  
  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Device Synchronization</h2>
        <p className="text-muted-foreground mt-2">
          Keep your health data in sync across all your devices.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Sync Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-sync" className="text-base">Automatic Sync</Label>
                  <p className="text-sm text-muted-foreground">Sync data automatically when changes are detected</p>
                </div>
                <Switch 
                  id="auto-sync" 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="background-sync" className="text-base">Background Sync</Label>
                  <p className="text-sm text-muted-foreground">Sync data even when the app is not active</p>
                </div>
                <Switch 
                  id="background-sync" 
                  checked={backgroundSync}
                  onCheckedChange={setBackgroundSync}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-priority" className="text-base">High Priority Sync</Label>
                  <p className="text-sm text-muted-foreground">Prioritize health data syncing over other operations</p>
                </div>
                <Switch 
                  id="high-priority" 
                  checked={highPriority}
                  onCheckedChange={setHighPriority}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSync} 
                disabled={syncStatus === 'syncing'}
                className="w-full"
              >
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Connected Devices</h3>
            
            <div className="space-y-4">
              {devices.map(device => (
                <div 
                  key={device.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {device.name} 
                        {device.id === '1' && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {formatLastSync(device.lastSync)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs font-medium ${device.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-blue-600">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${syncStatus === 'success' ? 'bg-green-500' : syncStatus === 'syncing' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></span>
                {syncStatus === 'idle' && 'Ready to sync'}
                {syncStatus === 'syncing' && 'Syncing in progress...'}
                {syncStatus === 'success' && 'All devices up to date'}
                {syncStatus === 'error' && 'Sync error. Try again.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Pro Tip:</strong> For the best experience, enable automatic sync to keep your health data updated across all your devices.
        </p>
      </div>
    </div>
  );
};

export default DeviceSyncSetup;
