
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { UserCheck, Heart, Brain, Activity, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentScore {
  category: string;
  score: number;
  maxScore: number;
  status: 'good' | 'moderate' | 'poor';
  recommendations: string[];
}

export const GeriatricAssessmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([
    {
      category: 'Cognitive Function',
      score: 26,
      maxScore: 30,
      status: 'good',
      recommendations: ['Continue cognitive activities', 'Regular social engagement']
    },
    {
      category: 'Physical Function',
      score: 8,
      maxScore: 12,
      status: 'moderate',
      recommendations: ['Physical therapy recommended', 'Balance exercises', 'Strength training']
    },
    {
      category: 'Nutritional Status',
      score: 10,
      maxScore: 14,
      status: 'moderate',
      recommendations: ['Nutritional counseling', 'Regular weight monitoring', 'Supplement evaluation']
    },
    {
      category: 'Fall Risk',
      score: 3,
      maxScore: 10,
      status: 'good',
      recommendations: ['Continue current safety measures', 'Home safety assessment annually']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return Heart;
      case 'moderate': return AlertTriangle;
      case 'poor': return AlertTriangle;
      default: return Heart;
    }
  };

  const handleNewAssessment = (category: string) => {
    toast.success(`Starting ${category} assessment`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-purple-600" />
            Comprehensive Geriatric Assessment
          </CardTitle>
          <CardDescription>
            Holistic evaluation of physical, cognitive, and functional status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Cognitive</h3>
              <p className="text-sm text-gray-600">Mental Function</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Physical</h3>
              <p className="text-sm text-gray-600">Mobility & Strength</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Nutritional</h3>
              <p className="text-sm text-gray-600">Diet & Weight</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Safety</h3>
              <p className="text-sm text-gray-600">Fall Prevention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {assessmentScores.map((assessment) => {
              const StatusIcon = getStatusIcon(assessment.status);
              return (
                <Card key={assessment.category}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{assessment.category}</h3>
                          <p className="text-sm text-gray-600">
                            Score: {assessment.score}/{assessment.maxScore}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={(assessment.score / assessment.maxScore) * 100} 
                      className="mb-4"
                    />
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => handleNewAssessment(assessment.category)}
                    >
                      Reassess
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Assessment Tools</CardTitle>
              <CardDescription>
                Standardized cognitive evaluation instruments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Mini-Mental State Exam</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Brief cognitive screening tool (30 points)
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">26/30</span>
                      <Button size="sm">Retake</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Clock Drawing Test</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Visuospatial and executive function
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                      <Button size="sm">View Results</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Physical Function Assessment</CardTitle>
              <CardDescription>
                Mobility, balance, and strength evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h3 className="font-semibold">Gait Speed</h3>
                    <p className="text-2xl font-bold text-blue-600">0.8 m/s</p>
                    <p className="text-sm text-gray-600">Normal range</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h3 className="font-semibold">Balance Score</h3>
                    <p className="text-2xl font-bold text-green-600">12/14</p>
                    <p className="text-sm text-gray-600">Good balance</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <h3 className="font-semibold">Grip Strength</h3>
                    <p className="text-2xl font-bold text-orange-600">18 kg</p>
                    <p className="text-sm text-gray-600">Below average</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Care Plan</CardTitle>
              <CardDescription>
                Comprehensive care recommendations based on assessment results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-700">Immediate Actions</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Schedule physical therapy consultation</li>
                    <li>• Nutritional assessment within 2 weeks</li>
                    <li>• Medication review with pharmacist</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-700">Ongoing Care</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Weekly balance exercises</li>
                    <li>• Monthly cognitive activities</li>
                    <li>• Quarterly comprehensive reviews</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-orange-700">Family Involvement</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Care coordination meetings</li>
                    <li>• Safety monitoring guidance</li>
                    <li>• Emergency contact protocols</li>
                  </ul>
                </div>
              </div>
              
              <Button className="w-full">
                Generate Full Care Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
