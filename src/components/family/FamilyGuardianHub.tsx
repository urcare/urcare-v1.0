
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Users, Shield, Calendar, FileText, Bell, Heart, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  isGuardian: boolean;
  permissions: {
    viewRecords: boolean;
    bookAppointments: boolean;
    medicationReminders: boolean;
    emergencyAccess: boolean;
  };
  lastActive: Date;
  healthStatus: 'good' | 'concern' | 'critical';
}

interface CareActivity {
  id: string;
  memberId: string;
  memberName: string;
  activity: string;
  timestamp: Date;
  type: 'appointment' | 'medication' | 'emergency' | 'health-update';
}

export const FamilyGuardianHub = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Mom (Sarah)',
      relationship: 'Mother',
      age: 68,
      isGuardian: false,
      permissions: {
        viewRecords: true,
        bookAppointments: true,
        medicationReminders: true,
        emergencyAccess: true
      },
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      healthStatus: 'concern'
    },
    {
      id: '2',
      name: 'Dad (Michael)',
      relationship: 'Father',
      age: 71,
      isGuardian: false,
      permissions: {
        viewRecords: true,
        bookAppointments: false,
        medicationReminders: true,
        emergencyAccess: true
      },
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      healthStatus: 'good'
    },
    {
      id: '3',
      name: 'Emma (Daughter)',
      relationship: 'Daughter',
      age: 16,
      isGuardian: true,
      permissions: {
        viewRecords: false,
        bookAppointments: true,
        medicationReminders: true,
        emergencyAccess: true
      },
      lastActive: new Date(),
      healthStatus: 'good'
    }
  ]);

  const [careActivities] = useState<CareActivity[]>([
    {
      id: '1',
      memberId: '1',
      memberName: 'Mom (Sarah)',
      activity: 'Took morning medication (Lisinopril)',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'medication'
    },
    {
      id: '2',
      memberId: '3',
      memberName: 'Emma (Daughter)',
      activity: 'Appointment booked with Dr. Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'appointment'
    },
    {
      id: '3',
      memberId: '2',
      memberName: 'Dad (Michael)',
      activity: 'Blood pressure reading: 145/90',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'health-update'
    }
  ]);

  const handlePermissionChange = (memberId: string, permission: keyof FamilyMember['permissions'], value: boolean) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, permissions: { ...member.permissions, [permission]: value } }
        : member
    ));
    toast.success('Permission updated');
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'concern': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'medication': return <Heart className="h-4 w-4 text-green-600" />;
      case 'emergency': return <Shield className="h-4 w-4 text-red-600" />;
      case 'health-update': return <FileText className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Family Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Family Members</span>
            </div>
            <div className="text-2xl font-bold">{familyMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Guardians</span>
            </div>
            <div className="text-2xl font-bold">
              {familyMembers.filter(m => m.isGuardian).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Need Attention</span>
            </div>
            <div className="text-2xl font-bold">
              {familyMembers.filter(m => m.healthStatus === 'concern' || m.healthStatus === 'critical').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Today's Activities</span>
            </div>
            <div className="text-2xl font-bold">
              {careActivities.filter(a => 
                a.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Family Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activities">Care Activities</TabsTrigger>
          <TabsTrigger value="tree">Family Tree</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Family Members</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {member.name.split(' ')[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {member.name}
                          {member.isGuardian && (
                            <Badge variant="default">Guardian</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{member.relationship}</p>
                        <p className="text-xs text-gray-500">Age: {member.age}</p>
                      </div>
                    </div>
                    <Badge className={getHealthStatusColor(member.healthStatus)}>
                      {member.healthStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span className="text-gray-600">
                        {member.lastActive.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Permissions:</span>
                      <span className="text-gray-600">
                        {Object.values(member.permissions).filter(Boolean).length}/4
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Access Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {familyMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name.split(' ')[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.relationship}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Medical Records</span>
                        <Switch
                          checked={member.permissions.viewRecords}
                          onCheckedChange={(value) => 
                            handlePermissionChange(member.id, 'viewRecords', value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Book Appointments</span>
                        <Switch
                          checked={member.permissions.bookAppointments}
                          onCheckedChange={(value) => 
                            handlePermissionChange(member.id, 'bookAppointments', value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medication Reminders</span>
                        <Switch
                          checked={member.permissions.medicationReminders}
                          onCheckedChange={(value) => 
                            handlePermissionChange(member.id, 'medicationReminders', value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emergency Access</span>
                        <Switch
                          checked={member.permissions.emergencyAccess}
                          onCheckedChange={(value) => 
                            handlePermissionChange(member.id, 'emergencyAccess', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Care Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.memberName}</p>
                      <p className="text-sm text-gray-600">{activity.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Health Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Family Health Tree</h3>
                <p className="text-gray-600 mb-4">
                  Visualize family health connections and hereditary patterns
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Build Family Tree
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
