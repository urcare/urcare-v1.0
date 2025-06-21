
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Clock,
  Tag,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
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

export const RecordViewer = ({ record, onClose }: RecordViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = () => {
    if (record.file_url) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = record.file_url;
      link.download = `${record.title}.${record.file_type || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File downloaded successfully');
    } else {
      toast.error('No file available for download');
    }
  };

  const handleShare = () => {
    // Copy share link to clipboard
    const shareLink = `${window.location.origin}/medical-records/${record.id}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard');
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast.info('Edit mode enabled');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      // Handle delete logic here
      toast.success('Record deleted successfully');
      onClose();
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'prescription': 'bg-blue-100 text-blue-800',
      'lab_report': 'bg-green-100 text-green-800',
      'imaging': 'bg-purple-100 text-purple-800',
      'discharge_summary': 'bg-orange-100 text-orange-800',
      'consultation_notes': 'bg-gray-100 text-gray-800',
      'vaccination': 'bg-pink-100 text-pink-800',
      'insurance': 'bg-yellow-100 text-yellow-800',
      'referral': 'bg-indigo-100 text-indigo-800',
      'other': 'bg-slate-100 text-slate-800'
    };
    return colors[type] || colors.other;
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <Shield className="h-4 w-4" />;
      case 'family': return <User className="h-4 w-4" />;
      case 'doctors': return <FileText className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
          {record.is_critical && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Critical
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{record.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {record.description || 'No description provided'}
                  </CardDescription>
                </div>
                <Badge className={getRecordTypeColor(record.type)}>
                  {record.type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Record Type</label>
                      <p className="text-sm">{record.type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Visibility</label>
                      <div className="flex items-center gap-2">
                        {getVisibilityIcon(record.visibility)}
                        <p className="text-sm capitalize">{record.visibility}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{new Date(record.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{new Date(record.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {record.tags && record.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {record.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4">
                  {record.file_url ? (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Attached File</span>
                        <Badge variant="outline">{record.file_type?.toUpperCase()}</Badge>
                      </div>
                      
                      {record.file_type === 'pdf' && (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">PDF Document</p>
                          <Button onClick={handleDownload}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        </div>
                      )}
                      
                      {record.file_type?.startsWith('image/') && (
                        <div className="max-w-full">
                          <img 
                            src={record.file_url} 
                            alt={record.title}
                            className="max-w-full h-auto rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No file attached to this record</p>
                    </div>
                  )}
                  
                  {record.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Notes</label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm whitespace-pre-wrap">{record.description}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Record Created</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(record.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    {record.updated_at !== record.created_at && (
                      <div className="border-l-2 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Record Updated</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(record.updated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Record Type</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {record.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  {getVisibilityIcon(record.visibility)}
                </div>
                <div>
                  <p className="text-sm font-medium">Visibility</p>
                  <p className="text-xs text-gray-500 capitalize">{record.visibility}</p>
                </div>
              </div>
              
              {record.is_critical && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Critical Record</p>
                      <p className="text-xs text-gray-500">Requires immediate attention</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {record.doctor_id && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Doctor: Dr. Smith</span>
                </div>
              )}
              
              {record.appointment_id && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Appointment: {record.appointment_id}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Created: {new Date(record.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download Record
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Share with Doctor
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Record
              </Button>
              <Separator />
              <Button variant="destructive" size="sm" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Record
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
