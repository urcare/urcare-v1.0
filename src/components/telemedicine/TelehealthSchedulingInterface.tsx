
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  Phone,
  MessageCircle,
  Bell,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export const TelehealthSchedulingInterface = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const providerSchedule = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiology',
      avatar: '/placeholder.svg',
      timezone: 'EST',
      availability: {
        '2024-06-10': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        '2024-06-11': ['09:00', '10:30', '13:00', '14:30', '16:00'],
        '2024-06-12': ['08:00', '09:30', '11:00', '15:00', '16:30']
      },
      bookedSlots: ['10:00', '15:00'],
      consultationTypes: ['video', 'phone'],
      rating: 4.9,
      totalConsultations: 1247
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Endocrinology',
      avatar: '/placeholder.svg',
      timezone: 'PST',
      availability: {
        '2024-06-10': ['10:00', '11:30', '13:00', '15:30', '17:00'],
        '2024-06-11': ['09:30', '11:00', '14:00', '15:30', '17:00'],
        '2024-06-12': ['09:00', '10:30', '12:00', '14:30', '16:00']
      },
      bookedSlots: ['11:30', '17:00'],
      consultationTypes: ['video'],
      rating: 4.8,
      totalConsultations: 892
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      provider: 'Dr. Sarah Wilson',
      date: '2024-06-10',
      time: '10:00 AM',
      type: 'video',
      duration: '30 min',
      status: 'confirmed',
      timezone: 'EST',
      reminderSent: true,
      specialty: 'Cardiology'
    },
    {
      id: 2,
      patient: 'Mary Johnson',
      provider: 'Dr. Michael Chen',
      date: '2024-06-10',
      time: '2:30 PM',
      type: 'video',
      duration: '45 min',
      status: 'pending',
      timezone: 'PST',
      reminderSent: false,
      specialty: 'Endocrinology'
    },
    {
      id: 3,
      patient: 'Robert Davis',
      provider: 'Dr. Sarah Wilson',
      date: '2024-06-11',
      time: '9:00 AM',
      type: 'phone',
      duration: '20 min',
      status: 'confirmed',
      timezone: 'EST',
      reminderSent: true,
      specialty: 'Cardiology'
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const reminderSettings = [
    {
      id: 1,
      type: 'Email',
      timing: '24 hours before',
      enabled: true,
      recipients: ['patient', 'provider']
    },
    {
      id: 2,
      type: 'SMS',
      timing: '2 hours before',
      enabled: true,
      recipients: ['patient']
    },
    {
      id: 3,
      type: 'Push Notification',
      timing: '15 minutes before',
      enabled: true,
      recipients: ['patient', 'provider']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const isTimeSlotAvailable = (time: string, provider: any, date: string) => {
    const dateAvailability = provider.availability[date] || [];
    return dateAvailability.includes(time) && !provider.bookedSlots.includes(time);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="availability">Provider Availability</TabsTrigger>
          <TabsTrigger value="reminders">Reminder Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Schedule New Appointment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  
                  {selectedDate && (
                    <div>
                      <div className="font-medium mb-3">Available Time Slots</div>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTimeSlot(time)}
                            disabled={!isTimeSlotAvailable(time, providerSchedule[0], selectedDate.toISOString().split('T')[0])}
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Search</label>
                    <Input placeholder="Search patient by name or ID..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <div className="space-y-2">
                      {providerSchedule.map((provider) => (
                        <div key={provider.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{provider.name}</div>
                                <div className="text-sm text-gray-600">{provider.specialty}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">★ {provider.rating}</div>
                              <div className="text-xs text-gray-500">{provider.totalConsultations} consults</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Consultation Type</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Call
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">15 min</Button>
                      <Button variant="outline" size="sm">30 min</Button>
                      <Button variant="outline" size="sm">45 min</Button>
                      <Button variant="outline" size="sm">60 min</Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <Input placeholder="Add appointment notes..." />
                  </div>

                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Telehealth Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(appointment.type)}
                          <div>
                            <div className="font-medium">{appointment.patient}</div>
                            <div className="text-sm text-gray-600">{appointment.provider}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.reminderSent && (
                          <Bell className="h-4 w-4 text-green-600" />
                        )}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Date & Time:</div>
                        <div className="font-medium">{appointment.date} at {appointment.time}</div>
                        <div className="text-xs text-gray-500">{appointment.timezone}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Duration:</div>
                        <div>{appointment.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Specialty:</div>
                        <div>{appointment.specialty}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Type:</div>
                        <div className="capitalize flex items-center gap-1">
                          {getTypeIcon(appointment.type)}
                          {appointment.type}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      {appointment.type === 'video' && (
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      )}
                      {!appointment.reminderSent && (
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          {/* Provider Availability Management */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Availability Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {providerSchedule.map((provider) => (
                  <div key={provider.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-lg">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.specialty}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Globe className="h-3 w-3" />
                            <span>Timezone: {provider.timezone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {provider.consultationTypes.map((type) => (
                          <Badge key={type} variant="outline">
                            {getTypeIcon(type)}
                            <span className="ml-1 capitalize">{type}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(provider.availability).map(([date, slots]) => (
                        <div key={date} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium">{date}</div>
                          <div className="flex gap-1 flex-wrap">
                            {slots.map((slot) => (
                              <Badge 
                                key={slot} 
                                variant={provider.bookedSlots.includes(slot) ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {slot}
                                {provider.bookedSlots.includes(slot) && <AlertCircle className="h-3 w-3 ml-1" />}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Edit Availability
                      </Button>
                      <Button variant="outline" size="sm">
                        Block Time Slot
                      </Button>
                      <Button variant="outline" size="sm">
                        View Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          {/* Automated Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Automated Reminder Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminderSettings.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {reminder.enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium">{reminder.type} Reminder</div>
                        <div className="text-sm text-gray-600">{reminder.timing}</div>
                        <div className="text-xs text-gray-500">
                          Recipients: {reminder.recipients.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <Button 
                        variant={reminder.enabled ? "destructive" : "default"} 
                        size="sm"
                      >
                        {reminder.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 mb-2">Timezone Handling</div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• Automatic timezone detection for patients and providers</div>
                    <div>• Reminders sent in recipient's local timezone</div>
                    <div>• Daylight saving time adjustments included</div>
                    <div>• Multi-timezone appointment coordination</div>
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
