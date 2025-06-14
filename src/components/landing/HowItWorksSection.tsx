
import React from 'react';
import { MessageSquare, Brain, UserCheck } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Describe Your Symptoms",
      description: "Tell us about your symptoms through our intuitive chat interface or voice input.",
      step: "01"
    },
    {
      icon: Brain,
      title: "AI Analyzes and Gives Suggestions",
      description: "Our advanced AI processes your information and provides preliminary assessments.",
      step: "02"
    },
    {
      icon: UserCheck,
      title: "Connect to a Real Doctor if Needed",
      description: "Get connected with qualified healthcare professionals for further consultation.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get medical insights in three simple steps. Our AI-powered platform makes healthcare accessible and efficient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent -translate-x-4 z-0"></div>
              )}
              
              <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                <div className="absolute top-4 right-4 text-6xl font-bold text-blue-50 group-hover:text-blue-100 transition-colors duration-300">
                  {step.step}
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
