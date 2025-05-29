
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Truck, MapPin, Battery, Clock, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface CrashCart {
  cartId: string;
  location: string;
  zone: string;
  status: 'ready' | 'in-use' | 'maintenance' | 'restocking';
  batteryLevel: number;
  lastChecked: Date;
  nextInspection: Date;
  equipment: EquipmentItem[];
  medications: MedicationItem[];
  assignedTo: string;
  lastUsed: Date | null;
  usageCount: number;
  alertsActive: string[];
}

interface EquipmentItem {
  name: string;
  status: 'ok' | 'needs-replacement' | 'missing' | 'expired';
  lastChecked: Date;
  expiryDate?: Date;
}

interface MedicationItem {
  name: string;
  quantity: number;
  expiryDate: Date;
  status: 'ok' | 'low-stock' | 'expired' | 'missing';
}

const mockCrashCarts: CrashCart[] = [
  {
    cartId: 'CART-ICU-01',
    location: 'ICU - Central Station',
    zone: 'ICU-A',
    status: 'ready',
    batteryLevel: 92,
    lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextInspection: new Date(Date.now() + 22 * 60 * 60 * 1000),
    assignedTo: 'RN Davis',
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    usageCount: 3,
    alertsActive: [],
    equipment: [
      { name: 'Defibrillator/AED', status: 'ok', lastChecked: new Date() },
      { name: 'Bag Valve Mask', status: 'ok', lastChecked: new Date() },
      { name: 'Laryngoscope', status: 'needs-replacement', lastChecked: new Date(), expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { name: 'IV Supplies', status: 'ok', lastChecked: new Date() },
      { name: 'Suction Device', status: 'ok', lastChecked: new Date() }
    ],
    medications: [
      { name: 'Epinephrine 1mg', quantity: 8, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), status: 'ok' },
      { name: 'Atropine 1mg', quantity: 3, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: 'low-stock' },
      { name: 'Amiodarone 150mg', quantity: 5, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), status: 'ok' },
      { name: 'Lidocaine 100mg', quantity: 6, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), status: 'ok' }
    ]
  },
  {
    cartId: 'CART-ICU-02',
    location: 'ICU - Room B5',
    zone: 'ICU-B',
    status: 'in-use',
    batteryLevel: 67,
    lastChecked: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextInspection: new Date(Date.now() + 18 * 60 * 60 * 1000),
    assignedTo: 'RN Johnson',
    lastUsed: new Date(),
    usageCount: 7,
    alertsActive: ['Battery < 70%', 'Equipment needs inspection'],
    equipment: [
      { name: 'Defibrillator/AED', status: 'ok', lastChecked: new Date() },
      { name: 'Bag Valve Mask', status: 'ok', lastChecked: new Date() },
      { name: 'Laryngoscope', status: 'ok', lastChecked: new Date() },
      { name: 'IV Supplies', status: 'missing', lastChecked: new Date() },
      { name: 'Suction Device', status: 'ok', lastChecked: new Date() }
    ],
    medications: [
      { name: 'Epinephrine 1mg', quantity: 4, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), status: 'low-stock' },
      { name: 'Atropine 1mg', quantity: 6, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: 'ok' },
      { name: 'Amiodarone 150mg', quantity: 2, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), status: 'low-stock' },
      { name: 'Lidocaine 100mg', quantity: 3, expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'expired' }
    ]
  }
];

export const CrashCartTracker = () => {
  const [carts, setCarts] = useState<CrashCart[]>(mockCrashCarts);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-600 text-white';
      case 'in-use': return 'bg-blue-600 text-white';
      case 'maintenance': return 'bg-yellow-500 text-white';
      case 'restocking': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600';
      case 'needs-replacement': return 'text-yellow-600';
      case 'low-stock': return 'text-yellow-600';
      case 'missing': return 'text-red-600';
      case 'expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level < 30) return 'text-red-600';
    if (level < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'in-use': return <Truck className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'restocking': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Crash Cart Tracker & Equipment Status
          </CardTitle>
          <CardDescription>
            Real-time monitoring of crash cart locations, equipment status, and medication inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-sm text-gray-600">Ready</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Truck className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-600">In Use</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Settings className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">98%</p>
                  <p className="text-sm text-gray-600">Readiness</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {carts.map((cart) => (
              <Card key={cart.cartId} className={`border-l-4 ${cart.status === 'ready' ? 'border-l-green-500' : cart.status === 'in-use' ? 'border-l-blue-500' : 'border-l-yellow-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{cart.cartId}</h3>
                      <Badge variant="outline">{cart.zone}</Badge>
                      <Badge className={getStatusColor(cart.status)}>
                        {getStatusIcon(cart.status)}
                        {cart.status.toUpperCase()}
                      </Badge>
                      {cart.alertsActive.length > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {cart.alertsActive.length} ALERTS
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Location: {cart.location}</p>
                      <p className="text-sm text-gray-500">Assigned: {cart.assignedTo}</p>
                    </div>
                  </div>

                  {cart.alertsActive.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Active Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {cart.alertsActive.map((alert, index) => (
                          <p key={index} className="text-sm text-red-700">• {alert}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Cart Status</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Battery Level</span>
                            <span className={`text-sm font-bold ${getBatteryColor(cart.batteryLevel)}`}>
                              {cart.batteryLevel}%
                            </span>
                          </div>
                          <Progress value={cart.batteryLevel} className="h-2" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Last Checked:</strong> {cart.lastChecked.toLocaleString()}</p>
                          <p><strong>Next Inspection:</strong> {cart.nextInspection.toLocaleDateString()}</p>
                          <p><strong>Usage Count:</strong> {cart.usageCount} times</p>
                          {cart.lastUsed && (
                            <p><strong>Last Used:</strong> {cart.lastUsed.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Equipment Status</h4>
                      <div className="space-y-2">
                        {cart.equipment.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className={`font-medium ${getItemStatusColor(item.status)}`}>
                              {item.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Medication Inventory</h4>
                      <div className="space-y-2">
                        {cart.medications.map((med, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between">
                              <span>{med.name}</span>
                              <span className={`font-medium ${getItemStatusColor(med.status)}`}>
                                {med.quantity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Exp: {med.expiryDate.toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {cart.status === 'in-use' && (
                      <Button size="sm" variant="destructive">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Location
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-1" />
                      Locate Cart
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Maintenance
                    </Button>
                    <Button size="sm" variant="outline">
                      <Battery className="h-4 w-4 mr-1" />
                      Check Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Restock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
