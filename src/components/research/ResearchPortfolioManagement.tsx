
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users,
  Target,
  Award,
  Calendar,
  FileText,
  Globe,
  Activity
} from 'lucide-react';

export const ResearchPortfolioManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('year');

  const portfolioMetrics = {
    totalProjects: 156,
    activeResearchers: 89,
    totalFunding: 24500000,
    publications: 234,
    patents: 12,
    industryPartnerships: 18,
    studentInvolvement: 145,
    internationalCollabs: 28
  };

  const departmentData = [
    {
      name: 'Cardiology',
      projects: 23,
      funding: 5600000,
      researchers: 18,
      publications: 45,
      impact: 4.8,
      status: 'growing'
    },
    {
      name: 'Neurology',
      projects: 19,
      funding: 4200000,
      researchers: 15,
      publications: 38,
      impact: 5.2,
      status: 'stable'
    },
    {
      name: 'Oncology',
      projects: 28,
      funding: 7800000,
      researchers: 22,
      publications: 67,
      impact: 6.1,
      status: 'growing'
    },
    {
      name: 'Pediatrics',
      projects: 15,
      funding: 2900000,
      researchers: 12,
      publications: 29,
      impact: 3.9,
      status: 'stable'
    },
    {
      name: 'Psychiatry',
      projects: 18,
      funding: 3400000,
      researchers: 14,
      publications: 34,
      impact: 4.3,
      status: 'growing'
    }
  ];

  const strategicInitiatives = [
    {
      title: 'AI in Healthcare Initiative',
      description: 'Cross-departmental AI research program',
      budget: 8500000,
      duration: 60,
      progress: 35,
      departments: ['Cardiology', 'Neurology', 'Radiology'],
      startDate: '2023-01-01',
      milestones: 8,
      completedMilestones: 3
    },
    {
      title: 'Precision Medicine Consortium',
      description: 'Genomics-based personalized treatment research',
      budget: 12000000,
      duration: 72,
      progress: 58,
      departments: ['Oncology', 'Genetics', 'Pharmacology'],
      startDate: '2022-06-01',
      milestones: 12,
      completedMilestones: 7
    },
    {
      title: 'Global Health Partnership',
      description: 'International collaborative research program',
      budget: 6200000,
      duration: 48,
      progress: 22,
      departments: ['Infectious Disease', 'Public Health'],
      startDate: '2023-09-01',
      milestones: 6,
      completedMilestones: 1
    }
  ];

  const performanceIndicators = [
    { metric: 'Research Output', current: 234, target: 250, unit: 'publications', trend: 'up' },
    { metric: 'Grant Success Rate', current: 68, target: 70, unit: '%', trend: 'stable' },
    { metric: 'Industry Partnerships', current: 18, target: 25, unit: 'partnerships', trend: 'up' },
    { metric: 'Student Engagement', current: 145, target: 160, unit: 'students', trend: 'up' },
    { metric: 'International Reach', current: 28, target: 35, unit: 'countries', trend: 'stable' },
    { metric: 'Patent Applications', current: 12, target: 15, unit: 'patents', trend: 'down' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'bg-green-500';
      case 'stable': return 'bg-blue-500';
      case 'declining': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Portfolio Management</h2>
          <p className="text-gray-600">Institutional research oversight and strategic planning</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Strategic Report
          </Button>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{portfolioMetrics.totalProjects}</p>
            <p className="text-sm text-blue-700">Projects</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{portfolioMetrics.activeResearchers}</p>
            <p className="text-sm text-green-700">Researchers</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">${(portfolioMetrics.totalFunding / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-purple-700">Funding</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{portfolioMetrics.publications}</p>
            <p className="text-sm text-orange-700">Publications</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{portfolioMetrics.patents}</p>
            <p className="text-sm text-teal-700">Patents</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{portfolioMetrics.industryPartnerships}</p>
            <p className="text-sm text-indigo-700">Industry</p>
          </CardContent>
        </Card>
        <Card className="border-pink-200 bg-pink-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-900">{portfolioMetrics.studentInvolvement}</p>
            <p className="text-sm text-pink-700">Students</p>
          </CardContent>
        </Card>
        <Card className="border-cyan-200 bg-cyan-50">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-cyan-900">{portfolioMetrics.internationalCollabs}</p>
            <p className="text-sm text-cyan-700">Countries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Research output and impact by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                    <Badge className={`${getStatusColor(dept.status)} text-white`}>
                      {dept.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                    <div>Projects: {dept.projects}</div>
                    <div>Researchers: {dept.researchers}</div>
                    <div>Funding: ${(dept.funding / 1000000).toFixed(1)}M</div>
                    <div>Publications: {dept.publications}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Impact Factor: {dept.impact}</span>
                    <span className="font-medium text-gray-900">
                      ${(dept.funding / dept.projects / 1000).toFixed(0)}K avg/project
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategic Initiatives */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Initiatives</CardTitle>
            <CardDescription>Major cross-departmental research programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategicInitiatives.map((initiative, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{initiative.title}</h4>
                      <p className="text-sm text-gray-600">{initiative.description}</p>
                    </div>
                    <Badge variant="outline">
                      ${(initiative.budget / 1000000).toFixed(1)}M
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{initiative.completedMilestones}/{initiative.milestones} milestones</span>
                    </div>
                    <Progress value={initiative.progress} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Departments: {initiative.departments.join(', ')}</p>
                    <p>Started: {initiative.startDate} • Duration: {initiative.duration} months</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Research portfolio performance metrics and targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceIndicators.map((indicator, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{indicator.metric}</h4>
                  {getTrendIcon(indicator.trend)}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{indicator.current}</span>
                  <span className="text-sm text-gray-600">/ {indicator.target} {indicator.unit}</span>
                </div>
                <Progress value={(indicator.current / indicator.target) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {((indicator.current / indicator.target) * 100).toFixed(1)}% of target achieved
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
