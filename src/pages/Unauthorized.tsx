
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Unauthorized = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as any;
  const requiredRoles = state?.requiredRoles || [];
  const userRole = state?.userRole || profile?.role;

  const handleGoBack = () => {
    // Navigate to appropriate dashboard based on user role
    const roleRoutes = {
      'patient': '/dashboard/patient',
      'doctor': '/dashboard/doctor',
      'nurse': '/dashboard/nurse',
      'admin': '/dashboard/admin',
      'pharmacy': '/dashboard/pharmacy',
      'lab': '/dashboard/lab',
      'reception': '/dashboard/reception'
    };
    
    const dashboardPath = roleRoutes[userRole as keyof typeof roleRoutes] || '/';
    navigate(dashboardPath);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Your Role:</strong> {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Unknown'}
            </p>
            {requiredRoles.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Required Roles:</strong> {requiredRoles.map((role: string) => 
                  role.charAt(0).toUpperCase() + role.slice(1)
                ).join(', ')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleGoBack} className="w-full" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back to Dashboard
            </Button>
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
