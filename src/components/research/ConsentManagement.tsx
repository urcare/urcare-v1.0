
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  PenTool, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  Plus,
  Download,
  Eye,
  Signature
} from 'lucide-react';

interface ConsentRecord {
  id: string;
  participantId: string;
  initials: string;
  consentType: string;
  version: string;
  status: 'pending' | 'signed' | 'expired' | 'withdrawn';
  signedDate: string;
  expiryDate: string;
  witnessName: string;
  electronicSignature: boolean;
  notes: string;
}

export const ConsentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewConsentDialogOpen, setIsNewConsentDialogOpen] = useState(false);

  const consentRecords: ConsentRecord[] = [
    {
      id: '1',
      participantId: 'CARDIO-001-001',
      initials: 'J.D.',
      consentType: 'Main Study Consent',
      version: '3.0',
      status: 'signed',
      signedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      witnessName: 'Dr. Sarah Johnson',
      electronicSignature: true,
      notes: 'Patient understood all procedures'
    },
    {
      id: '2',
      participantId: 'CARDIO-001-002',
      initials: 'M.S.',
      consentType: 'Genetic Analysis Consent',
      version: '2.1',
      status: 'pending',
      signedDate: '',
      expiryDate: '2025-01-18',
      witnessName: '',
      electronicSignature: false,
      notes: 'Awaiting signature'
    },
    {
      id: '3',
      participantId: 'NEURO-002-001',
      initials: 'R.T.',
      consentType: 'Main Study Consent',
      version: '1.5',
      status: 'expired',
      signedDate: '2023-01-10',
      expiryDate: '2024-01-10',
      witnessName: 'Dr. Michael Chen',
      electronicSignature: true,
      notes: 'Requires renewal'
    }
  ];

  const consentStats = {
    totalConsents: 847,
    pending: 23,
    signed: 782,
    expired: 42,
    withdrawn: 15,
    electronicRate: 92
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'withdrawn': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-500',
      signed: 'bg-green-500',
      expired: 'bg-red-500',
      withdrawn: 'bg-gray-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  const filteredConsents = consentRecords.filter(consent => {
    const matchesSearch = consent.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.initials.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || consent.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consent Management</h2>
          <p className="text-gray-600">Manage informed consent and electronic signatures</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isNewConsentDialogOpen} onOpenChange={setIsNewConsentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Consent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Consent Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participant">Participant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio-001-001">CARDIO-001-001 (J.D.)</SelectItem>
                        <SelectItem value="cardio-001-002">CARDIO-001-002 (M.S.)</SelectItem>
                        <SelectItem value="neuro-002-001">NEURO-002-001 (R.T.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="consent-type">Consent Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-study">Main Study Consent</SelectItem>
                        <SelectItem value="genetic">Genetic Analysis Consent</SelectItem>
                        <SelectItem value="imaging">Imaging Consent</SelectItem>
                        <SelectItem value="biobank">Biobank Consent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" placeholder="e.g., 3.0" />
                  </div>
                  <div>
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="witness">Witness Name</Label>
                  <Input id="witness" placeholder="Witness name" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes" rows={3} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsNewConsentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewConsentDialogOpen(false)}>
                    Create Consent
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Consent Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{consentStats.totalConsents}</p>
            <p className="text-sm text-blue-700">Total Consents</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{consentStats.pending}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{consentStats.signed}</p>
            <p className="text-sm text-green-700">Signed</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{consentStats.expired}</p>
            <p className="text-sm text-red-700">Expired</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{consentStats.withdrawn}</p>
            <p className="text-sm text-gray-700">Withdrawn</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <PenTool className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{consentStats.electronicRate}%</p>
            <p className="text-sm text-purple-700">Electronic Rate</p>
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
                  placeholder="Search consent records..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consent Records */}
      <div className="grid gap-4">
        {filteredConsents.map((consent) => (
          <Card key={consent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {consent.participantId} ({consent.initials})
                    </h3>
                    <Badge className={`${getStatusColor(consent.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(consent.status)}
                      {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                    </Badge>
                    {consent.electronicSignature && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Signature className="h-3 w-3" />
                        E-Signature
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Consent Type:</span>
                      <p className="text-gray-600">{consent.consentType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Version:</span>
                      <p className="text-gray-600">{consent.version}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Signed Date:</span>
                      <p className="text-gray-600">{consent.signedDate || 'Not signed'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expiry Date:</span>
                      <p className="text-gray-600">{consent.expiryDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Witness:</span>
                      <p className="text-gray-600">{consent.witnessName || 'Not assigned'}</p>
                    </div>
                  </div>
                  {consent.notes && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-600 mt-1">{consent.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <PenTool className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
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
