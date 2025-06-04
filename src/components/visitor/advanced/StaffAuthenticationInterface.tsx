
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Wifi, 
  Clock, 
  User,
  CheckCircle,
  XCircle,
  History,
  Settings
} from 'lucide-react';

export const StaffAuthenticationInterface = () => {
  const [rfidReaderStatus, setRfidReaderStatus] = useState('active');
  const [lastAuthAttempt, setLastAuthAttempt] = useState(null);

  const staffAccessHistory = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Senior Physician',
      department: 'Cardiology',
      timestamp: '2024-06-04 14:30:15',
      location: 'ICU Entrance',
      method: 'RFID Badge',
      status: 'granted'
    },
    {
      id: '2',
      name: 'Nurse Mike Wilson',
      role: 'Registered Nurse',
      department: 'Emergency',
      timestamp: '2024-06-04 14:28:42',
      location: 'Pharmacy',
      method: 'NFC Phone',
      status: 'granted'
    },
    {
      id: '3',
      name: 'John Maintenance',
      role: 'Maintenance Worker',
      department: 'Facilities',
      timestamp: '2024-06-04 14:25:18',
      location: 'Operating Room',
      method: 'RFID Badge',
      status: 'denied'
    }
  ];

  const readerDevices = [
    {
      id: 'reader_001',
      location: 'Main Entrance',
      type: 'RFID/NFC Dual',
      status: 'online',
      lastActivity: '2024-06-04 14:30:15'
    },
    {
      id: 'reader_002',
      location: 'ICU Entrance',
      type: 'RFID',
      status: 'online',
      lastActivity: '2024-06-04 14:28:42'
    },
    {
      id: 'reader_003',
      location: 'Emergency Dept',
      type: 'NFC',
      status: 'offline',
      lastActivity: '2024-06-04 13:45:22'
    },
    {
      id: 'reader_004',
      location: 'Pharmacy',
      type: 'RFID/NFC Dual',
      status: 'maintenance',
      lastActivity: '2024-06-04 14:25:18'
    }
  ];

  const roleHierarchy = [
    { role: 'Administrator', level: 5, color: 'red' },
    { role: 'Senior Physician', level: 4, color: 'purple' },
    { role: 'Physician', level: 3, color: 'blue' },
    { role: 'Registered Nurse', level: 3, color: 'green' },
    { role: 'Technician', level: 2, color: 'yellow' },
    { role: 'Support Staff', level: 1, color: 'gray' }
  ];

  const getStatusBadge = (status) => {
    const config = {
      granted: { label: 'Access Granted', className: 'bg-green-100 text-green-800' },
      denied: { label: 'Access Denied', className: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const getReaderStatusBadge = (status) => {
    const config = {
      online: { label: 'Online', className: 'bg-green-100 text-green-800' },
      offline: { label: 'Offline', className: 'bg-red-100 text-red-800' },
      maintenance: { label: 'Maintenance', className: 'bg-yellow-100 text-yellow-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Staff Authentication Interface</h3>
          <p className="text-gray-600">RFID/NFC tag readers with role verification and access history</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Reader Config
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Security Status
          </Button>
        </div>
      </div>

      {/* Real-time Reader Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {readerDevices.map((reader) => (
          <Card key={reader.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Wifi className={`w-6 h-6 ${reader.status === 'online' ? 'text-green-600' : 'text-red-600'}`} />
                {getReaderStatusBadge(reader.status)}
              </div>
              <h4 className="font-medium text-sm mb-1">{reader.location}</h4>
              <p className="text-xs text-gray-600 mb-2">{reader.type}</p>
              <div className="text-xs text-gray-500">
                Last: {reader.lastActivity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Verification Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Role Hierarchy & Access Levels
          </CardTitle>
          <CardDescription>Staff role verification and permission levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleHierarchy.map((item) => (
              <div key={item.role} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.role}</h4>
                  <Badge className={`bg-${item.color}-100 text-${item.color}-800`}>
                    Level {item.level}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${item.color}-600 h-2 rounded-full`}
                    style={{ width: `${(item.level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Authentication Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Real-time Access History
          </CardTitle>
          <CardDescription>Live staff authentication attempts and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffAccessHistory.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{entry.name}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <p className="text-sm text-gray-600">{entry.role} • {entry.department}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{entry.timestamp}</p>
                    <p className="text-xs text-gray-500">{entry.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {entry.status === 'granted' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>Authentication via {entry.method}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {entry.status === 'denied' && (
                      <Button size="sm">Override</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">247</div>
                <div className="text-sm text-gray-600">Successful Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Failed Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Currently Inside</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wifi className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8/10</div>
                <div className="text-sm text-gray-600">Readers Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
