
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Clock, Shield, Coffee } from 'lucide-react';

interface StaffBurnout {
  id: string;
  staffName: string;
  department: string;
  role: string;
  burnoutScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  workloadHours: number;
  stressIndicators: string[];
  wellnessRecommendations: string[];
  lastAssessment: string;
  interventionsActive: boolean;
}

const mockStaffData: StaffBurnout[] = [
  {
    id: 'SB001',
    staffName: 'Dr. Patricia Wong',
    department: 'Emergency',
    role: 'Attending Physician',
    burnoutScore: 82,
    riskLevel: 'critical',
    workloadHours: 72,
    stressIndicators: ['Excessive overtime', 'Sleep deprivation', 'High patient volume', 'Administrative burden'],
    wellnessRecommendations: ['Immediate schedule reduction', 'Stress management counseling', 'Delegation support'],
    lastAssessment: '2024-01-15',
    interventionsActive: true
  },
  {
    id: 'SB002',
    staffName: 'Nurse Jennifer Martinez',
    department: 'ICU',
    role: 'Charge Nurse',
    burnoutScore: 58,
    riskLevel: 'moderate',
    workloadHours: 48,
    stressIndicators: ['Emotional exhaustion', 'Work-life imbalance'],
    wellnessRecommendations: ['Wellness breaks', 'Peer support groups', 'Flexible scheduling'],
    lastAssessment: '2024-01-14',
    interventionsActive: false
  }
];

export const StaffBurnoutAssessment = () => {
  const [staffData, setStaffData] = useState<StaffBurnout[]>(mockStaffData);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Burnout Assessment Panel
          </CardTitle>
          <CardDescription>
            AI-powered workload analysis with stress indicators and wellness recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Critical Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">127</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {staffData.sort((a, b) => {
              const riskOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
              return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
            }).map((staff) => (
              <Card key={staff.id} className={`border-l-4 ${staff.riskLevel === 'critical' ? 'border-l-red-600' : staff.riskLevel === 'high' ? 'border-l-red-400' : staff.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{staff.staffName}</h3>
                      <Badge variant="outline">{staff.department}</Badge>
                      <Badge variant="outline">{staff.role}</Badge>
                      <Badge className={getRiskColor(staff.riskLevel)}>
                        {staff.riskLevel.toUpperCase()}
                      </Badge>
                      {staff.interventionsActive && (
                        <Badge className="bg-blue-100 text-blue-800">Active Support</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last assessment: {staff.lastAssessment}</p>
                      <p className="text-sm font-medium">Weekly hours: {staff.workloadHours}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Burnout Risk Score</span>
                          <span className="text-sm font-bold">{staff.burnoutScore}/100</span>
                        </div>
                        <Progress value={staff.burnoutScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Stress Indicators:</h4>
                        <div className="flex flex-wrap gap-2">
                          {staff.stressIndicators.map((indicator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{indicator}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Wellness Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {staff.wellnessRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-blue-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {staff.riskLevel === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Immediate Support
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Coffee className="h-4 w-4 mr-1" />
                      Wellness Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Schedule Review
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact HR
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
