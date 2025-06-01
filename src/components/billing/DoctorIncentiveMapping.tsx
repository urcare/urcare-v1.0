
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  TrendingUp,
  Target,
  DollarSign,
  Award,
  Activity,
  Calendar,
  Star
} from 'lucide-react';

interface DoctorIncentive {
  doctorId: string;
  doctorName: string;
  department: string;
  specialization: string;
  currentMonth: {
    revenue: number;
    procedures: number;
    incentiveEarned: number;
    qualityScore: number;
    targetAchievement: number;
  };
  yearToDate: {
    revenue: number;
    procedures: number;
    incentiveEarned: number;
    averageQualityScore: number;
  };
  incentiveRules: {
    basePercentage: number;
    procedureBonus: number;
    qualityMultiplier: number;
    targetBonusThreshold: number;
  };
  recentProcedures: Array<{
    procedure: string;
    revenue: number;
    incentiveAmount: number;
    date: string;
    qualityRating: number;
  }>;
}

export const DoctorIncentiveMapping = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous' | 'ytd'>('current');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const doctorIncentives: DoctorIncentive[] = [
    {
      doctorId: 'DOC001',
      doctorName: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      currentMonth: {
        revenue: 125000.00,
        procedures: 18,
        incentiveEarned: 8750.00,
        qualityScore: 9.2,
        targetAchievement: 104.2
      },
      yearToDate: {
        revenue: 1250000.00,
        procedures: 156,
        incentiveEarned: 87500.00,
        averageQualityScore: 9.1
      },
      incentiveRules: {
        basePercentage: 7.0,
        procedureBonus: 500.00,
        qualityMultiplier: 1.2,
        targetBonusThreshold: 100000.00
      },
      recentProcedures: [
        { procedure: 'Cardiac Catheterization', revenue: 8500.00, incentiveAmount: 595.00, date: '2024-06-01', qualityRating: 9.5 },
        { procedure: 'Angioplasty', revenue: 12000.00, incentiveAmount: 840.00, date: '2024-05-30', qualityRating: 9.0 },
        { procedure: 'Pacemaker Implantation', revenue: 15000.00, incentiveAmount: 1050.00, date: '2024-05-28', qualityRating: 9.3 }
      ]
    },
    {
      doctorId: 'DOC002',
      doctorName: 'Dr. Michael Chen',
      department: 'Orthopedics',
      specialization: 'Spine Surgery',
      currentMonth: {
        revenue: 98000.00,
        procedures: 12,
        incentiveEarned: 6860.00,
        qualityScore: 8.8,
        targetAchievement: 98.0
      },
      yearToDate: {
        revenue: 980000.00,
        procedures: 124,
        incentiveEarned: 68600.00,
        averageQualityScore: 8.9
      },
      incentiveRules: {
        basePercentage: 7.0,
        procedureBonus: 600.00,
        qualityMultiplier: 1.1,
        targetBonusThreshold: 100000.00
      },
      recentProcedures: [
        { procedure: 'Spinal Fusion', revenue: 18500.00, incentiveAmount: 1295.00, date: '2024-06-01', qualityRating: 9.0 },
        { procedure: 'Laminectomy', revenue: 12000.00, incentiveAmount: 840.00, date: '2024-05-29', qualityRating: 8.5 },
        { procedure: 'Disc Replacement', revenue: 22000.00, incentiveAmount: 1540.00, date: '2024-05-27', qualityRating: 9.2 }
      ]
    },
    {
      doctorId: 'DOC003',
      doctorName: 'Dr. Emily Rodriguez',
      department: 'Neurosurgery',
      specialization: 'Brain Surgery',
      currentMonth: {
        revenue: 156000.00,
        procedures: 8,
        incentiveEarned: 10920.00,
        qualityScore: 9.6,
        targetAchievement: 112.0
      },
      yearToDate: {
        revenue: 1560000.00,
        procedures: 89,
        incentiveEarned: 109200.00,
        averageQualityScore: 9.4
      },
      incentiveRules: {
        basePercentage: 7.0,
        procedureBonus: 800.00,
        qualityMultiplier: 1.3,
        targetBonusThreshold: 140000.00
      },
      recentProcedures: [
        { procedure: 'Brain Tumor Resection', revenue: 35000.00, incentiveAmount: 2450.00, date: '2024-06-01', qualityRating: 9.8 },
        { procedure: 'Aneurysm Clipping', revenue: 28000.00, incentiveAmount: 1960.00, date: '2024-05-30', qualityRating: 9.5 },
        { procedure: 'Deep Brain Stimulation', revenue: 32000.00, incentiveAmount: 2240.00, date: '2024-05-25', qualityRating: 9.4 }
      ]
    }
  ];

  const getQualityBadge = (score: number) => {
    if (score >= 9.0) return 'bg-green-100 text-green-800';
    if (score >= 8.0) return 'bg-blue-100 text-blue-800';
    if (score >= 7.0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getTargetAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const calculateIncentiveBreakdown = (doctor: DoctorIncentive) => {
    const baseIncentive = doctor.currentMonth.revenue * (doctor.incentiveRules.basePercentage / 100);
    const procedureBonus = doctor.currentMonth.procedures * doctor.incentiveRules.procedureBonus;
    const qualityBonus = baseIncentive * (doctor.incentiveRules.qualityMultiplier - 1) * (doctor.currentMonth.qualityScore / 10);
    const targetBonus = doctor.currentMonth.targetAchievement > 100 ? 
      (doctor.currentMonth.targetAchievement - 100) * 50 : 0;
    
    return {
      baseIncentive,
      procedureBonus,
      qualityBonus,
      targetBonus,
      total: baseIncentive + procedureBonus + qualityBonus + targetBonus
    };
  };

  const totalRevenue = doctorIncentives.reduce((sum, doc) => sum + doc.currentMonth.revenue, 0);
  const totalIncentives = doctorIncentives.reduce((sum, doc) => sum + doc.currentMonth.incentiveEarned, 0);
  const totalProcedures = doctorIncentives.reduce((sum, doc) => sum + doc.currentMonth.procedures, 0);
  const averageQuality = doctorIncentives.reduce((sum, doc) => sum + doc.currentMonth.qualityScore, 0) / doctorIncentives.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Doctor Incentive Mapping Engine</h2>
          <p className="text-gray-600">Performance-based incentive tracking and calculation</p>
        </div>
        
        <div className="flex gap-2">
          {(['current', 'previous', 'ytd'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-blue-600' : ''}
            >
              {period === 'current' ? 'Current Month' : 
               period === 'previous' ? 'Previous Month' : 'Year to Date'}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Incentives</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${totalIncentives.toLocaleString()}
                </p>
              </div>
              <Award className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Procedures</p>
                <p className="text-3xl font-bold text-purple-600">{totalProcedures}</p>
              </div>
              <Activity className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
                <p className="text-3xl font-bold text-amber-600">{averageQuality.toFixed(1)}</p>
              </div>
              <Star className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Performance Cards */}
      <div className="grid gap-6">
        {doctorIncentives.map((doctor) => {
          const incentiveBreakdown = calculateIncentiveBreakdown(doctor);
          const isSelected = selectedDoctor === doctor.doctorId;
          
          return (
            <Card key={doctor.doctorId} className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.doctorName}</CardTitle>
                      <CardDescription>{doctor.specialization} - {doctor.department}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${doctor.currentMonth.incentiveEarned.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Current Month</p>
                    </div>
                    <Badge className={getQualityBadge(doctor.currentMonth.qualityScore)}>
                      Quality: {doctor.currentMonth.qualityScore}/10
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Performance Metrics
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Revenue Generated</span>
                          <span className="font-medium">${doctor.currentMonth.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Procedures Completed</span>
                          <span className="font-medium">{doctor.currentMonth.procedures}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Target Achievement</span>
                          <span className={`font-medium ${getTargetAchievementColor(doctor.currentMonth.targetAchievement)}`}>
                            {doctor.currentMonth.targetAchievement.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={Math.min(doctor.currentMonth.targetAchievement, 120)} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Incentive Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Incentive Breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Incentive ({doctor.incentiveRules.basePercentage}%):</span>
                        <span>${incentiveBreakdown.baseIncentive.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Procedure Bonus:</span>
                        <span>${incentiveBreakdown.procedureBonus.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Bonus:</span>
                        <span>${incentiveBreakdown.qualityBonus.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Bonus:</span>
                        <span>${incentiveBreakdown.targetBonus.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total Incentive:</span>
                        <span>${incentiveBreakdown.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Procedures */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Procedures
                    </h4>
                    <div className="space-y-2">
                      {doctor.recentProcedures.slice(0, 3).map((procedure, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{procedure.procedure}</p>
                              <p className="text-gray-600">{procedure.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${procedure.incentiveAmount.toFixed(2)}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500" />
                                <span className="text-xs">{procedure.qualityRating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>YTD: ${doctor.yearToDate.incentiveEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Avg Quality: {doctor.yearToDate.averageQualityScore}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedDoctor(isSelected ? null : doctor.doctorId)}
                    >
                      {isSelected ? 'Collapse' : 'View Details'}
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
