
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Fingerprint, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BiometricSetup = () => {
  const [enableFingerprint, setEnableFingerprint] = useState(false);
  const [enableFaceID, setEnableFaceID] = useState(false);
  
  const handleFingerprintToggle = (checked: boolean) => {
    setEnableFingerprint(checked);
    if (checked) {
      // In a real implementation, this would trigger native biometric setup
      toast.success('Fingerprint authentication enabled');
    } else {
      toast.info('Fingerprint authentication disabled');
    }
  };
  
  const handleFaceIDToggle = (checked: boolean) => {
    setEnableFaceID(checked);
    if (checked) {
      // In a real implementation, this would trigger native biometric setup
      toast.success('Face ID authentication enabled');
    } else {
      toast.info('Face ID authentication disabled');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Biometric Authentication</h2>
        <p className="text-muted-foreground mt-2">
          Set up biometric login to access your account securely and quickly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`hover-scale ${enableFingerprint ? 'border-primary' : ''}`}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              Fingerprint Authentication
            </CardTitle>
            <CardDescription>
              Use your fingerprint to quickly log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="fingerprint-toggle" className="text-base font-medium">
                Enable Fingerprint Login
              </Label>
              <Switch 
                id="fingerprint-toggle" 
                checked={enableFingerprint}
                onCheckedChange={handleFingerprintToggle}
              />
            </div>
            
            {enableFingerprint && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Your device will prompt you to scan your fingerprint the next time you log in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className={`hover-scale ${enableFaceID ? 'border-primary' : ''}`}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Face ID Authentication
            </CardTitle>
            <CardDescription>
              Use facial recognition to quickly log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="faceid-toggle" className="text-base font-medium">
                Enable Face ID Login
              </Label>
              <Switch 
                id="faceid-toggle" 
                checked={enableFaceID}
                onCheckedChange={handleFaceIDToggle}
              />
            </div>
            
            {enableFaceID && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Your device will prompt you to scan your face the next time you log in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Biometric data is stored securely on your device and is never transmitted to our servers.
        </p>
      </div>
    </div>
  );
};

export default BiometricSetup;
