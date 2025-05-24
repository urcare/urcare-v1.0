
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, MapPin, Phone, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  deliveryAvailable: boolean;
  estimatedTime: string;
}

const samplePharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'CVS Pharmacy',
    address: '123 Main St, City, ST 12345',
    phone: '(555) 123-4567',
    hours: '8 AM - 10 PM',
    deliveryAvailable: true,
    estimatedTime: '2-4 hours'
  },
  {
    id: '2',
    name: 'Walgreens',
    address: '456 Oak Ave, City, ST 12345',
    phone: '(555) 234-5678',
    hours: '24 Hours',
    deliveryAvailable: true,
    estimatedTime: '1-3 hours'
  },
  {
    id: '3',
    name: 'Local Family Pharmacy',
    address: '789 Pine St, City, ST 12345',
    phone: '(555) 345-6789',
    hours: '9 AM - 7 PM',
    deliveryAvailable: false,
    estimatedTime: 'N/A'
  }
];

interface PharmacyIntegrationProps {
  medications: any[];
  onRefillRequest: (medicationId: string) => void;
}

export const PharmacyIntegration = ({ medications, onRefillRequest }: PharmacyIntegrationProps) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');
  const [refillType, setRefillType] = useState<'pickup' | 'delivery'>('pickup');

  const handleBulkRefill = () => {
    const eligibleMedications = medications.filter(med => med.refillsRemaining > 0);
    
    if (eligibleMedications.length === 0) {
      toast.error('No medications eligible for refill');
      return;
    }

    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Requesting refills for ${eligibleMedications.length} medications...`,
        success: `Bulk refill request sent to pharmacy`,
        error: 'Failed to process bulk refill request'
      }
    );
  };

  const handlePharmacySwitch = (medicationId: string, newPharmacyId: string) => {
    const pharmacy = samplePharmacies.find(p => p.id === newPharmacyId);
    toast.success(`Prescription transferred to ${pharmacy?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Pharmacy Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pharmacy Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {samplePharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{pharmacy.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {pharmacy.address}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {pharmacy.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {pharmacy.hours}
                    </div>
                  </div>
                  <div className="text-right">
                    {pharmacy.deliveryAvailable && (
                      <Badge className="mb-1">
                        <Truck className="h-3 w-3 mr-1" />
                        Delivery
                      </Badge>
                    )}
                    <p className="text-sm text-gray-600">
                      Est: {pharmacy.estimatedTime}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedPharmacy(pharmacy.id)}
                  className="w-full"
                >
                  Select Pharmacy
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refill Management */}
      <Card>
        <CardHeader>
          <CardTitle>Refill Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Refill Method</Label>
              <Select value={refillType} onValueChange={(value: 'pickup' | 'delivery') => setRefillType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pharmacy Pickup</SelectItem>
                  <SelectItem value="delivery">Home Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Preferred Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8-12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12-5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5-8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleBulkRefill} className="w-full">
            Request All Eligible Refills
          </Button>
        </CardContent>
      </Card>

      {/* Medication-Specific Pharmacy Management */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Pharmacy Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{medication.name}</p>
                  <p className="text-sm text-gray-600">Current: {medication.pharmacy}</p>
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => handlePharmacySwitch(medication.id, value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Switch pharmacy" />
                    </SelectTrigger>
                    <SelectContent>
                      {samplePharmacies.map((pharmacy) => (
                        <SelectItem key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    onClick={() => onRefillRequest(medication.id)}
                    disabled={medication.refillsRemaining === 0}
                  >
                    Refill
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
