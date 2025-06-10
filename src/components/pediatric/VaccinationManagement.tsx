
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Syringe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Bell
} from 'lucide-react';

export const VaccinationManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient1');

  const patients = [
    {
      id: 'patient1',
      name: 'Emma Johnson',
      age: '3 years 2 months',
      nextVaccination: 'MMR Booster',
      dueDate: '2024-02-15',
      completedVaccinations: 12,
      totalRequired: 15
    },
    {
      id: 'patient2',
      name: 'Lucas Chen',
      age: '1 year 8 months',
      nextVaccination: 'Hepatitis A',
      dueDate: '2024-01-25',
      completedVaccinations: 8,
      totalRequired: 12
    }
  ];

  const vaccinationSchedule = [
    {
      vaccine: 'Hepatitis B',
      doses: [
        { dose: 1, scheduledAge: 'Birth', status: 'completed', date: '2021-03-15', lot: 'HB2023-001' },
        { dose: 2, scheduledAge: '1-2 months', status: 'completed', date: '2021-04-20', lot: 'HB2023-002' },
        { dose: 3, scheduledAge: '6-18 months', status: 'completed', date: '2021-09-10', lot: 'HB2023-003' }
      ]
    },
    {
      vaccine: 'DTaP',
      doses: [
        { dose: 1, scheduledAge: '2 months', status: 'completed', date: '2021-05-15', lot: 'DT2023-001' },
        { dose: 2, scheduledAge: '4 months', status: 'completed', date: '2021-07-15', lot: 'DT2023-002' },
        { dose: 3, scheduledAge: '6 months', status: 'completed', date: '2021-09-15', lot: 'DT2023-003' },
        { dose: 4, scheduledAge: '15-18 months', status: 'completed', date: '2022-06-20', lot: 'DT2023-004' },
        { dose: 5, scheduledAge: '4-6 years', status: 'due', date: null, lot: null }
      ]
    },
    {
      vaccine: 'MMR',
      doses: [
        { dose: 1, scheduledAge: '12-15 months', status: 'completed', date: '2022-03-20', lot: 'MMR2023-001' },
        { dose: 2, scheduledAge: '4-6 years', status: 'due', date: null, lot: null }
      ]
    },
    {
      vaccine: 'Varicella',
      doses: [
        { dose: 1, scheduledAge: '12-15 months', status: 'completed', date: '2022-03-20', lot: 'VAR2023-001' },
        { dose: 2, scheduledAge: '4-6 years', status: 'upcoming', date: null, lot: null }
      ]
    }
  ];

  const upcomingVaccinations = [
    {
      patient: 'Emma Johnson',
      vaccine: 'MMR Booster',
      dueDate: '2024-02-15',
      urgency: 'due',
      age: '3 years 2 months'
    },
    {
      patient: 'Lucas Chen',
      vaccine: 'Hepatitis A',
      dueDate: '2024-01-25',
      urgency: 'overdue',
      age: '1 year 8 months'
    },
    {
      patient: 'Sophie Williams',
      vaccine: 'DTaP Booster',
      dueDate: '2024-02-28',
      urgency: 'upcoming',
      age: '4 years 1 month'
    }
  ];

  const exemptions = [
    {
      patient: 'Michael Davis',
      vaccine: 'MMR',
      type: 'Medical',
      reason: 'Immunocompromised',
      expiryDate: '2024-12-31',
      physician: 'Dr. Smith'
    },
    {
      patient: 'Sarah Brown',
      vaccine: 'Varicella',
      type: 'Religious',
      reason: 'Religious beliefs',
      expiryDate: 'Permanent',
      physician: 'N/A'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'due': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'upcoming': return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Vaccination Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming & Due</TabsTrigger>
          <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
          <TabsTrigger value="inventory">Vaccine Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                Patient Vaccination Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer transition-all ${selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.age}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vaccination Progress</span>
                          <span className="text-sm font-medium">{patient.completedVaccinations}/{patient.totalRequired}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(patient.completedVaccinations / patient.totalRequired) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Next: {patient.nextVaccination} - {patient.dueDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vaccination Schedule Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Immunization Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vaccinationSchedule.map((vaccine, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">{vaccine.vaccine}</h3>
                    <div className="space-y-2">
                      {vaccine.doses.map((dose, dIndex) => (
                        <div key={dIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {dose.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : dose.status === 'due' ? (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <div className="font-medium">Dose {dose.dose}</div>
                              <div className="text-sm text-gray-600">Scheduled: {dose.scheduledAge}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(dose.status)}>
                              {dose.status}
                            </Badge>
                            {dose.date && (
                              <div className="text-sm text-gray-600 mt-1">
                                Given: {dose.date}
                              </div>
                            )}
                            {dose.lot && (
                              <div className="text-xs text-gray-500">
                                Lot: {dose.lot}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Upcoming & Due Vaccinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVaccinations.map((vaccination, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getUrgencyIcon(vaccination.urgency)}
                      <div>
                        <div className="font-medium">{vaccination.patient}</div>
                        <div className="text-sm text-gray-600">{vaccination.age}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{vaccination.vaccine}</div>
                      <div className="text-sm text-gray-600">Due: {vaccination.dueDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(vaccination.urgency)}>
                        {vaccination.urgency}
                      </Badge>
                      <Button size="sm">
                        <Syringe className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exemptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Vaccination Exemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exemptions.map((exemption, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium">{exemption.patient}</div>
                        <div className="text-sm text-gray-600">Vaccine: {exemption.vaccine}</div>
                        <div className="text-sm text-gray-600">Type: {exemption.type}</div>
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">Reason:</span> {exemption.reason}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Expires:</span> {exemption.expiryDate}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Physician:</span> {exemption.physician}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Vaccine Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">156</div>
                        <div className="text-sm text-gray-600">DTaP Doses Available</div>
                        <Badge className="mt-2 bg-green-100 text-green-800">In Stock</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">23</div>
                        <div className="text-sm text-gray-600">MMR Doses Available</div>
                        <Badge className="mt-2 bg-yellow-100 text-yellow-800">Low Stock</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">5</div>
                        <div className="text-sm text-gray-600">Varicella Doses Available</div>
                        <Badge className="mt-2 bg-red-100 text-red-800">Critical Low</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Inventory Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
