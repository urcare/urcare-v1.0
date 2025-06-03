
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Fingerprint,
  Camera,
  Wifi,
  WifiOff,
  Download,
  Users
} from 'lucide-react';

export const GeoAttendanceSystem = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');

  const attendanceData = [
    { id: '1', name: 'Dr. Sarah Wilson', department: 'Cardiology', status: 'present', checkIn: '08:30', location: 'Main Building' },
    { id: '2', name: 'Nurse John Smith', department: 'ICU', status: 'present', checkIn: '07:00', location: 'ICU Ward' },
    { id: '3', name: 'Dr. Mike Johnson', department: 'Emergency', status: 'late', checkIn: '09:15', location: 'Emergency Wing' },
    { id: '4', name: 'Nurse Lisa Brown', department: 'Pediatrics', status: 'absent', checkIn: '-', location: '-' }
  ];

  const biometricDevices = [
    { id: '1', name: 'Main Entrance', type: 'Fingerprint', status: 'online', location: 'Building A' },
    { id: '2', name: 'ICU Entry', type: 'Face Recognition', status: 'online', location: 'ICU Floor' },
    { id: '3', name: 'Staff Cafeteria', type: 'RFID Badge', status: 'offline', location: 'Ground Floor' },
    { id: '4', name: 'Emergency Wing', type: 'Fingerprint', status: 'online', location: 'Emergency Dept' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { label: 'Present', className: 'bg-green-100 text-green-800' },
      late: { label: 'Late', className: 'bg-yellow-100 text-yellow-800' },
      absent: { label: 'Absent', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geo & Biometric Attendance</h2>
          <p className="text-gray-600">Real-time attendance tracking with location verification</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            View Geofences
          </Button>
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">234</div>
                <div className="text-sm text-gray-600">Present Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Late Arrivals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-600">Overtime Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Check-in Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Mobile Check-in/Check-out
          </CardTitle>
          <CardDescription>Quick attendance marking with photo verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">Current Location</h4>
                  <p className="text-sm text-blue-700">Main Hospital Building - Verified</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  disabled={attendanceStatus === 'checked-in'}
                  onClick={() => setAttendanceStatus('checked-in')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check In
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  disabled={attendanceStatus === 'checked-out'}
                  onClick={() => setAttendanceStatus('checked-out')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Check Out
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Take selfie for verification</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Capture Photo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biometric Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Biometric Device Status
          </CardTitle>
          <CardDescription>Real-time status of biometric attendance devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {biometricDevices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{device.name}</h4>
                  {device.status === 'online' ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{device.type}</p>
                <p className="text-xs text-gray-500">{device.location}</p>
                <Badge 
                  className={`mt-2 ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {device.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Attendance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Live Attendance Dashboard</CardTitle>
          <CardDescription>Real-time staff attendance with location tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{staff.name}</h4>
                    <p className="text-sm text-gray-600">{staff.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{staff.checkIn}</p>
                    <p className="text-xs text-gray-500">{staff.location}</p>
                  </div>
                  {getStatusBadge(staff.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Patterns & Analytics</CardTitle>
          <CardDescription>Attendance trends and anomaly detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Department Attendance</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ICU</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emergency</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cardiology</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Shift Performance</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Morning (6AM-2PM)</span>
                    <span>96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Evening (2PM-10PM)</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Night (10PM-6AM)</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Weekly Trends</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span className="text-green-600">+2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span className="text-green-600">+1.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span className="text-red-600">-0.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span className="text-green-600">+0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="text-red-600">-1.2%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
