
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, User, MapPin, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface BedInfo {
  id: string;
  roomNumber: string;
  ward: string;
  bedType: 'general' | 'private' | 'icu' | 'emergency';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  patientName?: string;
  patientId?: string;
  admissionDate?: string;
  expectedDischarge?: string;
  floor: number;
}

const mockBeds: BedInfo[] = [
  { id: 'B001', roomNumber: '101', ward: 'General', bedType: 'general', status: 'occupied', patientName: 'John Doe', patientId: 'P001', admissionDate: '2024-01-15', expectedDischarge: '2024-01-18', floor: 1 },
  { id: 'B002', roomNumber: '102', ward: 'General', bedType: 'general', status: 'available', floor: 1 },
  { id: 'B003', roomNumber: '103', ward: 'General', bedType: 'private', status: 'occupied', patientName: 'Jane Smith', patientId: 'P002', admissionDate: '2024-01-16', expectedDischarge: '2024-01-19', floor: 1 },
  { id: 'B004', roomNumber: '104', ward: 'General', bedType: 'general', status: 'maintenance', floor: 1 },
  { id: 'B005', roomNumber: '201', ward: 'ICU', bedType: 'icu', status: 'occupied', patientName: 'Mike Johnson', patientId: 'P003', admissionDate: '2024-01-14', floor: 2 },
  { id: 'B006', roomNumber: '202', ward: 'ICU', bedType: 'icu', status: 'available', floor: 2 },
  { id: 'B007', roomNumber: '301', ward: 'Private', bedType: 'private', status: 'reserved', floor: 3 },
  { id: 'B008', roomNumber: '302', ward: 'Private', bedType: 'private', status: 'available', floor: 3 }
];

export const BedAllocationMap = () => {
  const [beds, setBeds] = useState<BedInfo[]>(mockBeds);
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedBed, setSelectedBed] = useState<string | null>(null);

  const filteredBeds = beds.filter(bed => {
    const wardMatch = selectedWard === 'all' || bed.ward === selectedWard;
    const floorMatch = selectedFloor === 'all' || bed.floor.toString() === selectedFloor;
    return wardMatch && floorMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'reserved': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getBedTypeIcon = (bedType: string) => {
    return <Bed className={`h-6 w-6 ${bedType === 'icu' ? 'text-red-600' : bedType === 'private' ? 'text-blue-600' : 'text-gray-600'}`} />;
  };

  const handleBedAction = (bedId: string, action: 'allocate' | 'release' | 'maintenance') => {
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        switch (action) {
          case 'allocate':
            return { ...bed, status: 'reserved' as const };
          case 'release':
            return { ...bed, status: 'available' as const, patientName: undefined, patientId: undefined };
          case 'maintenance':
            return { ...bed, status: 'maintenance' as const };
          default:
            return bed;
        }
      }
      return bed;
    }));
    
    toast.success(`Bed ${action} action completed`);
  };

  const availableBeds = beds.filter(bed => bed.status === 'available').length;
  const occupiedBeds = beds.filter(bed => bed.status === 'occupied').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{occupiedBeds}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{maintenanceBeds}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{beds.length}</div>
            <div className="text-sm text-gray-600">Total Beds</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Bed & Room Allocation Map
          </CardTitle>
          <CardDescription>
            Real-time bed availability and patient allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedWard} onValueChange={setSelectedWard}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wards</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => (
              <div 
                key={bed.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedBed === bed.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedBed(bed.id === selectedBed ? null : bed.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getBedTypeIcon(bed.bedType)}
                    <span className="font-semibold">{bed.roomNumber}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(bed.status)}`} />
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ward:</span>
                    <span>{bed.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {bed.bedType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`text-xs ${getStatusColor(bed.status)} text-white`}>
                      {bed.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {bed.patientName && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{bed.patientName}</span>
                    </div>
                    <div className="text-gray-600">ID: {bed.patientId}</div>
                    {bed.admissionDate && (
                      <div className="text-gray-600">
                        Admitted: {new Date(bed.admissionDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {selectedBed === bed.id && (
                  <div className="mt-3 space-y-2">
                    {bed.status === 'available' && (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBedAction(bed.id, 'allocate');
                        }}
                      >
                        Allocate Bed
                      </Button>
                    )}
                    {bed.status === 'occupied' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBedAction(bed.id, 'release');
                        }}
                      >
                        Release Bed
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBedAction(bed.id, 'maintenance');
                      }}
                    >
                      Mark Maintenance
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
