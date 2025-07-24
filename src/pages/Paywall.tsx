import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Paywall: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-orange-600">Unlock Full Access</h1>
        <p className="text-gray-700 mb-6">Subscribe to access all features beyond your custom plan, including advanced analytics, health tracking, and more.</p>
        <Button className="w-full mb-4" onClick={() => alert('Subscription coming soon!')}>Subscribe Now</Button>
        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>Back to Home</Button>
        <div className="mt-6 text-xs text-gray-400">This is a dummy paywall for testing the flow.</div>
      </div>
    </div>
  );
};

export default Paywall; 