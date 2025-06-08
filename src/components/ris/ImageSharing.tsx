
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Share2, 
  Link, 
  Mail, 
  Download, 
  Lock,
  Eye,
  Clock,
  Users,
  FileText,
  Shield,
  Search,
  Plus,
  Settings,
  Monitor
} from 'lucide-react';

export const ImageSharing = () => {
  const [selectedStudy, setSelectedStudy] = useState('study1');
  const [shareMode, setShareMode] = useState('secure-link');

  const sharableStudies = [
    {
      id: 'study1',
      patient: 'John Doe',
      mrn: 'MRN001234',
      study: 'CT Chest with Contrast',
      date: '2024-01-08',
      modality: 'CT',
      series: 3,
      images: 156,
      size: '245 MB'
    },
    {
      id: 'study2',
      patient: 'Jane Smith',
      mrn: 'MRN002345',
      study: 'MRI Brain without Contrast',
      date: '2024-01-08',
      modality: 'MR',
      series: 5,
      images: 248,
      size: '512 MB'
    },
    {
      id: 'study3',
      patient: 'Robert Brown',
      mrn: 'MRN003456',
      study: 'Chest X-Ray PA/Lateral',
      date: '2024-01-08',
      modality: 'XR',
      series: 2,
      images: 2,
      size: '8 MB'
    }
  ];

  const sharedStudies = [
    {
      id: 'share1',
      patient: 'John Doe',
      study: 'CT Chest',
      sharedWith: 'Dr. Williams - Cardiology',
      sharedDate: '2024-01-08 14:30',
      expiresDate: '2024-01-15 14:30',
      accessCount: 3,
      status: 'Active',
      type: 'Consultation'
    },
    {
      id: 'share2',
      patient: 'Jane Smith',
      study: 'MRI Brain',
      sharedWith: 'Dr. Johnson - Neurology',
      sharedDate: '2024-01-08 10:15',
      expiresDate: '2024-01-22 10:15',
      accessCount: 1,
      status: 'Active',
      type: 'Second Opinion'
    },
    {
      id: 'share3',
      patient: 'Robert Brown',
      study: 'Chest X-Ray',
      sharedWith: 'MDT Meeting - Oncology',
      sharedDate: '2024-01-07 16:45',
      expiresDate: '2024-01-14 16:45',
      accessCount: 8,
      status: 'Expired',
      type: 'MDT Review'
    }
  ];

  const consultationRequests = [
    {
      id: 'consult1',
      patient: 'Sarah Wilson',
      study: 'Mammography Bilateral',
      requestedBy: 'Dr. Davis - Primary Care',
      specialist: 'Dr. Martinez - Breast Imaging',
      urgency: 'Routine',
      question: 'Please evaluate suspicious calcifications in left breast',
      requestDate: '2024-01-08 09:30',
      status: 'Pending'
    },
    {
      id: 'consult2',
      patient: 'Michael Brown',
      study: 'CT Abdomen/Pelvis',
      requestedBy: 'Dr. Lee - Surgery',
      specialist: 'Dr. Thompson - Body Imaging',
      urgency: 'Urgent',
      question: 'Pre-operative assessment for bowel resection',
      requestDate: '2024-01-08 11:15',
      status: 'In Review'
    }
  ];

  const accessLog = [
    {
      timestamp: '2024-01-08 15:30',
      user: 'Dr. Williams',
      action: 'Viewed Study',
      study: 'CT Chest - John Doe',
      ipAddress: '192.168.1.100',
      duration: '12 min'
    },
    {
      timestamp: '2024-01-08 14:45',
      user: 'Dr. Johnson',
      action: 'Downloaded Images',
      study: 'MRI Brain - Jane Smith',
      ipAddress: '10.0.1.25',
      duration: '5 min'
    },
    {
      timestamp: '2024-01-08 13:20',
      user: 'MDT Team',
      action: 'Viewed Study',
      study: 'Chest X-Ray - Robert Brown',
      ipAddress: '172.16.1.50',
      duration: '8 min'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Image Sharing & Consultation</h3>
          <p className="text-gray-600">Secure image sharing for consultations and multidisciplinary reviews</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Studies
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Selection & Sharing Options */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select Study to Share</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {sharableStudies.map((study) => (
                  <div
                    key={study.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedStudy === study.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedStudy(study.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {study.modality}
                      </Badge>
                      <span className="text-xs text-gray-500">{study.date}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{study.patient}</h5>
                    <p className="text-xs text-gray-600">{study.study}</p>
                    <p className="text-xs text-gray-500">{study.series} series • {study.images} images • {study.size}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sharing Options</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div>
                <Label className="text-sm font-medium">Share Method</Label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shareMode"
                      value="secure-link"
                      checked={shareMode === 'secure-link'}
                      onChange={(e) => setShareMode(e.target.value)}
                    />
                    <Link className="h-4 w-4" />
                    <span className="text-sm">Secure Link</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shareMode"
                      value="email"
                      checked={shareMode === 'email'}
                      onChange={(e) => setShareMode(e.target.value)}
                    />
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email Invitation</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shareMode"
                      value="download"
                      checked={shareMode === 'download'}
                      onChange={(e) => setShareMode(e.target.value)}
                    />
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download Package</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="recipient" className="text-sm font-medium">Recipient</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter email or physician name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="purpose" className="text-sm font-medium">Purpose</Label>
                <select id="purpose" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="consultation">Consultation</option>
                  <option value="second-opinion">Second Opinion</option>
                  <option value="mdt-review">MDT Review</option>
                  <option value="teaching">Teaching Case</option>
                  <option value="research">Research</option>
                </select>
              </div>

              <div>
                <Label htmlFor="expiry" className="text-sm font-medium">Access Expires</Label>
                <select id="expiry" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="14d">14 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Access Permissions</Label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">View Images</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Download Images</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Add Annotations</span>
                </label>
              </div>

              <Button className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Study
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Shares & Consultation Requests */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Shares</CardTitle>
              <CardDescription className="text-xs">Currently shared studies and access status</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {sharedStudies.map((share, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        share.status === 'Active' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                      }`}>
                        {share.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {share.type}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{share.patient}</h5>
                    <p className="text-xs text-gray-600">{share.study}</p>
                    <p className="text-xs text-gray-500">Shared with: {share.sharedWith}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{share.accessCount} views</span>
                      </div>
                      <span className="text-xs text-gray-500">Expires: {share.expiresDate.split(' ')[0]}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Consultation Requests</CardTitle>
              <CardDescription className="text-xs">Incoming consultation requests</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {consultationRequests.map((request, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        request.urgency === 'Urgent' ? 'border-red-500 text-red-700' : 'border-blue-500 text-blue-700'
                      }`}>
                        {request.urgency}
                      </Badge>
                      <Badge className={`text-xs ${
                        request.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {request.status}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{request.patient}</h5>
                    <p className="text-xs text-gray-600">{request.study}</p>
                    <p className="text-xs text-gray-500">From: {request.requestedBy}</p>
                    <p className="text-xs text-gray-500">To: {request.specialist}</p>
                    <p className="text-xs text-gray-700 mt-1">{request.question}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" className="flex-1 text-xs bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Logs & Security */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Access Audit Log</CardTitle>
              <CardDescription className="text-xs">Recent access activity and security monitoring</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {accessLog.map((log, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900">{log.user}</span>
                      <span className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</span>
                    </div>
                    <p className="text-xs text-gray-600">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.study}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">IP: {log.ipAddress}</span>
                      <span className="text-xs text-gray-400">Duration: {log.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <Badge className="bg-green-500 text-xs">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IP Restrictions</span>
                <Badge variant="outline" className="text-xs">Hospital Network</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit Logging</span>
                <Badge className="bg-green-500 text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Notifications</span>
                <Badge className="bg-blue-500 text-xs">Email + SMS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Active Shares</span>
                <span className="text-xs font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total Views</span>
                <span className="text-xs font-medium">347</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Consultations</span>
                <span className="text-xs font-medium">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Downloads</span>
                <span className="text-xs font-medium">156</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
