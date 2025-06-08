
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Mic, 
  Zap, 
  Copy,
  Save,
  Send,
  Search,
  Filter,
  Settings,
  BarChart3,
  Clock,
  Eye
} from 'lucide-react';

export const AdvancedReporting = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('structured_chest');
  const [autoPopulation, setAutoPopulation] = useState(true);
  const [nlpAssist, setNlpAssist] = useState(true);

  const structuredTemplates = [
    {
      id: 'structured_chest',
      name: 'Structured Chest CT',
      category: 'CT',
      sections: ['Clinical Information', 'Technique', 'Findings', 'Measurements', 'Impression'],
      autoMeasurements: true
    },
    {
      id: 'structured_brain',
      name: 'Structured Brain MRI',
      category: 'MR',
      sections: ['Clinical History', 'Technique', 'Findings', 'Measurements', 'Impression'],
      autoMeasurements: true
    },
    {
      id: 'structured_abdomen',
      name: 'Structured Abdominal CT',
      category: 'CT',
      sections: ['Indication', 'Technique', 'Liver', 'Pancreas', 'Kidneys', 'Impression'],
      autoMeasurements: true
    },
    {
      id: 'emergency_head',
      name: 'Emergency Head CT',
      category: 'CT',
      sections: ['Clinical Information', 'Technique', 'Findings', 'Acute Findings', 'Impression'],
      autoMeasurements: false
    }
  ];

  const measurementData = [
    { structure: 'Aortic Root', value: '3.2 cm', normal: 'Normal', location: 'Ascending aorta' },
    { structure: 'Left Atrium', value: '4.1 cm', normal: 'Mildly enlarged', location: 'LA diameter' },
    { structure: 'Lung Nodule', value: '8mm', normal: 'Small', location: 'RUL anterior segment' },
    { structure: 'Liver Lesion', value: '2.3 cm', normal: 'Follow-up needed', location: 'Segment VI' }
  ];

  const priorStudyComparison = {
    priorDate: '2023-12-15',
    keyChanges: [
      { finding: 'Lung nodule RUL', previous: '6mm', current: '8mm', change: 'Increased', significance: 'Monitor' },
      { finding: 'Pleural effusion', previous: 'Moderate', current: 'Trace', change: 'Improved', significance: 'Resolved' },
      { finding: 'Lymph nodes', previous: '12mm', current: '10mm', change: 'Decreased', significance: 'Stable' }
    ]
  };

  const nlpSuggestions = [
    { type: 'terminology', suggestion: 'Consider using "consolidation" instead of "opacity"', confidence: 85 },
    { type: 'measurement', suggestion: 'Add size measurement for described nodule', confidence: 92 },
    { type: 'classification', suggestion: 'Consider LUNG-RADS category for pulmonary nodule', confidence: 78 },
    { type: 'followup', suggestion: 'Recommend follow-up timeframe based on findings', confidence: 88 }
  ];

  const codingAssistance = [
    { code: 'CPT 71260', description: 'CT thorax with contrast', match: 95 },
    { code: 'ICD-10 Z51.11', description: 'Encounter for antineoplastic chemotherapy', match: 87 },
    { code: 'ICD-10 R06.02', description: 'Shortness of breath', match: 82 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Advanced Reporting</h3>
          <p className="text-gray-600">Structured templates with AI assistance and automated measurements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Template Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Report Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Structured Templates</CardTitle>
              <CardDescription className="text-xs">Select reporting template</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {structuredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                      {template.autoMeasurements && (
                        <Badge className="text-xs bg-green-500">Auto-Measure</Badge>
                      )}
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{template.name}</h5>
                    <p className="text-xs text-gray-600">{template.sections.length} sections</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AI Assistance</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-population</span>
                <input
                  type="checkbox"
                  checked={autoPopulation}
                  onChange={(e) => setAutoPopulation(e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NLP Assistance</span>
                <input
                  type="checkbox"
                  checked={nlpAssist}
                  onChange={(e) => setNlpAssist(e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="pt-2 border-t">
                <Button size="sm" className="w-full flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Generate Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Measurements</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {measurementData.map((measurement, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{measurement.structure}</span>
                      <Badge variant="outline" className={`text-xs ${
                        measurement.normal === 'Normal' ? 'border-green-500 text-green-700' :
                        measurement.normal.includes('enlarged') || measurement.normal.includes('Follow-up') ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {measurement.normal}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{measurement.value}</p>
                    <p className="text-gray-500">{measurement.location}</p>
                  </div>
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
                  <CardTitle>Structured Report Editor</CardTitle>
                  <CardDescription>Chest CT with Auto-measurement Integration</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4" />
                    Dictate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clinical-info" className="text-sm font-medium">Clinical Information</Label>
                <textarea
                  id="clinical-info"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[60px] text-sm"
                  placeholder="Clinical indication and relevant history..."
                  defaultValue="45-year-old male with chest pain and dyspnea. Rule out pulmonary embolism."
                />
              </div>

              <div>
                <Label htmlFor="technique" className="text-sm font-medium">Technique</Label>
                <textarea
                  id="technique"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[60px] text-sm"
                  placeholder="Imaging technique and protocol..."
                  defaultValue="Axial CT images of the chest were obtained with intravenous contrast using a standard pulmonary embolism protocol."
                />
              </div>

              <div>
                <Label htmlFor="findings" className="text-sm font-medium">Findings</Label>
                <div className="border border-gray-300 rounded-md">
                  <div className="p-2 bg-gray-50 border-b flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">AI-Generated Content</span>
                    <Button size="sm" variant="outline" className="text-xs ml-auto">
                      <Copy className="h-3 w-3 mr-1" />
                      Insert
                    </Button>
                  </div>
                  <textarea
                    className="w-full p-3 min-h-[120px] text-sm resize-none border-0 focus:ring-0"
                    placeholder="Detailed imaging findings..."
                    defaultValue={`LUNGS: No focal consolidation, mass, or nodule. A small 8mm nodule is present in the right upper lobe anterior segment (Series 3, Image 45), increased from 6mm on prior study dated ${priorStudyComparison.priorDate}.

PLEURAL SPACES: Trace bilateral pleural effusions, significantly improved from moderate effusions on prior study.

MEDIASTINUM: Heart size is normal. Aortic root measures 3.2 cm (normal). Left atrium is mildly enlarged at 4.1 cm.

PULMONARY VASCULATURE: No evidence of pulmonary embolism. Main pulmonary artery diameter is normal at 2.8 cm.`}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="impression" className="text-sm font-medium">Impression</Label>
                <textarea
                  id="impression"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[100px] text-sm"
                  placeholder="Clinical impression and recommendations..."
                  defaultValue={`1. No evidence of pulmonary embolism.
2. 8mm right upper lobe pulmonary nodule, increased from 6mm on prior study. Recommend 3-6 month follow-up CT chest per Fleischner Society guidelines.
3. Significant improvement in bilateral pleural effusions.
4. Mildly enlarged left atrium.`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Finalize Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistance Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prior Study Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <p className="text-xs text-gray-600 mb-3">Comparison with study from {priorStudyComparison.priorDate}</p>
              <div className="space-y-2">
                {priorStudyComparison.keyChanges.map((change, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <p className="font-medium text-gray-900">{change.finding}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">{change.previous} → {change.current}</span>
                      <Badge variant="outline" className={`text-xs ${
                        change.change === 'Increased' ? 'border-red-500 text-red-700' :
                        change.change === 'Improved' ? 'border-green-500 text-green-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {change.change}
                      </Badge>
                    </div>
                    <p className="text-gray-500 mt-1">{change.significance}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">NLP Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {nlpSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <span className="text-gray-500">{suggestion.confidence}%</span>
                    </div>
                    <p className="text-gray-700">{suggestion.suggestion}</p>
                    <Button size="sm" variant="outline" className="mt-1 text-xs">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Coding Assistance</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {codingAssistance.map((code, index) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-600">{code.code}</span>
                      <span className="text-gray-500">{code.match}%</span>
                    </div>
                    <p className="text-gray-700 mt-1">{code.description}</p>
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
