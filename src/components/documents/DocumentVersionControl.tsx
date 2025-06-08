import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GitBranch, 
  GitMerge, 
  GitCommit,
  History, 
  FileText, 
  Download, 
  Upload,
  Eye,
  Rewind,
  FastForward,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  documentName: string;
  author: string;
  timestamp: string;
  changes: string[];
  status: 'current' | 'archived' | 'draft';
  size: string;
  checksum: string;
  comments: string;
  isMinor: boolean;
}

interface VersionComparison {
  id: string;
  lineNumber: number;
  type: 'added' | 'removed' | 'modified';
  oldContent: string;
  newContent: string;
}

export const DocumentVersionControl = () => {
  const [activeTab, setActiveTab] = useState('versions');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const documentVersions: DocumentVersion[] = [
    {
      id: 'v-1',
      version: '3.2.1',
      documentName: 'Patient Consent Form - Surgery Protocol',
      author: 'Dr. Smith',
      timestamp: '2024-01-22 14:30',
      changes: ['Updated risk disclosure section', 'Added new signature field', 'Modified consent language'],
      status: 'current',
      size: '2.4 MB',
      checksum: 'a1b2c3d4e5f6',
      comments: 'Updated based on legal review feedback',
      isMinor: false
    },
    {
      id: 'v-2',
      version: '3.2.0',
      documentName: 'Patient Consent Form - Surgery Protocol',
      author: 'Legal Team',
      timestamp: '2024-01-21 16:45',
      changes: ['Legal compliance review', 'Updated terms and conditions'],
      status: 'archived',
      size: '2.3 MB',
      checksum: 'f6e5d4c3b2a1',
      comments: 'Legal review complete',
      isMinor: false
    },
    {
      id: 'v-3',
      version: '3.1.2',
      documentName: 'Patient Consent Form - Surgery Protocol',
      author: 'Nurse Johnson',
      timestamp: '2024-01-20 10:15',
      changes: ['Minor formatting fixes', 'Corrected typos'],
      status: 'archived',
      size: '2.3 MB',
      checksum: 'b2a1f6e5d4c3',
      comments: 'Formatting and typo corrections',
      isMinor: true
    }
  ];

  const versionComparisons: VersionComparison[] = [
    {
      id: 'comp-1',
      lineNumber: 15,
      type: 'modified',
      oldContent: 'I understand the risks associated with this procedure.',
      newContent: 'I understand and acknowledge the risks associated with this medical procedure.'
    },
    {
      id: 'comp-2',
      lineNumber: 23,
      type: 'added',
      oldContent: '',
      newContent: 'Patient signature must be witnessed by a qualified medical professional.'
    },
    {
      id: 'comp-3',
      lineNumber: 31,
      type: 'removed',
      oldContent: 'This consent is valid for 30 days from signing.',
      newContent: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50 border-l-4 border-green-400';
      case 'removed': return 'bg-red-50 border-l-4 border-red-400';
      case 'modified': return 'bg-blue-50 border-l-4 border-blue-400';
      default: return 'bg-gray-50 border-l-4 border-gray-400';
    }
  };

  const handleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Version Control</h2>
          <p className="text-gray-600">Track changes, compare versions, and manage document history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Version
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Create Branch
          </Button>
          <Button className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            New Version
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="compare">Compare Versions</TabsTrigger>
          <TabsTrigger value="branches">Branch Management</TabsTrigger>
          <TabsTrigger value="analytics">Version Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="versions">
          <div className="space-y-4">
            {documentVersions.map(version => (
              <Card key={version.id} className={`transition-all ${selectedVersions.includes(version.id) ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedVersions.includes(version.id)}
                          onChange={() => handleVersionSelection(version.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <h3 className="font-medium">{version.documentName}</h3>
                          <p className="text-sm text-gray-600">Version {version.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(version.status)}>
                          {version.status}
                        </Badge>
                        {!version.isMinor && (
                          <Badge variant="outline">Major</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{version.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{version.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {version.timestamp}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Size:</span> {version.size}</p>
                        <p><span className="font-medium">Checksum:</span> {version.checksum}</p>
                        <p><span className="font-medium">Changes:</span> {version.changes.length}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Comments:</p>
                        <p className="text-sm text-gray-600">{version.comments}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Changes in this version:</h4>
                      <div className="space-y-1">
                        {version.changes.map((change, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <GitCommit className="h-3 w-3 text-blue-600" />
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Rewind className="h-3 w-3" />
                        Revert
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedVersions.length === 2 && (
            <div className="fixed bottom-6 right-6">
              <Button className="flex items-center gap-2 shadow-lg">
                <GitMerge className="h-4 w-4" />
                Compare Selected Versions
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Version Comparison</CardTitle>
                <CardDescription>Compare changes between document versions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Version A</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>v3.2.1 (Current)</option>
                      <option>v3.2.0</option>
                      <option>v3.1.2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Version B</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>v3.2.0</option>
                      <option>v3.1.2</option>
                      <option>v3.1.1</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Changes Detected:</h4>
                  <div className="space-y-3">
                    {versionComparisons.map(comparison => (
                      <div key={comparison.id} className={`p-4 rounded ${getChangeTypeColor(comparison.type)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Line {comparison.lineNumber}</span>
                          <Badge variant="outline" className={
                            comparison.type === 'added' ? 'bg-green-100 text-green-800' :
                            comparison.type === 'removed' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {comparison.type}
                          </Badge>
                        </div>
                        
                        {comparison.type === 'modified' && (
                          <div className="space-y-2">
                            <div className="bg-red-50 p-2 rounded text-sm">
                              <span className="text-red-600 font-medium">- </span>
                              {comparison.oldContent}
                            </div>
                            <div className="bg-green-50 p-2 rounded text-sm">
                              <span className="text-green-600 font-medium">+ </span>
                              {comparison.newContent}
                            </div>
                          </div>
                        )}
                        
                        {comparison.type === 'added' && (
                          <div className="bg-green-50 p-2 rounded text-sm">
                            <span className="text-green-600 font-medium">+ </span>
                            {comparison.newContent}
                          </div>
                        )}
                        
                        {comparison.type === 'removed' && (
                          <div className="bg-red-50 p-2 rounded text-sm">
                            <span className="text-red-600 font-medium">- </span>
                            {comparison.oldContent}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branches">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'main', status: 'active', commits: 15, lastCommit: '2 hours ago' },
              { name: 'legal-review', status: 'pending', commits: 3, lastCommit: '1 day ago' },
              { name: 'format-updates', status: 'merged', commits: 7, lastCommit: '3 days ago' }
            ].map((branch, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{branch.name}</span>
                      </div>
                      <Badge className={
                        branch.status === 'active' ? 'bg-green-100 text-green-800' :
                        branch.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {branch.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Commits:</span>
                        <span>{branch.commits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last commit:</span>
                        <span>{branch.lastCommit}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">
                        {branch.status === 'pending' ? 'Merge' : 'Switch'}
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

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Total Versions', value: '47', icon: History },
              { title: 'Active Branches', value: '3', icon: GitBranch },
              { title: 'Contributors', value: '8', icon: Users }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
