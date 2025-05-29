
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, User, Clock, CheckCircle, AlertCircle, X, Download, Eye } from 'lucide-react';

interface ConsentForm {
  id: string;
  type: 'treatment' | 'surgery' | 'anesthesia' | 'discharge' | 'research' | 'photography';
  name: string;
  required: boolean;
  status: 'pending' | 'signed' | 'declined' | 'expired' | 'revoked';
  signedDate?: string;
  signedBy?: string;
  expiryDate?: string;
  digitalSignature?: string;
  witnessRequired: boolean;
  witnessSignature?: string;
}

interface PatientConsent {
  patientId: string;
  patientName: string;
  bedNumber: string;
  ward: string;
  admissionDate: string;
  forms: ConsentForm[];
  overallProgress: number;
  guardianRequired: boolean;
  guardianName?: string;
  guardianContact?: string;
}

const mockConsents: PatientConsent[] = [
  {
    patientId: 'W001',
    patientName: 'John Smith',
    bedNumber: 'A-101',
    ward: 'General Ward A',
    admissionDate: '2024-01-15',
    guardianRequired: false,
    overallProgress: 85,
    forms: [
      {
        id: 'CF001',
        type: 'treatment',
        name: 'General Treatment Consent',
        required: true,
        status: 'signed',
        signedDate: '2024-01-15 10:30',
        signedBy: 'John Smith',
        digitalSignature: 'e-signature-123',
        witnessRequired: false
      },
      {
        id: 'CF002',
        type: 'anesthesia',
        name: 'Anesthesia Consent Form',
        required: true,
        status: 'signed',
        signedDate: '2024-01-15 11:00',
        signedBy: 'John Smith',
        digitalSignature: 'e-signature-124',
        witnessRequired: true,
        witnessSignature: 'Dr. Johnson'
      },
      {
        id: 'CF003',
        type: 'photography',
        name: 'Medical Photography Consent',
        required: false,
        status: 'declined',
        signedDate: '2024-01-15 11:15',
        signedBy: 'John Smith',
        witnessRequired: false
      },
      {
        id: 'CF004',
        type: 'discharge',
        name: 'Discharge Instructions Acknowledgment',
        required: true,
        status: 'pending',
        witnessRequired: false
      }
    ]
  },
  {
    patientId: 'W002',
    patientName: 'Sarah Wilson',
    bedNumber: 'B-203',
    ward: 'ICU',
    admissionDate: '2024-01-20',
    guardianRequired: false,
    overallProgress: 60,
    forms: [
      {
        id: 'CF005',
        type: 'treatment',
        name: 'Emergency Treatment Consent',
        required: true,
        status: 'signed',
        signedDate: '2024-01-20 14:00',
        signedBy: 'Sarah Wilson',
        digitalSignature: 'e-signature-125',
        witnessRequired: true,
        witnessSignature: 'Dr. Brown'
      },
      {
        id: 'CF006',
        type: 'surgery',
        name: 'Cardiac Procedure Consent',
        required: true,
        status: 'pending',
        witnessRequired: true
      },
      {
        id: 'CF007',
        type: 'research',
        name: 'Clinical Research Participation',
        required: false,
        status: 'pending',
        witnessRequired: false
      }
    ]
  }
];

export const ConsentStatusVisualizer = () => {
  const [consents, setConsents] = useState<PatientConsent[]>(mockConsents);
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'revoked': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'treatment': return 'bg-blue-100 text-blue-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'anesthesia': return 'bg-purple-100 text-purple-800';
      case 'discharge': return 'bg-green-100 text-green-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      case 'photography': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined': return <X className="h-4 w-4 text-red-500" />;
      case 'expired': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'revoked': return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const updateFormStatus = (patientId: string, formId: string, newStatus: string) => {
    setConsents(prev => prev.map(patient => {
      if (patient.patientId === patientId) {
        const updatedForms = patient.forms.map(form => {
          if (form.id === formId) {
            const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
            return {
              ...form,
              status: newStatus as any,
              signedDate: newStatus === 'signed' ? now : form.signedDate,
              signedBy: newStatus === 'signed' ? patient.patientName : form.signedBy,
              digitalSignature: newStatus === 'signed' ? `e-signature-${Date.now()}` : form.digitalSignature
            };
          }
          return form;
        });
        
        const requiredForms = updatedForms.filter(form => form.required);
        const signedRequired = requiredForms.filter(form => form.status === 'signed');
        const progress = Math.round((signedRequired.length / requiredForms.length) * 100);
        
        return {
          ...patient,
          forms: updatedForms,
          overallProgress: progress
        };
      }
      return patient;
    }));
  };

  const filteredConsents = consents.filter(patient => {
    const wardMatch = filterWard === 'all' || patient.ward === filterWard;
    const statusMatch = filterStatus === 'all' || 
      patient.forms.some(form => form.status === filterStatus);
    return wardMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Consent Status Visualizer
          </CardTitle>
          <CardDescription>
            Monitor and manage digital consent forms for all patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                <SelectItem value="General Ward A">General Ward A</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <FileCheck className="h-4 w-4 mr-1" />
                Audit Trail
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredConsents.map((patient) => (
              <Card key={patient.patientId} className="border-l-4 border-l-cyan-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.patientName}</CardTitle>
                      <CardDescription>
                        {patient.bedNumber} • {patient.ward} • Admitted: {patient.admissionDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={patient.overallProgress === 100 ? "default" : "secondary"}>
                        {patient.overallProgress}% Complete
                      </Badge>
                      <Progress value={patient.overallProgress} className="w-32 mt-2" />
                    </div>
                  </div>
                  {patient.guardianRequired && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Guardian Required:</strong> {patient.guardianName} ({patient.guardianContact})
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.forms.map((form) => (
                      <div 
                        key={form.id}
                        className={`p-4 border rounded-lg ${
                          form.status === 'signed' ? 'bg-green-50 border-green-200' :
                          form.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                          form.status === 'declined' ? 'bg-red-50 border-red-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(form.status)}
                            <h4 className="font-medium">{form.name}</h4>
                            <Badge className={getTypeColor(form.type)}>
                              {form.type.toUpperCase()}
                            </Badge>
                            {form.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <Badge className={getStatusColor(form.status)}>
                            {form.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {form.signedDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Signed: {form.signedDate}</span>
                            </div>
                          )}
                          {form.signedBy && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>By: {form.signedBy}</span>
                            </div>
                          )}
                          {form.digitalSignature && (
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-gray-500" />
                              <span>ID: {form.digitalSignature}</span>
                            </div>
                          )}
                        </div>

                        {form.witnessRequired && (
                          <div className="mt-3 p-2 bg-blue-50 rounded">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Witness Required</span>
                              {form.witnessSignature ? (
                                <span className="text-sm text-green-600">
                                  ✓ Witnessed by: {form.witnessSignature}
                                </span>
                              ) : (
                                <span className="text-sm text-red-600">⚠ Pending witness</span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-3">
                          {form.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateFormStatus(patient.patientId, form.id, 'signed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Signed
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateFormStatus(patient.patientId, form.id, 'declined')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Mark Declined
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consent Overview Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Forms', value: consents.reduce((sum, p) => sum + p.forms.length, 0), icon: FileCheck, color: 'text-blue-500' },
              { label: 'Signed', value: consents.reduce((sum, p) => sum + p.forms.filter(f => f.status === 'signed').length, 0), icon: CheckCircle, color: 'text-green-500' },
              { label: 'Pending', value: consents.reduce((sum, p) => sum + p.forms.filter(f => f.status === 'pending').length, 0), icon: Clock, color: 'text-yellow-500' },
              { label: 'Declined', value: consents.reduce((sum, p) => sum + p.forms.filter(f => f.status === 'declined').length, 0), icon: X, color: 'text-red-500' },
              { label: 'Compliance', value: `${Math.round(consents.reduce((sum, p) => sum + p.overallProgress, 0) / consents.length)}%`, icon: FileCheck, color: 'text-purple-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <stat.icon className={`h-8 w-8 mx-auto ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
