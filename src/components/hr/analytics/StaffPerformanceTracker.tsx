
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Star,
  Calendar,
  Users,
  Award,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const StaffPerformanceTracker = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  const performanceMetrics = [
    { name: 'Patient Care Quality', value: 92, target: 90 },
    { name: 'Communication Skills', value: 88, target: 85 },
    { name: 'Technical Competency', value: 94, target: 90 },
    { name: 'Teamwork', value: 86, target: 85 },
    { name: 'Initiative', value: 78, target: 80 },
    { name: 'Punctuality', value: 96, target: 95 }
  ];

  const employeePerformance = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      role: 'Senior Physician',
      department: 'ICU',
      overallScore: 92,
      goals: { completed: 8, total: 10 },
      reviews: { pending: 0, completed: 2 },
      feedback: { given: 15, received: 8 },
      trends: 'improving',
      lastReview: '2024-05-15'
    },
    {
      id: '2',
      name: 'Nurse Jennifer Brown',
      role: 'Charge Nurse',
      department: 'Emergency',
      overallScore: 88,
      goals: { completed: 6, total: 8 },
      reviews: { pending: 1, completed: 1 },
      feedback: { given: 12, received: 6 },
      trends: 'stable',
      lastReview: '2024-04-20'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      role: 'Surgeon',
      department: 'Surgery',
      overallScore: 95,
      goals: { completed: 9, total: 10 },
      reviews: { pending: 0, completed: 3 },
      feedback: { given: 20, received: 12 },
      trends: 'improving',
      lastReview: '2024-05-30'
    }
  ];

  const departmentPerformance = [
    { department: 'ICU', avgScore: 91, employees: 24, topPerformers: 8 },
    { department: 'Emergency', avgScore: 87, employees: 18, topPerformers: 5 },
    { department: 'Surgery', avgScore: 93, employees: 15, topPerformers: 9 },
    { department: 'General Ward', avgScore: 85, employees: 32, topPerformers: 10 }
  ];

  const reviewSchedule = [
    { employee: 'Dr. Sarah Wilson', type: 'Annual Review', dueDate: '2024-06-15', status: 'scheduled' },
    { employee: 'Nurse Lisa Garcia', type: 'Quarterly Review', dueDate: '2024-06-10', status: 'overdue' },
    { employee: 'Dr. Michael Chen', type: '360 Feedback', dueDate: '2024-06-20', status: 'pending' },
    { employee: 'Tech John Davis', type: 'Probation Review', dueDate: '2024-06-08', status: 'completed' }
  ];

  const getScoreBadge = (score) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Satisfactory</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Staff Performance Tracker</h3>
          <p className="text-gray-600">Monitor and manage employee performance with KPIs and 360-degree feedback</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Review
          </Button>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Set Goals
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">89.2</div>
                <div className="text-sm text-gray-600">Avg Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">78%</div>
                <div className="text-sm text-gray-600">Goals Achieved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">32</div>
                <div className="text-sm text-gray-600">Top Performers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Overdue Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Average performance across key competencies</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Current", color: "#3b82f6" },
                target: { label: "Target", color: "#10b981" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Department Performance
            </CardTitle>
            <CardDescription>Performance comparison across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgScore: { label: "Average Score", color: "#3b82f6" },
                topPerformers: { label: "Top Performers", color: "#10b981" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgScore" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance Tracking</CardTitle>
          <CardDescription>Detailed performance metrics for each team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeePerformance.map((employee) => (
              <div key={employee.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{employee.name}</h4>
                      {getScoreBadge(employee.overallScore)}
                      <div className="flex items-center gap-1">
                        {getTrendIcon(employee.trends)}
                        <span className="text-sm text-gray-600 capitalize">{employee.trends}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">{employee.overallScore}</div>
                    <div className="text-xs text-gray-600">Overall Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Goals Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(employee.goals.completed / employee.goals.total) * 100} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{employee.goals.completed}/{employee.goals.total}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reviews</p>
                    <p className="font-medium">
                      {employee.reviews.completed} Complete 
                      {employee.reviews.pending > 0 && (
                        <span className="text-red-600"> • {employee.reviews.pending} Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">360° Feedback</p>
                    <p className="font-medium">{employee.feedback.given} Given • {employee.feedback.received} Received</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Review</p>
                    <p className="font-medium">{employee.lastReview}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Target className="w-4 h-4 mr-1" />
                    View Goals
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Give Feedback
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Review Schedule
          </CardTitle>
          <CardDescription>Upcoming and overdue performance reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewSchedule.map((review, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{review.employee}</h4>
                  <p className="text-sm text-gray-600">{review.type}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">{review.dueDate}</p>
                    <p className="text-sm text-gray-600">Due Date</p>
                  </div>
                  {getStatusBadge(review.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
