import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, ArrowRight, LogOut } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, setAdmin } = useAdmin();

  const handleLogout = () => {
    setAdmin(false);
    toast.success('Logged out successfully');
    navigate('/my-admin');
  };

  const adminActions = [
    {
      title: 'Access Onboarding',
      description: 'Go directly to the onboarding page',
      icon: Users,
      action: () => navigate('/onboarding'),
      color: 'bg-blue-500'
    },
    {
      title: 'Health Assessment',
      description: 'Access the health assessment page',
      icon: Shield,
      action: () => navigate('/health-assessment'),
      color: 'bg-green-500'
    },
    {
      title: 'Dashboard',
      description: 'View the main application dashboard',
      icon: Settings,
      action: () => navigate('/dashboard'),
      color: 'bg-purple-500'
    }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/my-admin')}>
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and access application features</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Admin Access</span>
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={action.action}
                  className="w-full"
                  variant="outline"
                >
                  Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Direct links to important application pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/onboarding')}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Users className="w-6 h-6 mb-2" />
                  <span className="text-sm">Onboarding</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/health-assessment')}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="text-sm">Health Assessment</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Settings className="w-6 h-6 mb-2" />
                  <span className="text-sm">Dashboard</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/settings')}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Settings className="w-6 h-6 mb-2" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

