
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FormInput,
  Brain,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

export const IntelligentFormInterface = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    dateOfBirth: '',
    insuranceNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    currentMedications: ''
  });

  const [suggestions, setSuggestions] = useState({
    patientName: [],
    insuranceNumber: ['Format: XXX-XX-XXXX'],
    emergencyContact: ['Use format: Name (Relationship) - Phone'],
    medicalHistory: ['Consider including: allergies, previous surgeries, chronic conditions']
  });

  const [validationResults, setValidationResults] = useState({
    patientName: { valid: null, message: '' },
    dateOfBirth: { valid: null, message: '' },
    insuranceNumber: { valid: null, message: '' },
    emergencyContact: { valid: null, message: '' }
  });

  const formAnalytics = [
    {
      field: 'Patient Name',
      completionRate: 98.2,
      validationErrors: 12,
      autoCompletions: 245
    },
    {
      field: 'Insurance Number',
      completionRate: 89.7,
      validationErrors: 34,
      autoCompletions: 156
    },
    {
      field: 'Emergency Contact',
      completionRate: 94.1,
      validationErrors: 23,
      autoCompletions: 189
    },
    {
      field: 'Medical History',
      completionRate: 87.3,
      validationErrors: 8,
      autoCompletions: 78
    }
  ];

  const recentForms = [
    {
      id: 1,
      type: 'Patient Registration',
      completed: '2024-06-09 14:30',
      processingTime: '2.3 min',
      autoFilledFields: 6,
      validationIssues: 0
    },
    {
      id: 2,
      type: 'Insurance Verification',
      completed: '2024-06-09 14:25',
      processingTime: '1.8 min',
      autoFilledFields: 4,
      validationIssues: 1
    },
    {
      id: 3,
      type: 'Medical History Update',
      completed: '2024-06-09 14:20',
      processingTime: '3.1 min',
      autoFilledFields: 8,
      validationIssues: 0
    }
  ];

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Simulate AI validation
    if (field === 'insuranceNumber') {
      const isValid = /^\d{3}-\d{2}-\d{4}$/.test(value);
      setValidationResults(prev => ({
        ...prev,
        [field]: {
          valid: value ? isValid : null,
          message: value && !isValid ? 'Invalid format. Use XXX-XX-XXXX' : ''
        }
      }));
    }
    
    if (field === 'patientName') {
      const isValid = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
      setValidationResults(prev => ({
        ...prev,
        [field]: {
          valid: value ? isValid : null,
          message: value && !isValid ? 'Name should contain only letters and spaces' : ''
        }
      }));
    }
  };

  const getValidationIcon = (field) => {
    const result = validationResults[field];
    if (result?.valid === true) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (result?.valid === false) return <AlertCircle className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Form Analytics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">324</div>
            <div className="text-sm text-gray-600">Forms Processed Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-600">Auto-completion Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1.8min</div>
            <div className="text-sm text-gray-600">Avg Processing Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">89</div>
            <div className="text-sm text-gray-600">Validation Errors</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Intelligent Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FormInput className="h-5 w-5" />
              Smart Patient Registration Form
              <Badge variant="secondary" className="ml-2">
                <Brain className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Name</label>
              <div className="relative">
                <Input
                  placeholder="Enter patient name..."
                  value={formData.patientName}
                  onChange={(e) => handleFieldChange('patientName', e.target.value)}
                  className={validationResults.patientName?.valid === false ? 'border-red-300' : ''}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon('patientName')}
                </div>
              </div>
              {validationResults.patientName?.message && (
                <div className="text-xs text-red-600">{validationResults.patientName.message}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance Number</label>
              <div className="relative">
                <Input
                  placeholder="XXX-XX-XXXX"
                  value={formData.insuranceNumber}
                  onChange={(e) => handleFieldChange('insuranceNumber', e.target.value)}
                  className={validationResults.insuranceNumber?.valid === false ? 'border-red-300' : ''}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon('insuranceNumber')}
                </div>
              </div>
              {validationResults.insuranceNumber?.message && (
                <div className="text-xs text-red-600">{validationResults.insuranceNumber.message}</div>
              )}
              {suggestions.insuranceNumber.length > 0 && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {suggestions.insuranceNumber[0]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Contact</label>
              <Input
                placeholder="Name (Relationship) - Phone"
                value={formData.emergencyContact}
                onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
              />
              {suggestions.emergencyContact.length > 0 && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {suggestions.emergencyContact[0]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Medical History</label>
              <Textarea
                placeholder="Enter relevant medical history..."
                value={formData.medicalHistory}
                onChange={(e) => handleFieldChange('medicalHistory', e.target.value)}
                className="min-h-20"
              />
              {suggestions.medicalHistory.length > 0 && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {suggestions.medicalHistory[0]}
                </div>
              )}
            </div>

            <Button className="w-full">
              Submit Registration
            </Button>
          </CardContent>
        </Card>

        {/* Form Analytics */}
        <div className="space-y-6">
          {/* Field Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Field Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formAnalytics.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{field.field}</span>
                      <span className="text-green-600">{field.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{field.autoCompletions} auto-completions</span>
                      <span>{field.validationErrors} errors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${field.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Form Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Form Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{form.type}</div>
                      <div className="text-xs text-gray-600">{form.completed}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">{form.processingTime}</div>
                      <div className="text-xs text-gray-600">
                        {form.autoFilledFields} auto-filled • {form.validationIssues} issues
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
