
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Shield, 
  Plus,
  Edit,
  Settings,
  Clock,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const VisitorCategoryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const visitorCategories = [
    {
      id: '1',
      name: 'Family Members',
      description: 'Immediate family visiting patients',
      color: 'blue',
      accessLevel: 'Standard',
      activeVisitors: 23,
      totalToday: 45,
      permissions: {
        zones: ['Patient Rooms', 'Cafeteria', 'Waiting Areas'],
        timeRestrictions: '6:00 AM - 10:00 PM',
          escortRequired: false,
          maxDuration: '8 hours',
          specialApproval: false
      },
      restrictions: [
        'No access to ICU without permission',
        'Limited to assigned patient rooms',
        'Must check out by 10:00 PM'
      ]
    },
    {
      id: '2',
      name: 'Vendors & Contractors',
      description: 'Business partners and service providers',
      color: 'purple',
      accessLevel: 'Restricted',
      activeVisitors: 8,
      totalToday: 15,
      permissions: {
        zones: ['Administration', 'Maintenance Areas', 'Loading Dock'],
        timeRestrictions: '7:00 AM - 6:00 PM',
        escortRequired: true,
        maxDuration: '4 hours',
        specialApproval: true
      },
      restrictions: [
        'Escort required at all times',
        'No patient area access',
        'Business hours only',
        'Background check required'
      ]
    },
    {
      id: '3',
      name: 'VIP Guests',
      description: 'Board members, donors, and special guests',
      color: 'gold',
      accessLevel: 'Premium',
      activeVisitors: 2,
      totalToday: 4,
      permissions: {
        zones: ['All Public Areas', 'Administrative Offices', 'Conference Rooms'],
        timeRestrictions: '24/7 Access',
        escortRequired: false,
        maxDuration: 'Unlimited',
        specialApproval: false
      },
      restrictions: [
        'No clinical areas without approval',
        'Executive escort for sensitive areas'
      ]
    },
    {
      id: '4',
      name: 'Medical Students',
      description: 'Students and medical residents',
      color: 'green',
      accessLevel: 'Educational',
      activeVisitors: 12,
      totalToday: 18,
      permissions: {
        zones: ['Patient Rooms', 'Labs', 'Conference Rooms', 'Library'],
        timeRestrictions: '6:00 AM - 8:00 PM',
        escortRequired: false,
        maxDuration: '12 hours',
        specialApproval: false
      },
      restrictions: [
        'Supervisor approval required',
        'No ICU access without attending',
        'Patient consent required'
      ]
    }
  ];

  const permissionMatrix = [
    { zone: 'Main Lobby', family: true, vendor: true, vip: true, student: true },
    { zone: 'Patient Rooms', family: true, vendor: false, vip: false, student: true },
    { zone: 'ICU', family: false, vendor: false, vip: false, student: false },
    { zone: 'Emergency Dept', family: false, vendor: false, vip: false, student: true },
    { zone: 'Operating Rooms', family: false, vendor: false, vip: false, student: false },
    { zone: 'Administration', family: false, vendor: true, vip: true, student: false },
    { zone: 'Pharmacy', family: false, vendor: true, vip: false, student: true },
    { zone: 'Laboratory', family: false, vendor: true, vip: false, student: true },
    { zone: 'Cafeteria', family: true, vendor: true, vip: true, student: true },
    { zone: 'Gift Shop', family: true, vendor: false, vip: true, student: true }
  ];

  const getCategoryBadge = (color) => {
    const colorConfig = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      gold: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800'
    };
    return colorConfig[color] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelBadge = (level) => {
    const levelConfig = {
      Standard: 'bg-blue-100 text-blue-800',
      Restricted: 'bg-red-100 text-red-800',
      Premium: 'bg-purple-100 text-purple-800',
      Educational: 'bg-green-100 text-green-800'
    };
    return levelConfig[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Visitor Category Manager</h3>
          <p className="text-gray-600">Configure access permissions and restrictions for different visitor types</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Global Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {visitorCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className={getCategoryBadge(category.color)}>
                  {category.name}
                </Badge>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Now:</span>
                  <span className="font-medium">{category.activeVisitors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Today Total:</span>
                  <span className="font-medium">{category.totalToday}</span>
                </div>
                <Progress 
                  value={(category.activeVisitors / category.totalToday) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="mt-3">
                <Badge className={getAccessLevelBadge(category.accessLevel)} variant="outline">
                  {category.accessLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Permission Matrix
          </CardTitle>
          <CardDescription>Zone access permissions by visitor category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Zone/Area</th>
                  <th className="text-center p-3">Family</th>
                  <th className="text-center p-3">Vendor</th>
                  <th className="text-center p-3">VIP</th>
                  <th className="text-center p-3">Student</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{row.zone}</td>
                    <td className="p-3 text-center">
                      {row.family ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.vendor ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.vip ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.student ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visitorCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {category.name}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Permissions
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Access Level:</span>
                      <Badge className={getAccessLevelBadge(category.accessLevel)}>
                        {category.accessLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Restrictions:</span>
                      <span className="font-medium">{category.permissions.timeRestrictions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Duration:</span>
                      <span className="font-medium">{category.permissions.maxDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escort Required:</span>
                      <Badge variant={category.permissions.escortRequired ? 'destructive' : 'default'}>
                        {category.permissions.escortRequired ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Allowed Zones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.permissions.zones.map((zone, index) => (
                      <Badge key={index} variant="outline">{zone}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-red-700">Restrictions</h4>
                  <ul className="text-sm space-y-1">
                    {category.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Category
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-1" />
                    View Visitors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
