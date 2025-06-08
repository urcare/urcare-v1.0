
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Copy,
  Save,
  Send,
  Edit,
  Eye,
  RotateCcw
} from 'lucide-react';

export const RadiologistReporting = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dictationMode, setDictationMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('chest_ct');

  const pendingStudies = [
    {
      id: 'RPT001',
      patient: 'John Doe',
      mrn: 'MRN001234',
      study: 'CT Chest with Contrast',
      modality: 'CT',
      priority: 'Routine',
      acquired: '08:30',
      age: 45,
      indication: 'Chest pain, rule out PE',
      priorStudies: 2,
      status: 'Pending'
    },
    {
      id: 'RPT002',
      patient: 'Jane Smith',
      mrn: 'MRN002345',
      study: 'MRI Brain without Contrast',
      modality: 'MR',
      priority: 'Urgent',
      acquired: '09:15',
      age: 62,
      indication: 'Acute headache, CVA rule out',
      priorStudies: 0,
      status: 'In Progress'
    },
    {
      id: 'RPT003',
      patient: 'Robert Brown',
      mrn: 'MRN003456',
      study: 'Chest X-Ray PA/Lateral',
      modality: 'XR',
      priority: 'STAT',
      acquired: '10:00',
      age: 78,
      indication: 'SOB, r/o pneumonia',
      priorStudies: 5,
      status: 'Dictated'
    }
  ];

  const reportTemplates = [
    {
      id: 'chest_ct',
      name: 'Chest CT',
      category: 'CT',
      sections: ['Technique', 'Comparison', 'Findings', 'Impression']
    },
    {
      id: 'brain_mr',
      name: 'Brain MRI',
      category: 'MR',
      sections: ['Technique', 'Clinical History', 'Findings', 'Impression']
    },
    {
      id: 'chest_xr',
      name: 'Chest X-Ray',
      category: 'XR',
      sections: ['Technique', 'Comparison', 'Findings', 'Impression']
    },
    {
      id: 'abdominal_ct',
      name: 'Abdominal CT',
      category: 'CT',
      sections: ['Technique', 'Comparison', 'Findings', 'Impression']
    }
  ];

  const macros = [
    { name: 'Normal Chest CT', text: 'The lungs are clear without consolidation, pleural effusion, or pneumothorax.' },
    { name: 'Normal Brain MRI', text: 'No acute intracranial abnormality. No mass effect or midline shift.' },
    { name: 'Technical Quality', text: 'Technically adequate study with good contrast enhancement.' },
    { name: 'Comparison Statement', text: 'Compared to prior study dated [DATE], there is...' }
  ];

  const draftReport = {
    technique: 'Axial CT images of the chest were obtained with intravenous contrast.',
    comparison: 'No prior studies available for comparison.',
    findings: `The lungs are clear bilaterally without consolidation, pleural effusion, or pneumothorax. The heart size is normal. The mediastinal and hilar contours are unremarkable. No pulmonary embolism is identified. The visualized osseous structures are intact.`,
    impression: `1. No acute pulmonary abnormality.
2. No evidence of pulmonary embolism.`
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Radiologist Reporting</h3>
          <p className="text-gray-600">Voice recognition, structured reporting, and workflow management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Studies
          </Button>
          <Button
            variant={dictationMode ? 'destructive' : 'default'}
            className="flex items-center gap-2"
            onClick={() => setDictationMode(!dictationMode)}
          >
            <Mic className="h-4 w-4" />
            {dictationMode ? 'Stop Dictation' : 'Start Dictation'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Work List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Studies</CardTitle>
              <CardDescription className="text-xs">Studies awaiting interpretation</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {pendingStudies.map((study) => (
                  <div
                    key={study.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedReport === study.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedReport(study.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className={`text-xs ${
                        study.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        study.priority === 'Urgent' ? 'border-orange-500 text-orange-700' : 'border-blue-500 text-blue-700'
                      }`}>
                        {study.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{study.acquired}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{study.patient}</h5>
                    <p className="text-xs text-gray-600">{study.study}</p>
                    <p className="text-xs text-gray-500">Age: {study.age} • Prior: {study.priorStudies}</p>
                    <Badge className={`mt-1 text-xs ${
                      study.status === 'Pending' ? 'bg-yellow-500' :
                      study.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {study.status}
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
              <div className="space-y-1">
                {reportTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Macros</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {macros.map((macro, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {macro.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Report Editor</CardTitle>
                  <CardDescription>John Doe - CT Chest with Contrast</CardDescription>
                </div>
                <div className="flex gap-2">
                  {dictationMode && (
                    <Badge className="bg-red-500 animate-pulse">
                      <Mic className="h-3 w-3 mr-1" />
                      Recording
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                    Undo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="technique" className="text-sm font-medium">Technique</Label>
                <textarea
                  id="technique"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[80px] text-sm"
                  placeholder="Describe imaging technique..."
                  defaultValue={draftReport.technique}
                />
              </div>

              <div>
                <Label htmlFor="comparison" className="text-sm font-medium">Comparison</Label>
                <textarea
                  id="comparison"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[60px] text-sm"
                  placeholder="Comparison studies..."
                  defaultValue={draftReport.comparison}
                />
              </div>

              <div>
                <Label htmlFor="findings" className="text-sm font-medium">Findings</Label>
                <textarea
                  id="findings"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[120px] text-sm"
                  placeholder="Detailed findings..."
                  defaultValue={draftReport.findings}
                />
              </div>

              <div>
                <Label htmlFor="impression" className="text-sm font-medium">Impression</Label>
                <textarea
                  id="impression"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[100px] text-sm"
                  placeholder="Clinical impression and recommendations..."
                  defaultValue={draftReport.impression}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Sign & Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Information & Prior Comparisons */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Study Information</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div>
                <p className="text-xs text-gray-500">Patient</p>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-600">MRN: MRN001234</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Study</p>
                <p className="text-sm font-medium">CT Chest with Contrast</p>
                <p className="text-xs text-gray-600">Acquired: 08:30</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Clinical Information</p>
                <p className="text-sm">Chest pain, rule out PE</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ordering Physician</p>
                <p className="text-sm">Dr. Smith, Emergency</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prior Studies</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium">CT Chest</p>
                  <p className="text-xs text-gray-600">2023-12-15</p>
                  <p className="text-xs text-gray-500">6 months ago</p>
                </div>
                <div className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium">Chest X-Ray</p>
                  <p className="text-xs text-gray-600">2023-11-20</p>
                  <p className="text-xs text-gray-500">7 months ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Report Status</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Created</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Dictated</span>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Reviewed</span>
                  <Clock className="h-4 w-4 text-gray-300" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Signed</span>
                  <Clock className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Report Time</span>
                  <span className="text-xs font-medium">45 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Complexity</span>
                  <Badge variant="outline" className="text-xs">Moderate</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Critical Finding</span>
                  <span className="text-xs text-red-600">No</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
