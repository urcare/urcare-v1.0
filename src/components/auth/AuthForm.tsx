import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Eye, EyeOff, Heart, Shield, Users, Stethoscope, Activity, UserCheck, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export const AuthForm = () => {
  const { signUp, signIn, signInWithGoogle, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'patient' as UserRole
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const roleOptions = [
    { value: 'patient', label: 'Patient', icon: Heart, description: 'Access personal health records', color: 'text-red-500' },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Manage patient care', color: 'text-blue-500' },
    { value: 'nurse', label: 'Nurse', icon: Users, description: 'Support patient care', color: 'text-green-500' },
    { value: 'admin', label: 'Administrator', icon: Shield, description: 'System management', color: 'text-purple-500' },
    { value: 'pharmacy', label: 'Pharmacy', icon: Activity, description: 'Medication management', color: 'text-orange-500' },
    { value: 'lab', label: 'Laboratory', icon: Activity, description: 'Test results management', color: 'text-indigo-500' },
    { value: 'reception', label: 'Reception', icon: UserCheck, description: 'Patient registration', color: 'text-teal-500' },
    { value: 'hr', label: 'HR', icon: Users, description: 'Human resources management', color: 'text-pink-500' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            UrCare
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Your comprehensive health management platform
          </p>
        </div>

        <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Access your health records and manage your care
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-md">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-md">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-11 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-role" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Select Your Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Choose your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-3">
                                <Icon className={`h-5 w-5 ${option.color}`} />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-slate-500">{option.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-11 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {loading ? 'Signing up...' : 'Sign up with Google'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
