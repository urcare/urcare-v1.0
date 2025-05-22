
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'sonner';

// Import all step components
import BiometricSetup from '@/components/onboarding/BiometricSetup';
import HealthIDForm from '@/components/onboarding/HealthIDForm';
import GuardianModeSetup from '@/components/onboarding/GuardianModeSetup';
import DeviceSyncSetup from '@/components/onboarding/DeviceSyncSetup';
import EmergencyProfile from '@/components/onboarding/EmergencyProfile';
import ProfilePhotoUpload from '@/components/onboarding/ProfilePhotoUpload';

const steps = [
  { id: 'biometric', title: 'Biometric Login' },
  { id: 'health-id', title: 'Health ID' },
  { id: 'guardian', title: 'Guardian Mode' },
  { id: 'sync', title: 'Device Sync' },
  { id: 'emergency', title: 'Emergency Profile' },
  { id: 'photo', title: 'Profile Photo' },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(steps[0].id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActiveTab(steps[nextStep].id);
    } else {
      // Complete onboarding
      toast.success('Onboarding completed!', {
        description: 'Your profile has been set up successfully.'
      });
      navigate('/');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setActiveTab(steps[prevStep].id);
    }
  };
  
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">UrCare</h1>
          <p className="text-sm text-muted-foreground">Complete Your Profile</p>
        </div>
      </div>
      
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Setup Your Account</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </CardDescription>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setCurrentStep(steps.findIndex(step => step.id === value));
          }}>
            <TabsList className="grid grid-cols-6 mb-6">
              {steps.map((step, index) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  disabled={index > currentStep}
                >
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="biometric" className="mt-4">
              <BiometricSetup />
            </TabsContent>
            
            <TabsContent value="health-id" className="mt-4">
              <HealthIDForm />
            </TabsContent>
            
            <TabsContent value="guardian" className="mt-4">
              <GuardianModeSetup />
            </TabsContent>
            
            <TabsContent value="sync" className="mt-4">
              <DeviceSyncSetup />
            </TabsContent>
            
            <TabsContent value="emergency" className="mt-4">
              <EmergencyProfile />
            </TabsContent>
            
            <TabsContent value="photo" className="mt-4">
              <ProfilePhotoUpload />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            className="medical-gradient text-white"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
