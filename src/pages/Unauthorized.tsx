
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Unauthorized = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/welcome-screen');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Unauthorized</CardTitle>
        <CardDescription>You do not have access to this page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGoBack} className="mr-2" variant="outline">
          Go to Dashboard
        </Button>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default Unauthorized;
