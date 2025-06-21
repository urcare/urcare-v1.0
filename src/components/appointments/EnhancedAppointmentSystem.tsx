
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Video, Clock, User, MapPin, Phone, MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  type: 'in-person' | 'teleconsult';
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  location?: string;
  meetingLink?: string;
  notes?: string;
  rating?: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  experience: string;
  nextAvailable: string;
  location: string;
  teleconsultAvailable: boolean;
}

export const EnhancedAppointmentSystem = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<'in-person' | 'teleconsult'>('in-person');
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      type: 'teleconsult',
      doctorName: 'Dr. Sarah Wilson',
      doctorSpecialty: 'Cardiologist',
      doctorAvatar: '/placeholder.svg',
      date: '2024-06-22',
      time: '10:00',
      duration: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/abc123',
      notes: 'Follow-up on blood pressure medication'
    },
    {
      id: '2',
      type: 'in-person',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'General Practice',
      doctorAvatar: '/placeholder.svg',
      date: '2024-06-25',
      time: '14:30',
      duration: 45,
      status: 'scheduled',
      location: 'Medical Center, Room 205',
      notes: 'Annual physical examination'
    }
  ]);

  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      avatar: '/placeholder.svg',
      rating: 4.9,
      experience: '15 years',
      nextAvailable: 'Today 2:00 PM',
      location: 'Heart Center',
      teleconsultAvailable: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'General Practice',
      avatar: '/placeholder.svg',
      rating: 4.8,
      experience: '12 years',
      nextAvailable: 'Tomorrow 9:00 AM',
      location: 'Main Clinic',
      teleconsultAvailable: true
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      avatar: '/placeholder.svg',
      rating: 4.7,
      experience: '8 years',
      nextAvailable: 'Jun 24 11:00 AM',
      location: 'Skin Care Center',
      teleconsultAvailable: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    toast.success('Appointment booking initiated!');
  };

  const handleJoinCall = (appointmentId: string) => {
    toast.success('Joining teleconsultation...');
  };

  const handleReschedule = (appointmentId: string) => {
    toast.info('Rescheduling options opened');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Enhanced Appointment System
          </CardTitle>
          <CardDescription>
            Book appointments, join teleconsults, and manage your healthcare schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Smart</h3>
              <p className="text-sm text-gray-600">Scheduling</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Video className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Teleconsult</h3>
              <p className="text-sm text-gray-600">Video calls</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Flexible</h3>
              <p className="text-sm text-gray-600">Time slots</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Support</h3>
              <p className="text-sm text-gray-600">24/7 help</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="book">Book Appointment</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="teleconsult">Teleconsult</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedAppointmentType === 'in-person' ? 'default' : 'outline'}
              onClick={() => setSelectedAppointmentType('in-person')}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              In-Person
            </Button>
            <Button
              variant={selectedAppointmentType === 'teleconsult' ? 'default' : 'outline'}
              onClick={() => setSelectedAppointmentType('teleconsult')}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Teleconsult
            </Button>
          </div>
          
          <div className="grid gap-4">
            {doctors
              .filter(doctor => selectedAppointmentType === 'in-person' || doctor.teleconsultAvailable)
              .map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={doctor.avatar} />
                          <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold">{doctor.name}</h3>
                            <p className="text-gray-600">{doctor.specialty}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{doctor.rating}</span>
                            </div>
                            <span>{doctor.experience} experience</span>
                            {selectedAppointmentType === 'in-person' && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {doctor.location}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Next available: {doctor.nextAvailable}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button onClick={() => handleBookAppointment(doctor.id)}>
                          Book Appointment
                        </Button>
                        {selectedAppointmentType === 'teleconsult' && doctor.teleconsultAvailable && (
                          <Badge className="bg-green-100 text-green-800">
                            Teleconsult Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          
          <div className="grid gap-4">
            {appointments.filter(apt => apt.status === 'scheduled').map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.doctorAvatar} />
                        <AvatarFallback>{appointment.doctorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time} ({appointment.duration} min)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {appointment.type === 'teleconsult' ? (
                            <Video className="h-4 w-4 text-green-600" />
                          ) : (
                            <MapPin className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-sm">
                            {appointment.type === 'teleconsult' ? 'Video Call' : appointment.location}
                          </span>
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      
                      <div className="space-y-1">
                        {appointment.type === 'teleconsult' && (
                          <Button size="sm" onClick={() => handleJoinCall(appointment.id)}>
                            <Video className="h-4 w-4 mr-2" />
                            Join Call
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teleconsult" className="space-y-4">
          <h3 className="text-lg font-semibold">Teleconsultation Center</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Video Call Setup</CardTitle>
              <CardDescription>Test your connection before your appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Video className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h4 className="font-medium">Camera</h4>
                  <p className="text-sm text-green-600">Working</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Phone className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h4 className="font-medium">Microphone</h4>
                  <p className="text-sm text-green-600">Working</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h4 className="font-medium">Connection</h4>
                  <p className="text-sm text-green-600">Excellent</p>
                </div>
              </div>
              
              <Button className="w-full">Test Connection</Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {appointments.filter(apt => apt.type === 'teleconsult').map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.doctorAvatar} />
                        <AvatarFallback>{appointment.doctorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      {appointment.status === 'scheduled' && (
                        <Button onClick={() => handleJoinCall(appointment.id)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold">Appointment History</h3>
          
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold">Dr. Amanda Foster</h4>
                        <p className="text-sm text-gray-600">Endocrinologist</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>June 15, 2024</span>
                        <span>In-Person</span>
                        <span>45 min</span>
                      </div>
                      
                      <p className="text-sm text-gray-600">Diabetes management consultation</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <Button variant="outline" size="sm">View Summary</Button>
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
