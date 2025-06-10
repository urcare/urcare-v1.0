
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  MapPin,
  FileText,
  Users,
  Home,
  Building,
  Heart,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

export const LongTermCarePlanning = () => {
  const [careTransitions, setCareTransitions] = useState([
    {
      id: 1,
      fromSetting: 'Hospital',
      toSetting: 'Skilled Nursing Facility',
      scheduledDate: '2024-01-20',
      status: 'planned',
      reason: 'Post-acute rehabilitation',
      coordinatedBy: 'Case Manager Smith'
    },
    {
      id: 2,
      fromSetting: 'Skilled Nursing Facility',
      toSetting: 'Home with Home Health',
      scheduledDate: '2024-02-15',
      status: 'pending',
      reason: 'Goal achievement in rehabilitation',
      coordinatedBy: 'Social Worker Johnson'
    }
  ]);

  const [resources, setResources] = useState([
    {
      id: 1,
      type: 'Transportation',
      provider: 'Medical Transport Services',
      availability: 'Available',
      cost: '$150 per trip',
      coverage: 'Medicare Part B',
      contactInfo: '(555) 123-4567'
    },
    {
      id: 2,
      type: 'Home Health',
      provider: 'Regional Home Healthcare',
      availability: 'Available',
      cost: '$200 per visit',
      coverage: 'Medicare Part A',
      contactInfo: '(555) 234-5678'
    },
    {
      id: 3,
      type: 'Adult Day Care',
      provider: 'Sunrise Adult Day Center',
      availability: 'Waitlist',
      cost: '$85 per day',
      coverage: 'Private pay',
      contactInfo: '(555) 345-6789'
    },
    {
      id: 4,
      type: 'Respite Care',
      provider: 'Family Caregiver Support',
      availability: 'Available',
      cost: '$25 per hour',
      coverage: 'Veterans Affairs',
      contactInfo: '(555) 456-7890'
    }
  ]);

  const advanceDirectives = {
    livingWill: {
      status: 'completed',
      lastUpdated: '2023-11-15',
      preferences: {
        lifeSustaining: 'Limited interventions',
        resuscitation: 'Do not resuscitate',
        artificialNutrition: 'Short-term only',
        painManagement: 'Comfort care priority'
      }
    },
    healthcarePOA: {
      status: 'completed',
      lastUpdated: '2023-11-15',
      agent: 'Margaret Johnson (Daughter)',
      alternateAgent: 'Robert Johnson (Son)',
      contactInfo: '(555) 987-6543'
    },
    financialPOA: {
      status: 'completed',
      lastUpdated: '2023-10-20',
      agent: 'Robert Johnson (Son)',
      contactInfo: '(555) 876-5432'
    },
    polst: {
      status: 'pending',
      lastUpdated: null,
      needsCompletion: true
    }
  };

  const careSettings = [
    {
      id: 'home',
      name: 'Aging in Place',
      icon: Home,
      description: 'Remain at home with support services',
      pros: ['Familiar environment', 'Independence', 'Cost-effective'],
      cons: ['Limited 24/7 support', 'Safety concerns', 'Caregiver burden'],
      cost: '$2,000-5,000/month',
      suitability: 'high'
    },
    {
      id: 'assisted',
      name: 'Assisted Living',
      icon: Building,
      description: 'Independent living with assistance available',
      pros: ['Social interaction', 'Meals provided', 'Emergency response'],
      cons: ['Less independence', 'Higher cost', 'Adjustment period'],
      cost: '$4,000-7,000/month',
      suitability: 'medium'
    },
    {
      id: 'memory',
      name: 'Memory Care',
      icon: Brain,
      description: 'Specialized care for dementia and cognitive impairment',
      pros: ['Specialized staff', 'Secure environment', 'Structured activities'],
      cons: ['Highest cost', 'Limited independence', 'Emotional adjustment'],
      cost: '$6,000-10,000/month',
      suitability: 'low'
    },
    {
      id: 'skilled',
      name: 'Skilled Nursing',
      icon: Heart,
      description: '24/7 medical care and supervision',
      pros: ['Medical supervision', 'Rehabilitation services', 'Insurance coverage'],
      cons: ['Institutional setting', 'Limited privacy', 'Adjustment challenges'],
      cost: '$8,000-12,000/month',
      suitability: 'medium'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuitabilityColor = (suitability) => {
    switch(suitability) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const scheduleTransition = (transitionId) => {
    setCareTransitions(prev => 
      prev.map(transition => 
        transition.id === transitionId 
          ? { ...transition, status: 'scheduled' }
          : transition
      )
    );
  };

  const completeDirective = (directiveType) => {
    // Simulate completing an advance directive
    console.log(`Completing ${directiveType} directive`);
  };

  return (
    <div className="space-y-6">
      {/* Planning Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{careTransitions.length}</div>
            <div className="text-sm text-gray-600">Planned Transitions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{resources.filter(r => r.availability === 'Available').length}</div>
            <div className="text-sm text-gray-600">Available Resources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(advanceDirectives).filter(d => d.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed Directives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{careSettings.length}</div>
            <div className="text-sm text-gray-600">Care Options</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transitions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transitions">Care Transitions</TabsTrigger>
          <TabsTrigger value="resources">Resource Coordination</TabsTrigger>
          <TabsTrigger value="directives">Advance Directives</TabsTrigger>
          <TabsTrigger value="settings">Care Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transitions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Care Transition Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careTransitions.map((transition) => (
                  <div key={transition.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {transition.fromSetting} → {transition.toSetting}
                        </span>
                      </div>
                      <Badge className={getStatusColor(transition.status)}>
                        {transition.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Scheduled Date:</span>
                        <div className="text-gray-600">{transition.scheduledDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Reason:</span>
                        <div className="text-gray-600">{transition.reason}</div>
                      </div>
                      <div>
                        <span className="font-medium">Coordinated By:</span>
                        <div className="text-gray-600">{transition.coordinatedBy}</div>
                      </div>
                    </div>
                    {transition.status === 'planned' && (
                      <Button 
                        size="sm" 
                        className="mt-3"
                        onClick={() => scheduleTransition(transition.id)}
                      >
                        Confirm Transition
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {resource.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">Provider</div>
                      <div className="text-sm text-gray-600">{resource.provider}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Availability</div>
                        <Badge className={resource.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {resource.availability}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Cost</div>
                        <div className="text-sm text-gray-600">{resource.cost}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Insurance Coverage</div>
                      <div className="text-sm text-gray-600">{resource.coverage}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Contact</div>
                      <div className="text-sm text-gray-600">{resource.contactInfo}</div>
                    </div>
                    <Button size="sm" className="w-full">
                      Request Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="directives" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Living Will
                </CardTitle>
                <Badge className={getStatusColor(advanceDirectives.livingWill.status)}>
                  {advanceDirectives.livingWill.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Last updated: {advanceDirectives.livingWill.lastUpdated}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(advanceDirectives.livingWill.preferences).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="w-full">
                    Review & Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Healthcare Power of Attorney
                </CardTitle>
                <Badge className={getStatusColor(advanceDirectives.healthcarePOA.status)}>
                  {advanceDirectives.healthcarePOA.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Last updated: {advanceDirectives.healthcarePOA.lastUpdated}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Primary Agent</div>
                    <div className="text-sm text-gray-600">{advanceDirectives.healthcarePOA.agent}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Alternate Agent</div>
                    <div className="text-sm text-gray-600">{advanceDirectives.healthcarePOA.alternateAgent}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Contact</div>
                    <div className="text-sm text-gray-600">{advanceDirectives.healthcarePOA.contactInfo}</div>
                  </div>
                  <Button size="sm" className="w-full">
                    Review & Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Financial Power of Attorney
                </CardTitle>
                <Badge className={getStatusColor(advanceDirectives.financialPOA.status)}>
                  {advanceDirectives.financialPOA.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Last updated: {advanceDirectives.financialPOA.lastUpdated}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Agent</div>
                    <div className="text-sm text-gray-600">{advanceDirectives.financialPOA.agent}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Contact</div>
                    <div className="text-sm text-gray-600">{advanceDirectives.financialPOA.contactInfo}</div>
                  </div>
                  <Button size="sm" className="w-full">
                    Review & Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  POLST Form
                </CardTitle>
                <Badge className={getStatusColor(advanceDirectives.polst.status)}>
                  {advanceDirectives.polst.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advanceDirectives.polst.needsCompletion && (
                    <div className="text-sm text-red-600">
                      POLST form needs completion
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    Physician Orders for Life-Sustaining Treatment
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => completeDirective('polst')}
                  >
                    Complete POLST
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careSettings.map((setting) => {
              const IconComponent = setting.icon;
              return (
                <Card key={setting.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {setting.name}
                      </div>
                      <Badge className={getSuitabilityColor(setting.suitability)}>
                        {setting.suitability} suitability
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Estimated Cost</div>
                        <div className="text-sm text-gray-600">{setting.cost}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Advantages</div>
                        <div className="space-y-1">
                          {setting.pros.map((pro, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{pro}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Considerations</div>
                        <div className="space-y-1">
                          {setting.cons.map((con, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-yellow-500" />
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
