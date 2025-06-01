
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download,
  Mail,
  Printer,
  Eye,
  DollarSign,
  Calendar,
  Building,
  User
} from 'lucide-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  department: string;
  format: 'Standard' | 'Detailed' | 'Summary';
  taxCompliance: string[];
  currency: string;
}

interface InvoiceData {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  doctor: string;
  services: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    taxRate: number;
  }>;
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentTerms: string;
  dueDate: string;
  currency: string;
}

export const AutoInvoiceBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({
    currency: 'USD',
    paymentTerms: 'Due upon receipt'
  });

  const templates: InvoiceTemplate[] = [
    {
      id: 'TMPL001',
      name: 'OPD Standard Invoice',
      department: 'Outpatient',
      format: 'Standard',
      taxCompliance: ['GST', 'VAT'],
      currency: 'USD'
    },
    {
      id: 'TMPL002',
      name: 'IPD Detailed Invoice',
      department: 'Inpatient',
      format: 'Detailed',
      taxCompliance: ['GST', 'VAT', 'Service Tax'],
      currency: 'USD'
    },
    {
      id: 'TMPL003',
      name: 'Laboratory Summary',
      department: 'Laboratory',
      format: 'Summary',
      taxCompliance: ['GST'],
      currency: 'USD'
    },
    {
      id: 'TMPL004',
      name: 'International Patient',
      department: 'All',
      format: 'Detailed',
      taxCompliance: ['Export Invoice'],
      currency: 'USD'
    }
  ];

  const sampleInvoices: InvoiceData[] = [
    {
      id: 'INV001',
      patientName: 'John Doe',
      patientId: 'REG001234',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      services: [
        { description: 'Consultation Fee', quantity: 1, rate: 50.00, amount: 50.00, taxRate: 0.18 },
        { description: 'ECG', quantity: 1, rate: 25.00, amount: 25.00, taxRate: 0.18 },
        { description: 'Echo Cardiogram', quantity: 1, rate: 100.00, amount: 100.00, taxRate: 0.18 }
      ],
      subtotal: 175.00,
      taxAmount: 31.50,
      total: 206.50,
      paymentTerms: 'Due upon receipt',
      dueDate: '2024-06-01',
      currency: 'USD'
    },
    {
      id: 'INV002',
      patientName: 'Jane Wilson',
      patientId: 'REG001235',
      department: 'Surgery',
      doctor: 'Dr. Johnson',
      services: [
        { description: 'Appendectomy Surgery', quantity: 1, rate: 2500.00, amount: 2500.00, taxRate: 0.18 },
        { description: 'Anesthesia', quantity: 1, rate: 400.00, amount: 400.00, taxRate: 0.18 },
        { description: 'Room Charges (2 days)', quantity: 2, rate: 300.00, amount: 600.00, taxRate: 0.18 }
      ],
      subtotal: 3500.00,
      taxAmount: 630.00,
      total: 4130.00,
      paymentTerms: 'Net 30 days',
      dueDate: '2024-07-01',
      currency: 'USD'
    }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'SAR'];
  const paymentTermsOptions = [
    'Due upon receipt',
    'Net 15 days',
    'Net 30 days',
    'Net 45 days',
    'Due on discharge'
  ];

  const generateInvoice = () => {
    console.log('Generating invoice with template:', selectedTemplate);
    console.log('Invoice data:', invoiceData);
  };

  const handlePreview = (invoiceId: string) => {
    console.log(`Previewing invoice ${invoiceId}`);
  };

  const handleDownload = (invoiceId: string, format: string) => {
    console.log(`Downloading invoice ${invoiceId} as ${format}`);
  };

  const handleEmailInvoice = (invoiceId: string) => {
    console.log(`Emailing invoice ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto Invoice Builder</h2>
          <p className="text-gray-600">Automated invoice generation with customizable templates</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={generateInvoice}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Template Selection</CardTitle>
          <CardDescription>Choose the appropriate template for your billing needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">{template.name}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Department: {template.department}</p>
                    <p>Format: {template.format}</p>
                    <p>Currency: {template.currency}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.taxCompliance.map((tax) => (
                        <Badge key={tax} variant="outline" className="text-xs">
                          {tax}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Currency</label>
              <Select value={invoiceData.currency} onValueChange={(value) => 
                setInvoiceData(prev => ({ ...prev, currency: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Terms</label>
              <Select value={invoiceData.paymentTerms} onValueChange={(value) => 
                setInvoiceData(prev => ({ ...prev, paymentTerms: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map(term => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Due Date</label>
              <Input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Invoices</CardTitle>
          <CardDescription>Recent invoices with download and management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleInvoices.map((invoice) => (
              <div key={invoice.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{invoice.id}</h3>
                      <p className="text-sm text-gray-600">{invoice.patientName} ({invoice.patientId})</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Services</h4>
                    <div className="space-y-1">
                      {invoice.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.description} (x{service.quantity})</span>
                          <span>{invoice.currency} {service.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%):</span>
                        <span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>{invoice.currency} {invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handlePreview(invoice.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownload(invoice.id, 'PDF')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEmailInvoice(invoice.id)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownload(invoice.id, 'Print')}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
