
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Bed,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Heart,
  Monitor,
  Stethoscope,
  MapPin
} from 'lucide-react';

export const EmergencySeverityTracking = () => {
  const [selectedArea, setSelectedArea] = useState('all');
  
  const bedStatus = {
    total: 45,
    occupied: 40,
    available: 5,
    cleaning: 2,
    maintenance: 1
  };

  const departmentAreas = [
    {
      id: 'trauma',
      name: 'Trauma Bay',
      beds: { total: 6, occupied: 4, available: 2 },
      patients: [
        { id: 1, name: 'John Doe', condition: 'Motor vehicle accident', severity: 1, vitals: 'Critical' },
        { id: 2, name: 'Jane Smith', condition: 'Fall injury', severity: 2, vitals: 'Stable' }
      ]
    },
    {
      id: 'resus',
      name: 'Resuscitation',
      beds: { total: 4, occupied: 2, available: 2 },
      patients: [
        { id: 3, name: 'Robert Wilson', condition: 'Cardiac arrest', severity: 1, vitals: 'Critical' }
      ]
    },
    {
      id: 'acute',
      name: 'Acute Care',
      beds: { total: 20, occupied: 18, available: 2 },
      patients: [
        { id: 4, name: 'Maria Garcia', condition: 'Chest pain', severity: 2, vitals: 'Monitored' },
        { id: 5, name: 'David Brown', condition: 'Shortness of breath', severity: 3, vitals: 'Stable' }
      ]
    },
    {
      id: 'fasttrack',
      name: 'Fast Track',
      beds: { total: 15, occupied: 16, available: -1 },
      patients: [
        { id: 6, name: 'Lisa Johnson', condition: 'Minor laceration', severity: 4, vitals: 'Stable' },
        { id: 7, name: 'Michael Davis', condition: 'Sprained ankle', severity: 5, vitals: 'Stable' }
      ]
    }
  ];

  const criticalPatients = [
    {
      id: 1,
      name: 'John Doe',
      location: 'Trauma Bay 1',
      condition: 'Polytrauma from MVA',
      lastUpdate: '2 min ago',
      vitals: { bp: '90/60', hr: 120, spo2: 88, temp: 96.8 },
      alerts: ['Hypotension', 'Tachycardia', 'Low SpO2']
    },
    {
      id: 2,
      name: 'Robert Wilson',
      location: 'Resus 2',
      condition: 'Post-cardiac arrest',
      lastUpdate: '5 min ago',
      vitals: { bp: '110/70', hr: 85, spo2: 92, temp: 97.2 },
      alerts: ['Post-arrest monitoring', 'Neurological checks']
    }
  ];

  const resourceAllocation = {
    doctors: { available: 8, busy: 12, total: 20 },
    nurses: { available: 15, busy: 25, total: 40 },
    respiratory: { available: 2, busy: 4, total: 6 },
    imaging: { available: 1, busy: 2, total: 3 }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 1: return 'bg-red-800 text-white';
      case 2: return 'bg-red-600 text-white';
      case 3: return 'bg-yellow-500 text-white';
      case 4: return 'bg-green-500 text-white';
      case 5: return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {bedStatus.occupied}/{bedStatus.total}
                </div>
                <div className="text-sm text-gray-600">Bed Occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {resourceAllocation.doctors.available + resourceAllocation.nurses.available}
                </div>
                <div className="text-sm text-gray-600">Available Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {criticalPatients.length}
                </div>
                <div className="text-sm text-gray-600">Critical Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((bedStatus.occupied / bedStatus.total) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Patient Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Critical Patient Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalPatients.map((patient) => (
              <Card key={patient.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-red-800">{patient.name}</h3>
                        <p className="text-sm text-red-600">{patient.location}</p>
                      </div>
                      <Badge className="bg-red-600 text-white">CRITICAL</Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Condition:</p>
                      <p className="text-sm text-gray-700">{patient.condition}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">BP</div>
                        <div>{patient.vitals.bp}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">HR</div>
                        <div>{patient.vitals.hr}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">SpO2</div>
                        <div>{patient.vitals.spo2}%</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Temp</div>
                        <div>{patient.vitals.temp}°F</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-red-700">Active Alerts:</p>
                      {patient.alerts.map((alert, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {alert}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Last update: {patient.lastUpdate}</span>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Department Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentAreas.map((area) => (
                <Card key={area.id} className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedArea === area.id ? 'ring-2 ring-blue-500' : ''
                }`} onClick={() => setSelectedArea(area.id)}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{area.name}</h3>
                        <Badge variant="outline">
                          {area.beds.occupied}/{area.beds.total} beds
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Occupancy</span>
                          <span>{Math.round((area.beds.occupied / area.beds.total) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(area.beds.occupied / area.beds.total) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-1">
                        {area.patients.slice(0, 2).map((patient) => (
                          <div key={patient.id} className="flex justify-between items-center text-sm">
                            <span>{patient.name}</span>
                            <Badge className={getSeverityColor(patient.severity)}>
                              ESI {patient.severity}
                            </Badge>
                          </div>
                        ))}
                        {area.patients.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{area.patients.length - 2} more patients
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resource Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(resourceAllocation).map(([resource, data]) => (
                <div key={resource} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{resource}</span>
                    <span className="text-sm text-gray-600">
                      {data.available} available / {data.total} total
                    </span>
                  </div>
                  <Progress 
                    value={(data.busy / data.total) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{data.busy} busy</span>
                    <span>{Math.round((data.busy / data.total) * 100)}% utilization</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">Request Additional Staff</Button>
                  <Button className="w-full" variant="outline">Open Overflow Area</Button>
                  <Button className="w-full" variant="outline">Transfer Patients</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
