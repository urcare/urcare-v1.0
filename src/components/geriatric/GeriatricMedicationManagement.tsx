
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  Eye,
  Shield
} from 'lucide-react';

export const GeriatricMedicationManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicationData, setMedicationData] = useState({
    currentMedications: [
      {
        id: 1,
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        indication: 'Type 2 Diabetes',
        startDate: '2023-06-15',
        prescriber: 'Dr. Smith',
        sideEffects: ['Nausea', 'Diarrhea'],
        interactions: [],
        adherence: 95,
        beersRisk: false
      },
      {
        id: 2,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        indication: 'Hypertension',
        startDate: '2023-03-20',
        prescriber: 'Dr. Johnson',
        sideEffects: ['Dry cough'],
        interactions: ['Potassium supplements'],
        adherence: 88,
        beersRisk: false
      },
      {
        id: 3,
        name: 'Diphenhydramine',
        dosage: '25mg',
        frequency: 'As needed',
        indication: 'Sleep aid',
        startDate: '2023-11-01',
        prescriber: 'Dr. Brown',
        sideEffects: ['Drowsiness', 'Confusion'],
        interactions: [],
        adherence: 70,
        beersRisk: true
      }
    ],
    interactions: [
      {
        id: 1,
        medication1: 'Lisinopril',
        medication2: 'Potassium supplements',
        severity: 'moderate',
        description: 'May increase risk of hyperkalemia',
        recommendation: 'Monitor potassium levels regularly'
      }
    ],
    adherenceData: {
      overall: 84,
      missed: 12,
      onTime: 156,
      late: 8
    }
  });

  const beersListMedications = [
    {
      medication: 'Diphenhydramine',
      category: 'Antihistamines',
      concern: 'Increased risk of cognitive impairment and falls',
      alternative: 'Loratadine or cetirizine for allergies'
    },
    {
      medication: 'Diazepam',
      category: 'Benzodiazepines',
      concern: 'Increased sensitivity and fall risk',
      alternative: 'Non-pharmacological approaches for anxiety'
    }
  ];

  const drugInteractionChecker = () => {
    // Simulate drug interaction checking
    const newInteraction = {
      id: Date.now(),
      medication1: 'New medication',
      medication2: 'Existing medication',
      severity: 'minor',
      description: 'Potential interaction detected',
      recommendation: 'Review with pharmacist'
    };
    
    setMedicationData(prev => ({
      ...prev,
      interactions: [...prev.interactions, newInteraction]
    }));
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Medication Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{medicationData.currentMedications.length}</div>
            <div className="text-sm text-gray-600">Active Medications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{medicationData.interactions.length}</div>
            <div className="text-sm text-gray-600">Drug Interactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {medicationData.currentMedications.filter(med => med.beersRisk).length}
            </div>
            <div className="text-sm text-gray-600">Beers List Medications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${getAdherenceColor(medicationData.adherenceData.overall)}`}>
              {medicationData.adherenceData.overall}%
            </div>
            <div className="text-sm text-gray-600">Overall Adherence</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="medications">Current Medications</TabsTrigger>
          <TabsTrigger value="interactions">Drug Interactions</TabsTrigger>
          <TabsTrigger value="adherence">Adherence Monitoring</TabsTrigger>
          <TabsTrigger value="beers">Beers Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-6">
          <div className="space-y-4">
            {medicationData.currentMedications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      {medication.name} {medication.dosage}
                    </CardTitle>
                    <div className="flex gap-2">
                      {medication.beersRisk && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Beers Risk
                        </Badge>
                      )}
                      <Badge className={`${getAdherenceColor(medication.adherence)} bg-opacity-10`}>
                        {medication.adherence}% adherence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium">Frequency</div>
                      <div className="text-sm text-gray-600">{medication.frequency}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Indication</div>
                      <div className="text-sm text-gray-600">{medication.indication}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Start Date</div>
                      <div className="text-sm text-gray-600">{medication.startDate}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Prescriber</div>
                      <div className="text-sm text-gray-600">{medication.prescriber}</div>
                    </div>
                  </div>
                  
                  {medication.sideEffects.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Potential Side Effects:</div>
                      <div className="flex flex-wrap gap-2">
                        {medication.sideEffects.map((effect, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {medication.interactions.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Known Interactions:</div>
                      <div className="flex flex-wrap gap-2">
                        {medication.interactions.map((interaction, index) => (
                          <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {interaction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Drug Interaction Analysis
              </CardTitle>
              <Button onClick={drugInteractionChecker} size="sm">
                Run Interaction Check
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicationData.interactions.map((interaction) => (
                  <div key={interaction.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {interaction.medication1} + {interaction.medication2}
                      </div>
                      <Badge className={getSeverityColor(interaction.severity)}>
                        {interaction.severity} severity
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {interaction.description}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      Recommendation: {interaction.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adherence" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Adherence Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Doses taken on time</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{medicationData.adherenceData.onTime}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Doses taken late</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{medicationData.adherenceData.late}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Missed doses</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{medicationData.adherenceData.missed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Adherence Improvement Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Pill organizer setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Medication reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Simplified dosing schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Caregiver involvement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Pharmacy sync programs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="beers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Beers Criteria Review
              </CardTitle>
              <p className="text-sm text-gray-600">
                Medications potentially inappropriate for older adults
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {beersListMedications.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-red-800">{item.medication}</div>
                      <Badge className="bg-red-100 text-red-800">{item.category}</Badge>
                    </div>
                    <div className="text-sm text-red-700 mb-2">
                      <strong>Concern:</strong> {item.concern}
                    </div>
                    <div className="text-sm text-blue-700">
                      <strong>Alternative:</strong> {item.alternative}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
