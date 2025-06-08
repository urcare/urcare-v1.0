
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  History, 
  Eye, 
  Download, 
  RotateCcw, 
  FileText, 
  User, 
  Calendar,
  Compare,
  Plus,
  Minus,
  Edit
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  author: string;
  timestamp: string;
  changes: string;
  size: string;
  status: 'current' | 'archived' | 'draft';
  changeCount: number;
  comment: string;
}

interface DocumentComparison {
  lineNumber: number;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  oldContent?: string;
  newContent?: string;
}

export const DocumentVersionControl = () => {
  const [activeTab, setActiveTab] = useState('versions');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const documentVersions: DocumentVersion[] = [
    {
      id: 'v1',
      version: '3.2.1',
      author: 'Dr. Smith',
      timestamp: '2024-01-22 14:30',
      changes: 'Updated medication dosage in section 4',
      size: '2.4 MB',
      status: 'current',
      changeCount: 3,
      comment: 'Revised based on latest clinical guidelines'
    },
    {
      id: 'v2',
      version: '3.2.0',
      author: 'Nurse Johnson',
      timestamp: '2024-01-21 11:15',
      changes: 'Added patient allergy information',
      size: '2.3 MB',
      status: 'archived',
      changeCount: 7,
      comment: 'Emergency update for allergy documentation'
    },
    {
      id: 'v3',
      version: '3.1.5',
      author: 'Dr. Williams',
      timestamp: '2024-01-20 16:45',
      changes: 'Initial discharge summary draft',
      size: '2.1 MB',
      status: 'archived',
      changeCount: 12,
      comment: 'First complete draft'
    },
    {
      id: 'v4',
      version: '3.1.4',
      author: 'Admin User',
      timestamp: '2024-01-20 09:30',
      changes: 'Template structure created',
      size: '1.8 MB',
      status: 'archived',
      changeCount: 0,
      comment: 'Initial template setup'
    }
  ];

  const comparisonData: DocumentComparison[] = [
    { lineNumber: 1, type: 'unchanged', newContent: 'Patient Name: John Doe' },
    { lineNumber: 2, type: 'unchanged', newContent: 'Date of Birth: 1985-05-15' },
    { lineNumber: 3, type: 'modified', oldContent: 'Allergies: None known', newContent: 'Allergies: Penicillin, Shellfish' },
    { lineNumber: 4, type: 'unchanged', newContent: 'Admission Date: 2024-01-18' },
    { lineNumber: 5, type: 'added', newContent: 'Emergency Contact: Jane Doe (555-0123)' },
    { lineNumber: 6, type: 'unchanged', newContent: 'Primary Diagnosis: Acute appendicitis' },
    { lineNumber: 7, type: 'modified', oldContent: 'Medication: Ibuprofen 400mg', newContent: 'Medication: Ibuprofen 600mg' },
    { lineNumber: 8, type: 'removed', oldContent: 'Previous medication: Aspirin' },
    { lineNumber: 9, type: 'unchanged', newContent: 'Discharge Instructions: Rest and follow-up' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50 border-l-4 border-green-500 text-green-800';
      case 'removed': return 'bg-red-50 border-l-4 border-red-500 text-red-800';
      case 'modified': return 'bg-blue-50 border-l-4 border-blue-500 text-blue-800';
      case 'unchanged': return 'bg-gray-50 border-l-4 border-gray-300 text-gray-600';
      default: return 'bg-gray-50';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return Plus;
      case 'removed': return Minus;
      case 'modified': return Edit;
      default: return FileText;
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Version Control</h2>
          <p className="text-gray-600">Track changes, compare versions, and manage document history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={selectedVersions.length !== 2}
          >
            <Compare className="h-4 w-4" />
            Compare Selected
          </Button>
          <Button className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Create Branch
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="compare">Document Comparison</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="merge">Merge Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
              <CardDescription>
                Complete revision history with automated versioning and change tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentVersions.map(version => (
                  <div 
                    key={version.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedVersions.includes(version.id) ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleVersionSelect(version.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-5 w-5 text-gray-600" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">v{version.version}</span>
                              <Badge className={getStatusColor(version.status)}>
                                {version.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{version.changes}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {version.timestamp}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{version.changeCount} changes</Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          {version.status !== 'current' && (
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {version.comment && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <strong>Comment:</strong> {version.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compare className="h-5 w-5" />
                Document Comparison
              </CardTitle>
              <CardDescription>
                Side-by-side comparison with change highlighting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Comparing v3.2.1 (current) with v3.2.0</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-600" />
                      2 additions
                    </span>
                    <span className="flex items-center gap-1">
                      <Minus className="h-3 w-3 text-red-600" />
                      1 deletion
                    </span>
                    <span className="flex items-center gap-1">
                      <Edit className="h-3 w-3 text-blue-600" />
                      2 modifications
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {comparisonData.map((change, index) => {
                    const ChangeIcon = getChangeIcon(change.type);
                    return (
                      <div key={index} className={`p-3 rounded ${getChangeTypeColor(change.type)}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 min-w-[60px]">
                            <ChangeIcon className="h-4 w-4" />
                            <span className="text-xs font-mono">{change.lineNumber}</span>
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            {change.type === 'modified' && change.oldContent && (
                              <div className="text-sm line-through text-red-600">
                                - {change.oldContent}
                              </div>
                            )}
                            {change.type === 'removed' && change.oldContent && (
                              <div className="text-sm line-through text-red-600">
                                - {change.oldContent}
                              </div>
                            )}
                            {change.newContent && (
                              <div className={`text-sm ${
                                change.type === 'added' ? 'text-green-600' : 
                                change.type === 'modified' ? 'text-blue-600' : 
                                'text-gray-600'
                              }`}>
                                {change.type !== 'unchanged' && change.type !== 'removed' ? '+ ' : '  '}
                                {change.newContent}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'main', status: 'active', commits: 23, lastUpdate: '2 hours ago' },
              { name: 'emergency-updates', status: 'active', commits: 5, lastUpdate: '1 day ago' },
              { name: 'template-revision', status: 'merged', commits: 8, lastUpdate: '3 days ago' },
              { name: 'compliance-update', status: 'draft', commits: 2, lastUpdate: '5 days ago' }
            ].map((branch, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <GitBranch className="h-8 w-8 text-blue-600" />
                      <Badge className={getStatusColor(branch.status)}>
                        {branch.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">{branch.name}</h3>
                      <p className="text-sm text-gray-600">{branch.commits} commits</p>
                      <p className="text-xs text-gray-500">Updated {branch.lastUpdate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Switch
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="merge">
          <Card>
            <CardHeader>
              <CardTitle>Merge Requests</CardTitle>
              <CardDescription>Review and manage branch merge requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: 'Emergency allergy update merge', 
                    from: 'emergency-updates', 
                    to: 'main', 
                    status: 'pending', 
                    author: 'Nurse Johnson',
                    changes: 5,
                    created: '2 hours ago'
                  },
                  { 
                    title: 'Template compliance updates', 
                    from: 'compliance-update', 
                    to: 'main', 
                    status: 'approved', 
                    author: 'Dr. Smith',
                    changes: 3,
                    created: '1 day ago'
                  }
                ].map((request, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-gray-600">
                          {request.from} → {request.to} • {request.changes} changes • by {request.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
