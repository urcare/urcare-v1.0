
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Coffee,
  Moon,
  Zap
} from 'lucide-react';

export const StaffFatigueAnalyzer = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const fatigueData = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      department: 'ICU',
      fatigueScore: 85,
      riskLevel: 'high',
      workloadMetrics: {
        hoursWorked: 72,
        consecutiveShifts: 6,
        overtimeHours: 24,
        patientLoad: 18
      },
      stressIndicators: {
        heartRateVariability: 'elevated',
        sleepQuality: 'poor',
        responseTime: 'slow',
        errorRate: 'increased'
      },
      recommendations: [
        'Mandatory 48-hour rest period',
        'Reduce patient load by 30%',
        'Schedule wellness consultation',
        'Monitor stress levels daily'
      ]
    },
    {
      id: '2',
      name: 'Nurse John Smith',
      department: 'Emergency',
      fatigueScore: 65,
      riskLevel: 'medium',
      workloadMetrics: {
        hoursWorked: 48,
        consecutiveShifts: 4,
        overtimeHours: 8,
        patientLoad: 12
      },
      stressIndicators: {
        heartRateVariability: 'normal',
        sleepQuality: 'fair',
        responseTime: 'normal',
        errorRate: 'normal'
      },
      recommendations: [
        'Schedule regular breaks',
        'Limit consecutive shifts to 3',
        'Encourage mindfulness practices'
      ]
    },
    {
      id: '3',
      name: 'Dr. Mike Johnson',
      department: 'Cardiology',
      fatigueScore: 35,
      riskLevel: 'low',
      workloadMetrics: {
        hoursWorked: 40,
        consecutiveShifts: 2,
        overtimeHours: 4,
        patientLoad: 8
      },
      stressIndicators: {
        heartRateVariability: 'optimal',
        sleepQuality: 'good',
        responseTime: 'fast',
        errorRate: 'minimal'
      },
      recommendations: [
        'Maintain current schedule',
        'Continue wellness practices',
        'Consider mentoring opportunities'
      ]
    }
  ];

  const departmentFatigue = [
    { name: 'ICU', avgScore: 75, trend: 'up', staffCount: 24 },
    { name: 'Emergency', avgScore: 68, trend: 'stable', staffCount: 18 },
    { name: 'Surgery', avgScore: 72, trend: 'down', staffCount: 15 },
    { name: 'General Ward', avgScore: 45, trend: 'stable', staffCount: 32 }
  ];

  const getRiskBadge = (level) => {
    const riskConfig = {
      high: { label: 'High Risk', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium Risk', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low Risk', className: 'bg-green-100 text-green-800' }
    };
    const config = riskConfig[level];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getIndicatorIcon = (indicator, value) => {
    const isGood = value === 'optimal' || value === 'good' || value === 'normal' || value === 'fast' || value === 'minimal';
    const iconClass = isGood ? 'text-green-600' : 'text-red-600';
    
    const icons = {
      heartRateVariability: <Heart className={`w-4 h-4 ${iconClass}`} />,
      sleepQuality: <Moon className={`w-4 h-4 ${iconClass}`} />,
      responseTime: <Zap className={`w-4 h-4 ${iconClass}`} />,
      errorRate: <AlertTriangle className={`w-4 h-4 ${iconClass}`} />
    };
    
    return icons[indicator];
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Staff Fatigue Analyzer</h3>
          <p className="text-gray-600">AI-powered workload analysis and wellness recommendations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Coffee className="w-4 h-4 mr-2" />
            Wellness Report
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Fatigue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">High Risk Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">64.5</div>
                <div className="text-sm text-gray-600">Avg Fatigue Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Total Overtime Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Interventions Applied</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Fatigue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Department Fatigue Levels
          </CardTitle>
          <CardDescription>Average fatigue scores and trends by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentFatigue.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-gray-600">{dept.staffCount} staff members</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right min-w-[100px]">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fatigue Score</span>
                      <span>{dept.avgScore}</span>
                    </div>
                    <Progress value={dept.avgScore} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getTrendIcon(dept.trend)}
                    <span className="text-sm text-gray-600 capitalize">{dept.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Staff Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Staff Fatigue Analysis</CardTitle>
          <CardDescription>Detailed workload metrics and AI-generated recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {fatigueData.map((staff) => (
              <div key={staff.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{staff.name}</h4>
                    <p className="text-sm text-gray-600">{staff.department}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{staff.fatigueScore}</div>
                      <div className="text-xs text-gray-600">Fatigue Score</div>
                    </div>
                    {getRiskBadge(staff.riskLevel)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h5 className="font-medium mb-3">Workload Metrics</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hours Worked (Week)</span>
                        <span className="font-medium">{staff.workloadMetrics.hoursWorked}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Consecutive Shifts</span>
                        <span className="font-medium">{staff.workloadMetrics.consecutiveShifts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overtime Hours</span>
                        <span className="font-medium">{staff.workloadMetrics.overtimeHours}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Patient Load</span>
                        <span className="font-medium">{staff.workloadMetrics.patientLoad}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3">Stress Indicators</h5>
                    <div className="space-y-2">
                      {Object.entries(staff.stressIndicators).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {getIndicatorIcon(key, value)}
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </div>
                          <span className="font-medium capitalize">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">AI Recommendations</h5>
                  <div className="flex flex-wrap gap-2">
                    {staff.recommendations.map((rec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {rec}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Activity className="w-4 h-4 mr-1" />
                    Detailed Analysis
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-1" />
                    Wellness Plan
                  </Button>
                  {staff.riskLevel === 'high' && (
                    <Button size="sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Immediate Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
