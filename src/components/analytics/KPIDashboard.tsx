
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Bed, 
  Activity, 
  Clock, 
  Heart, 
  AlertCircle, 
  TrendingUp,
  TrendingDown 
} from 'lucide-react';

interface AnalyticsMetrics {
  totalPatients: number;
  totalRevenue: number;
  bedOccupancy: number;
  staffUtilization: number;
  avgLengthOfStay: number;
  patientSatisfaction: number;
  emergencyAdmissions: number;
  dischargeToday: number;
}

interface KPIDashboardProps {
  metrics: AnalyticsMetrics;
}

export const KPIDashboard = ({ metrics }: KPIDashboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Total Patients',
      value: metrics.totalPatients.toLocaleString(),
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendDirection: 'up' as const,
      description: 'Currently in hospital'
    },
    {
      title: 'Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'green',
      trend: '+8%',
      trendDirection: 'up' as const,
      description: 'This month'
    },
    {
      title: 'Bed Occupancy',
      value: `${metrics.bedOccupancy}%`,
      icon: Bed,
      color: 'orange',
      trend: '-3%',
      trendDirection: 'down' as const,
      description: 'Current utilization'
    },
    {
      title: 'Staff Utilization',
      value: `${metrics.staffUtilization}%`,
      icon: Activity,
      color: 'purple',
      trend: '+5%',
      trendDirection: 'up' as const,
      description: 'Active staff ratio'
    },
    {
      title: 'Avg Length of Stay',
      value: `${metrics.avgLengthOfStay} days`,
      icon: Clock,
      color: 'teal',
      trend: '-0.5 days',
      trendDirection: 'down' as const,
      description: 'Patient stay duration'
    },
    {
      title: 'Patient Satisfaction',
      value: `${metrics.patientSatisfaction}%`,
      icon: Heart,
      color: 'pink',
      trend: '+2%',
      trendDirection: 'up' as const,
      description: 'Overall rating'
    },
    {
      title: 'Emergency Admissions',
      value: metrics.emergencyAdmissions.toString(),
      icon: AlertCircle,
      color: 'red',
      trend: '+4',
      trendDirection: 'up' as const,
      description: 'Today'
    },
    {
      title: 'Discharges Today',
      value: metrics.dischargeToday.toString(),
      icon: TrendingUp,
      color: 'indigo',
      trend: '+2',
      trendDirection: 'up' as const,
      description: 'Completed today'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50 text-blue-600',
      green: 'border-green-200 bg-green-50 text-green-600',
      orange: 'border-orange-200 bg-orange-50 text-orange-600',
      purple: 'border-purple-200 bg-purple-50 text-purple-600',
      teal: 'border-teal-200 bg-teal-50 text-teal-600',
      pink: 'border-pink-200 bg-pink-50 text-pink-600',
      red: 'border-red-200 bg-red-50 text-red-600',
      indigo: 'border-indigo-200 bg-indigo-50 text-indigo-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className={`${getColorClasses(kpi.color)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <kpi.icon className="h-8 w-8" />
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm opacity-80">{kpi.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {kpi.trendDirection === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-xs opacity-70">{kpi.description}</p>
              </div>
            </div>
            
            {kpi.title.includes('%') && (
              <div className="mt-4">
                <Progress 
                  value={parseInt(kpi.value)} 
                  className="h-2" 
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
