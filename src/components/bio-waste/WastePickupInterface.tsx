
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  QrCode, 
  Scan, 
  MapPin, 
  Calendar, 
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Route
} from 'lucide-react';

export const WastePickupInterface = () => {
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const pickupSchedule = [
    {
      id: 'WP001',
      location: 'ICU Ward A',
      type: 'Red Bag Waste',
      scheduledTime: '09:00 AM',
      status: 'pending',
      weight: '25 kg',
      containers: 8
    },
    {
      id: 'WP002',
      location: 'Operating Room 3',
      type: 'Pathological Waste',
      scheduledTime: '10:30 AM',
      status: 'in-progress',
      weight: '12 kg',
      containers: 3
    },
    {
      id: 'WP003',
      location: 'Laboratory',
      type: 'Chemical Waste',
      scheduledTime: '11:00 AM',
      status: 'completed',
      weight: '8 kg',
      containers: 5
    }
  ];

  const routeOptimization = {
    totalStops: 15,
    estimatedTime: '4.5 hours',
    distance: '28.5 km',
    fuelEfficiency: '92%'
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Waste Pickup Interface</h3>
          <p className="text-gray-600">QR code scanning, schedule management, and route optimization</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={scanMode ? "default" : "outline"}
            onClick={() => setScanMode(!scanMode)}
          >
            <Scan className="w-4 h-4 mr-2" />
            {scanMode ? 'Stop Scanning' : 'Start QR Scan'}
          </Button>
          <Button>
            <Route className="w-4 h-4 mr-2" />
            Optimize Route
          </Button>
        </div>
      </div>

      {/* QR Code Scanner */}
      {scanMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan waste container QR codes for pickup verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Camera viewfinder would appear here</p>
                  <p className="text-sm text-gray-400">Position QR code within the frame</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Or enter QR code manually"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                />
                <Button>Process Code</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Optimization Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Route Optimization
          </CardTitle>
          <CardDescription>Optimized pickup routes for maximum efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{routeOptimization.totalStops}</div>
              <div className="text-sm text-blue-700">Total Stops</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{routeOptimization.estimatedTime}</div>
              <div className="text-sm text-green-700">Est. Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{routeOptimization.distance}</div>
              <div className="text-sm text-purple-700">Distance</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{routeOptimization.fuelEfficiency}</div>
              <div className="text-sm text-orange-700">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Pickup Schedule
          </CardTitle>
          <CardDescription>Scheduled waste collections for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pickupSchedule.map((pickup) => (
              <div key={pickup.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{pickup.location}</h4>
                      {getStatusBadge(pickup.status)}
                    </div>
                    <p className="text-sm text-gray-600">{pickup.type}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{pickup.scheduledTime}</p>
                    <p className="text-xs text-gray-500">ID: {pickup.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Weight: {pickup.weight}</span>
                    <span>Containers: {pickup.containers}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {pickup.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-1" />
                          Navigate
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Start Pickup
                        </Button>
                      </>
                    )}
                    {pickup.status === 'in-progress' && (
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {pickup.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
