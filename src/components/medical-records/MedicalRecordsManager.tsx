import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Share, 
  MoreVertical, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Users,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  Heart,
  Brain,
  Activity,
  Archive,
  Scan,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface Record {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
  status: 'active' | 'archived' | 'pending';
  visibility: 'private' | 'family' | 'emergency';
  tags: string[];
  content: string;
  size: string;
  lastAccessed: string;
}

export const MedicalRecordsManager = () => {
  const [records, setRecords] = useState<Record[]>([
    {
      id: '1',
      title: 'Lab Report - Blood Test',
      type: 'Lab Report',
      date: '2024-03-15',
      provider: 'Acme Labs',
      status: 'active',
      visibility: 'private',
      tags: ['blood test', 'cholesterol'],
      content: 'Detailed blood test results...',
      size: '2.5MB',
      lastAccessed: '2 days ago'
    },
    {
      id: '2',
      title: 'Prescription - Lisinopril',
      type: 'Prescription',
      date: '2024-03-10',
      provider: 'Dr. Smith',
      status: 'active',
      visibility: 'family',
      tags: ['lisinopril', 'blood pressure'],
      content: 'Prescription details for Lisinopril...',
      size: '1.2MB',
      lastAccessed: '1 week ago'
    },
    {
      id: '3',
      title: 'X-Ray - Chest',
      type: 'X-Ray',
      date: '2024-03-01',
      provider: 'City Imaging Center',
      status: 'archived',
      visibility: 'private',
      tags: ['x-ray', 'chest'],
      content: 'Chest x-ray image and report...',
      size: '5.8MB',
      lastAccessed: '1 month ago'
    },
    {
      id: '4',
      title: 'MRI Scan - Brain',
      type: 'MRI Scan',
      date: '2024-02-15',
      provider: 'NeuroScan Clinic',
      status: 'active',
      visibility: 'emergency',
      tags: ['mri', 'brain'],
      content: 'Brain MRI scan images and report...',
      size: '7.1MB',
      lastAccessed: '2 weeks ago'
    },
    {
      id: '5',
      title: 'Blood Test - Comprehensive',
      type: 'Blood Test',
      date: '2024-02-01',
      provider: 'Global Diagnostics',
      status: 'pending',
      visibility: 'private',
      tags: ['blood test', 'full panel'],
      content: 'Comprehensive blood test results pending...',
      size: '1.9MB',
      lastAccessed: 'N/A'
    },
    {
      id: '6',
      title: 'Lab Report - Blood Test',
      type: 'Lab Report',
      date: '2024-03-15',
      provider: 'Acme Labs',
      status: 'active',
      visibility: 'private',
      tags: ['blood test', 'cholesterol'],
      content: 'Detailed blood test results...',
      size: '2.5MB',
      lastAccessed: '2 days ago'
    },
    {
      id: '7',
      title: 'Prescription - Lisinopril',
      type: 'Prescription',
      date: '2024-03-10',
      provider: 'Dr. Smith',
      status: 'active',
      visibility: 'family',
      tags: ['lisinopril', 'blood pressure'],
      content: 'Prescription details for Lisinopril...',
      size: '1.2MB',
      lastAccessed: '1 week ago'
    },
    {
      id: '8',
      title: 'X-Ray - Chest',
      type: 'X-Ray',
      date: '2024-03-01',
      provider: 'City Imaging Center',
      status: 'archived',
      visibility: 'private',
      tags: ['x-ray', 'chest'],
      content: 'Chest x-ray image and report...',
      size: '5.8MB',
      lastAccessed: '1 month ago'
    },
    {
      id: '9',
      title: 'MRI Scan - Brain',
      type: 'MRI Scan',
      date: '2024-02-15',
      provider: 'NeuroScan Clinic',
      status: 'active',
      visibility: 'emergency',
      tags: ['mri', 'brain'],
      content: 'Brain MRI scan images and report...',
      size: '7.1MB',
      lastAccessed: '2 weeks ago'
    },
    {
      id: '10',
      title: 'Blood Test - Comprehensive',
      type: 'Blood Test',
      date: '2024-02-01',
      provider: 'Global Diagnostics',
      status: 'pending',
      visibility: 'private',
      tags: ['blood test', 'full panel'],
      content: 'Comprehensive blood test results pending...',
      size: '1.9MB',
      lastAccessed: 'N/A'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredRecords = records.filter(record => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const statusMatch = filterStatus ? record.status === filterStatus : true;
    const typeMatch = filterType ? record.type === filterType : true;

    return searchRegex.test(record.title) && statusMatch && typeMatch;
  });

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return Lock;
      case 'family': return Users;
      case 'emergency': return Shield;
      default: return Lock;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'private': return 'bg-red-100 text-red-800';
      case 'family': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Medical Records Manager
          </CardTitle>
          <CardDescription>
            Comprehensive health record management with AI-powered insights and family access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Archive className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">{records.length}</h3>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">{records.filter(r => r.status === 'active').length}</h3>
              <p className="text-sm text-gray-600">Active Records</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">{records.filter(r => r.visibility === 'family').length}</h3>
              <p className="text-sm text-gray-600">Family Shared</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">{records.filter(r => r.visibility === 'emergency').length}</h3>
              <p className="text-sm text-gray-600">Emergency Access</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI Scan">MRI Scan</option>
                <option value="Blood Test">Blood Test</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => {
          const VisibilityIcon = getVisibilityIcon(record.visibility);
          
          return (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{record.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {record.provider}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {record.date}
                        </div>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getVisibilityColor(record.visibility)}>
                      <VisibilityIcon className="h-3 w-3 mr-1" />
                      {record.visibility}
                    </Badge>
                    <Badge 
                      variant={record.status === 'active' ? 'default' : 'secondary'}
                    >
                      {record.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-2 mt-4">
                  {record.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used medical record operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => toast.success('Upload initiated!')}>
              <Scan className="h-6 w-6 mb-2" />
              <span>Scan Document</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => toast.success('Lab results requested!')}>
              <Scan className="h-6 w-6 mb-2" />
              <span>Request Lab Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => toast.success('Family sharing enabled!')}>
              <Users className="h-6 w-6 mb-2" />
              <span>Family Sharing</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => toast.success('Emergency profile updated!')}>
              <Shield className="h-6 w-6 mb-2" />
              <span>Emergency Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Health Insights
          </CardTitle>
          <CardDescription>Intelligent analysis of your medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Health Trend Analysis</h4>
              </div>
              <p className="text-sm text-gray-600">
                Your blood pressure readings show a positive downward trend over the last 3 months. 
                Continue current medication and lifestyle changes.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium">Follow-up Reminder</h4>
              </div>
              <p className="text-sm text-gray-600">
                Based on your recent lab results, a follow-up appointment with your cardiologist 
                is recommended within the next 2 weeks.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Preventive Care</h4>
              </div>
              <p className="text-sm text-gray-600">
                You're up to date with most preventive screenings. Consider scheduling 
                your annual eye exam and dental checkup.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Archive Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-gray-600" />
            Archive Management
          </CardTitle>
          <CardDescription>Manage archived and historical medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Archived Records</h4>
              <p className="text-sm text-gray-600">
                {records.filter(r => r.status === 'archived').length} records in archive
              </p>
            </div>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              View Archive
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg mt-4">
            <div>
              <h4 className="font-medium">Auto-Archive Settings</h4>
              <p className="text-sm text-gray-600">
                Automatically archive records older than 2 years
              </p>
            </div>
            <Button variant="outline">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
