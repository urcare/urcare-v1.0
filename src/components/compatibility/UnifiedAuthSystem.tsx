
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Smartphone,
  Monitor,
  Tablet,
  Tv,
  Watch,
  Key,
  UserCheck,
  Lock
} from 'lucide-react';

interface AuthPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  isEnabled: boolean;
  authMethods: string[];
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  activeUsers: number;
  lastUpdate: Date;
}

interface AuthMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  securityScore: number;
  platforms: string[];
}

export const UnifiedAuthSystem = () => {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(true);
  
  const [platforms, setPlatforms] = useState<AuthPlatform[]>([
    {
      id: 'web',
      name: 'Web Application',
      icon: Monitor,
      isEnabled: true,
      authMethods: ['password', 'biometric', 'sso'],
      securityLevel: 'enhanced',
      activeUsers: 1247,
      lastUpdate: new Date(Date.now() - 300000)
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: Smartphone,
      isEnabled: true,
      authMethods: ['biometric', 'pin', 'sso'],
      securityLevel: 'maximum',
      activeUsers: 2134,
      lastUpdate: new Date(Date.now() - 180000)
    },
    {
      id: 'tablet',
      name: 'Tablet Interface',
      icon: Tablet,
      isEnabled: true,
      authMethods: ['password', 'biometric', 'badge'],
      securityLevel: 'enhanced',
      activeUsers: 456,
      lastUpdate: new Date(Date.now() - 420000)
    },
    {
      id: 'kiosk',
      name: 'Kiosk System',
      icon: Monitor,
      isEnabled: true,
      authMethods: ['badge', 'pin'],
      securityLevel: 'standard',
      activeUsers: 89,
      lastUpdate: new Date(Date.now() - 600000)
    },
    {
      id: 'tv',
      name: 'Smart TV',
      icon: Tv,
      isEnabled: false,
      authMethods: ['qr-code', 'remote'],
      securityLevel: 'standard',
      activeUsers: 0,
      lastUpdate: new Date(Date.now() - 86400000)
    },
    {
      id: 'watch',
      name: 'Smartwatch',
      icon: Watch,
      isEnabled: true,
      authMethods: ['biometric', 'pin'],
      securityLevel: 'enhanced',
      activeUsers: 234,
      lastUpdate: new Date(Date.now() - 120000)
    }
  ]);

  const [authMethods] = useState<AuthMethod[]>([
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      description: 'Fingerprint, face recognition, voice authentication',
      enabled: true,
      securityScore: 95,
      platforms: ['mobile', 'tablet', 'watch']
    },
    {
      id: 'sso',
      name: 'Single Sign-On (SSO)',
      description: 'Enterprise identity provider integration',
      enabled: true,
      securityScore: 88,
      platforms: ['web', 'mobile', 'tablet']
    },
    {
      id: 'mfa',
      name: 'Multi-Factor Authentication',
      description: 'Time-based codes, SMS, authenticator apps',
      enabled: true,
      securityScore: 92,
      platforms: ['web', 'mobile', 'tablet', 'kiosk']
    },
    {
      id: 'badge',
      name: 'ID Badge/RFID',
      description: 'Physical badge tap authentication',
      enabled: true,
      securityScore: 78,
      platforms: ['tablet', 'kiosk']
    },
    {
      id: 'pin',
      name: 'PIN Authentication',
      description: 'Numeric PIN codes for quick access',
      enabled: true,
      securityScore: 65,
      platforms: ['mobile', 'kiosk', 'watch']
    }
  ]);

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, isEnabled: !platform.isEnabled }
          : platform
      )
    );
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'maximum': return 'bg-red-100 text-red-800';
      case 'enhanced': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const totalActiveUsers = platforms.reduce((sum, platform) => sum + platform.activeUsers, 0);
  const enabledPlatforms = platforms.filter(p => p.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Unified Authentication System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalActiveUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{enabledPlatforms}</div>
              <div className="text-sm text-gray-600">Enabled Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{authMethods.filter(m => m.enabled).length}</div>
              <div className="text-sm text-gray-600">Auth Methods</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">99.8%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Single Sign-On (SSO)</div>
                <div className="text-sm text-gray-600">Unified login across all platforms</div>
              </div>
              <Switch
                checked={ssoEnabled}
                onCheckedChange={setSsoEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Multi-Factor Authentication</div>
                <div className="text-sm text-gray-600">Required for all sensitive operations</div>
              </div>
              <Switch
                checked={mfaRequired}
                onCheckedChange={setMfaRequired}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Platform Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <div key={platform.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-sm text-gray-600">{platform.activeUsers} active users</div>
                      </div>
                    </div>
                    <Switch
                      checked={platform.isEnabled}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                  </div>

                  {platform.isEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Security Level</span>
                        <Badge className={getSecurityLevelColor(platform.securityLevel)}>
                          {platform.securityLevel}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Enabled Methods</div>
                        <div className="flex flex-wrap gap-1">
                          {platform.authMethods.map((method) => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Last updated: {formatTime(platform.lastUpdate)}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentication Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {authMethods.map((method) => (
              <div key={method.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                  <Switch checked={method.enabled} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Score</span>
                      <span className="font-medium">{method.securityScore}%</span>
                    </div>
                    <Progress value={method.securityScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Supported Platforms</div>
                    <div className="flex flex-wrap gap-1">
                      {method.platforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId);
                        return platform ? (
                          <Badge key={platformId} variant="outline" className="text-xs">
                            {platform.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Authentication Events (24h)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Successful Logins</span>
                  <span className="font-medium text-green-600">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Attempts</span>
                  <span className="font-medium text-red-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span>MFA Challenges</span>
                  <span className="font-medium text-blue-600">1,456</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Lockouts</span>
                  <span className="font-medium text-orange-600">2</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Security Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Password Strength</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>MFA Adoption</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Biometric Enrollment</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex justify-between">
                  <span>SSO Usage</span>
                  <span className="font-medium">91%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
