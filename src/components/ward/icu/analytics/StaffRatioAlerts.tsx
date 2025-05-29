
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Clock, UserCheck, Phone, Shield } from 'lucide-react';

interface StaffAlert {
  shiftId: string;
  shift: 'day' | 'evening' | 'night';
  shiftStart: Date;
  shiftEnd: Date;
  currentRatio: number;
  requiredRatio: number;
  safetyLevel: 'safe' | 'borderline' | 'unsafe' | 'critical';
  patientsAssigned: number;
  staffPresent: number;
  staffRequired: number;
  acuityScore: number;
  criticalPatients: number;
  alerts: {
    type: 'understaffed' | 'high_acuity' | 'break_coverage' | 'overtime_risk';
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeTriggered: Date;
  }[];
  recommendations: string[];
  availableCallIns: string[];
}

const mockStaffAlerts: StaffAlert[] = [
  {
    shiftId: 'SHIFT001',
    shift: 'day',
    shiftStart: new Date(Date.now() - 4 * 60 * 60 * 1000),
    shiftEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
    currentRatio: 1.8,
    requiredRatio: 2.0,
    safetyLevel: 'unsafe',
    patientsAssigned: 18,
    staffPresent: 10,
    staffRequired: 12,
    acuityScore: 85,
    criticalPatients: 6,
    alerts: [
      {
        type: 'understaffed',
        message: 'Current nurse-to-patient ratio below safe standards',
        priority: 'high',
        timeTriggered: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        type: 'high_acuity',
        message: 'High acuity score with insufficient experienced staff',
        priority: 'medium',
        timeTriggered: new Date(Date.now() - 15 * 60 * 1000)
      }
    ],
    recommendations: [
      'Call in additional nurse immediately',
      'Consider float pool staff',
      'Reassign non-critical patients',
      'Notify supervisor'
    ],
    availableCallIns: ['Nurse Martinez (30 min)', 'Nurse Thompson (45 min)', 'Float Pool (60 min)']
  },
  {
    shiftId: 'SHIFT002',
    shift: 'evening',
    shiftStart: new Date(Date.now() + 4 * 60 * 60 * 1000),
    shiftEnd: new Date(Date.now() + 12 * 60 * 60 * 1000),
    currentRatio: 2.2,
    requiredRatio: 2.0,
    safetyLevel: 'safe',
    patientsAssigned: 16,
    staffPresent: 8,
    staffRequired: 8,
    acuityScore: 62,
    criticalPatients: 3,
    alerts: [],
    recommendations: [
      'Monitor for any changes in patient acuity',
      'Prepare for potential admissions'
    ],
    availableCallIns: ['Nurse Wilson (15 min)', 'Nurse Davis (30 min)']
  }
];

export const StaffRatioAlerts = () => {
  const [alerts, setAlerts] = useState<StaffAlert[]>(mockStaffAlerts);

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white animate-pulse';
      case 'unsafe': return 'bg-red-500 text-white';
      case 'borderline': return 'bg-yellow-500 text-white';
      case 'safe': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getShiftTime = (start: Date, end: Date) => {
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const handleCallStaff = (shiftId: string, staffMember: string) => {
    console.log(`Calling ${staffMember} for shift ${shiftId}`);
    // Implementation for calling staff
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Ratio Safety Alerts
          </CardTitle>
          <CardDescription>
            Real-time monitoring of nurse-to-patient ratios and automated alerts for unsafe staffing levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-gray-600">Safe Shifts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Unsafe Ratios</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <UserCheck className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">18</p>
                  <p className="text-sm text-gray-600">Staff on Duty</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                  <p className="text-sm text-gray-600">Available Call-ins</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {alerts.map((alert) => (
              <Card key={alert.shiftId} className={`border-l-4 ${alert.safetyLevel === 'unsafe' || alert.safetyLevel === 'critical' ? 'border-l-red-600' : alert.safetyLevel === 'borderline' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg capitalize">{alert.shift} Shift</h3>
                      <Badge variant="outline">{getShiftTime(alert.shiftStart, alert.shiftEnd)}</Badge>
                      <Badge className={getSafetyColor(alert.safetyLevel)}>
                        {alert.safetyLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Ratio: {alert.currentRatio}:1 (Required: {alert.requiredRatio}:1)</p>
                      <p className="text-sm text-gray-500">Acuity Score: {alert.acuityScore}/100</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Staffing Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Staff Present:</span>
                          <span className="font-medium">{alert.staffPresent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Staff Required:</span>
                          <span className="font-medium">{alert.staffRequired}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Patients:</span>
                          <span className="font-medium">{alert.patientsAssigned}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Critical Patients:</span>
                          <span className="font-medium text-red-600">{alert.criticalPatients}</span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Staffing Level</span>
                            <span className="text-sm">{Math.round((alert.staffPresent / alert.staffRequired) * 100)}%</span>
                          </div>
                          <Progress value={(alert.staffPresent / alert.staffRequired) * 100} className="h-2" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Active Alerts</h4>
                      <div className="space-y-2">
                        {alert.alerts.length > 0 ? (
                          alert.alerts.map((alertItem, index) => (
                            <div key={index} className="p-2 border rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                <span className={`text-sm font-medium ${getPriorityColor(alertItem.priority)}`}>
                                  {alertItem.priority.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{alertItem.message}</p>
                              <p className="text-xs text-gray-500">{formatTimeSince(alertItem.timeTriggered)}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-green-600">No active alerts</p>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Available Call-ins</h4>
                      <div className="space-y-2">
                        {alert.availableCallIns.map((staff, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm">{staff}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCallStaff(alert.shiftId, staff)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 mb-4">
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {alert.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm p-2 bg-yellow-50 rounded flex items-center gap-2">
                          <UserCheck className="h-3 w-3 text-yellow-600" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    {alert.safetyLevel === 'unsafe' || alert.safetyLevel === 'critical' ? (
                      <>
                        <Button size="sm" variant="default">
                          <Phone className="h-4 w-4 mr-1" />
                          Emergency Call-in
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Notify Supervisor
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Users className="h-4 w-4 mr-1" />
                        Monitor Situation
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Update Staffing
                    </Button>
                    <Button size="sm" variant="outline">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
