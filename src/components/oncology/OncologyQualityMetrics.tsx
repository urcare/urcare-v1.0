
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield
} from 'lucide-react';

export const OncologyQualityMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [qualityScores, setQualityScores] = useState({
    timeToDiagnosis: 85,
    treatmentInitiation: 92,
    survivalOutcomes: 88,
    patientSatisfaction: 94,
    safetyMetrics: 96,
    guidelineAdherence: 89
  });

  const qualityIndicators = [
    {
      id: 'time-to-treatment',
      name: 'Time to Treatment Initiation',
      current: 14.2,
      target: 15,
      unit: 'days',
      trend: 'improving',
      benchmark: 'NCCN Guidelines',
      score: 92,
      category: 'Timeliness'
    },
    {
      id: 'survival-rates',
      name: '5-Year Survival Rate',
      current: 68.5,
      target: 65,
      unit: '%',
      trend: 'stable',
      benchmark: 'National Average',
      score: 88,
      category: 'Outcomes'
    },
    {
      id: 'patient-satisfaction',
      name: 'Patient Satisfaction Score',
      current: 4.7,
      target: 4.5,
      unit: '/5.0',
      trend: 'improving',
      benchmark: 'HCAHPS',
      score: 94,
      category: 'Experience'
    },
    {
      id: 'readmission-rate',
      name: '30-Day Readmission Rate',
      current: 8.2,
      target: 10,
      unit: '%',
      trend: 'improving',
      benchmark: 'CMS Standards',
      score: 91,
      category: 'Safety'
    },
    {
      id: 'guideline-adherence',
      name: 'Treatment Guideline Adherence',
      current: 89.3,
      target: 90,
      unit: '%',
      trend: 'stable',
      benchmark: 'NCCN Guidelines',
      score: 89,
      category: 'Quality'
    },
    {
      id: 'complication-rate',
      name: 'Major Complication Rate',
      current: 3.1,
      target: 5,
      unit: '%',
      trend: 'improving',
      benchmark: 'National Database',
      score: 96,
      category: 'Safety'
    }
  ];

  const outcomeMetrics = [
    {
      cancerType: 'Breast Cancer',
      totalPatients: 345,
      fiveYearSurvival: 91.2,
      treatmentCompletion: 94.5,
      qualityOfLife: 4.3,
      recurrenceRate: 8.7
    },
    {
      cancerType: 'Lung Cancer',
      totalPatients: 298,
      fiveYearSurvival: 62.8,
      treatmentCompletion: 87.3,
      qualityOfLife: 3.9,
      recurrenceRate: 15.2
    },
    {
      cancerType: 'Colorectal Cancer',
      totalPatients: 267,
      fiveYearSurvival: 74.5,
      treatmentCompletion: 91.8,
      qualityOfLife: 4.1,
      recurrenceRate: 12.3
    },
    {
      cancerType: 'Lymphoma',
      totalPatients: 156,
      fiveYearSurvival: 83.7,
      treatmentCompletion: 88.9,
      qualityOfLife: 4.2,
      recurrenceRate: 9.8
    }
  ];

  const benchmarkComparisons = [
    {
      metric: 'Overall Survival',
      ourCenter: 71.2,
      nationalAverage: 67.8,
      topQuartile: 74.5,
      performance: 'above-average'
    },
    {
      metric: 'Treatment Completion Rate',
      ourCenter: 90.7,
      nationalAverage: 88.2,
      topQuartile: 92.1,
      performance: 'above-average'
    },
    {
      metric: 'Patient Safety Score',
      ourCenter: 96.1,
      nationalAverage: 93.4,
      topQuartile: 97.2,
      performance: 'excellent'
    },
    {
      metric: 'Time to Treatment',
      ourCenter: 14.2,
      nationalAverage: 18.7,
      topQuartile: 12.5,
      performance: 'above-average'
    }
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'declining': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'stable': return <Activity className="h-3 w-3 text-blue-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'above-average': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'below-average': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-blue-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const updateQualityScore = (metric) => {
    const newScore = Math.min(100, qualityScores[metric] + 2);
    setQualityScores(prev => ({
      ...prev,
      [metric]: newScore
    }));
  };

  return (
    <div className="space-y-6">
      {/* Quality Indicators Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quality Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualityIndicators.map((indicator) => (
              <Card 
                key={indicator.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedMetric?.id === indicator.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedMetric(indicator)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{indicator.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {indicator.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(indicator.trend)}
                        <span className={`text-lg font-bold ${getScoreColor(indicator.score)}`}>
                          {indicator.score}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current:</span>
                        <span className="font-medium">
                          {indicator.current}{indicator.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="font-medium">
                          {indicator.target}{indicator.unit}
                        </span>
                      </div>
                      <Progress 
                        value={indicator.score} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">
                        Benchmark: {indicator.benchmark}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outcome Metrics by Cancer Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Outcome Metrics by Cancer Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outcomeMetrics.map((outcome, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <h3 className="font-medium">{outcome.cancerType}</h3>
                      <p className="text-sm text-gray-600">{outcome.totalPatients} patients</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {outcome.fiveYearSurvival}%
                      </div>
                      <div className="text-xs text-gray-600">5-Year Survival</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {outcome.treatmentCompletion}%
                      </div>
                      <div className="text-xs text-gray-600">Treatment Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {outcome.qualityOfLife}/5.0
                      </div>
                      <div className="text-xs text-gray-600">Quality of Life</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {outcome.recurrenceRate}%
                      </div>
                      <div className="text-xs text-gray-600">Recurrence Rate</div>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Benchmark Comparisons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarkComparisons.map((comparison, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-medium">{comparison.metric}</h3>
                      <Badge className={getPerformanceColor(comparison.performance)}>
                        {comparison.performance}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {comparison.ourCenter}
                        {comparison.metric.includes('Time') ? ' days' : '%'}
                      </div>
                      <div className="text-xs text-gray-600">Our Center</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-600">
                        {comparison.nationalAverage}
                        {comparison.metric.includes('Time') ? ' days' : '%'}
                      </div>
                      <div className="text-xs text-gray-600">National Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {comparison.topQuartile}
                        {comparison.metric.includes('Time') ? ' days' : '%'}
                      </div>
                      <div className="text-xs text-gray-600">Top Quartile</div>
                    </div>
                    <div className="flex items-center justify-center">
                      {comparison.performance === 'excellent' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : comparison.performance === 'above-average' ? (
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Score Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quality Score Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(qualityScores).map(([metric, score]) => (
              <div key={metric} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">
                    {metric.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                    {score >= 95 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : score >= 90 ? (
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                <Progress value={score} className="h-2" />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => updateQualityScore(metric)}
                >
                  Update Score
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quality Metrics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(Object.values(qualityScores).reduce((a, b) => a + b, 0) / Object.values(qualityScores).length)}%
              </div>
              <div className="text-sm text-gray-600">Overall Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {qualityIndicators.filter(indicator => indicator.score >= 90).length}
              </div>
              <div className="text-sm text-gray-600">High-Performing Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {benchmarkComparisons.filter(comparison => comparison.performance === 'excellent' || comparison.performance === 'above-average').length}
              </div>
              <div className="text-sm text-gray-600">Above Benchmark</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {outcomeMetrics.reduce((total, outcome) => total + outcome.totalPatients, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Patients Tracked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
