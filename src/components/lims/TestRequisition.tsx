
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock,
  User,
  FileText,
  Stethoscope
} from 'lucide-react';

export const TestRequisition = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const testCategories = [
    {
      name: 'Hematology',
      tests: [
        { code: 'CBC', name: 'Complete Blood Count', turnaround: '2h', price: 25.00 },
        { code: 'PT/INR', name: 'Prothrombin Time/INR', turnaround: '1h', price: 30.00 },
        { code: 'ESR', name: 'Erythrocyte Sedimentation Rate', turnaround: '1h', price: 15.00 }
      ]
    },
    {
      name: 'Chemistry',
      tests: [
        { code: 'BMP', name: 'Basic Metabolic Panel', turnaround: '1h', price: 35.00 },
        { code: 'CMP', name: 'Comprehensive Metabolic Panel', turnaround: '2h', price: 50.00 },
        { code: 'LIPID', name: 'Lipid Panel', turnaround: '2h', price: 40.00 },
        { code: 'HBA1C', name: 'Hemoglobin A1c', turnaround: '3h', price: 45.00 }
      ]
    },
    {
      name: 'Cardiac Markers',
      tests: [
        { code: 'TROP', name: 'Troponin I', turnaround: '30min', price: 55.00, stat: true },
        { code: 'BNP', name: 'B-type Natriuretic Peptide', turnaround: '1h', price: 65.00 },
        { code: 'CK-MB', name: 'Creatine Kinase-MB', turnaround: '1h', price: 40.00 }
      ]
    },
    {
      name: 'Microbiology',
      tests: [
        { code: 'CULTURE', name: 'Blood Culture', turnaround: '48-72h', price: 75.00 },
        { code: 'URINE', name: 'Urine Culture', turnaround: '24-48h', price: 50.00 },
        { code: 'SENS', name: 'Antibiotic Sensitivity', turnaround: '24h', price: 35.00 }
      ]
    }
  ];

  const recentRequisitions = [
    {
      id: 'REQ001234',
      patient: 'John Smith (PT001845)',
      physician: 'Dr. Sarah Johnson',
      tests: ['CBC', 'BMP', 'Lipid Panel'],
      priority: 'routine',
      status: 'pending',
      created: '2024-01-20 14:30'
    },
    {
      id: 'REQ001235',
      patient: 'Emily Davis (PT001846)',
      physician: 'Dr. Michael Chen',
      tests: ['Troponin I', 'BNP'],
      priority: 'stat',
      status: 'approved',
      created: '2024-01-20 13:45'
    },
    {
      id: 'REQ001236',
      patient: 'Robert Wilson (PT001847)',
      physician: 'Dr. Lisa Park',
      tests: ['Blood Culture', 'Urine Culture'],
      priority: 'urgent',
      status: 'in_progress',
      created: '2024-01-20 12:15'
    }
  ];

  const handleTestSelection = (testCode: string) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(t => t !== testCode)
        : [...prev, testCode]
    );
  };

  const getSelectedTestsTotal = () => {
    let total = 0;
    testCategories.forEach(category => {
      category.tests.forEach(test => {
        if (selectedTests.includes(test.code)) {
          total += test.price;
        }
      });
    });
    return total;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Requisition</h2>
          <p className="text-gray-600">Order laboratory tests with priority and bulk ordering capabilities</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Bulk Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Tests</CardTitle>
              <CardDescription>Select tests to add to requisition</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                    <div className="space-y-2">
                      {category.tests.map((test, testIndex) => (
                        <div key={testIndex} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedTests.includes(test.code)}
                              onCheckedChange={() => handleTestSelection(test.code)}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{test.name}</span>
                                <span className="text-sm text-gray-500">({test.code})</span>
                                {test.stat && (
                                  <Badge className="bg-red-500 text-white text-xs">STAT</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{test.turnaround}</span>
                                </div>
                                <span>${test.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requisition Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Requisition</CardTitle>
              <CardDescription>Create a new test requisition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="patient" placeholder="Search patient..." className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="physician">Ordering Physician</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="physician" placeholder="Dr. Name" className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="clinical-info">Clinical Information</Label>
                <Input id="clinical-info" placeholder="Brief clinical details..." />
              </div>

              <div>
                <Label>Selected Tests ({selectedTests.length})</Label>
                <div className="border rounded-lg p-3 min-h-[100px] bg-gray-50">
                  {selectedTests.length === 0 ? (
                    <p className="text-gray-500 text-sm">No tests selected</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedTests.map((testCode, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {testCode}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total: ${getSelectedTestsTotal().toFixed(2)}</span>
                <Button disabled={selectedTests.length === 0}>
                  Create Requisition
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Requisitions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Requisitions</CardTitle>
              <CardDescription>Latest test orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRequisitions.map((req, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{req.id}</span>
                      <Badge className={`${
                        req.status === 'approved' ? 'bg-green-500' :
                        req.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                      } text-white text-xs`}>
                        {req.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{req.patient}</p>
                    <p className="text-sm text-gray-600">{req.physician}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${
                        req.priority === 'stat' ? 'bg-red-500' :
                        req.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                      } text-white text-xs`}>
                        {req.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{req.created}</span>
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
