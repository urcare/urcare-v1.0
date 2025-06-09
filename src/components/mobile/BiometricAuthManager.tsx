
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Fingerprint, 
  Eye, 
  Shield, 
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface BiometricMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  enrolledUsers: number;
  successRate: number;
  failureRate: number;
  securityLevel: 'high' | 'very-high' | 'extreme';
}

interface BiometricAttempt {
  id: string;
  userId: string;
  method: string;
  timestamp: Date;
  status: 'success' | 'failure' | 'locked';
  deviceInfo: string;
}

export const BiometricAuthManager = () => {
  const [methods, setMethods] = useState<BiometricMethod[]>([
    {
      id: 'fingerprint',
      name: 'Fingerprint Recognition',
      icon: Fingerprint,
      enabled: true,
      enrolledUsers: 8934,
      successRate: 96.8,
      failureRate: 3.2,
      securityLevel: 'high'
    },
    {
      id: 'face',
      name: 'Face Recognition',
      icon: Eye,
      enabled: true,
      enrolledUsers: 6782,
      successRate: 94.5,
      failureRate: 5.5,
      securityLevel: 'very-high'
    },
    {
      id: 'voice',
      name: 'Voice Recognition',
      icon: Shield,
      enabled: false,
      enrolledUsers: 2341,
      successRate: 89.2,
      failureRate: 10.8,
      securityLevel: 'high'
    }
  ]);

  const [recentAttempts] = useState<BiometricAttempt[]>([
    {
      id: '1',
      userId: 'user123',
      method: 'fingerprint',
      timestamp: new Date(Date.now() - 300000),
      status: 'success',
      deviceInfo: 'iPhone 14 Pro'
    },
    {
      id: '2',
      userId: 'user456',
      method: 'face',
      timestamp: new Date(Date.now() - 600000),
      status: 'failure',
      deviceInfo: 'Samsung Galaxy S23'
    },
    {
      id: '3',
      userId: 'user789',
      method: 'fingerprint',
      timestamp: new Date(Date.now() - 900000),
      status: 'locked',
      deviceInfo: 'iPhone 13'
    }
  ]);

  const [enrollmentProgress, setEnrollmentProgress] = useState({
    fingerprint: 75,
    face: 58,
    voice: 23
  });

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const toggleMethod = (methodId: string) => {
    setMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
  };

  const startEnrollment = async (methodId: string) => {
    setIsEnrolling(true);
    setSelectedMethod(methodId);
    
    // Simulate enrollment process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsEnrolling(false);
    setSelectedMethod('');
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'very-high': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'locked': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Biometric Methods Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Biometric Authentication Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {methods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="font-medium">{method.name}</span>
                        <Badge className={`ml-2 ${getSecurityLevelColor(method.securityLevel)}`}>
                          {method.securityLevel}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={() => toggleMethod(method.id)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Enrolled Users: </span>
                      <span className="font-medium">{method.enrolledUsers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Success Rate: </span>
                      <span className="font-medium text-green-600">{method.successRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failure Rate: </span>
                      <span className="font-medium text-red-600">{method.failureRate}%</span>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEnrollment(method.id)}
                        disabled={isEnrolling}
                      >
                        {isEnrolling && selectedMethod === method.id ? 'Enrolling...' : 'Test Enrollment'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Enrollment Progress</span>
                      <span>{enrollmentProgress[method.id as keyof typeof enrollmentProgress]}%</span>
                    </div>
                    <Progress value={enrollmentProgress[method.id as keyof typeof enrollmentProgress]} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">96.2%</div>
                  <div className="text-sm text-gray-600">Overall Success Rate</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">18,057</div>
                  <div className="text-sm text-gray-600">Total Enrolled Users</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Security Score</span>
                  <span className="font-medium">Excellent (A+)</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Security Recommendations</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Enable multi-factor authentication for critical operations</li>
                  <li>• Implement liveness detection for face recognition</li>
                  <li>• Regular security audits and updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Authentication Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(attempt.status)}
                    <div>
                      <div className="font-medium text-sm">User {attempt.userId}</div>
                      <div className="text-xs text-gray-600">{attempt.deviceInfo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium capitalize">{attempt.method}</div>
                    <div className="text-xs text-gray-600">
                      {attempt.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy and Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Data Protection</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Biometric Data Encryption</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Local Storage Only</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>GDPR Compliance</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>HIPAA Compliance</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Security Features</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Liveness Detection</span>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Anti-Spoofing</span>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fraud Detection</span>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Secure Enclave</span>
                  <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
