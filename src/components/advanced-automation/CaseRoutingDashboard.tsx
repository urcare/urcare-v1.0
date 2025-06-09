
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Route,
  Brain,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  User,
  Stethoscope
} from 'lucide-react';

export const CaseRoutingDashboard = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  const pendingCases = [
    {
      id: 1,
      patientName: 'John Smith',
      age: 45,
      condition: 'Chest pain, shortness of breath',
      aiClassification: 'Cardiology',
      priority: 'high',
      confidence: 94.2,
      estimatedWaitTime: '15 min',
      assignedSpecialist: null,
      timestamp: '2024-06-09 14:30'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      age: 32,
      condition: 'Severe headache, vision changes',
      aiClassification: 'Neurology',
      priority: 'urgent',
      confidence: 97.8,
      estimatedWaitTime: '5 min',
      assignedSpecialist: 'Dr. Williams',
      timestamp: '2024-06-09 14:25'
    },
    {
      id: 3,
      patientName: 'Mike Wilson',
      age: 28,
      condition: 'Ankle injury from sports',
      aiClassification: 'Orthopedics',
      priority: 'medium',
      confidence: 89.1,
      estimatedWaitTime: '30 min',
      assignedSpecialist: null,
      timestamp: '2024-06-09 14:20'
    }
  ];

  const routingStats = [
    {
      specialty: 'Emergency Medicine',
      waitingPatients: 8,
      averageWaitTime: '12 min',
      aiAccuracy: 96.2,
      availableStaff: 3
    },
    {
      specialty: 'Cardiology',
      waitingPatients: 5,
      averageWaitTime: '25 min',
      aiAccuracy: 94.7,
      availableStaff: 2
    },
    {
      specialty: 'Neurology',
      waitingPatients: 3,
      averageWaitTime: '18 min',
      aiAccuracy: 97.1,
      availableStaff: 1
    },
    {
      specialty: 'Orthopedics',
      waitingPatients: 6,
      averageWaitTime: '35 min',
      aiAccuracy: 91.8,
      availableStaff: 2
    }
  ];

  const recentRoutingDecisions = [
    {
      id: 1,
      patient: 'Emma Davis',
      condition: 'Acute abdominal pain',
      aiSuggestion: 'Gastroenterology',
      finalAssignment: 'Gastroenterology',
      confidence: 92.5,
      outcome: 'correct',
      timestamp: '14:15'
    },
    {
      id: 2,
      patient: 'Robert Lee',
      condition: 'Breathing difficulty',
      aiSuggestion: 'Pulmonology',
      finalAssignment: 'Emergency Medicine',
      confidence: 87.3,
      outcome: 'override',
      timestamp: '14:10'
    },
    {
      id: 3,
      patient: 'Lisa Brown',
      condition: 'Joint pain and swelling',
      aiSuggestion: 'Rheumatology',
      finalAssignment: 'Rheumatology',
      confidence: 95.1,
      outcome: 'correct',
      timestamp: '14:05'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'correct': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'override': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Routing Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">Cases Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">94.8%</div>
            <div className="text-sm text-gray-600">AI Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">18min</div>
            <div className="text-sm text-gray-600">Avg Wait Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-gray-600">Available Specialists</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Cases</TabsTrigger>
          <TabsTrigger value="specialties">Specialty Overview</TabsTrigger>
          <TabsTrigger value="decisions">Recent Decisions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Pending Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                AI-Powered Case Routing Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <User className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{case_.patientName}, {case_.age}</div>
                        <div className="text-sm text-gray-700">{case_.condition}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <Brain className="h-3 w-3" />
                          AI suggests: {case_.aiClassification} ({case_.confidence}% confidence)
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getPriorityColor(case_.priority)}>
                          {case_.priority} priority
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Est. wait: {case_.estimatedWaitTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {case_.assignedSpecialist ? `Assigned to ${case_.assignedSpecialist}` : 'Unassigned'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Accept AI
                        </Button>
                        <Button variant="outline" size="sm">
                          Override
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-4">
          {/* Specialty Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Specialty Department Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routingStats.map((specialty, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{specialty.specialty}</div>
                        <div className="text-sm text-gray-600">
                          AI Accuracy: {specialty.aiAccuracy}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{specialty.waitingPatients}</div>
                        <div className="text-xs text-gray-600">Waiting</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{specialty.averageWaitTime}</div>
                        <div className="text-xs text-gray-600">Avg Wait</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{specialty.availableStaff}</div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          {/* Recent Routing Decisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent AI Routing Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRoutingDecisions.map((decision) => (
                  <div key={decision.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getOutcomeIcon(decision.outcome)}
                      <div>
                        <div className="font-medium">{decision.patient}</div>
                        <div className="text-sm text-gray-700">{decision.condition}</div>
                        <div className="text-xs text-gray-500">
                          {decision.timestamp} • {decision.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-gray-600">AI:</span> {decision.aiSuggestion}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Final:</span> {decision.finalAssignment}
                      </div>
                      <Badge variant={decision.outcome === 'correct' ? 'default' : 'secondary'}>
                        {decision.outcome}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
