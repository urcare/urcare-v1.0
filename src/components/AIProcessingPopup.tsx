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
}

const AIProcessingPopup: React.FC<AIProcessingPopupProps> = ({ isOpen, onComplete, onError }) => {
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

  const startProcessing = async () => {
    for (let i = 0; i < steps.length; i++) {
      // Update current step to processing
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'processing' } : step
      ));
      setCurrentStep(i);

      // Simulate processing time (2-4 seconds per step)
      const processingTime = Math.random() * 2000 + 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
    }

    // All steps completed
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
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
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
