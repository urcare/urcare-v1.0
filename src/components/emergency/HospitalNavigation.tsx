
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navigation, MapPin, Clock, AlertTriangle, Car, Hospital } from 'lucide-react';
import { toast } from 'sonner';

interface Route {
  id: string;
  hospitalName: string;
  hospitalAddress: string;
  distance: number;
  estimatedTime: number;
  trafficLevel: 'light' | 'moderate' | 'heavy';
  routeType: 'fastest' | 'shortest' | 'traffic-aware';
  steps: RouteStep[];
  alternateRoutes: number;
  emergencyLane: boolean;
}

interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  icon: string;
}

export const HospitalNavigation = () => {
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('Current Location');
  const [isNavigating, setIsNavigating] = useState(false);
  const [eta, setEta] = useState<number>(0);

  const mockRoutes: Route[] = [
    {
      id: '1',
      hospitalName: 'City General Hospital Emergency',
      hospitalAddress: '123 Medical Center Dr, City, ST 12345',
      distance: 2.3,
      estimatedTime: 8,
      trafficLevel: 'light',
      routeType: 'fastest',
      alternateRoutes: 2,
      emergencyLane: true,
      steps: [
        { instruction: 'Head north on Main St', distance: '0.5 mi', duration: '2 min', icon: '↑' },
        { instruction: 'Turn right onto Medical Dr', distance: '0.8 mi', duration: '3 min', icon: '→' },
        { instruction: 'Emergency entrance on left', distance: '1.0 mi', duration: '3 min', icon: '🏥' }
      ]
    },
    {
      id: '2',
      hospitalName: 'Regional Medical Center',
      hospitalAddress: '456 Healthcare Blvd, City, ST 12345',
      distance: 4.7,
      estimatedTime: 15,
      trafficLevel: 'moderate',
      routeType: 'traffic-aware',
      alternateRoutes: 3,
      emergencyLane: false,
      steps: [
        { instruction: 'Head south on Main St', distance: '1.2 mi', duration: '5 min', icon: '↓' },
        { instruction: 'Merge onto Highway 101 N', distance: '2.5 mi', duration: '7 min', icon: '🛣️' },
        { instruction: 'Exit 15B - Healthcare Blvd', distance: '1.0 mi', duration: '3 min', icon: '↗️' }
      ]
    }
  ];

  useEffect(() => {
    if (isNavigating && eta > 0) {
      const timer = setTimeout(() => setEta(eta - 1), 60000); // Decrease every minute
      return () => clearTimeout(timer);
    }
  }, [isNavigating, eta]);

  const startNavigation = (route: Route) => {
    setActiveRoute(route);
    setIsNavigating(true);
    setEta(route.estimatedTime);
    
    toast.success(`Navigation started to ${route.hospitalName}`);
    
    // Simulate real-time traffic updates
    setTimeout(() => {
      toast.info('Traffic update: Route is clear, emergency lane available');
    }, 30000);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setActiveRoute(null);
    setEta(0);
    toast.success('Navigation stopped');
  };

  const callEmergencyServices = () => {
    toast.success('Calling 911 - Emergency services notified of route');
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'heavy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrafficBadgeColor = (level: string) => {
    switch (level) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isNavigating && activeRoute) {
    return (
      <div className="space-y-4">
        <Card className="border-blue-500 bg-blue-50">
          <CardHeader className="bg-blue-100">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Navigation className="h-6 w-6" />
              NAVIGATING TO: {activeRoute.hospitalName}
            </CardTitle>
            <CardDescription className="text-blue-700">
              Emergency route active with real-time traffic updates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded border">
                <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{eta} min</p>
                <p className="text-sm text-gray-600">ETA</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <MapPin className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold">{activeRoute.distance} mi</p>
                <p className="text-sm text-gray-600">Distance</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <Car className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <Badge className={getTrafficBadgeColor(activeRoute.trafficLevel)}>
                  {activeRoute.trafficLevel} traffic
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Turn-by-Turn Directions</h4>
              {activeRoute.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{step.instruction}</p>
                    <p className="text-sm text-gray-600">{step.distance} • {step.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeRoute.emergencyLane && (
              <div className="p-3 bg-green-100 rounded border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Emergency Lane Available</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Emergency vehicles have priority access on this route
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={callEmergencyServices} className="flex-1 bg-red-600 hover:bg-red-700">
                Call 911
              </Button>
              <Button onClick={stopNavigation} variant="outline">
                Stop Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Emergency Hospital Navigation
          </CardTitle>
          <CardDescription>
            Real-time traffic-aware navigation to nearest emergency facilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Current Location</span>
            </div>
            <p className="text-sm text-gray-600">{currentLocation}</p>
          </div>

          <Button 
            onClick={callEmergencyServices} 
            className="w-full bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Call 911 First - Then Navigate
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Nearest Emergency Facilities</h3>
        
        {mockRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hospital className="h-5 w-5" />
                    {route.hospitalName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {route.hospitalAddress}
                  </CardDescription>
                </div>
                <Badge className={getTrafficBadgeColor(route.trafficLevel)}>
                  {route.trafficLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{route.distance} mi</p>
                  <p className="text-xs text-gray-600">Distance</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{route.estimatedTime} min</p>
                  <p className="text-xs text-gray-600">ETA</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{route.alternateRoutes}</p>
                  <p className="text-xs text-gray-600">Alt Routes</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {route.routeType}
                </Badge>
                {route.emergencyLane && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Emergency Lane
                  </Badge>
                )}
              </div>

              <Button 
                onClick={() => startNavigation(route)}
                className="w-full"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">Emergency Navigation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-amber-700 space-y-2">
            <li>• <strong>Call 911 first</strong> - Emergency services can provide escort and traffic control</li>
            <li>• <strong>Emergency lanes:</strong> Use only when authorized by emergency services</li>
            <li>• <strong>Traffic updates:</strong> Routes automatically adjust for traffic and road closures</li>
            <li>• <strong>Hospital notifications:</strong> Destination hospitals are automatically notified of incoming emergency</li>
            <li>• <strong>Alternative routes:</strong> Multiple options available in case of road blocks</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
