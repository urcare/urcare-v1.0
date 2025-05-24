
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Eye, Edit, Share, Trash2, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  permissions: {
    view: boolean;
    edit: boolean;
    share: boolean;
    emergency: boolean;
  };
  accessLevel: 'full' | 'limited' | 'emergency-only';
  lastAccess?: Date;
  status: 'active' | 'pending' | 'suspended';
}

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  relationship: string;
  requestedLevel: string;
  message: string;
  timestamp: Date;
}

const sampleFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    email: 'sarah.johnson@email.com',
    permissions: { view: true, edit: true, share: true, emergency: true },
    accessLevel: 'full',
    lastAccess: new Date('2024-01-15T10:30:00'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    relationship: 'Son',
    email: 'michael.johnson@email.com',
    permissions: { view: true, edit: false, share: false, emergency: true },
    accessLevel: 'limited',
    lastAccess: new Date('2024-01-10T14:20:00'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Dr. Emily Smith',
    relationship: 'Primary Care Doctor',
    email: 'dr.smith@clinic.com',
    permissions: { view: true, edit: true, share: true, emergency: true },
    accessLevel: 'full',
    lastAccess: new Date('2024-01-14T09:15:00'),
    status: 'active'
  }
];

const sampleAccessRequests: AccessRequest[] = [
  {
    id: '1',
    requesterName: 'Emma Johnson',
    requesterEmail: 'emma.johnson@email.com',
    relationship: 'Daughter',
    requestedLevel: 'Emergency Only',
    message: 'Hi Dad, I\'d like emergency access to your medical records in case of emergencies.',
    timestamp: new Date('2024-01-16T16:45:00')
  }
];

export const FamilyPermissions = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(sampleFamilyMembers);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(sampleAccessRequests);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const updatePermission = (memberId: string, permission: keyof FamilyMember['permissions'], value: boolean) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, permissions: { ...member.permissions, [permission]: value } }
        : member
    ));
    toast.success('Permissions updated successfully');
  };

  const updateAccessLevel = (memberId: string, accessLevel: 'full' | 'limited' | 'emergency-only') => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, accessLevel }
        : member
    ));
    toast.success('Access level updated');
  };

  const removeMember = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success(`Removed ${member?.name} from family access`);
  };

  const handleAccessRequest = (requestId: string, approved: boolean) => {
    const request = accessRequests.find(r => r.id === requestId);
    if (!request) return;

    if (approved) {
      // Add to family members
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: request.requesterName,
        relationship: request.relationship,
        email: request.requesterEmail,
        permissions: { 
          view: true, 
          edit: false, 
          share: false, 
          emergency: request.requestedLevel === 'Emergency Only' 
        },
        accessLevel: request.requestedLevel === 'Full Access' ? 'full' : 'emergency-only',
        status: 'active'
      };
      
      setFamilyMembers(prev => [...prev, newMember]);
      toast.success(`Approved access request from ${request.requesterName}`);
    } else {
      toast.info(`Denied access request from ${request.requesterName}`);
    }

    setAccessRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'emergency-only': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Access Requests */}
      {accessRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Pending Access Requests ({accessRequests.length})
            </CardTitle>
            <CardDescription>
              Review and approve access requests from family members and healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{request.requesterName}</h4>
                      <p className="text-sm text-gray-600">{request.requesterEmail}</p>
                      <Badge variant="secondary" className="mt-1">
                        {request.relationship}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {request.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm"><strong>Requested Access:</strong> {request.requestedLevel}</p>
                    <p className="text-sm mt-1"><strong>Message:</strong> {request.message}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAccessRequest(request.id, true)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAccessRequest(request.id, false)}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family & Care Team Access
              </CardTitle>
              <CardDescription>
                Manage who can access your medical records and their permission levels
              </CardDescription>
            </div>
            <Button onClick={() => setShowInviteForm(!showInviteForm)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{familyMembers.length}</div>
                <p className="text-sm text-gray-600">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {familyMembers.filter(m => m.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600">Active Access</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">
                  {familyMembers.filter(m => m.permissions.emergency).length}
                </div>
                <p className="text-sm text-gray-600">Emergency Access</p>
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Last Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {member.relationship}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={member.accessLevel} 
                        onValueChange={(value: 'full' | 'limited' | 'emergency-only') => 
                          updateAccessLevel(member.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="emergency-only">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">View</span>
                          <Switch
                            checked={member.permissions.view}
                            onCheckedChange={(checked) => updatePermission(member.id, 'view', checked)}
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          <span className="text-xs">Edit</span>
                          <Switch
                            checked={member.permissions.edit}
                            onCheckedChange={(checked) => updatePermission(member.id, 'edit', checked)}
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Share className="h-3 w-3" />
                          <span className="text-xs">Share</span>
                          <Switch
                            checked={member.permissions.share}
                            onCheckedChange={(checked) => updatePermission(member.id, 'share', checked)}
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          <span className="text-xs">Emergency</span>
                          <Switch
                            checked={member.permissions.emergency}
                            onCheckedChange={(checked) => updatePermission(member.id, 'emergency', checked)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {member.lastAccess ? member.lastAccess.toLocaleDateString() : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
