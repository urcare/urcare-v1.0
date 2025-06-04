
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Smartphone, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Key,
  Camera,
  User
} from 'lucide-react';

export const QREntrySystem = () => {
  const [scanMode, setScanMode] = useState('qr');
  const [entryCode, setEntryCode] = useState('');

  const activeEntries = [
    {
      id: '1',
      visitorName: 'John Smith',
      code: 'QR-2024-001',
      entryTime: '09:30 AM',
      zone: 'ICU',
      validUntil: '06:00 PM',
      status: 'active',
      method: 'qr'
    },
    {
      id: '2',
      visitorName: 'Emily Johnson',
      code: 'OTP-456789',
      entryTime: '02:15 PM',
      zone: 'Administration',
      validUntil: '05:00 PM',
      status: 'active',
      method: 'otp'
    },
    {
      id: '3',
      visitorName: 'Robert Brown',
      code: 'QR-2024-003',
      entryTime: '08:00 AM',
      zone: 'Maintenance',
      validUntil: 'Expired',
      status: 'expired',
      method: 'qr'
    }
  ];

  const entryLogs = [
    {
      id: '1',
      timestamp: '2024-06-04 09:30:15',
      visitor: 'John Smith',
      action: 'Entry',
      gate: 'Main Entrance',
      method: 'QR Code',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-06-04 14:15:22',
      visitor: 'Emily Johnson',
      action: 'Entry',
      gate: 'Admin Entrance',
      method: 'OTP',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2024-06-04 11:45:30',
      visitor: 'Michael Davis',
      action: 'Entry Denied',
      gate: 'Main Entrance',
      method: 'QR Code',
      status: 'failed'
    }
  ];

  const guardStations = [
    {
      id: '1',
      name: 'Main Entrance',
      guard: 'Security Officer A',
      status: 'online',
      lastActivity: '2 min ago',
      todayEntries: 45
    },
    {
      id: '2',
      name: 'Emergency Entrance',
      guard: 'Security Officer B',
      status: 'online',
      lastActivity: '5 min ago',
      todayEntries: 12
    },
    {
      id: '3',
      name: 'Staff Entrance',
      guard: 'Security Officer C',
      status: 'offline',
      lastActivity: '1 hour ago',
      todayEntries: 23
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      qr: { label: 'QR Code', className: 'bg-blue-100 text-blue-800' },
      otp: { label: 'OTP', className: 'bg-purple-100 text-purple-800' },
      biometric: { label: 'Biometric', className: 'bg-green-100 text-green-800' }
    };
    const config = methodConfig[method];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getActionBadge = (status) => {
    if (status === 'success') return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    if (status === 'failed') return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  const getGuardStatusBadge = (status) => {
    if (status === 'online') return <Badge className="bg-green-100 text-green-800">Online</Badge>;
    if (status === 'offline') return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Away</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">QR/OTP Entry System</h3>
          <p className="text-gray-600">Mobile-responsive entry verification for guards and visitors</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <QrCode className="w-4 h-4 mr-2" />
            Generate Pass
          </Button>
        </div>
      </div>

      {/* Entry Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Entry Scanner
            </CardTitle>
            <CardDescription>Scan QR codes or enter OTP for visitor entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={scanMode === 'qr' ? 'default' : 'outline'}
                  onClick={() => setScanMode('qr')}
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button 
                  variant={scanMode === 'otp' ? 'default' : 'outline'}
                  onClick={() => setScanMode('otp')}
                  className="flex-1"
                >
                  <Key className="w-4 h-4 mr-2" />
                  OTP Entry
                </Button>
              </div>
              
              {scanMode === 'qr' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">QR Code Scanner</h4>
                  <p className="text-sm text-gray-500 mb-4">Position QR code within the frame</p>
                  <Button>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Scanner
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Enter 6-Digit OTP</label>
                    <Input 
                      placeholder="123456" 
                      maxLength={6}
                      value={entryCode}
                      onChange={(e) => setEntryCode(e.target.value)}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>
                  <Button className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Verify OTP
                  </Button>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Features
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Time-based code validation</li>
                  <li>• Location-based verification</li>
                  <li>• Real-time audit logging</li>
                  <li>• Automatic expiration handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile Visitor Interface
            </CardTitle>
            <CardDescription>Visitor self-service entry options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <h4 className="font-medium mb-3">Visitor Access Pass</h4>
                <div className="flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24" />
                </div>
                <div className="text-center text-sm">
                  <p>John Smith</p>
                  <p>Valid until: 6:00 PM Today</p>
                  <p>Zone: ICU</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Send to Mobile
                </Button>
                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Generate OTP
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Code
                </Button>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Codes expire automatically for security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Active Entry Passes</CardTitle>
          <CardDescription>Currently valid visitor access codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEntries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{entry.visitorName}</span>
                    {getStatusBadge(entry.status)}
                    {getMethodBadge(entry.method)}
                  </div>
                  <span className="text-sm text-gray-500">{entry.code}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Entry Time</p>
                    <p className="font-medium">{entry.entryTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Access Zone</p>
                    <p className="font-medium">{entry.zone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valid Until</p>
                    <p className="font-medium">{entry.validUntil}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <QrCode className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">Revoke</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guard Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guard Stations
          </CardTitle>
          <CardDescription>Real-time status of security checkpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guardStations.map((station) => (
              <div key={station.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{station.name}</h4>
                  {getGuardStatusBadge(station.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guard:</span>
                    <span>{station.guard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Activity:</span>
                    <span>{station.lastActivity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Today's Entries:</span>
                    <span className="font-medium">{station.todayEntries}</span>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="w-full mt-3">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entry Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entry Logs</CardTitle>
          <CardDescription>Real-time entry and exit activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entryLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-medium">{log.visitor}</p>
                    <p className="text-gray-500">{log.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-gray-500">{log.gate} • {log.method}</p>
                  </div>
                  {getActionBadge(log.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
