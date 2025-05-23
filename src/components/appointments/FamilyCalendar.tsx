
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const demoFamilyMembers = [
  { id: '1', name: 'John Smith', relationship: 'Self', dob: '1980-05-15', avatar: '/placeholder.svg' },
  { id: '2', name: 'Sarah Smith', relationship: 'Spouse', dob: '1982-08-10', avatar: '/placeholder.svg' },
  { id: '3', name: 'Michael Smith', relationship: 'Child', dob: '2015-03-22', avatar: '/placeholder.svg' },
  { id: '4', name: 'Emily Smith', relationship: 'Child', dob: '2018-11-07', avatar: '/placeholder.svg' },
];

const demoAppointments = [
  { 
    id: '101', 
    member_id: '1', 
    date: new Date(2025, 4, 25, 9, 30), 
    doctor: 'Dr. Johnson', 
    department: 'Cardiology',
    type: 'regular',
    status: 'scheduled'
  },
  { 
    id: '102', 
    member_id: '3', 
    date: new Date(2025, 4, 24, 14, 0), 
    doctor: 'Dr. Lopez', 
    department: 'Pediatrics',
    type: 'follow_up',
    status: 'scheduled'
  },
  { 
    id: '103', 
    member_id: '2', 
    date: new Date(2025, 4, 27, 11, 15), 
    doctor: 'Dr. Chen', 
    department: 'Dermatology',
    type: 'consultation',
    status: 'scheduled'
  },
  { 
    id: '104', 
    member_id: '4', 
    date: new Date(2025, 4, 28, 10, 0), 
    doctor: 'Dr. Williams', 
    department: 'Pediatrics',
    type: 'regular',
    status: 'scheduled'
  },
];

interface FamilyAppointment {
  id: string;
  member_id: string;
  date: Date;
  doctor: string;
  department: string;
  type: string;
  status: string;
}

export const FamilyCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<FamilyAppointment[]>(demoAppointments);

  // Fetch family members
  const { data: familyMembers } = useQuery({
    queryKey: ['family-members', user?.id],
    queryFn: async () => {
      if (!user?.id) return demoFamilyMembers;
      
      try {
        // In real app, fetch from database
        // const { data, error } = await supabase.from('family_members').select('*').eq('user_id', user.id);
        // if (error) throw error;
        // return data;
        
        return demoFamilyMembers;
      } catch (error) {
        console.error('Error fetching family members:', error);
        return demoFamilyMembers;
      }
    },
    enabled: !!user?.id
  });

  // Filter appointments based on selected member and date
  const filteredAppointments = appointments.filter(apt => {
    const dateMatches = selectedView === 'calendar' 
      ? apt.date.toDateString() === selectedDate.toDateString()
      : true;
      
    const memberMatches = selectedMember === 'all' || apt.member_id === selectedMember;
    
    return dateMatches && memberMatches;
  });
  
  // Find dates with appointments for calendar highlighting
  const appointmentDates = appointments
    .filter(apt => selectedMember === 'all' || apt.member_id === selectedMember)
    .map(apt => apt.date);
  
  const getMemberName = (id: string) => {
    const member = familyMembers?.find(m => m.id === id);
    return member?.name || 'Unknown';
  };
  
  const getAppointmentStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'no_show':
        return <Badge className="bg-amber-500">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    // In a real app, this would be an API call
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      )
    );
    
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled successfully."
    });
  };
  
  const handleRescheduleAppointment = (appointmentId: string) => {
    toast({
      title: "Reschedule Requested",
      description: "You'll be redirected to reschedule this appointment."
    });
    
    // In a real app, this would navigate to the booking form
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Family Appointments</h2>
          <p className="text-muted-foreground">Manage appointments for your entire family</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={selectedView === 'calendar' ? 'default' : 'outline'}
            onClick={() => setSelectedView('calendar')}
          >
            Calendar View
          </Button>
          <Button
            variant={selectedView === 'list' ? 'default' : 'outline'}
            onClick={() => setSelectedView('list')}
          >
            List View
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Family Member Selector */}
        <Card className="w-full sm:w-64">
          <CardHeader>
            <CardTitle className="text-lg">Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-select">Filter by Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="member-select">
                  <SelectValue placeholder="Select family member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {familyMembers?.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <p className="font-medium text-sm">Family List</p>
              {familyMembers?.map(member => (
                <div 
                  key={member.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedMember === member.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelectedMember(member.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.relationship}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar or List View */}
        <div className="flex-1 w-full">
          {selectedView === 'calendar' ? (
            <Card>
              <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
                <CardDescription>View family appointments by date</CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border p-4"
                    modifiers={{
                      appointment: appointmentDates,
                    }}
                    modifiersStyles={{
                      appointment: { 
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(236, 252, 203)',
                        borderRadius: '0',
                        color: 'rgb(39, 39, 42)'
                      }
                    }}
                  />
                  
                  <Card className="md:mt-0 mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Appointments for {selectedDate.toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(appointment => (
                          <div key={appointment.id} className="border rounded-lg p-3 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{getMemberName(appointment.member_id)}</p>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{appointment.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                              </div>
                              {getAppointmentStatusBadge(appointment.status)}
                            </div>
                            
                            <div>
                              <p className="text-sm">{appointment.doctor}</p>
                              <p className="text-sm text-muted-foreground">{appointment.department}</p>
                            </div>
                            
                            {appointment.status === 'scheduled' && (
                              <div className="flex space-x-2 pt-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRescheduleAppointment(appointment.id)}
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No appointments scheduled for this date</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Family Appointments</CardTitle>
                <CardDescription>Comprehensive list of upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map(appointment => (
                        <Card key={appointment.id} className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{getMemberName(appointment.member_id).substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{getMemberName(appointment.member_id)}</p>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                  <span>{appointment.date.toLocaleDateString()}</span>
                                  <span className="mx-1">•</span>
                                  <span>{appointment.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="sm:ml-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <div className="flex flex-col items-start mr-4">
                                <p className="text-sm">{appointment.doctor}</p>
                                <p className="text-xs text-muted-foreground">{appointment.department}</p>
                              </div>
                              
                              {getAppointmentStatusBadge(appointment.status)}
                              
                              {appointment.status === 'scheduled' && (
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRescheduleAppointment(appointment.id)}
                                  >
                                    Reschedule
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No appointments found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
