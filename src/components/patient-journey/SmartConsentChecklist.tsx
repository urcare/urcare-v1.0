
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, User, Clock, Shield, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  category: 'treatment' | 'privacy' | 'research' | 'financial' | 'emergency';
  signed: boolean;
  signedBy?: string;
  signedAt?: string;
}

interface ConsentForm {
  id: string;
  patientId: string;
  patientName: string;
  procedureType: string;
  status: 'draft' | 'pending' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
  items: ConsentItem[];
}

const mockConsentForms: ConsentForm[] = [
  {
    id: 'CF001',
    patientId: 'P001',
    patientName: 'John Smith',
    procedureType: 'Cardiac Catheterization',
    status: 'pending',
    createdAt: '2024-01-15',
    items: [
      {
        id: 'CI001',
        title: 'Treatment Consent',
        description: 'I consent to the cardiac catheterization procedure as explained by my doctor',
        required: true,
        category: 'treatment',
        signed: false
      },
      {
        id: 'CI002',
        title: 'Anesthesia Consent',
        description: 'I consent to the administration of anesthesia during the procedure',
        required: true,
        category: 'treatment',
        signed: false
      },
      {
        id: 'CI003',
        title: 'Privacy Agreement',
        description: 'I acknowledge the privacy practices and data handling policies',
        required: true,
        category: 'privacy',
        signed: true,
        signedBy: 'John Smith',
        signedAt: '2024-01-15 10:30 AM'
      },
      {
        id: 'CI004',
        title: 'Financial Responsibility',
        description: 'I understand my financial responsibility for this procedure',
        required: true,
        category: 'financial',
        signed: false
      },
      {
        id: 'CI005',
        title: 'Research Participation',
        description: 'Optional participation in anonymous research data collection',
        required: false,
        category: 'research',
        signed: false
      }
    ]
  },
  {
    id: 'CF002',
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    procedureType: 'MRI Scan',
    status: 'completed',
    createdAt: '2024-01-14',
    completedAt: '2024-01-14 02:45 PM',
    items: [
      {
        id: 'CI006',
        title: 'MRI Safety Screening',
        description: 'I have completed the MRI safety questionnaire and disclosed all relevant information',
        required: true,
        category: 'treatment',
        signed: true,
        signedBy: 'Sarah Johnson',
        signedAt: '2024-01-14 02:30 PM'
      },
      {
        id: 'CI007',
        title: 'Contrast Agent Consent',
        description: 'I consent to the use of contrast agent if deemed necessary',
        required: true,
        category: 'treatment',
        signed: true,
        signedBy: 'Sarah Johnson',
        signedAt: '2024-01-14 02:32 PM'
      }
    ]
  }
];

export const SmartConsentChecklist = () => {
  const [consentForms, setConsentForms] = useState<ConsentForm[]>(mockConsentForms);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState('');

  const handleSignItem = (formId: string, itemId: string) => {
    if (!digitalSignature.trim()) {
      toast.error('Please enter your digital signature');
      return;
    }

    setConsentForms(prev => prev.map(form => 
      form.id === formId 
        ? {
            ...form,
            items: form.items.map(item => 
              item.id === itemId 
                ? {
                    ...item,
                    signed: true,
                    signedBy: digitalSignature,
                    signedAt: new Date().toLocaleString()
                  }
                : item
            )
          }
        : form
    ));

    toast.success('Consent item signed successfully');
    setDigitalSignature('');
  };

  const handleCompleteForm = (formId: string) => {
    const form = consentForms.find(f => f.id === formId);
    if (!form) return;

    const requiredItems = form.items.filter(item => item.required);
    const signedRequiredItems = requiredItems.filter(item => item.signed);

    if (signedRequiredItems.length !== requiredItems.length) {
      toast.error('Please sign all required consent items before completing');
      return;
    }

    setConsentForms(prev => prev.map(f => 
      f.id === formId 
        ? {
            ...f,
            status: 'completed',
            completedAt: new Date().toLocaleString()
          }
        : f
    ));

    toast.success('Consent form completed successfully');
    setSelectedForm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'treatment': return 'bg-blue-100 text-blue-800';
      case 'privacy': return 'bg-purple-100 text-purple-800';
      case 'research': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Smart Consent Checklist
          </CardTitle>
          <CardDescription>
            Digital consent management with smart checklists and electronic signatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consentForms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{form.patientName}</h3>
                    <Badge variant="outline">{form.patientId}</Badge>
                    <Badge variant="outline">{form.procedureType}</Badge>
                  </div>
                  <Badge className={getStatusColor(form.status)}>
                    {form.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Created: {form.createdAt}</span>
                  </div>
                  {form.completedAt && (
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Completed: {form.completedAt}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      {form.items.filter(item => item.signed).length} / {form.items.length} signed
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {form.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={item.signed}
                            disabled={item.signed}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            {item.required && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                      {item.signed ? (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          ✓ Signed by {item.signedBy} on {item.signedAt}
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Enter your full name as digital signature"
                            value={digitalSignature}
                            onChange={(e) => setDigitalSignature(e.target.value)}
                            className="flex-1 text-sm border rounded px-2 py-1"
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleSignItem(form.id, item.id)}
                            disabled={!digitalSignature.trim()}
                          >
                            Sign
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {form.status === 'pending' && (
                    <Button 
                      onClick={() => handleCompleteForm(form.id)}
                      disabled={form.items.filter(item => item.required && !item.signed).length > 0}
                    >
                      Complete Form
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  
                  {form.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Consent Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Patient</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P001">P001 - John Smith</SelectItem>
                  <SelectItem value="P002">P002 - Sarah Johnson</SelectItem>
                  <SelectItem value="P003">P003 - Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Procedure Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select procedure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="scan">Imaging/Scan</SelectItem>
                  <SelectItem value="procedure">Minor Procedure</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              Create Consent Form
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consent Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Completed Forms:</span>
                <span className="font-medium text-green-600">
                  {consentForms.filter(form => form.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pending Forms:</span>
                <span className="font-medium text-yellow-600">
                  {consentForms.filter(form => form.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Items Signed:</span>
                <span className="font-medium">
                  {consentForms.reduce((total, form) => 
                    total + form.items.filter(item => item.signed).length, 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
