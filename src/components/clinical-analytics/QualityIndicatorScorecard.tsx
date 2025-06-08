
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Star, 
  Target, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface QualityIndicatorScorecardProps {
  timeframe: string;
}

const qualityIndicators = [
  {
    category: 'Patient Safety',
    icon: Shield,
    color: 'blue',
    metrics: [
      { name: 'Hospital-Acquired Infections', value: 1.2, target: 2.1, unit: '%', status: 'excellent', trend: 'down' },
      { name: 'Medication Errors', value: 0.8, target: 1.5, unit: '%', status: 'excellent', trend: 'down' },
      { name: 'Falls with Injury', value: 2.1, target: 3.0, unit: 'per 1000', status: 'good', trend: 'stable' },
      { name: 'Pressure Ulcers', value: 1.5, target: 2.0, unit: '%', status: 'good', trend: 'down' }
    ]
  },
  {
    category: 'Clinical Effectiveness',
    icon: Target,
    color: 'green',
    metrics: [
      { name: 'Risk-Adjusted Mortality', value: 2.1, target: 2.8, unit: '%', status: 'excellent', trend: 'down' },
      { name: '30-Day Readmissions', value: 8.5, target: 12.0, unit: '%', status: 'excellent', trend: 'down' },
      { name: 'Average Length of Stay', value: 4.8, target: 5.2, unit: 'days', status: 'good', trend: 'down' },
      { name: 'Surgical Site Infections', value: 1.9, target: 2.5, unit: '%', status: 'good', trend: 'stable' }
    ]
  },
  {
    category: 'Patient Experience',
    icon: Star,
    color: 'purple',
    metrics: [
      { name: 'Overall Satisfaction', value: 88, target: 85, unit: '%', status: 'excellent', trend: 'up' },
      { name: 'Pain Management', value: 92, target: 88, unit: '%', status: 'excellent', trend: 'up' },
      { name: 'Communication', value: 85, target: 82, unit: '%', status: 'good', trend: 'up' },
      { name: 'Discharge Planning', value: 89, target: 85, unit: '%', status: 'excellent', trend: 'stable' }
    ]
  }
];

const accreditationStatus = [
  { name: 'Joint Commission', status: 'Accredited', expiry: '2025-12-31', score: 95 },
  { name: 'CMS 5-Star Rating', status: 'Active', expiry: '2024-12-31', score: 4 },
  { name: 'Magnet Recognition', status: 'Designated', expiry: '2026-06-30', score: 98 },
  { name: 'Leapfrog Grade', status: 'A', expiry: '2024-12-31', score: 92 }
];

export const QualityIndicatorScorecard = ({ timeframe }: QualityIndicatorScorecardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500 text-white">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500 text-white">Good</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500 text-white">Needs Attention</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      default:
        return <div className="w-3 h-0.5 bg-gray-400 rounded"></div>;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {qualityIndicators.map((category) => (
          <Card key={category.category} className={getColorClasses(category.color)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <category.icon className="h-5 w-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.metrics.map((metric) => (
                <div key={metric.name} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {metric.value} {metric.unit}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    {getStatusBadge(metric.status)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Target: {metric.target} {metric.unit}
                  </div>
                  <Progress 
                    value={metric.name.includes('Mortality') || metric.name.includes('Error') || metric.name.includes('Infection') 
                      ? Math.max(0, 100 - (metric.value / metric.target * 100))
                      : Math.min(100, (metric.value / metric.target * 100))
                    } 
                    className="h-2" 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-600" />
            Accreditation & Certification Status
          </CardTitle>
          <CardDescription>Current accreditation standings and renewal dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {accreditationStatus.map((accreditation) => (
              <div key={accreditation.name} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{accreditation.name}</span>
                  <Badge className="bg-yellow-500 text-white">{accreditation.status}</Badge>
                </div>
                <div className="text-2xl font-bold text-yellow-700 mb-1">
                  {typeof accreditation.score === 'number' && accreditation.score < 10 
                    ? accreditation.score 
                    : `${accreditation.score}%`}
                </div>
                <div className="text-xs text-gray-600">
                  Expires: {new Date(accreditation.expiry).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Improvement Initiatives</CardTitle>
            <CardDescription>Active quality improvement projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Sepsis Bundle Compliance</p>
                  <p className="text-xs text-gray-500">Reduce sepsis mortality by 15%</p>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Fall Prevention Protocol</p>
                  <p className="text-xs text-gray-500">Reduce patient falls by 20%</p>
                </div>
                <Badge className="bg-blue-500 text-white">Planning</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Medication Reconciliation</p>
                  <p className="text-xs text-gray-500">Improve accuracy to 98%</p>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
            <CardDescription>Compliance with healthcare regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">HIPAA Compliance</span>
                </div>
                <Badge className="bg-green-500 text-white">100%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Joint Commission Standards</span>
                </div>
                <Badge className="bg-green-500 text-white">98%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">CMS Core Measures</span>
                </div>
                <Badge className="bg-blue-500 text-white">95%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
