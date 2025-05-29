
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Lock, Unlock, AlertTriangle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface ConsentRecord {
  id: string;
  type: 'medical' | 'financial' | 'legal' | 'family';
  title: string;
  description: string;
  grantor: string;
  grantee: string;
  permissions: string[];
  conditions: string[];
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  activationCode?: string;
}

export const CrisisConsentUnlock = () => {
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([
    {
      id: '1',
      type: 'medical',
      title: 'Emergency Medical Decisions',
      description: 'Authorization for spouse to make medical decisions during emergencies',
      grantor: 'John Smith',
      grantee: 'Jane Smith (Spouse)',
      permissions: ['Medical decisions', 'Treatment authorization', 'Hospital access'],
      conditions: ['Life-threatening emergency', 'Patient unconscious', 'Unable to consent'],
      isActive: false
    },
    {
      id: '2',
      type: 'financial',
      title: 'Emergency Financial Access',
      description: 'Limited financial access for emergency expenses',
      grantor: 'John Smith',
      grantee: 'Robert Smith (Brother)',
      permissions: ['Medical expense payments', 'Emergency fund access', 'Insurance claims'],
      conditions: ['Hospitalization > 48 hours', 'Patient incapacitated'],
      isActive: false
    },
    {
      id: '3',
      type: 'family',
      title: 'Child Care Authorization',
      description: 'Emergency childcare and decision making for minors',
      grantor: 'John Smith',
      grantee: 'Mary Johnson (Sister)',
      permissions: ['Child custody', 'Medical decisions for children', 'School authorization'],
      conditions: ['Both parents unavailable', 'Emergency situation'],
      isActive: false
    }
  ]);

  const [activationCode, setActivationCode] = useState('');
  const [witnessInfo, setWitnessInfo] = useState({ name: '', title: '', location: '' });
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const getTypeColor = (type: ConsentRecord['type']) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-blue-100 text-blue-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateActivationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const activateConsent = (recordId: string) => {
    const code = generateActivationCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    setConsentRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            isActive: true, 
            activatedAt: now, 
            expiresAt, 
            activationCode: code 
          }
        : record
    ));

    toast.success(`Consent activated with code: ${code}`, {
      duration: 10000
    });
  };

  const deactivateConsent = (recordId: string) => {
    setConsentRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            isActive: false, 
            activatedAt: undefined, 
            expiresAt: undefined, 
            activationCode: undefined 
          }
        : record
    ));

    toast.success('Consent deactivated');
  };

  const validateWitness = () => {
    if (!witnessInfo.name || !witnessInfo.title || !witnessInfo.location) {
      toast.error('Please provide complete witness information');
      return false;
    }
    return true;
  };

  const emergencyActivateAll = () => {
    if (!validateWitness()) return;

    const activatedCodes: string[] = [];
    
    setConsentRecords(prev => prev.map(record => {
      const code = generateActivationCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      
      activatedCodes.push(`${record.title}: ${code}`);
      
      return {
        ...record,
        isActive: true,
        activatedAt: now,
        expiresAt,
        activationCode: code
      };
    }));

    toast.success('All emergency consents activated!', {
      duration: 15000
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-6 w-6" />
            Crisis Consent Unlock System
          </CardTitle>
          <CardDescription className="text-orange-700">
            Emergency authorization system for critical situations when normal consent isn't possible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded border">
            <h4 className="font-medium mb-3">Emergency Witness Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Witness Name</label>
                <Input
                  value={witnessInfo.name}
                  onChange={(e) => setWitnessInfo(prev => ({...prev, name: e.target.value}))}
                  placeholder="Dr. Smith, Nurse Johnson, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title/Role</label>
                <Input
                  value={witnessInfo.title}
                  onChange={(e) => setWitnessInfo(prev => ({...prev, title: e.target.value}))}
                  placeholder="ER Doctor, Paramedic, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={witnessInfo.location}
                  onChange={(e) => setWitnessInfo(prev => ({...prev, location: e.target.value}))}
                  placeholder="City General Hospital ER"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={emergencyActivateAll}
            className="w-full bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            EMERGENCY: Activate All Consents
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {consentRecords.map((record) => (
          <Card key={record.id} className={`border-l-4 ${record.isActive ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <Badge className={getTypeColor(record.type)}>
                      {record.type}
                    </Badge>
                    {record.isActive && (
                      <Badge className="bg-green-100 text-green-800">
                        <Unlock className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{record.description}</CardDescription>
                </div>
                
                {record.isActive ? (
                  <Button
                    onClick={() => deactivateConsent(record.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    onClick={() => activateConsent(record.id)}
                    variant="default"
                    size="sm"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Grantor → Grantee</h5>
                  <p className="text-sm text-gray-600">
                    <User className="h-4 w-4 inline mr-1" />
                    {record.grantor} → {record.grantee}
                  </p>
                </div>
                
                {record.isActive && record.activationCode && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Activation Code</h5>
                    <div className="font-mono text-lg bg-yellow-100 p-2 rounded border">
                      {record.activationCode}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Authorized Permissions</h5>
                <div className="flex flex-wrap gap-2">
                  {record.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Activation Conditions</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {record.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {record.isActive && record.activatedAt && record.expiresAt && (
                <div className="p-3 bg-green-100 rounded border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Active Status</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    <p>Activated: {record.activatedAt.toLocaleString()}</p>
                    <p>Expires: {record.expiresAt.toLocaleString()}</p>
                    <p className="font-medium">
                      Time Remaining: {Math.ceil((record.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">Important Legal Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Emergency consent activation requires proper witness verification</li>
            <li>• All activations are logged and time-stamped for legal compliance</li>
            <li>• Consent automatically expires after 72 hours unless renewed</li>
            <li>• Misuse of emergency consent system may result in legal consequences</li>
            <li>• This system supplements, but does not replace, legal documentation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
