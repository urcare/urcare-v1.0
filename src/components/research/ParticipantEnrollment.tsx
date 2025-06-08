
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface Participant {
  id: string;
  subjectId: string;
  initials: string;
  age: number;
  gender: string;
  enrollmentDate: string;
  studyArm: string;
  status: 'screening' | 'enrolled' | 'active' | 'completed' | 'withdrawn';
  visitProgress: number;
  lastVisit: string;
  nextVisit: string;
  protocol: string;
}

export const ParticipantEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStudy, setFilterStudy] = useState('all');
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const participants: Participant[] = [
    {
      id: '1',
      subjectId: 'CARDIO-001-001',
      initials: 'J.D.',
      age: 65,
      gender: 'Male',
      enrollmentDate: '2024-01-15',
      studyArm: 'Treatment A',
      status: 'active',
      visitProgress: 75,
      lastVisit: '2024-01-20',
      nextVisit: '2024-02-20',
      protocol: 'CARDIO-001'
    },
    {
      id: '2',
      subjectId: 'CARDIO-001-002',
      initials: 'M.S.',
      age: 58,
      gender: 'Female',
      enrollmentDate: '2024-01-18',
      studyArm: 'Placebo',
      status: 'active',
      visitProgress: 50,
      lastVisit: '2024-01-25',
      nextVisit: '2024-02-25',
      protocol: 'CARDIO-001'
    },
    {
      id: '3',
      subjectId: 'NEURO-002-001',
      initials: 'R.T.',
      age: 42,
      gender: 'Male',
      enrollmentDate: '2024-01-10',
      studyArm: 'Treatment B',
      status: 'screening',
      visitProgress: 25,
      lastVisit: '2024-01-10',
      nextVisit: '2024-02-10',
      protocol: 'NEURO-002'
    }
  ];

  const enrollmentStats = {
    totalParticipants: 847,
    activeStudies: 12,
    screeningFailed: 156,
    enrolled: 691,
    completed: 234,
    withdrawn: 45
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'screening': return <Clock className="h-4 w-4" />;
      case 'enrolled': return <UserCheck className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'withdrawn': return <UserX className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      screening: 'bg-yellow-500',
      enrolled: 'bg-blue-500',
      active: 'bg-green-500',
      completed: 'bg-purple-500',
      withdrawn: 'bg-red-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.initials.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || participant.status === filterStatus;
    const matchesStudy = filterStudy === 'all' || participant.protocol === filterStudy;
    return matchesSearch && matchesStatus && matchesStudy;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Participant Enrollment</h2>
          <p className="text-gray-600">Manage research participant enrollment and tracking</p>
        </div>
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Enroll Participant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enroll New Participant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject-id">Subject ID</Label>
                  <Input id="subject-id" placeholder="Auto-generated" readOnly />
                </div>
                <div>
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio-001">CARDIO-001</SelectItem>
                      <SelectItem value="neuro-002">NEURO-002</SelectItem>
                      <SelectItem value="onco-003">ONCO-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="initials">Initials</Label>
                  <Input id="initials" placeholder="e.g., J.D." />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Age" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="study-arm">Study Arm</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Randomization will assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treatment-a">Treatment A</SelectItem>
                    <SelectItem value="treatment-b">Treatment B</SelectItem>
                    <SelectItem value="placebo">Placebo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEnrollDialogOpen(false)}>
                  Enroll Participant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{enrollmentStats.totalParticipants}</p>
            <p className="text-sm text-blue-700">Total Participants</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{enrollmentStats.enrolled}</p>
            <p className="text-sm text-green-700">Enrolled</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{enrollmentStats.completed}</p>
            <p className="text-sm text-purple-700">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{enrollmentStats.screeningFailed}</p>
            <p className="text-sm text-yellow-700">Screen Failed</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{enrollmentStats.withdrawn}</p>
            <p className="text-sm text-red-700">Withdrawn</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{enrollmentStats.activeStudies}</p>
            <p className="text-sm text-teal-700">Active Studies</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStudy} onValueChange={setFilterStudy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Studies</SelectItem>
                <SelectItem value="CARDIO-001">CARDIO-001</SelectItem>
                <SelectItem value="NEURO-002">NEURO-002</SelectItem>
                <SelectItem value="ONCO-003">ONCO-003</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="grid gap-4">
        {filteredParticipants.map((participant) => (
          <Card key={participant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{participant.subjectId}</h3>
                    <Badge className={`${getStatusColor(participant.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(participant.status)}
                      {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Initials:</span>
                      <p className="text-gray-600">{participant.initials}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Age/Gender:</span>
                      <p className="text-gray-600">{participant.age}yr {participant.gender}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Study Arm:</span>
                      <p className="text-gray-600">{participant.studyArm}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Enrollment:</span>
                      <p className="text-gray-600">{participant.enrollmentDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Visit:</span>
                      <p className="text-gray-600">{participant.lastVisit}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Next Visit:</span>
                      <p className="text-gray-600">{participant.nextVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Visit Progress:</span>
                    <Progress value={participant.visitProgress} className="flex-1 max-w-xs" />
                    <span className="text-sm text-gray-600">{participant.visitProgress}%</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
