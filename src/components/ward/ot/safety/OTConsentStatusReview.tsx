
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, CheckCircle, AlertCircle, Clock, User, FileText } from 'lucide-react';

export const OTConsentStatusReview = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    {
      id: 1,
      patient: 'John Doe',
      procedure: 'CABG',
      date: '2024-01-15',
      room: 'OT-1',
      surgeon: 'Dr. Smith',
      consents: {
        surgical: { status: 'completed', signedBy: 'Patient', time: '08:30', witness: 'Nurse Johnson' },
        anesthesia: { status: 'completed', signedBy: 'Patient', time: '08:35', witness: 'Dr. Wilson' },
        blood: { status: 'completed', signedBy: 'Patient', time: '08:40', witness: 'Nurse Johnson' },
        imaging: { status: 'not_required', signedBy: '', time: '', witness: '' },
        research: { status: 'declined', signedBy: 'Patient', time: '08:45', witness: 'Dr. Smith' }
      }
    },
    {
      id: 2,
      patient: 'Jane Smith',
      procedure: 'Hip Replacement',
      date: '2024-01-15',
      room: 'OT-2',
      surgeon: 'Dr. Johnson',
      consents: {
        surgical: { status: 'completed', signedBy: 'Patient', time: '07:30', witness: 'Nurse Davis' },
        anesthesia: { status: 'pending', signedBy: '', time: '', witness: '' },
        blood: { status: 'completed', signedBy: 'Guardian', time: '07:45', witness: 'Nurse Davis' },
        imaging: { status: 'completed', signedBy: 'Patient', time: '07:50', witness: 'Dr. Johnson' },
        research: { status: 'not_applicable', signedBy: '', time: '', witness: '' }
      }
    },
    {
      id: 3,
      patient: 'Mike Wilson',
      procedure: 'Appendectomy',
      date: '2024-01-14',
      room: 'OT-3',
      surgeon: 'Dr. Brown',
      consents: {
        surgical: { status: 'completed', signedBy: 'Guardian', time: '13:30', witness: 'Nurse Taylor' },
        anesthesia: { status: 'completed', signedBy: 'Guardian', time: '13:35', witness: 'Dr. Lee' },
        blood: { status: 'declined', signedBy: 'Guardian', time: '13:40', witness: 'Nurse Taylor' },
        imaging: { status: 'not_required', signedBy: '', time: '', witness: '' },
        research: { status: 'not_applicable', signedBy: '', time: '', witness: '' }
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'declined': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <span className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_required': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'not_applicable': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionPercentage = (consents: any) => {
    const required = Object.values(consents).filter((c: any) => 
      c.status !== 'not_required' && c.status !== 'not_applicable'
    ).length;
    const completed = Object.values(consents).filter((c: any) => 
      c.status === 'completed'
    ).length;
    return required > 0 ? Math.round((completed / required) * 100) : 100;
  };

  const filteredPatients = patients.filter(patient =>
    patient.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.procedure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          OT Consent Status Review
        </h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button className="bg-blue-600 hover:bg-blue-700">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPatients.map(patient => (
          <Card key={patient.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {patient.patient}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{patient.procedure} - {patient.room}</p>
                  <p className="text-sm text-blue-600">{patient.surgeon} | {patient.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {getCompletionPercentage(patient.consents)}%
                  </div>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(patient.consents).map(([type, consent]: [string, any]) => (
                    <div key={type} className={`border rounded-lg p-3 ${getStatusColor(consent.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm capitalize">{type} Consent</h4>
                        {getStatusIcon(consent.status)}
                      </div>
                      <Badge className={`text-xs ${getStatusColor(consent.status)}`}>
                        {consent.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {consent.status === 'completed' && (
                        <div className="mt-2 text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>By: {consent.signedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>At: {consent.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>Witness: {consent.witness}</span>
                          </div>
                        </div>
                      )}
                      {consent.status === 'pending' && (
                        <Button size="sm" className="w-full mt-2 text-xs">
                          Complete Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-sm font-medium">All required consents verified and documented</span>
                  </div>
                  <Button size="sm" disabled={getCompletionPercentage(patient.consents) !== 100}>
                    Mark Ready for Surgery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consent Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {patients.filter(p => getCompletionPercentage(p.consents) === 100).length}
              </div>
              <p className="text-sm text-green-800">Fully Consented</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {patients.filter(p => {
                  const completion = getCompletionPercentage(p.consents);
                  return completion > 0 && completion < 100;
                }).length}
              </div>
              <p className="text-sm text-yellow-800">Partial Consent</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {patients.filter(p => 
                  Object.values(p.consents).some((c: any) => c.status === 'pending')
                ).length}
              </div>
              <p className="text-sm text-red-800">Pending</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <p className="text-sm text-blue-800">Total Cases</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
