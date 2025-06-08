
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Globe,
  FileText,
  Calendar,
  Video,
  Link,
  UserPlus,
  Search
} from 'lucide-react';

export const ResearchCollaboration = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const collaborationMetrics = {
    totalCollaborators: 234,
    activeProjects: 45,
    institutions: 28,
    countries: 12,
    sharedDatasets: 156,
    jointPublications: 89
  };

  const activeCollaborations = [
    {
      id: 'COLLAB-001',
      title: 'Multi-Center AI in Cardiology Study',
      lead: 'Dr. Sarah Johnson',
      institutions: ['Johns Hopkins', 'Stanford', 'Mayo Clinic'],
      participants: 23,
      status: 'active',
      type: 'research',
      progress: 67,
      lastActivity: '2024-01-20',
      nextMeeting: '2024-01-25'
    },
    {
      id: 'COLLAB-002',
      title: 'Global Cancer Genomics Initiative',
      lead: 'Dr. Michael Chen',
      institutions: ['Harvard', 'Oxford', 'Karolinska Institute'],
      participants: 45,
      status: 'active',
      type: 'consortium',
      progress: 23,
      lastActivity: '2024-01-18',
      nextMeeting: '2024-01-30'
    },
    {
      id: 'COLLAB-003',
      title: 'Pediatric Rare Disease Network',
      lead: 'Dr. Emily Rodriguez',
      institutions: ['CHOP', 'Boston Children\'s', 'SickKids'],
      participants: 18,
      status: 'planning',
      type: 'network',
      progress: 89,
      lastActivity: '2024-01-15',
      nextMeeting: '2024-02-05'
    }
  ];

  const collaborators = [
    {
      name: 'Dr. James Wilson',
      institution: 'Stanford University',
      expertise: 'Machine Learning',
      projects: 8,
      publications: 23,
      avatar: '/placeholder.svg',
      status: 'online',
      lastContact: '2 hours ago'
    },
    {
      name: 'Dr. Maria Garcia',
      institution: 'Harvard Medical School',
      expertise: 'Clinical Research',
      projects: 12,
      publications: 34,
      avatar: '/placeholder.svg',
      status: 'away',
      lastContact: '1 day ago'
    },
    {
      name: 'Dr. David Kim',
      institution: 'Johns Hopkins',
      expertise: 'Biostatistics',
      projects: 6,
      publications: 18,
      avatar: '/placeholder.svg',
      status: 'offline',
      lastContact: '3 days ago'
    }
  ];

  const recentActivity = [
    {
      type: 'data_shared',
      user: 'Dr. Sarah Johnson',
      action: 'shared dataset "Cardiac MRI Analysis"',
      project: 'COLLAB-001',
      time: '2 hours ago'
    },
    {
      type: 'meeting_scheduled',
      user: 'Dr. Michael Chen',
      action: 'scheduled virtual meeting',
      project: 'COLLAB-002',
      time: '5 hours ago'
    },
    {
      type: 'document_updated',
      user: 'Dr. Emily Rodriguez',
      action: 'updated protocol document',
      project: 'COLLAB-003',
      time: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'consortium': return 'bg-purple-100 text-purple-800';
      case 'network': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Collaboration</h2>
          <p className="text-gray-600">Team collaboration tools and shared workspaces</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Start Meeting
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Collaborator
          </Button>
        </div>
      </div>

      {/* Collaboration Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{collaborationMetrics.totalCollaborators}</p>
            <p className="text-sm text-blue-700">Collaborators</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{collaborationMetrics.activeProjects}</p>
            <p className="text-sm text-green-700">Active Projects</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{collaborationMetrics.institutions}</p>
            <p className="text-sm text-purple-700">Institutions</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{collaborationMetrics.countries}</p>
            <p className="text-sm text-orange-700">Countries</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Share2 className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{collaborationMetrics.sharedDatasets}</p>
            <p className="text-sm text-teal-700">Shared Datasets</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{collaborationMetrics.jointPublications}</p>
            <p className="text-sm text-indigo-700">Joint Publications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Collaborations */}
        <Card>
          <CardHeader>
            <CardTitle>Active Collaborations</CardTitle>
            <CardDescription>Current research partnerships and shared projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCollaborations.map((collab) => (
                <div key={collab.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{collab.title}</h4>
                      <p className="text-sm text-gray-600">Led by {collab.lead}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(collab.type)}>
                        {collab.type}
                      </Badge>
                      <Badge className={`${getStatusColor(collab.status)} text-white`}>
                        {collab.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>{collab.institutions.join(', ')}</p>
                    <p>{collab.participants} participants</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last activity: {collab.lastActivity}</span>
                    <span>Next meeting: {collab.nextMeeting}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle>Research Team</CardTitle>
            <CardDescription>Your network of research collaborators</CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search collaborators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      collaborator.status === 'online' ? 'bg-green-500' :
                      collaborator.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                    <p className="text-sm text-gray-600">{collaborator.institution}</p>
                    <p className="text-xs text-gray-500">{collaborator.expertise}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-900">{collaborator.projects} projects</p>
                    <p className="text-gray-600">{collaborator.publications} papers</p>
                    <p className="text-xs text-gray-500">{collaborator.lastContact}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest collaboration updates and communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'data_shared' ? 'bg-blue-500' :
                  activity.type === 'meeting_scheduled' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">Project: {activity.project} • {activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
