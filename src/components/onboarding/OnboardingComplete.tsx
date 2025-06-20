
import React from 'react';
import { CheckCircle, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingCompleteProps {
  onDataChange: (data: any) => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({ onDataChange }) => {
  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
      </div>

      {/* Thank You Message */}
      <div className="space-y-4">
        <h2 className="text-3xl font-light text-gray-900">You're All Set!</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Based on your inputs, your personalized health journey begins now.
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg">
          <Heart className="w-8 h-8 text-teal-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Personalized Care</h4>
          <p className="text-sm text-gray-600">AI-powered health insights tailored to you</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Smart Tracking</h4>
          <p className="text-sm text-gray-600">Monitor your health goals effortlessly</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
          <ArrowRight className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">24/7 Support</h4>
          <p className="text-sm text-gray-600">Your health assistant is always available</p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl">
        <p className="text-teal-800 font-medium mb-2">
          "Your journey to better health starts with a single step."
        </p>
        <p className="text-sm text-teal-700">
          We're here to guide you every step of the way. Welcome to UrCare!
        </p>
      </div>
    </div>
  );
};

export default OnboardingComplete;
