
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  Truck,
  Scan
} from 'lucide-react';

export const SpecimenCollection = () => {
  const [selectedRequisitions, setSelectedRequisitions] = useState<string[]>([]);

  const pendingCollections = [
    {
      id: 'REQ001234',
      patient: 'John Smith',
      room: 'ER-101',
      tests: ['CBC', 'BMP', 'Lipid Panel'],
      priority: 'routine',
      scheduledTime: '09:00',
      collectorAssigned: 'Alice Johnson',
      specimenType: 'Blood',
      fasting: true,
      status: 'scheduled'
    },
    {
      id: 'REQ001235',
      patient: 'Emily Davis',
      room: 'ICU-205',
      tests: ['Troponin I', 'BNP'],
      priority: 'stat',
      scheduledTime: '08:30',
      collectorAssigned: 'Mike Chen',
      specimenType: 'Blood',
      fasting: false,
      status: 'in_transit'
    },
    {
      id: 'REQ001236',
      patient: 'Robert Wilson',
      room: 'Ward-315',
      tests: ['Urine Culture'],
      priority: 'urgent',
      scheduledTime: '10:15',
      collectorAssigned: 'Sarah Park',
      specimenType: 'Urine',
      fasting: false,
      status: 'collected'
    }
  ];

  const chainOfCustody = [
    { time: '08:30', event: 'Specimen collected', location: 'ICU-205', person: 'Mike Chen', verified: true },
    { time: '08:35', event: 'Specimen labeled', location: 'ICU-205', person: 'Mike Chen', verified: true },
    { time: '08:45', event: 'Transport initiated', location: 'ICU-205', person: 'Mike Chen', verified: true },
    { time: '08:50', event: 'Received in lab', location: 'Main Lab', person: 'Lab Tech Adams', verified: true },
    { time: '09:00', event: 'Processing started', location: 'Chemistry Lab', person: 'Sarah Johnson', verified: false }
  ];

  const collectionSchedule = [
    { time: '08:00', collector: 'Alice Johnson', locations: ['ER-101', 'ER-103'], specimens: 3 },
    { time: '08:30', collector: 'Mike Chen', locations: ['ICU-205', 'ICU-207'], specimens: 2 },
    { time: '09:00', collector: 'Sarah Park', locations: ['Ward-315', 'Ward-318'], specimens: 4 },
    { time: '09:30', collector: 'David Kim', locations: ['Clinic-A', 'Clinic-B'], specimens: 5 },
    { time: '10:00', collector: 'Lisa Wang', locations: ['OR-2', 'Recovery-1'], specimens: 2 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Specimen Collection</h2>
          <p className="text-gray-600">Manage specimen collection workflow and chain of custody</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan Collection
          </Button>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Route
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Collection Queue</CardTitle>
              <CardDescription>Pending specimen collections and current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCollections.map((collection, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedRequisitions.includes(collection.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRequisitions([...selectedRequisitions, collection.id]);
                            } else {
                              setSelectedRequisitions(selectedRequisitions.filter(id => id !== collection.id));
                            }
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{collection.id}</h4>
                          <p className="text-sm text-gray-600">{collection.patient}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          collection.priority === 'stat' ? 'bg-red-500' :
                          collection.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                        } text-white`}>
                          {collection.priority}
                        </Badge>
                        <Badge className={`${
                          collection.status === 'collected' ? 'bg-green-500' :
                          collection.status === 'in_transit' ? 'bg-purple-500' : 'bg-gray-500'
                        } text-white`}>
                          {collection.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Room</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {collection.room}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Scheduled</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {collection.scheduledTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Collector</p>
                        <p className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {collection.collectorAssigned}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Specimen</p>
                        <p className="font-medium">{collection.specimenType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Tests: {collection.tests.join(', ')}</span>
                        {collection.fasting && (
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Fasting Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {collection.status === 'scheduled' && (
                          <Button size="sm">
                            Start Collection
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chain of Custody & Schedule */}
        <div className="space-y-6">
          {/* Chain of Custody */}
          <Card>
            <CardHeader>
              <CardTitle>Chain of Custody</CardTitle>
              <CardDescription>Tracking for REQ001235</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chainOfCustody.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.verified ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      {index < chainOfCustody.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{event.event}</p>
                        {event.verified && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-xs text-gray-600">{event.person}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Schedule</CardTitle>
              <CardDescription>Today's collection routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collectionSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{schedule.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{schedule.collector}</p>
                      <p className="text-xs text-gray-500">
                        {schedule.locations.join(', ')} • {schedule.specimens} specimens
                      </p>
                    </div>
                    <Truck className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Fasting Specimens</p>
                    <p className="text-gray-600">Verify 8-12 hour fasting status before collection</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Patient Identification</p>
                    <p className="text-gray-600">Always verify patient ID with two identifiers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Labeling Requirements</p>
                    <p className="text-gray-600">Label specimens immediately after collection</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
