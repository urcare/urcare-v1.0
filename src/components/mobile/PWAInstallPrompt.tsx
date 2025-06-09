
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface PWAInstallPromptProps {
  installPrompt: any;
  isPWAInstalled: boolean;
  onInstallComplete: () => void;
}

export const PWAInstallPrompt = ({ installPrompt, isPWAInstalled, onInstallComplete }: PWAInstallPromptProps) => {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!installPrompt) {
      toast.error('Installation not available on this device');
      return;
    }

    setIsInstalling(true);
    
    try {
      const result = await installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        toast.success('UrCare has been installed successfully!');
        onInstallComplete();
      } else {
        toast.info('Installation cancelled');
      }
    } catch (error) {
      console.error('Installation failed:', error);
      toast.error('Installation failed. Please try again.');
    } finally {
      setIsInstalling(false);
    }
  };

  const pwaFeatures = [
    'Work offline with cached data',
    'Receive push notifications',
    'Quick access from home screen',
    'Native app-like experience',
    'Automatic updates',
    'Reduced data usage'
  ];

  if (isPWAInstalled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            PWA Installed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Smartphone className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-green-800">UrCare is installed!</p>
              <p className="text-sm text-green-700">You can access it from your home screen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Install UrCare App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Smartphone className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Get the full experience</h3>
          <p className="text-sm text-gray-600 mb-4">
            Install UrCare as a progressive web app for the best mobile experience
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Features included:</h4>
          <div className="space-y-1">
            {pwaFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-3 w-3 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleInstall}
            disabled={!installPrompt || isInstalling}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isInstalling ? 'Installing...' : 'Install App'}
          </Button>
          
          {!installPrompt && (
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Installation not available on this device/browser
              </Badge>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Works on iOS Safari, Chrome, Edge, and other modern browsers</p>
          <p>• No app store required</p>
          <p>• Automatically stays up to date</p>
        </div>
      </CardContent>
    </Card>
  );
};
