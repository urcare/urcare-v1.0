
import React from 'react';
import { Brain, Search, Users, Shield } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms provide accurate preliminary health assessments based on your symptoms.",
      color: "blue"
    },
    {
      icon: Search,
      title: "Symptom Checker with Accuracy",
      description: "Comprehensive symptom analysis with high accuracy rates, helping you understand your health better.",
      color: "green"
    },
    {
      icon: Users,
      title: "Real-Time Doctor Recommendations",
      description: "Get instant connections to qualified healthcare professionals when you need human expertise.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Privacy-First, HIPAA-Compliant",
      description: "Your health data is completely secure with enterprise-grade encryption and HIPAA compliance.",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
      green: "bg-green-100 text-green-600 group-hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of healthcare with our comprehensive suite of AI-powered medical tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
