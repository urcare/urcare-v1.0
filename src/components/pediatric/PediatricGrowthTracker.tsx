
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Baby, TrendingUp, Calendar, Ruler } from 'lucide-react';
import { toast } from 'sonner';

interface GrowthMeasurement {
  date: string;
  age: number;
  weight: number;
  height: number;
  headCircumference?: number;
  percentileWeight: number;
  percentileHeight: number;
}

interface VaccinationRecord {
  id: string;
  vaccine: string;
  date: string;
  nextDue?: string;
  status: 'completed' | 'due' | 'overdue';
}

export const PediatricGrowthTracker = () => {
  const [activeTab, setActiveTab] = useState('growth');
  const [newMeasurement, setNewMeasurement] = useState({
    weight: '',
    height: '',
    headCircumference: ''
  });

  const [growthData, setGrowthData] = useState<GrowthMeasurement[]>([
    { date: '2024-01-15', age: 6, weight: 20.5, height: 115, percentileWeight: 75, percentileHeight: 80 },
    { date: '2024-02-15', age: 7, weight: 21.2, height: 117, percentileWeight: 78, percentileHeight: 82 },
    { date: '2024-03-15', age: 8, weight: 21.8, height: 119, percentileWeight: 80, percentileHeight: 85 },
    { date: '2024-04-15', age: 9, weight: 22.5, height: 121, percentileWeight: 82, percentileHeight: 87 },
    { date: '2024-05-15', age: 10, weight: 23.1, height: 123, percentileWeight: 83, percentileHeight: 88 }
  ]);

  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([
    { id: '1', vaccine: 'MMR Booster', date: '2024-01-15', status: 'completed' },
    { id: '2', vaccine: 'Tdap', date: '2024-02-10', status: 'completed' },
    { id: '3', vaccine: 'HPV (1st dose)', date: '2024-03-20', nextDue: '2024-09-20', status: 'completed' },
    { id: '4', vaccine: 'Flu Shot', date: '', nextDue: '2024-10-01', status: 'due' },
    { id: '5', vaccine: 'HPV (2nd dose)', date: '', nextDue: '2024-09-20', status: 'due' }
  ]);

  const handleAddMeasurement = () => {
    if (!newMeasurement.weight || !newMeasurement.height) {
      toast.error('Please enter both weight and height');
      return;
    }

    const measurement: GrowthMeasurement = {
      date: new Date().toISOString().split('T')[0],
      age: growthData.length + 6,
      weight: parseFloat(newMeasurement.weight),
      height: parseFloat(newMeasurement.height),
      headCircumference: newMeasurement.headCircumference ? parseFloat(newMeasurement.headCircumference) : undefined,
      percentileWeight: Math.floor(Math.random() * 40) + 50, // Simulated percentile
      percentileHeight: Math.floor(Math.random() * 40) + 50
    };

    setGrowthData(prev => [...prev, measurement]);
    setNewMeasurement({ weight: '', height: '', headCircumference: '' });
    toast.success('Growth measurement added successfully!');
  };

  const getVaccinationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-6 w-6 text-pink-600" />
            Pediatric Growth & Development Tracker
          </CardTitle>
          <CardDescription>
            Comprehensive monitoring of child's growth, development, and immunizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Growth</h3>
              <p className="text-sm text-gray-600">Height & Weight</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Vaccines</h3>
              <p className="text-sm text-gray-600">Immunization</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Ruler className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Milestones</h3>
              <p className="text-sm text-gray-600">Development</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Baby className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Nutrition</h3>
              <p className="text-sm text-gray-600">Diet Tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Growth Charts</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Measurement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newMeasurement.weight}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Enter weight"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={newMeasurement.height}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="Enter height"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="headCircumference">Head Circumference (cm) - Optional</Label>
                  <Input
                    id="headCircumference"
                    type="number"
                    step="0.1"
                    value={newMeasurement.headCircumference}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, headCircumference: e.target.value }))}
                    placeholder="Enter head circumference"
                  />
                </div>
                <Button onClick={handleAddMeasurement} className="w-full">
                  Add Measurement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Current Weight</span>
                    <span className="text-xl font-bold text-blue-600">
                      {growthData[growthData.length - 1]?.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Current Height</span>
                    <span className="text-xl font-bold text-green-600">
                      {growthData[growthData.length - 1]?.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Weight Percentile</span>
                    <span className="text-xl font-bold text-purple-600">
                      {growthData[growthData.length - 1]?.percentileWeight}th
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Growth Chart - Weight Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Chart - Height Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="height" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Schedule</CardTitle>
              <CardDescription>
                Track completed and upcoming immunizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vaccinations.map((vaccination) => (
                  <div key={vaccination.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{vaccination.vaccine}</h3>
                      <p className="text-sm text-gray-600">
                        {vaccination.status === 'completed' 
                          ? `Completed: ${vaccination.date}`
                          : `Due: ${vaccination.nextDue}`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVaccinationStatusColor(vaccination.status)}`}>
                        {vaccination.status.toUpperCase()}
                      </span>
                      {vaccination.status !== 'completed' && (
                        <Button size="sm">Schedule</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Developmental Milestones</CardTitle>
              <CardDescription>
                Track physical, cognitive, and social development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Physical Development (Age 6-7)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Can ride a bicycle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Can tie shoelaces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Can skip and hop on one foot</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Cognitive Development</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Can read simple sentences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Understands time concepts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Can solve simple math problems</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Tracking</CardTitle>
              <CardDescription>
                Monitor dietary intake and nutritional needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Daily Nutrition Goals</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Fruits & Vegetables</span>
                      <span className="text-sm text-green-600">5 servings ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dairy</span>
                      <span className="text-sm text-yellow-600">2/3 servings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Protein</span>
                      <span className="text-sm text-green-600">3 servings ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Water</span>
                      <span className="text-sm text-yellow-600">4/6 cups</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Growth Nutrition Alerts</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Calcium intake adequate for bone development
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠ Consider increasing iron-rich foods
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
