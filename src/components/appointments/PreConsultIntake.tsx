
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Check } from 'lucide-react';

// Sample intake question structure
const intakeQuestions = {
  general: [
    { id: 'reason', label: 'What is the main reason for your visit today?', type: 'text' },
    { id: 'symptoms', label: 'Describe your symptoms in detail:', type: 'textarea' },
    { id: 'symptom_duration', label: 'How long have you been experiencing these symptoms?', type: 'select', 
      options: ['Less than a day', '1-2 days', '3-7 days', '1-2 weeks', '2-4 weeks', 'More than a month'] },
    { id: 'pain_level', label: 'On a scale of 1-10, how would you rate any pain you are experiencing?', type: 'select',
      options: ['0 - No Pain', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Worst Pain Imaginable'] },
  ],
  medical_history: [
    { id: 'chronic_conditions', label: 'Do you have any chronic medical conditions?', type: 'checkbox' },
    { id: 'chronic_details', label: 'Please list any chronic conditions:', type: 'textarea', condition: 'chronic_conditions' },
    { id: 'medications', label: 'Are you currently taking any medications?', type: 'checkbox' },
    { id: 'medication_list', label: 'Please list all current medications and dosages:', type: 'textarea', condition: 'medications' },
    { id: 'allergies', label: 'Do you have any allergies to medications?', type: 'checkbox' },
    { id: 'allergy_list', label: 'Please list medication allergies and reactions:', type: 'textarea', condition: 'allergies' },
  ],
  lifestyle: [
    { id: 'smoking', label: 'Do you smoke or use tobacco products?', type: 'checkbox' },
    { id: 'alcohol', label: 'Do you consume alcohol?', type: 'checkbox' },
    { id: 'alcohol_frequency', label: 'How often do you consume alcohol?', type: 'select', condition: 'alcohol',
      options: ['Rarely', 'Occasionally', 'Weekly', 'Daily'] },
    { id: 'exercise', label: 'How often do you exercise?', type: 'select',
      options: ['Never', 'Rarely', '1-2 times per week', '3-4 times per week', '5+ times per week'] },
    { id: 'sleep', label: 'How many hours of sleep do you typically get per night?', type: 'select',
      options: ['Less than 4 hours', '4-5 hours', '6-7 hours', '8+ hours'] },
  ]
};

export const PreConsultIntake = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState('general');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch upcoming appointment to associate the intake form with
  const { data: appointment } = useQuery({
    queryKey: ['upcoming-appointment', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const today = new Date();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .eq('status', 'scheduled')
        .gte('date_time', today.toISOString())
        .order('date_time', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const shouldShowQuestion = (question: any) => {
    if (!question.condition) return true;
    return answers[question.condition] === true;
  };

  const isCurrentSectionComplete = () => {
    const sectionQuestions = intakeQuestions[currentSection as keyof typeof intakeQuestions];
    let requiredQuestions = sectionQuestions.filter(q => shouldShowQuestion(q));
    
    return requiredQuestions.every(question => {
      const answer = answers[question.id];
      return answer !== undefined && answer !== '';
    });
  };

  const handleNext = () => {
    if (currentSection === 'general') {
      setCurrentSection('medical_history');
      setStep(2);
    } else if (currentSection === 'medical_history') {
      setCurrentSection('lifestyle');
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'lifestyle') {
      setCurrentSection('medical_history');
      setStep(2);
    } else if (currentSection === 'medical_history') {
      setCurrentSection('general');
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to submit intake information.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be saved to a database table
      // Here we're simulating by updating the appointment notes
      if (appointment?.id) {
        const { error } = await supabase
          .from('appointments')
          .update({
            notes: JSON.stringify(answers)
          })
          .eq('id', appointment.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Intake Submitted",
        description: "Your pre-consultation information has been saved successfully.",
      });
      
      // Reset form
      setAnswers({});
      setCurrentSection('general');
      setStep(1);
      
    } catch (error) {
      console.error('Intake submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => {
    if (!shouldShowQuestion(question)) return null;
    
    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            <Input 
              id={question.id} 
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            <Textarea 
              id={question.id} 
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
        
      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            <Select 
              value={answers[question.id] || ''} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <SelectTrigger id={question.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={question.id} 
                checked={answers[question.id] || false}
                onCheckedChange={(checked) => handleAnswerChange(question.id, checked === true)}
              />
              <Label htmlFor={question.id}>{question.label}</Label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const progressPercentage = ((step - 1) / 3) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Consultation Intake</CardTitle>
        <CardDescription>Please complete this intake form before your appointment</CardDescription>
        <Progress value={progressPercentage} className="mt-4" />
      </CardHeader>
      <CardContent>
        <Tabs value={currentSection} onValueChange={setCurrentSection}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general" disabled={step < 1}>
              <div className="flex items-center gap-2">
                <div className={`rounded-full w-6 h-6 flex items-center justify-center ${step > 1 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                  {step > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span>General</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="medical_history" disabled={step < 2}>
              <div className="flex items-center gap-2">
                <div className={`rounded-full w-6 h-6 flex items-center justify-center ${step > 2 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                  {step > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span>Medical History</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="lifestyle" disabled={step < 3}>
              <div className="flex items-center gap-2">
                <div className={`rounded-full w-6 h-6 flex items-center justify-center ${step > 3 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                  {step > 3 ? <Check className="h-4 w-4" /> : '3'}
                </div>
                <span>Lifestyle</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {['general', 'medical_history', 'lifestyle'].map((section) => (
            <TabsContent key={section} value={section} className="space-y-4">
              {intakeQuestions[section as keyof typeof intakeQuestions].map(renderQuestion)}
            </TabsContent>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 'general'}
          >
            Previous
          </Button>
          
          {currentSection === 'lifestyle' ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentSectionComplete() || isSubmitting}
              className="flex items-center gap-2"
            >
              Submit
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentSectionComplete()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
};
