
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar, Activity, Merge, Filter, Search, Clock } from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: 'OP' | 'IP';
  date: string;
  department: string;
  doctor: string;
  diagnosis: string;
  procedures: string[];
  medications: string[];
  notes: string;
  status: 'active' | 'completed' | 'pending';
  priority: 'routine' | 'urgent' | 'emergency';
}

interface PatientRecords {
  patientId: string;
  patientName: string;
  mrn: string;
  records: MedicalRecord[];
  lastMerged: string;
  conflicts: string[];
}

const mockPatientRecords: PatientRecords = {
  patientId: 'W001',
  patientName: 'John Smith',
  mrn: 'MRN-12345',
  lastMerged: '2024-01-22 08:00',
  conflicts: ['Medication dosage discrepancy between OP and IP records'],
  records: [
    {
      id: 'IP001',
      type: 'IP',
      date: '2024-01-18',
      department: 'General Medicine',
      doctor: 'Dr. Johnson',
      diagnosis: 'Pneumonia',
      procedures: ['Chest X-ray', 'Blood culture', 'Sputum analysis'],
      medications: ['Amoxicillin 500mg TID', 'Albuterol inhaler PRN'],
      notes: 'Patient admitted with acute pneumonia. Responding well to antibiotic therapy. O2 saturation improving.',
      status: 'active',
      priority: 'urgent'
    },
    {
      id: 'OP001',
      type: 'OP',
      date: '2024-01-15',
      department: 'Emergency',
      doctor: 'Dr. Smith',
      diagnosis: 'Upper respiratory infection',
      procedures: ['Physical examination', 'Rapid strep test'],
      medications: ['Amoxicillin 250mg BID', 'Cough suppressant'],
      notes: 'Patient presented with cough and fever. Prescribed antibiotics. Follow-up in 1 week if symptoms persist.',
      status: 'completed',
      priority: 'routine'
    },
    {
      id: 'OP002',
      type: 'OP',
      date: '2024-01-10',
      department: 'Cardiology',
      doctor: 'Dr. Brown',
      diagnosis: 'Hypertension follow-up',
      procedures: ['EKG', 'Blood pressure monitoring'],
      medications: ['Lisinopril 10mg daily', 'Hydrochlorothiazide 25mg daily'],
      notes: 'Blood pressure well controlled. Continue current medications. Next appointment in 3 months.',
      status: 'completed',
      priority: 'routine'
    },
    {
      id: 'IP002',
      type: 'IP',
      date: '2024-01-19',
      department: 'Pulmonology',
      doctor: 'Dr. Wilson',
      diagnosis: 'Pneumonia - Specialist consultation',
      procedures: ['Pulmonary function test', 'CT chest'],
      medications: ['Azithromycin 500mg daily', 'Prednisone 20mg daily'],
      notes: 'Specialist review for pneumonia management. Recommended steroid therapy. Monitor for improvement.',
      status: 'completed',
      priority: 'urgent'
    }
  ]
};

export const OPIPRecordMerger = () => {
  const [patientRecords, setPatientRecords] = useState<PatientRecords>(mockPatientRecords);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [mergedView, setMergedView] = useState<boolean>(false);

  const getTypeColor = (type: string) => {
    return type === 'OP' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredRecords = patientRecords.records.filter(record => {
    const typeMatch = filterType === 'all' || record.type === filterType;
    const deptMatch = filterDepartment === 'all' || record.department === filterDepartment;
    return typeMatch && deptMatch;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const departments = [...new Set(patientRecords.records.map(r => r.department))];

  const mergeRecords = () => {
    setMergedView(!mergedView);
  };

  const getMergedTimeline = () => {
    const grouped = patientRecords.records.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {} as { [key: string]: MedicalRecord[] });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            OP/IP Record Merger - {patientRecords.patientName}
          </CardTitle>
          <CardDescription>
            Comprehensive view merging outpatient and inpatient records for {patientRecords.mrn}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patientRecords.conflicts.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                ⚠️ Record Conflicts Detected
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {patientRecords.conflicts.map((conflict, index) => (
                  <li key={index}>{conflict}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="OP">Outpatient</SelectItem>
                <SelectItem value="IP">Inpatient</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={mergeRecords}
              variant={mergedView ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Merge className="h-4 w-4" />
              {mergedView ? 'Merged Timeline' : 'Separate Records'}
            </Button>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="summary">Clinical Summary</TabsTrigger>
              <TabsTrigger value="medications">Medication History</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              {mergedView ? (
                <div className="space-y-4">
                  {getMergedTimeline().map(([date, records]) => (
                    <Card key={date} className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {date}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {records.map((record) => (
                            <div key={record.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={getTypeColor(record.type)}>
                                    {record.type}
                                  </Badge>
                                  <Badge variant="outline">{record.department}</Badge>
                                  <Badge className={getPriorityColor(record.priority)}>
                                    {record.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <Badge className={getStatusColor(record.status)}>
                                  {record.status.toUpperCase()}
                                </Badge>
                              </div>
                              <h4 className="font-semibold">{record.diagnosis}</h4>
                              <p className="text-sm text-gray-600 mb-2">Dr. {record.doctor}</p>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedRecords.map((record) => (
                    <Card key={record.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(record.type)}>
                              {record.type}
                            </Badge>
                            <Badge variant="outline">{record.department}</Badge>
                            <Badge className={getPriorityColor(record.priority)}>
                              {record.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(record.status)}>
                              {record.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">{record.date}</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg mb-2">{record.diagnosis}</h3>
                        <p className="text-sm text-gray-600 mb-3">Dr. {record.doctor}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Procedures:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {record.procedures.map((procedure, index) => (
                                <li key={index}>{procedure}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Medications:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {record.medications.map((medication, index) => (
                                <li key={index}>{medication}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Clinical Notes:</h4>
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Active Diagnoses</h4>
                      <ul className="space-y-2">
                        {patientRecords.records
                          .filter(r => r.status === 'active')
                          .map(record => (
                            <li key={record.id} className="flex items-center gap-2">
                              <Badge className={getTypeColor(record.type)} variant="secondary">
                                {record.type}
                              </Badge>
                              <span className="text-sm">{record.diagnosis}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Care Team</h4>
                      <ul className="space-y-1">
                        {[...new Set(patientRecords.records.map(r => `${r.doctor} (${r.department})`))].map((doctor, index) => (
                          <li key={index} className="text-sm">{doctor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medication History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patientRecords.records
                      .flatMap(record => record.medications.map(med => ({ ...record, medication: med })))
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={getTypeColor(item.type)} variant="secondary">
                              {item.type}
                            </Badge>
                            <span className="font-medium">{item.medication}</span>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>{item.date}</div>
                            <div>{item.doctor}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Last merged: {patientRecords.lastMerged} | Total records: {patientRecords.records.length}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Merged Record
              </Button>
              <Button size="sm">
                Generate Care Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
