
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Truck, MapPin, Clock, Package, Star } from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryService {
  id: string;
  name: string;
  deliveryTime: string;
  cost: number;
  rating: number;
  features: string[];
}

const deliveryServices: DeliveryService[] = [
  {
    id: '1',
    name: 'MedExpress',
    deliveryTime: '2-4 hours',
    cost: 0,
    rating: 4.8,
    features: ['Free delivery', 'Temperature controlled', 'Real-time tracking']
  },
  {
    id: '2',
    name: 'PharmaDash',
    deliveryTime: '1-2 hours',
    cost: 4.99,
    rating: 4.6,
    features: ['Express delivery', 'Text notifications', 'Contactless delivery']
  },
  {
    id: '3',
    name: 'CareRx Delivery',
    deliveryTime: 'Next day',
    cost: 0,
    rating: 4.9,
    features: ['Free delivery', 'Scheduled delivery', 'Medication consultation']
  }
];

interface DeliveryInterfaceProps {
  medications: any[];
  deliveryEnabled: boolean;
  onDeliveryToggle: (enabled: boolean) => void;
}

export const DeliveryInterface = ({ medications, deliveryEnabled, onDeliveryToggle }: DeliveryInterfaceProps) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, City, ST 12345');
  const [autoRefill, setAutoRefill] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const handleScheduleDelivery = (medicationId: string) => {
    if (!selectedService) {
      toast.error('Please select a delivery service');
      return;
    }

    const service = deliveryServices.find(s => s.id === selectedService);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Scheduling delivery...',
        success: `Delivery scheduled with ${service?.name}. ETA: ${service?.deliveryTime}`,
        error: 'Failed to schedule delivery'
      }
    );
  };

  const handleBulkDelivery = () => {
    const eligibleMeds = medications.filter(med => med.refillsRemaining > 0);
    if (eligibleMeds.length === 0) {
      toast.error('No medications available for delivery');
      return;
    }

    toast.success(`Bulk delivery scheduled for ${eligibleMeds.length} medications`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Medicine Delivery Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Delivery Toggle */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <Label className="text-base">Enable Home Delivery</Label>
              <p className="text-sm text-gray-600">Get medications delivered to your door</p>
            </div>
            <Switch checked={deliveryEnabled} onCheckedChange={onDeliveryToggle} />
          </div>

          {deliveryEnabled && (
            <>
              {/* Delivery Address */}
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>

              {/* Delivery Services */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Available Delivery Services</Label>
                <div className="grid gap-3">
                  {deliveryServices.map((service) => (
                    <div 
                      key={service.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{service.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.deliveryTime}
                          </Badge>
                          <p className="text-sm font-medium">
                            {service.cost === 0 ? 'Free' : `$${service.cost}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Delivery Preferences</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Refill Delivery</Label>
                    <p className="text-sm text-gray-600">Automatically schedule deliveries when refills are due</p>
                  </div>
                  <Switch checked={autoRefill} onCheckedChange={setAutoRefill} />
                </div>

                <div className="space-y-2">
                  <Label>Delivery Instructions</Label>
                  <Input
                    placeholder="e.g., Leave at front door, Ring doorbell"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Delivery Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8-12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12-5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5-8 PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Delivery Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button onClick={handleBulkDelivery} className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Schedule Bulk Delivery
                </Button>
                <Button variant="outline" className="flex-1">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Deliveries
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Individual Medication Delivery */}
      {deliveryEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Medication Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-600">
                      {medication.refillsRemaining} refills remaining
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleScheduleDelivery(medication.id)}
                    disabled={medication.refillsRemaining === 0}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Schedule Delivery
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
