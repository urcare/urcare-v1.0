
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Video, MapPin, Clock, UserPlus, Bell, Star, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  type: 'online' | 'in-person' | 'hybrid';
  category: string;
  memberCount: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting: string;
  location?: string;
  facilitator: {
    name: string;
    avatar: string;
    credentials: string;
  };
  isJoined: boolean;
  isPrivate: boolean;
  rating: number;
  tags: string[];
}

export const SupportGroups = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([
    {
      id: '1',
      name: 'Diabetes Management Circle',
      description: 'Weekly support group for people managing Type 1 and Type 2 diabetes. Share experiences, meal planning tips, and emotional support.',
      type: 'hybrid',
      category: 'Chronic Conditions',
      memberCount: 24,
      maxMembers: 30,
      meetingSchedule: 'Every Tuesday 7:00 PM EST',
      nextMeeting: 'Tomorrow at 7:00 PM',
      location: 'Community Center + Online',
      facilitator: {
        name: 'Dr. Sarah Martinez',
        avatar: '/placeholder.svg',
        credentials: 'Certified Diabetes Educator'
      },
      isJoined: true,
      isPrivate: false,
      rating: 4.8,
      tags: ['diabetes', 'nutrition', 'peer-support']
    },
    {
      id: '2',
      name: 'Anxiety & Depression Support',
      description: 'Safe space for individuals dealing with anxiety and depression. Focus on coping strategies, mindfulness, and peer support.',
      type: 'online',
      category: 'Mental Health',
      memberCount: 45,
      maxMembers: 50,
      meetingSchedule: 'Mondays & Thursdays 6:30 PM EST',
      nextMeeting: 'Monday at 6:30 PM',
      facilitator: {
        name: 'Dr. Michael Chen',
        avatar: '/placeholder.svg',
        credentials: 'Licensed Clinical Psychologist'
      },
      isJoined: false,
      isPrivate: true,
      rating: 4.9,
      tags: ['anxiety', 'depression', 'mindfulness', 'coping-strategies']
    },
    {
      id: '3',
      name: 'Heart Health Heroes',
      description: 'Support group for cardiovascular health management. Exercise planning, dietary guidance, and emotional support for heart patients.',
      type: 'in-person',
      category: 'Heart Health',
      memberCount: 18,
      maxMembers: 25,
      meetingSchedule: 'Every Saturday 10:00 AM EST',
      nextMeeting: 'Saturday at 10:00 AM',
      location: 'Downtown Medical Center',
      facilitator: {
        name: 'Nurse Emily Rodriguez',
        avatar: '/placeholder.svg',
        credentials: 'Cardiac Rehabilitation Specialist'
      },
      isJoined: false,
      isPrivate: false,
      rating: 4.7,
      tags: ['heart-health', 'exercise', 'nutrition', 'recovery']
    },
    {
      id: '4',
      name: 'Cancer Survivors Network',
      description: 'Private support group for cancer survivors and their families. Focus on post-treatment life, emotional healing, and community.',
      type: 'online',
      category: 'Cancer Support',
      memberCount: 32,
      maxMembers: 40,
      meetingSchedule: 'Wednesdays 8:00 PM EST',
      nextMeeting: 'Wednesday at 8:00 PM',
      facilitator: {
        name: 'Lisa Thompson',
        avatar: '/placeholder.svg',
        credentials: 'Oncology Social Worker'
      },
      isJoined: false,
      isPrivate: true,
      rating: 5.0,
      tags: ['cancer', 'survivors', 'family-support', 'healing']
    },
    {
      id: '5',
      name: 'Chronic Pain Warriors',
      description: 'Support group for individuals living with chronic pain conditions. Pain management techniques, lifestyle adaptations, and peer support.',
      type: 'hybrid',
      category: 'Pain Management',
      memberCount: 28,
      maxMembers: 35,
      meetingSchedule: 'Fridays 5:00 PM EST',
      nextMeeting: 'Friday at 5:00 PM',
      location: 'Wellness Center + Online',
      facilitator: {
        name: 'Dr. Alex Kim',
        avatar: '/placeholder.svg',
        credentials: 'Pain Management Specialist'
      },
      isJoined: true,
      isPrivate: false,
      rating: 4.6,
      tags: ['chronic-pain', 'pain-management', 'coping', 'lifestyle']
    }
  ]);

  const categories = ['all', 'chronic-conditions', 'mental-health', 'heart-health', 'cancer-support', 'pain-management'];
  const types = ['all', 'online', 'in-person', 'hybrid'];

  const handleJoinGroup = (groupId: string) => {
    const group = supportGroups.find(g => g.id === groupId);
    if (!group) return;

    if (group.isPrivate) {
      toast.success('Join request sent! You\'ll be notified when approved.');
    } else {
      setSupportGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, isJoined: true, memberCount: g.memberCount + 1 } : g
      ));
      toast.success(`Welcome to ${group.name}! 🎉`);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    setSupportGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, isJoined: false, memberCount: g.memberCount - 1 } : g
    ));
    toast.success('You have left the support group.');
  };

  const handleNotifyMeeting = (groupId: string) => {
    toast.success('You\'ll be notified before the next meeting!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'in-person': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGroups = supportGroups.filter(group => {
    const matchesCategory = selectedCategory === 'all' || 
      group.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    const matchesType = selectedType === 'all' || group.type === selectedType;
    return matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Support Groups
          </CardTitle>
          <CardDescription>
            Join structured support groups led by healthcare professionals and peer facilitators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-600">Active Groups</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">247</div>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">96%</div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.8★</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 py-2">Category:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 py-2">Type:</span>
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className={`hover:shadow-md transition-shadow ${
            group.isJoined ? 'ring-2 ring-blue-200 bg-blue-50' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{group.name}</h3>
                    {group.isJoined && (
                      <Badge className="bg-blue-100 text-blue-800">
                        ✓ Joined
                      </Badge>
                    )}
                    {group.isPrivate && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <Badge className={`${getTypeColor(group.type)} text-xs`}>
                      {getTypeIcon(group.type)}
                      <span className="ml-1 capitalize">{group.type}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {group.memberCount}/{group.maxMembers} members
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {group.rating}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{group.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Schedule</span>
                      </div>
                      <p className="text-sm text-gray-600">{group.meetingSchedule}</p>
                      <p className="text-sm text-blue-600 font-medium">Next: {group.nextMeeting}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={group.facilitator.avatar} />
                          <AvatarFallback>{group.facilitator.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Facilitator</span>
                      </div>
                      <p className="text-sm text-gray-700">{group.facilitator.name}</p>
                      <p className="text-sm text-gray-600">{group.facilitator.credentials}</p>
                    </div>
                  </div>

                  {group.location && (
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">{group.location}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {group.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {group.isJoined ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleNotifyMeeting(group.id)}
                        className="mb-2"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notify Me
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Leave Group
                      </Button>
                    </>
                  ) : group.memberCount >= group.maxMembers ? (
                    <Button size="sm" disabled>
                      Group Full
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {group.isPrivate ? 'Request to Join' : 'Join Group'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support groups found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new groups.
            </p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Request New Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
