
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

interface EHRProvider {
  id: string;
  name: string;
  logo: string;
  supported: boolean;
  format: string;
}

interface ImportJob {
  id: string;
  provider: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  recordsFound: number;
  recordsImported: number;
  startTime: Date;
}

const ehrProviders: EHRProvider[] = [
  { id: 'epic', name: 'Epic MyChart', logo: '🏥', supported: true, format: 'FHIR R4' },
  { id: 'cerner', name: 'Cerner PowerChart', logo: '⚕️', supported: true, format: 'FHIR R4' },
  { id: 'allscripts', name: 'Allscripts', logo: '📋', supported: true, format: 'CCD' },
  { id: 'athena', name: 'athenahealth', logo: '🔬', supported: true, format: 'FHIR R4' },
  { id: 'nextgen', name: 'NextGen', logo: '💊', supported: false, format: 'Coming Soon' },
  { id: 'ecw', name: 'eClinicalWorks', logo: '🩺', supported: false, format: 'Coming Soon' }
];

export const EHRImportTool = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleProviderImport = async () => {
    if (!selectedProvider) {
      toast.error('Please select an EHR provider');
      return;
    }

    const provider = ehrProviders.find(p => p.id === selectedProvider);
    if (!provider?.supported) {
      toast.error('This provider is not yet supported');
      return;
    }

    const newJob: ImportJob = {
      id: Date.now().toString(),
      provider: provider.name,
      status: 'pending',
      progress: 0,
      recordsFound: 0,
      recordsImported: 0,
      startTime: new Date()
    };

    setImportJobs(prev => [newJob, ...prev]);
    setIsImporting(true);

    // Simulate import process
    const jobId = newJob.id;
    
    // Update to processing
    setTimeout(() => {
      setImportJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'processing', progress: 10, recordsFound: 156 }
          : job
      ));
    }, 1000);

    // Progress updates
    const progressSteps = [25, 50, 75, 90, 100];
    const recordSteps = [39, 78, 117, 140, 156];
    
    progressSteps.forEach((progress, index) => {
      setTimeout(() => {
        setImportJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                progress, 
                recordsImported: recordSteps[index],
                status: progress === 100 ? 'completed' : 'processing'
              }
            : job
        ));
        
        if (progress === 100) {
          setIsImporting(false);
          toast.success(`Successfully imported ${recordSteps[index]} records from ${provider.name}`);
        }
      }, (index + 2) * 1500);
    });
  };

  const handleFileImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xml,.json,.pdf,.ccd,.ccda';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast.success(`Processing ${files.length} file(s) for import`);
        
        // Simulate file processing
        const newJob: ImportJob = {
          id: Date.now().toString(),
          provider: 'File Upload',
          status: 'processing',
          progress: 0,
          recordsFound: files.length * 3,
          recordsImported: 0,
          startTime: new Date()
        };
        
        setImportJobs(prev => [newJob, ...prev]);
        
        // Simulate processing
        setTimeout(() => {
          setImportJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, status: 'completed', progress: 100, recordsImported: files.length * 3 }
              : job
          ));
          toast.success(`Successfully imported ${files.length * 3} records from uploaded files`);
        }, 3000);
      }
    };
    
    input.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            EHR Import Tool
          </CardTitle>
          <CardDescription>
            Import your medical records from external Electronic Health Record systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select EHR Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your healthcare provider's EHR system" />
                </SelectTrigger>
                <SelectContent>
                  {ehrProviders.map((provider) => (
                    <SelectItem 
                      key={provider.id} 
                      value={provider.id}
                      disabled={!provider.supported}
                    >
                      <div className="flex items-center gap-2">
                        <span>{provider.logo}</span>
                        <span>{provider.name}</span>
                        <Badge variant={provider.supported ? 'default' : 'secondary'} className="ml-auto">
                          {provider.format}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleProviderImport}
                disabled={isImporting || !selectedProvider}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Connect & Import
              </Button>
              <Button 
                onClick={handleFileImport}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Supported Formats</h4>
            <div className="flex flex-wrap gap-2">
              {['FHIR R4', 'CCD', 'CCDA', 'HL7', 'PDF', 'DICOM'].map((format) => (
                <Badge key={format} variant="secondary" className="bg-blue-100 text-blue-800">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      {importJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>Track your record import jobs and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">{job.provider}</span>
                      <Badge variant="secondary" className={getStatusColor(job.status)}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">
                      {job.startTime.toLocaleString()}
                    </span>
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {job.recordsImported} of {job.recordsFound} records imported
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
