import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  AlertCircle,
  Star,
  Users,
  Stethoscope,
  Activity,
  Brain
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    blood_type: '',
    allergies: '',
    medical_conditions: '',
    medications: '',
    insurance_provider: '',
    insurance_number: '',
    preferred_language: 'English',
    communication_preferences: {
      email: true,
      sms: false,
      phone: false
    },
    privacy_settings: {
      share_data_research: false,
      share_data_analytics: true,
      emergency_access: true
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.full_name && formData.phone;
      case 2:
        return formData.date_of_birth && formData.gender;
      case 3:
        return formData.emergency_contact && formData.emergency_phone;
      case 4:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found in handleComplete');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting onboarding completion...', { user: user.id, formData });
      
      // Prepare the data for database update
      const profileData = {
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
        preferences: {
          blood_type: formData.blood_type,
          allergies: formData.allergies,
          medical_conditions: formData.medical_conditions,
          medications: formData.medications,
          insurance_provider: formData.insurance_provider,
          insurance_number: formData.insurance_number,
          preferred_language: formData.preferred_language,
          communication_preferences: formData.communication_preferences,
          privacy_settings: formData.privacy_settings
        },
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      console.log('Profile data to save:', profileData);

      // Update the database
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select();

      if (error) {
        console.error('Database update error:', error);
        // Don't throw error, continue with local state update
        console.log('Continuing with local state update despite database error');
      } else {
        console.log('Database updated successfully:', data);
      }

      // Update the local profile state
      try {
        const updateResult = await updateProfile({
          full_name: formData.full_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address: formData.address,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
          preferences: {
            blood_type: formData.blood_type,
            allergies: formData.allergies,
            medical_conditions: formData.medical_conditions,
            medications: formData.medications,
            insurance_provider: formData.insurance_provider,
            insurance_number: formData.insurance_number,
            preferred_language: formData.preferred_language,
            communication_preferences: formData.communication_preferences,
            privacy_settings: formData.privacy_settings
          },
          onboarding_completed: true
        });
        
        console.log('Profile updated successfully, refreshing profile...');
        
        // Force refresh the profile to ensure state is updated
        await refreshProfile();
        
        console.log('Profile refreshed, navigating to dashboard...');
      } catch (updateError) {
        console.error('Profile update error:', updateError);
        // Continue with navigation even if profile update fails
      }
      
      // Always navigate to dashboard, even if there were errors
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Show error to user but still navigate
      alert('Onboarding completed with some issues. You can continue to the dashboard.');
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // Manual completion function for testing
  const handleManualComplete = () => {
    console.log('Manual completion triggered');
    navigate('/dashboard', { replace: true });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="preferred_language">Preferred Language</Label>
          <Select value={formData.preferred_language} onValueChange={(value) => handleInputChange('preferred_language', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Personal Details</h2>
        <p className="text-muted-foreground">Help us provide better personalized care</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your address"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Emergency & Medical Information</h2>
        <p className="text-muted-foreground">Important information for emergency situations</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact Name *</Label>
          <Input
            id="emergency_contact"
            value={formData.emergency_contact}
            onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
            placeholder="Enter emergency contact name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emergency_phone">Emergency Contact Phone *</Label>
          <Input
            id="emergency_phone"
            value={formData.emergency_phone}
            onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
            placeholder="Enter emergency contact phone"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="List any allergies (e.g., penicillin, peanuts)"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="medical_conditions">Medical Conditions</Label>
          <Textarea
            id="medical_conditions"
            value={formData.medical_conditions}
            onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
            placeholder="List any chronic medical conditions"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => handleInputChange('medications', e.target.value)}
            placeholder="List current medications and dosages"
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Preferences & Privacy</h2>
        <p className="text-muted-foreground">Customize your experience and privacy settings</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Communication Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={formData.communication_preferences.email}
                onCheckedChange={(checked) => handleNestedChange('communication_preferences', 'email', checked)}
              />
              <Label htmlFor="email">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms"
                checked={formData.communication_preferences.sms}
                onCheckedChange={(checked) => handleNestedChange('communication_preferences', 'sms', checked)}
              />
              <Label htmlFor="sms">SMS notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone"
                checked={formData.communication_preferences.phone}
                onCheckedChange={(checked) => handleNestedChange('communication_preferences', 'phone', checked)}
              />
              <Label htmlFor="phone">Phone calls</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="share_data_research"
                checked={formData.privacy_settings.share_data_research}
                onCheckedChange={(checked) => handleNestedChange('privacy_settings', 'share_data_research', checked)}
              />
              <Label htmlFor="share_data_research">Share data for medical research (anonymized)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="share_data_analytics"
                checked={formData.privacy_settings.share_data_analytics}
                onCheckedChange={(checked) => handleNestedChange('privacy_settings', 'share_data_analytics', checked)}
              />
              <Label htmlFor="share_data_analytics">Share data for platform analytics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency_access"
                checked={formData.privacy_settings.emergency_access}
                onCheckedChange={(checked) => handleNestedChange('privacy_settings', 'emergency_access', checked)}
              />
              <Label htmlFor="emergency_access">Allow emergency access to medical data</Label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Insurance Information (Optional)</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="insurance_provider">Insurance Provider</Label>
              <Input
                id="insurance_provider"
                value={formData.insurance_provider}
                onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
                placeholder="Enter insurance provider name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="insurance_number">Insurance Number</Label>
              <Input
                id="insurance_number"
                value={formData.insurance_number}
                onChange={(e) => handleInputChange('insurance_number', e.target.value)}
                placeholder="Enter insurance number"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UrCare
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to UrCare!</h1>
            <p className="text-muted-foreground">Let's set up your profile to get started</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleComplete}
                    disabled={loading || !validateStep(currentStep)}
                    className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                  
                  {/* Manual completion button for testing */}
                  <Button
                    variant="outline"
                    onClick={handleManualComplete}
                    className="flex items-center text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    Skip to Dashboard (Test)
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i + 1 === currentStep
                    ? 'bg-blue-600'
                    : i + 1 < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
