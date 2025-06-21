
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  Clock, 
  User, 
  Calendar, 
  Tag,
  AlertTriangle,
  Shield,
  History
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  type: string;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  tags?: string[];
  visibility: string;
  is_critical: boolean;
  created_at: string;
  updated_at: string;
}

interface RecordViewerProps {
  record: MedicalRecord;
  onClose: () => void;
}

export const RecordViewer: React.FC<RecordViewerProps> = ({ record, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'emergency': return '🚨';
      case 'doctors': return '👨‍⚕️';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '🔒';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'doctors': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'family': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const mockAccessLogs = [
    {
      id: '1',
      accessed_by: 'Dr. Smith',
      access_type: 'view',
      accessed_at: '2024-01-15T10:30:00Z',
      ip_address: '192.168.1.1'
    },
    {
      id: '2',
      accessed_by: 'You',
      access_type: 'edit',
      accessed_at: '2024-01-14T15:45:00Z',
      ip_address: '192.168.1.100'
    },
    {
      id: '3',
      accessed_by: 'Emergency Contact',
      access_type: 'view',
      accessed_at: '2024-01-13T08:20:00Z',
      ip_address: '192.168.1.50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{record.title}</h1>
              {record.is_critical && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Critical
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground capitalize">{record.type.replace('_', ' ')}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="access">Access Log</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Type:</span>
                    <span className="capitalize">{record.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Created:</span>
                    <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Updated:</span>
                    <span>{new Date(record.updated_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Visibility:</span>
                    <Badge className={`text-xs ${getVisibilityColor(record.visibility)}`}>
                      {getVisibilityIcon(record.visibility)} {record.visibility}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Critical:</span>
                    <span>{record.is_critical ? 'Yes' : 'No'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Shared with:</span>
                    <span className="text-sm">
                      {record.visibility === 'private' ? 'Only you' :
                       record.visibility === 'family' ? 'Family members' :
                       record.visibility === 'doctors' ? 'Your doctors' :
                       'Emergency contacts'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {record.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{record.description}</p>
              </CardContent>
            </Card>
          )}

          {record.tags && record.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {record.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
              <CardDescription>
                View the content of your medical record
              </CardDescription>
            </CardHeader>
            <CardContent>
              {record.file_url ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Attached File</p>
                      <p className="text-sm text-muted-foreground">
                        {record.file_type} • Click to view or download
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View File
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No file attached to this record</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can edit this record to add a file
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access History</CardTitle>
              <CardDescription>
                Track who has accessed this medical record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {mockAccessLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-background rounded-lg">
                        {log.access_type === 'view' ? (
                          <Eye className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{log.accessed_by}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.accessed_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {log.access_type}ed this record
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {log.ip_address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Details</CardTitle>
              <CardDescription>
                System information and metadata for this record
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Record ID:</span>
                  <p className="font-mono text-xs mt-1">{record.id}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Patient ID:</span>
                  <p className="font-mono text-xs mt-1">{record.patient_id}</p>
                </div>
                {record.doctor_id && (
                  <div>
                    <span className="font-medium text-muted-foreground">Doctor ID:</span>
                    <p className="font-mono text-xs mt-1">{record.doctor_id}</p>
                  </div>
                )}
                {record.appointment_id && (
                  <div>
                    <span className="font-medium text-muted-foreground">Appointment ID:</span>
                    <p className="font-mono text-xs mt-1">{record.appointment_id}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">System Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Table:</span>
                    <span className="font-mono">medical_records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Level:</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      RLS Protected
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backup Status:</span>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      ✓ Backed up
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
