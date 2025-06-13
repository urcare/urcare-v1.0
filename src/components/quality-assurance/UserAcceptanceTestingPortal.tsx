
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react';

export const UserAcceptanceTestingPortal = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const uatFeatures = [
    {
      id: '1',
      name: 'Patient Registration Workflow',
      description: 'New streamlined patient registration process with digital forms',
      status: 'approved',
      progress: 100,
      testers: 8,
      approvals: 7,
      rejections: 1,
      feedback: 12,
      dueDate: '2024-06-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Appointment Scheduling System',
      description: 'Enhanced appointment booking with real-time availability',
      status: 'testing',
      progress: 65,
      testers: 12,
      approvals: 5,
      rejections: 2,
      feedback: 8,
      dueDate: '2024-06-18',
      priority: 'critical'
    },
    {
      id: '3',
      name: 'Medication Management Portal',
      description: 'New medication tracking and reminder system for patients',
      status: 'pending',
      progress: 25,
      testers: 6,
      approvals: 1,
      rejections: 0,
      feedback: 3,
      dueDate: '2024-06-20',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Lab Results Dashboard',
      description: 'Interactive dashboard for viewing and analyzing lab results',
      status: 'rejected',
      progress: 80,
      testers: 10,
      approvals: 3,
      rejections: 5,
      feedback: 15,
      dueDate: '2024-06-12',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'testing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Acceptance Testing Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Features Approved</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">In Testing</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">36</div>
              <div className="text-sm text-gray-600">Active Testers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Features Under Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uatFeatures.map((feature) => (
                <Card 
                  key={feature.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedFeature === feature.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedFeature(feature.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(feature.status)}
                        <div>
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Testing Progress</span>
                        <span>{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Testers</div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {feature.testers}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Feedback</div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {feature.feedback}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600">
                        <ThumbsUp className="h-3 w-3" />
                        {feature.approvals} approvals
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <ThumbsDown className="h-3 w-3" />
                        {feature.rejections} rejections
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Due: {feature.dueDate}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Testing Scenarios</h4>
              <div className="space-y-2 text-sm">
                <div>• Test all critical user paths</div>
                <div>• Verify error handling and validation</div>
                <div>• Check mobile responsiveness</div>
                <div>• Test with different user roles</div>
                <div>• Validate data accuracy</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Feedback Categories</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Usability</Badge>
                <Badge variant="outline" className="mr-2">Performance</Badge>
                <Badge variant="outline" className="mr-2">Functionality</Badge>
                <Badge variant="outline" className="mr-2">UI/UX</Badge>
                <Badge variant="outline" className="mr-2">Accessibility</Badge>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Approval Criteria</h4>
              <div className="space-y-1 text-sm">
                <div>✓ All critical paths tested</div>
                <div>✓ No blocking issues found</div>
                <div>✓ Performance meets requirements</div>
                <div>✓ UI matches design specifications</div>
                <div>✓ Accessibility standards met</div>
              </div>
            </div>

            <Button className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Join Testing Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
