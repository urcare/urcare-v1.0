
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  RotateCcw, 
  Package, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Search,
  Plus,
  AlertTriangle
} from 'lucide-react';

interface ReturnEntry {
  id: string;
  medication: string;
  quantity: string;
  returnReason: string;
  ward: string;
  returnedBy: string;
  condition: string;
  creditAmount: number;
  disposalRequired: boolean;
  status: 'Pending Verification' | 'Verified' | 'Credited' | 'Disposed';
  timestamp: string;
}

export const ReturnsTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReturn, setShowNewReturn] = useState(false);

  const returns: ReturnEntry[] = [
    {
      id: 'RT001',
      medication: 'Morphine 10mg (5 vials)',
      quantity: '5 vials',
      returnReason: 'Patient discharged',
      ward: 'Surgery Ward B',
      returnedBy: 'Nurse Kelly Martinez',
      condition: 'Unopened, proper storage',
      creditAmount: 125.50,
      disposalRequired: false,
      status: 'Pending Verification',
      timestamp: '2024-06-01 14:30'
    },
    {
      id: 'RT002',
      medication: 'Amoxicillin 500mg (20 tablets)',
      quantity: '20 tablets',
      returnReason: 'Medication discontinued',
      ward: 'ICU-A',
      returnedBy: 'Nurse Sarah Johnson',
      condition: 'Opened package, stable',
      creditAmount: 45.80,
      disposalRequired: false,
      status: 'Verified',
      timestamp: '2024-06-01 13:15'
    },
    {
      id: 'RT003',
      medication: 'Insulin Glargine (1 pen)',
      quantity: '1 pen',
      returnReason: 'Dosage changed',
      ward: 'Medicine Ward C',
      returnedBy: 'Nurse Mike Chen',
      condition: 'Partial use, refrigerated',
      creditAmount: 89.25,
      disposalRequired: true,
      status: 'Credited',
      timestamp: '2024-06-01 12:00'
    }
  ];

  const returnReasons = [
    'Patient discharged',
    'Medication discontinued',
    'Dosage changed',
    'Adverse reaction',
    'Expired medication',
    'Ward stock return',
    'Prescription error'
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending Verification': 'bg-yellow-100 text-yellow-800',
      'Verified': 'bg-blue-100 text-blue-800',
      'Credited': 'bg-green-100 text-green-800',
      'Disposed': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const handleVerify = (returnId: string) => {
    console.log(`Verifying return ${returnId}`);
  };

  const handleCredit = (returnId: string) => {
    console.log(`Processing credit for return ${returnId}`);
  };

  const handleDispose = (returnId: string) => {
    console.log(`Marking disposal for return ${returnId}`);
  };

  const filteredReturns = returns.filter(returnEntry => {
    const matchesSearch = returnEntry.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnEntry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnEntry.ward.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || returnEntry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPendingValue = returns
    .filter(r => r.status === 'Pending Verification')
    .reduce((sum, r) => sum + r.creditAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Return-to-Pharmacy Tracker</h2>
          <p className="text-gray-600">Manage medication returns and credit processing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Pending Credit Value</p>
            <p className="text-xl font-bold text-orange-600">${totalPendingValue.toFixed(2)}</p>
          </div>
          <Button onClick={() => setShowNewReturn(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Return
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Returns</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {returns.filter(r => r.status === 'Pending Verification').length}
                </p>
              </div>
              <RotateCcw className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Returns</p>
                <p className="text-2xl font-bold text-blue-600">
                  {returns.filter(r => r.status === 'Verified').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credits Processed</p>
                <p className="text-2xl font-bold text-green-600">
                  ${returns.filter(r => r.status === 'Credited').reduce((sum, r) => sum + r.creditAmount, 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disposal Required</p>
                <p className="text-2xl font-bold text-red-600">
                  {returns.filter(r => r.disposalRequired && r.status !== 'Disposed').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by medication, ID, or ward..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Credited">Credited</SelectItem>
                <SelectItem value="Disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Return Entries */}
      <div className="space-y-4">
        {filteredReturns.map((returnEntry) => (
          <Card key={returnEntry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{returnEntry.id}</h3>
                    <p className="text-sm text-gray-600">{returnEntry.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(returnEntry.status)}>
                    {returnEntry.status}
                  </Badge>
                  {returnEntry.disposalRequired && (
                    <Badge className="bg-red-100 text-red-800">
                      Disposal Required
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Medication</label>
                  <p className="font-medium mt-1">{returnEntry.medication}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Return Reason</label>
                  <p className="font-medium mt-1">{returnEntry.returnReason}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Ward & Staff</label>
                  <p className="font-medium mt-1">{returnEntry.ward}</p>
                  <p className="text-sm text-gray-600">{returnEntry.returnedBy}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Credit Amount</label>
                  <p className="font-bold text-green-600 mt-1 text-lg">${returnEntry.creditAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Condition Assessment</label>
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{returnEntry.condition}</p>
              </div>

              {returnEntry.status === 'Pending Verification' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleVerify(returnEntry.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Return
                  </Button>
                  
                  <Button 
                    onClick={() => handleCredit(returnEntry.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Credit
                  </Button>
                </div>
              )}

              {returnEntry.status === 'Verified' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleCredit(returnEntry.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Credit
                  </Button>
                  
                  {returnEntry.disposalRequired && (
                    <Button 
                      onClick={() => handleDispose(returnEntry.id)}
                      variant="outline"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark Disposed
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Return Modal would go here */}
      {showNewReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>New Return Entry</CardTitle>
              <CardDescription>Record a new medication return from ward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Medication</label>
                  <Input placeholder="Enter medication name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input placeholder="Enter quantity" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Return Reason</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {returnReasons.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ward</label>
                  <Input placeholder="Enter ward" />
                </div>
                <div>
                  <label className="text-sm font-medium">Returned By</label>
                  <Input placeholder="Staff name" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Condition Assessment</label>
                <Textarea placeholder="Describe medication condition..." />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowNewReturn(false)}>
                  Create Return Entry
                </Button>
                <Button variant="outline" onClick={() => setShowNewReturn(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
