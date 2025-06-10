
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  CheckCircle,
  AlertCircle,
  User,
  Heart,
  Clock,
  Target
} from 'lucide-react';

export const GeriatricAssessmentInterface = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assessmentProgress, setAssessmentProgress] = useState({
    adl: 75,
    iadl: 60,
    frailty: 45,
    mobility: 80,
    nutrition: 70,
    cognitive: 85
  });

  const assessmentDomains = [
    {
      id: 'adl',
      name: 'Activities of Daily Living (ADL)',
      description: 'Basic self-care activities',
      score: assessmentProgress.adl,
      status: assessmentProgress.adl >= 70 ? 'good' : assessmentProgress.adl >= 50 ? 'moderate' : 'poor',
      items: ['Bathing', 'Dressing', 'Toileting', 'Transferring', 'Eating', 'Continence']
    },
    {
      id: 'iadl',
      name: 'Instrumental ADL (IADL)',
      description: 'Complex daily activities',
      score: assessmentProgress.iadl,
      status: assessmentProgress.iadl >= 70 ? 'good' : assessmentProgress.iadl >= 50 ? 'moderate' : 'poor',
      items: ['Shopping', 'Cooking', 'Housekeeping', 'Transportation', 'Medication Management', 'Finance Management']
    },
    {
      id: 'frailty',
      name: 'Frailty Assessment',
      description: 'Physical vulnerability evaluation',
      score: assessmentProgress.frailty,
      status: assessmentProgress.frailty >= 70 ? 'robust' : assessmentProgress.frailty >= 40 ? 'pre-frail' : 'frail',
      items: ['Weight Loss', 'Exhaustion', 'Physical Activity', 'Walk Time', 'Grip Strength']
    },
    {
      id: 'mobility',
      name: 'Mobility Assessment',
      description: 'Movement and balance evaluation',
      score: assessmentProgress.mobility,
      status: assessmentProgress.mobility >= 70 ? 'good' : assessmentProgress.mobility >= 50 ? 'moderate' : 'impaired',
      items: ['Gait Speed', 'Balance', 'Chair Stand', 'Range of Motion', 'Assistive Device Use']
    },
    {
      id: 'nutrition',
      name: 'Nutritional Assessment',
      description: 'Dietary intake and nutritional status',
      score: assessmentProgress.nutrition,
      status: assessmentProgress.nutrition >= 70 ? 'adequate' : assessmentProgress.nutrition >= 50 ? 'at-risk' : 'malnourished',
      items: ['BMI', 'Appetite', 'Weight Changes', 'Dietary Intake', 'Supplements', 'Swallowing']
    },
    {
      id: 'cognitive',
      name: 'Cognitive Screening',
      description: 'Mental function evaluation',
      score: assessmentProgress.cognitive,
      status: assessmentProgress.cognitive >= 70 ? 'normal' : assessmentProgress.cognitive >= 50 ? 'mild-impairment' : 'impaired',
      items: ['Memory', 'Attention', 'Language', 'Executive Function', 'Orientation', 'Judgment']
    }
  ];

  const patients = [
    {
      id: 1,
      name: 'Margaret Johnson',
      age: 78,
      lastAssessment: '2024-01-10',
      riskLevel: 'moderate',
      overallScore: 68
    },
    {
      id: 2,
      name: 'Robert Chen',
      age: 82,
      lastAssessment: '2024-01-08',
      riskLevel: 'high',
      overallScore: 45
    },
    {
      id: 3,
      name: 'Eleanor Davis',
      age: 75,
      lastAssessment: '2024-01-12',
      riskLevel: 'low',
      overallScore: 85
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'good':
      case 'adequate':
      case 'normal':
      case 'robust':
        return 'bg-green-100 text-green-800';
      case 'moderate':
      case 'at-risk':
      case 'mild-impairment':
      case 'pre-frail':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
      case 'impaired':
      case 'malnourished':
      case 'frail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const performAssessment = (domain) => {
    // Simulate assessment completion
    const newScore = Math.min(100, assessmentProgress[domain] + Math.floor(Math.random() * 20));
    setAssessmentProgress(prev => ({
      ...prev,
      [domain]: newScore
    }));
  };

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <Card 
                key={patient.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{patient.name}</h3>
                    <div className="text-sm text-gray-600">Age: {patient.age}</div>
                    <div className="text-sm text-gray-600">Last Assessment: {patient.lastAssessment}</div>
                    <div className="flex items-center justify-between">
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel} risk
                      </Badge>
                      <div className="text-sm font-medium">Score: {patient.overallScore}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentDomains.map((domain) => (
          <Card key={domain.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {domain.name}
                </div>
                <Badge className={getStatusColor(domain.status)}>
                  {domain.status}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">{domain.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{domain.score}%</span>
                  </div>
                  <Progress value={domain.score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Assessment Items:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {domain.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {domain.score > 60 && index < 3 ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400" />
                        )}
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => performAssessment(domain.id)}
                >
                  Perform Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Comprehensive Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(Object.values(assessmentProgress).reduce((a, b) => a + b, 0) / Object.values(assessmentProgress).length)}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(assessmentProgress).filter(score => score >= 70).length}
                </div>
                <div className="text-sm text-gray-600">Good Domains</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(assessmentProgress).filter(score => score < 50).length}
                </div>
                <div className="text-sm text-gray-600">At-Risk Domains</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recommended Interventions:</h4>
              <div className="space-y-1">
                {assessmentProgress.frailty < 50 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Frailty intervention program recommended</span>
                  </div>
                )}
                {assessmentProgress.mobility < 60 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-orange-500" />
                    <span>Physical therapy assessment needed</span>
                  </div>
                )}
                {assessmentProgress.nutrition < 60 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Nutritionist consultation required</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
