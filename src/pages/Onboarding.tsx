
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Heart, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Import all step components
import ProfilePhotoUpload from '@/components/onboarding/ProfilePhotoUpload';
import MedicalConditions from '@/components/onboarding/MedicalConditions';
import CurrentMedications from '@/components/onboarding/CurrentMedications';
import LifestyleInsights from '@/components/onboarding/LifestyleInsights';
import HealthRecords from '@/components/onboarding/HealthRecords';
import ConnectWearables from '@/components/onboarding/ConnectWearables';
import HealthGoals from '@/components/onboarding/HealthGoals';
import OnboardingComplete from '@/components/onboarding/OnboardingComplete';

const steps = [
  { id: 'profile', title: 'Profile Setup', component: ProfilePhotoUpload },
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
  const [initializationTimeout, setInitializationTimeout] = useState(false);
  const navigate = useNavigate();
  const { user, loading, isInitialized } = useAuth();
  const { saveOnboardingData, isSubmitting } = useOnboardingData();

  console.log('Onboarding render - user:', !!user, 'loading:', loading, 'isInitialized:', isInitialized);

  // Set timeout for initialization to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitializationTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

  // Handle authentication check
  useEffect(() => {
    if (isInitialized && !user && !loading) {
      console.log('No user found after initialization, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, isInitialized, navigate]);

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the final step - save all onboarding data
      console.log('Saving onboarding data:', onboardingData);
      
      const result = await saveOnboardingData(onboardingData);
      
      if (result.success) {
        toast.success('Welcome to UrCare!', {
          description: 'Your personalized health journey begins now.'
        });
        navigate('/dashboard');
      }
      // Error handling is done in the hook
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

  // Show loading state only briefly during initial auth check
  if (!isInitialized && loading && !initializationTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your health profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initializationTimeout && !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-4">We're having trouble loading your profile.</p>
          <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated (handled by useEffect above)
  if (isInitialized && !user) {
    return null; // Will redirect via useEffect
  }
  
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
            {isSubmitting ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Saving your information...</span>
              </div>
            ) : (
              <CurrentStepComponent onDataChange={handleStepData} />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between px-8 py-6 bg-gray-50/50">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
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
                  disabled={isSubmitting}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Skip for now
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Setup
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
