
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Calendar, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';

export const GrantManagement = () => {
  const [selectedView, setSelectedView] = useState('active');

  const grantMetrics = {
    totalValue: 8450000,
    activeGrants: 23,
    successRate: 68,
    avgAmount: 367391,
    pendingApplications: 8,
    upcomingDeadlines: 5
  };

  const grants = [
    {
      id: 'NIH-R01-2024-001',
      title: 'AI-Powered Diagnostic Tools for Early Cancer Detection',
      agency: 'National Institutes of Health',
      type: 'R01',
      amount: 2500000,
      duration: 60,
      startDate: '2024-01-01',
      endDate: '2029-01-01',
      status: 'active',
      pi: 'Dr. Sarah Johnson',
      progress: 12,
      nextMilestone: 'Interim Report Due',
      milestoneDate: '2024-06-30'
    },
    {
      id: 'NSF-CAREER-2023-045',
      title: 'Machine Learning in Clinical Decision Support Systems',
      agency: 'National Science Foundation',
      type: 'CAREER',
      amount: 875000,
      duration: 60,
      startDate: '2023-09-01',
      endDate: '2028-09-01',
      status: 'active',
      pi: 'Dr. Michael Chen',
      progress: 35,
      nextMilestone: 'Annual Report',
      milestoneDate: '2024-08-31'
    },
    {
      id: 'AHRQ-HS-2024-012',
      title: 'Healthcare Quality Improvement through Predictive Analytics',
      agency: 'Agency for Healthcare Research and Quality',
      type: 'R18',
      amount: 1200000,
      duration: 36,
      startDate: '2024-03-01',
      endDate: '2027-03-01',
      status: 'pending',
      pi: 'Dr. Emily Rodriguez',
      progress: 0,
      nextMilestone: 'Award Notification',
      milestoneDate: '2024-02-15'
    }
  ];

  const upcomingDeadlines = [
    {
      grant: 'NIH-R01-2024-001',
      milestone: 'Interim Report',
      date: '2024-06-30',
      daysLeft: 45,
      priority: 'high'
    },
    {
      grant: 'NSF-CAREER-2023-045',
      milestone: 'Budget Report',
      date: '2024-05-15',
      daysLeft: 30,
      priority: 'medium'
    },
    {
      grant: 'AHRQ-HS-2024-012',
      milestone: 'IRB Approval Required',
      date: '2024-04-30',
      daysLeft: 15,
      priority: 'critical'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grant Management</h2>
          <p className="text-gray-600">Funding lifecycle management and milestone tracking</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Grants</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="all">All Grants</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      {/* Grant Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">${(grantMetrics.totalValue / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-green-700">Total Value</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{grantMetrics.activeGrants}</p>
            <p className="text-sm text-blue-700">Active Grants</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{grantMetrics.successRate}%</p>
            <p className="text-sm text-purple-700">Success Rate</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">${(grantMetrics.avgAmount / 1000).toFixed(0)}K</p>
            <p className="text-sm text-orange-700">Avg Amount</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{grantMetrics.pendingApplications}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{grantMetrics.upcomingDeadlines}</p>
            <p className="text-sm text-red-700">Deadlines</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Grants */}
        <Card>
          <CardHeader>
            <CardTitle>Grant Portfolio</CardTitle>
            <CardDescription>Current funding status and progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grants.map((grant) => (
                <div key={grant.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{grant.title}</h4>
                      <p className="text-sm text-gray-600">{grant.agency} • {grant.type}</p>
                    </div>
                    <Badge className={`${getStatusColor(grant.status)} text-white ml-2`}>
                      {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>Amount: ${grant.amount.toLocaleString()}</div>
                    <div>Duration: {grant.duration} months</div>
                    <div>PI: {grant.pi}</div>
                    <div>Progress: {grant.progress}%</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={grant.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Next: {grant.nextMilestone}</span>
                      <span>Due: {grant.milestoneDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Critical milestones and reporting requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{deadline.milestone}</h4>
                      <p className="text-sm text-gray-600">{deadline.grant}</p>
                    </div>
                    <Badge className={`${getPriorityColor(deadline.priority)} text-white`}>
                      {deadline.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{deadline.date}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      deadline.daysLeft <= 15 ? 'text-red-600' :
                      deadline.daysLeft <= 30 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
