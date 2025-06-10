
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  MessageSquare,
  FileText,
  Bell,
  Calendar,
  Heart,
  BookOpen,
  Share2
} from 'lucide-react';

export const FamilyCaregiverPortal = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'medical',
      title: 'Medication Schedule Update',
      message: 'Dr. Smith has updated the medication schedule for morning doses.',
      timestamp: '2024-01-15 09:30',
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      message: 'Cardiology appointment scheduled for January 20th at 2:00 PM.',
      timestamp: '2024-01-14 14:15',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'care_plan',
      title: 'Care Plan Update',
      message: 'Physical therapy plan has been updated with new exercises.',
      timestamp: '2024-01-13 11:45',
      read: true,
      priority: 'low'
    }
  ]);

  const careTeam = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Primary Care Physician',
      specialty: 'Geriatric Medicine',
      phone: '(555) 123-4567',
      email: 'sjohnson@hospital.com',
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      name: 'Maria Rodriguez, RN',
      role: 'Care Coordinator',
      specialty: 'Nursing',
      phone: '(555) 234-5678',
      email: 'mrodriguez@hospital.com',
      lastContact: '2024-01-14'
    },
    {
      id: 3,
      name: 'James Chen, PharmD',
      role: 'Clinical Pharmacist',
      specialty: 'Pharmacy',
      phone: '(555) 345-6789',
      email: 'jchen@hospital.com',
      lastContact: '2024-01-12'
    }
  ];

  const educationalResources = [
    {
      id: 1,
      title: 'Understanding Dementia Care',
      category: 'Cognitive Health',
      type: 'video',
      duration: '15 minutes',
      description: 'Learn effective strategies for caring for someone with dementia.',
      rating: 4.8,
      views: 2543
    },
    {
      id: 2,
      title: 'Fall Prevention at Home',
      category: 'Safety',
      type: 'guide',
      duration: '10 minutes',
      description: 'Comprehensive guide to making your home safer for elderly loved ones.',
      rating: 4.6,
      views: 1876
    },
    {
      id: 3,
      title: 'Medication Management Tips',
      category: 'Medication',
      type: 'checklist',
      duration: '5 minutes',
      description: 'Essential tips for managing multiple medications safely.',
      rating: 4.9,
      views: 3201
    },
    {
      id: 4,
      title: 'Recognizing Depression in Seniors',
      category: 'Mental Health',
      type: 'article',
      duration: '12 minutes',
      description: 'Understanding the signs and symptoms of depression in older adults.',
      rating: 4.7,
      views: 1654
    }
  ];

  const carePlan = {
    lastUpdated: '2024-01-15',
    goals: [
      'Maintain independence in activities of daily living',
      'Prevent falls and injuries',
      'Manage chronic conditions effectively',
      'Improve social engagement and mental health'
    ],
    currentInterventions: [
      'Physical therapy 3x per week',
      'Medication management review monthly',
      'Social worker visits bi-weekly',
      'Family education and support'
    ],
    upcomingMilestones: [
      { date: '2024-01-25', milestone: 'Physical therapy evaluation' },
      { date: '2024-02-01', milestone: 'Medication review appointment' },
      { date: '2024-02-15', milestone: 'Care plan reassessment' }
    ]
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const sendMessage = (teamMemberId) => {
    // Simulate sending a message
    console.log(`Sending message to team member ${teamMemberId}`);
  };

  const shareCarePlan = () => {
    // Simulate sharing care plan
    console.log('Sharing care plan with family members');
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{notifications.filter(n => !n.read).length}</div>
            <div className="text-sm text-gray-600">New Notifications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{careTeam.length}</div>
            <div className="text-sm text-gray-600">Care Team Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{carePlan.upcomingMilestones.length}</div>
            <div className="text-sm text-gray-600">Upcoming Milestones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{educationalResources.length}</div>
            <div className="text-sm text-gray-600">Resources Available</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="careteam">Care Team</TabsTrigger>
          <TabsTrigger value="careplan">Care Plan</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="text-xs text-gray-500">{notification.timestamp}</div>
                      </div>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careteam" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careTeam.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {member.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">Specialty</div>
                      <div className="text-sm text-gray-600">{member.specialty}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Contact</div>
                      <div className="text-sm text-gray-600">{member.phone}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Last Contact</div>
                      <div className="text-sm text-gray-600">{member.lastContact}</div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => sendMessage(member.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="careplan" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Current Care Plan
                  </div>
                  <Button size="sm" onClick={shareCarePlan}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardTitle>
                <p className="text-sm text-gray-600">Last updated: {carePlan.lastUpdated}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Goals:</h4>
                    <div className="space-y-1">
                      {carePlan.goals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Active Interventions:</h4>
                    <div className="space-y-1">
                      {carePlan.currentInterventions.map((intervention, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>{intervention}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {carePlan.upcomingMilestones.map((milestone, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{milestone.milestone}</div>
                      <div className="text-sm text-gray-600">{milestone.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationalResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {resource.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{resource.category}</Badge>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="text-gray-600 ml-2">{resource.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <span className="text-gray-600 ml-2">{resource.rating}/5</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {resource.views} views
                    </div>
                    <Button size="sm" className="w-full">
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
