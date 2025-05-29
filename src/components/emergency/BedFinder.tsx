
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bed, Hospital, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  travelTime: string;
  phone: string;
  specialties: string[];
  beds: {
    emergency: number;
    icu: number;
    general: number;
    pediatric: number;
  };
  waitTime: string;
  traumaLevel: number;
  lastUpdated: Date;
}

export const BedFinder = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedBedType, setSelectedBedType] = useState<keyof Hospital['beds']>('emergency');
  const [isLoading, setIsLoading] = useState(false);

  const mockHospitals: Hospital[] = [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, City, ST 12345',
      distance: 2.3,
      travelTime: '8 mins',
      phone: '+1-555-0100',
      specialties: ['Emergency Medicine', 'Trauma', 'Cardiology'],
      beds: { emergency: 12, icu: 3, general: 45, pediatric: 8 },
      waitTime: '15 mins',
      traumaLevel: 1,
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Regional Medical Center',
      address: '456 Healthcare Blvd, City, ST 12345',
      distance: 4.7,
      travelTime: '12 mins',
      phone: '+1-555-0200',
      specialties: ['Emergency Medicine', 'Surgery', 'Pediatrics'],
      beds: { emergency: 8, icu: 1, general: 32, pediatric: 12 },
      waitTime: '25 mins',
      traumaLevel: 2,
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'University Hospital',
      address: '789 University Ave, City, ST 12345',
      distance: 6.1,
      travelTime: '18 mins',
      phone: '+1-555-0300',
      specialties: ['Emergency Medicine', 'Neurology', 'Oncology'],
      beds: { emergency: 15, icu: 5, general: 78, pediatric: 6 },
      waitTime: '10 mins',
      traumaLevel: 1,
      lastUpdated: new Date()
    }
  ];

  useEffect(() => {
    findNearbyHospitals();
  }, [searchRadius]);

  const findNearbyHospitals = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to hospital database
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const filteredHospitals = mockHospitals.filter(h => h.distance <= searchRadius);
      setHospitals(filteredHospitals);
      
      toast.success(`Found ${filteredHospitals.length} hospitals within ${searchRadius} miles`);
    } catch (error) {
      toast.error('Failed to fetch hospital data');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHospital = (hospital: Hospital) => {
    toast.success(`Starting navigation to ${hospital.name}`);
    // Would integrate with maps API
  };

  const callHospital = (hospital: Hospital) => {
    toast.success(`Calling ${hospital.name}`);
    // Would initiate phone call
  };

  const getBedAvailabilityColor = (count: number) => {
    if (count >= 10) return 'bg-green-100 text-green-800';
    if (count >= 5) return 'bg-yellow-100 text-yellow-800';
    if (count >= 1) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-6 w-6" />
            Hospital Bed Finder
          </CardTitle>
          <CardDescription>
            Real-time hospital bed availability and emergency services near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Search Radius (miles)</label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                min="1"
                max="50"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Bed Type</label>
              <select
                value={selectedBedType}
                onChange={(e) => setSelectedBedType(e.target.value as keyof Hospital['beds'])}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="emergency">Emergency</option>
                <option value="icu">ICU</option>
                <option value="general">General</option>
                <option value="pediatric">Pediatric</option>
              </select>
            </div>
          </div>
          
          <Button onClick={findNearbyHospitals} disabled={isLoading} className="w-full">
            {isLoading ? 'Searching...' : 'Refresh Hospital Data'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hospital className="h-5 w-5" />
                    {hospital.name}
                    {hospital.traumaLevel === 1 && (
                      <Badge className="bg-red-100 text-red-800">Level 1 Trauma</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {hospital.address}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{hospital.distance} mi</p>
                  <p className="text-sm text-gray-600">{hospital.travelTime}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">Emergency</p>
                  <Badge className={getBedAvailabilityColor(hospital.beds.emergency)}>
                    {hospital.beds.emergency} beds
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">ICU</p>
                  <Badge className={getBedAvailabilityColor(hospital.beds.icu)}>
                    {hospital.beds.icu} beds
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">General</p>
                  <Badge className={getBedAvailabilityColor(hospital.beds.general)}>
                    {hospital.beds.general} beds
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Pediatric</p>
                  <Badge className={getBedAvailabilityColor(hospital.beds.pediatric)}>
                    {hospital.beds.pediatric} beds
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Wait Time: {hospital.waitTime}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {hospital.lastUpdated.toLocaleTimeString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => navigateToHospital(hospital)}
                  className="flex-1"
                  variant="default"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button 
                  onClick={() => callHospital(hospital)}
                  variant="outline"
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hospitals.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Hospital className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hospitals found within {searchRadius} miles</p>
            <p className="text-sm text-gray-500">Try increasing the search radius</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
