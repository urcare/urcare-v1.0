
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSignature, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Send,
  Download,
  History,
  Key,
  AlertTriangle
} from 'lucide-react';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'signed' | 'declined' | 'viewed';
  signedAt?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface SignatureRequest {
  id: string;
  documentName: string;
  documentType: string;
  status: 'draft' | 'sent' | 'in-progress' | 'completed' | 'expired';
  createdAt: string;
  expiresAt: string;
  signers: Signer[];
  progress: number;
  requiresWitness: boolean;
  authenticationType: 'email' | 'sms' | 'id-verification';
}

export const ElectronicSignature = () => {
  const [activeTab, setActiveTab] = useState('requests');

  const signatureRequests: SignatureRequest[] = [
    {
      id: 'sig-1',
      documentName: 'Patient Consent Form - Surgery',
      documentType: 'Medical Consent',
      status: 'in-progress',
      createdAt: '2024-01-20',
      expiresAt: '2024-01-27',
      progress: 67,
      requiresWitness: true,
      authenticationType: 'id-verification',
      signers: [
        { id: 's1', name: 'John Doe', email: 'john@email.com', role: 'Patient', status: 'signed', signedAt: '2024-01-21 10:30', ipAddress: '192.168.1.1', deviceInfo: 'Chrome/Windows' },
        { id: 's2', name: 'Dr. Smith', email: 'dr.smith@hospital.com', role: 'Physician', status: 'signed', signedAt: '2024-01-21 14:15', ipAddress: '10.0.0.5', deviceInfo: 'Safari/macOS' },
        { id: 's3', name: 'Witness - Nurse Johnson', email: 'nurse.j@hospital.com', role: 'Witness', status: 'pending' }
      ]
    },
    {
      id: 'sig-2',
      documentName: 'Discharge Instructions - Jane Smith',
      documentType: 'Discharge Summary',
      status: 'sent',
      createdAt: '2024-01-22',
      expiresAt: '2024-01-29',
      progress: 0,
      requiresWitness: false,
      authenticationType: 'email',
      signers: [
        { id: 's1', name: 'Jane Smith', email: 'jane@email.com', role: 'Patient', status: 'pending' },
        { id: 's2', name: 'Dr. Williams', email: 'dr.williams@hospital.com', role: 'Attending Physician', status: 'pending' }
      ]
    }
  ];

  const signatureTemplates = [
    { id: 't1', name: 'Standard Medical Consent', signers: 2, avgTime: '24 hours' },
    { id: 't2', name: 'Surgery Authorization', signers: 3, avgTime: '48 hours' },
    { id: 't3', name: 'Discharge Instructions', signers: 2, avgTime: '12 hours' },
    { id: 't4', name: 'Treatment Plan Agreement', signers: 2, avgTime: '36 hours' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return CheckCircle;
      case 'pending': return Clock;
      case 'declined': return XCircle;
      case 'viewed': return Eye;
      default: return FileSignature;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Electronic Signature Management</h2>
          <p className="text-gray-600">Secure multi-party document signing with PKI authentication</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Certificate Status
          </Button>
          <Button className="flex items-center gap-2">
            <FileSignature className="h-4 w-4" />
            New Signature Request
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Signature Requests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="validation">Signature Validation</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="space-y-4">
            {signatureRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{request.documentName}</h3>
                        <p className="text-sm text-gray-600">{request.documentType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.requiresWitness && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Witness Required
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} className="h-2" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Created: {request.createdAt}</p>
                        <p className="text-gray-600">Expires: {request.expiresAt}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Authentication: {request.authenticationType}</p>
                        <p className="text-gray-600">Signers: {request.signers.length}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Signers Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {request.signers.map(signer => {
                          const StatusIcon = getStatusIcon(signer.status);
                          return (
                            <div key={signer.id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{signer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{signer.name}</p>
                                  <p className="text-xs text-gray-600">{signer.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(signer.status)} variant="secondary">
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {signer.status}
                                </Badge>
                                {signer.signedAt && (
                                  <span className="text-xs text-gray-500">{signer.signedAt}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View Document
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Send className="h-3 w-3" />
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <History className="h-3 w-3" />
                        Audit Trail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FileSignature className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{template.signers} signers</Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">Avg completion: {template.avgTime}</p>
                    </div>
                    <Button size="sm" className="w-full">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Signature Validation & PKI Status
                </CardTitle>
                <CardDescription>Verify signature authenticity and certificate status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Validate Signature</h4>
                    <div className="space-y-3">
                      <Input placeholder="Enter document ID or upload file" />
                      <Button className="w-full flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Validate Signatures
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Certificate Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Root Certificate</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Signing Certificate</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">Timestamp Authority</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Expires Soon</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Signature Audit Trail</CardTitle>
              <CardDescription>Complete history of signature events and authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2024-01-21 14:15:32', event: 'Document Signed', user: 'Dr. Smith', ip: '10.0.0.5', details: 'Electronic signature applied with certificate validation' },
                  { time: '2024-01-21 10:30:15', event: 'Document Signed', user: 'John Doe', ip: '192.168.1.1', details: 'Patient signature with ID verification' },
                  { time: '2024-01-21 09:45:22', event: 'Document Viewed', user: 'John Doe', ip: '192.168.1.1', details: 'Document accessed for review' },
                  { time: '2024-01-20 16:30:00', event: 'Signature Request Sent', user: 'System', ip: 'N/A', details: 'Initial signature request sent to all parties' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border-l-2 border-blue-200 bg-blue-50">
                    <div className="text-xs text-gray-600 min-w-[120px]">{entry.time}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entry.event}</p>
                      <p className="text-xs text-gray-600">{entry.details}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>{entry.user}</p>
                      <p>{entry.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
