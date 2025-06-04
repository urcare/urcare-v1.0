
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Upload, 
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  MessageSquare
} from 'lucide-react';

export const AnonymousReportingPortal = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reportText, setReportText] = useState('');

  const reportCategories = [
    { id: 'safety', label: 'Safety Violations', icon: Shield },
    { id: 'harassment', label: 'Harassment/Bullying', icon: AlertTriangle },
    { id: 'discrimination', label: 'Discrimination', icon: Eye },
    { id: 'ethics', label: 'Ethics Violation', icon: FileText },
    { id: 'misconduct', label: 'Professional Misconduct', icon: Lock },
    { id: 'other', label: 'Other Concerns', icon: MessageSquare }
  ];

  const reportStatus = [
    {
      id: 'RPT001',
      category: 'Safety Violations',
      submitted: '2024-06-03',
      status: 'under_review',
      priority: 'high',
      lastUpdate: '2024-06-04',
      description: 'Equipment maintenance concerns in OR 3'
    },
    {
      id: 'RPT002',
      category: 'Harassment/Bullying',
      submitted: '2024-06-01',
      status: 'investigating',
      priority: 'critical',
      lastUpdate: '2024-06-04',
      description: 'Workplace harassment incident reported'
    },
    {
      id: 'RPT003',
      category: 'Ethics Violation',
      submitted: '2024-05-28',
      status: 'resolved',
      priority: 'medium',
      lastUpdate: '2024-06-02',
      description: 'Patient privacy concern addressed'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
      under_review: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800' },
      investigating: { label: 'Investigating', className: 'bg-orange-100 text-orange-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    };
    const config = priorityConfig[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Anonymous Reporting Portal</h3>
          <p className="text-gray-600">Secure and confidential reporting system for workplace concerns</p>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800 font-medium">100% Anonymous & Secure</span>
        </div>
      </div>

      {/* Privacy Assurance */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Your Privacy is Protected</h4>
              <p className="text-sm text-green-700">
                All reports are encrypted and processed anonymously. Your identity will never be revealed without your explicit consent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Report Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Submit Anonymous Report
          </CardTitle>
          <CardDescription>Report workplace concerns confidentially and securely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Description *
            </label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Please provide detailed information about the incident. Include dates, locations, and any relevant context..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Upload images, documents, or other evidence
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              For immediate safety concerns or emergencies, please contact security at ext. 911
            </p>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" disabled={!selectedCategory || !reportText.trim()}>
              <Shield className="w-4 h-4 mr-2" />
              Submit Anonymous Report
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Track Your Reports
          </CardTitle>
          <CardDescription>Monitor the status of your submitted reports using your tracking IDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportStatus.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Report #{report.id}</span>
                      {getStatusBadge(report.status)}
                      {getPriorityBadge(report.priority)}
                    </div>
                    <p className="text-sm text-gray-600">{report.category}</p>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <p>Submitted: {report.submitted}</p>
                    <p>Last Update: {report.lastUpdate}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{report.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Report received and being processed</span>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-600">Reports This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">72h</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-600">Resolution Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
