
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, MapPin, Video, Plus, Star, UserCheck, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SupportGroup {
  id: string;
  title: string;
  description: string;
  facilitator: {
    name: string;
    avatar: string;
    credentials: string;
  };
  schedule: {
    day: string;
    time: string;
    duration: number;
    timezone: string;
  };
  capacity: number;
  enrolled: number;
  waitlist: number;
  format: 'in-person' | 'virtual' | 'hybrid';
  location?: string;
  meetingLink?: string;
  condition: string;
  isEnrolled: boolean;
  nextSession: string;
  rating: number;
  tags: string[];
}

export const SupportGroups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'my-groups' | 'browse'>('upcoming');

  const [newGroup, setNewGroup] = useState({
    title: '',
    description: '',
    condition: '',
    format: 'virtual' as const,
    day: '',
    time: '',
    capacity: 10
  });

  const [supportGroups] = useState<SupportGroup[]>([
    {
      id: '1',
      title: 'Diabetes Management Circle',
      description: 'Weekly support group focused on practical diabetes management strategies, nutrition tips, and emotional support for daily challenges.',
      facilitator: {
        name: 'Dr. Sarah Chen',
        avatar: '/placeholder.svg',
        credentials: 'Endocrinologist, CDE'
      },
      schedule: {
        day: 'Tuesday',
        time: '7:00 PM',
        duration: 60,
        timezone: 'EST'
      },
      capacity: 12,
      enrolled: 8,
      waitlist: 2,
      format: 'virtual',
      meetingLink: 'https://meet.wellness.com/diabetes-support',
      condition: 'Type 2 Diabetes',
      isEnrolled: true,
      nextSession: '2024-01-23',
      rating: 4.8,
      tags: ['beginner-friendly', 'nutrition', 'medication-management']
    },
    {
      id: '2',
      title: 'Heart Health Recovery Group',
      description: 'Post-surgery support group for cardiac patients focusing on recovery, exercise, and lifestyle modifications.',
      facilitator: {
        name: 'Maria Rodriguez',
        avatar: '/placeholder.svg',
        credentials: 'Cardiac Rehabilitation Specialist'
      },
      schedule: {
        day: 'Thursday',
        time: '2:00 PM',
        duration: 90,
        timezone: 'EST'
      },
      capacity: 10,
      enrolled: 6,
      waitlist: 0,
      format: 'hybrid',
      location: 'Community Health Center, Room 204',
      meetingLink: 'https://meet.wellness.com/heart-recovery',
      condition: 'Heart Disease',
      isEnrolled: false,
      nextSession: '2024-01-25',
      rating: 4.9,
      tags: ['post-surgery', 'exercise', 'family-welcome']
    },
    {
      id: '3',
      title: 'Cancer Survivors Circle',
      description: 'Private support group for cancer survivors and their families. Focus on emotional healing and building resilience.',
      facilitator: {
        name: 'Dr. Emily Thompson',
        avatar: '/placeholder.svg',
        credentials: 'Oncology Social Worker'
      },
      schedule: {
        day: 'Monday',
        time: '6:30 PM',
        duration: 75,
        timezone: 'EST'
      },
      capacity: 8,
      enrolled: 7,
      waitlist: 3,
      format: 'virtual',
      meetingLink: 'https://meet.wellness.com/cancer-survivors',
      condition: 'Cancer',
      isEnrolled: true,
      nextSession: '2024-01-22',
      rating: 5.0,
      tags: ['survivors-only', 'emotional-support', 'confidential']
    }
  ]);

  const conditions = ['all', 'diabetes', 'heart-disease', 'cancer', 'mental-health', 'chronic-pain'];

  const joinGroup = (groupId: string) => {
    toast.success('Successfully enrolled in support group!');
  };

  const leaveGroup = (groupId: string) => {
    toast.success('Left support group');
  };

  const createGroup = () => {
    if (!newGroup.title || !newGroup.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Support group created successfully!');
    setShowCreateForm(false);
    setNewGroup({
      title: '',
      description: '',
      condition: '',
      format: 'virtual',
      day: '',
      time: '',
      capacity: 10
    });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'virtual': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <div className="flex items-center gap-1"><Video className="h-3 w-3" /><MapPin className="h-3 w-3" /></div>;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const filteredGroups = selectedFilter === 'all' 
    ? supportGroups 
    : supportGroups.filter(group => group.condition.toLowerCase().includes(selectedFilter.replace('-', ' ')));

  const getGroupsByView = () => {
    switch (viewMode) {
      case 'my-groups':
        return filteredGroups.filter(group => group.isEnrolled);
      case 'browse':
        return filteredGroups.filter(group => !group.isEnrolled);
      default:
        return filteredGroups;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Support Groups
              </CardTitle>
              <CardDescription>
                Join facilitated support groups for peer connection and professional guidance
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* View Mode Selector */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setViewMode('upcoming')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming Sessions
        </Button>
        <Button
          variant={viewMode === 'my-groups' ? 'default' : 'outline'}
          onClick={() => setViewMode('my-groups')}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          My Groups ({supportGroups.filter(g => g.isEnrolled).length})
        </Button>
        <Button
          variant={viewMode === 'browse' ? 'default' : 'outline'}
          onClick={() => setViewMode('browse')}
        >
          <Users className="h-4 w-4 mr-2" />
          Browse Groups
        </Button>
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Group</CardTitle>
            <CardDescription>
              Set up a new support group for your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="group-title">Group Title</Label>
                <Input
                  id="group-title"
                  placeholder="e.g., Weekly Diabetes Support"
                  value={newGroup.title}
                  onChange={(e) => setNewGroup({...newGroup, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="group-condition">Condition/Focus</Label>
                <Input
                  id="group-condition"
                  placeholder="e.g., Type 2 Diabetes"
                  value={newGroup.condition}
                  onChange={(e) => setNewGroup({...newGroup, condition: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="group-description">Description</Label>
              <Textarea
                id="group-description"
                placeholder="Describe the group's purpose, goals, and what participants can expect..."
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="group-format">Format</Label>
                <Select value={newGroup.format} onValueChange={(value: any) => setNewGroup({...newGroup, format: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-day">Day of Week</Label>
                <Select value={newGroup.day} onValueChange={(value) => setNewGroup({...newGroup, day: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-time">Time</Label>
                <Input
                  id="group-time"
                  type="time"
                  value={newGroup.time}
                  onChange={(e) => setNewGroup({...newGroup, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createGroup}>Create Group</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => (
          <Button
            key={condition}
            variant={selectedFilter === condition ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(condition)}
          >
            {condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>

      {/* Support Groups List */}
      <div className="space-y-4">
        {getGroupsByView().map((group) => (
          <Card key={group.id} className={group.isEnrolled ? 'border-blue-200 bg-blue-50' : ''}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Group Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{group.title}</h3>
                      {group.isEnrolled && (
                        <Badge className="bg-blue-100 text-blue-800">Enrolled</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{group.description}</p>
                    
                    {/* Facilitator */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={group.facilitator.avatar} />
                        <AvatarFallback>{group.facilitator.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{group.facilitator.name}</p>
                        <p className="text-sm text-gray-600">{group.facilitator.credentials}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{group.rating}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Schedule and Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{group.schedule.day}s</p>
                      <p className="text-xs text-gray-600">Weekly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{group.schedule.time}</p>
                      <p className="text-xs text-gray-600">{group.schedule.duration} min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{group.enrolled}/{group.capacity}</p>
                      <p className="text-xs text-gray-600">
                        {group.waitlist > 0 && `${group.waitlist} waitlisted`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getFormatIcon(group.format)}
                    <div>
                      <p className="text-sm font-medium capitalize">{group.format}</p>
                      <p className="text-xs text-gray-600">
                        Next: {group.nextSession}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    <strong>Condition:</strong> {group.condition}
                  </div>
                  <div className="flex gap-2">
                    {group.isEnrolled ? (
                      <>
                        <Button size="sm">
                          {getFormatIcon(group.format)}
                          <span className="ml-2">Join Session</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => leaveGroup(group.id)}
                        >
                          Leave Group
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => joinGroup(group.id)}
                        disabled={group.enrolled >= group.capacity}
                      >
                        {group.enrolled >= group.capacity ? 'Join Waitlist' : 'Join Group'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getGroupsByView().length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support groups found</h3>
            <p className="text-gray-600 mb-4">
              {viewMode === 'my-groups' 
                ? "You haven't joined any support groups yet."
                : "No groups match your current filters."
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
