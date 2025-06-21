
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Share, 
  Edit, 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  Tag,
  Lock,
  Users,
  Shield
} from 'lucide-react';

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

interface RecordViewerProps {
  record: Record;
  onClose: () => void;
}

export const RecordViewer: React.FC<RecordViewerProps> = ({ record, onClose }) => {
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

  const VisibilityIcon = getVisibilityIcon(record.visibility);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Records
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Record Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{record.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {record.provider}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {record.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {record.type}
                  </div>
                </div>
              </CardDescription>
            </div>
            
            <div className="flex flex-col gap-2">
              <Badge className={getVisibilityColor(record.visibility)}>
                <VisibilityIcon className="h-3 w-3 mr-1" />
                {record.visibility}
              </Badge>
              <Badge variant="outline">{record.status}</Badge>
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
        </CardHeader>
        
        <CardContent>
          {/* Record Content */}
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg min-h-[400px]">
              <div className="text-center text-gray-500 py-20">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium">Medical Record Content</div>
                <div className="text-sm">
                  This is where the actual medical record content would be displayed
                </div>
                <div className="text-xs mt-2 text-gray-400">
                  File size: {record.size} • Last accessed: {record.lastAccessed}
                </div>
              </div>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Record Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Record ID:</span> {record.id}
              </div>
              <div>
                <span className="font-medium">Type:</span> {record.type}
              </div>
              <div>
                <span className="font-medium">Provider:</span> {record.provider}
              </div>
              <div>
                <span className="font-medium">Date Created:</span> {record.date}
              </div>
              <div>
                <span className="font-medium">File Size:</span> {record.size}
              </div>
              <div>
                <span className="font-medium">Last Accessed:</span> {record.lastAccessed}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
            <Button variant="outline" className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Share with Doctor
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="w-full">
              <Tag className="h-4 w-4 mr-2" />
              Add Tags
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
