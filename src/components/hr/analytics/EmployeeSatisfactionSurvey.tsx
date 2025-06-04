
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Send,
  Eye,
  Plus,
  Calendar
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

export const EmployeeSatisfactionSurvey = () => {
  const [selectedSurvey, setSelectedSurvey] = useState('current');

  const surveyMetrics = [
    { label: 'Response Rate', value: '78%', change: '+5.2%', trend: 'up' },
    { label: 'Overall Satisfaction', value: '4.2/5', change: '+0.3', trend: 'up' },
    { label: 'Active Surveys', value: 3, change: 'New this week', trend: 'stable' },
    { label: 'Avg Completion Time', value: '8.5 min', change: '-1.2 min', trend: 'down' }
  ];

  const satisfactionTrends = [
    { month: 'Jan', satisfaction: 3.8, engagement: 3.6, worklife: 3.5 },
    { month: 'Feb', satisfaction: 3.9, engagement: 3.7, worklife: 3.6 },
    { month: 'Mar', satisfaction: 4.0, engagement: 3.8, worklife: 3.7 },
    { month: 'Apr', satisfaction: 4.1, engagement: 3.9, worklife: 3.8 },
    { month: 'May', satisfaction: 4.2, engagement: 4.0, worklife: 3.9 },
    { month: 'Jun', satisfaction: 4.2, engagement: 4.1, worklife: 4.0 }
  ];

  const departmentSatisfaction = [
    { department: 'ICU', satisfaction: 4.3, responses: 22, total: 24 },
    { department: 'Emergency', satisfaction: 4.0, responses: 16, total: 18 },
    { department: 'Surgery', satisfaction: 4.5, responses: 14, total: 15 },
    { department: 'General Ward', satisfaction: 3.9, responses: 28, total: 32 },
    { department: 'Pharmacy', satisfaction: 4.1, responses: 8, total: 10 },
    { department: 'Lab', satisfaction: 4.4, responses: 12, total: 14 }
  ];

  const surveyTemplates = [
    {
      id: '1',
      name: 'Monthly Pulse Survey',
      description: 'Quick monthly check-in on satisfaction and engagement',
      questions: 8,
      duration: '5 min',
      frequency: 'Monthly',
      status: 'active'
    },
    {
      id: '2',
      name: 'Annual Engagement Survey',
      description: 'Comprehensive yearly assessment of employee engagement',
      questions: 45,
      duration: '15 min',
      frequency: 'Yearly',
      status: 'scheduled'
    },
    {
      id: '3',
      name: 'Exit Interview Survey',
      description: 'Feedback collection for departing employees',
      questions: 20,
      duration: '10 min',
      frequency: 'As needed',
      status: 'active'
    }
  ];

  const recentFeedback = [
    {
      id: '1',
      category: 'Work-Life Balance',
      sentiment: 'positive',
      comment: 'The new flexible scheduling has really helped with managing family commitments.',
      department: 'ICU',
      date: '2024-06-02'
    },
    {
      id: '2',
      category: 'Management Support',
      sentiment: 'neutral',
      comment: 'Would like more frequent feedback from supervisors on performance.',
      department: 'Emergency',
      date: '2024-06-01'
    },
    {
      id: '3',
      category: 'Training & Development',
      sentiment: 'positive',
      comment: 'Excellent training opportunities available. Really appreciate the investment in our growth.',
      department: 'Surgery',
      date: '2024-05-30'
    },
    {
      id: '4',
      category: 'Workplace Environment',
      sentiment: 'negative',
      comment: 'Break room facilities need improvement. Limited space and outdated equipment.',
      department: 'General Ward',
      date: '2024-05-29'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getSentimentBadge = (sentiment) => {
    const sentimentConfig = {
      positive: { label: 'Positive', className: 'bg-green-100 text-green-800' },
      neutral: { label: 'Neutral', className: 'bg-yellow-100 text-yellow-800' },
      negative: { label: 'Negative', className: 'bg-red-100 text-red-800' }
    };
    const config = sentimentConfig[sentiment];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Employee Satisfaction Survey</h3>
          <p className="text-gray-600">Comprehensive feedback collection with sentiment analysis and trend tracking</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        </div>
      </div>

      {/* Survey Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {surveyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm text-gray-600">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Satisfaction Trends
            </CardTitle>
            <CardDescription>Monthly satisfaction metrics across key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                satisfaction: { label: "Overall Satisfaction", color: "#3b82f6" },
                engagement: { label: "Employee Engagement", color: "#10b981" },
                worklife: { label: "Work-Life Balance", color: "#f59e0b" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={satisfactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="worklife" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Department Satisfaction
            </CardTitle>
            <CardDescription>Satisfaction scores and response rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentSatisfaction.map((dept, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.department}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{dept.satisfaction}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium">{dept.responses}/{dept.total} ({Math.round((dept.responses/dept.total)*100)}%)</span>
                  </div>
                  
                  <Progress value={(dept.responses/dept.total)*100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Survey Templates
          </CardTitle>
          <CardDescription>Manage and deploy employee satisfaction surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveyTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{template.name}</h4>
                      {getStatusBadge(template.status)}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Send className="w-4 h-4 mr-1" />
                    Deploy
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-medium">{template.questions} questions</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{template.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Frequency</p>
                    <p className="font-medium">{template.frequency}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit Template
                  </Button>
                  <Button size="sm" variant="outline">
                    View Results
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Feedback
          </CardTitle>
          <CardDescription>Latest employee comments with sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{feedback.category}</Badge>
                    {getSentimentBadge(feedback.sentiment)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {feedback.department} • {feedback.date}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline">
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button variant="outline">
              View All Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
