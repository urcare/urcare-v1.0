
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users,
  Video,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Settings,
  UserPlus,
  BarChart3,
  Heart,
  Star
} from 'lucide-react';

export const SupportGroupManagement = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const supportGroups = [
    {
      id: 1,
      name: 'Depression Support Circle',
      category: 'Depression',
      facilitator: 'Dr. Sarah Martinez',
      participants: 12,
      maxParticipants: 15,
      nextMeeting: '2024-01-17 18:00',
      frequency: 'Weekly',
      format: 'Virtual',
      description: 'A safe space to share experiences and coping strategies for depression.',
      status: 'active',
      avgAttendance: 85,
      satisfaction: 4.6
    },
    {
      id: 2,
      name: 'Anxiety Warriors',
      category: 'Anxiety',
      facilitator: 'Dr. James Wilson',
      participants: 8,
      maxParticipants: 12,
      nextMeeting: '2024-01-18 19:00',
      frequency: 'Bi-weekly',
      format: 'Hybrid',
      description: 'Learn anxiety management techniques with peer support.',
      status: 'active',
      avgAttendance: 92,
      satisfaction: 4.8
    },
    {
      id: 3,
      name: 'PTSD Recovery Network',
      category: 'PTSD',
      facilitator: 'Dr. Emily Brown',
      participants: 6,
      maxParticipants: 10,
      nextMeeting: '2024-01-19 17:00',
      frequency: 'Weekly',
      format: 'In-person',
      description: 'Trauma-informed support group for PTSD recovery.',
      status: 'active',
      avgAttendance: 78,
      satisfaction: 4.7
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      groupName: 'Depression Support Circle',
      date: '2024-01-17',
      time: '18:00',
      duration: 90,
      format: 'Virtual',
      facilitator: 'Dr. Sarah Martinez',
      topic: 'Coping with Winter Blues',
      participants: 11,
      status: 'scheduled'
    },
    {
      id: 2,
      groupName: 'Anxiety Warriors',
      date: '2024-01-18',
      time: '19:00',
      duration: 60,
      format: 'Hybrid',
      facilitator: 'Dr. James Wilson',
      topic: 'Breathing Techniques Workshop',
      participants: 7,
      status: 'confirmed'
    }
  ];

  const participantEngagement = [
    {
      id: 1,
      name: 'Sarah Johnson',
      group: 'Depression Support Circle',
      attendance: '8/10',
      lastActive: '2024-01-15',
      engagement: 'high',
      notes: 'Actively participates, shares helpful insights'
    },
    {
      id: 2,
      name: 'Michael Chen',
      group: 'Anxiety Warriors',
      attendance: '6/8',
      lastActive: '2024-01-14',
      engagement: 'medium',
      notes: 'Quiet participant, benefits from listening'
    },
    {
      id: 3,
      name: 'Emily Davis',
      group: 'PTSD Recovery Network',
      attendance: '4/8',
      lastActive: '2024-01-10',
      engagement: 'low',
      notes: 'Needs additional check-in, missed recent sessions'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Virtual': return Video;
      case 'In-person': return MapPin;
      case 'Hybrid': return Users;
      default: return Users;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="groups" className="w-full">
        <TabsList>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Support Groups</h2>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportGroups.map((group) => {
              const FormatIcon = getFormatIcon(group.format);
              return (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{group.name}</span>
                      <Badge className={getStatusColor(group.status)}>
                        {group.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{group.category}</Badge>
                      <div className="flex items-center gap-1">
                        <FormatIcon className="h-3 w-3" />
                        <span className="text-xs">{group.format}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facilitator:</span>
                        <span>{group.facilitator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span>{group.participants}/{group.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span>{group.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Meeting:</span>
                        <span>{new Date(group.nextMeeting).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span className="font-medium">{group.avgAttendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${group.avgAttendance}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Satisfaction</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{group.satisfaction}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Support Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" placeholder="Enter group name" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Depression, Anxiety, etc." />
                </div>
                <div>
                  <Label htmlFor="facilitator">Facilitator</Label>
                  <Input id="facilitator" placeholder="Select facilitator" />
                </div>
                <div>
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Input id="max-participants" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="frequency">Meeting Frequency</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select frequency</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="format">Meeting Format</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select format</option>
                    <option value="virtual">Virtual</option>
                    <option value="in-person">In-person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the group's purpose and goals" />
              </div>
              <Button className="w-full">Create Support Group</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => {
                  const FormatIcon = getFormatIcon(meeting.format);
                  return (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{meeting.time}</span>
                        </div>
                        <div>
                          <div className="font-medium">{meeting.groupName}</div>
                          <div className="text-sm text-gray-600">{meeting.topic}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FormatIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{meeting.format}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{meeting.participants} participants</div>
                          <div className="text-sm text-gray-600">{meeting.duration} min</div>
                        </div>
                        <Badge className={meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {meeting.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Video className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule New Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-group">Support Group</Label>
                  <Input id="meeting-group" placeholder="Select group" />
                </div>
                <div>
                  <Label htmlFor="meeting-topic">Meeting Topic</Label>
                  <Input id="meeting-topic" placeholder="Enter topic" />
                </div>
                <div>
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input id="meeting-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="meeting-time">Time</Label>
                  <Input id="meeting-time" type="time" />
                </div>
                <div>
                  <Label htmlFor="meeting-duration">Duration (minutes)</Label>
                  <Input id="meeting-duration" type="number" placeholder="90" />
                </div>
                <div>
                  <Label htmlFor="meeting-format">Format</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select format</option>
                    <option value="virtual">Virtual</option>
                    <option value="in-person">In-person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <Button className="w-full">Schedule Meeting</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participant Engagement Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participantEngagement.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-gray-600">{participant.group}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Attendance: {participant.attendance}</div>
                        <div className="text-sm text-gray-600">Last active: {participant.lastActive}</div>
                      </div>
                      <Badge className={getEngagementColor(participant.engagement)}>
                        {participant.engagement} engagement
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Participant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participant-name">Participant Name</Label>
                  <Input id="participant-name" placeholder="Enter name" />
                </div>
                <div>
                  <Label htmlFor="participant-group">Support Group</Label>
                  <Input id="participant-group" placeholder="Select group" />
                </div>
                <div>
                  <Label htmlFor="participant-email">Email</Label>
                  <Input id="participant-email" type="email" placeholder="Enter email" />
                </div>
                <div>
                  <Label htmlFor="participant-phone">Phone</Label>
                  <Input id="participant-phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div>
                <Label htmlFor="participant-notes">Notes</Label>
                <Textarea id="participant-notes" placeholder="Any special considerations or notes" />
              </div>
              <Button className="w-full">Add Participant</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Participants</span>
                </div>
                <div className="text-2xl font-bold">26</div>
                <div className="text-sm text-green-600">+3 this week</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Avg Attendance</span>
                </div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-green-600">+2% from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Satisfaction</span>
                </div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-green-600">+0.1 from last quarter</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Active Groups</span>
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">All groups active</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Support Group Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Group Performance Overview</h3>
                  <div className="space-y-4">
                    {supportGroups.map((group) => (
                      <div key={group.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{group.name}</span>
                          <Badge variant="outline">{group.participants} participants</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Attendance Rate:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${group.avgAttendance}%` }}
                              ></div>
                            </div>
                            <span className="text-green-600 font-medium">{group.avgAttendance}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Satisfaction Score:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{group.satisfaction}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
