
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Search,
  ExternalLink,
  BarChart3,
  Users,
  Calendar,
  Star
} from 'lucide-react';

export const PublicationAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const publicationMetrics = {
    totalPapers: 847,
    peerReviewed: 734,
    openAccess: 456,
    totalCitations: 12456,
    hIndex: 68,
    i10Index: 234
  };

  const publications = [
    {
      title: 'Machine Learning Approaches in Clinical Decision Support Systems',
      journal: 'Nature Medicine',
      year: 2024,
      impact: 58.7,
      citations: 234,
      authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
      type: 'research',
      status: 'published',
      doi: '10.1038/s41591-024-0001-1'
    },
    {
      title: 'Cardiovascular Risk Assessment Using AI-Powered Biomarkers',
      journal: 'The Lancet',
      year: 2023,
      impact: 168.9,
      citations: 567,
      authors: ['Dr. Michael Chen', 'Dr. Sarah Johnson'],
      type: 'research',
      status: 'published',
      doi: '10.1016/S0140-6736(23)00001-X'
    },
    {
      title: 'Predictive Analytics in Emergency Medicine: A Systematic Review',
      journal: 'JAMA Internal Medicine',
      year: 2023,
      impact: 44.8,
      citations: 123,
      authors: ['Dr. Emily Rodriguez', 'Dr. Sarah Johnson'],
      type: 'review',
      status: 'published',
      doi: '10.1001/jamainternmed.2023.0001'
    }
  ];

  const citationTrends = [
    { month: 'Jan', citations: 145 },
    { month: 'Feb', citations: 167 },
    { month: 'Mar', citations: 189 },
    { month: 'Apr', citations: 203 },
    { month: 'May', citations: 234 },
    { month: 'Jun', citations: 256 }
  ];

  const collaborationNetwork = [
    { institution: 'Johns Hopkins University', papers: 45, strength: 85 },
    { institution: 'Stanford University', papers: 38, strength: 78 },
    { institution: 'Harvard Medical School', papers: 32, strength: 72 },
    { institution: 'Mayo Clinic', papers: 28, strength: 68 },
    { institution: 'Oxford University', papers: 24, strength: 64 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publication Analytics</h2>
          <p className="text-gray-600">Track research output, citations, and collaboration networks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Impact Report
          </Button>
          <Button className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Export Citations
          </Button>
        </div>
      </div>

      {/* Publication Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{publicationMetrics.totalPapers}</p>
            <p className="text-sm text-blue-700">Total Papers</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{publicationMetrics.peerReviewed}</p>
            <p className="text-sm text-green-700">Peer Reviewed</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{publicationMetrics.totalCitations.toLocaleString()}</p>
            <p className="text-sm text-purple-700">Citations</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{publicationMetrics.hIndex}</p>
            <p className="text-sm text-orange-700">H-Index</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{publicationMetrics.i10Index}</p>
            <p className="text-sm text-teal-700">i10-Index</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <ExternalLink className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{publicationMetrics.openAccess}</p>
            <p className="text-sm text-indigo-700">Open Access</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Publications</CardTitle>
            <CardDescription>Latest research papers and their impact metrics</CardDescription>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="5years">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{pub.title}</h4>
                    <Badge className={`ml-2 ${pub.type === 'research' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                      {pub.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pub.journal} • {pub.year}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-2">
                    <div>Impact Factor: {pub.impact}</div>
                    <div>Citations: {pub.citations}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Authors: {pub.authors.slice(0, 2).join(', ')}
                      {pub.authors.length > 2 && ` +${pub.authors.length - 2} more`}
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collaboration Network */}
        <Card>
          <CardHeader>
            <CardTitle>Collaboration Network</CardTitle>
            <CardDescription>Research partnerships and institutional connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborationNetwork.map((collab, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{collab.institution}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{collab.papers} papers</span>
                      <Badge variant="outline">{collab.strength}%</Badge>
                    </div>
                  </div>
                  <Progress value={collab.strength} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
