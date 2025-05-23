
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Heart, AlertTriangle, CheckCircle, User } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  avatar?: string;
  healthStatus: 'good' | 'monitoring' | 'critical';
  conditions: string[];
  connected: boolean;
}

export function FamilyHealthTree() {
  const [familyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'John Doe',
      relationship: 'Self',
      age: 35,
      healthStatus: 'good',
      conditions: ['Hypertension'],
      connected: true
    },
    {
      id: '2',
      name: 'Jane Doe',
      relationship: 'Spouse',
      age: 32,
      healthStatus: 'good',
      conditions: [],
      connected: true
    },
    {
      id: '3',
      name: 'Emma Doe',
      relationship: 'Daughter',
      age: 8,
      healthStatus: 'good',
      conditions: ['Asthma'],
      connected: true
    },
    {
      id: '4',
      name: 'Robert Doe Sr.',
      relationship: 'Father',
      age: 65,
      healthStatus: 'monitoring',
      conditions: ['Diabetes', 'Heart Disease'],
      connected: true
    },
    {
      id: '5',
      name: 'Mary Doe',
      relationship: 'Mother',
      age: 62,
      healthStatus: 'good',
      conditions: ['Arthritis'],
      connected: false
    }
  ]);

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'monitoring': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Health Tree
          </CardTitle>
          <CardDescription>
            Connect and monitor your family's health journey together
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((member) => (
          <Card key={member.id} className={`relative ${!member.connected ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  </div>
                </div>
                {getHealthStatusIcon(member.healthStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Age:</span>
                <span>{member.age} years</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className={getHealthStatusColor(member.healthStatus)}>
                    {member.healthStatus}
                  </Badge>
                </div>
              </div>

              {member.conditions.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Conditions:</span>
                  <div className="flex flex-wrap gap-1">
                    {member.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                {member.connected ? (
                  <Badge className="bg-green-100 text-green-800 w-full justify-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Send Invite
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Member Card */}
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Add Family Member</p>
            <p className="text-xs text-muted-foreground mt-1">
              Invite someone to join your health tree
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Add Member
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Health Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">
                {familyMembers.filter(m => m.healthStatus === 'good').length} members with good health
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-800">
                {familyMembers.filter(m => m.healthStatus === 'monitoring').length} members monitoring conditions
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">
                {familyMembers.filter(m => m.connected).length} connected members
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Export Family Health Report</Button>
        <Button>Manage Family Tree</Button>
      </div>
    </div>
  );
}
