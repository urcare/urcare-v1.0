
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  FileText,
  Database,
  Cloud,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  fileType: string;
  features: string[];
  lastExport: string;
  status: 'Ready' | 'Processing' | 'Error';
  icon: any;
}

interface ExportHistory {
  id: string;
  format: string;
  dateRange: string;
  recordCount: number;
  fileSize: string;
  exportedAt: string;
  downloadUrl: string;
  status: 'Completed' | 'Failed' | 'Processing';
}

export const ERPExportCapabilities = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');

  const exportFormats: ExportFormat[] = [
    {
      id: 'tally',
      name: 'Tally',
      description: 'XML format with complete transaction details',
      fileType: 'XML',
      features: ['GST Compliance', 'Voucher Mapping', 'Ledger Integration'],
      lastExport: '2024-06-01 09:30',
      status: 'Ready',
      icon: FileText
    },
    {
      id: 'zoho',
      name: 'Zoho Books',
      description: 'API integration with real-time sync',
      fileType: 'API',
      features: ['Real-time Sync', 'Invoice Mapping', 'Customer Integration'],
      lastExport: '2024-06-01 10:15',
      status: 'Processing',
      icon: Cloud
    },
    {
      id: 'sap',
      name: 'SAP',
      description: 'Standard SAP transaction format',
      fileType: 'IDOC',
      features: ['Transaction Codes', 'GL Mapping', 'Cost Center Integration'],
      lastExport: '2024-05-31 18:45',
      status: 'Ready',
      icon: Database
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'QBO file format for QuickBooks import',
      fileType: 'QBO',
      features: ['Chart of Accounts', 'Customer Mapping', 'Tax Integration'],
      lastExport: '2024-06-01 08:20',
      status: 'Ready',
      icon: FileText
    },
    {
      id: 'csv',
      name: 'Custom CSV',
      description: 'Configurable field mapping',
      fileType: 'CSV',
      features: ['Custom Fields', 'Flexible Mapping', 'Multiple Formats'],
      lastExport: '2024-06-01 11:00',
      status: 'Ready',
      icon: FileText
    },
    {
      id: 'excel',
      name: 'Excel',
      description: 'Formatted reports with pivot tables',
      fileType: 'XLSX',
      features: ['Pivot Tables', 'Charts', 'Formatted Reports'],
      lastExport: '2024-06-01 07:45',
      status: 'Ready',
      icon: FileText
    }
  ];

  const exportHistory: ExportHistory[] = [
    {
      id: 'EXP001',
      format: 'Tally XML',
      dateRange: '2024-05-01 to 2024-05-31',
      recordCount: 2456,
      fileSize: '15.2 MB',
      exportedAt: '2024-06-01 09:30',
      downloadUrl: '#',
      status: 'Completed'
    },
    {
      id: 'EXP002',
      format: 'QuickBooks QBO',
      dateRange: '2024-05-15 to 2024-05-31',
      recordCount: 1234,
      fileSize: '8.7 MB',
      exportedAt: '2024-06-01 08:20',
      downloadUrl: '#',
      status: 'Completed'
    },
    {
      id: 'EXP003',
      format: 'Zoho Books API',
      dateRange: '2024-06-01',
      recordCount: 156,
      fileSize: '2.1 MB',
      exportedAt: '2024-06-01 10:15',
      downloadUrl: '#',
      status: 'Processing'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Ready': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Error': 'bg-red-100 text-red-800',
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'Ready': CheckCircle,
      'Completed': CheckCircle,
      'Processing': Clock,
      'Error': AlertTriangle,
      'Failed': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const handleExport = (formatId: string) => {
    console.log(`Exporting in format: ${formatId} for period: ${dateRange}`);
  };

  const handleDownload = (exportId: string) => {
    console.log(`Downloading export: ${exportId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ERP Export Capabilities</h2>
          <p className="text-gray-600">Seamless integration with external accounting systems</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportFormats.map((format) => {
          const IconComponent = format.icon;
          const StatusIcon = getStatusIcon(format.status);
          
          return (
            <Card 
              key={format.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedFormat === format.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{format.name}</h3>
                      <p className="text-sm text-gray-600">{format.fileType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4" />
                    <Badge className={getStatusBadge(format.status)}>
                      {format.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{format.description}</p>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {format.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Last export: {format.lastExport}
                </div>

                <Button 
                  className="w-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(format.id);
                  }}
                  disabled={format.status === 'Processing'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export {format.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Configuration */}
      {selectedFormat && (
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>Configure export parameters for {exportFormats.find(f => f.id === selectedFormat)?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
                <Input type="date" defaultValue="2024-06-01" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
                <Input type="date" defaultValue="2024-06-01" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Start Export
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Recent export files and download links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportHistory.map((export_) => {
              const StatusIcon = getStatusIcon(export_.status);
              
              return (
                <div key={export_.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{export_.id} - {export_.format}</h3>
                      <p className="text-sm text-gray-600">{export_.dateRange}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Records</p>
                      <p className="font-medium">{export_.recordCount.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="font-medium">{export_.fileSize}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Exported</p>
                      <p className="font-medium">{export_.exportedAt}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={getStatusBadge(export_.status)}>
                        {export_.status}
                      </Badge>
                    </div>
                    
                    {export_.status === 'Completed' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(export_.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
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
