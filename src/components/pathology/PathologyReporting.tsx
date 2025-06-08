
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Mic, 
  Image, 
  Layout,
  Save,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Copy,
  Download,
  MessageSquare
} from 'lucide-react';

export const PathologyReporting = () => {
  const [selectedReport, setSelectedReport] = useState('RPT001');
  const [isRecording, setIsRecording] = useState(false);

  const reports = [
    {
      id: 'RPT001',
      patient: 'John Doe',
      specimen: 'Lung Biopsy',
      status: 'Draft',
      pathologist: 'Dr. Smith',
      priority: 'STAT',
      started: '15:30',
      template: 'Lung Biopsy Standard'
    },
    {
      id: 'RPT002',
      patient: 'Jane Smith',
      specimen: 'Breast Core',
      status: 'Pending Review',
      pathologist: 'Dr. Johnson',
      priority: 'Urgent',
      started: '14:45',
      template: 'Breast Core Needle'
    },
    {
      id: 'RPT003',
      patient: 'Mike Wilson',
      specimen: 'Colon Resection',
      status: 'Completed',
      pathologist: 'Dr. Brown',
      priority: 'Routine',
      started: '13:00',
      template: 'GI Resection'
    }
  ];

  const templates = [
    { name: 'Lung Biopsy Standard', category: 'Pulmonary', fields: 12 },
    { name: 'Breast Core Needle', category: 'Breast', fields: 15 },
    { name: 'GI Resection', category: 'Gastrointestinal', fields: 18 },
    { name: 'Skin Lesion', category: 'Dermatopathology', fields: 8 },
    { name: 'Lymph Node', category: 'Hematopathology', fields: 14 }
  ];

  const reportSections = [
    { name: 'Clinical History', completed: true, required: true },
    { name: 'Gross Description', completed: true, required: true },
    { name: 'Microscopic Description', completed: false, required: true, current: true },
    { name: 'Immunohistochemistry', completed: false, required: false },
    { name: 'Molecular Studies', completed: false, required: false },
    { name: 'Diagnosis', completed: false, required: true },
    { name: 'Comment', completed: false, required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pathology Reporting</h3>
          <p className="text-gray-600">Structured reporting with templates and voice integration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Add Images
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Reports</CardTitle>
              <CardDescription className="text-xs">Reports in progress</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedReport === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className={`text-xs ${
                        report.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        report.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {report.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{report.started}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{report.patient}</h5>
                    <p className="text-xs text-gray-600">{report.specimen}</p>
                    <p className="text-xs text-gray-500">{report.pathologist}</p>
                    <Badge variant="outline" className={`mt-1 text-xs ${
                      report.status === 'Completed' ? 'border-green-500 text-green-700' :
                      report.status === 'Pending Review' ? 'border-orange-500 text-orange-700' :
                      'border-blue-500 text-blue-700'
                    }`}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Templates</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {templates.map((template, index) => (
                  <div key={index} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-600">{template.category}</p>
                    <p className="text-xs text-gray-500">{template.fields} fields</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Editor */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Editor - {selectedReport}</CardTitle>
                  <CardDescription>Structured pathology report with template guidance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Report Progress */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {reportSections.map((section, index) => (
                    <div key={index} className={`p-2 border rounded text-center ${
                      section.completed ? 'border-green-500 bg-green-50' :
                      section.current ? 'border-blue-500 bg-blue-50' :
                      'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-center mb-1">
                        {section.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : section.current ? (
                          <Clock className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${
                            section.required ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                        )}
                      </div>
                      <p className="text-xs font-medium">{section.name}</p>
                    </div>
                  ))}
                </div>

                {/* Report Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical History
                    </label>
                    <Textarea
                      placeholder="Enter clinical history and relevant patient information..."
                      className="min-h-[80px]"
                      defaultValue="45-year-old male with history of smoking presenting with lung nodule on CT scan. Clinical suspicion of malignancy."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gross Description
                    </label>
                    <Textarea
                      placeholder="Describe gross examination findings..."
                      className="min-h-[100px]"
                      defaultValue="Received fresh labeled 'lung biopsy' are multiple tan-brown tissue fragments measuring 0.8 x 0.5 x 0.3 cm in aggregate. The tissue is submitted entirely in cassette A1."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Microscopic Description
                      <Badge className="ml-2 bg-blue-500">Current Section</Badge>
                    </label>
                    <Textarea
                      placeholder="Enter microscopic findings..."
                      className="min-h-[120px]"
                      defaultValue="Sections show lung parenchyma with a malignant epithelial neoplasm characterized by..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Immunohistochemistry
                      </label>
                      <Textarea
                        placeholder="IHC results and interpretation..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Molecular Studies
                      </label>
                      <Textarea
                        placeholder="Molecular test results..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <Textarea
                      placeholder="Final diagnosis..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Preview Report</p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  Preview
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Request Review</p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  Send for Review
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Export Report</p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  Export PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
