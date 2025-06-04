
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Bell,
  Download,
  Upload,
  Search
} from 'lucide-react';

export const CertificationRenewalSystem = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const certifications = [
    {
      id: '1',
      employee: 'Dr. Sarah Wilson',
      certification: 'ACLS (Advanced Cardiovascular Life Support)',
      provider: 'American Heart Association',
      issueDate: '2022-08-15',
      expiryDate: '2024-08-15',
      status: 'expiring',
      daysUntilExpiry: 45,
      renewalRequired: true,
      documentUrl: '/certificates/acls-sarah-wilson.pdf'
    },
    {
      id: '2',
      employee: 'Nurse Jennifer Brown',
      certification: 'BLS (Basic Life Support)',
      provider: 'American Red Cross',
      issueDate: '2023-03-20',
      expiryDate: '2025-03-20',
      status: 'valid',
      daysUntilExpiry: 365,
      renewalRequired: false,
      documentUrl: '/certificates/bls-jennifer-brown.pdf'
    },
    {
      id: '3',
      employee: 'Dr. Michael Chen',
      certification: 'Board Certification - Surgery',
      provider: 'American Board of Surgery',
      issueDate: '2020-01-10',
      expiryDate: '2024-06-10',
      status: 'expired',
      daysUntilExpiry: -5,
      renewalRequired: true,
      documentUrl: null
    },
    {
      id: '4',
      employee: 'Tech Lisa Garcia',
      certification: 'Radiologic Technologist License',
      provider: 'State Medical Board',
      issueDate: '2023-09-01',
      expiryDate: '2025-09-01',
      status: 'valid',
      daysUntilExpiry: 456,
      renewalRequired: false,
      documentUrl: '/certificates/radtech-lisa-garcia.pdf'
    }
  ];

  const renewalReminders = [
    {
      id: '1',
      type: 'email',
      description: '90 days before expiry',
      active: true,
      recipients: 'Employee + Manager'
    },
    {
      id: '2',
      type: 'email',
      description: '60 days before expiry',
      active: true,
      recipients: 'Employee + Manager + HR'
    },
    {
      id: '3',
      type: 'email',
      description: '30 days before expiry',
      active: true,
      recipients: 'Employee + Manager + HR + Department Head'
    },
    {
      id: '4',
      type: 'escalation',
      description: 'Immediate notification on expiry',
      active: true,
      recipients: 'All stakeholders + Executive team'
    }
  ];

  const certificationCategories = [
    { name: 'Clinical Licenses', count: 145, expiring: 12, expired: 3 },
    { name: 'Life Support Certifications', count: 234, expiring: 18, expired: 2 },
    { name: 'Specialty Certifications', count: 89, expiring: 6, expired: 1 },
    { name: 'Regulatory Compliance', count: 456, expiring: 23, expired: 5 }
  ];

  const upcomingRenewals = [
    { month: 'June 2024', count: 15, urgent: 3 },
    { month: 'July 2024', count: 23, urgent: 2 },
    { month: 'August 2024', count: 31, urgent: 8 },
    { month: 'September 2024', count: 19, urgent: 1 }
  ];

  const getStatusBadge = (status, days) => {
    if (status === 'expired') {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    }
    if (status === 'expiring' || days <= 90) {
      return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
  };

  const getStatusColor = (status, days) => {
    if (status === 'expired') return 'text-red-600';
    if (status === 'expiring' || days <= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (status, days) => {
    if (status === 'expired') return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (status === 'expiring' || days <= 90) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Certification Renewal System</h3>
          <p className="text-gray-600">Automated tracking and renewal management for professional certifications</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Certificate
          </Button>
        </div>
      </div>

      {/* Certification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">924</div>
                <div className="text-sm text-gray-600">Total Certifications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">59</div>
                <div className="text-sm text-gray-600">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">11</div>
                <div className="text-sm text-gray-600">Expired</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certification Categories
          </CardTitle>
          <CardDescription>Overview of certifications by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificationCategories.map((category, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{category.name}</h4>
                  <Badge variant="outline">{category.count} total</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-green-600 font-medium">{category.count - category.expiring - category.expired}</p>
                    <p className="text-gray-600">Valid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-600 font-medium">{category.expiring}</p>
                    <p className="text-gray-600">Expiring</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600 font-medium">{category.expired}</p>
                    <p className="text-gray-600">Expired</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Certifications</CardTitle>
          <CardDescription>Detailed tracking of employee certifications and renewal status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{cert.employee}</h4>
                      {getStatusBadge(cert.status, cert.daysUntilExpiry)}
                    </div>
                    <p className="text-sm text-gray-600">{cert.certification}</p>
                    <p className="text-xs text-gray-500">Provider: {cert.provider}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(cert.status, cert.daysUntilExpiry)}
                    <span className={`text-sm font-medium ${getStatusColor(cert.status, cert.daysUntilExpiry)}`}>
                      {cert.status === 'expired' 
                        ? `Expired ${Math.abs(cert.daysUntilExpiry)} days ago`
                        : cert.daysUntilExpiry <= 90
                        ? `Expires in ${cert.daysUntilExpiry} days`
                        : 'Valid'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Issue Date</p>
                    <p className="font-medium">{cert.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="font-medium">{cert.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Renewal Status</p>
                    <p className="font-medium">{cert.renewalRequired ? 'Required' : 'Not Required'}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{cert.documentUrl ? 'Certificate on file' : 'No document uploaded'}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {cert.documentUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {cert.renewalRequired && (
                      <Button size="sm">
                        <Bell className="w-4 h-4 mr-1" />
                        Send Reminder
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renewal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Renewals
            </CardTitle>
            <CardDescription>Monthly renewal schedule and priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRenewals.map((renewal, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{renewal.month}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{renewal.count} renewals</Badge>
                      {renewal.urgent > 0 && (
                        <Badge className="bg-red-100 text-red-800">{renewal.urgent} urgent</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Progress value={(renewal.urgent / renewal.count) * 100} className="h-2 flex-1 mr-3" />
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Automated Reminders
            </CardTitle>
            <CardDescription>Configure renewal reminder notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {renewalReminders.map((reminder) => (
                <div key={reminder.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${reminder.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-medium">{reminder.description}</span>
                    </div>
                    <Badge variant={reminder.type === 'escalation' ? 'destructive' : 'default'}>
                      {reminder.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">Recipients: {reminder.recipients}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Status: {reminder.active ? 'Active' : 'Inactive'}
                    </span>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
