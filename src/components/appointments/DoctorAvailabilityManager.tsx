
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';

interface DoctorAvailability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

export const DoctorAvailabilityManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    is_available: true
  });

  // Fetch doctor's availability
  const { data: availability, isLoading } = useQuery({
    queryKey: ['doctor_availability', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', user.id)
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      return data as DoctorAvailability[];
    },
    enabled: !!user?.id
  });

  // Add availability mutation
  const addAvailabilityMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not found');
      
      const { error } = await supabase
        .from('doctor_availability')
        .insert({
          doctor_id: user.id,
          day_of_week: parseInt(newAvailability.day_of_week),
          start_time: newAvailability.start_time,
          end_time: newAvailability.end_time,
          is_available: newAvailability.is_available
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Availability added successfully');
      setNewAvailability({
        day_of_week: '',
        start_time: '',
        end_time: '',
        is_available: true
      });
      queryClient.invalidateQueries({ queryKey: ['doctor_availability'] });
    },
    onError: (error: any) => {
      toast.error('Failed to add availability', {
        description: error.message
      });
    }
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (availabilityId: string) => {
      const { error } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('id', availabilityId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Availability removed');
      queryClient.invalidateQueries({ queryKey: ['doctor_availability'] });
    },
    onError: (error: any) => {
      toast.error('Failed to remove availability', {
        description: error.message
      });
    }
  });

  // Generate slots mutation
  const generateSlotsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not found');
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Generate for next 30 days
      
      const { data, error } = await supabase.rpc('generate_appointment_slots', {
        doctor_uuid: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        slot_duration_minutes: 30
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (slotsCreated) => {
      toast.success(`Generated ${slotsCreated} appointment slots for the next 30 days`);
      queryClient.invalidateQueries({ queryKey: ['appointment_slots'] });
    },
    onError: (error: any) => {
      toast.error('Failed to generate slots', {
        description: error.message
      });
    }
  });

  const handleAddAvailability = () => {
    if (!newAvailability.day_of_week || !newAvailability.start_time || !newAvailability.end_time) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (newAvailability.start_time >= newAvailability.end_time) {
      toast.error('End time must be after start time');
      return;
    }
    
    addAvailabilityMutation.mutate();
  };

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            Manage Your Availability
          </CardTitle>
          <CardDescription>
            Set your weekly schedule and generate appointment slots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Availability */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Add Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                value={newAvailability.day_of_week}
                onValueChange={(value) => setNewAvailability(prev => ({ ...prev, day_of_week: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="time"
                placeholder="Start time"
                value={newAvailability.start_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, start_time: e.target.value }))}
              />
              
              <Input
                type="time"
                placeholder="End time"
                value={newAvailability.end_time}
                onChange={(e) => setNewAvailability(prev => ({ ...prev, end_time: e.target.value }))}
              />
              
              <Button 
                onClick={handleAddAvailability}
                disabled={addAvailabilityMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Current Availability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Current Weekly Schedule</h3>
              <Button
                onClick={() => generateSlotsMutation.mutate()}
                disabled={generateSlotsMutation.isPending || !availability?.length}
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Generate Slots
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Loading availability...</div>
            ) : availability?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No availability set. Add your weekly schedule above.
              </div>
            ) : (
              <div className="grid gap-3">
                {availability?.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {getDayName(slot.day_of_week)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{slot.start_time} - {slot.end_time}</span>
                      </div>
                      <Badge variant={slot.is_available ? "default" : "secondary"}>
                        {slot.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAvailabilityMutation.mutate(slot.id)}
                      disabled={deleteAvailabilityMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
