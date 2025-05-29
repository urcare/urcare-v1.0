
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Bed, Clock, User, Search, Filter } from 'lucide-react';

interface WardPatient {
  id: string;
  name: string;
  bedNumber: string;
  ward: string;
  status: 'stable' | 'monitoring' | 'critical' | 'recovering' | 'discharge-ready';
  admissionDate: string;
  diagnosis: string;
  lastVisit: string;
  nextVisit: string;
  assignedDoctor: string;
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSat: string;
  };
}

const mockPatients: WardPatient[] = [
  {
    id: 'W001',
    name: 'John Smith',
    bedNumber: 'A-101',
    ward: 'General Ward A',
    status: 'stable',
    admissionDate: '2024-01-15',
    diagnosis: 'Pneumonia',
    lastVisit: '2 hours ago',
    nextVisit: '6:00 PM',
    assignedDoctor: 'Dr. Johnson',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      oxygenSat: '98%'
    }
  },
  {
    id: 'W002',
    name: 'Sarah Wilson',
    bedNumber: 'B-203',
    ward: 'ICU',
    status: 'critical',
    admissionDate: '2024-01-20',
    diagnosis: 'Cardiac Emergency',
    lastVisit: '30 min ago',
    nextVisit: '2:00 PM',
    assignedDoctor: 'Dr. Brown',
    vitals: {
      temperature: '99.2°F',
      bloodPressure: '140/90',
      heartRate: '95 bpm',
      oxygenSat: '94%'
    }
  },
  {
    id: 'W003',
    name: 'Mike Davis',
    bedNumber: 'A-105',
    ward: 'General Ward A',
    status: 'discharge-ready',
    admissionDate: '2024-01-18',
    diagnosis: 'Appendectomy',
    lastVisit: '1 hour ago',
    nextVisit: 'Discharge Today',
    assignedDoctor: 'Dr. Smith',
    vitals: {
      temperature: '98.4°F',
      bloodPressure: '118/75',
      heartRate: '68 bpm',
      oxygenSat: '99%'
    }
  }
];

export const WardPatientStatus = () => {
  const [patients] = useState<WardPatient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500 text-white';
      case 'monitoring': return 'bg-yellow-500 text-white';
      case 'stable': return 'bg-green-500 text-white';
      case 'recovering': return 'bg-blue-500 text-white';
      case 'discharge-ready': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🚨';
      case 'monitoring': return '⚠️';
      case 'stable': return '✅';
      case 'recovering': return '🔄';
      case 'discharge-ready': return '🏠';
      default: return '📊';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesWard = wardFilter === 'all' || patient.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ward Patient Status Dashboard
          </CardTitle>
          <CardDescription>
            Real-time color-coded patient status monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients or bed numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="recovering">Recovering</SelectItem>
                <SelectItem value="discharge-ready">Discharge Ready</SelectItem>
              </SelectContent>
            </Select>
            <Select value={wardFilter} onValueChange={setWardFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                <SelectItem value="General Ward A">General Ward A</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getStatusIcon(patient.status)}</span>
                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                        <Badge variant="outline">{patient.id}</Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Bed:</strong> {patient.bedNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Ward:</strong> {patient.ward}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Doctor:</strong> {patient.assignedDoctor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Next Visit:</strong> {patient.nextVisit}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="font-semibold">{patient.vitals.temperature}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Blood Pressure</p>
                      <p className="font-semibold">{patient.vitals.bloodPressure}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="font-semibold">{patient.vitals.heartRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Oxygen Sat</p>
                      <p className="font-semibold">{patient.vitals.oxygenSat}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                      <p><strong>Admitted:</strong> {patient.admissionDate} | <strong>Last Visit:</strong> {patient.lastVisit}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['critical', 'monitoring', 'stable', 'recovering', 'discharge-ready'].map((status) => {
              const count = patients.filter(p => p.status === status).length;
              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <Badge className={getStatusColor(status)} variant="secondary">
                    {status.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{count}</p>
                  <p className="text-sm text-gray-500">Patients</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
