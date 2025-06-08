
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Bell
} from 'lucide-react';

export const RadiologyScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-08');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const scheduledExams = [
    {
      id: 'EX001',
      time: '08:00',
      patient: 'John Doe',
      mrn: 'MRN001234',
      study: 'CT Chest with Contrast',
      modality: 'CT',
      room: 'CT-1',
      priority: 'Routine',
      duration: 30,
      preparation: 'NPO 4 hours, IV contrast',
      technologist: 'Sarah Johnson',
      status: 'Scheduled',
      insurance: 'Medicare'
    },
    {
      id: 'EX002',
      time: '08:30',
      patient: 'Jane Smith',
      mrn: 'MRN002345',
      study: 'MRI Brain without Contrast',
      modality: 'MR',
      room: 'MRI-1',
      priority: 'Urgent',
      duration: 45,
      preparation: 'Remove all metal objects, MRI safety screening',
      technologist: 'Mike Wilson',
      status: 'Confirmed',
      insurance: 'Blue Cross'
    },
    {
      id: 'EX003',
      time: '09:00',
      patient: 'Robert Brown',
      mrn: 'MRN003456',
      study: 'Chest X-Ray PA/Lateral',
      modality: 'XR',
      room: 'XR-1',
      priority: 'STAT',
      duration: 15,
      preparation: 'Remove clothing from waist up',
      technologist: 'Lisa Davis',
      status: 'In Progress',
      insurance: 'Aetna'
    },
    {
      id: 'EX004',
      time: '09:15',
      patient: 'Emily Wilson',
      mrn: 'MRN004567',
      study: 'Abdominal Ultrasound',
      modality: 'US',
      room: 'US-1',
      priority: 'Routine',
      duration: 30,
      preparation: 'NPO 8 hours, full bladder',
      technologist: 'David Lee',
      status: 'Waiting',
      insurance: 'United Healthcare'
    }
  ];

  const availableSlots = [
    { time: '10:00', modality: 'CT', room: 'CT-1', duration: 30 },
    { time: '10:30', modality: 'CT', room: 'CT-2', duration: 30 },
    { time: '11:00', modality: 'MR', room: 'MRI-1', duration: 45 },
    { time: '11:30', modality: 'XR', room: 'XR-1', duration: 15 },
    { time: '12:00', modality: 'US', room: 'US-1', duration: 30 }
  ];

  const resourceUtilization = [
    { resource: 'CT-1', scheduled: 8, capacity: 12, utilization: 67 },
    { resource: 'CT-2', scheduled: 6, capacity: 12, utilization: 50 },
    { resource: 'MRI-1', scheduled: 9, capacity: 10, utilization: 90 },
    { resource: 'XR-1', scheduled: 15, capacity: 20, utilization: 75 },
    { resource: 'US-1', scheduled: 7, capacity: 10, utilization: 70 }
  ];

  const waitingList = [
    {
      patient: 'Mark Johnson',
      study: 'CT Abdomen/Pelvis',
      priority: 'Urgent',
      waitingSince: '2 days',
      preferredTime: 'Morning'
    },
    {
      patient: 'Susan Davis',
      study: 'MRI Spine',
      priority: 'Routine',
      waitingSince: '5 days',
      preferredTime: 'Afternoon'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Radiology Scheduling</h3>
          <p className="text-gray-600">Exam scheduling with resource optimization and patient preparation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Date and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="modality">Modality</Label>
              <select
                id="modality"
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Modalities</option>
                <option value="CT">CT</option>
                <option value="MR">MRI</option>
                <option value="XR">X-Ray</option>
                <option value="US">Ultrasound</option>
              </select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="STAT">STAT</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Grid */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Schedule - {selectedDate}</CardTitle>
              <CardDescription>Scheduled exams with patient preparation instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledExams.map((exam, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-lg">{exam.time}</span>
                        <Badge variant="outline" className={`${
                          exam.modality === 'CT' ? 'border-blue-500 text-blue-700' :
                          exam.modality === 'MR' ? 'border-purple-500 text-purple-700' :
                          exam.modality === 'XR' ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                        }`}>
                          {exam.modality}
                        </Badge>
                        <Badge variant="outline" className={`${
                          exam.priority === 'STAT' ? 'border-red-500 text-red-700' :
                          exam.priority === 'Urgent' ? 'border-orange-500 text-orange-700' : 'border-gray-500 text-gray-700'
                        }`}>
                          {exam.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{exam.patient}</h4>
                        <p className="text-sm text-gray-600">MRN: {exam.mrn}</p>
                        <p className="text-sm text-gray-600">{exam.study}</p>
                        <p className="text-sm text-gray-600">Room: {exam.room} • {exam.duration} min</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tech: {exam.technologist}</p>
                        <p className="text-sm text-gray-600">Insurance: {exam.insurance}</p>
                        <p className="text-sm font-medium text-blue-600">Prep: {exam.preparation}</p>
                        <Badge className={`mt-1 ${
                          exam.status === 'Scheduled' ? 'bg-blue-500' :
                          exam.status === 'Confirmed' ? 'bg-green-500' :
                          exam.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}>
                          {exam.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>Open slots for same-day scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableSlots.map((slot, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50 hover:bg-green-100 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-900">{slot.time}</p>
                        <p className="text-sm text-green-700">{slot.modality} - {slot.room}</p>
                        <p className="text-xs text-green-600">{slot.duration} min slot</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Utilization & Waiting List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>Equipment capacity and scheduling optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resourceUtilization.map((resource, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{resource.resource}</span>
                      <span className="text-sm text-gray-600">{resource.utilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          resource.utilization >= 90 ? 'bg-red-500' :
                          resource.utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${resource.utilization}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {resource.scheduled}/{resource.capacity} slots scheduled
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waiting List</CardTitle>
              <CardDescription>Patients awaiting scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waitingList.map((patient, index) => (
                  <div key={index} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-orange-900">{patient.patient}</h5>
                      <Badge variant="outline" className={`${
                        patient.priority === 'Urgent' ? 'border-red-500 text-red-700' : 'border-gray-500 text-gray-700'
                      }`}>
                        {patient.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700">{patient.study}</p>
                    <p className="text-xs text-orange-600">Waiting: {patient.waitingSince}</p>
                    <p className="text-xs text-orange-600">Prefers: {patient.preferredTime}</p>
                    <Button size="sm" className="mt-2 w-full bg-orange-600 hover:bg-orange-700">
                      Schedule Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
