
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';

interface MedicationRequest {
  id: string;
  ward: string;
  patient: {
    name: string;
    id: string;
  };
  medication: string;
  quantity: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  prescriber: string;
  department: string;
  timestamp: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Dispensed' | 'Rejected';
  notes: string;
}

export const MedicationRequestFlow = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const requests: MedicationRequest[] = [
    {
      id: 'MR001',
      ward: 'ICU-A',
      patient: { name: 'John Doe', id: 'P12345' },
      medication: 'Amoxicillin 500mg',
      quantity: '30 tablets',
      urgency: 'Urgent',
      prescriber: 'Dr. Smith',
      department: 'Internal Medicine',
      timestamp: '2024-06-01 09:30',
      status: 'Pending',
      notes: 'Post-surgical prophylaxis'
    },
    {
      id: 'MR002',
      ward: 'Surgery Ward B',
      patient: { name: 'Jane Wilson', id: 'P12346' },
      medication: 'Morphine 10mg',
      quantity: '5 vials',
      urgency: 'Emergency',
      prescriber: 'Dr. Johnson',
      department: 'Surgery',
      timestamp: '2024-06-01 10:15',
      status: 'Under Review',
      notes: 'Severe post-operative pain'
    },
    {
      id: 'MR003',
      ward: 'Medicine Ward C',
      patient: { name: 'Bob Chen', id: 'P12347' },
      medication: 'Metformin 850mg',
      quantity: '60 tablets',
      urgency: 'Routine',
      prescriber: 'Dr. Brown',
      department: 'Endocrinology',
      timestamp: '2024-06-01 08:45',
      status: 'Approved',
      notes: 'Diabetes management'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Dispensed': 'bg-gray-100 text-gray-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants: { [key: string]: string } = {
      'Routine': 'bg-blue-100 text-blue-800',
      'Urgent': 'bg-orange-100 text-orange-800',
      'Emergency': 'bg-red-100 text-red-800'
    };
    return variants[urgency] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = (requestId: string) => {
    console.log(`Approving request ${requestId}`);
  };

  const handleReject = (requestId: string) => {
    console.log(`Rejecting request ${requestId}`);
  };

  const handleRequestInfo = (requestId: string) => {
    console.log(`Requesting more info for ${requestId}`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Request Flow</h2>
          <p className="text-gray-600">Manage and approve medication requests from wards</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{filteredRequests.length} requests</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by patient, medication, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Dispensed">Dispensed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Request Cards */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{request.id}</h3>
                    <p className="text-sm text-gray-600">{request.ward}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyBadge(request.urgency)}>
                    {request.urgency}
                  </Badge>
                  <Badge className={getStatusBadge(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{request.patient.name}</p>
                      <p className="text-sm text-gray-600">{request.patient.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Medication</label>
                  <p className="font-medium mt-1">{request.medication}</p>
                  <p className="text-sm text-gray-600">{request.quantity}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Prescriber</label>
                  <p className="font-medium mt-1">{request.prescriber}</p>
                  <p className="text-sm text-gray-600">{request.department}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Requested</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm">{request.timestamp}</p>
                  </div>
                </div>
              </div>

              {request.notes && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{request.notes}</p>
                </div>
              )}

              {(request.status === 'Pending' || request.status === 'Under Review') && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  
                  <Button 
                    onClick={() => handleReject(request.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button 
                    onClick={() => handleRequestInfo(request.id)}
                    variant="outline"
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Info
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
