
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users,
  FileText,
  MessageCircle,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  Shield
} from 'lucide-react';

export const ParentalInvolvementTools = () => {
  const [selectedChild, setSelectedChild] = useState('child1');
  const [newMessage, setNewMessage] = useState('');

  const children = [
    {
      id: 'child1',
      name: 'Emma Johnson',
      age: '3 years 2 months',
      primaryParent: 'Sarah Johnson',
      secondaryParent: 'Michael Johnson',
      lastVisit: '2024-01-15'
    },
    {
      id: 'child2',
      name: 'Lucas Chen',
      age: '1 year 8 months',
      primaryParent: 'Lisa Chen',
      secondaryParent: 'David Chen',
      lastVisit: '2024-01-10'
    }
  ];

  const consentRequests = [
    {
      id: 1,
      child: 'Emma Johnson',
      procedure: 'Blood Draw for Routine Labs',
      requestedBy: 'Dr. Smith',
      urgency: 'routine',
      status: 'pending',
      dateRequested: '2024-01-16',
      description: 'Routine blood work to check iron levels and complete blood count'
    },
    {
      id: 2,
      child: 'Lucas Chen',
      procedure: 'Chest X-Ray',
      requestedBy: 'Dr. Wilson',
      urgency: 'urgent',
      status: 'approved',
      dateRequested: '2024-01-15',
      description: 'X-ray to evaluate persistent cough symptoms'
    },
    {
      id: 3,
      child: 'Emma Johnson',
      procedure: 'Allergy Testing',
      requestedBy: 'Dr. Brown',
      urgency: 'routine',
      status: 'pending',
      dateRequested: '2024-01-14',
      description: 'Skin prick test to identify food allergies'
    }
  ];

  const communicationLog = [
    {
      id: 1,
      sender: 'Dr. Smith',
      recipient: 'Sarah Johnson',
      message: 'Emma\'s vaccination is due next week. Please schedule an appointment.',
      timestamp: '2024-01-16 10:30 AM',
      type: 'reminder',
      read: true
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      recipient: 'Dr. Smith',
      message: 'Thank you for the reminder. Can we schedule for Friday afternoon?',
      timestamp: '2024-01-16 11:15 AM',
      type: 'response',
      read: true
    },
    {
      id: 3,
      sender: 'Nurse Kelly',
      recipient: 'Lisa Chen',
      message: 'Lucas\'s test results are ready. Everything looks normal!',
      timestamp: '2024-01-15 2:45 PM',
      type: 'update',
      read: false
    }
  ];

  const carePlans = [
    {
      id: 1,
      child: 'Emma Johnson',
      title: 'Routine Health Maintenance',
      goals: [
        'Complete age-appropriate vaccinations',
        'Monitor growth and development',
        'Promote healthy eating habits',
        'Encourage physical activity'
      ],
      nextSteps: [
        'Schedule 3-year wellness visit',
        'Book dental checkup',
        'Complete vision screening'
      ],
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      child: 'Lucas Chen',
      title: 'Respiratory Health Management',
      goals: [
        'Monitor breathing patterns',
        'Complete antibiotic course',
        'Follow up chest X-ray',
        'Prevent future respiratory infections'
      ],
      nextSteps: [
        'Return in 1 week for follow-up',
        'Continue prescribed medications',
        'Monitor for any worsening symptoms'
      ],
      lastUpdated: '2024-01-14'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedChildData = children.find(c => c.id === selectedChild);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="consent" className="w-full">
        <TabsList>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="communication">Communication Portal</TabsTrigger>
          <TabsTrigger value="careplan">Care Plan Sharing</TabsTrigger>
          <TabsTrigger value="family">Family Access</TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-4">
          {/* Child Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child) => (
                  <Card 
                    key={child.id} 
                    className={`cursor-pointer transition-all ${selectedChild === child.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                    onClick={() => setSelectedChild(child.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium">{child.name}</div>
                        <div className="text-sm text-gray-600">{child.age}</div>
                        <div className="text-sm">
                          <div>Primary: {child.primaryParent}</div>
                          <div>Secondary: {child.secondaryParent}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last visit: {child.lastVisit}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consent Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consent Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{request.procedure}</h3>
                        <p className="text-sm text-gray-600">Patient: {request.child}</p>
                        <p className="text-sm text-gray-600">Requested by: {request.requestedBy}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{request.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Requested: {request.dateRequested}
                      </span>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Request Info
                          </Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Communication Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Message Composer */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Send Message to Healthcare Team</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mt-2"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Response expected within 24 hours for non-urgent matters
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Mark Urgent
                      </Button>
                      <Button size="sm">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Communication History */}
                <div className="space-y-3">
                  <h3 className="font-medium">Recent Communications</h3>
                  {communicationLog.map((message) => (
                    <div key={message.id} className={`p-3 rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">
                            {message.sender} → {message.recipient}
                          </div>
                          <p className="text-sm mt-1">{message.message}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={message.type === 'reminder' ? 'bg-yellow-100 text-yellow-800' : message.type === 'update' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {message.type}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careplan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Care Plan Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {carePlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{plan.title}</h3>
                        <p className="text-sm text-gray-600">Patient: {plan.child}</p>
                      </div>
                      <div className="text-right">
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {plan.lastUpdated}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Health Goals
                        </h4>
                        <ul className="space-y-1">
                          {plan.goals.map((goal, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Next Steps
                        </h4>
                        <ul className="space-y-1">
                          {plan.nextSteps.map((step, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <Clock className="h-3 w-3 text-blue-600" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Family Access Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChildData && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Authorized Family Members - {selectedChildData.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{selectedChildData.primaryParent}</div>
                          <div className="text-sm text-gray-600">Primary Guardian - Full Access</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{selectedChildData.secondaryParent}</div>
                          <div className="text-sm text-gray-600">Secondary Guardian - Full Access</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div>
                          <div className="font-medium">Add Family Member</div>
                          <div className="text-sm text-gray-600">Grant access to grandparents, caregivers, etc.</div>
                        </div>
                        <Button size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Add Member
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Access Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Medical Information</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            View medical records
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Access test results
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Review medications
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Care Management</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Schedule appointments
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Provide consent
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Communicate with providers
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
