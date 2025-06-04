
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Certificate, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  Download,
  Bell,
  Building
} from 'lucide-react';

export const CertificateManagement = () => {
  const certificates = [
    {
      id: 'CERT001',
      name: 'CPCB Authorization Certificate',
      type: 'Regulatory',
      issuer: 'Central Pollution Control Board',
      issueDate: '2024-03-20',
      expiryDate: '2025-03-20',
      status: 'valid',
      daysToExpiry: 289,
      renewalRequired: false,
      documentUrl: '/certificates/cpcb-auth.pdf'
    },
    {
      id: 'CERT002',
      name: 'Waste Treatment Facility License',
      type: 'Vendor',
      issuer: 'State Pollution Control Board',
      issueDate: '2023-06-15',
      expiryDate: '2024-06-15',
      status: 'expiring',
      daysToExpiry: 11,
      renewalRequired: true,
      documentUrl: '/certificates/treatment-license.pdf'
    },
    {
      id: 'CERT003',
      name: 'NABH Accreditation',
      type: 'Quality',
      issuer: 'National Accreditation Board',
      issueDate: '2023-01-10',
      expiryDate: '2026-01-10',
      status: 'valid',
      daysToExpiry: 584,
      renewalRequired: false,
      documentUrl: '/certificates/nabh-accred.pdf'
    },
    {
      id: 'CERT004',
      name: 'NABL Laboratory Certification',
      type: 'Quality',
      issuer: 'National Accreditation Board for Testing',
      issueDate: '2023-09-05',
      expiryDate: '2025-09-05',
      status: 'valid',
      daysToExpiry: 458,
      renewalRequired: false,
      documentUrl: '/certificates/nabl-cert.pdf'
    },
    {
      id: 'CERT005',
      name: 'ISO 14001:2015 Certificate',
      type: 'Management System',
      issuer: 'International Certification Body',
      issueDate: '2023-04-12',
      expiryDate: '2024-04-12',
      status: 'expired',
      daysToExpiry: -53,
      renewalRequired: true,
      documentUrl: '/certificates/iso-14001.pdf'
    }
  ];

  const vendorCertificates = [
    {
      id: 'VEN001',
      vendor: 'GreenTech Bio-Waste Treatment',
      service: 'Pathological Waste Treatment',
      certificates: [
        { name: 'CPCB Authorization', expiry: '2024-12-31', status: 'valid' },
        { name: 'ISO 14001', expiry: '2024-08-15', status: 'expiring' }
      ],
      overallStatus: 'compliant'
    },
    {
      id: 'VEN002',
      vendor: 'EcoFire Incineration Systems',
      service: 'Pharmaceutical Waste Disposal',
      certificates: [
        { name: 'CPCB Authorization', expiry: '2025-02-28', status: 'valid' },
        { name: 'Emission Standards Compliance', expiry: '2024-06-30', status: 'expiring' }
      ],
      overallStatus: 'attention_required'
    }
  ];

  const getStatusBadge = (status: string, daysToExpiry?: number) => {
    if (status === 'expired') {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    }
    if (status === 'expiring' || (daysToExpiry && daysToExpiry <= 30)) {
      return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
    }
    if (status === 'valid') {
      return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  };

  const getVendorStatusBadge = (status: string) => {
    const config = {
      compliant: { className: 'bg-green-100 text-green-800', label: 'Compliant' },
      attention_required: { className: 'bg-yellow-100 text-yellow-800', label: 'Attention Required' },
      non_compliant: { className: 'bg-red-100 text-red-800', label: 'Non-Compliant' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const getExpiryAlert = (daysToExpiry: number) => {
    if (daysToExpiry < 0) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    if (daysToExpiry <= 30) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Certificate Management</h3>
          <p className="text-gray-600">Document storage, renewal tracking, and vendor verification</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Certificate
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Renewal Alerts */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Action Required:</strong> 2 certificates require immediate attention - 
          1 expiring within 30 days and 1 expired certificate needs renewal.
        </AlertDescription>
      </Alert>

      {/* Organization Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Certificate className="w-5 h-5" />
            Organization Certificates
          </CardTitle>
          <CardDescription>Regulatory compliance and quality certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{cert.name}</h4>
                      {getStatusBadge(cert.status, cert.daysToExpiry)}
                    </div>
                    <p className="text-sm text-gray-600">{cert.type} • Issued by {cert.issuer}</p>
                    <p className="text-sm text-gray-500">ID: {cert.id}</p>
                  </div>
                  
                  <div className="text-right flex items-start gap-2">
                    {getExpiryAlert(cert.daysToExpiry)}
                    <div>
                      <p className="text-sm font-medium">Expires: {cert.expiryDate}</p>
                      <p className="text-xs text-gray-500">
                        {cert.daysToExpiry >= 0 ? `${cert.daysToExpiry} days left` : `${Math.abs(cert.daysToExpiry)} days overdue`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span>Issued: {cert.issueDate}</span>
                    {cert.renewalRequired && (
                      <span className="ml-4 text-red-600 font-medium">Renewal Required</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {cert.renewalRequired && (
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Renew
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Vendor Certificate Verification
          </CardTitle>
          <CardDescription>Third-party vendor compliance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendorCertificates.map((vendor) => (
              <div key={vendor.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{vendor.vendor}</h4>
                      {getVendorStatusBadge(vendor.overallStatus)}
                    </div>
                    <p className="text-sm text-gray-600">{vendor.service}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Certificates:</h5>
                  {vendor.certificates.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{cert.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Expires: {cert.expiry}</span>
                        {getStatusBadge(cert.status)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">View All Documents</Button>
                  <Button size="sm" variant="outline">Request Updates</Button>
                  {vendor.overallStatus === 'attention_required' && (
                    <Button size="sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Review Required
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Valid Certificates</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1</div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1</div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-600">Avg Days to Expiry</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
