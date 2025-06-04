
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Edit,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export const LeavePolicyConfigurator = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const leavePolicies = [
    {
      id: '1',
      name: 'Standard Leave Policy',
      category: 'General',
      employees: 856,
      status: 'active',
      rules: [
        { type: 'Annual Leave', days: 21, accrual: 'Monthly' },
        { type: 'Sick Leave', days: 10, accrual: 'Yearly' },
        { type: 'Maternity Leave', days: 126, accrual: 'As needed' },
        { type: 'Paternity Leave', days: 14, accrual: 'As needed' }
      ],
      approvalHierarchy: ['Direct Manager', 'Department Head', 'HR Manager'],
      carryForward: 5,
      encashment: true
    },
    {
      id: '2',
      name: 'Senior Staff Policy',
      category: 'Management',
      employees: 124,
      status: 'active',
      rules: [
        { type: 'Annual Leave', days: 28, accrual: 'Monthly' },
        { type: 'Sick Leave', days: 15, accrual: 'Yearly' },
        { type: 'Executive Leave', days: 7, accrual: 'Yearly' }
      ],
      approvalHierarchy: ['Department Head', 'CEO'],
      carryForward: 10,
      encashment: true
    },
    {
      id: '3',
      name: 'Night Shift Policy',
      category: 'Shift Workers',
      employees: 267,
      status: 'active',
      rules: [
        { type: 'Annual Leave', days: 24, accrual: 'Monthly' },
        { type: 'Shift Compensation Leave', days: 6, accrual: 'Quarterly' },
        { type: 'Sick Leave', days: 12, accrual: 'Yearly' }
      ],
      approvalHierarchy: ['Shift Supervisor', 'Operations Manager', 'HR Manager'],
      carryForward: 7,
      encashment: false
    }
  ];

  const leaveCategories = [
    { name: 'Annual Leave', color: 'bg-blue-100 text-blue-800' },
    { name: 'Sick Leave', color: 'bg-red-100 text-red-800' },
    { name: 'Maternity Leave', color: 'bg-pink-100 text-pink-800' },
    { name: 'Paternity Leave', color: 'bg-green-100 text-green-800' },
    { name: 'Emergency Leave', color: 'bg-orange-100 text-orange-800' },
    { name: 'Study Leave', color: 'bg-purple-100 text-purple-800' },
    { name: 'Compensatory Leave', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const approvalRules = [
    {
      id: '1',
      condition: 'Leave duration > 5 days',
      action: 'Requires department head approval',
      priority: 'high'
    },
    {
      id: '2',
      condition: 'Leave during peak season',
      action: 'Requires additional justification',
      priority: 'medium'
    },
    {
      id: '3',
      condition: 'Emergency leave',
      action: 'Auto-approve with retrospective documentation',
      priority: 'high'
    },
    {
      id: '4',
      condition: 'Multiple consecutive requests',
      action: 'Flag for review',
      priority: 'low'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
      inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Leave Policy Configurator</h3>
          <p className="text-gray-600">Configure and manage leave policies for different employee categories</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Active Policies</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-sm text-gray-600">Covered Employees</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Current Leave Policies</CardTitle>
          <CardDescription>Manage leave policies and their configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leavePolicies.map((policy) => (
              <div key={policy.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{policy.name}</h4>
                      {getStatusBadge(policy.status)}
                      <Badge variant="outline">{policy.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{policy.employees} employees covered</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h5 className="font-medium mb-2">Leave Types</h5>
                    <div className="space-y-1">
                      {policy.rules.map((rule, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{rule.type}</span>
                          <span className="font-medium">{rule.days} days ({rule.accrual})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Approval Hierarchy</h5>
                    <div className="space-y-1">
                      {policy.approvalHierarchy.map((level, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span>{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Carry Forward: {policy.carryForward} days</span>
                  <span>Encashment: {policy.encashment ? 'Allowed' : 'Not Allowed'}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Available Leave Categories</CardTitle>
            <CardDescription>Predefined leave types for policy creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {leaveCategories.map((category, index) => (
                <div key={index} className={`p-3 rounded-lg text-center ${category.color}`}>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Category
            </Button>
          </CardContent>
        </Card>

        {/* Approval Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Rules Engine</CardTitle>
            <CardDescription>Automated rules for leave approval workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvalRules.map((rule) => (
                <div key={rule.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Rule {rule.id}</span>
                    <Badge variant={rule.priority === 'high' ? 'destructive' : rule.priority === 'medium' ? 'default' : 'secondary'}>
                      {rule.priority}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">If: {rule.condition}</p>
                    <p className="font-medium">Then: {rule.action}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3">
              <Plus className="w-4 h-4 mr-2" />
              Add New Rule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
