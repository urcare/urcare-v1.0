
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  Zap, 
  Phone,
  Bell,
  Activity,
  Users,
  MonitorSpeaker,
  Siren,
  RefreshCw
} from 'lucide-react';

export const EmergencyRadiology = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRouting, setAutoRouting] = useState(true);

  const statExams = [
    {
      id: 'STAT001',
      patient: 'John Doe',
      age: 45,
      study: 'Head CT',
      indication: 'Acute stroke symptoms',
      ordered: '15:23',
      priority: 'STAT',
      timeElapsed: 8,
      targetTime: 15,
      status: 'Scanning',
      location: 'ED Bay 3',
      radiologist: 'Dr. Smith',
      contact: '+1-555-0123'
    },
    {
      id: 'STAT002',
      patient: 'Jane Smith',
      age: 32,
      study: 'Chest CT',
      indication: 'Trauma, MVA',
      ordered: '15:18',
      priority: 'STAT',
      timeElapsed: 13,
      targetTime: 15,
      status: 'Reading',
      location: 'Trauma Bay 1',
      radiologist: 'Dr. Johnson',
      contact: '+1-555-0124'
    },
    {
      id: 'STAT003',
      patient: 'Robert Brown',
      age: 67,
      study: 'Abdominal CT',
      indication: 'Acute abdomen',
      ordered: '15:15',
      priority: 'STAT',
      timeElapsed: 16,
      targetTime: 15,
      status: 'Completed',
      location: 'ED Bay 7',
      radiologist: 'Dr. Wilson',
      contact: '+1-555-0125'
    }
  ];

  const urgentExams = [
    {
      id: 'URG001',
      patient: 'Sarah Davis',
      study: 'Chest X-Ray',
      indication: 'SOB, r/o pneumonia',
      ordered: '14:45',
      timeElapsed: 46,
      targetTime: 60,
      status: 'Queue'
    },
    {
      id: 'URG002',
      patient: 'Mike Wilson',
      study: 'CT Abdomen/Pelvis',
      indication: 'Acute pain',
      ordered: '14:30',
      timeElapsed: 61,
      targetTime: 60,
      status: 'Overdue'
    }
  ];

  const performanceMetrics = {
    statCompliance: 87,
    urgentCompliance: 92,
    avgStatTime: 12.4,
    avgUrgentTime: 45.2,
    totalStatToday: 23,
    totalUrgentToday: 67,
    criticalResults: 5,
    escalations: 2
  };

  const criticalResults = [
    {
      id: 'CR001',
      patient: 'Jennifer Lee',
      finding: 'Large vessel occlusion - MCA',
      study: 'Head CTA',
      timeToCall: 4,
      contacted: 'Dr. Neurologist',
      status: 'Acknowledged'
    },
    {
      id: 'CR002',
      patient: 'David Miller',
      finding: 'Massive pulmonary embolism',
      study: 'Chest CTA',
      timeToCall: 2,
      contacted: 'ED Physician',
      status: 'Pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Emergency Radiology</h3>
          <p className="text-gray-600">STAT exam prioritization and real-time status tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert Settings
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
            <Siren className="h-4 w-4" />
            Emergency Dashboard
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{performanceMetrics.totalStatToday}</p>
                <p className="text-sm text-red-700">STAT Exams Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">{performanceMetrics.totalUrgentToday}</p>
                <p className="text-sm text-orange-700">Urgent Exams Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{performanceMetrics.criticalResults}</p>
                <p className="text-sm text-purple-700">Critical Results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{performanceMetrics.statCompliance}%</p>
                <p className="text-sm text-blue-700">STAT Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STAT Exams */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Siren className="h-5 w-5 text-red-600" />
                STAT Examinations
              </CardTitle>
              <CardDescription>High priority imaging studies requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statExams.map((exam, index) => (
                  <div key={index} className={`border-l-4 rounded-lg p-4 ${
                    exam.status === 'Overdue' || exam.timeElapsed > exam.targetTime ? 'border-l-red-500 bg-red-50' :
                    exam.status === 'Scanning' ? 'border-l-yellow-500 bg-yellow-50' :
                    exam.status === 'Reading' ? 'border-l-blue-500 bg-blue-50' :
                    'border-l-green-500 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h5 className="font-bold text-lg text-gray-900">{exam.patient}</h5>
                          <p className="text-sm text-gray-600">{exam.study} • Age: {exam.age}</p>
                          <p className="text-sm font-medium text-gray-800">{exam.indication}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          exam.status === 'Scanning' ? 'bg-yellow-500' :
                          exam.status === 'Reading' ? 'bg-blue-500' :
                          exam.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {exam.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{exam.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Time Progress</span>
                          <span className={`text-sm font-medium ${
                            exam.timeElapsed > exam.targetTime ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {exam.timeElapsed}/{exam.targetTime} min
                          </span>
                        </div>
                        <Progress 
                          value={(exam.timeElapsed / exam.targetTime) * 100}
                          className={`w-full ${
                            exam.timeElapsed > exam.targetTime ? 'bg-red-200' : 'bg-green-200'
                          }`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Ordered: {exam.ordered}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Assigned Radiologist</p>
                        <p className="text-sm font-medium text-gray-900">{exam.radiologist}</p>
                        <p className="text-sm text-gray-600">{exam.contact}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <MonitorSpeaker className="h-3 w-3 mr-1" />
                            Page
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgent Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Urgent Examinations
              </CardTitle>
              <CardDescription>Time-sensitive studies requiring expedited processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentExams.map((exam, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${
                    exam.status === 'Overdue' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{exam.patient}</h5>
                        <p className="text-sm text-gray-600">{exam.study}</p>
                        <p className="text-xs text-gray-500">{exam.indication}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          exam.status === 'Overdue' ? 'border-red-500 text-red-700' : 'border-orange-500 text-orange-700'
                        }`}>
                          {exam.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {exam.timeElapsed}/{exam.targetTime} min
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Results & Alerts */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                Critical Results
              </CardTitle>
              <CardDescription>Urgent findings requiring immediate communication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalResults.map((result, index) => (
                  <div key={index} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-purple-900">{result.patient}</h5>
                      <Badge variant="outline" className={`${
                        result.status === 'Acknowledged' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                      }`}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-purple-800">{result.finding}</p>
                    <p className="text-xs text-purple-600">{result.study}</p>
                    <div className="mt-2 pt-2 border-t border-purple-200">
                      <p className="text-xs text-purple-600">
                        Contacted: {result.contacted} in {result.timeToCall} min
                      </p>
                      {result.status === 'Pending' && (
                        <Button size="sm" className="mt-2 w-full bg-purple-600 hover:bg-purple-700">
                          <Phone className="h-3 w-3 mr-1" />
                          Call Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Emergency Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Alert Notifications</span>
                <input
                  type="checkbox"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Routing</span>
                <input
                  type="checkbox"
                  checked={autoRouting}
                  onChange={(e) => setAutoRouting(e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="pt-2 border-t">
                <Button size="sm" className="w-full flex items-center gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Refresh Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance Today</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>STAT Compliance</span>
                <span className="font-medium text-green-600">{performanceMetrics.statCompliance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Urgent Compliance</span>
                <span className="font-medium text-green-600">{performanceMetrics.urgentCompliance}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg STAT Time</span>
                <span className="font-medium">{performanceMetrics.avgStatTime} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Escalations</span>
                <span className="font-medium text-orange-600">{performanceMetrics.escalations}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
