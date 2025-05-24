
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, AlertTriangle, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ExpiringMedication {
  id: string;
  name: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  quantity: number;
  location: string;
  batchNumber: string;
}

const sampleExpiringMeds: ExpiringMedication[] = [
  {
    id: '1',
    name: 'Aspirin 325mg',
    expiryDate: new Date('2024-02-15'),
    daysUntilExpiry: 3,
    quantity: 12,
    location: 'Medicine Cabinet',
    batchNumber: 'ASP123456'
  },
  {
    id: '2',
    name: 'Vitamin D3 1000IU',
    expiryDate: new Date('2024-03-01'),
    daysUntilExpiry: 17,
    quantity: 45,
    location: 'Kitchen Counter',
    batchNumber: 'VD3789012'
  }
];

export const MedicationExpiryWatcher = () => {
  const [expiringMedications, setExpiringMedications] = useState<ExpiringMedication[]>(sampleExpiringMeds);

  const handleDisposalReminder = (medicationId: string) => {
    const medication = expiringMedications.find(med => med.id === medicationId);
    toast.success(`Disposal reminder set for ${medication?.name}`);
  };

  const handleScheduleDisposal = (medicationId: string) => {
    const medication = expiringMedications.find(med => med.id === medicationId);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Finding disposal locations...',
        success: `Disposal appointment scheduled for ${medication?.name}`,
        error: 'Failed to schedule disposal'
      }
    );
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return 'bg-red-500';
    if (days <= 7) return 'bg-orange-500';
    if (days <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUrgencyLabel = (days: number) => {
    if (days <= 0) return 'Expired';
    if (days <= 7) return 'Critical';
    if (days <= 30) return 'Warning';
    return 'Good';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Medication Expiry Watcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {expiringMedications.map((medication) => (
            <div key={medication.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{medication.name}</h4>
                  <p className="text-sm text-gray-600">
                    Expires: {medication.expiryDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Batch: {medication.batchNumber}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getUrgencyColor(medication.daysUntilExpiry)} text-white`}>
                    {getUrgencyLabel(medication.daysUntilExpiry)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {medication.daysUntilExpiry > 0 
                      ? `${medication.daysUntilExpiry} days left`
                      : `${Math.abs(medication.daysUntilExpiry)} days overdue`
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quantity remaining: {medication.quantity} pills</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {medication.location}
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, Math.min(100, (medication.daysUntilExpiry / 365) * 100))} 
                  className="h-2"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDisposalReminder(medication.id)}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Set Reminder
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleScheduleDisposal(medication.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Schedule Disposal
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Safe Disposal Guidelines</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Never flush medications down the toilet</li>
            <li>• Use pharmacy take-back programs when available</li>
            <li>• Mix with coffee grounds or cat litter before disposal</li>
            <li>• Remove personal information from labels</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
