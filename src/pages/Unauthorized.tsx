
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">Access Denied</h1>
      <p className="text-muted-foreground text-center mb-6">
        You don't have permission to access this page.
        {profile && (
          <span> Your current role is <strong>{profile.role}</strong>.</span>
        )}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')} variant="outline">
          Go to Dashboard
        </Button>
        <Button onClick={() => navigate(-1)} className="medical-gradient text-white">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
