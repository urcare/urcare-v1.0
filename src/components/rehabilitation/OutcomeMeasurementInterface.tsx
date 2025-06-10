
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, BarChart3, TrendingUp, Calendar, Plus, FileText } from 'lucide-react';

export const OutcomeMeasurementInterface = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('assessment-1');

  const assessmentTools = [
    {
      id: 'assessment-1',
      name: 'Functional Independence Measure (FIM)',
      type: 'Functional Assessment',
      lastCompleted: '2024-01-12',
      frequency: 'Weekly',
      score: 85,
      maxScore: 126,
      status: 'completed'
    },
    {
      id: 'assessment-2',
      name: 'Berg Balance Scale',
      type: 'Balance Assessment',
      lastCompleted: '2024-01-10',
      frequency: 'Bi-weekly',
      score: 42,
      maxScore: 56,
      status: 'due'
    },
    {
      id: 'assessment-3',
      name: 'Quick DASH',
      type: 'Upper Extremity',
      lastCompleted: '2024-01-08',
      frequency: 'Monthly',
      score: 25,
      maxScore: 100,
      status: 'completed'
    },
    {
      id: 'assessment-4',
      name: 'Timed Up and Go (TUG)',
      type: 'Mobility Assessment',
      lastCompleted: '2024-01-11',
      frequency: 'Weekly',
      score: 12,
      maxScore: null,
      status: 'completed'
    }
  ];

  const outcomeMeasures = [
    {
      id: 1,
      measure: 'Functional Independence',
      baseline: 65,
      current: 85,
      target: 95,
      improvement: 31,
      unit: 'FIM Score'
    },
    {
      id: 2,
      measure: 'Balance Confidence',
      baseline: 38,
      current: 42,
      target: 50,
      improvement: 11,
      unit: 'Berg Score'
    },
    {
      id: 3,
      measure: 'Upper Extremity Function',
      baseline: 45,
      current: 25,
      target: 15,
      improvement: 44,
      unit: 'DASH Score'
    },
    {
      id: 4,
      measure: 'Mobility Speed',
      baseline: 18,
      current: 12,
      target: 10,
      improvement: 33,
      unit: 'seconds'
    }
  ];

  const qualityMetrics = [
    { metric: 'Goal Achievement Rate', value: 78, target: 80, unit: '%' },
    { metric: 'Patient Satisfaction', value: 4.6, target: 4.5, unit: '/5' },
    { metric: 'Functional Improvement', value: 85, target: 75, unit: '%' },
    { metric: 'Discharge to Home Rate', value: 92, target: 90, unit: '%' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'due': return 'bg-orange-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 30) return 'text-green-600';
    if (improvement >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Outcome Measurement</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assessment Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessmentTools.map((assessment) => (
                <div 
                  key={assessment.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAssessment === assessment.id ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{assessment.name}</h3>
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{assessment.type}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Last: {assessment.lastCompleted}</span>
                      <span>{assessment.frequency}</span>
                    </div>
                    {assessment.maxScore && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Score</span>
                          <span>{assessment.score}/{assessment.maxScore}</span>
                        </div>
                        <Progress value={(assessment.score / assessment.maxScore) * 100} className="h-2" />
                      </div>
                    )}
                    {!assessment.maxScore && (
                      <div className="text-xs">
                        <span>Time: {assessment.score} seconds</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Outcome Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outcomeMeasures.map((measure) => (
                <Card key={measure.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold">{measure.measure}</h3>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Baseline:</span>
                          <div className="font-bold">{measure.baseline} {measure.unit}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Current:</span>
                          <div className="font-bold text-blue-600">{measure.current} {measure.unit}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Target:</span>
                          <div className="font-bold text-green-600">{measure.target} {measure.unit}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Improvement:</span>
                          <div className={`font-bold flex items-center gap-1 ${getImprovementColor(measure.improvement)}`}>
                            <TrendingUp className="h-3 w-3" />
                            {measure.improvement}%
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={((measure.current - measure.baseline) / (measure.target - measure.baseline)) * 100} 
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm mb-2">{metric.metric}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {metric.value}{metric.unit}
                    </span>
                    <span className={`text-sm ${
                      metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Target: {metric.target}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={metric.unit === '%' ? metric.value : (metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Completed This Week</h3>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-sm text-green-600">assessments</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Due This Week</h3>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-sm text-orange-600">assessments</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800">Overdue</h3>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-red-600">assessments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
