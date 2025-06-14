
import React from 'react';
import { Clock, Calendar, Award, Smartphone } from 'lucide-react';

export const WhyChooseSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Instant medical help, 24/7",
      description: "Get immediate health insights anytime, anywhere, without waiting."
    },
    {
      icon: Calendar,
      title: "No waiting, no appointments",
      description: "Skip the waiting room and get answers to your health questions instantly."
    },
    {
      icon: Award,
      title: "Backed by cutting-edge AI and real doctors",
      description: "Combine the power of AI with human medical expertise for the best care."
    },
    {
      icon: Smartphone,
      title: "Works on mobile & desktop",
      description: "Access your health assistant from any device, wherever you are."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Why Choose
              <span className="text-blue-600 block">Urcare?</span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              We're revolutionizing healthcare by making it more accessible, efficient, and personalized for everyone.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visual */}
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 font-medium">System Online</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-blue-700">Uptime</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">&lt;30s</div>
                    <div className="text-sm text-purple-700">Response</div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">AI Confidence</span>
                    <span className="text-sm text-gray-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
