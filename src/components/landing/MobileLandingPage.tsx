
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Stethoscope, FileText, User, Cpu } from 'lucide-react';

export const MobileLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-peach-50 to-teal-50 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-orange-50/30 to-teal-100/40"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-8 w-1 h-1 bg-orange-300 rounded-full animate-pulse opacity-50 animation-delay-1000"></div>
      <div className="absolute bottom-60 left-6 w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse opacity-40 animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Central Medical Symbol with Orbiting Icons */}
        <div className="relative w-80 h-80 mb-16">
          {/* Central glowing symbol */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-teal-500 rounded-sm transform rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-6 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Orbiting Icons */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
            {/* Stethoscope */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-500" />
            </div>
            
            {/* Heart Rate */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            
            {/* Shield */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            
            {/* Medical Document */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            
            {/* Doctor Avatar */}
            <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            
            {/* AI Chip */}
            <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-teal-500" />
            </div>
          </div>
          
          {/* Orbit ring */}
          <div className="absolute inset-8 border border-white/20 rounded-full"></div>
          <div className="absolute inset-16 border border-white/10 rounded-full"></div>
        </div>

        {/* Brand and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-light text-gray-600">UrCare</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">AI Precision, Human Care</p>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Smarter Health
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-sm mx-auto leading-relaxed">
            Experience healthcare powered by AI intelligence and human compassion
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => window.location.href = '/auth'}
        >
          Get Started
        </Button>

        {/* Bottom indicator */}
        <div className="mt-8 w-32 h-1 bg-gray-900 rounded-full"></div>
      </div>
    </div>
  );
};
