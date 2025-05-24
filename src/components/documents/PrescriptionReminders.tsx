
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pill, Clock, AlertTriangle, Bell, BellOff, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  status: 'active' | 'expiring' | 'expired' | 'refilled';
}

const samplePrescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet',
    frequency: 'Daily',
    prescribedBy: 'Dr. Johnson',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-01'),
    daysRemaining: 5,
    status: 'expiring'
  },
  {
    id: '2',
    medication: 'Metformin 500mg',
    dosage: '2 tablets',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Smith',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    daysRemaining: 45,
    status: 'active'
  },
  {
    id: '3',
    medication: 'Atorvastatin 20mg',
    dosage: '1 tablet',
    frequency: 'At bedtime',
    prescribedBy: 'Dr. Wilson',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-01-10'),
    daysRemaining: -5,
    status: 'expired'
  }
];

export const PrescriptionReminders = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderThreshold, setReminderThreshold] = useState('7');

  const handleRefillRequest = (prescriptionId: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Requesting prescription refill...',
        success: 'Refill request sent to pharmacy',
        error: 'Failed to request refill'
      }
    );

    setPrescriptions(prev => prev.map(p => 
      p.id === prescriptionId ? { ...p, status: 'refilled' as const } : p
    ));
  };

  const handleSetReminder = (prescriptionId: string) => {
    toast.success('Reminder set successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'refilled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (daysRemaining: number) => {
    if (daysRemaining < 0) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (daysRemaining <= 7) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Calendar className="h-4 w-4 text-green-500" />;
  };

  const expiringCount = prescriptions.filter(p => p.daysRemaining <= 7 && p.daysRemaining >= 0).length;
  const expiredCount = prescriptions.filter(p => p.daysRemaining < 0).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription Expiry Reminders
          </CardTitle>
          <CardDescription>
            Track medication expiry dates and get timely reminders for refills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Expiring Soon</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
                <p className="text-sm text-gray-600">Within 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Expired</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
                <p className="text-sm text-gray-600">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Active</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {prescriptions.filter(p => p.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600">Current medications</p>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {notificationsEnabled ? <Bell className="h-4 w-4 text-blue-600" /> : <BellOff className="h-4 w-4 text-gray-600" />}
                <span className="font-medium">Reminder Notifications</span>
              </div>
              <p className="text-sm text-gray-600">
                Get notified when prescriptions are about to expire
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={reminderThreshold} onValueChange={setReminderThreshold}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>

          {/* Prescriptions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{prescription.medication}</div>
                        <div className="text-sm text-gray-600">
                          {prescription.dosage} • {prescription.frequency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{prescription.prescribedBy}</TableCell>
                    <TableCell>{prescription.endDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getUrgencyIcon(prescription.daysRemaining)}
                        <span className={`font-medium ${
                          prescription.daysRemaining < 0 ? 'text-red-600' :
                          prescription.daysRemaining <= 7 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {prescription.daysRemaining < 0 
                            ? `${Math.abs(prescription.daysRemaining)} days overdue`
                            : `${prescription.daysRemaining} days`
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefillRequest(prescription.id)}
                          disabled={prescription.status === 'refilled'}
                        >
                          Request Refill
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetReminder(prescription.id)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
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
