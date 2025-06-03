
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Brain,
  Activity,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

export const BurnoutRiskTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const staffRiskData = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      department: 'ICU',
      riskLevel: 'high',
      score: 85,
      factors: ['Overtime hours: 24', 'Consecutive shifts: 6', 'No breaks: 3 days'],
      lastIntervention: '2024-06-01',
      recommendations: ['Mandatory 2-day rest', 'Counseling session', 'Workload redistribution']
    },
    {
      id: '2',
      name: 'Nurse John Smith',
      department: 'Emergency',
      riskLevel: 'medium',
      score: 65,
      factors: ['Overtime hours: 12', 'Late shifts: 4 this week'],
      lastIntervention: '2024-05-28',
      recommendations: ['Schedule regular breaks', 'Limit consecutive shifts']
    },
    {
      id: '3',
      name: 'Dr. Mike Johnson',
      department: 'Cardiology',
      riskLevel: 'low',
      score: 35,
      factors: ['Regular hours', 'Good work-life balance'],
      lastIntervention: null,
      recommendations: ['Continue current pattern']
    }
  ];

  const wellnessMetrics = [
    { name: 'Average Work Hours/Week', value: 52, target: 48, unit: 'hours' },
    { name: 'Overtime Rate', value: 23, target: 15, unit: '%' },
    { name: 'Consecutive Shifts', value: 4.2, target: 3, unit: 'avg' },
    { name: 'Break Compliance', value: 78, target: 95, unit: '%' }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Burnout Risk Tracker</h2>
          <p className="text-gray-600">Proactive wellness monitoring with intervention recommendations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Wellness Survey
          </Button>
          <Button>
            <PhoneCall className="w-4 h-4 mr-2" />
            Emergency Support
          </Button>
        </div>
      </div>

      {/* Risk Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
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
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Overtime Hours This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Interventions This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">73%</div>
                <div className="text-sm text-gray-600">Overall Wellness Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Risk Staff Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Immediate Intervention Required
          </CardTitle>
          <CardDescription>Staff members requiring immediate attention and support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffRiskData.filter(staff => staff.riskLevel === 'high').map((staff) => (
              <div key={staff.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-red-800">{staff.name}</h4>
                    <p className="text-sm text-red-600">{staff.department}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-700">{staff.score}</div>
                      <div className="text-xs text-red-600">Risk Score</div>
                    </div>
                    {getRiskBadge(staff.riskLevel)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-medium text-red-800">Risk Factors:</p>
                  <ul className="text-sm text-red-700">
                    {staff.factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-medium text-red-800">Recommended Actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {staff.recommendations.map((rec, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-300 text-red-700">
                        {rec}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Schedule Intervention
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Manager
                  </Button>
                  <Button size="sm" variant="outline">
                    Reassign Shifts
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Risk Assessment Dashboard</CardTitle>
          <CardDescription>Comprehensive burnout risk analysis for all staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffRiskData.map((staff) => (
              <div key={staff.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{staff.name}</h4>
                      <p className="text-sm text-gray-600">{staff.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{staff.score}</div>
                      <div className="text-xs text-gray-600">Risk Score</div>
                    </div>
                    {getRiskBadge(staff.riskLevel)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Burnout Risk Level</span>
                    <span>{staff.score}%</span>
                  </div>
                  <Progress 
                    value={staff.score} 
                    className={`h-2 ${
                      staff.riskLevel === 'high' ? 'bg-red-100' :
                      staff.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Risk Factors:</p>
                    <ul className="text-sm text-gray-600">
                      {staff.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Recommendations:</p>
                    <div className="flex flex-wrap gap-1">
                      {staff.recommendations.slice(0, 2).map((rec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {staff.lastIntervention && (
                  <div className="mt-3 text-xs text-gray-500">
                    Last intervention: {staff.lastIntervention}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Wellness Metrics & Trends
          </CardTitle>
          <CardDescription>Key performance indicators for staff wellbeing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wellnessMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">{metric.name}</span>
                  <span className={`font-semibold ${
                    metric.value > metric.target ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metric.value} {metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / (metric.target * 1.5)) * 100} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Target: {metric.target} {metric.unit}</span>
                  <span className={metric.value > metric.target ? 'text-red-600' : 'text-green-600'}>
                    {metric.value > metric.target ? '↑' : '↓'} 
                    {Math.abs(metric.value - metric.target)} from target
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interventions & Outcomes</CardTitle>
          <CardDescription>Track intervention effectiveness and follow-up actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Dr. Sarah Wilson - Mandatory Rest Period</h4>
                  <p className="text-sm text-gray-600">Implemented 48-hour rest after high burnout score</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Effective</Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p>Date: 2024-06-01 | Follow-up: Risk score reduced from 85 to 62</p>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Nurse John Smith - Schedule Adjustment</h4>
                  <p className="text-sm text-gray-600">Reduced consecutive shifts and added break periods</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Monitoring</Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p>Date: 2024-05-28 | Follow-up: Scheduled for next week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
