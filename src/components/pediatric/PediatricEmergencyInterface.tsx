
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Phone,
  Weight,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Zap,
  Users,
  Bell
} from 'lucide-react';

export const PediatricEmergencyInterface = () => {
  const [emergencyData, setEmergencyData] = useState({
    patientWeight: '',
    patientAge: '',
    ageUnit: 'months',
    emergencyType: '',
    vitals: {
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: ''
    }
  });
  const [calculatedMedications, setCalculatedMedications] = useState([]);
  const [familyNotificationStatus, setFamilyNotificationStatus] = useState('pending');

  const emergencyProtocols = [
    {
      id: 'cardiac-arrest',
      name: 'Pediatric Cardiac Arrest',
      ageGroups: {
        'infant': { name: 'Infant (0-12 months)', compressionDepth: '1.5 inches', rate: '100-120/min' },
        'child': { name: 'Child (1-8 years)', compressionDepth: '2 inches', rate: '100-120/min' },
        'adolescent': { name: 'Adolescent (>8 years)', compressionDepth: '2-2.4 inches', rate: '100-120/min' }
      },
      medications: [
        { drug: 'Epinephrine', dose: '0.01 mg/kg', route: 'IV/IO', repeat: 'every 3-5 min' },
        { drug: 'Amiodarone', dose: '5 mg/kg', route: 'IV/IO', repeat: 'may repeat once' }
      ]
    },
    {
      id: 'respiratory-distress',
      name: 'Severe Respiratory Distress',
      assessmentCriteria: [
        'Accessory muscle use',
        'Nasal flaring',
        'Grunting respirations',
        'Cyanosis',
        'Altered mental status'
      ],
      interventions: [
        'High-flow oxygen',
        'Positioning (upright/tripod)',
        'Nebulized treatments',
        'Prepare for intubation'
      ]
    },
    {
      id: 'seizure',
      name: 'Pediatric Seizure',
      timeFrames: {
        'immediate': 'First 5 minutes - Position safely, protect airway',
        'prolonged': '5-10 minutes - Consider medication',
        'status': '>10 minutes - Status epilepticus protocol'
      },
      medications: [
        { drug: 'Midazolam', dose: '0.2 mg/kg', route: 'IN/IV', max: '10mg' },
        { drug: 'Lorazepam', dose: '0.1 mg/kg', route: 'IV', max: '4mg' }
      ]
    }
  ];

  const emergencyMedications = [
    {
      drug: 'Epinephrine (1:10,000)',
      indication: 'Cardiac arrest',
      dose: '0.01 mg/kg',
      route: 'IV/IO',
      maxDose: '1 mg',
      ageRestrictions: 'All ages'
    },
    {
      drug: 'Atropine',
      indication: 'Bradycardia',
      dose: '0.02 mg/kg',
      route: 'IV/IO',
      maxDose: '0.5 mg',
      ageRestrictions: 'Minimum dose 0.1 mg'
    },
    {
      drug: 'Adenosine',
      indication: 'SVT',
      dose: '0.1 mg/kg',
      route: 'IV (rapid push)',
      maxDose: '6 mg first dose',
      ageRestrictions: 'All ages'
    },
    {
      drug: 'Midazolam',
      indication: 'Seizures',
      dose: '0.2 mg/kg',
      route: 'IN/IV/IM',
      maxDose: '10 mg',
      ageRestrictions: 'All ages'
    }
  ];

  const normalVitalRanges = {
    'newborn': { hr: '110-160', rr: '30-60', temp: '36.5-37.5°C' },
    'infant': { hr: '110-160', rr: '30-60', temp: '36.5-37.5°C' },
    'toddler': { hr: '90-140', rr: '24-40', temp: '36.5-37.5°C' },
    'preschool': { hr: '80-120', rr: '22-34', temp: '36.5-37.5°C' },
    'school': { hr: '70-100', rr: '18-30', temp: '36.5-37.5°C' },
    'adolescent': { hr: '60-90', rr: '12-16', temp: '36.5-37.5°C' }
  };

  const calculateEmergencyMedications = () => {
    if (!emergencyData.patientWeight) return;

    const weight = parseFloat(emergencyData.patientWeight);
    const calculated = emergencyMedications.map(med => {
      const doseValue = parseFloat(med.dose.split(' ')[0]);
      const calculatedDose = weight * doseValue;
      const finalDose = med.maxDose ? Math.min(calculatedDose, parseFloat(med.maxDose.split(' ')[0])) : calculatedDose;
      
      return {
        ...med,
        calculatedDose: finalDose.toFixed(2),
        volume: calculateVolume(med.drug, finalDose)
      };
    });

    setCalculatedMedications(calculated);
  };

  const calculateVolume = (drug, dose) => {
    // Simplified volume calculations based on common concentrations
    const concentrations = {
      'Epinephrine (1:10,000)': 0.1, // 0.1 mg/ml
      'Atropine': 0.4, // 0.4 mg/ml
      'Adenosine': 3, // 3 mg/ml
      'Midazolam': 1 // 1 mg/ml
    };
    
    const concentration = concentrations[drug] || 1;
    return (dose / concentration).toFixed(1);
  };

  const getVitalStatus = (vital, value, ageGroup) => {
    if (!value || !normalVitalRanges[ageGroup]) return 'normal';
    
    const numValue = parseFloat(value);
    const range = normalVitalRanges[ageGroup][vital];
    
    if (!range) return 'normal';
    
    const [min, max] = range.split('-').map(v => parseFloat(v));
    
    if (numValue < min) return 'low';
    if (numValue > max) return 'high';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-red-600';
      case 'low': return 'text-blue-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const notifyFamily = () => {
    setFamilyNotificationStatus('sent');
    // Simulate family notification
    setTimeout(() => {
      setFamilyNotificationStatus('acknowledged');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="protocols" className="w-full">
        <TabsList>
          <TabsTrigger value="protocols">Emergency Protocols</TabsTrigger>
          <TabsTrigger value="medications">Weight-Based Medications</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="family">Family Notification</TabsTrigger>
        </TabsList>

        <TabsContent value="protocols" className="space-y-4">
          <Alert className="border-red-300 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency Protocols:</strong> Follow institutional guidelines and contact supervising physician immediately for all pediatric emergencies.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {emergencyProtocols.map((protocol) => (
              <Card key={protocol.id} className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    {protocol.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {protocol.ageGroups && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Age-Specific Guidelines:</h4>
                      {Object.entries(protocol.ageGroups).map(([key, group]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-gray-600">
                            Compression depth: {group.compressionDepth} | Rate: {group.rate}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {protocol.assessmentCriteria && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Assessment Criteria:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {protocol.assessmentCriteria.map((criteria, index) => (
                          <li key={index}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {protocol.interventions && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Immediate Interventions:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {protocol.interventions.map((intervention, index) => (
                          <li key={index}>{intervention}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {protocol.timeFrames && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Time-Based Actions:</h4>
                      {Object.entries(protocol.timeFrames).map(([timeframe, action]) => (
                        <div key={timeframe} className="p-2 bg-yellow-50 rounded text-sm mb-2">
                          <strong>{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}:</strong> {action}
                        </div>
                      ))}
                    </div>
                  )}

                  {protocol.medications && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Emergency Medications:</h4>
                      <div className="space-y-2">
                        {protocol.medications.map((med, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-blue-50">
                            <div className="font-medium">{med.drug}</div>
                            <div className="text-sm text-gray-600">
                              Dose: {med.dose} | Route: {med.route} | Repeat: {med.repeat}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Patient Information for Dosing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Patient Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    value={emergencyData.patientWeight}
                    onChange={(e) => setEmergencyData(prev => ({ ...prev, patientWeight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Patient Age</Label>
                  <div className="flex gap-2">
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={emergencyData.patientAge}
                      onChange={(e) => setEmergencyData(prev => ({ ...prev, patientAge: e.target.value }))}
                    />
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={emergencyData.ageUnit}
                      onChange={(e) => setEmergencyData(prev => ({ ...prev, ageUnit: e.target.value }))}
                    >
                      <option value="months">months</option>
                      <option value="years">years</option>
                    </select>
                  </div>
                </div>
              </div>
              <Button onClick={calculateEmergencyMedications} className="w-full mt-4" disabled={!emergencyData.patientWeight}>
                <Zap className="h-4 w-4 mr-2" />
                Calculate Emergency Medications
              </Button>
            </CardContent>
          </Card>

          {calculatedMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Calculated Emergency Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculatedMedications.map((med, index) => (
                    <div key={index} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-red-800">{med.drug}</h3>
                          <p className="text-sm text-red-600">{med.indication}</p>
                          <p className="text-sm">{med.ageRestrictions}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-white rounded border">
                            <div className="text-2xl font-bold text-red-800">{med.calculatedDose} mg</div>
                            <div className="text-sm text-gray-600">Dose for {emergencyData.patientWeight}kg patient</div>
                          </div>
                          <div className="text-sm">
                            <div><strong>Volume:</strong> {med.volume} ml</div>
                            <div><strong>Route:</strong> {med.route}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Pediatric Vital Signs Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="Enter heart rate"
                    value={emergencyData.vitals.heartRate}
                    onChange={(e) => setEmergencyData(prev => ({ 
                      ...prev, 
                      vitals: { ...prev.vitals, heartRate: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    placeholder="Enter respiratory rate"
                    value={emergencyData.vitals.respiratoryRate}
                    onChange={(e) => setEmergencyData(prev => ({ 
                      ...prev, 
                      vitals: { ...prev.vitals, respiratoryRate: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="Enter temperature"
                    value={emergencyData.vitals.temperature}
                    onChange={(e) => setEmergencyData(prev => ({ 
                      ...prev, 
                      vitals: { ...prev.vitals, temperature: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    placeholder="Enter SpO2"
                    value={emergencyData.vitals.oxygenSaturation}
                    onChange={(e) => setEmergencyData(prev => ({ 
                      ...prev, 
                      vitals: { ...prev.vitals, oxygenSaturation: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Normal Vital Sign Ranges by Age
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(normalVitalRanges).map(([ageGroup, ranges]) => (
                  <div key={ageGroup} className="p-3 border rounded-lg">
                    <h3 className="font-medium capitalize mb-2">{ageGroup}</h3>
                    <div className="text-sm space-y-1">
                      <div>HR: {ranges.hr}</div>
                      <div>RR: {ranges.rr}</div>
                      <div>Temp: {ranges.temp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Notification System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-blue-300 bg-blue-50">
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Automatic family notification will be sent immediately upon emergency activation. 
                    Family members will receive updates via phone, SMS, and app notifications.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Primary Contact</h3>
                      <div className="space-y-2">
                        <div><strong>Name:</strong> Sarah Johnson</div>
                        <div><strong>Relationship:</strong> Mother</div>
                        <div><strong>Phone:</strong> (555) 123-4567</div>
                        <div><strong>Status:</strong> 
                          <Badge className={familyNotificationStatus === 'acknowledged' ? 'bg-green-100 text-green-800 ml-2' : familyNotificationStatus === 'sent' ? 'bg-blue-100 text-blue-800 ml-2' : 'bg-gray-100 text-gray-800 ml-2'}>
                            {familyNotificationStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Secondary Contact</h3>
                      <div className="space-y-2">
                        <div><strong>Name:</strong> Michael Johnson</div>
                        <div><strong>Relationship:</strong> Father</div>
                        <div><strong>Phone:</strong> (555) 987-6543</div>
                        <div><strong>Status:</strong> 
                          <Badge className="bg-gray-100 text-gray-800 ml-2">pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button onClick={notifyFamily} disabled={familyNotificationStatus !== 'pending'}>
                    <Phone className="h-4 w-4 mr-2" />
                    Send Emergency Notification
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Update Contact Information
                  </Button>
                </div>

                {familyNotificationStatus === 'sent' && (
                  <Alert className="border-yellow-300 bg-yellow-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Emergency notification sent to family members. Awaiting acknowledgment...
                    </AlertDescription>
                  </Alert>
                )}

                {familyNotificationStatus === 'acknowledged' && (
                  <Alert className="border-green-300 bg-green-50">
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      Family has been notified and acknowledged the emergency. Primary contact is en route to hospital.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
