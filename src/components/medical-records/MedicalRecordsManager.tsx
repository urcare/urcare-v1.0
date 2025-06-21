
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share, 
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
  Scan
} from 'lucide-react';
import { toast } from 'sonner';

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
  status: 'active' | 'archived' | 'pending';
  visibility: 'private' | 'family' | 'emergency';
  tags: string[];
  size: string;
  lastAccessed: string;
}

interface AccessLog {
  id: string;
  recordId: string;
  accessor: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export const MedicalRecordsManager = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const [records] = useState<MedicalRecord[]>([
    {
      id: '1',
      title: 'Annual Physical Exam 2024',
      type: 'Lab Report',
      date: '2024-01-22',
      provider: 'Dr. Johnson',
      status: 'active',
      visibility: 'private',
      tags: ['routine', 'physical', 'blood-work'],
      size: '2.4 MB',
      lastAccessed: '2024-01-22 10:30'
    },
    {
      id: '2',
      title: 'CT Scan - Chest',
      type: 'Imaging',
      date: '2024-01-20',
      provider: 'Radiology Dept',
      status: 'active',
      visibility: 'family',
      tags: ['ct-scan', 'chest', 'follow-up'],
      size: '45.2 MB',
      lastAccessed: '2024-01-21 14:15'
    },
    {
      id: '3',
      title: 'Cardiology Consultation',
      type: 'Consultation',
      date: '2024-01-18',
      provider: 'Dr. Smith',
      status: 'active',
      visibility: 'emergency',
      tags: ['cardiology', 'consultation', 'ekg'],
      size: '1.8 MB',
      lastAccessed: '2024-01-19 09:45'
    }
  ]);

  const [accessLogs] = useState<AccessLog[]>([
    {
      id: '1',
      recordId: '1',
      accessor: 'Dr. Johnson',
      action: 'Viewed',
      timestamp: '2024-01-22 10:30',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      recordId: '2',
      accessor: 'John Smith (Family)',
      action: 'Downloaded',
      timestamp: '2024-01-21 14:15',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      recordId: '3',
      accessor: 'Emergency Contact',
      action: 'Accessed',
      timestamp: '2024-01-20 22:30',
      ipAddress: '192.168.1.102'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return Lock;
      case 'family': return Users;
      case 'emergency': return Shield;
      default: return Lock;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Medical Records Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Secure, organized, and accessible medical record management with advanced search and family sharing
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shared Records</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">2.1GB</p>
              </div>
              <Archive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Access</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="upload">Upload & Scan</TabsTrigger>
          <TabsTrigger value="sharing">Family Sharing</TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
          <TabsTrigger value="backup">Backup & Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search records, providers, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="Lab Report">Lab Reports</option>
                <option value="Imaging">Imaging</option>
                <option value="Consultation">Consultations</option>
                <option value="Prescription">Prescriptions</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredRecords.map((record) => {
              const VisibilityIcon = getVisibilityIcon(record.visibility);
              return (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{record.title}</h4>
                          <p className="text-sm text-gray-600">{record.provider} • {record.date}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {record.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {record.size} • Last accessed: {record.lastAccessed}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <Badge className={getVisibilityColor(record.visibility)}>
                          <VisibilityIcon className="h-3 w-3 mr-1" />
                          {record.visibility}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Upload medical documents, reports, and images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Drag & drop files or click to browse
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Supported formats:</p>
                  <p className="text-xs text-gray-600">
                    PDF, DOC, DOCX, JPG, PNG, DICOM (Max 50MB per file)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Document Scanner
                </CardTitle>
                <CardDescription>
                  Scan physical documents with OCR processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <Scan className="h-4 w-4 mr-2" />
                    Start Camera Scanner
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Recent Scans</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Lab Report - Jan 22</span>
                        <Button size="sm" variant="outline">Process</Button>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Prescription - Jan 21</span>
                        <Button size="sm" variant="outline">Process</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Family Sharing Settings</h3>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite Family Member
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Spouse • Full Access</div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Dr. Michael Smith</div>
                      <div className="text-sm text-gray-600">Emergency Contact • Limited Access</div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sharing Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Record Visibility</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Private (Only me)</option>
                      <option>Family (Immediate family)</option>
                      <option>Emergency (Emergency contacts)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Auto-share New Records</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Lab Results
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Imaging Studies
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Prescriptions
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Extra security for record access</div>
                    </div>
                    <Button size="sm">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Encryption</div>
                      <div className="text-sm text-gray-600">AES-256 encryption enabled</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-lock</div>
                      <div className="text-sm text-gray-600">Lock after 15 minutes of inactivity</div>
                    </div>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{log.accessor}</div>
                        <div className="text-xs text-gray-600">
                          {log.action} • {log.timestamp}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.ipAddress}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Backup & Recovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="font-medium text-green-800">Last Backup</div>
                    </div>
                    <div className="text-sm text-green-700">
                      January 22, 2024 at 3:00 AM
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Archive className="h-4 w-4 mr-2" />
                      Create Manual Backup
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Records
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm font-medium">2.1 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Documents</span>
                      <span>1.2 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Images</span>
                      <span>0.7 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Backups</span>
                      <span>0.2 GB</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Old Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
