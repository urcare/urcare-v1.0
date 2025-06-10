
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  TrendingUp,
  Calendar,
  Ruler,
  Weight,
  Baby,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const PediatricGrowthTracking = () => {
  const [selectedChild, setSelectedChild] = useState('child1');
  const [newMeasurement, setNewMeasurement] = useState({
    height: '',
    weight: '',
    headCircumference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const pediatricPatients = [
    {
      id: 'child1',
      name: 'Emma Johnson',
      age: '3 years 2 months',
      gender: 'female',
      currentHeight: 95.2,
      currentWeight: 14.8,
      heightPercentile: 75,
      weightPercentile: 50,
      lastVisit: '2024-01-10'
    },
    {
      id: 'child2',
      name: 'Lucas Chen',
      age: '1 year 8 months',
      gender: 'male',
      currentHeight: 82.5,
      currentWeight: 11.2,
      heightPercentile: 90,
      weightPercentile: 85,
      lastVisit: '2024-01-08'
    }
  ];

  const growthData = [
    { age: 0, height: 50, weight: 3.5, heightPercentile: 50, weightPercentile: 50 },
    { age: 6, height: 67, weight: 7.8, heightPercentile: 60, weightPercentile: 55 },
    { age: 12, height: 75, weight: 10.2, heightPercentile: 65, weightPercentile: 60 },
    { age: 18, height: 82, weight: 11.5, heightPercentile: 70, weightPercentile: 65 },
    { age: 24, height: 87, weight: 12.8, heightPercentile: 72, weightPercentile: 62 },
    { age: 30, height: 92, weight: 14.1, heightPercentile: 74, weightPercentile: 58 },
    { age: 36, height: 95.2, weight: 14.8, heightPercentile: 75, weightPercentile: 50 }
  ];

  const developmentalMilestones = [
    {
      age: '3 years',
      milestones: [
        { milestone: 'Speaks in sentences', achieved: true, expectedAge: '2-3 years' },
        { milestone: 'Toilet trained', achieved: true, expectedAge: '2-4 years' },
        { milestone: 'Rides tricycle', achieved: false, expectedAge: '3-4 years' },
        { milestone: 'Draws circle', achieved: true, expectedAge: '3-4 years' }
      ]
    }
  ];

  const getPercentileColor = (percentile: number) => {
    if (percentile < 5) return 'text-red-600';
    if (percentile < 25) return 'text-orange-600';
    if (percentile < 75) return 'text-green-600';
    if (percentile < 95) return 'text-blue-600';
    return 'text-purple-600';
  };

  const getPercentileStatus = (percentile: number) => {
    if (percentile < 5) return 'Below 5th percentile';
    if (percentile < 25) return '5th-25th percentile';
    if (percentile < 75) return '25th-75th percentile';
    if (percentile < 95) return '75th-95th percentile';
    return 'Above 95th percentile';
  };

  const selectedPatient = pediatricPatients.find(p => p.id === selectedChild);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="charts" className="w-full">
        <TabsList>
          <TabsTrigger value="charts">Growth Charts</TabsTrigger>
          <TabsTrigger value="milestones">Developmental Milestones</TabsTrigger>
          <TabsTrigger value="measurements">New Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Patient Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pediatricPatients.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer transition-all ${selectedChild === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                    onClick={() => setSelectedChild(patient.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.age}</div>
                        <div className="flex gap-4 text-sm">
                          <div>Height: {patient.currentHeight}cm</div>
                          <div>Weight: {patient.currentWeight}kg</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPercentileColor(patient.heightPercentile)}>
                            Height: {patient.heightPercentile}th percentile
                          </Badge>
                          <Badge className={getPercentileColor(patient.weightPercentile)}>
                            Weight: {patient.weightPercentile}th percentile
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth Charts */}
          {selectedPatient && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Height Growth Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" label={{ value: 'Age (months)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="5 5" label="5th percentile" />
                      <ReferenceLine y={95} stroke="#10b981" strokeDasharray="5 5" label="50th percentile" />
                      <ReferenceLine y={140} stroke="#3b82f6" strokeDasharray="5 5" label="95th percentile" />
                      <Line type="monotone" dataKey="height" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Weight className="h-5 w-5" />
                    Weight Growth Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" label={{ value: 'Age (months)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <ReferenceLine y={2} stroke="#ef4444" strokeDasharray="5 5" label="5th percentile" />
                      <ReferenceLine y={12} stroke="#10b981" strokeDasharray="5 5" label="50th percentile" />
                      <ReferenceLine y={22} stroke="#3b82f6" strokeDasharray="5 5" label="95th percentile" />
                      <Line type="monotone" dataKey="weight" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Current Status */}
          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Growth Status - {selectedPatient.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Current Height</Label>
                      <div className="text-2xl font-bold">{selectedPatient.currentHeight} cm</div>
                      <div className={`text-sm ${getPercentileColor(selectedPatient.heightPercentile)}`}>
                        {selectedPatient.heightPercentile}th percentile - {getPercentileStatus(selectedPatient.heightPercentile)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Current Weight</Label>
                      <div className="text-2xl font-bold">{selectedPatient.currentWeight} kg</div>
                      <div className={`text-sm ${getPercentileColor(selectedPatient.weightPercentile)}`}>
                        {selectedPatient.weightPercentile}th percentile - {getPercentileStatus(selectedPatient.weightPercentile)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">BMI Status</Label>
                      <div className="text-lg font-medium">Normal Range</div>
                      <div className="text-sm text-gray-600">BMI: 16.4 (healthy weight)</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Growth Velocity</Label>
                      <div className="text-lg font-medium text-green-600">Normal</div>
                      <div className="text-sm text-gray-600">Growing at expected rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Developmental Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {developmentalMilestones.map((ageGroup, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-medium">{ageGroup.age} Milestones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ageGroup.milestones.map((milestone, mIndex) => (
                      <div key={mIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                        {milestone.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{milestone.milestone}</div>
                          <div className="text-sm text-gray-600">Expected: {milestone.expectedAge}</div>
                        </div>
                        <Badge variant={milestone.achieved ? "default" : "secondary"}>
                          {milestone.achieved ? "Achieved" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Record New Measurements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                      value={newMeasurement.height}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      value={newMeasurement.weight}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="headCircumference">Head Circumference (cm)</Label>
                    <Input
                      id="headCircumference"
                      type="number"
                      placeholder="Enter head circumference"
                      value={newMeasurement.headCircumference}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, headCircumference: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Measurement Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeasurement.date}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Record Measurements & Calculate Percentiles
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
