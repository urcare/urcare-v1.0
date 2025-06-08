
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Shield, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  Star
} from 'lucide-react';

interface ClinicalMetrics {
  mortalityRate: number;
  readmissionRate: number;
  infectionRate: number;
  avgLengthOfStay: number;
  qualityScore: number;
  patientSatisfaction: number;
}

interface ClinicalMetricsOverviewProps {
  metrics: ClinicalMetrics;
}

export const ClinicalMetricsOverview = ({ metrics }: ClinicalMetricsOverviewProps) => {
  const kpiCards = [
    {
      title: 'Risk-Adjusted Mortality',
      value: `${metrics.mortalityRate}%`,
      icon: Heart,
      color: 'blue',
      trend: '-0.3%',
      trendDirection: 'down' as const,
      benchmark: '2.8%',
      status: 'good'
    },
    {
      title: '30-Day Readmission',
      value: `${metrics.readmissionRate}%`,
      icon: Activity,
      color: 'orange',
      trend: '+0.5%',
      trendDirection: 'up' as const,
      benchmark: '12.0%',
      status: 'good'
    },
    {
      title: 'Healthcare-Associated Infections',
      value: `${metrics.infectionRate}%`,
      icon: Shield,
      color: 'green',
      trend: '-0.2%',
      trendDirection: 'down' as const,
      benchmark: '2.1%',
      status: 'excellent'
    },
    {
      title: 'Average Length of Stay',
      value: `${metrics.avgLengthOfStay} days`,
      icon: Clock,
      color: 'purple',
      trend: '-0.3 days',
      trendDirection: 'down' as const,
      benchmark: '5.2 days',
      status: 'good'
    },
    {
      title: 'Overall Quality Score',
      value: `${metrics.qualityScore}%`,
      icon: Star,
      color: 'teal',
      trend: '+2%',
      trendDirection: 'up' as const,
      benchmark: '85%',
      status: 'excellent'
    },
    {
      title: 'Patient Satisfaction',
      value: `${metrics.patientSatisfaction}%`,
      icon: Users,
      color: 'pink',
      trend: '+1%',
      trendDirection: 'up' as const,
      benchmark: '82%',
      status: 'good'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50 text-blue-600',
      green: 'border-green-200 bg-green-50 text-green-600',
      orange: 'border-orange-200 bg-orange-50 text-orange-600',
      purple: 'border-purple-200 bg-purple-50 text-purple-600',
      teal: 'border-teal-200 bg-teal-50 text-teal-600',
      pink: 'border-pink-200 bg-pink-50 text-pink-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      excellent: { variant: 'default' as const, color: 'bg-green-500', text: 'Excellent' },
      good: { variant: 'secondary' as const, color: 'bg-blue-500', text: 'Good' },
      warning: { variant: 'destructive' as const, color: 'bg-yellow-500', text: 'Warning' },
      critical: { variant: 'destructive' as const, color: 'bg-red-500', text: 'Critical' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.good;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className={`${getColorClasses(kpi.color)} transition-all hover:shadow-md`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <kpi.icon className="h-6 w-6" />
                <div>
                  <p className="text-lg font-bold">{kpi.value}</p>
                  <p className="text-xs font-medium opacity-80">{kpi.title}</p>
                </div>
              </div>
              <Badge 
                variant={getStatusBadge(kpi.status).variant}
                className={`${getStatusBadge(kpi.status).color} text-white`}
              >
                {getStatusBadge(kpi.status).text}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-70">vs. Benchmark: {kpi.benchmark}</span>
                <div className="flex items-center gap-1">
                  {kpi.trendDirection === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  <span className="font-medium text-green-600">{kpi.trend}</span>
                </div>
              </div>
              
              {kpi.title.includes('%') && (
                <Progress 
                  value={parseFloat(kpi.value)} 
                  className="h-2" 
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
