import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brain, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface AIProcessingPopupProps {
  isOpen: boolean;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
  isActuallyProcessing?: boolean; // Add this to control when popup should close
}

const AIProcessingPopup: React.FC<AIProcessingPopupProps> = ({ isOpen, onComplete, onError, isActuallyProcessing = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'analyzing',
      title: 'Analyzing Content',
      description: 'Processing your input and uploaded files...',
      status: 'pending'
    },
    {
      id: 'generating',
      title: 'Generating Response',
      description: 'AI is creating personalized recommendations...',
      status: 'pending'
    },
    {
      id: 'validating',
      title: 'Validating Response',
      description: 'Ensuring accuracy and relevance...',
      status: 'pending'
    },
    {
      id: 'finalizing',
      title: 'UrCare AI Model Working',
      description: 'Finalizing your personalized health plan...',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      startProcessing();
    }
  }, [isOpen]);

  // Watch for actual processing completion
  useEffect(() => {
    if (!isActuallyProcessing && isOpen) {
      // API processing is complete, finish the animation
      completeProcessing();
    }
  }, [isActuallyProcessing, isOpen]);

  // Add timeout to prevent infinite processing
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        if (isActuallyProcessing) {
          console.warn('AI processing timeout - completing animation');
          completeProcessing();
        }
      }, 30000); // 30 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isOpen, isActuallyProcessing]);

  const startProcessing = async () => {
    // Start with first step
    setSteps(prev => prev.map((step, index) => 
      index === 0 ? { ...step, status: 'processing' } : step
    ));
    setCurrentStep(0);

    // Progress through steps more slowly to match actual API processing time
    const progressInterval = setInterval(() => {
      setSteps(prev => {
        const currentProcessingIndex = prev.findIndex(step => step.status === 'processing');
        if (currentProcessingIndex >= 0) {
          // Mark current step as completed
          const updatedSteps = prev.map((step, index) => 
            index === currentProcessingIndex ? { ...step, status: 'completed' } : step
          );
          
          // Start next step if available
          const nextIndex = currentProcessingIndex + 1;
          if (nextIndex < prev.length) {
            updatedSteps[nextIndex] = { ...updatedSteps[nextIndex], status: 'processing' };
            setCurrentStep(nextIndex);
          } else {
            // All steps completed, but API might still be processing
            // Keep the last step as processing until API actually completes
            const lastStepIndex = updatedSteps.length - 1;
            if (updatedSteps[lastStepIndex].status === 'completed') {
              updatedSteps[lastStepIndex] = { ...updatedSteps[lastStepIndex], status: 'processing' };
            }
          }
          
          return updatedSteps;
        }
        return prev;
      });
    }, 3000); // Progress every 3 seconds to better match API timing

    // Store interval ID for cleanup
    (window as any).progressInterval = progressInterval;
  };

  const completeProcessing = () => {
    // Clear the progress interval
    if ((window as any).progressInterval) {
      clearInterval((window as any).progressInterval);
    }

    // Complete all remaining steps quickly
    setSteps(prev => prev.map(step => 
      step.status === 'processing' ? { ...step, status: 'completed' } : step
    ));

    // Call onComplete after a short delay
    setTimeout(() => {
      onComplete({ success: true });
    }, 1000);
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  UrCare AI Processing
                </h2>
                <p className="text-gray-600">
                  Creating your personalized health experience...
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      step.status === 'processing' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : step.status === 'completed'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium ${
                        step.status === 'processing' 
                          ? 'text-blue-900' 
                          : step.status === 'completed'
                          ? 'text-green-900'
                          : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs ${
                        step.status === 'processing' 
                          ? 'text-blue-700' 
                          : step.status === 'completed'
                          ? 'text-green-700'
                          : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    {step.status === 'processing' && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isActuallyProcessing 
                        ? `${Math.min(((currentStep + 1) / steps.length) * 90, 90)}%` // Cap at 90% while processing
                        : '100%' // Complete when API is done
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {isActuallyProcessing 
                    ? `${Math.round(Math.min(((currentStep + 1) / steps.length) * 90, 90))}% Complete`
                    : '100% Complete'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIProcessingPopup;
