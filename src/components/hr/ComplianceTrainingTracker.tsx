
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Play,
  Download
} from 'lucide-react';

export const ComplianceTrainingTracker = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const trainingPrograms = [
    {
      id: '1',
      title: 'HIPAA Compliance Training',
      category: 'mandatory',
      duration: '2 hours',
      deadline: '2024-06-30',
      completedBy: 156,
      totalAssigned: 180,
      status: 'active',
      description: 'Patient privacy and data protection guidelines'
    },
    {
      id: '2',
      title: 'Fire Safety & Emergency Procedures',
      category: 'mandatory',
      duration: '1.5 hours',
      deadline: '2024-07-15',
      completedBy: 142,
      totalAssigned: 180,
      status: 'active',
      description: 'Hospital emergency response protocols'
    },
    {
      id: '3',
      title: 'Advanced Cardiac Life Support (ACLS)',
      category: 'certification',
      duration: '8 hours',
      deadline: '2024-08-30',
      completedBy: 45,
      totalAssigned: 65,
      status: 'active',
      description: 'Critical care emergency procedures'
    },
    {
      id: '4',
      title: 'Infection Control Protocols',
      category: 'mandatory',
      duration: '1 hour',
      deadline: '2024-06-15',
      completedBy: 178,
      totalAssigned: 180,
      status: 'completed',
      description: 'Hospital infection prevention measures'
    }
  ];

  const employeeProgress = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      department: 'ICU',
      completedTrainings: 8,
      totalRequired: 10,
      certificationsDue: 2,
      lastCompleted: '2024-05-28',
      upcomingDeadlines: ['HIPAA Training - Due June 30', 'Fire Safety - Due July 15']
    },
    {
      id: '2',
      name: 'Nurse John Smith',
      department: 'Emergency',
      completedTrainings: 12,
      totalRequired: 12,
      certificationsDue: 0,
      lastCompleted: '2024-06-01',
      upcomingDeadlines: []
    },
    {
      id: '3',
      name: 'Dr. Lisa Davis',
      department: 'Cardiology',
      completedTrainings: 6,
      totalRequired: 10,
      certificationsDue: 1,
      lastCompleted: '2024-05-15',
      upcomingDeadlines: ['ACLS Renewal - Due August 30', 'HIPAA Training - Due June 30']
    }
  ];

  const complianceMetrics = {
    overallCompliance: 87,
    mandatoryTrainings: 94,
    certifications: 78,
    overdueTrainings: 23
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      mandatory: { label: 'Mandatory', className: 'bg-red-100 text-red-800' },
      certification: { label: 'Certification', className: 'bg-purple-100 text-purple-800' },
      optional: { label: 'Optional', className: 'bg-gray-100 text-gray-800' }
    };
    const config = categoryConfig[category];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Training Tracker</h2>
          <p className="text-gray-600">Manage training programs and track compliance requirements</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <BookOpen className="w-4 h-4 mr-2" />
            Create Training
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{complianceMetrics.overallCompliance}%</div>
                <div className="text-sm text-gray-600">Overall Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{complianceMetrics.overdueTrainings}</div>
                <div className="text-sm text-gray-600">Overdue Trainings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{complianceMetrics.certifications}%</div>
                <div className="text-sm text-gray-600">Certifications Current</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{complianceMetrics.mandatoryTrainings}%</div>
                <div className="text-sm text-gray-600">Mandatory Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Active Training Programs
          </CardTitle>
          <CardDescription>Current training programs and completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingPrograms.map((program) => {
              const completionRate = (program.completedBy / program.totalAssigned) * 100;
              return (
                <div key={program.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{program.title}</h4>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(program.category)}
                      {getStatusBadge(program.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{program.duration}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Deadline: </span>
                      <span className="font-medium">{program.deadline}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Completed: </span>
                      <span className="font-medium">{program.completedBy}/{program.totalAssigned}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Progress: </span>
                      <span className={`font-medium ${completionRate >= 80 ? 'text-green-600' : completionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {completionRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Progress 
                      value={completionRate} 
                      className={`h-2 ${
                        completionRate >= 80 ? 'bg-green-100' :
                        completionRate >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3 mr-1" />
                      Launch Training
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Send Reminders
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Employee Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Training Progress</CardTitle>
          <CardDescription>Individual training completion and upcoming requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeProgress.map((employee) => {
              const progressPercentage = (employee.completedTrainings / employee.totalRequired) * 100;
              return (
                <div key={employee.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold">{progressPercentage.toFixed(0)}%</div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                      <Badge className={
                        progressPercentage === 100 ? 'bg-green-100 text-green-800' :
                        progressPercentage >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {employee.completedTrainings}/{employee.totalRequired} Trainings
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Progress</span>
                      <span>{employee.completedTrainings}/{employee.totalRequired}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  {employee.upcomingDeadlines.length > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Upcoming Deadlines</span>
                      </div>
                      <ul className="text-sm text-yellow-700 ml-6">
                        {employee.upcomingDeadlines.map((deadline, index) => (
                          <li key={index}>{deadline}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Last completed: {employee.lastCompleted}
                      {employee.certificationsDue > 0 && (
                        <span className="ml-2 text-red-600">• {employee.certificationsDue} certifications due</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        Assign Training
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Upcoming Compliance Deadlines
          </CardTitle>
          <CardDescription>Critical training deadlines requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">HIPAA Training - Due in 5 days</span>
              </div>
              <p className="text-sm text-red-700 mb-2">24 employees still need to complete this mandatory training</p>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Send Urgent Reminders
              </Button>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Fire Safety Training - Due in 15 days</span>
              </div>
              <p className="text-sm text-yellow-700 mb-2">38 employees need to complete this training</p>
              <Button size="sm" variant="outline">
                Schedule Training Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Effectiveness</CardTitle>
            <CardDescription>Assessment scores and feedback analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Quiz Score</span>
                <span className="font-bold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Training Satisfaction</span>
                <span className="font-bold text-blue-600">4.2/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completion Rate</span>
                <span className="font-bold text-purple-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Time to Complete</span>
                <span className="font-bold">2.3 days avg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Compliance</CardTitle>
            <CardDescription>Training completion by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>ICU Department</span>
                  <span>96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Emergency</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cardiology</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>General Medicine</span>
                  <span>84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
