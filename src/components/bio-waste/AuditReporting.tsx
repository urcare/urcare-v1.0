
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  FileText, 
  Download, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const AuditReporting = () => {
  const auditScores = {
    nabh: 96,
    nabl: 94,
    cpcb: 98,
    pollution: 92
  };

  const complianceAreas = [
    { name: 'Waste Segregation', score: 98, target: 95, status: 'excellent' },
    { name: 'Documentation', score: 94, target: 90, status: 'good' },
    { name: 'Training & Awareness', score: 88, target: 85, status: 'good' },
    { name: 'Equipment Maintenance', score: 96, target: 90, status: 'excellent' },
    { name: 'Disposal Procedures', score: 92, target: 88, status: 'good' },
    { name: 'Record Keeping', score: 90, target: 85, status: 'good' }
  ];

  const upcomingAudits = [
    {
      id: 'A001',
      type: 'NABH Assessment',
      date: '2024-06-15',
      preparedness: 94,
      status: 'scheduled',
      auditor: 'NABH Certified Team',
      focus: 'Biomedical Waste Management'
    },
    {
      id: 'A002',
      type: 'CPCB Inspection',
      date: '2024-06-28',
      preparedness: 88,
      status: 'preparation',
      auditor: 'Central Pollution Control Board',
      focus: 'Environmental Compliance'
    },
    {
      id: 'A003',
      type: 'Internal Quality Audit',
      date: '2024-07-05',
      preparedness: 92,
      status: 'scheduled',
      auditor: 'Internal Quality Team',
      focus: 'SOP Compliance Review'
    }
  ];

  const documentLibrary = [
    { name: 'Biomedical Waste Management Policy', status: 'current', lastUpdate: '2024-05-15' },
    { name: 'CPCB Authorization Certificate', status: 'valid', expiry: '2025-03-20' },
    { name: 'Training Records & Certificates', status: 'current', lastUpdate: '2024-06-01' },
    { name: 'Waste Treatment Contracts', status: 'valid', expiry: '2024-12-31' },
    { name: 'Equipment Calibration Reports', status: 'current', lastUpdate: '2024-05-28' },
    { name: 'Incident Reports & Corrective Actions', status: 'current', lastUpdate: '2024-06-03' }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      excellent: { className: 'bg-green-100 text-green-800', label: 'Excellent' },
      good: { className: 'bg-blue-100 text-blue-800', label: 'Good' },
      needs_improvement: { className: 'bg-yellow-100 text-yellow-800', label: 'Needs Improvement' },
      scheduled: { className: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      preparation: { className: 'bg-yellow-100 text-yellow-800', label: 'In Preparation' },
      current: { className: 'bg-green-100 text-green-800', label: 'Current' },
      valid: { className: 'bg-green-100 text-green-800', label: 'Valid' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">NABH/NABL Audit Reporting</h3>
          <p className="text-gray-600">Compliance scorecards, documentation, and assessment preparation</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Audit
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Compliance Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{auditScores.nabh}%</div>
              <div className="text-sm text-gray-600">NABH Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{auditScores.nabl}%</div>
              <div className="text-sm text-gray-600">NABL Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{auditScores.cpcb}%</div>
              <div className="text-sm text-gray-600">CPCB Compliance</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{auditScores.pollution}%</div>
              <div className="text-sm text-gray-600">Pollution Control</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Areas Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Compliance Areas Assessment
          </CardTitle>
          <CardDescription>Detailed scoring across key compliance areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceAreas.map((area, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{area.name}</h4>
                    <p className="text-sm text-gray-600">Target: {area.target}%</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{area.score}%</span>
                      {getStatusBadge(area.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={area.score} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span>Target: {area.target}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Audits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Audits & Assessments
          </CardTitle>
          <CardDescription>Preparation status and audit schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAudits.map((audit) => (
              <div key={audit.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{audit.type}</h4>
                      {getStatusBadge(audit.status)}
                    </div>
                    <p className="text-sm text-gray-600">{audit.focus}</p>
                    <p className="text-sm text-gray-500">Auditor: {audit.auditor}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{audit.date}</p>
                    <p className="text-xs text-gray-500">ID: {audit.id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Preparedness:</span>
                    <span className="font-medium">{audit.preparedness}%</span>
                  </div>
                  <Progress value={audit.preparedness} className="h-2" />
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">View Checklist</Button>
                  <Button size="sm" variant="outline">Preparation Guide</Button>
                  <Button size="sm">Update Status</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentation Management
          </CardTitle>
          <CardDescription>Audit-ready documentation and compliance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentLibrary.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-gray-600">
                    {doc.lastUpdate && `Last Updated: ${doc.lastUpdate}`}
                    {doc.expiry && `Expires: ${doc.expiry}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.status)}
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
