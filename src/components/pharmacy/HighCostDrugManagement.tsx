
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  TrendingUp,
  Search,
  FileText
} from 'lucide-react';

interface HighCostDrug {
  id: string;
  medication: string;
  unitCost: number;
  totalCost: number;
  doses: number;
  patient: {
    name: string;
    id: string;
  };
  diagnosis: string;
  prescriber: string;
  department: string;
  justification: string;
  insuranceStatus: string;
  committeeReview: string;
  status: 'Under Review' | 'Committee Pending' | 'Approved' | 'Denied' | 'Insurance Pending';
  tier: 1 | 2 | 3;
  submittedDate: string;
}

export const HighCostDrugManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const highCostDrugs: HighCostDrug[] = [
    {
      id: 'HCD001',
      medication: 'Rituximab 500mg',
      unitCost: 2847.50,
      totalCost: 11390.00,
      doses: 4,
      patient: {
        name: 'Jane Wilson',
        id: 'P12346'
      },
      diagnosis: 'Refractory Rheumatoid Arthritis',
      prescriber: 'Dr. Brown',
      department: 'Rheumatology',
      justification: 'Failed 3 conventional DMARDs, meets biologic criteria per ACR guidelines',
      insuranceStatus: 'Prior auth pending',
      committeeReview: 'Scheduled 2024-06-05',
      status: 'Under Review',
      tier: 3,
      submittedDate: '2024-06-01'
    },
    {
      id: 'HCD002',
      medication: 'Pembrolizumab 100mg',
      unitCost: 4975.00,
      totalCost: 29850.00,
      doses: 6,
      patient: {
        name: 'Robert Chen',
        id: 'P12347'
      },
      diagnosis: 'Metastatic Melanoma',
      prescriber: 'Dr. Johnson',
      department: 'Oncology',
      justification: 'First-line therapy for PD-L1 positive melanoma, FDA approved indication',
      insuranceStatus: 'Approved with copay assistance',
      committeeReview: 'Approved 2024-05-28',
      status: 'Approved',
      tier: 3,
      submittedDate: '2024-05-25'
    },
    {
      id: 'HCD003',
      medication: 'Adalimumab 40mg',
      unitCost: 1250.00,
      totalCost: 3750.00,
      doses: 3,
      patient: {
        name: 'Sarah Davis',
        id: 'P12348'
      },
      diagnosis: 'Crohn\'s Disease',
      prescriber: 'Dr. Martinez',
      department: 'Gastroenterology',
      justification: 'Moderate to severe CD, failed conventional therapy including immunomodulators',
      insuranceStatus: 'Approved',
      committeeReview: 'Department approved',
      status: 'Approved',
      tier: 2,
      submittedDate: '2024-05-30'
    }
  ];

  const getTierInfo = (tier: number) => {
    const tiers = {
      1: { range: '$500-$1,000', approval: 'Department Head', color: 'bg-blue-100 text-blue-800' },
      2: { range: '$1,000-$5,000', approval: 'Pharmacy Committee', color: 'bg-yellow-100 text-yellow-800' },
      3: { range: '$5,000+', approval: 'Hospital Committee', color: 'bg-red-100 text-red-800' }
    };
    return tiers[tier as keyof typeof tiers];
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Committee Pending': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Denied': 'bg-red-100 text-red-800',
      'Insurance Pending': 'bg-blue-100 text-blue-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = (drugId: string) => {
    console.log(`Approving high-cost drug request ${drugId}`);
  };

  const handleDeny = (drugId: string) => {
    console.log(`Denying high-cost drug request ${drugId}`);
  };

  const handleScheduleReview = (drugId: string) => {
    console.log(`Scheduling committee review for ${drugId}`);
  };

  const filteredDrugs = highCostDrugs.filter(drug => {
    const matchesSearch = drug.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drug.status === statusFilter;
    const matchesTier = tierFilter === 'all' || drug.tier.toString() === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const summaryStats = {
    totalPending: highCostDrugs.filter(d => d.status !== 'Approved' && d.status !== 'Denied').length,
    totalValue: highCostDrugs.reduce((sum, d) => sum + d.totalCost, 0),
    approvedValue: highCostDrugs.filter(d => d.status === 'Approved').reduce((sum, d) => sum + d.totalCost, 0),
    tier3Count: highCostDrugs.filter(d => d.tier === 3).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">High-Cost Drug Management</h2>
          <p className="text-gray-600">Approval workflow and cost monitoring for expensive medications</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-green-600">${summaryStats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.totalPending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Value</p>
                <p className="text-xl font-bold text-green-600">${summaryStats.approvedValue.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tier 3 Requests</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.tier3Count}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Trend</p>
                <p className="text-lg font-bold text-blue-600">+12.5%</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cost Threshold Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(tier => {
              const info = getTierInfo(tier);
              return (
                <div key={tier} className="p-4 border rounded-lg">
                  <Badge className={info.color}>Tier {tier}</Badge>
                  <h4 className="font-semibold mt-2">{info.range}</h4>
                  <p className="text-sm text-gray-600 mt-1">{info.approval}</p>
                </div>
              );
            })}
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
                  placeholder="Search by medication, patient, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Committee Pending">Committee Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
                <SelectItem value="Insurance Pending">Insurance Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* High-Cost Drug Requests */}
      <div className="space-y-4">
        {filteredDrugs.map((drug) => (
          <Card key={drug.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{drug.id}</h3>
                    <p className="text-sm text-gray-600">Submitted: {drug.submittedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getTierInfo(drug.tier).color}>
                    Tier {drug.tier}
                  </Badge>
                  <Badge className={getStatusBadge(drug.status)}>
                    {drug.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Medication</label>
                  <p className="font-semibold mt-1">{drug.medication}</p>
                  <p className="text-sm text-gray-600">{drug.doses} doses</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Patient</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{drug.patient.name}</p>
                      <p className="text-sm text-gray-600">{drug.patient.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Cost Breakdown</label>
                  <p className="font-bold text-green-600 text-lg mt-1">${drug.totalCost.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">${drug.unitCost.toFixed(2)} per dose</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Prescriber</label>
                  <p className="font-medium mt-1">{drug.prescriber}</p>
                  <p className="text-sm text-gray-600">{drug.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Diagnosis & Justification</label>
                  <p className="font-medium mt-1">{drug.diagnosis}</p>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{drug.justification}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Insurance Status</label>
                    <p className="text-sm mt-1">{drug.insuranceStatus}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Committee Review</label>
                    <p className="text-sm mt-1">{drug.committeeReview}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(drug.status === 'Under Review' || drug.status === 'Committee Pending') && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleApprove(drug.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  
                  <Button 
                    onClick={() => handleDeny(drug.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Deny Request
                  </Button>
                  
                  {drug.tier === 3 && (
                    <Button 
                      onClick={() => handleScheduleReview(drug.id)}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Schedule Committee
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrugs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
