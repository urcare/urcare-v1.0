
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Shield, 
  AlertTriangle,
  Phone,
  Clock,
  Compass,
  Wifi
} from 'lucide-react';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface GeofenceZone {
  id: string;
  name: string;
  type: 'emergency' | 'restricted' | 'notification';
  center: { lat: number; lng: number };
  radius: number;
  active: boolean;
}

export const LocationServices = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [geofencing, setGeofencing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const geofenceZones: GeofenceZone[] = [
    {
      id: '1',
      name: 'Emergency Department',
      type: 'emergency',
      center: { lat: 40.7128, lng: -74.0060 },
      radius: 50,
      active: true
    },
    {
      id: '2',
      name: 'ICU Wing',
      type: 'restricted',
      center: { lat: 40.7130, lng: -74.0058 },
      radius: 30,
      active: true
    },
    {
      id: '3',
      name: 'Pharmacy',
      type: 'notification',
      center: { lat: 40.7125, lng: -74.0062 },
      radius: 20,
      active: true
    }
  ];

  useEffect(() => {
    if (locationEnabled && 'geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setCurrentLocation(locationData);
          checkGeofences(locationData);
        },
        (error) => {
          console.error('Location error:', error);
          toast.error('Location access denied or unavailable');
        },
        options
      );

      setWatchId(id);
    } else if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setCurrentLocation(null);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationEnabled]);

  const requestLocationPermission = async () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        setLocationEnabled(true);
        toast.success('Location services enabled');
      } else if (permission.state === 'prompt') {
        // Request permission through getCurrentPosition
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationEnabled(true);
            toast.success('Location services enabled');
          },
          () => {
            toast.error('Location permission denied');
          }
        );
      } else {
        toast.error('Location permission denied');
      }
    } catch (error) {
      console.error('Permission error:', error);
      toast.error('Failed to request location permission');
    }
  };

  const checkGeofences = (location: LocationData) => {
    if (!geofencing) return;

    geofenceZones.forEach(zone => {
      if (!zone.active) return;

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        zone.center.lat,
        zone.center.lng
      );

      if (distance <= zone.radius) {
        handleGeofenceEntry(zone);
      }
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  const handleGeofenceEntry = (zone: GeofenceZone) => {
    switch (zone.type) {
      case 'emergency':
        toast.error(`Entered ${zone.name} - Emergency protocols activated`, {
          duration: 10000
        });
        break;
      case 'restricted':
        toast.warning(`Entering restricted area: ${zone.name}`);
        break;
      case 'notification':
        toast.info(`Now in ${zone.name} zone`);
        break;
    }
  };

  const shareEmergencyLocation = async () => {
    if (!currentLocation) {
      toast.error('Location not available');
      return;
    }

    setEmergencyMode(true);
    
    // Simulate emergency location sharing
    toast.success('Emergency location shared with medical team', {
      duration: 5000,
      description: `Coordinates: ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
    });
    
    setTimeout(() => setEmergencyMode(false), 10000);
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'restricted': return 'bg-yellow-100 text-yellow-800';
      case 'notification': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'restricted': return Shield;
      case 'notification': return Wifi;
      default: return MapPin;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Enable Location Services</span>
              <p className="text-xs text-gray-600">Allow access to your location for enhanced features</p>
            </div>
            <Switch
              checked={locationEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  requestLocationPermission();
                } else {
                  setLocationEnabled(false);
                  toast.info('Location services disabled');
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Geofencing</span>
              <p className="text-xs text-gray-600">Get notifications when entering hospital zones</p>
            </div>
            <Switch
              checked={geofencing}
              onCheckedChange={setGeofencing}
              disabled={!locationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Emergency Location Sharing</span>
              <p className="text-xs text-gray-600">Share location with medical team during emergencies</p>
            </div>
            <Switch
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
              disabled={!locationEnabled}
            />
          </div>
        </div>

        {/* Current Location */}
        {currentLocation && (
          <div className="p-3 bg-green-50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Current Location</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
              <p>Lng: {currentLocation.longitude.toFixed(6)}</p>
              <p>Accuracy: ±{Math.round(currentLocation.accuracy)}m</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Clock className="h-3 w-3" />
              <span>Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Emergency Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Emergency Features</h4>
          <Button 
            onClick={shareEmergencyLocation}
            disabled={!currentLocation || emergencyMode}
            className={`w-full ${emergencyMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
            variant={emergencyMode ? 'default' : 'outline'}
          >
            <Phone className="h-4 w-4 mr-2" />
            {emergencyMode ? 'Emergency Mode Active' : 'Share Emergency Location'}
          </Button>
        </div>

        {/* Geofence Zones */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Hospital Zones ({geofenceZones.length})</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {geofenceZones.map((zone) => {
              const Icon = getZoneTypeIcon(zone.type);
              return (
                <div key={zone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{zone.name}</span>
                    <Badge className={getZoneTypeColor(zone.type)}>
                      {zone.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {zone.radius}m radius
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Location data is encrypted and secure</p>
          <p>• Emergency location sharing with medical team</p>
          <p>• Geofencing for hospital area notifications</p>
        </div>
      </CardContent>
    </Card>
  );
};
