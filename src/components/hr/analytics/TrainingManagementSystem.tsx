
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Clock,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Play,
  Download
} from 'lucide-react';

export const TrainingManagementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const trainingCourses = [
    {
      id: '1',
      title: 'Patient Safety Protocols',
      category: 'Safety',
      duration: '4 hours',
      type: 'mandatory',
      enrolled: 145,
      completed: 132,
      deadline: '2024-07-15',
      provider: 'Internal',
      certificationValid: '1 year'
    },
    {
      id: '2',
      title: 'Advanced Life Support (ACLS)',
      category: 'Clinical',
      duration: '16 hours',
      type: 'certification',
      enrolled: 67,
      completed: 58,
      deadline: '2024-08-30',
      provider: 'American Heart Association',
      certificationValid: '2 years'
    },
    {
      id: '3',
      title: 'HIPAA Compliance Training',
      category: 'Compliance',
      duration: '2 hours',
      type: 'mandatory',
      enrolled: 234,
      completed: 201,
      deadline: '2024-06-30',
      provider: 'Internal',
      certificationValid: '1 year'
    },
    {
      id: '4',
      title: 'Leadership in Healthcare',
      category: 'Development',
      duration: '12 hours',
      type: 'optional',
      enrolled: 28,
      completed: 15,
      deadline: null,
      provider: 'External Partner',
      certificationValid: 'Ongoing'
    }
  ];

  const skillGaps = [
    {
      department: 'ICU',
      skill: 'Ventilator Management',
      currentLevel: 72,
      targetLevel: 90,
      staffAffected: 12,
      recommendedCourse: 'Advanced Ventilator Training'
    },
    {
      department: 'Emergency',
      skill: 'Trauma Assessment',
      currentLevel: 85,
      targetLevel: 95,
      staffAffected: 8,
      recommendedCourse: 'Advanced Trauma Life Support'
    },
    {
      department: 'Surgery',
      skill: 'Sterile Technique',
      currentLevel: 88,
      targetLevel: 98,
      staffAffected: 6,
      recommendedCourse: 'Surgical Asepsis Mastery'
    }
  ];

  const learningPaths = [
    {
      id: '1',
      title: 'New Nurse Orientation',
      duration: '80 hours',
      courses: 8,
      completionRate: 92,
      participants: 24
    },
    {
      id: '2',
      title: 'ICU Specialization',
      duration: '120 hours',
      courses: 12,
      completionRate: 87,
      participants: 15
    },
    {
      id: '3',
      title: 'Leadership Development',
      duration: '60 hours',
      courses: 6,
      completionRate: 78,
      participants: 18
    }
  ];

  const trainingMetrics = [
    { label: 'Total Courses', value: 45, change: '+3 this month' },
    { label: 'Active Learners', value: 1156, change: '+8.5% this quarter' },
    { label: 'Completion Rate', value: '89%', change: '+2.1% improvement' },
    { label: 'Compliance Rate', value: '94%', change: 'Target: 95%' }
  ];

  const getTypeBadge = (type) => {
    const typeConfig = {
      mandatory: { label: 'Mandatory', className: 'bg-red-100 text-red-800' },
      certification: { label: 'Certification', className: 'bg-blue-100 text-blue-800' },
      optional: { label: 'Optional', className: 'bg-green-100 text-green-800' }
    };
    const config = typeConfig[type];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      Safety: { className: 'bg-red-100 text-red-800' },
      Clinical: { className: 'bg-blue-100 text-blue-800' },
      Compliance: { className: 'bg-yellow-100 text-yellow-800' },
      Development: { className: 'bg-green-100 text-green-800' }
    };
    const config = categoryConfig[category] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{category}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Training Management System</h3>
          <p className="text-gray-600">Comprehensive learning and development platform with skill gap analysis</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Course Catalog
          </Button>
          <Button>
            <GraduationCap className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Training Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {trainingMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="text-xs text-gray-500">{metric.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Training Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Training Courses
          </CardTitle>
          <CardDescription>Available courses with enrollment and completion tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{course.title}</h4>
                      {getTypeBadge(course.type)}
                      {getCategoryBadge(course.category)}
                    </div>
                    <p className="text-sm text-gray-600">Duration: {course.duration} • Provider: {course.provider}</p>
                  </div>
                  
                  <div className="text-right">
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Launch
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Enrollment</p>
                    <p className="font-medium">{course.enrolled} participants</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completion Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(course.completed / course.enrolled) * 100} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{Math.round((course.completed / course.enrolled) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="font-medium">{course.deadline || 'No deadline'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certification Valid</p>
                    <p className="font-medium">{course.certificationValid}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{course.completed} completed • {course.enrolled - course.completed} in progress</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Progress
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Skill Gap Analysis
            </CardTitle>
            <CardDescription>Identified skill gaps and training recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillGaps.map((gap, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{gap.skill}</h4>
                    <Badge variant="outline">{gap.department}</Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Level</span>
                      <span>{gap.currentLevel}% (Target: {gap.targetLevel}%)</span>
                    </div>
                    <Progress value={gap.currentLevel} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {gap.staffAffected} staff members affected
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">{gap.recommendedCourse}</span>
                    <Button size="sm" variant="outline">
                      Assign Training
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Learning Paths
            </CardTitle>
            <CardDescription>Structured learning programs for career development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <div key={path.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{path.title}</h4>
                    <Badge className="bg-purple-100 text-purple-800">{path.participants} enrolled</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{path.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Courses</p>
                      <p className="font-medium">{path.courses} modules</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{path.completionRate}%</span>
                    </div>
                    <Progress value={path.completionRate} className="h-2" />
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    View Learning Path
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Training Events
          </CardTitle>
          <CardDescription>Scheduled training sessions and certification renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">BLS Certification Renewal</h4>
                  <p className="text-sm text-gray-600">June 15, 2024 • 9:00 AM - 12:00 PM</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">23 enrolled</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Employee Orientation</h4>
                  <p className="text-sm text-gray-600">June 20, 2024 • 8:00 AM - 5:00 PM</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">12 enrolled</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    HIPAA Compliance Training Deadline
                  </h4>
                  <p className="text-sm text-gray-600">June 30, 2024 • 33 staff pending completion</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Urgent</Badge>
                  <Button size="sm">Send Reminder</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
