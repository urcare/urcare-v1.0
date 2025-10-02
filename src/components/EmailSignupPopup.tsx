import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface EmailSignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onNavigate?: (path: string) => void;
}

const EmailSignupPopup: React.FC<EmailSignupPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigate
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    city: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check for test credentials
      if (formData.email === 'test@email.com' && formData.password === 'test123') {
        // Auto-activate subscription for test user
        const testUserData = {
          id: 'test-user-' + Date.now(),
          email: 'test@email.com',
          full_name: formData.fullName || 'Test User',
          city: formData.city,
          subscription_status: 'active',
          plan_name: 'premium',
          billing_cycle: 'annual',
          created_at: new Date().toISOString()
        };

        // Store in localStorage for session
        localStorage.setItem('urcare_test_user', JSON.stringify(testUserData));
        
        toast.success('Test account created successfully!', {
          description: 'Redirecting to onboarding...'
        });
        
        // Store test user data
        onSuccess(testUserData);
        onClose();
        
        // Redirect to onboarding after a short delay
        if (onNavigate) {
          setTimeout(() => {
            onNavigate('/onboarding');
          }, 1000);
        }
        return;
      }

      // Check for admin credentials
      if (formData.email === 'admin' && formData.password === 'admin') {
        const adminUserData = {
          id: 'admin-user-' + Date.now(),
          email: 'admin@urcare.com',
          full_name: formData.fullName || 'Admin User',
          city: formData.city,
          subscription_status: 'active',
          plan_name: 'admin',
          billing_cycle: 'lifetime',
          created_at: new Date().toISOString(),
          is_admin: true
        };

        localStorage.setItem('urcare_admin_user', JSON.stringify(adminUserData));
        
        toast.success('Admin account created successfully!', {
          description: 'You have been granted admin access.'
        });
        
        onSuccess(adminUserData);
        onClose();
        return;
      }

      // For other users, show coming soon message
      toast.info('Email signup coming soon!', {
        description: 'Please use Google or Apple sign-in for now.'
      });
      
      onClose();

    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError(errorMessage);
      toast.error('Signup failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '', fullName: '', city: '' });
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Sign Up with Email
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create your UrCare account to get started
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Test Credentials:</strong><br />
                Email: <code className="bg-blue-100 px-1 rounded">test@email.com</code><br />
                Password: <code className="bg-blue-100 px-1 rounded">test123</code><br />
                <span className="text-xs text-blue-600">Auto-activates premium subscription</span>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSignupPopup;
