
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search
} from 'lucide-react';

interface Protocol {
  id: string;
  title: string;
  version: string;
  phase: string;
  sponsor: string;
  principalInvestigator: string;
  status: 'draft' | 'review' | 'approved' | 'active' | 'completed';
  lastModified: string;
  participants: number;
  description: string;
}

export const ProtocolManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const protocols: Protocol[] = [
    {
      id: 'CARDIO-001',
      title: 'Cardiovascular Prevention Trial with Novel ACE Inhibitor',
      version: '2.1',
      phase: 'Phase III',
      sponsor: 'CardioTech Pharmaceuticals',
      principalInvestigator: 'Dr. Sarah Johnson',
      status: 'active',
      lastModified: '2024-01-15',
      participants: 245,
      description: 'Multi-center randomized controlled trial evaluating efficacy and safety'
    },
    {
      id: 'NEURO-002',
      title: 'Neuroprotective Agent in Stroke Recovery',
      version: '1.3',
      phase: 'Phase II',
      sponsor: 'NeuroScience Institute',
      principalInvestigator: 'Dr. Michael Chen',
      status: 'review',
      lastModified: '2024-01-10',
      participants: 0,
      description: 'Double-blind placebo-controlled study of neuroprotective intervention'
    },
    {
      id: 'ONCO-003',
      title: 'Immunotherapy Combination in Advanced Melanoma',
      version: '3.0',
      phase: 'Phase I',
      sponsor: 'Oncology Research Center',
      principalInvestigator: 'Dr. Emily Rodriguez',
      status: 'approved',
      lastModified: '2024-01-08',
      participants: 89,
      description: 'Safety and efficacy study of novel immunotherapy combination'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      draft: 'bg-gray-500',
      review: 'bg-yellow-500',
      approved: 'bg-blue-500',
      active: 'bg-green-500',
      completed: 'bg-purple-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || protocol.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Protocol Management</h2>
          <p className="text-gray-600">Manage research protocols and study documents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Protocol
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Protocol</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protocol-id">Protocol ID</Label>
                  <Input id="protocol-id" placeholder="e.g., STUDY-001" />
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" placeholder="e.g., 1.0" />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Protocol Title</Label>
                <Input id="title" placeholder="Enter protocol title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phase">Study Phase</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phase1">Phase I</SelectItem>
                      <SelectItem value="phase2">Phase II</SelectItem>
                      <SelectItem value="phase3">Phase III</SelectItem>
                      <SelectItem value="phase4">Phase IV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sponsor">Sponsor</Label>
                  <Input id="sponsor" placeholder="Study sponsor" />
                </div>
              </div>
              <div>
                <Label htmlFor="pi">Principal Investigator</Label>
                <Input id="pi" placeholder="Principal investigator name" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Protocol description" rows={3} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Protocol
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search protocols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Protocols List */}
      <div className="grid gap-4">
        {filteredProtocols.map((protocol) => (
          <Card key={protocol.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{protocol.title}</h3>
                    <Badge className={`${getStatusColor(protocol.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(protocol.status)}
                      {protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{protocol.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Protocol ID:</span>
                      <p className="text-gray-600">{protocol.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Version:</span>
                      <p className="text-gray-600">{protocol.version}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phase:</span>
                      <p className="text-gray-600">{protocol.phase}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Participants:</span>
                      <p className="text-gray-600">{protocol.participants}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sponsor:</span>
                      <p className="text-gray-600">{protocol.sponsor}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">PI:</span>
                      <p className="text-gray-600">{protocol.principalInvestigator}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Modified:</span>
                      <p className="text-gray-600">{protocol.lastModified}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
