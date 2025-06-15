
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">UrCare</h1>
              <p className="text-lg text-gray-600">Healthcare Management System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comprehensive Healthcare Management
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your healthcare operations with our integrated platform for patient management, 
            appointments, billing, and more.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Management</h3>
            <p className="text-gray-600">Comprehensive patient records and history tracking</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Scheduling</h3>
            <p className="text-gray-600">Efficient scheduling and calendar management</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Billing & Reports</h3>
            <p className="text-gray-600">Automated billing and comprehensive reporting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
