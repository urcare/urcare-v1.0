
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Heart, Check } from 'lucide-react';
import { toast } from 'sonner';

// Import all step components
import ProfileSetup from '@/components/onboarding/ProfileSetup';
import MedicalConditions from '@/components/onboarding/MedicalConditions';
import CurrentMedications from '@/components/onboarding/CurrentMedications';
import LifestyleInsights from '@/components/onboarding/LifestyleInsights';
import HealthRecords from '@/components/onboarding/HealthRecords';
import ConnectWearables from '@/components/onboarding/ConnectWearables';
import HealthGoals from '@/components/onboarding/HealthGoals';
import OnboardingComplete from '@/components/onboarding/OnboardingComplete';

const steps = [
  { id: 'profile', title: 'Profile Setup', component: ProfileSetup },
  { id: 'conditions', title: 'Medical Conditions', component: MedicalConditions },
  { id: 'medications', title: 'Current Medications', component: CurrentMedications },
  { id: 'lifestyle', title: 'Lifestyle Insights', component: LifestyleInsights },
  { id: 'records', title: 'Health Records', component: HealthRecords },
  { id: 'wearables', title: 'Connect Wearables', component: ConnectWearables },
  { id: 'goals', title: 'Health Goals', component: HealthGoals },
  { id: 'complete', title: 'All Set!', component: OnboardingComplete },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('Onboarding component rendered, currentStep:', currentStep);
  console.log('User:', user);
  
  const handleNext = () => {
    console.log('handleNext called, currentStep:', currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      toast.success('Welcome to UrCare!', {
        description: 'Your personalized health journey begins now.'
      });
      navigate('/dashboard');
    }
  };
  
  const handlePrevious = () => {
    console.log('handlePrevious called, currentStep:', currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    console.log('handleSkip called, currentStep:', currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepData = (stepData: any) => {
    console.log('handleStepData called with:', stepData);
    setOnboardingData(prev => ({
      ...prev,
      [steps[currentStep].id]: stepData
    }));
  };
  
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  console.log('About to render CurrentStepComponent:', CurrentStepComponent.name);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900">UrCare</h1>
              <p className="text-sm text-gray-600">Complete Your Health Profile</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-light text-gray-900">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 0 && "Let's start with your basic information"}
              {currentStep === 1 && "Help us understand your health better"}
              {currentStep === 2 && "Tell us about your current medications"}
              {currentStep === 3 && "Share your lifestyle patterns"}
              {currentStep === 4 && "Upload your health documents"}
              {currentStep === 5 && "Connect your health devices"}
              {currentStep === 6 && "Set your health goals"}
              {currentStep === 7 && "You're ready to begin!"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 py-6">
            <CurrentStepComponent onDataChange={handleStepData} />
          </CardContent>
          
          <CardFooter className="flex justify-between px-8 py-6 bg-gray-50/50">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex gap-3">
              {currentStep < steps.length - 1 && currentStep > 1 && (
                <Button 
                  variant="ghost" 
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Skip for now
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Go to Dashboard
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
