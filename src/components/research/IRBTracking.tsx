
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Upload,
  Download,
  Search,
  Calendar
} from 'lucide-react';

interface IRBSubmission {
  id: string;
  protocolId: string;
  submissionType: 'initial' | 'amendment' | 'continuation' | 'closure';
  title: string;
  submissionDate: string;
  reviewDate?: string;
  approvalDate?: string;
  expiryDate?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'conditionally_approved' | 'rejected';
  irbBoard: string;
  principalInvestigator: string;
  priority: 'routine' | 'expedited' | 'exempt';
  documents: string[];
  conditions?: string[];
}

export const IRBTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewSubmissionOpen, setIsNewSubmissionOpen] = useState(false);

  const irbSubmissions: IRBSubmission[] = [
    {
      id: 'IRB-2024-001',
      protocolId: 'CARDIO-001',
      submissionType: 'initial',
      title: 'Cardiovascular Prevention Trial with Novel ACE Inhibitor',
      submissionDate: '2023-06-15',
      reviewDate: '2023-07-01',
      approvalDate: '2023-07-10',
      expiryDate: '2024-07-10',
      status: 'approved',
      irbBoard: 'Main IRB Committee',
      principalInvestigator: 'Dr. Sarah Johnson',
      priority: 'expedited',
      documents: ['Protocol v2.1', 'Informed Consent v3.0', 'Investigator CV'],
      conditions: []
    },
    {
      id: 'IRB-2024-002',
      protocolId: 'NEURO-002',
      submissionType: 'initial',
      title: 'Neuroprotective Agent in Stroke Recovery',
      submissionDate: '2024-01-10',
      reviewDate: '2024-01-25',
      status: 'under_review',
      irbBoard: 'Neurology IRB Committee',
      principalInvestigator: 'Dr. Michael Chen',
      priority: 'routine',
      documents: ['Protocol v1.3', 'Informed Consent v2.0', 'Investigator Brochure'],
      conditions: []
    },
    {
      id: 'IRB-2024-003',
      protocolId: 'CARDIO-001',
      submissionType: 'amendment',
      title: 'Amendment 1: Addition of Biomarker Substudy',
      submissionDate: '2024-01-20',
      status: 'conditionally_approved',
      irbBoard: 'Main IRB Committee',
      principalInvestigator: 'Dr. Sarah Johnson',
      priority: 'expedited',
      documents: ['Amendment 1', 'Updated Consent v3.1'],
      conditions: ['Clarify biomarker storage duration', 'Update statistical analysis plan']
    }
  ];

  const irbStats = {
    totalSubmissions: 15,
    approved: 12,
    underReview: 2,
    conditionallyApproved: 1,
    rejected: 0,
    avgReviewTime: 18
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'conditionally_approved': return <AlertTriangle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      draft: 'bg-gray-500',
      submitted: 'bg-blue-500',
      under_review: 'bg-yellow-500',
      approved: 'bg-green-500',
      conditionally_approved: 'bg-orange-500',
      rejected: 'bg-red-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      routine: 'bg-blue-100 text-blue-800',
      expedited: 'bg-orange-100 text-orange-800',
      exempt: 'bg-green-100 text-green-800'
    };
    return colorMap[priority as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const filteredSubmissions = irbSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.protocolId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IRB Tracking</h2>
          <p className="text-gray-600">Institutional Review Board submission and approval tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isNewSubmissionOpen} onOpenChange={setIsNewSubmissionOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Submission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New IRB Submission</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="protocol">Protocol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardio-001">CARDIO-001</SelectItem>
                        <SelectItem value="neuro-002">NEURO-002</SelectItem>
                        <SelectItem value="onco-003">ONCO-003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="submission-type">Submission Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Submission</SelectItem>
                        <SelectItem value="amendment">Amendment</SelectItem>
                        <SelectItem value="continuation">Continuation</SelectItem>
                        <SelectItem value="closure">Study Closure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Submission Title</Label>
                  <Input id="title" placeholder="Enter submission title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="irb-board">IRB Board</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select IRB board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-irb">Main IRB Committee</SelectItem>
                        <SelectItem value="neuro-irb">Neurology IRB Committee</SelectItem>
                        <SelectItem value="onco-irb">Oncology IRB Committee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Review Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="expedited">Expedited</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Submission description" rows={3} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsNewSubmissionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewSubmissionOpen(false)}>
                    Create Submission
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* IRB Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{irbStats.totalSubmissions}</p>
            <p className="text-sm text-blue-700">Total Submissions</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{irbStats.approved}</p>
            <p className="text-sm text-green-700">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{irbStats.underReview}</p>
            <p className="text-sm text-yellow-700">Under Review</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{irbStats.conditionallyApproved}</p>
            <p className="text-sm text-orange-700">Conditional</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{irbStats.rejected}</p>
            <p className="text-sm text-red-700">Rejected</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{irbStats.avgReviewTime}</p>
            <p className="text-sm text-purple-700">Avg Review Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search submissions..."
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
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="conditionally_approved">Conditionally Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="grid gap-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
                    <Badge className={`${getStatusColor(submission.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(submission.status)}
                      {submission.status.replace('_', ' ').charAt(0).toUpperCase() + submission.status.replace('_', ' ').slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(submission.priority)}>
                      {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Submission ID:</span>
                      <p className="text-gray-600">{submission.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Protocol:</span>
                      <p className="text-gray-600">{submission.protocolId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-600">{submission.submissionType.charAt(0).toUpperCase() + submission.submissionType.slice(1)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">IRB Board:</span>
                      <p className="text-gray-600">{submission.irbBoard}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">PI:</span>
                      <p className="text-gray-600">{submission.principalInvestigator}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <p className="text-gray-600">{submission.submissionDate}</p>
                    </div>
                    {submission.approvalDate && (
                      <div>
                        <span className="font-medium text-gray-700">Approved:</span>
                        <p className="text-gray-600">{submission.approvalDate}</p>
                      </div>
                    )}
                    {submission.expiryDate && (
                      <div>
                        <span className="font-medium text-gray-700">Expires:</span>
                        <p className="text-gray-600">{submission.expiryDate}</p>
                      </div>
                    )}
                  </div>

                  {submission.conditions && submission.conditions.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-700 text-sm">Conditions:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {submission.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-gray-700 text-sm">Documents:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {submission.documents.map((doc, index) => (
                        <Badge key={index} variant="outline">{doc}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View Details
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
