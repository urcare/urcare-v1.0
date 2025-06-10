
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Weight,
  Pill,
  Clock,
  Shield
} from 'lucide-react';

export const PediatricDosingCalculator = () => {
  const [patientData, setPatientData] = useState({
    weight: '',
    age: '',
    ageUnit: 'years'
  });
  const [selectedMedication, setSelectedMedication] = useState('');
  const [calculatedDose, setCalculatedDose] = useState(null);
  const [safetyAlerts, setSafetyAlerts] = useState([]);

  const medications = [
    {
      id: 'acetaminophen',
      name: 'Acetaminophen (Paracetamol)',
      dosing: {
        route: 'oral',
        dosePerKg: 15,
        maxDose: 1000,
        frequency: '4-6 hours',
        maxDaily: 75
      },
      formulations: [
        { strength: '80mg', form: 'suspension', volume: '5ml' },
        { strength: '160mg', form: 'suspension', volume: '5ml' },
        { strength: '80mg', form: 'chewable tablet', volume: '1 tablet' },
        { strength: '160mg', form: 'tablet', volume: '1 tablet' }
      ],
      ageRestrictions: {
        minAge: 3,
        minAgeUnit: 'months'
      }
    },
    {
      id: 'ibuprofen',
      name: 'Ibuprofen',
      dosing: {
        route: 'oral',
        dosePerKg: 10,
        maxDose: 600,
        frequency: '6-8 hours',
        maxDaily: 40
      },
      formulations: [
        { strength: '100mg', form: 'suspension', volume: '5ml' },
        { strength: '200mg', form: 'suspension', volume: '5ml' },
        { strength: '50mg', form: 'chewable tablet', volume: '1 tablet' },
        { strength: '100mg', form: 'tablet', volume: '1 tablet' }
      ],
      ageRestrictions: {
        minAge: 6,
        minAgeUnit: 'months'
      }
    },
    {
      id: 'amoxicillin',
      name: 'Amoxicillin',
      dosing: {
        route: 'oral',
        dosePerKg: 25,
        maxDose: 875,
        frequency: '12 hours',
        maxDaily: 50
      },
      formulations: [
        { strength: '125mg', form: 'suspension', volume: '5ml' },
        { strength: '250mg', form: 'suspension', volume: '5ml' },
        { strength: '250mg', form: 'tablet', volume: '1 tablet' },
        { strength: '500mg', form: 'tablet', volume: '1 tablet' }
      ],
      ageRestrictions: {
        minAge: 1,
        minAgeUnit: 'months'
      }
    }
  ];

  const calculateDose = () => {
    if (!patientData.weight || !selectedMedication) return;

    const medication = medications.find(m => m.id === selectedMedication);
    if (!medication) return;

    const weight = parseFloat(patientData.weight);
    const age = parseFloat(patientData.age);
    
    // Calculate dose
    const calculatedDoseValue = weight * medication.dosing.dosePerKg;
    const finalDose = Math.min(calculatedDoseValue, medication.dosing.maxDose);
    
    // Safety checks
    const alerts = [];
    
    // Age restriction check
    const ageInMonths = patientData.ageUnit === 'years' ? age * 12 : age;
    if (ageInMonths < medication.ageRestrictions.minAge) {
      alerts.push({
        type: 'error',
        message: `This medication is not recommended for children under ${medication.ageRestrictions.minAge} ${medication.ageRestrictions.minAgeUnit}`
      });
    }
    
    // Maximum dose check
    if (calculatedDoseValue > medication.dosing.maxDose) {
      alerts.push({
        type: 'warning',
        message: `Calculated dose (${calculatedDoseValue.toFixed(1)}mg) exceeds maximum single dose. Dose capped at ${medication.dosing.maxDose}mg`
      });
    }
    
    // Daily maximum check
    const dailyDose = finalDose * (24 / parseFloat(medication.dosing.frequency.split('-')[0]));
    const maxDailyDose = weight * medication.dosing.maxDaily;
    if (dailyDose > maxDailyDose) {
      alerts.push({
        type: 'warning',
        message: `Daily dose may exceed maximum. Monitor closely.`
      });
    }
    
    // Weight-based recommendations
    if (weight < 3) {
      alerts.push({
        type: 'warning',
        message: 'Very low weight. Consider consultation with pediatric specialist.'
      });
    }
    
    if (weight > 50) {
      alerts.push({
        type: 'info',
        message: 'Consider adult dosing protocols for weights over 50kg.'
      });
    }

    // Find appropriate formulation
    const appropriateFormulations = medication.formulations.filter(formulation => {
      const strengthValue = parseFloat(formulation.strength);
      const volumeNeeded = finalDose / strengthValue;
      return volumeNeeded >= 0.1 && volumeNeeded <= 20; // Reasonable volume range
    });

    setSafetyAlerts(alerts);
    setCalculatedDose({
      dose: finalDose,
      medication: medication,
      formulations: appropriateFormulations,
      frequency: medication.dosing.frequency,
      route: medication.dosing.route
    });
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pediatric Dosing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight">Patient Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={patientData.weight}
                  onChange={(e) => setPatientData(prev => ({ ...prev, weight: e.target.value }))}
                />
                <Badge variant="outline" className="flex items-center">
                  <Weight className="h-3 w-3 mr-1" />
                  kg
                </Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="age">Patient Age</Label>
              <div className="flex gap-2">
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={patientData.age}
                  onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                />
                <Select value={patientData.ageUnit} onValueChange={(value) => setPatientData(prev => ({ ...prev, ageUnit: value }))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">months</SelectItem>
                    <SelectItem value="years">years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="medication">Medication</Label>
              <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((med) => (
                    <SelectItem key={med.id} value={med.id}>
                      {med.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={calculateDose} className="w-full" disabled={!patientData.weight || !selectedMedication}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Dose
          </Button>
        </CardContent>
      </Card>

      {/* Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {safetyAlerts.map((alert, index) => (
                <Alert key={index} className={`${alert.type === 'error' ? 'border-red-300 bg-red-50' : alert.type === 'warning' ? 'border-yellow-300 bg-yellow-50' : 'border-blue-300 bg-blue-50'}`}>
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <AlertDescription>{alert.message}</AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculated Dose Results */}
      {calculatedDose && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Calculated Dose - {calculatedDose.medication.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">{calculatedDose.dose.toFixed(1)} mg</div>
                  <div className="text-sm text-green-600">Recommended Dose</div>
                  <div className="text-xs text-gray-600 mt-2">
                    Route: {calculatedDose.route} | Frequency: Every {calculatedDose.frequency}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-medium text-blue-800">Age-Appropriate Formulations</div>
                  <div className="text-sm text-blue-600">Available options for this patient</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recommended Formulations:</h4>
                {calculatedDose.formulations.map((formulation, index) => {
                  const volumeNeeded = calculatedDose.dose / parseFloat(formulation.strength);
                  return (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{formulation.strength} {formulation.form}</div>
                          <div className="text-sm text-gray-600">
                            Give: {volumeNeeded.toFixed(1)} {formulation.form.includes('tablet') ? 'tablet(s)' : 'ml'}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formulation.strength}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Dosing Schedule</span>
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  Administer every {calculatedDose.frequency} as needed. 
                  Do not exceed maximum daily dose limits.
                </div>
              </div>

              <Button className="w-full">
                <Pill className="h-4 w-4 mr-2" />
                Generate Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
