import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  FileText,
  Heart,
  Phone,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  MapPin,
  Shield
} from 'lucide-react';

export const LongTermCarePlanning = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planningProgress, setPlanningProgress] = useState({
    advanceDirectives: 80,
    careTransitions: 65,
    resourceCoordination: 75,
    familyPlanning: 90,
    financialPlanning: 55,
    legalDocuments: 70
  });

  const planningAreas = [
    {
      id: 'advance-directives',
      name: 'Advance Directives',
      description: 'Legal documents for healthcare decisions',
      progress: planningProgress.advanceDirectives,
      icon: FileText,
      status: planningProgress.advanceDirectives >= 80 ? 'complete' : 'in-progress',
      items: ['Living Will', 'Healthcare Proxy', 'DNR Orders', 'MOLST Form']
    },
    {
      id: 'care-transitions',
      name: 'Care Transitions',
      description: 'Planning for different levels of care',
      progress: planningProgress.careTransitions,
      icon: MapPin,
      status: planningProgress.careTransitions >= 80 ? 'complete' : 'in-progress',
      items: ['Home Care Assessment', 'Assisted Living Options', 'Skilled Nursing', 'Hospice Planning']
    },
    {
      id: 'resource-coordination',
      name: 'Resource Coordination',
      description: 'Community and healthcare resources',
      progress: planningProgress.resourceCoordination,
      icon: Users,
      status: planningProgress.resourceCoordination >= 80 ? 'complete' : 'in-progress',
      items: ['Healthcare Team', 'Community Services', 'Transportation', 'Emergency Contacts']
    },
    {
      id: 'family-planning',
      name: 'Family Communication',
      description: 'Family involvement and communication',
      progress: planningProgress.familyPlanning,
      icon: Heart,
      status: planningProgress.familyPlanning >= 80 ? 'complete' : 'in-progress',
      items: ['Family Meetings', 'Communication Plan', 'Role Assignments', 'Support Network']
    },
    {
      id: 'financial-planning',
      name: 'Financial Planning',
      description: 'Financial and insurance considerations',
      progress: planningProgress.financialPlanning,
      icon: Shield,
      status: planningProgress.financialPlanning >= 80 ? 'complete' : 'in-progress',
      items: ['Insurance Review', 'Long-term Care Insurance', 'Benefits Planning', 'Financial Power of Attorney']
    },
    {
      id: 'legal-documents',
      name: 'Legal Documentation',
      description: 'Legal preparations and documentation',
      progress: planningProgress.legalDocuments,
      icon: FileText,
      status: planningProgress.legalDocuments >= 80 ? 'complete' : 'in-progress',
      items: ['Will and Testament', 'Power of Attorney', 'Trust Documents', 'Property Planning']
    }
  ];

  const carePlans = [
    {
      id: 1,
      patientName: 'Margaret Johnson',
      age: 78,
      planType: 'Comprehensive Care Plan',
      lastUpdated: '2024-01-10',
      status: 'active',
      completionRate: 75,
      nextReview: '2024-02-15'
    },
    {
      id: 2,
      patientName: 'Robert Chen',
      age: 82,
      planType: 'Transitional Care Plan',
      lastUpdated: '2024-01-08',
      status: 'under-review',
      completionRate: 60,
      nextReview: '2024-01-25'
    },
    {
      id: 3,
      patientName: 'Eleanor Davis',
      age: 75,
      planType: 'Advance Care Plan',
      lastUpdated: '2024-01-12',
      status: 'complete',
      completionRate: 95,
      nextReview: '2024-03-12'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updatePlanningProgress = (area) => {
    const newProgress = Math.min(100, planningProgress[area] + 10);
    setPlanningProgress(prev => ({
      ...prev,
      [area]: newProgress
    }));
  };

  return (
    <div className="space-y-6">
      {/* Current Care Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Care Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {carePlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{plan.patientName}</h3>
                      <p className="text-sm text-gray-600">{plan.planType}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{plan.completionRate}%</span>
                      </div>
                      <Progress value={plan.completionRate} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Next review: {plan.nextReview}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planning Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <Card key={area.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {area.name}
                  </div>
                  <Badge className={getStatusColor(area.status)}>
                    {area.status === 'complete' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">{area.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{area.progress}%</span>
                    </div>
                    <Progress value={area.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Planning Items:</h4>
                    <div className="space-y-1">
                      {area.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          {area.progress > 60 && index < 2 ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-gray-400" />
                          )}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => updatePlanningProgress(area.id.replace('-', ''))}
                  >
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Planning Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Long-Term Care Planning Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(Object.values(planningProgress).reduce((a, b) => a + b, 0) / Object.values(planningProgress).length)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(planningProgress).filter(progress => progress >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Complete Areas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(planningProgress).filter(progress => progress < 80 && progress >= 50).length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(planningProgress).filter(progress => progress < 50).length}
                </div>
                <div className="text-sm text-gray-600">Needs Attention</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Next Steps:</h4>
              <div className="space-y-1">
                {planningProgress.financialPlanning < 60 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Financial planning needs immediate attention</span>
                  </div>
                )}
                {planningProgress.careTransitions < 70 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Care transition planning should be prioritized</span>
                  </div>
                )}
                {planningProgress.legalDocuments < 80 && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-yellow-500" />
                    <span>Legal documentation review recommended</span>
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
