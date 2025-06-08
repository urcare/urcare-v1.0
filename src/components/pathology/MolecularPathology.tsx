
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dna, 
  TestTube, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Beaker,
  Target,
  Brain,
  Download,
  Share2
} from 'lucide-react';

export const MolecularPathology = () => {
  const [selectedTest, setSelectedTest] = useState('MOL001');

  const molecularTests = [
    {
      id: 'MOL001',
      patient: 'John Doe',
      specimen: 'Lung Biopsy',
      test: 'EGFR Mutation Analysis',
      status: 'In Progress',
      method: 'NGS',
      priority: 'STAT',
      ordered: '2024-01-08 14:30',
      progress: 65,
      expectedResult: '2024-01-09 16:00'
    },
    {
      id: 'MOL002',
      patient: 'Jane Smith',
      specimen: 'Breast Core',
      test: 'HER2 Gene Amplification',
      status: 'Completed',
      method: 'FISH',
      priority: 'Routine',
      ordered: '2024-01-08 13:45',
      progress: 100,
      expectedResult: '2024-01-08 18:00'
    },
    {
      id: 'MOL003',
      patient: 'Mike Wilson',
      specimen: 'Colon Tissue',
      test: 'MSI Analysis',
      status: 'Pending',
      method: 'PCR',
      priority: 'Urgent',
      ordered: '2024-01-08 15:00',
      progress: 15,
      expectedResult: '2024-01-09 12:00'
    }
  ];

  const testPanels = [
    {
      name: 'Lung Cancer Panel',
      genes: ['EGFR', 'KRAS', 'ALK', 'ROS1', 'PD-L1'],
      mutations: 45,
      method: 'NGS',
      turnaround: '3-5 days'
    },
    {
      name: 'Breast Cancer Panel',
      genes: ['HER2', 'ESR1', 'PIK3CA', 'BRCA1', 'BRCA2'],
      mutations: 32,
      method: 'NGS + FISH',
      turnaround: '2-4 days'
    },
    {
      name: 'Colorectal Panel',
      genes: ['KRAS', 'NRAS', 'BRAF', 'PIK3CA', 'MSI'],
      mutations: 28,
      method: 'NGS + PCR',
      turnaround: '2-3 days'
    }
  ];

  const testingSteps = [
    { name: 'Sample Preparation', completed: true, time: '2 hours' },
    { name: 'DNA/RNA Extraction', completed: true, time: '3 hours' },
    { name: 'Quality Assessment', completed: true, time: '1 hour' },
    { name: 'Library Preparation', completed: false, current: true, time: '4 hours' },
    { name: 'Sequencing', completed: false, time: '24 hours' },
    { name: 'Data Analysis', completed: false, time: '6 hours' },
    { name: 'Interpretation', completed: false, time: '2 hours' },
    { name: 'Report Generation', completed: false, time: '1 hour' }
  ];

  const variantInterpretation = [
    { gene: 'EGFR', variant: 'p.L858R', type: 'Pathogenic', significance: 'Therapeutic Target', therapy: 'Erlotinib' },
    { gene: 'KRAS', variant: 'p.G12C', type: 'Pathogenic', significance: 'Therapeutic Target', therapy: 'Sotorasib' },
    { gene: 'TP53', variant: 'p.R273H', type: 'Pathogenic', significance: 'Prognostic', therapy: 'None Available' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Molecular Pathology</h3>
          <p className="text-gray-600">Genetic variant tracking and clinical correlation analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Variant Database
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
          <Button className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            Order Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Test Queue */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Molecular Tests</CardTitle>
              <CardDescription className="text-xs">Active genetic analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {molecularTests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedTest === test.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTest(test.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        test.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        test.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {test.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {test.method}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{test.patient}</h5>
                    <p className="text-xs text-gray-600">{test.test}</p>
                    <p className="text-xs text-gray-500">{test.specimen}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{test.status}</span>
                        <span>{test.progress}%</span>
                      </div>
                      <Progress value={test.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Test Panels</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {testPanels.map((panel, index) => (
                  <div key={index} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{panel.name}</p>
                    <p className="text-xs text-gray-600">{panel.genes.length} genes • {panel.mutations} variants</p>
                    <p className="text-xs text-gray-500">{panel.method} • {panel.turnaround}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testing Progress */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Progress - {selectedTest}</CardTitle>
              <CardDescription>Real-time molecular testing workflow tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' :
                      step.current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.current ? (
                        <Beaker className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        step.current ? 'text-blue-900' : step.completed ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        {step.name}
                      </h5>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                    {step.current && (
                      <Badge className="bg-blue-500">Processing</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variant Interpretation</CardTitle>
              <CardDescription>Clinical significance and therapeutic implications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variantInterpretation.map((variant, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Dna className="h-5 w-5 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900">{variant.gene}: {variant.variant}</h5>
                          <p className="text-sm text-gray-600">{variant.significance}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${
                        variant.type === 'Pathogenic' ? 'border-red-500 text-red-700' : 'border-gray-500 text-gray-700'
                      }`}>
                        {variant.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">Clinical Significance</p>
                        <p className="text-gray-600">{variant.significance}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Therapeutic Options</p>
                        <p className={`${variant.therapy !== 'None Available' ? 'text-green-600' : 'text-gray-600'}`}>
                          {variant.therapy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tools */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Analysis Tools</CardTitle>
              <CardDescription className="text-xs">Bioinformatics and interpretation</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Variant Classifier</p>
                    <p className="text-xs text-gray-600">AI-powered analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <Database className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">ClinVar Database</p>
                    <p className="text-xs text-gray-600">Public annotations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Drug Targets</p>
                    <p className="text-xs text-gray-600">Therapy matching</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>DNA Quality</span>
                  <Badge className="bg-green-500">Excellent</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Coverage Depth</span>
                  <span className="font-medium">1,250x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variant Confidence</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Report Status</span>
                  <Badge variant="outline" className="border-blue-500 text-blue-700">
                    In Progress
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Generate Report
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-3 w-3" />
                Export Data
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Database className="h-3 w-3" />
                Database Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
