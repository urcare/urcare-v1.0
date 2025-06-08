
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react';

export const DataCollection = () => {
  const [selectedStudy, setSelectedStudy] = useState('cardio-001');
  const [selectedFormat, setSelectedFormat] = useState('redcap');

  const dataStats = {
    totalRecords: 2847,
    completeRecords: 2156,
    incompleteRecords: 691,
    qualityScore: 94.2,
    lastSync: '2024-01-25 14:30',
    dataSize: '2.3 GB'
  };

  const exportFormats = [
    { value: 'redcap', label: 'REDCap XML', description: 'Compatible with REDCap systems' },
    { value: 'cdisc', label: 'CDISC ODM', description: 'Clinical Data Interchange Standards' },
    { value: 'csv', label: 'CSV Export', description: 'Comma-separated values' },
    { value: 'json', label: 'JSON Format', description: 'JavaScript Object Notation' },
    { value: 'sas', label: 'SAS Dataset', description: 'Statistical Analysis System format' },
    { value: 'spss', label: 'SPSS Format', description: 'IBM SPSS Statistics format' }
  ];

  const dataQuality = [
    { category: 'Completeness', score: 92, issues: 23, description: 'Missing required fields' },
    { category: 'Consistency', score: 96, issues: 12, description: 'Data format inconsistencies' },
    { category: 'Accuracy', score: 94, issues: 18, description: 'Out-of-range values' },
    { category: 'Timeliness', score: 98, issues: 6, description: 'Late data entry' }
  ];

  const auditTrail = [
    {
      id: '1',
      timestamp: '2024-01-25 14:30:22',
      user: 'Dr. Sarah Johnson',
      action: 'Data Export',
      details: 'Exported CARDIO-001 data in REDCap format',
      status: 'completed'
    },
    {
      id: '2',
      timestamp: '2024-01-25 12:15:10',
      user: 'Study Coordinator',
      action: 'Data Validation',
      details: 'Validated participant CARDIO-001-045 visit data',
      status: 'completed'
    },
    {
      id: '3',
      timestamp: '2024-01-25 09:45:33',
      user: 'Data Manager',
      action: 'Quality Check',
      details: 'Automated quality check identified 3 inconsistencies',
      status: 'review_required'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Collection & Export</h2>
          <p className="text-gray-600">Research data management and export capabilities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            De-identify Data
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{dataStats.totalRecords}</p>
            <p className="text-sm text-blue-700">Total Records</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{dataStats.completeRecords}</p>
            <p className="text-sm text-green-700">Complete</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{dataStats.incompleteRecords}</p>
            <p className="text-sm text-yellow-700">Incomplete</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{dataStats.qualityScore}%</p>
            <p className="text-sm text-purple-700">Quality Score</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{dataStats.dataSize}</p>
            <p className="text-sm text-teal-700">Data Size</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">14:30</p>
            <p className="text-sm text-gray-700">Last Sync</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Export research data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Study Selection</label>
              <Select value={selectedStudy} onValueChange={setSelectedStudy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio-001">CARDIO-001 - Cardiovascular Prevention</SelectItem>
                  <SelectItem value="neuro-002">NEURO-002 - Neuroprotective Agent</SelectItem>
                  <SelectItem value="onco-003">ONCO-003 - Immunotherapy Combination</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</label>
              <div className="space-y-2">
                {exportFormats.map((format) => (
                  <div 
                    key={format.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === format.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input 
                        type="radio" 
                        checked={selectedFormat === format.value}
                        onChange={() => setSelectedFormat(format.value)}
                        className="text-blue-600"
                      />
                      <span className="font-medium text-gray-900">{format.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{format.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Selected Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality */}
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Metrics</CardTitle>
            <CardDescription>Real-time data quality assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataQuality.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{metric.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{metric.score}%</span>
                    {metric.issues > 0 && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        {metric.issues} issues
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={metric.score} className="h-2" />
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Run Quality Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>21 CFR Part 11 compliant audit trail and version control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className={`w-3 h-3 rounded-full ${
                  entry.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{entry.action}</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.status.replace('_', ' ').charAt(0).toUpperCase() + entry.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{entry.details}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>User: {entry.user}</span>
                    <span>Time: {entry.timestamp}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
