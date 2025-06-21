
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Video, MapPin, User, Phone, FileText, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  nextAvailable: Date;
  teleconsultAvailable: boolean;
  image: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  type: 'in-person' | 'teleconsult';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    hospital: 'City Medical Center',
    rating: 4.8,
    nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000),
    teleconsultAvailable: true,
    image: '/doctor1.jpg'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    hospital: 'General Hospital',
    rating: 4.6,
    nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    teleconsultAvailable: true,
    image: '/doctor2.jpg'
  }
];

export const EnhancedAppointmentSystem = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      type: 'in-person',
      status: 'scheduled'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('book');

  const handleBookAppointment = (doctor: Doctor, type: 'in-person' | 'teleconsult') => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: doctor.nextAvailable,
      type,
      status: 'scheduled'
    };
    
    setAppointments(prev => [newAppointment, ...prev]);
    toast.success(`${type === 'teleconsult' ? 'Teleconsultation' : 'Appointment'} booked successfully`);
    setActiveTab('upcoming');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
    ));
    toast.success('Appointment cancelled');
  };

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Upcoming</span>
            </div>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-green-600" />
              <span className="font-medium">Teleconsults</span>
            </div>
            <div className="text-2xl font-bold">
              {upcomingAppointments.filter(apt => apt.type === 'teleconsult').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">This Week</span>
            </div>
            <div className="text-2xl font-bold">
              {upcomingAppointments.filter(apt => 
                apt.date < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="book">Book Appointment</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="teleconsult">Teleconsult</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specialties</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Available Doctors */}
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{doctor.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">⭐ {doctor.rating}</span>
                          <Badge variant="outline">
                            Next: {doctor.nextAvailable.toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBookAppointment(doctor, 'in-person')}
                        variant="outline"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Visit
                      </Button>
                      {doctor.teleconsultAvailable && (
                        <Button
                          onClick={() => handleBookAppointment(doctor, 'teleconsult')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Teleconsult
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{appointment.doctorName}</h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {appointment.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {appointment.date.toLocaleTimeString()}
                        </span>
                        <Badge variant={appointment.type === 'teleconsult' ? 'default' : 'outline'}>
                          {appointment.type === 'teleconsult' ? (
                            <><Video className="h-3 w-3 mr-1" /> Teleconsult</>
                          ) : (
                            <><MapPin className="h-3 w-3 mr-1" /> In-person</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.type === 'teleconsult' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="teleconsult" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teleconsultation Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Before Your Call</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Upload relevant documents
                    </li>
                    <li className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-yellow-600" />
                      Prepare your questions
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      Test your camera and microphone
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">During Your Call</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Share your screen or documents</li>
                    <li>• Record important instructions</li>
                    <li>• Get digital prescriptions</li>
                    <li>• Schedule follow-up appointments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointment history</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{appointment.doctorName}</h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
