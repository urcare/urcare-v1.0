
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Scan, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
  Truck,
  User
} from 'lucide-react';

export const SampleTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const samples = [
    {
      id: 'LAB001234',
      patientId: 'PT001845',
      patientName: 'John Smith',
      tests: ['CBC', 'BMP', 'Lipid Panel'],
      priority: 'routine',
      status: 'processing',
      collectedAt: '2024-01-20 08:30',
      location: 'Hematology Lab',
      progress: 65,
      estimatedCompletion: '2024-01-20 16:00',
      technician: 'Sarah Johnson'
    },
    {
      id: 'LAB001235',
      patientId: 'PT001846',
      patientName: 'Emily Davis',
      tests: ['Troponin I', 'BNP'],
      priority: 'stat',
      status: 'analysis',
      collectedAt: '2024-01-20 14:15',
      location: 'Chemistry Lab',
      progress: 85,
      estimatedCompletion: '2024-01-20 17:30',
      technician: 'Mike Chen'
    },
    {
      id: 'LAB001236',
      patientId: 'PT001847',
      patientName: 'Robert Wilson',
      tests: ['Culture', 'Sensitivity'],
      priority: 'urgent',
      status: 'pending',
      collectedAt: '2024-01-20 09:45',
      location: 'Microbiology Lab',
      progress: 25,
      estimatedCompletion: '2024-01-22 10:00',
      technician: 'Lisa Park'
    },
    {
      id: 'LAB001237',
      patientId: 'PT001848',
      patientName: 'Maria Garcia',
      tests: ['Glucose', 'HbA1c'],
      priority: 'routine',
      status: 'complete',
      collectedAt: '2024-01-19 16:20',
      location: 'Chemistry Lab',
      progress: 100,
      estimatedCompletion: '2024-01-20 08:00',
      technician: 'David Kim'
    }
  ];

  const trackingHistory = [
    { time: '08:30', event: 'Sample collected', location: 'Emergency Department', user: 'Nurse Wilson' },
    { time: '08:45', event: 'Sample received in lab', location: 'Main Lab', user: 'Lab Tech Adams' },
    { time: '09:15', event: 'Sample processing started', location: 'Chemistry Lab', user: 'Sarah Johnson' },
    { time: '11:30', event: 'Analysis in progress', location: 'Analyzer Station 3', user: 'Automated' },
    { time: '14:20', event: 'Quality control passed', location: 'QC Station', user: 'Mike Chen' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sample Tracking</h2>
          <p className="text-gray-600">Real-time sample lifecycle management and tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan Barcode
          </Button>
          <Button className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Register Sample
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Samples</CardTitle>
              <CardDescription>Track all samples in the laboratory workflow</CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by sample ID, patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samples.map((sample, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{sample.id}</h4>
                          <p className="text-sm text-gray-600">{sample.patientName} ({sample.patientId})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          sample.priority === 'stat' ? 'bg-red-500' :
                          sample.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                        } text-white`}>
                          {sample.priority}
                        </Badge>
                        <Badge className={`${
                          sample.status === 'complete' ? 'bg-green-500' :
                          sample.status === 'analysis' ? 'bg-purple-500' :
                          sample.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                        } text-white`}>
                          {sample.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Tests</p>
                        <p className="font-medium">{sample.tests.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">{sample.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Technician</p>
                        <p className="font-medium">{sample.technician}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ETA</p>
                        <p className="font-medium">{sample.estimatedCompletion}</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{sample.progress}%</span>
                      </div>
                      <Progress value={sample.progress} className="h-2" />
                    </div>
                    
                    <p className="text-xs text-gray-500">Collected: {sample.collectedAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Details */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Details</CardTitle>
            <CardDescription>Detailed tracking information for LAB001234</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FlaskConical className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">LAB001234</h4>
                  <p className="text-sm text-blue-700">John Smith (PT001845)</p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Tracking History</h5>
                {trackingHistory.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === trackingHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      {index < trackingHistory.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{event.event}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                        <User className="h-3 w-3" />
                        <span>{event.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">Current Status</h5>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sample processing in progress</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>Hematology Lab - Station 2</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-purple-500" />
                  <span>Assigned to Sarah Johnson</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
