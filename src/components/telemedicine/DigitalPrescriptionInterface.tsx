
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill,
  Plus,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  Calendar,
  Search,
  FileText,
  Package,
  Phone
} from 'lucide-react';

export const DigitalPrescriptionInterface = () => {
  const [selectedMedication, setSelectedMedication] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const recentPrescriptions = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      medication: 'Metformin 500mg',
      dosage: 'Twice daily with meals',
      quantity: '90 tablets',
      refills: 2,
      status: 'delivered',
      prescribedDate: '2024-06-05',
      pharmacyStatus: 'filled',
      deliveryTracking: 'PKG123456789'
    },
    {
      id: 2,
      patient: 'Michael Chen',
      medication: 'Lisinopril 10mg',
      dosage: 'Once daily',
      quantity: '30 tablets',
      refills: 5,
      status: 'in-transit',
      prescribedDate: '2024-06-08',
      pharmacyStatus: 'filled',
      deliveryTracking: 'PKG987654321'
    },
    {
      id: 3,
      patient: 'Emily Davis',
      medication: 'Sertraline 50mg',
      dosage: 'Once daily in morning',
      quantity: '30 tablets',
      refills: 3,
      status: 'pending',
      prescribedDate: '2024-06-09',
      pharmacyStatus: 'processing',
      deliveryTracking: null
    }
  ];

  const medicationDatabase = [
    {
      name: 'Metformin',
      strength: ['500mg', '850mg', '1000mg'],
      type: 'Tablet',
      category: 'Diabetes',
      interactions: ['Alcohol', 'Iodinated contrast'],
      contraindications: ['Kidney disease', 'Liver disease']
    },
    {
      name: 'Lisinopril',
      strength: ['5mg', '10mg', '20mg'],
      type: 'Tablet',
      category: 'Hypertension',
      interactions: ['NSAIDs', 'Potassium supplements'],
      contraindications: ['Pregnancy', 'Angioedema history']
    },
    {
      name: 'Sertraline',
      strength: ['25mg', '50mg', '100mg'],
      type: 'Tablet',
      category: 'Antidepressant',
      interactions: ['MAOIs', 'Warfarin'],
      contraindications: ['MAOI use within 14 days']
    }
  ];

  const adherenceData = [
    {
      patient: 'Sarah Johnson',
      medication: 'Metformin 500mg',
      adherenceRate: 95,
      missedDoses: 3,
      lastTaken: '2024-06-09 08:00 AM',
      nextDue: '2024-06-09 08:00 PM',
      trend: 'improving'
    },
    {
      patient: 'Michael Chen',
      medication: 'Lisinopril 10mg',
      adherenceRate: 88,
      missedDoses: 7,
      lastTaken: '2024-06-09 07:30 AM',
      nextDue: '2024-06-10 07:30 AM',
      trend: 'stable'
    },
    {
      patient: 'Emily Davis',
      medication: 'Sertraline 50mg',
      adherenceRate: 92,
      missedDoses: 4,
      lastTaken: '2024-06-09 09:00 AM',
      nextDue: '2024-06-10 09:00 AM',
      trend: 'improving'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declining': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="prescribe" className="w-full">
        <TabsList>
          <TabsTrigger value="prescribe">New Prescription</TabsTrigger>
          <TabsTrigger value="tracking">Delivery Tracking</TabsTrigger>
          <TabsTrigger value="adherence">Adherence Monitoring</TabsTrigger>
          <TabsTrigger value="history">Prescription History</TabsTrigger>
        </TabsList>

        <TabsContent value="prescribe" className="space-y-4">
          {/* New Prescription Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Create New Prescription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search patient by name or ID..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Medication Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search medication..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dosage Instructions</label>
                    <Input placeholder="e.g., Take 1 tablet twice daily with meals" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <Input placeholder="e.g., 30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Refills</label>
                      <Input placeholder="e.g., 3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medication Database</label>
                    <div className="max-h-64 overflow-y-auto border rounded-lg">
                      {medicationDatabase
                        .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((medication, index) => (
                        <div key={index} className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                             onClick={() => setSelectedMedication(medication.name)}>
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-gray-600">{medication.type} - {medication.category}</div>
                          <div className="text-xs text-gray-500">
                            Strengths: {medication.strength.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedMedication && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-2">Drug Information</div>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Interactions:</span> Monitor for drug interactions</div>
                        <div><span className="font-medium">Contraindications:</span> Check patient history</div>
                        <div><span className="font-medium">Dosing:</span> Follow manufacturer guidelines</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Pharmacy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          {/* Delivery Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Prescription Delivery Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{prescription.patient}</div>
                        <div className="text-sm text-gray-600">{prescription.medication}</div>
                      </div>
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Prescribed:</div>
                        <div>{prescription.prescribedDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Pharmacy Status:</div>
                        <div className="capitalize">{prescription.pharmacyStatus}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Tracking Number:</div>
                        <div>{prescription.deliveryTracking || 'Not available'}</div>
                      </div>
                    </div>

                    {prescription.deliveryTracking && (
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Package className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Patient
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adherence" className="space-y-4">
          {/* Medication Adherence Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Medication Adherence Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adherenceData.map((patient, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{patient.patient}</div>
                        <div className="text-sm text-gray-600">{patient.medication}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(patient.trend)}
                        <span className={`text-2xl font-bold ${getAdherenceColor(patient.adherenceRate)}`}>
                          {patient.adherenceRate}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Missed Doses:</div>
                        <div className="font-medium text-red-600">{patient.missedDoses}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Last Taken:</div>
                        <div>{patient.lastTaken}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Next Due:</div>
                        <div>{patient.nextDue}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Trend:</div>
                        <div className="capitalize">{patient.trend}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        Send Reminder
                      </Button>
                      <Button variant="outline" size="sm">
                        Adjust Schedule
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Prescription History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Pill className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{prescription.patient}</div>
                        <div className="text-sm text-gray-600">{prescription.medication}</div>
                        <div className="text-xs text-gray-500">{prescription.dosage}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Quantity: {prescription.quantity}</div>
                        <div className="text-sm text-gray-600">Refills: {prescription.refills}</div>
                        <div className="text-xs text-gray-500">{prescription.prescribedDate}</div>
                      </div>
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
