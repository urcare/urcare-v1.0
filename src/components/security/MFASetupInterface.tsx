
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Mail, 
  MessageSquare,
  KeyRound,
  QrCode,
  Shield,
  CheckCircle,
  AlertCircle,
  Download,
  Copy
} from 'lucide-react';

interface MFAMethod {
  id: string;
  name: string;
  type: 'authenticator' | 'sms' | 'email' | 'hardware';
  icon: React.ComponentType<any>;
  enabled: boolean;
  enrolled: boolean;
  description: string;
  security: 'high' | 'medium' | 'low';
}

export const MFASetupInterface = () => {
  const [qrCode] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iIzMzMyI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=');
  const [backupCodes] = useState([
    '1234-5678-9012',
    '3456-7890-1234',
    '5678-9012-3456',
    '7890-1234-5678',
    '9012-3456-7890'
  ]);
  
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([
    {
      id: 'authenticator',
      name: 'Authenticator App',
      type: 'authenticator',
      icon: Smartphone,
      enabled: true,
      enrolled: true,
      description: 'Use Google Authenticator, Authy, or similar apps',
      security: 'high'
    },
    {
      id: 'sms',
      name: 'SMS Messages',
      type: 'sms',
      icon: MessageSquare,
      enabled: true,
      enrolled: false,
      description: 'Receive codes via text message',
      security: 'medium'
    },
    {
      id: 'email',
      name: 'Email Verification',
      type: 'email',
      icon: Mail,
      enabled: false,
      enrolled: false,
      description: 'Receive codes via email',
      security: 'medium'
    },
    {
      id: 'hardware',
      name: 'Hardware Token',
      type: 'hardware',
      icon: KeyRound,
      enabled: false,
      enrolled: false,
      description: 'Use YubiKey or similar hardware tokens',
      security: 'high'
    }
  ]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState<'select' | 'configure' | 'verify'>('select');
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod | null>(null);

  const toggleMethod = (methodId: string) => {
    setMfaMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
  };

  const startEnrollment = (method: MFAMethod) => {
    setSelectedMethod(method);
    setSetupStep('configure');
  };

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mfaCompleteness = Math.round(
    (mfaMethods.filter(m => m.enrolled).length / mfaMethods.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* MFA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Multi-Factor Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Setup Progress</div>
              <div className="text-sm text-gray-600">{mfaMethods.filter(m => m.enrolled).length} of {mfaMethods.length} methods configured</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{mfaCompleteness}%</div>
              <Progress value={mfaCompleteness} className="w-24 h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Primary Method:</span>
              <span className="ml-2">Authenticator App</span>
            </div>
            <div>
              <span className="font-medium">Backup Methods:</span>
              <span className="ml-2">{mfaMethods.filter(m => m.enrolled && m.id !== 'authenticator').length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {setupStep === 'select' && (
        <>
          {/* Available MFA Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Authentication Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mfaMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card key={method.id} className={method.enrolled ? 'border-green-200' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.enrolled && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <Switch
                            checked={method.enabled}
                            onCheckedChange={() => toggleMethod(method.id)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getSecurityBadgeColor(method.security)}>
                          {method.security} security
                        </Badge>
                        
                        {!method.enrolled && method.enabled && (
                          <Button 
                            size="sm" 
                            onClick={() => startEnrollment(method)}
                          >
                            Set Up
                          </Button>
                        )}
                        
                        {method.enrolled && (
                          <Button size="sm" variant="outline">
                            Reconfigure
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Backup Recovery Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Backup Recovery Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Save these backup codes in a secure location. Each code can only be used once.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <code className="font-mono text-sm">{code}</code>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Codes
                </Button>
                <Button variant="outline">
                  Generate New Codes
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {setupStep === 'configure' && selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedMethod.icon className="h-5 w-5" />
              Setup {selectedMethod.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMethod.type === 'authenticator' && (
              <div className="space-y-4">
                <div className="text-center">
                  <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48 border" />
                  <p className="text-sm text-gray-600 mt-2">
                    Scan this QR code with your authenticator app
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Or enter this code manually:</p>
                  <code className="text-lg font-mono bg-gray-100 px-3 py-2 rounded">
                    JBSWY3DPEHPK3PXP
                  </code>
                </div>
              </div>
            )}

            {selectedMethod.type === 'sms' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={() => setSetupStep('verify')}>
                  Send Verification Code
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setSetupStep('verify')}>
                Continue to Verification
              </Button>
              <Button variant="outline" onClick={() => setSetupStep('select')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {setupStep === 'verify' && selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verify {selectedMethod.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => {
                // Complete enrollment
                setMfaMethods(prev => 
                  prev.map(method => 
                    method.id === selectedMethod.id 
                      ? { ...method, enrolled: true }
                      : method
                  )
                );
                setSetupStep('select');
                setSelectedMethod(null);
              }}>
                Complete Setup
              </Button>
              <Button variant="outline" onClick={() => setSetupStep('configure')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
