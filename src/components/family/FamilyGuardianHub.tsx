
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Calendar, Heart, Plus, Settings, Bell, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  avatar: string;
  healthStatus: 'good' | 'attention' | 'critical';
  permissions: string[];
  lastCheckIn: string;
}

interface GuardianPermission {
  id: string;
  type: string;
  description: string;
  enabled: boolean;
}

export const FamilyGuardianHub = () => {
  const [activeTab, setActiveTab] = useState('family');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Mother',
      age: 65,
      avatar: '/placeholder.svg',
      healthStatus: 'attention',
      permissions: ['view_records', 'book_appointments'],
      lastCheckIn: '2 hours ago'
    },
    {
      id: '2',
      name: 'Tom Johnson',
      relationship: 'Son',
      age: 16,
      avatar: '/placeholder.svg',
      healthStatus: 'good',
      permissions: ['emergency_access'],
      lastCheckIn: '1 day ago'
    }
  ]);

  const [permissions, setPermissions] = useState<GuardianPermission[]>([
    { id: '1', type: 'view_records', description: 'View medical records', enabled: true },
    { id: '2', type: 'book_appointments', description: 'Book appointments', enabled: true },
    { id: '3', type: 'emergency_access', description: 'Emergency access to all records', enabled: true },
    { id: '4', type: 'medication_management', description: 'Manage medications', enabled: false }
  ]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddMember = () => {
    toast.success('Family member invitation sent!');
  };

  const togglePermission = (permissionId: string) => {
    setPermissions(prev => prev.map(p => 
      p.id === permissionId ? { ...p, enabled: !p.enabled } : p
    ));
    toast.success('Permission updated');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Family & Guardian Hub
          </CardTitle>
          <CardDescription>
            Coordinate family healthcare and manage guardian permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">{familyMembers.length}</h3>
              <p className="text-sm text-gray-600">Family Members</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Secure</h3>
              <p className="text-sm text-gray-600">Protected Access</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Coordinated</h3>
              <p className="text-sm text-gray-600">Care Management</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Alerts</h3>
              <p className="text-sm text-gray-600">Health Notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="coordination">Care Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="family" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Family Members</h3>
            <Button onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          
          <div className="grid gap-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.relationship} • Age {member.age}</p>
                        <p className="text-xs text-gray-500">Last check-in: {member.lastCheckIn}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getHealthStatusColor(member.healthStatus)}>
                        {member.healthStatus.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Permissions:</h5>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission) => (
                        <Badge key={permission} variant="outline">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <h3 className="text-lg font-semibold">Guardian Permissions</h3>
          
          <div className="grid gap-4">
            {permissions.map((permission) => (
              <Card key={permission.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{permission.type.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-gray-600">{permission.description}</p>
                    </div>
                    <Button
                      variant={permission.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePermission(permission.id)}
                    >
                      {permission.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          <h3 className="text-lg font-semibold">Care Coordination</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Family Health Meeting</p>
                    <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Mom's Checkup</p>
                    <p className="text-sm text-gray-600">Friday, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Medication Reminder</p>
                    <p className="text-sm text-gray-600">Sarah's evening medication due</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Health Goal Update</p>
                    <p className="text-sm text-gray-600">Tom completed weekly exercise goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
