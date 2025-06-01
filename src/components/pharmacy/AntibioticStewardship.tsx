
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Microscope,
  Calendar,
  Search
} from 'lucide-react';

interface StewardshipEntry {
  id: string;
  patient: {
    name: string;
    id: string;
    room: string;
  };
  antibiotic: string;
  indication: string;
  cultureResults: string;
  prescriber: string;
  department: string;
  idApproval: string;
  startDate: string;
  plannedDuration: number;
  reviewDate: string;
  currentStatus: string;
  restrictionLevel: 'Green' | 'Yellow' | 'Red';
  daysRemaining: number;
}

export const AntibioticStewardship = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restrictionFilter, setRestrictionFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  const stewardshipEntries: StewardshipEntry[] = [
    {
      id: 'AS001',
      patient: {
        name: 'John Doe',
        id: 'P12345',
        room: '205'
      },
      antibiotic: 'Vancomycin 1g IV Q12H',
      indication: 'MRSA bacteremia',
      cultureResults: 'MRSA sensitive to Vancomycin (MIC: 1.0)',
      prescriber: 'Dr. Smith',
      department: 'Internal Medicine',
      idApproval: 'Dr. Wilson (Infectious Disease)',
      startDate: '2024-06-01',
      plannedDuration: 14,
      reviewDate: '2024-06-04',
      currentStatus: 'Appropriate therapy',
      restrictionLevel: 'Red',
      daysRemaining: 11
    },
    {
      id: 'AS002',
      patient: {
        name: 'Jane Wilson',
        id: 'P12346',
        room: '312'
      },
      antibiotic: 'Ceftriaxone 2g IV daily',
      indication: 'Community-acquired pneumonia',
      cultureResults: 'S. pneumoniae sensitive to Ceftriaxone',
      prescriber: 'Dr. Johnson',
      department: 'Pulmonology',
      idApproval: 'Not required (Yellow level)',
      startDate: '2024-05-30',
      plannedDuration: 7,
      reviewDate: '2024-06-02',
      currentStatus: 'Consider de-escalation',
      restrictionLevel: 'Yellow',
      daysRemaining: 2
    },
    {
      id: 'AS003',
      patient: {
        name: 'Bob Chen',
        id: 'P12347',
        room: '108'
      },
      antibiotic: 'Amoxicillin-Clavulanate 875mg PO BID',
      indication: 'Urinary tract infection',
      cultureResults: 'E. coli sensitive to Amoxicillin-Clavulanate',
      prescriber: 'Dr. Brown',
      department: 'Family Medicine',
      idApproval: 'Not required (Green level)',
      startDate: '2024-05-28',
      plannedDuration: 5,
      reviewDate: '2024-06-01',
      currentStatus: 'Complete therapy as planned',
      restrictionLevel: 'Green',
      daysRemaining: 0
    }
  ];

  const getRestrictionBadge = (level: string) => {
    const variants: { [key: string]: string } = {
      'Green': 'bg-green-100 text-green-800',
      'Yellow': 'bg-yellow-100 text-yellow-800',
      'Red': 'bg-red-100 text-red-800'
    };
    return variants[level] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (daysRemaining <= 0) return 'bg-gray-100 text-gray-800';
    if (status.includes('Consider')) return 'bg-orange-100 text-orange-800';
    if (status.includes('Appropriate')) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const handleApprove = (entryId: string) => {
    console.log(`Approving antibiotic therapy ${entryId}`);
  };

  const handleRequestReview = (entryId: string) => {
    console.log(`Requesting ID review for ${entryId}`);
  };

  const handleDeEscalate = (entryId: string) => {
    console.log(`Initiating de-escalation for ${entryId}`);
  };

  const filteredEntries = stewardshipEntries.filter(entry => {
    const matchesSearch = entry.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.antibiotic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRestriction = restrictionFilter === 'all' || entry.restrictionLevel === restrictionFilter;
    const matchesReview = reviewFilter === 'all' || 
                         (reviewFilter === 'due' && entry.daysRemaining <= 2) ||
                         (reviewFilter === 'overdue' && entry.daysRemaining < 0);
    
    return matchesSearch && matchesRestriction && matchesReview;
  });

  const summaryStats = {
    totalActive: stewardshipEntries.length,
    redLevel: stewardshipEntries.filter(e => e.restrictionLevel === 'Red').length,
    reviewsDue: stewardshipEntries.filter(e => e.daysRemaining <= 2 && e.daysRemaining >= 0).length,
    overdue: stewardshipEntries.filter(e => e.daysRemaining < 0).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Antibiotic Stewardship Program</h2>
          <p className="text-gray-600">Monitor and optimize antibiotic therapy across the hospital</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>{summaryStats.totalActive} active therapies</span>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Therapies</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.totalActive}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Red Level (Restricted)</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.redLevel}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviews Due</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.reviewsDue}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Reviews</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Antibiotic Restriction Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <Badge className="bg-green-100 text-green-800 mb-2">Green Level</Badge>
              <h4 className="font-semibold text-green-800">Unrestricted</h4>
              <p className="text-sm text-green-700 mt-1">Standard antibiotics available without special approval</p>
            </div>
            
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <Badge className="bg-yellow-100 text-yellow-800 mb-2">Yellow Level</Badge>
              <h4 className="font-semibold text-yellow-800">Clinical Justification</h4>
              <p className="text-sm text-yellow-700 mt-1">Require documented clinical indication and review</p>
            </div>
            
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <Badge className="bg-red-100 text-red-800 mb-2">Red Level</Badge>
              <h4 className="font-semibold text-red-800">ID Specialist Approval</h4>
              <p className="text-sm text-red-700 mt-1">Require infectious disease specialist authorization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by patient, antibiotic, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={restrictionFilter} onValueChange={setRestrictionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Restriction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reviewFilter} onValueChange={setReviewFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Review Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="due">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stewardship Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{entry.id}</h3>
                    <p className="text-sm text-gray-600">{entry.patient.name} - Room {entry.patient.room}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getRestrictionBadge(entry.restrictionLevel)}>
                    {entry.restrictionLevel} Level
                  </Badge>
                  <Badge className={getStatusBadge(entry.currentStatus, entry.daysRemaining)}>
                    {entry.daysRemaining <= 0 ? 'Completed' : `${entry.daysRemaining} days left`}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Antibiotic Therapy</label>
                  <p className="font-semibold mt-1">{entry.antibiotic}</p>
                  <p className="text-sm text-gray-600">{entry.indication}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Culture Results</label>
                  <div className="flex items-start gap-2 mt-1">
                    <Microscope className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm">{entry.cultureResults}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Prescriber & Approval</label>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{entry.prescriber}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{entry.department}</p>
                    {entry.restrictionLevel === 'Red' && (
                      <p className="text-sm text-green-600 ml-6 font-medium">{entry.idApproval}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Therapy Duration</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Started: {entry.startDate}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{entry.plannedDuration} days planned</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Next Review</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{entry.reviewDate}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Current Assessment</label>
                  <p className="text-sm font-medium mt-1">{entry.currentStatus}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {entry.restrictionLevel === 'Red' && entry.daysRemaining > 0 && (
                  <Button 
                    onClick={() => handleApprove(entry.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Continuation
                  </Button>
                )}
                
                {entry.currentStatus.includes('Consider') && (
                  <Button 
                    onClick={() => handleDeEscalate(entry.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    De-escalate Therapy
                  </Button>
                )}
                
                <Button 
                  onClick={() => handleRequestReview(entry.id)}
                  variant="outline"
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
