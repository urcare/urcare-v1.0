import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  value?: any;
}

export interface QuestionData {
  id: string;
  type: 'multiple-choice' | 'single-choice' | 'text' | 'number' | 'slider' | 'cards' | 'time' | 'yes-no';
  question: string;
  description?: string;
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
}

interface QuestionStepProps {
  question: QuestionData;
  onContinue: (answers: any) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  initialValue?: any;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  onContinue, 
  onBack, 
  currentStep, 
  totalSteps,
  initialValue 
}) => {
  const [answers, setAnswers] = useState<any>(initialValue || getInitialValue());
  const [canContinue, setCanContinue] = useState(false);

  function getInitialValue() {
    switch (question.type) {
      case 'multiple-choice':
        return [];
      case 'single-choice':
      case 'cards':
      case 'yes-no':
        return null;
      case 'text':
      case 'number':
      case 'time':
        return '';
      case 'slider':
        return question.min || 0;
      default:
        return null;
    }
  }

  useEffect(() => {
    // Check if can continue based on question type and answers
    switch (question.type) {
      case 'multiple-choice':
        setCanContinue(Array.isArray(answers) && answers.length > 0);
        break;
      case 'single-choice':
      case 'cards':
      case 'yes-no':
        setCanContinue(answers !== null && answers !== '');
        break;
      case 'text':
      case 'number':
      case 'time':
        setCanContinue(answers && answers.toString().trim().length > 0);
        break;
      case 'slider':
        setCanContinue(true); // Slider always has a value
        break;
      default:
        setCanContinue(false);
    }
  }, [answers, question.type]);

  const handleMultipleChoice = (optionId: string) => {
    const currentAnswers = Array.isArray(answers) ? answers : [];
    if (currentAnswers.includes(optionId)) {
      setAnswers(currentAnswers.filter(id => id !== optionId));
    } else {
      setAnswers([...currentAnswers, optionId]);
    }
  };

  const handleSingleChoice = (optionId: string) => {
    setAnswers(optionId);
  };

  const handleSliderChange = (value: number) => {
    setAnswers(value);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => handleMultipleChoice(option.id)}
              >
                <div className="flex items-center space-x-3">
                  {option.icon && <div className="text-2xl">{option.icon}</div>}
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={Array.isArray(answers) && answers.includes(option.id)}
                  onChange={() => handleMultipleChoice(option.id)}
                />
              </motion.div>
            ))}
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  answers === option.id 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleSingleChoice(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.label}</h3>
                    {option.description && (
                      <p className="text-gray-600">{option.description}</p>
                    )}
                  </div>
                  {option.icon && (
                    <div className="ml-4 text-4xl">{option.icon}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'single-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                  answers === option.id 
                    ? 'border-gray-900 bg-gray-900 text-white' 
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                }`}
                onClick={() => handleSingleChoice(option.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {option.icon && <div>{option.icon}</div>}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'yes-no':
        return (
          <div className="space-y-3">
            <Button
              variant={answers === 'yes' ? 'default' : 'outline'}
              className={`w-full p-4 text-lg rounded-2xl ${
                answers === 'yes' ? 'bg-gray-900' : ''
              }`}
              onClick={() => setAnswers('yes')}
            >
              Yes
            </Button>
            <Button
              variant={answers === 'no' ? 'default' : 'outline'}
              className={`w-full p-4 text-lg rounded-2xl ${
                answers === 'no' ? 'bg-gray-900' : ''
              }`}
              onClick={() => setAnswers('no')}
            >
              No
            </Button>
          </div>
        );

      case 'text':
      case 'number':
        return (
          <div className="text-center">
            <Input
              type={question.type === 'number' ? 'number' : 'text'}
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder={question.placeholder}
              className="text-center text-2xl font-normal border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0 h-auto"
              style={{ boxShadow: 'none' }}
              autoFocus
              min={question.min}
              max={question.max}
              step={question.step}
            />
            <div className="w-full h-px bg-gray-200 mt-2"></div>
            {question.unit && (
              <div className="text-lg text-gray-600 mt-2">{question.unit}</div>
            )}
          </div>
        );

      case 'slider':
        return (
          <div className="px-4">
            <div className="text-center mb-8">
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                {answers} {question.unit}
              </div>
              {question.options && (
                <div className="flex justify-between items-center px-4">
                  {question.options.map((option, index) => (
                    <div key={option.id} className="text-center">
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm text-gray-600">{option.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="range"
                min={question.min || 0}
                max={question.max || 100}
                step={question.step || 1}
                value={answers}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button and progress */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        
        {/* Progress bar */}
        <div className="flex-1 mx-8">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gray-800 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 leading-tight">
            {question.question}
          </h1>
          {question.description && (
            <p className="text-lg text-gray-600">{question.description}</p>
          )}
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          {renderInput()}
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: canContinue ? 1 : 0.5, 
            y: 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => canContinue && onContinue(answers)}
            disabled={!canContinue}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
          </Button>
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #111827;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #111827;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}; 