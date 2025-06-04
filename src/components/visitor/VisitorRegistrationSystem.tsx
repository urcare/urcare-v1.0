
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Camera, 
  FileText,
  User,
  Phone,
  Mail,
  Building,
  Clock,
  QrCode,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';

export const VisitorRegistrationSystem = () => {
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const recentVisitors = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      purpose: 'Patient Visit',
      host: 'Dr. Sarah Wilson',
      checkIn: '2024-06-04 09:30',
      status: 'checked_in',
      zone: 'ICU',
      category: 'Family'
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily.j@company.com',
      phone: '+1 (555) 987-6543',
      company: 'Medical Supplies Co',
      purpose: 'Business Meeting',
      host: 'Admin Office',
      checkIn: '2024-06-04 14:15',
      status: 'pending_approval',
      zone: 'Administration',
      category: 'Vendor'
    },
    {
      id: '3',
      name: 'Robert Brown',
      email: 'rbrown@email.com',
      phone: '+1 (555) 456-7890',
      company: 'Construction LLC',
      purpose: 'Maintenance Work',
      host: 'Facilities Manager',
      checkIn: '2024-06-04 08:00',
      status: 'checked_out',
      zone: 'Maintenance',
      category: 'Contractor'
    }
  ];

  const todayStats = [
    { label: 'Total Visitors', value: 47, icon: User },
    { label: 'Currently Inside', value: 23, icon: Building },
    { label: 'Pending Approval', value: 5, icon: Clock },
    { label: 'Completed Visits', value: 19, icon: CheckCircle }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      checked_in: { label: 'Checked In', className: 'bg-green-100 text-green-800' },
      pending_approval: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      checked_out: { label: 'Checked Out', className: 'bg-gray-100 text-gray-800' },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      Family: { className: 'bg-blue-100 text-blue-800' },
      Vendor: { className: 'bg-purple-100 text-purple-800' },
      Contractor: { className: 'bg-orange-100 text-orange-800' },
      VIP: { className: 'bg-gold-100 text-gold-800' }
    };
    const config = categoryConfig[category] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{category}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Visitor Registration System</h3>
          <p className="text-gray-600">Complete visitor management with photo capture and document verification</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search Visitors
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            New Registration
          </Button>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {todayStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Quick Registration
          </CardTitle>
          <CardDescription>Register new visitors with photo and document capture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input placeholder="Enter last name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input type="email" placeholder="visitor@email.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input placeholder="+1 (555) 123-4567" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company/Organization</label>
                <Input placeholder="Company name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Purpose of Visit</label>
                <Input placeholder="Reason for visit" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Host/Contact Person</label>
                <Input placeholder="Host name or department" />
              </div>
            </div>
            
            {/* Photo & Document Capture */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-medium mb-2">Visitor Photo</h4>
                <p className="text-sm text-gray-500 mb-3">Click to capture visitor photo</p>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-medium mb-2">Identity Document</h4>
                <p className="text-sm text-gray-500 mb-3">Scan driver's license or ID card</p>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Scan Document
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Access Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Visitor Category:</span>
                    <Badge>Family</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Level:</span>
                    <Badge variant="outline">Limited</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span>Today 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Save as Draft</Button>
            <Button>
              <QrCode className="w-4 h-4 mr-2" />
              Generate Access Pass
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Visitors */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Visitors</CardTitle>
          <CardDescription>Active and recent visitor registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVisitors.map((visitor) => (
              <div key={visitor.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{visitor.name}</h4>
                      {getStatusBadge(visitor.status)}
                      {getCategoryBadge(visitor.category)}
                    </div>
                    <p className="text-sm text-gray-600">{visitor.company}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{visitor.checkIn}</p>
                    <p className="text-xs text-gray-500">Check-in Time</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{visitor.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{visitor.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Purpose</p>
                    <p className="font-medium">{visitor.purpose}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Host</p>
                    <p className="font-medium">{visitor.host}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Access Zone</p>
                    <p className="font-medium">{visitor.zone}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {visitor.status === 'checked_in' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Currently inside facility</span>
                      </>
                    )}
                    {visitor.status === 'pending_approval' && (
                      <>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span>Awaiting host approval</span>
                      </>
                    )}
                    {visitor.status === 'checked_out' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                        <span>Visit completed</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {visitor.status === 'pending_approval' && (
                      <Button size="sm">Approve</Button>
                    )}
                    {visitor.status === 'checked_in' && (
                      <Button size="sm" variant="outline">Check Out</Button>
                    )}
                    <Button size="sm" variant="outline">
                      <QrCode className="w-4 h-4 mr-1" />
                      View Pass
                    </Button>
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
