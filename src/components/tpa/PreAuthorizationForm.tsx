
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign,
  Upload,
  Save,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PreAuthForm {
  patientId: string;
  patientName: string;
  policyNumber: string;
  tpaName: string;
  diagnosis: string;
  treatmentCode: string;
  estimatedCost: number;
  doctorName: string;
  plannedDate: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

export const PreAuthorizationForm = () => {
  const [formProgress, setFormProgress] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<PreAuthForm>({
    defaultValues: {
      patientId: '',
      patientName: '',
      policyNumber: '',
      tpaName: '',
      diagnosis: '',
      treatmentCode: '',
      estimatedCost: 0,
      doctorName: '',
      plannedDate: '',
      urgency: 'routine'
    }
  });

  const watchedFields = form.watch();

  // Calculate form completion progress
  useEffect(() => {
    const fields = Object.values(watchedFields);
    const filledFields = fields.filter(field => field !== '' && field !== 0).length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
  }, [watchedFields]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formProgress > 0) {
        setAutoSaveStatus('saving');
        // Simulate save operation
        setTimeout(() => {
          setAutoSaveStatus('saved');
        }, 1000);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [watchedFields, formProgress]);

  // Treatment code database simulation
  const treatmentCodes = [
    { code: 'CARD001', description: 'Cardiac Catheterization', estimatedCost: 25000 },
    { code: 'ORTH001', description: 'Knee Replacement Surgery', estimatedCost: 150000 },
    { code: 'NEUR001', description: 'Brain MRI with Contrast', estimatedCost: 8000 },
    { code: 'GAST001', description: 'Endoscopy Procedure', estimatedCost: 5000 }
  ];

  const tpaList = [
    'Star Health Insurance',
    'ICICI Lombard',
    'HDFC Ergo',
    'Bajaj Allianz',
    'New India Assurance',
    'Oriental Insurance'
  ];

  const handlePatientSearch = (patientId: string) => {
    // Simulate patient data fetch
    if (patientId === 'PAT001') {
      form.setValue('patientName', 'John Doe');
      form.setValue('policyNumber', 'POL123456789');
      form.setValue('tpaName', 'Star Health Insurance');
    }
  };

  const handleTreatmentCodeSelect = (code: string) => {
    const treatment = treatmentCodes.find(t => t.code === code);
    if (treatment) {
      form.setValue('treatmentCode', code);
      form.setValue('estimatedCost', treatment.estimatedCost);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const onSubmit = (data: PreAuthForm) => {
    console.log('Pre-authorization form submitted:', data);
    // Handle form submission
  };

  const requiredFields = ['patientId', 'diagnosis', 'treatmentCode', 'plannedDate'];
  const completedRequiredFields = requiredFields.filter(field => 
    watchedFields[field as keyof PreAuthForm] !== ''
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pre-Authorization Form</h2>
          <p className="text-gray-600">Intelligent form filling with auto-population and validation</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {autoSaveStatus === 'saved' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {autoSaveStatus === 'saving' && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
            {autoSaveStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm text-gray-600">
              {autoSaveStatus === 'saved' && 'Auto-saved'}
              {autoSaveStatus === 'saving' && 'Saving...'}
              {autoSaveStatus === 'error' && 'Save failed'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Form Completion</h3>
            <span className="text-sm text-gray-600">{Math.round(formProgress)}% complete</span>
          </div>
          <Progress value={formProgress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Required fields completed: {completedRequiredFields}/{requiredFields.length}
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter Patient ID"
                          onChange={(e) => {
                            field.onChange(e);
                            handlePatientSearch(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Auto-filled from patient ID" readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Auto-filled from patient record" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tpaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TPA Name</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select TPA</option>
                          {tpaList.map(tpa => (
                            <option key={tpa} value={tpa}>{tpa}</option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Treatment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Treatment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter primary diagnosis" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Code *</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          onChange={(e) => handleTreatmentCodeSelect(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select Treatment Code</option>
                          {treatmentCodes.map(code => (
                            <option key={code.code} value={code.code}>
                              {code.code} - {code.description}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Cost (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Auto-calculated from treatment code"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plannedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planned Treatment Date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full p-2 border rounded-md">
                          <option value="routine">Routine</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* File Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Supporting Documents
              </CardTitle>
              <CardDescription>
                Upload medical reports, prescriptions, and other supporting documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Attached Files:</h4>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Preview
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Submit Pre-Authorization
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
