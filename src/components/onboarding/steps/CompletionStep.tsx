import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletionStepProps {
  onContinue: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ onContinue }) => {
  return (
    <div className="space-y-8 text-center">
      {/* Circular graphic with hand gesture */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Gradient border circle */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-pink-200 to-blue-200 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {/* Hand gesture SVG - finger heart */}
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-gray-800"
              >
                {/* Hand with finger heart gesture */}
                <path 
                  d="M8 4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V8C16 9.1 15.1 10 14 10H10C8.9 10 8 9.1 8 8V4Z" 
                  fill="currentColor"
                />
                {/* Thumb */}
                <path 
                  d="M6 8C6 6.9 6.9 6 8 6H10C11.1 6 12 6.9 12 8V12C12 13.1 11.1 14 10 14H8C6.9 14 6 13.1 6 12V8Z" 
                  fill="currentColor"
                />
                {/* Index finger */}
                <path 
                  d="M14 8C14 6.9 14.9 6 16 6H18C19.1 6 20 6.9 20 8V12C20 13.1 19.1 14 18 14H16C14.9 14 14 13.1 14 12V8Z" 
                  fill="currentColor"
                />
                {/* Heart shape between fingers */}
                <path 
                  d="M12 10C12.6 10 13 10.4 13 11C13 11.6 12.6 12 12 12C11.4 12 11 11.6 11 11C11 10.4 11.4 10 12 10Z" 
                  fill="currentColor"
                />
                {/* Striped cuff */}
                <rect x="4" y="16" width="16" height="2" fill="currentColor" opacity="0.6"/>
                <rect x="4" y="18" width="16" height="1" fill="currentColor" opacity="0.4"/>
                <rect x="4" y="19" width="16" height="1" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
          </div>
          
          {/* Orange checkmark circle */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* "All done!" message */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        <span className="text-gray-700 font-medium">All done!</span>
      </div>

      {/* Main message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Time to generate your custom plan!
        </h2>
        <p className="text-gray-600 text-sm">
          We'll create a personalized health plan based on your information
        </p>
      </div>

      {/* Continue button */}
      <div className="pt-4">
        <button
          onClick={onContinue}
          className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}; 