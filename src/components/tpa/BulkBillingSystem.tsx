
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Upload, 
  Download, 
  FileText,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface BulkBatch {
  id: string;
  clientName: string;
  eventType: 'camp' | 'corporate' | 'screening';
  patientCount: number;
  totalAmount: number;
  status: 'draft' | 'processing' | 'approved' | 'billed';
  createdDate: string;
  discount: number;
}

interface CorporateClient {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  discountRate: number;
  paymentTerms: string;
  activeEmployees: number;
}

export const BulkBillingSystem = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const bulkBatches: BulkBatch[] = [
    {
      id: 'BB001',
      clientName: 'TechCorp Industries',
      eventType: 'corporate',
      patientCount: 150,
      totalAmount: 225000,
      status: 'approved',
      createdDate: '2024-06-01',
      discount: 15
    },
    {
      id: 'BB002',
      clientName: 'Health Camp - Village A',
      eventType: 'camp',
      patientCount: 85,
      totalAmount: 127500,
      status: 'processing',
      createdDate: '2024-06-03',
      discount: 20
    }
  ];

  const corporateClients: CorporateClient[] = [
    {
      id: 'CC001',
      name: 'TechCorp Industries',
      contactPerson: 'John Manager',
      email: 'billing@techcorp.com',
      discountRate: 15,
      paymentTerms: '30 days',
      activeEmployees: 500
    },
    {
      id: 'CC002',
      name: 'Manufacturing Ltd.',
      contactPerson: 'Sarah Admin',
      email: 'accounts@manufacturing.com',
      discountRate: 12,
      paymentTerms: '45 days',
      activeEmployees: 300
    }
  ];

  const billingTemplates = [
    { name: 'Executive Health Checkup', basePrice: 2500, category: 'Preventive' },
    { name: 'Basic Health Screening', basePrice: 800, category: 'Screening' },
    { name: 'Cardiac Wellness Package', basePrice: 3500, category: 'Cardiac' },
    { name: 'Diabetes Management', basePrice: 1200, category: 'Chronic Care' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
      processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      billed: { label: 'Billed', className: 'bg-purple-100 text-purple-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const totalProcessingAmount = bulkBatches
    .filter(batch => batch.status === 'processing')
    .reduce((sum, batch) => sum + batch.totalAmount, 0);

  const totalProcessingPatients = bulkBatches
    .filter(batch => batch.status === 'processing')
    .reduce((sum, batch) => sum + batch.patientCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Billing System</h2>
          <p className="text-gray-600">Manage corporate clients and bulk billing for camps & events</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Users className="w-4 h-4 mr-2" />
          New Bulk Batch
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-3xl font-bold text-blue-600">{bulkBatches.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Patients</p>
                <p className="text-3xl font-bold text-amber-600">{totalProcessingPatients}</p>
              </div>
              <Users className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Amount</p>
                <p className="text-3xl font-bold text-green-600">₹{totalProcessingAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corporate Clients</p>
                <p className="text-3xl font-bold text-purple-600">{corporateClients.length}</p>
              </div>
              <Building2 className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Patient Registration
          </CardTitle>
          <CardDescription>Upload CSV/Excel file with patient data for bulk processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload patient list for bulk billing</p>
              <p className="text-sm text-gray-500 mb-4">Supports CSV, Excel (.xlsx) files up to 10MB</p>
              
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label htmlFor="bulk-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button variant="outline">
                Validate Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Active Bulk Batches</CardTitle>
          <CardDescription>Monitor and manage bulk billing batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {batch.eventType === 'corporate' ? (
                      <Building2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Users className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{batch.id} - {batch.clientName}</h3>
                    <p className="text-sm text-gray-600">
                      {batch.eventType.charAt(0).toUpperCase() + batch.eventType.slice(1)} • 
                      Created: {batch.createdDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Patients</p>
                    <p className="font-semibold">{batch.patientCount}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">₹{batch.totalAmount.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="font-semibold text-green-600">{batch.discount}%</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(batch.status)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {batch.status === 'approved' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Generate Bills
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Corporate Clients & Billing Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Corporate Clients
            </CardTitle>
            <CardDescription>Manage corporate client master data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {corporateClients.map((client) => (
                <div key={client.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.contactPerson}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{client.discountRate}% discount</p>
                      <p className="text-xs text-gray-500">{client.paymentTerms}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{client.activeEmployees} active employees</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Add New Corporate Client
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Billing Templates
            </CardTitle>
            <CardDescription>Pre-configured billing packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{template.basePrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Base Price</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Create New Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
