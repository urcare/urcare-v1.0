
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Download,
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface Claim {
  id: string;
  patientName: string;
  tpaName: string;
  amount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
  submissionDate: string;
  processingDays: number;
  rejectionReason?: string;
}

export const ClaimLifecycleDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const claims: Claim[] = [
    {
      id: 'CLM001',
      patientName: 'John Doe',
      tpaName: 'Star Health',
      amount: 25000,
      status: 'approved',
      submissionDate: '2024-06-01',
      processingDays: 7
    },
    {
      id: 'CLM002',
      patientName: 'Jane Smith',
      tpaName: 'ICICI Lombard',
      amount: 15000,
      status: 'under_review',
      submissionDate: '2024-06-03',
      processingDays: 5
    },
    {
      id: 'CLM003',
      patientName: 'Bob Wilson',
      tpaName: 'HDFC Ergo',
      amount: 8000,
      status: 'rejected',
      submissionDate: '2024-05-28',
      processingDays: 12,
      rejectionReason: 'Incomplete documentation'
    }
  ];

  const claimMetrics = [
    { label: 'Total Claims', value: 156, icon: FileText, color: 'text-blue-600' },
    { label: 'Pending Approvals', value: 23, icon: Clock, color: 'text-amber-600' },
    { label: 'Approved', value: 98, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Rejected', value: 12, icon: XCircle, color: 'text-red-600' }
  ];

  const statusData = [
    { name: 'Approved', value: 63, color: '#10b981' },
    { name: 'Under Review', value: 15, color: '#f59e0b' },
    { name: 'Rejected', value: 8, color: '#ef4444' },
    { name: 'Settled', value: 14, color: '#6366f1' }
  ];

  const processingTimeData = [
    { tpa: 'Star Health', avgDays: 5.2 },
    { tpa: 'ICICI Lombard', avgDays: 7.8 },
    { tpa: 'HDFC Ergo', avgDays: 6.1 },
    { tpa: 'Bajaj Allianz', avgDays: 8.3 },
    { tpa: 'New India', avgDays: 9.1 }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
      under_review: { label: 'Under Review', className: 'bg-amber-100 text-amber-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
      settled: { label: 'Settled', className: 'bg-purple-100 text-purple-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.tpaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">TPA Claim Lifecycle Dashboard</h2>
          <p className="text-gray-600">Real-time tracking of insurance claims and approvals</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {claimMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <metric.icon className={`w-12 h-12 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Status Distribution</CardTitle>
            <CardDescription>Current status breakdown of all claims</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card>
          <CardHeader>
            <CardTitle>Average Processing Time by TPA</CardTitle>
            <CardDescription>Days taken for claim processing</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tpa" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} days`, 'Processing Time']} />
                <Bar dataKey="avgDays" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Claims Management</CardTitle>
          <CardDescription>Track and manage all insurance claims</CardDescription>
          
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="settled">Settled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{claim.id} - {claim.patientName}</h3>
                    <p className="text-sm text-gray-600">{claim.tpaName} • Submitted: {claim.submissionDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">₹{claim.amount.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Processing Days</p>
                    <p className="font-semibold">{claim.processingDays}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(claim.status)}
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
