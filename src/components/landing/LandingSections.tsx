import React from 'react';
import { FEATURES, HOW_IT_WORKS_STEPS, COLOR_CLASSES, ANIMATION_VARIANTS } from './constants';

export const FeaturesSection = () => {
  return (
    <section className={ANIMATION_VARIANTS.section}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className={ANIMATION_VARIANTS.heading}>Key Features</h2>
          <p className={ANIMATION_VARIANTS.subheading}>
            Experience the future of healthcare with our comprehensive suite of AI-powered medical tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className={ANIMATION_VARIANTS.card}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${COLOR_CLASSES[feature.color as keyof typeof COLOR_CLASSES]}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className={ANIMATION_VARIANTS.heading}>How It Works</h2>
          <p className={ANIMATION_VARIANTS.subheading}>
            Get medical insights in three simple steps. Our AI-powered platform makes healthcare accessible and efficient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 