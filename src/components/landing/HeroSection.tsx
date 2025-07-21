
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-teal-300 via-purple-200 to-pink-200 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-300/80 via-yellow-200/60 to-pink-300/80"></div>
      
      {/* Woman Image in Corner */}
      <div className="absolute right-0 top-0 h-full w-1/2 lg:w-2/5">
        <img 
          src="/lovable-uploads/fe7592b1-6478-474b-8953-1c8dd7c079ad.png" 
          alt="Happy woman using healthcare app" 
          className="h-full w-full object-cover object-left"
        />
      </div>

      {/* Menu Icon */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-8 h-8 flex flex-col justify-center space-y-1">
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-6xl lg:text-7xl font-light text-white leading-tight">
              Feel better, every day with 
              <span className="font-normal block">urcare</span>
            </h1>
            
            <div className="w-24 h-0.5 bg-white"></div>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-lg font-light">
              Smart / effortless care for yourself and your lovedones that youcan | afford | olose
            </p>
            
            <div className="pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/onboarding')}
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                GET STARTED
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-12">
              {[
                { value: "500K+", label: "Users Served" },
                { value: "24/7", label: "Available" },
                { value: "95%", label: "Accuracy" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - reserved for the image */}
          <div className="relative lg:block hidden">
            {/* This space is reserved for the woman image positioned absolutely */}
          </div>
        </div>
        
        {/* Bottom right text */}
        <div className="absolute bottom-20 right-8 text-white/80 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border border-white/60 rounded-full flex items-center justify-center">
              <span className="text-xs">w</span>
            </span>
            here
            <span className="w-4 h-4 border border-white/60 rounded-full flex items-center justify-center">
              <span className="text-xs">©</span>
            </span>
            help you Heal.
          </span>
        </div>
      </div>
    </section>
  );
};
