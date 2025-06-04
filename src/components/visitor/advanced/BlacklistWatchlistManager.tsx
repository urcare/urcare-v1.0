
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Search, 
  Plus,
  Eye,
  Edit,
  Camera,
  FileText,
  Shield,
  Clock
} from 'lucide-react';

export const BlacklistWatchlistManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');

  const watchlistEntries = [
    {
      id: '1',
      name: 'John Suspicious',
      photo: '/placeholder.svg',
      riskLevel: 'high',
      category: 'Security Threat',
      reason: 'Previous incident involving aggressive behavior',
      dateAdded: '2024-05-15',
      lastSeen: '2024-06-01',
      status: 'active',
      notes: 'Attempted unauthorized access to restricted areas'
    },
    {
      id: '2',
      name: 'Jane Unknown',
      photo: '/placeholder.svg',
      riskLevel: 'medium',
      category: 'Unauthorized Entry',
      reason: 'Multiple failed entry attempts',
      dateAdded: '2024-05-28',
      lastSeen: '2024-06-03',
      status: 'active',
      notes: 'Tried to enter through emergency exits'
    },
    {
      id: '3',
      name: 'Mike Visitor',
      photo: '/placeholder.svg',
      riskLevel: 'low',
      category: 'Policy Violation',
      reason: 'Overstayed visit time repeatedly',
      dateAdded: '2024-06-01',
      lastSeen: '2024-06-04',
      status: 'monitoring',
      notes: 'Generally compliant but needs supervision'
    },
    {
      id: '4',
      name: 'Sarah Banned',
      photo: '/placeholder.svg',
      riskLevel: 'critical',
      category: 'Banned Individual',
      reason: 'Criminal record and threatening behavior',
      dateAdded: '2024-04-10',
      lastSeen: 'Never',
      status: 'permanent_ban',
      notes: 'Contact security immediately if spotted'
    }
  ];

  const alertConfigurations = [
    {
      id: '1',
      name: 'High Risk Entry Alert',
      trigger: 'High risk individual detected',
      recipients: ['Security Team', 'Administration'],
      method: 'Instant SMS + Email',
      active: true
    },
    {
      id: '2',
      name: 'Facial Recognition Match',
      trigger: 'Watchlist face detected by cameras',
      recipients: ['Security Team', 'Front Desk'],
      method: 'Push Notification',
      active: true
    },
    {
      id: '3',
      name: 'Banned Individual Alert',
      trigger: 'Permanently banned person attempts entry',
      recipients: ['Security Team', 'Management', 'Local Authorities'],
      method: 'Emergency Alert',
      active: true
    }
  ];

  const getRiskBadge = (level) => {
    const config = {
      low: { label: 'Low Risk', className: 'bg-yellow-100 text-yellow-800' },
      medium: { label: 'Medium Risk', className: 'bg-orange-100 text-orange-800' },
      high: { label: 'High Risk', className: 'bg-red-100 text-red-800' },
      critical: { label: 'Critical', className: 'bg-red-200 text-red-900 font-bold' }
    };
    return <Badge className={config[level].className}>{config[level].label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Active Watch', className: 'bg-red-100 text-red-800' },
      monitoring: { label: 'Monitoring', className: 'bg-yellow-100 text-yellow-800' },
      permanent_ban: { label: 'Permanent Ban', className: 'bg-gray-100 text-gray-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Blacklist & Watchlist Management</h3>
          <p className="text-gray-600">Photo galleries, risk categorization, and alert configuration</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Facial Recognition
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, ID, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Watchlist Gallery
          </CardTitle>
          <CardDescription>Photo-based identification and risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{entry.name}</h4>
                    <div className="space-y-1">
                      {getRiskBadge(entry.riskLevel)}
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {entry.category}
                  </div>
                  <div>
                    <span className="font-medium">Reason:</span> {entry.reason}
                  </div>
                  <div>
                    <span className="font-medium">Added:</span> {entry.dateAdded}
                  </div>
                  <div>
                    <span className="font-medium">Last Seen:</span> {entry.lastSeen}
                  </div>
                  <div>
                    <span className="font-medium">Notes:</span> {entry.notes}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {entry.riskLevel === 'critical' && (
                    <Button size="sm" variant="destructive">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Alert
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alert Configuration
          </CardTitle>
          <CardDescription>Automated alert settings for watchlist matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertConfigurations.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium mb-1">{alert.name}</h4>
                    <p className="text-sm text-gray-600">{alert.trigger}</p>
                  </div>
                  <Badge className={alert.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {alert.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Recipients:</span>
                    <div className="mt-1">
                      {alert.recipients.map((recipient, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Method:</span> {alert.method}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline">
                    Test Alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-600">Active Watchlist</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-600">Recent Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Face Matches Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
