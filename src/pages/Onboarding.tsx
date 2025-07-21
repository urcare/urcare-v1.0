import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';
import { NameStep } from '../components/onboarding/NameStep';
import { GreetingStep } from '../components/onboarding/GreetingStep';
import { QuestionStep } from '../components/onboarding/QuestionStep';
import { onboardingQuestions } from '../data/onboardingQuestions';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'name' | 'greeting' | 'questions'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});
  
  const totalQuestions = onboardingQuestions.length;

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found for onboarding completion');
      toast.error('User not found', { description: 'Please log in again.' });
      return;
    }

    console.log('Starting onboarding completion for user:', user.id);
    setLoading(true);
    
    try {
      // Create preferences object from question answers
      const preferences = {
        sleep_improvement: questionAnswers.sleep_improvement,
        health_priorities: questionAnswers.health_priorities,
        weight_goal: questionAnswers.weight_goal,
        goal_speed: questionAnswers.goal_speed,
        barriers: questionAnswers.barriers,
        chronic_conditions: questionAnswers.chronic_conditions,
        diet_type: questionAnswers.diet_type,
        allergies: questionAnswers.allergies,
        smartwatch_usage: questionAnswers.smartwatch_usage,
        family_tracking: questionAnswers.family_tracking,
      };

      const userProfileData = {
        id: user.id,
        full_name: firstName,
        age: questionAnswers.age,
        gender: questionAnswers.gender,
        height: questionAnswers.height,
        weight: questionAnswers.current_weight,
        target_weight: questionAnswers.target_weight,
        preferences: preferences,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      console.log('Upserting user profile:', userProfileData);

      // Upsert the user profile
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(userProfileData);

      if (upsertError) {
        console.error('Error upserting user profile:', upsertError);
        throw upsertError;
      }

      console.log('User profile upserted successfully');

      // Show success message
      toast.success('Onboarding completed successfully!', {
        description: 'Welcome to UrCare! You can now access all features.'
      });
      
      console.log('Navigating to dashboard...');
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding', {
        description: error instanceof Error ? error.message : 'Please try again or contact support if the issue persists.'
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  // Show welcome screen first
  if (onboardingStep === 'welcome') {
    return (
      <WelcomeScreen 
        onContinue={() => setOnboardingStep('name')}
      />
    );
  }

  // Show name input step
  if (onboardingStep === 'name') {
    return (
      <NameStep
        onContinue={(name) => {
          setFirstName(name);
          setOnboardingStep('greeting');
        }}
        onBack={() => setOnboardingStep('welcome')}
        initialValue={firstName}
      />
    );
  }

  // Show greeting step
  if (onboardingStep === 'greeting') {
    return (
      <GreetingStep
        userName={firstName}
        onContinue={() => setOnboardingStep('questions')}
        onBack={() => setOnboardingStep('name')}
      />
    );
  }

  // Show questions step
  if (onboardingStep === 'questions') {
    const currentQuestion = onboardingQuestions[currentQuestionIndex];
    
    return (
      <QuestionStep
        question={currentQuestion}
        currentStep={currentQuestionIndex + 1}
        totalSteps={totalQuestions}
        onContinue={(answer) => {
          // Save the answer
          setQuestionAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
          }));
          
          // Move to next question or complete
          if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            handleComplete();
          }
        }}
        onBack={() => {
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
          } else {
            setOnboardingStep('greeting');
          }
        }}
        initialValue={questionAnswers[currentQuestion.id]}
      />
    );
  }

  // Fallback (should not reach here)
  return null;
};

export default Onboarding; 