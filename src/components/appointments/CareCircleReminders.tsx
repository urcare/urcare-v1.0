
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Users, Bell, Mail, MessageSquare, Plus, X } from 'lucide-react';

interface CareCircleMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  notifications: {
    appointments: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

export const CareCircleReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Sample care circle data (in real app, this would come from database)
  const [careCircle, setCareCircle] = useState<CareCircleMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      relationship: 'Spouse',
      notifications: {
        appointments: true,
        reminders: true,
        updates: false
      }
    },
    {
      id: '2',
      name: 'Michael Smith',
      email: 'michael.smith@email.com',
      relationship: 'Son',
      notifications: {
        appointments: false,
        reminders: true,
        updates: true
      }
    }
  ]);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and email fields.",
        variant: "destructive"
      });
      return;
    }

    const member: CareCircleMember = {
      id: Date.now().toString(),
      ...newMember,
      notifications: {
        appointments: true,
        reminders: true,
        updates: false
      }
    };

    setCareCircle(prev => [...prev, member]);
    setNewMember({ name: '', email: '', phone: '', relationship: '' });
    setShowAddForm(false);

    toast({
      title: "Member Added",
      description: `${newMember.name} has been added to your care circle.`
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setCareCircle(prev => prev.filter(member => member.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Care circle member has been removed."
    });
  };

  const handleNotificationToggle = (memberId: string, type: keyof CareCircleMember['notifications'], value: boolean) => {
    setCareCircle(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, notifications: { ...member.notifications, [type]: value } }
        : member
    ));
  };

  const sendTestReminder = (member: CareCircleMember) => {
    toast({
      title: "Test Reminder Sent",
      description: `Test notification sent to ${member.name}.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Care Circle Reminders
        </CardTitle>
        <CardDescription>
          Manage family members who receive appointment notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {careCircle.length > 0 && (
          <div className="space-y-4">
            {careCircle.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.phone && (
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{member.relationship}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Appointment notifications</span>
                    </div>
                    <Switch
                      checked={member.notifications.appointments}
                      onCheckedChange={(checked) => 
                        handleNotificationToggle(member.id, 'appointments', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">Reminder messages</span>
                    </div>
                    <Switch
                      checked={member.notifications.reminders}
                      onCheckedChange={(checked) => 
                        handleNotificationToggle(member.id, 'reminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Health updates</span>
                    </div>
                    <Switch
                      checked={member.notifications.updates}
                      onCheckedChange={(checked) => 
                        handleNotificationToggle(member.id, 'updates', checked)
                      }
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendTestReminder(member)}
                  className="mt-3"
                >
                  Send Test Reminder
                </Button>
              </div>
            ))}
          </div>
        )}

        {showAddForm ? (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Add Care Circle Member</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="e.g., Spouse, Child, Parent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddMember}>Add Member</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Care Circle Member
          </Button>
        )}

        {careCircle.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No care circle members added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add family members to keep them informed about your appointments
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
