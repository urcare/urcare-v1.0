
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Bed, TrendingUp, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface BedUtilizationData {
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  utilizationRate: number;
  avgLengthOfStay: number;
  turnoverRate: number;
  status: 'good' | 'warning' | 'critical';
}

interface Props {
  dateRange: string;
  department: string;
}

export const BedUtilizationAnalytics = ({ dateRange, department }: Props) => {
  const [selectedView, setSelectedView] = useState('overview');

  const bedUtilizationData: BedUtilizationData[] = [
    {
      department: 'ICU',
      totalBeds: 24,
      occupiedBeds: 22,
      availableBeds: 2,
      utilizationRate: 91.7,
      avgLengthOfStay: 4.2,
      turnoverRate: 0.8,
      status: 'critical'
    },
    {
      department: 'Emergency',
      totalBeds: 18,
      occupiedBeds: 14,
      availableBeds: 4,
      utilizationRate: 77.8,
      avgLengthOfStay: 0.5,
      turnoverRate: 3.2,
      status: 'good'
    },
    {
      department: 'Cardiology',
      totalBeds: 32,
      occupiedBeds: 28,
      availableBeds: 4,
      utilizationRate: 87.5,
      avgLengthOfStay: 3.1,
      turnoverRate: 1.2,
      status: 'warning'
    },
    {
      department: 'Surgery',
      totalBeds: 28,
      occupiedBeds: 21,
      availableBeds: 7,
      utilizationRate: 75.0,
      avgLengthOfStay: 2.8,
      turnoverRate: 1.4,
      status: 'good'
    },
    {
      department: 'Pediatrics',
      totalBeds: 20,
      occupiedBeds: 15,
      availableBeds: 5,
      utilizationRate: 75.0,
      avgLengthOfStay: 2.2,
      turnoverRate: 1.8,
      status: 'good'
    }
  ];

  const utilizationTrendData = [
    { date: '2024-01-15', ICU: 85, Emergency: 70, Cardiology: 82, Surgery: 68 },
    { date: '2024-01-16', ICU: 88, Emergency: 75, Cardiology: 85, Surgery: 72 },
    { date: '2024-01-17', ICU: 92, Emergency: 78, Cardiology: 87, Surgery: 75 },
    { date: '2024-01-18', ICU: 90, Emergency: 80, Cardiology: 89, Surgery: 78 },
    { date: '2024-01-19', ICU: 94, Emergency: 77, Cardiology: 88, Surgery: 73 },
    { date: '2024-01-20', ICU: 91, Emergency: 82, Cardiology: 86, Surgery: 76 },
    { date: '2024-01-21', ICU: 92, Emergency: 78, Cardiology: 88, Surgery: 75 }
  ];

  const bedTypeDistribution = [
    { name: 'General', value: 45, color: '#3b82f6' },
    { name: 'ICU', value: 20, color: '#ef4444' },
    { name: 'Emergency', value: 15, color: '#f59e0b' },
    { name: 'Surgery', value: 12, color: '#10b981' },
    { name: 'Pediatric', value: 8, color: '#8b5cf6' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bed className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalBeds = bedUtilizationData.reduce((sum, dept) => sum + dept.totalBeds, 0);
  const totalOccupied = bedUtilizationData.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
  const overallUtilization = (totalOccupied / totalBeds) * 100;
  const avgLengthOfStay = bedUtilizationData.reduce((sum, dept) => sum + dept.avgLengthOfStay, 0) / bedUtilizationData.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-6 w-6 text-blue-600" />
            Bed Utilization Analytics
          </CardTitle>
          <CardDescription>
            Real-time bed occupancy and utilization monitoring across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bed className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">{totalBeds}</div>
              <div className="text-sm text-gray-600">Total Beds</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalOccupied}</div>
              <div className="text-sm text-gray-600">Occupied</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">{overallUtilization.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Utilization Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">{avgLengthOfStay.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Stay (days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilization Trends</CardTitle>
            <CardDescription>Bed utilization rates over time by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [`${value}%`, 'Utilization']}
                />
                <Legend />
                <Line type="monotone" dataKey="ICU" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Emergency" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Cardiology" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Surgery" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bed Type Distribution</CardTitle>
            <CardDescription>Hospital bed allocation by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bedTypeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {bedTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Bed Utilization</CardTitle>
          <CardDescription>Detailed breakdown by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bedUtilizationData.map((dept) => (
              <Card key={dept.department} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dept.status)}
                      <h3 className="font-semibold">{dept.department}</h3>
                    </div>
                    <Badge className={getStatusColor(dept.status)}>
                      {dept.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Beds</p>
                      <p className="font-bold text-lg">{dept.totalBeds}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Occupied</p>
                      <p className="font-bold text-lg text-blue-600">{dept.occupiedBeds}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available</p>
                      <p className="font-bold text-lg text-green-600">{dept.availableBeds}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Utilization</p>
                      <p className="font-bold text-lg text-purple-600">{dept.utilizationRate}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bed Utilization</span>
                      <span>{dept.utilizationRate}%</span>
                    </div>
                    <Progress 
                      value={dept.utilizationRate} 
                      className={`h-2 ${
                        dept.status === 'critical' ? '[&>div]:bg-red-500' :
                        dept.status === 'warning' ? '[&>div]:bg-yellow-500' : 
                        '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Avg Length of Stay</p>
                      <p className="font-medium">{dept.avgLengthOfStay} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Turnover Rate</p>
                      <p className="font-medium">{dept.turnoverRate}/day</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bed Availability Forecast</CardTitle>
          <CardDescription>Predicted bed availability for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={utilizationTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Area type="monotone" dataKey="ICU" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Emergency" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Cardiology" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="Surgery" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
