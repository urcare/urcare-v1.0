
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Users, 
  Clock, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';

export const ChainOfCustodyTracking = () => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const custodyChain = [
    {
      id: 'COC001',
      wasteId: 'WP001',
      wasteType: 'Red Bag Waste',
      source: 'ICU Ward A',
      weight: '25 kg',
      containers: 8,
      transfers: [
        {
          step: 1,
          from: 'Dr. Sarah Johnson',
          to: 'Waste Handler - Ram Kumar',
          timestamp: '2024-06-04 09:15:23',
          signature: 'verified',
          status: 'completed'
        },
        {
          step: 2,
          from: 'Waste Handler - Ram Kumar',
          to: 'Transport Team - Ravi Singh',
          timestamp: '2024-06-04 09:45:12',
          signature: 'verified',
          status: 'completed'
        },
        {
          step: 3,
          from: 'Transport Team - Ravi Singh',
          to: 'Treatment Facility - GreenTech Disposal',
          timestamp: '2024-06-04 11:30:45',
          signature: 'pending',
          status: 'in-transit'
        }
      ],
      finalDisposal: {
        facility: 'GreenTech Bio-Waste Treatment',
        method: 'Autoclave + Shredding',
        certificate: 'Pending',
        expectedCompletion: '2024-06-04 15:00:00'
      }
    },
    {
      id: 'COC002',
      wasteId: 'WP002',
      wasteType: 'Pharmaceutical Waste',
      source: 'Pharmacy Department',
      weight: '12 kg',
      containers: 3,
      transfers: [
        {
          step: 1,
          from: 'Pharmacist - Priya Sharma',
          to: 'Waste Handler - Amit Patel',
          timestamp: '2024-06-04 10:30:15',
          signature: 'verified',
          status: 'completed'
        },
        {
          step: 2,
          from: 'Waste Handler - Amit Patel',
          to: 'Transport Team - Ravi Singh',
          timestamp: '2024-06-04 11:15:33',
          signature: 'verified',
          status: 'completed'
        },
        {
          step: 3,
          from: 'Transport Team - Ravi Singh',
          to: 'Incineration Facility - EcoFire Systems',
          timestamp: '2024-06-04 12:45:20',
          signature: 'verified',
          status: 'completed'
        }
      ],
      finalDisposal: {
        facility: 'EcoFire Incineration Plant',
        method: 'High Temperature Incineration',
        certificate: 'Generated',
        completedAt: '2024-06-04 14:30:00'
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      'in-transit': { label: 'In Transit', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Chain of Custody Tracking</h3>
          <p className="text-gray-600">Digital signatures, transfer logs, and custody handoffs</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Signature
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Active Chain of Custody Records */}
      <div className="space-y-4">
        {custodyChain.map((chain) => (
          <Card key={chain.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Chain of Custody - {chain.id}
                  </CardTitle>
                  <CardDescription>
                    {chain.wasteType} from {chain.source} • {chain.weight} • {chain.containers} containers
                  </CardDescription>
                </div>
                <div className="text-right">
                  {getStatusBadge(chain.transfers[chain.transfers.length - 1].status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Transfer Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Transfer History</h4>
                <div className="space-y-3">
                  {chain.transfers.map((transfer) => (
                    <div key={transfer.step} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {transfer.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : transfer.status === 'in-transit' ? (
                          <Clock className="w-6 h-6 text-blue-600" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-sm">Step {transfer.step}: Custody Transfer</h5>
                          {getStatusBadge(transfer.status)}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>From: {transfer.from}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>To: {transfer.to}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{transfer.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Digital Signature: {transfer.signature}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        {transfer.status === 'pending' && (
                          <Button size="sm">Sign Transfer</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Disposal Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Final Disposal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Treatment Facility:</span>
                    <p className="font-medium">{chain.finalDisposal.facility}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Disposal Method:</span>
                    <p className="font-medium">{chain.finalDisposal.method}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Disposal Certificate:</span>
                    <p className="font-medium">{chain.finalDisposal.certificate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      {chain.finalDisposal.completedAt ? 'Completed At:' : 'Expected Completion:'}
                    </span>
                    <p className="font-medium">
                      {chain.finalDisposal.completedAt || chain.finalDisposal.expectedCompletion}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Digital Signature Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Digital Signature Verification
          </CardTitle>
          <CardDescription>Tamper-proof custody transfer verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Enter custody ID or signature hash" />
              <Button>Verify Signature</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">156</div>
                <div className="text-sm text-green-700">Verified Transfers</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">8</div>
                <div className="text-sm text-blue-700">Pending Signatures</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">0</div>
                <div className="text-sm text-red-700">Failed Verifications</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
