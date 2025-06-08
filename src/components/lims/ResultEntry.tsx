
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  FileText,
  Clock,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const ResultEntry = () => {
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  const pendingResults = [
    {
      sampleId: 'LAB001234',
      patient: 'John Smith (PT001845)',
      test: 'Complete Blood Count',
      category: 'Hematology',
      priority: 'routine',
      analyzer: 'HemaCount Elite',
      results: [
        { parameter: 'WBC', value: '7.2', unit: 'K/uL', reference: '4.0-11.0', status: 'normal' },
        { parameter: 'RBC', value: '4.8', unit: 'M/uL', reference: '4.2-5.4', status: 'normal' },
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', reference: '12.0-16.0', status: 'normal' },
        { parameter: 'Platelet', value: '350', unit: 'K/uL', reference: '150-450', status: 'normal' }
      ],
      collectedAt: '2024-01-20 08:30',
      status: 'pending_review'
    },
    {
      sampleId: 'LAB001235',
      patient: 'Emily Davis (PT001846)',
      test: 'Troponin I',
      category: 'Chemistry',
      priority: 'stat',
      analyzer: 'ChemMax Pro 5000',
      results: [
        { parameter: 'Troponin I', value: '12.5', unit: 'ng/mL', reference: '<0.04', status: 'critical_high' }
      ],
      collectedAt: '2024-01-20 14:15',
      status: 'critical_pending'
    },
    {
      sampleId: 'LAB001236',
      patient: 'Robert Wilson (PT001847)',
      test: 'Comprehensive Metabolic Panel',
      category: 'Chemistry',
      priority: 'urgent',
      analyzer: 'ChemMax Pro 5000',
      results: [
        { parameter: 'Glucose', value: '95', unit: 'mg/dL', reference: '70-100', status: 'normal' },
        { parameter: 'BUN', value: '18', unit: 'mg/dL', reference: '7-20', status: 'normal' },
        { parameter: 'Creatinine', value: '1.1', unit: 'mg/dL', reference: '0.7-1.3', status: 'normal' },
        { parameter: 'Sodium', value: '142', unit: 'mEq/L', reference: '136-145', status: 'normal' }
      ],
      collectedAt: '2024-01-20 09:45',
      status: 'pending_review'
    }
  ];

  const approvedResults = [
    {
      sampleId: 'LAB001230',
      patient: 'Maria Garcia (PT001848)',
      test: 'Lipid Panel',
      approvedBy: 'Dr. Sarah Johnson',
      approvedAt: '2024-01-20 13:30',
      status: 'reported'
    },
    {
      sampleId: 'LAB001231',
      patient: 'David Kim (PT001849)',
      test: 'Thyroid Function',
      approvedBy: 'Dr. Mike Chen',
      approvedAt: '2024-01-20 12:45',
      status: 'reported'
    },
    {
      sampleId: 'LAB001232',
      patient: 'Lisa Wang (PT001850)',
      test: 'Vitamin D',
      approvedBy: 'Dr. Sarah Johnson',
      approvedAt: '2024-01-20 11:20',
      status: 'reported'
    }
  ];

  const validationRules = [
    { rule: 'Reference Range Check', passed: true, description: 'All values within expected ranges' },
    { rule: 'Delta Check', passed: false, description: 'Significant change from previous result' },
    { rule: 'Critical Value Alert', passed: true, description: 'Critical values flagged for notification' },
    { rule: 'Duplicate Check', passed: true, description: 'No duplicate entries detected' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Result Entry & Approval</h2>
          <p className="text-gray-600">Review, validate, and approve laboratory test results</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Batch Review
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4" />
            Approve Selected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Results</CardTitle>
              <CardDescription>Results awaiting review and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedResults.includes(result.sampleId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedResults([...selectedResults, result.sampleId]);
                            } else {
                              setSelectedResults(selectedResults.filter(id => id !== result.sampleId));
                            }
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.sampleId}</h4>
                          <p className="text-sm text-gray-600">{result.patient}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          result.priority === 'stat' ? 'bg-red-500' :
                          result.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                        } text-white`}>
                          {result.priority}
                        </Badge>
                        <Badge className={`${
                          result.status === 'critical_pending' ? 'bg-red-500' : 'bg-yellow-500'
                        } text-white`}>
                          {result.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">{result.test}</h5>
                      <div className="space-y-2">
                        {result.results.map((param, paramIndex) => (
                          <div key={paramIndex} className={`flex items-center justify-between p-2 rounded ${
                            param.status === 'critical_high' || param.status === 'critical_low' ? 'bg-red-50 border border-red-200' :
                            param.status === 'high' || param.status === 'low' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                          }`}>
                            <span className="font-medium">{param.parameter}</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${
                                param.status === 'critical_high' || param.status === 'critical_low' ? 'text-red-600' :
                                param.status === 'high' || param.status === 'low' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {param.value} {param.unit}
                              </span>
                              <span className="text-sm text-gray-500">({param.reference})</span>
                              {param.status.includes('critical') && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              {param.status.includes('high') && (
                                <TrendingUp className="h-4 w-4 text-yellow-500" />
                              )}
                              {param.status.includes('low') && (
                                <TrendingDown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Analyzer: {result.analyzer}</span>
                        <span className="text-gray-600">Collected: {result.collectedAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {result.status === 'critical_pending' ? (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Critical Review
                          </Button>
                        ) : (
                          <Button size="sm">
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation & Approved Results */}
        <div className="space-y-6">
          {/* Validation Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Validation Status</CardTitle>
              <CardDescription>Automated validation checks for LAB001234</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validationRules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {rule.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rule.rule}</p>
                      <p className="text-xs text-gray-500">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Result Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>Enter results manually when needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sample-id">Sample ID</Label>
                <Input id="sample-id" placeholder="LAB001XXX" />
              </div>
              
              <div>
                <Label htmlFor="test-name">Test Name</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbc">Complete Blood Count</SelectItem>
                    <SelectItem value="bmp">Basic Metabolic Panel</SelectItem>
                    <SelectItem value="lipid">Lipid Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="parameter">Parameter</Label>
                <Input id="parameter" placeholder="e.g., Hemoglobin" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input id="value" placeholder="Result value" />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="Unit" />
                </div>
              </div>
              
              <Button className="w-full">
                Add Result
              </Button>
            </CardContent>
          </Card>

          {/* Recently Approved */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved</CardTitle>
              <CardDescription>Latest approved results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvedResults.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{result.sampleId}</span>
                      <Badge className="bg-green-500 text-white text-xs">
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.patient}</p>
                    <p className="text-sm text-gray-600">{result.test}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{result.approvedBy}</span>
                      <Clock className="h-3 w-3" />
                      <span>{result.approvedAt}</span>
                    </div>
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
