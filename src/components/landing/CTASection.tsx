
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Join the Future of Healthcare
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Smarter Healthcare
            <span className="block text-blue-200">Starts Now.</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Get your first AI health checkup in seconds. It's free and private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="text-white/80 text-sm">
              No credit card required • Free forever plan available
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">500K+</div>
              <div className="text-blue-200">Happy Users</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-blue-200">Diagnoses Made</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
