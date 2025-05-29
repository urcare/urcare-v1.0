
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Video, Play, Pause, Download, Eye, Calendar, Clock, User, FileText } from 'lucide-react';

export const OTVideoRecordingLog = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRecording, setIsRecording] = useState(false);

  const videoRecordings = [
    { 
      id: 1, 
      title: 'CABG - John Doe', 
      surgeon: 'Dr. Smith', 
      date: '2024-01-15', 
      startTime: '09:00', 
      endTime: '13:30', 
      duration: '4h 30m', 
      room: 'OT-1', 
      status: 'completed',
      fileSize: '2.4 GB',
      quality: '4K',
      purpose: 'Training & Documentation'
    },
    { 
      id: 2, 
      title: 'Hip Replacement - Jane Smith', 
      surgeon: 'Dr. Johnson', 
      date: '2024-01-14', 
      startTime: '08:00', 
      endTime: '11:00', 
      duration: '3h 00m', 
      room: 'OT-2', 
      status: 'completed',
      fileSize: '1.8 GB',
      quality: '1080p',
      purpose: 'Documentation'
    },
    { 
      id: 3, 
      title: 'Appendectomy - Mike Wilson', 
      surgeon: 'Dr. Brown', 
      date: '2024-01-15', 
      startTime: '14:00', 
      endTime: '16:00', 
      duration: '2h 00m', 
      room: 'OT-3', 
      status: 'processing',
      fileSize: '1.2 GB',
      quality: '1080p',
      purpose: 'Training'
    },
    { 
      id: 4, 
      title: 'Neurosurgery - Sarah Davis', 
      surgeon: 'Dr. Williams', 
      date: '2024-01-16', 
      startTime: '10:00', 
      endTime: '', 
      duration: '1h 45m (ongoing)', 
      room: 'OT-4', 
      status: 'recording',
      fileSize: '0.8 GB',
      quality: '4K',
      purpose: 'Research & Training'
    },
  ];

  const activeRecordings = videoRecordings.filter(recording => recording.status === 'recording');
  const completedRecordings = videoRecordings.filter(recording => recording.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording': return 'bg-red-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredRecordings = selectedFilter === 'all' 
    ? videoRecordings 
    : videoRecordings.filter(recording => recording.status === selectedFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6 text-cyan-600" />
          OT Video Recording Log
        </h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Video className="h-4 w-4 mr-2" />
                New Recording
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Recording</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Surgery Title</Label>
                  <Input placeholder="Enter surgery title" />
                </div>
                <div>
                  <Label>Surgeon</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgeon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                      <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operating Room</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ot-1">OT-1</SelectItem>
                      <SelectItem value="ot-2">OT-2</SelectItem>
                      <SelectItem value="ot-3">OT-3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recording Purpose</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="both">Training & Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Video Quality</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea placeholder="Enter any special recording requirements" rows={3} />
                </div>
                <Button className="w-full">Schedule Recording</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            onClick={() => setIsRecording(!isRecording)}
            className={isRecording ? 'border-red-500 text-red-600' : ''}
          >
            {isRecording ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Label>Filter by Status:</Label>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recordings</SelectItem>
            <SelectItem value="recording">Currently Recording</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Video className="h-5 w-5" />
              Active Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {activeRecordings.length}
            </div>
            <p className="text-gray-600">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedRecordings.filter(r => r.date === '2024-01-15').length}
            </div>
            <p className="text-gray-600">Ready for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Total Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              6.2 GB
            </div>
            <p className="text-gray-600">Used this month</p>
          </CardContent>
        </Card>
      </div>

      {isRecording && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-800 font-semibold">RECORDING IN PROGRESS</span>
              <Badge className="bg-red-500">LIVE</Badge>
              <span className="text-red-600 ml-auto">Duration: 00:45:32</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recording History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecordings.map(recording => (
              <div key={recording.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{recording.title}</h3>
                    <Badge className={getStatusColor(recording.status)}>
                      {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {recording.status === 'completed' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    {recording.status === 'recording' && (
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Pause className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Surgeon:</span> {recording.surgeon}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span> {recording.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Duration:</span> {recording.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Room:</span> {recording.room}
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Quality:</span> {recording.quality}
                    </div>
                    <div>
                      <span className="font-medium">File Size:</span> {recording.fileSize}
                    </div>
                    <div>
                      <span className="font-medium">Purpose:</span> {recording.purpose}
                    </div>
                  </div>
                  {recording.startTime && (
                    <div className="mt-2 text-xs text-gray-600">
                      Started: {recording.startTime} {recording.endTime && `| Ended: ${recording.endTime}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
