
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Share2, Mail, Link, QrCode, Clock, Shield, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface SharedRecord {
  id: string;
  recordIds: string[];
  recordTitles: string[];
  sharedWith: string;
  sharedDate: Date;
  expiryDate: Date;
  accessType: 'view' | 'download' | 'full';
  accessCount: number;
  status: 'active' | 'expired' | 'revoked';
  shareMethod: 'email' | 'link' | 'qr';
  message?: string;
}

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: Date;
  doctor: string;
}

const sampleRecords: MedicalRecord[] = [
  { id: '1', title: 'Blood Test Results', type: 'Lab', date: new Date('2024-01-15'), doctor: 'Dr. Smith' },
  { id: '2', title: 'Chest X-Ray', type: 'Imaging', date: new Date('2024-01-10'), doctor: 'Dr. Johnson' },
  { id: '3', title: 'Prescription - Lisinopril', type: 'Prescription', date: new Date('2024-01-05'), doctor: 'Dr. Wilson' },
  { id: '4', title: 'Cardiology Consultation', type: 'Report', date: new Date('2024-01-03'), doctor: 'Dr. Brown' }
];

const sampleSharedRecords: SharedRecord[] = [
  {
    id: '1',
    recordIds: ['1', '2'],
    recordTitles: ['Blood Test Results', 'Chest X-Ray'],
    sharedWith: 'dr.specialist@hospital.com',
    sharedDate: new Date('2024-01-16'),
    expiryDate: new Date('2024-02-16'),
    accessType: 'view',
    accessCount: 3,
    status: 'active',
    shareMethod: 'email',
    message: 'Please review these results for my upcoming consultation.'
  },
  {
    id: '2',
    recordIds: ['3'],
    recordTitles: ['Prescription - Lisinopril'],
    sharedWith: 'Local Pharmacy',
    sharedDate: new Date('2024-01-10'),
    expiryDate: new Date('2024-01-17'),
    accessType: 'download',
    accessCount: 1,
    status: 'expired',
    shareMethod: 'qr'
  }
];

export const RecordSharing = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(sampleRecords);
  const [sharedRecords, setSharedRecords] = useState<SharedRecord[]>(sampleSharedRecords);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Share form state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [shareMethod, setShareMethod] = useState<'email' | 'link' | 'qr'>('email');
  const [accessType, setAccessType] = useState<'view' | 'download' | 'full'>('view');
  const [expiryDays, setExpiryDays] = useState('30');
  const [shareMessage, setShareMessage] = useState('');

  const handleRecordSelect = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleShareRecords = () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one record to share');
      return;
    }

    if (shareMethod === 'email' && !recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    const selectedRecordTitles = records
      .filter(r => selectedRecords.includes(r.id))
      .map(r => r.title);

    const newShare: SharedRecord = {
      id: Date.now().toString(),
      recordIds: selectedRecords,
      recordTitles: selectedRecordTitles,
      sharedWith: shareMethod === 'email' ? recipientEmail : `${shareMethod.toUpperCase()} Share`,
      sharedDate: new Date(),
      expiryDate: new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000),
      accessType,
      accessCount: 0,
      status: 'active',
      shareMethod,
      message: shareMessage
    };

    setSharedRecords(prev => [newShare, ...prev]);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Sharing records via ${shareMethod}...`,
        success: `Records shared successfully via ${shareMethod}`,
        error: 'Failed to share records'
      }
    );

    // Reset form
    setSelectedRecords([]);
    setRecipientEmail('');
    setShareMessage('');
    setShareDialogOpen(false);
  };

  const handleRevokeAccess = (shareId: string) => {
    setSharedRecords(prev => prev.map(share =>
      share.id === shareId ? { ...share, status: 'revoked' as const } : share
    ));
    toast.success('Access revoked successfully');
  };

  const handleGenerateQR = (shareId: string) => {
    toast.success('QR code generated and copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'view': return 'bg-blue-100 text-blue-800';
      case 'download': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShareMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'qr': return <QrCode className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Medical Record Sharing
              </CardTitle>
              <CardDescription>
                Securely share medical records with healthcare providers
              </CardDescription>
            </div>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Records
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Medical Records</DialogTitle>
                  <DialogDescription>
                    Select records and configure sharing settings
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Record Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Select Records to Share</h4>
                    <div className="border rounded-lg max-h-60 overflow-y-auto">
                      {records.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center space-x-3 p-3 border-b last:border-b-0"
                        >
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={() => handleRecordSelect(record.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-600">
                              {record.type} • {record.doctor} • {record.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share Method */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Share Method</h4>
                    <Select value={shareMethod} onValueChange={(value: 'email' | 'link' | 'qr') => setShareMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="link">
                          <div className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            Secure Link
                          </div>
                        </SelectItem>
                        <SelectItem value="qr">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4" />
                            QR Code
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipient Email (if email method) */}
                  {shareMethod === 'email' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recipient Email</label>
                      <Input
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Access Type */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Access Level</h4>
                    <Select value={accessType} onValueChange={(value: 'view' | 'download' | 'full') => setAccessType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="download">View & Download</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expiry */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Access Expiry</h4>
                    <Select value={expiryDays} onValueChange={setExpiryDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                        <SelectItem value="30">1 month</SelectItem>
                        <SelectItem value="90">3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message (Optional)</label>
                    <Textarea
                      placeholder="Add a message for the recipient..."
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleShareRecords}>
                      Share Records
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Shares Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Active Shares</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {sharedRecords.filter(s => s.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600">Currently shared</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Total Views</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {sharedRecords.reduce((sum, s) => sum + s.accessCount, 0)}
                </div>
                <p className="text-sm text-gray-600">Access count</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Expiring Soon</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {sharedRecords.filter(s => {
                    const daysToExpiry = Math.ceil((s.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return s.status === 'active' && daysToExpiry <= 7;
                  }).length}
                </div>
                <p className="text-sm text-gray-600">Within 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Shared Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shared Records</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedRecords.map((share) => (
                  <TableRow key={share.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {share.recordTitles.slice(0, 2).join(', ')}
                          {share.recordTitles.length > 2 && ` +${share.recordTitles.length - 2} more`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {share.recordTitles.length} record{share.recordTitles.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{share.sharedWith}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getShareMethodIcon(share.shareMethod)}
                        <span className="capitalize">{share.shareMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAccessTypeColor(share.accessType)}>
                        {share.accessType}
                      </Badge>
                    </TableCell>
                    <TableCell>{share.expiryDate.toLocaleDateString()}</TableCell>
                    <TableCell>{share.accessCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(share.status)}>
                        {share.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {share.status === 'active' && (
                          <>
                            {share.shareMethod === 'qr' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleGenerateQR(share.id)}
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevokeAccess(share.id)}
                            >
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
