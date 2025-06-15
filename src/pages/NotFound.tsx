
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Urcare</h1>
            <p className="text-sm text-gray-600">AI-Powered Healthcare</p>
          </div>
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center space-y-6">
            <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="text-sm text-gray-500 mb-8 p-4 bg-gray-50 rounded-xl">
              <strong>Requested URL:</strong> {location.pathname}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="border-gray-300 hover:border-blue-300 rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</Link> to access your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
