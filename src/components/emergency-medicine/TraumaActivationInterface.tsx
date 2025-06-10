
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  Users,
  Truck,
  Activity,
  Timer
} from 'lucide-react';

export const TraumaActivationInterface = () => {
  const [activeTraumas, setActiveTraumas] = useState([
    {
      id: 1,
      level: 1,
      eta: '5 min',
      mechanism: 'Motor vehicle accident',
      status: 'en-route',
      teamNotified: true,
      timestamp: '15:42'
    }
  ]);

  const traumaTeam = [
    { role: 'Trauma Surgeon', name: 'Dr. Sarah Martinez', status: 'notified', eta: '2 min' },
    { role: 'Emergency Physician', name: 'Dr. Michael Chen', status: 'present', eta: 'Ready' },
    { role: 'Anesthesiologist', name: 'Dr. Lisa Johnson', status: 'en-route', eta: '3 min' },
    { role: 'Trauma Nurse', name: 'RN Amy Wilson', status: 'present', eta: 'Ready' },
    { role: 'RT', name: 'Jake Thompson', status: 'present', eta: 'Ready' },
    { role: 'Radiology Tech', name: 'Maria Garcia', status: 'notified', eta: '5 min' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'en-route': return 'bg-yellow-100 text-yellow-800';
      case 'notified': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Active Trauma Alert</AlertTitle>
        <AlertDescription>
          Level 1 trauma activation in progress. ETA: 5 minutes. All team members have been notified.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Incoming Trauma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTraumas.map((trauma) => (
                <Card key={trauma.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-red-600 text-white">
                          Level {trauma.level} Trauma
                        </Badge>
                        <Badge className={getStatusColor(trauma.status)}>
                          {trauma.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">Mechanism of Injury:</p>
                        <p className="text-sm text-gray-600">{trauma.mechanism}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ETA:</span> {trauma.eta}
                        </div>
                        <div>
                          <span className="font-medium">Alert Time:</span> {trauma.timestamp}
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Trauma Team Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {traumaTeam.map((member, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{member.role}</div>
                    <div className="text-sm text-gray-600">{member.name}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{member.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
