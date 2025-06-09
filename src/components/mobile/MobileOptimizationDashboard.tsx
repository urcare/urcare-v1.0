
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  Camera, 
  QrCode,
  MapPin,
  Battery,
  Signal,
  Globe
} from 'lucide-react';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { OfflineManager } from './OfflineManager';
import { TouchOptimizedInterface } from './TouchOptimizedInterface';
import { CameraScanner } from './CameraScanner';
import { QRCodeManager } from './QRCodeManager';
import { LocationServices } from './LocationServices';

export const MobileOptimizationDashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [connectionType, setConnectionType] = useState('wifi');

  const mobileFeatures = [
    { id: 'pwa', name: 'PWA Installation', icon: Download, status: 'active', enabled: !isPWAInstalled },
    { id: 'offline', name: 'Offline Sync', icon: isOnline ? Wifi : WifiOff, status: 'active', enabled: true },
    { id: 'touch', name: 'Touch Optimization', icon: Smartphone, status: 'active', enabled: true },
    { id: 'camera', name: 'Document Scanner', icon: Camera, status: 'active', enabled: true },
    { id: 'qr', name: 'QR Code Scanner', icon: QrCode, status: 'active', enabled: true },
    { id: 'location', name: 'Location Services', icon: MapPin, status: 'active', enabled: true }
  ];

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    // Battery API (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Connection API (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      connection.addEventListener('change', () => {
        setConnectionType(connection.effectiveType || 'unknown');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case '4g': return 'text-green-600';
      case '3g': return 'text-yellow-600';
      case '2g': return 'text-red-600';
      case 'wifi': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile Optimization</h1>
          <p className="text-gray-600">PWA, offline functionality, and mobile-first features</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Battery className={`h-4 w-4 ${batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm">{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className={`h-4 w-4 ${getConnectionColor(connectionType)}`} />
            <span className="text-sm capitalize">{connectionType}</span>
          </div>
          <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mobileFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{feature.name}</h3>
                <div className="text-sm text-gray-600">
                  {feature.enabled ? 'Active' : 'Available'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PWAInstallPrompt 
          installPrompt={installPrompt}
          isPWAInstalled={isPWAInstalled}
          onInstallComplete={() => setIsPWAInstalled(true)}
        />
        
        <OfflineManager isOnline={isOnline} />
        
        <TouchOptimizedInterface />
        
        <CameraScanner />
        
        <QRCodeManager />
        
        <LocationServices />
      </div>
    </div>
  );
};
