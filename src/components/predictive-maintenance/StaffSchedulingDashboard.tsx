
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  UserCheck,
  UserX,
  Shield,
  Star
} from 'lucide-react';

export const StaffSchedulingDashboard = () => {
  const [staffSchedule] = useState([
    {
      id: 'NURSE-001',
      name: 'Sarah Johnson',
      role: 'Registered Nurse',
      department: 'ICU',
      shift: 'Day (7AM-7PM)',
      skillLevel: 'Senior',
      workloadScore: 85,
      fatigueLevel: 'moderate',
      availability: 'available',
      competencies: ['Critical Care', 'Ventilator Management', 'ECMO'],
      scheduledHours: 12,
      overtimeRisk: false,
      patientRatio: '1:2'
    },
    {
      id: 'DOC-002',
      name: 'Dr. Michael Chen',
      role: 'Attending Physician',
      department: 'Emergency',
      shift: 'Night (7PM-7AM)',
      skillLevel: 'Senior',
      workloadScore: 92,
      fatigueLevel: 'high',
      availability: 'on_duty',
      competencies: ['Emergency Medicine', 'Trauma', 'Cardiology'],
      scheduledHours: 12,
      overtimeRisk: true,
      patientRatio: '1:8'
    },
    {
      id: 'TECH-003',
      name: 'James Wilson',
      role: 'Respiratory Therapist',
      department: 'ICU',
      shift: 'Day (7AM-7PM)',
      skillLevel: 'Intermediate',
      workloadScore: 78,
      fatigueLevel: 'low',
      availability: 'available',
      competencies: ['Mechanical Ventilation', 'BIPAP/CPAP', 'Arterial Blood Gas'],
      scheduledHours: 12,
      overtimeRisk: false,
      patientRatio: '1:6'
    },
    {
      id: 'NURSE-004',
      name: 'Emily Rodriguez',
      role: 'Charge Nurse',
      department: 'General Ward',
      shift: 'Evening (3PM-11PM)',
      skillLevel: 'Senior',
      workloadScore: 88,
      fatigueLevel: 'moderate',
      availability: 'break',
      competencies: ['Leadership', 'Medication Administration', 'Patient Education'],
      scheduledHours: 8,
      overtimeRisk: false,
      patientRatio: '1:5'
    }
  ]);

  const [schedulingMetrics] = useState({
    totalStaff: 245,
    onDuty: 89,
    optimalStaffing: 94.2,
    coverageGaps: 3,
    overtimeRisk: 12,
    fatigueAlerts: 8
  });

  const getWorkloadColor = (score) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getFatigueColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-700 border-red-300';
      case 'moderate': return 'text-yellow-700 border-yellow-300';
      case 'low': return 'text-green-700 border-green-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'on_duty': return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'break': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'unavailable': return <UserX className="h-4 w-4 text-red-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSkillIcon = (level) => {
    switch (level) {
      case 'Senior': return <Star className="h-4 w-4 text-gold-600" />;
      case 'Intermediate': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{schedulingMetrics.totalStaff}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{schedulingMetrics.onDuty}</div>
            <div className="text-sm text-gray-600">On Duty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{schedulingMetrics.optimalStaffing.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Optimal Staffing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{schedulingMetrics.coverageGaps}</div>
            <div className="text-sm text-gray-600">Coverage Gaps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{schedulingMetrics.overtimeRisk}</div>
            <div className="text-sm text-gray-600">Overtime Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{schedulingMetrics.fatigueAlerts}</div>
            <div className="text-sm text-gray-600">Fatigue Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduling Alerts */}
      {schedulingMetrics.coverageGaps > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Staffing Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Users className="h-4 w-4" />
                <span>3 coverage gaps identified for night shift (11PM-7AM)</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <span>12 staff members at risk of overtime violations</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>8 staff showing signs of fatigue requiring schedule adjustment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Schedule */}
      <div className="space-y-4">
        {staffSchedule.map((staff) => (
          <Card key={staff.id} className={`border-l-4 ${staff.fatigueLevel === 'high' ? 'border-l-red-500' : staff.fatigueLevel === 'moderate' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {staff.name}
                      {getSkillIcon(staff.skillLevel)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{staff.id} • {staff.role} • {staff.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getAvailabilityIcon(staff.availability)}
                  <Badge variant="outline" className={getFatigueColor(staff.fatigueLevel)}>
                    {staff.fatigueLevel.charAt(0).toUpperCase() + staff.fatigueLevel.slice(1)} Fatigue
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Workload Score</div>
                  <div className={`text-2xl font-bold ${getWorkloadColor(staff.workloadScore)}`}>
                    {staff.workloadScore}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${staff.workloadScore >= 90 ? 'bg-red-600' : staff.workloadScore >= 80 ? 'bg-yellow-600' : 'bg-green-600'}`}
                      style={{ width: `${staff.workloadScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">Optimal: 60-80%</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Current Shift
                  </div>
                  <div className="text-lg font-semibold text-blue-600">{staff.shift}</div>
                  <div className="text-xs text-gray-500">{staff.scheduledHours} hours scheduled</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Patient Ratio</div>
                  <div className="text-lg font-semibold text-purple-600">{staff.patientRatio}</div>
                  <div className="text-xs text-gray-500">
                    {staff.overtimeRisk && <span className="text-red-600">Overtime risk</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-lg font-semibold capitalize">{staff.availability.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500">{staff.skillLevel} level</div>
                </div>
              </div>

              {/* Competencies */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Core Competencies</div>
                <div className="flex flex-wrap gap-2">
                  {staff.competencies.map((competency, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {competency}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800 flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  AI Scheduling Recommendations
                </div>
                <div className="text-xs text-blue-700">
                  {staff.fatigueLevel === 'high' && 'Consider reducing workload or scheduling break'}
                  {staff.fatigueLevel === 'moderate' && 'Monitor workload and consider backup coverage'}
                  {staff.fatigueLevel === 'low' && 'Well-balanced schedule, consider for additional responsibilities'}
                  {staff.overtimeRisk && ' • Overtime risk detected - redistribute tasks'}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Adjust Schedule
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Find Coverage
                </Button>
                {staff.overtimeRisk && (
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Prevent Overtime
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduling Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Scheduling Analytics & Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Optimization Score
              </div>
              <div className="text-sm text-gray-600 mb-2">Current efficiency</div>
              <div className="space-y-1">
                <div className="text-sm">Overall: <span className="font-semibold text-green-600">94.2%</span></div>
                <div className="text-sm">Coverage: <span className="font-semibold text-blue-600">91.8%</span></div>
                <div className="text-sm">Workload balance: <span className="font-semibold text-purple-600">87.5%</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Risk Factors
              </div>
              <div className="text-sm text-gray-600 mb-2">Current concerns</div>
              <div className="space-y-1">
                <div className="text-sm">Fatigue risk: <span className="font-semibold text-yellow-600">Medium</span></div>
                <div className="text-sm">Overtime exposure: <span className="font-semibold text-red-600">High</span></div>
                <div className="text-sm">Skill gaps: <span className="font-semibold text-green-600">Low</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Predictions
              </div>
              <div className="text-sm text-gray-600 mb-2">Next week forecast</div>
              <div className="space-y-1">
                <div className="text-sm">Staffing demand: <span className="font-semibold text-blue-600">+12%</span></div>
                <div className="text-sm">Critical skills needed: <span className="font-semibold text-orange-600">ICU, ER</span></div>
                <div className="text-sm">Optimal adjustments: <span className="font-semibold text-green-600">5 shifts</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
