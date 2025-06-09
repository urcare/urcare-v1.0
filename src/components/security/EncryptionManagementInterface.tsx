
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Key, 
  Lock, 
  Shield,
  RefreshCw,
  Calendar,
  Database,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface EncryptionKey {
  id: string;
  name: string;
  type: 'master' | 'data' | 'field' | 'transport';
  algorithm: string;
  strength: string;
  status: 'active' | 'rotating' | 'expired' | 'revoked';
  created: Date;
  lastRotation: Date;
  nextRotation: Date;
  usage: number;
}

interface EncryptionTarget {
  id: string;
  name: string;
  type: 'database' | 'files' | 'communications' | 'backups';
  encrypted: boolean;
  encryptionLevel: 'none' | 'basic' | 'advanced' | 'enterprise';
  keyId: string;
  compliance: string[];
}

export const EncryptionManagementInterface = () => {
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([
    {
      id: 'master-001',
      name: 'Master Encryption Key',
      type: 'master',
      algorithm: 'AES-256-GCM',
      strength: '256-bit',
      status: 'active',
      created: new Date('2024-01-01'),
      lastRotation: new Date('2024-06-01'),
      nextRotation: new Date('2024-12-01'),
      usage: 89
    },
    {
      id: 'data-001',
      name: 'Patient Data Key',
      type: 'data',
      algorithm: 'AES-256-CBC',
      strength: '256-bit',
      status: 'active',
      created: new Date('2024-03-01'),
      lastRotation: new Date('2024-06-01'),
      nextRotation: new Date('2024-09-01'),
      usage: 67
    },
    {
      id: 'field-001',
      name: 'PII Field Encryption',
      type: 'field',
      algorithm: 'AES-256-GCM',
      strength: '256-bit',
      status: 'rotating',
      created: new Date('2024-02-01'),
      lastRotation: new Date('2024-05-01'),
      nextRotation: new Date('2024-08-01'),
      usage: 45
    }
  ]);

  const [encryptionTargets, setEncryptionTargets] = useState<EncryptionTarget[]>([
    {
      id: 'db-patient',
      name: 'Patient Database',
      type: 'database',
      encrypted: true,
      encryptionLevel: 'enterprise',
      keyId: 'data-001',
      compliance: ['HIPAA', 'SOX', 'GDPR']
    },
    {
      id: 'files-medical',
      name: 'Medical Records Files',
      type: 'files',
      encrypted: true,
      encryptionLevel: 'advanced',
      keyId: 'field-001',
      compliance: ['HIPAA', 'GDPR']
    },
    {
      id: 'comm-internal',
      name: 'Internal Communications',
      type: 'communications',
      encrypted: false,
      encryptionLevel: 'basic',
      keyId: '',
      compliance: []
    },
    {
      id: 'backup-daily',
      name: 'Daily Backup Archives',
      type: 'backups',
      encrypted: true,
      encryptionLevel: 'enterprise',
      keyId: 'master-001',
      compliance: ['HIPAA', 'SOX']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'rotating': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEncryptionLevelColor = (level: string) => {
    switch (level) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'files': return FileText;
      case 'communications': return Shield;
      case 'backups': return Lock;
      default: return Key;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilRotation = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const totalKeys = encryptionKeys.length;
  const activeKeys = encryptionKeys.filter(k => k.status === 'active').length;
  const encryptedTargets = encryptionTargets.filter(t => t.encrypted).length;
  const complianceScore = Math.round((encryptedTargets / encryptionTargets.length) * 100);

  return (
    <div className="space-y-6">
      {/* Encryption Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Encryption Management Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalKeys}</div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeKeys}</div>
              <div className="text-sm text-gray-600">Active Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{encryptedTargets}/{encryptionTargets.length}</div>
              <div className="text-sm text-gray-600">Encrypted Targets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{complianceScore}%</div>
              <div className="text-sm text-gray-600">Compliance Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encryption Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Encryption Keys
            </span>
            <Button>
              Generate New Key
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {encryptionKeys.map((key) => (
              <div key={key.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-gray-600">{key.algorithm} | {key.strength}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(key.status)}>
                      {key.status}
                    </Badge>
                    {key.status === 'rotating' && (
                      <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{formatDate(key.created)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Rotation:</span>
                    <span className="ml-2">{formatDate(key.lastRotation)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Next Rotation:</span>
                    <span className="ml-2">{formatDate(key.nextRotation)}</span>
                    <div className="text-xs text-gray-500">
                      {getDaysUntilRotation(key.nextRotation)} days
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Usage:</span>
                    <span className="ml-2">{key.usage}%</span>
                    <Progress value={key.usage} className="w-16 h-2 mt-1" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Rotate Now
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule Rotation
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encryption Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Encryption Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encryptionTargets.map((target) => {
              const IconComponent = getTypeIcon(target.type);
              return (
                <div key={target.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">{target.name}</div>
                        <div className="text-sm text-gray-600">{target.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {target.encrypted ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <Switch checked={target.encrypted} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Encryption Level:</span>
                      <Badge className={getEncryptionLevelColor(target.encryptionLevel)}>
                        {target.encryptionLevel}
                      </Badge>
                    </div>
                    
                    {target.keyId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Key ID:</span>
                        <span className="text-sm font-mono">{target.keyId}</span>
                      </div>
                    )}

                    {target.compliance.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Compliance:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {target.compliance.map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      Test Encryption
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Rotation Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Key Rotation Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {encryptionKeys
              .sort((a, b) => a.nextRotation.getTime() - b.nextRotation.getTime())
              .map((key) => {
                const daysUntil = getDaysUntilRotation(key.nextRotation);
                const isUrgent = daysUntil <= 7;
                
                return (
                  <div key={key.id} className={`p-3 border rounded-lg ${isUrgent ? 'border-orange-300 bg-orange-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className={`h-4 w-4 ${isUrgent ? 'text-orange-600' : 'text-blue-600'}`} />
                        <div>
                          <div className="font-medium">{key.name}</div>
                          <div className="text-sm text-gray-600">
                            Next rotation: {formatDate(key.nextRotation)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${isUrgent ? 'text-orange-600' : 'text-gray-900'}`}>
                          {daysUntil} days
                        </div>
                        {isUrgent && (
                          <div className="text-xs text-orange-600">Action Required</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
