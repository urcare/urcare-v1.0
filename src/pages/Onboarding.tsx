import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { apiService } from '../services/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: profile?.full_name?.split(' ')[0] || '',
    last_name: profile?.full_name?.split(' ').slice(1).join(' ') || '',
    date_of_birth: '',
    age: 0,
    height: '',
    weight: '',
    gender: '',
    address: profile?.address || '',
    phone: profile?.phone || '',
    blood_type: '',
    emergency_contact: profile?.emergency_contact || '',
    emergency_phone: profile?.emergency_phone || '',
    allergies: profile?.preferences?.allergies || '',
    medical_conditions: profile?.preferences?.medical_conditions || '',
    selected_conditions: [] as string[],
    medications: profile?.preferences?.medications || '',
    selected_medications: [] as string[],
    insurance_provider: profile?.preferences?.insurance_provider || '',
    insurance_number: profile?.preferences?.insurance_number || '',
    insurance_group: '',
    insurance_phone: ''
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis',
    'Depression', 'Anxiety', 'Cancer', 'Thyroid Disorder', 'Kidney Disease',
    'Liver Disease', 'Epilepsy', 'Migraine', 'Obesity', 'Sleep Apnea'
  ];

  const commonMedications = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Lisinopril',
    'Amlodipine', 'Atorvastatin', 'Omeprazole', 'Albuterol', 'Sertraline',
    'Metoprolol', 'Losartan', 'Simvastatin', 'Pantoprazole', 'Levothyroxine'
  ];

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'date_of_birth') {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        age
      }));
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      selected_conditions: prev.selected_conditions.includes(condition)
        ? prev.selected_conditions.filter(c => c !== condition)
        : [...prev.selected_conditions, condition]
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setFormData(prev => ({
      ...prev,
      selected_medications: prev.selected_medications.includes(medication)
        ? prev.selected_medications.filter(m => m !== medication)
        : [...prev.selected_medications, medication]
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.date_of_birth && formData.gender;
      case 2:
        return formData.phone && formData.emergency_contact && formData.emergency_phone;
      case 3:
      case 4:
      case 5:
      case 6:
        return true;
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
    if (!user) return;

    setLoading(true);
    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      const allConditions = [...formData.selected_conditions];
      if (formData.medical_conditions) {
        allConditions.push(formData.medical_conditions);
      }
      
      const allMedications = [...formData.selected_medications];
      if (formData.medications) {
        allMedications.push(formData.medications);
      }

      // Prepare the profile data for update
      const profileUpdateData: any = {
        full_name: fullName,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        preferences: {
          blood_type: formData.blood_type,
          allergies: formData.allergies,
          medical_conditions: allConditions.join(', '),
          medications: allMedications.join(', '),
          insurance_provider: formData.insurance_provider,
          insurance_number: formData.insurance_number,
          insurance_group: formData.insurance_group,
          insurance_phone: formData.insurance_phone,
          height: formData.height,
          weight: formData.weight,
          age: formData.age
        },
        updated_at: new Date().toISOString()
      };

      // Try to update the user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileUpdateData)
        .eq('id', user.id)
        .select();

      if (error) {
        console.error('Profile update error:', error);
        
        // If the update fails, try to insert a new profile
        const { data: insertData, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            ...profileUpdateData,
            role: 'patient',
            status: 'active'
          })
          .select();

        if (insertError) {
          console.error('Profile insert error:', insertError);
          throw insertError;
        }
      }

      // Update the local profile state
      const updatedProfile = {
        full_name: fullName,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
        preferences: {
          blood_type: formData.blood_type,
          allergies: formData.allergies,
          medical_conditions: allConditions.join(', '),
          medications: allMedications.join(', '),
          insurance_provider: formData.insurance_provider,
          insurance_number: formData.insurance_number,
          height: formData.height,
          weight: formData.weight,
          age: formData.age
        },
        onboarding_completed: true
      };

      // Update the auth context
      await updateProfile(updatedProfile);
      
      // Refresh the profile to ensure we have the latest data
      await refreshProfile();
      
      // Show success message
      toast.success('Onboarding completed successfully!', {
        description: 'Welcome to UrCare! You can now access all features.'
      });
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding', {
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Let's start with your personal details</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white/20 shadow-lg">
            <AvatarImage src={profileImage || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
              {formData.first_name?.[0]}{formData.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white/90 backdrop-blur-sm border-white/30"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            placeholder="Enter your first name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            placeholder="Enter your last name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="mt-1"
          />
          {formData.age > 0 && (
            <p className="text-sm text-muted-foreground mt-1">Age: {formData.age} years</p>
          )}
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
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Enter height in cm"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Enter weight in kg"
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Contact Information</h2>
        <p className="text-muted-foreground">Help us stay connected with you</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your full address"
            className="mt-1"
            rows={3}
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
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Allergies</h2>
        <p className="text-muted-foreground">Important information for your safety</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="List any allergies (e.g., penicillin, peanuts, shellfish, latex)"
            className="mt-1"
            rows={4}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Why this matters</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Knowing your allergies helps us provide safer care and avoid potential reactions during treatments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Medical Conditions</h2>
        <p className="text-muted-foreground">Help us understand your health history</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Common Medical Conditions</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={formData.selected_conditions.includes(condition)}
                  onCheckedChange={() => handleConditionToggle(condition)}
                />
                <Label htmlFor={condition} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="medical_conditions">Other Medical Conditions</Label>
          <Textarea
            id="medical_conditions"
            value={formData.medical_conditions}
            onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
            placeholder="List any other medical conditions not mentioned above"
            className="mt-1"
            rows={3}
          />
        </div>

        {formData.selected_conditions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.selected_conditions.map((condition) => (
              <Badge key={condition} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {condition}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Current Medications</h2>
        <p className="text-muted-foreground">List medications you're currently taking</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Common Medications</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {commonMedications.map((medication) => (
              <div key={medication} className="flex items-center space-x-2">
                <Checkbox
                  id={medication}
                  checked={formData.selected_medications.includes(medication)}
                  onCheckedChange={() => handleMedicationToggle(medication)}
                />
                <Label htmlFor={medication} className="text-sm cursor-pointer">
                  {medication}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="medications">Other Medications</Label>
          <Textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => handleInputChange('medications', e.target.value)}
            placeholder="List any other medications with dosages (e.g., Aspirin 81mg daily)"
            className="mt-1"
            rows={3}
          />
        </div>

        {formData.selected_medications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.selected_medications.map((medication) => (
              <Badge key={medication} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {medication}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Insurance Information</h2>
        <p className="text-muted-foreground">Optional: Help us with billing and coverage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="insurance_group">Group Number</Label>
          <Input
            id="insurance_group"
            value={formData.insurance_group}
            onChange={(e) => handleInputChange('insurance_group', e.target.value)}
            placeholder="Enter group number"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="insurance_phone">Insurance Phone</Label>
          <Input
            id="insurance_phone"
            value={formData.insurance_phone}
            onChange={(e) => handleInputChange('insurance_phone', e.target.value)}
            placeholder="Enter insurance phone number"
            className="mt-1"
          />
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100">Almost done!</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You're just one step away from completing your profile setup. All information is kept secure and private.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
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
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UrCare
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">Let's personalize your healthcare experience</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

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
              )}
            </div>
          </div>

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