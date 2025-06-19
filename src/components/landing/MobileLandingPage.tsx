
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Stethoscope, FileText, Lock, Cpu } from 'lucide-react';

export const MobileLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden border-8 border-black">
      {/* Dark gradient background with teal highlights */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-teal-900/40"></div>
      
      {/* Floating particles with glow */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60 shadow-lg shadow-cyan-400/50"></div>
      <div className="absolute top-40 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-50 animation-delay-1000 shadow-md shadow-blue-400/50"></div>
      <div className="absolute bottom-60 left-6 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-40 animation-delay-2000 shadow-md shadow-teal-400/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Central glassmorphic card */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Central Medical Symbol with Orbiting Icons */}
          <div className="relative w-64 h-64 mb-8 mx-auto">
            {/* Central glowing symbol - Shield + AI Circuit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-400/50">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Orbiting Icons */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
              {/* Heart */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              
              {/* AI Chip */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              
              {/* Stethoscope */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <Stethoscope className="w-5 h-5 text-blue-400" />
              </div>
              
              {/* Lock (Privacy) */}
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              
              {/* Document */}
              <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            
            {/* Orbit rings */}
            <div className="absolute inset-6 border border-white/5 rounded-full"></div>
            <div className="absolute inset-12 border border-white/10 rounded-full"></div>
          </div>

          {/* Brand Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-light text-white/90">UrCare</span>
            </div>
          </div>

          {/* Main Heading - Futuristic Font */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 leading-tight font-mono tracking-wide">
              Smarter Health,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Backed by AI
              </span>
            </h1>
            <p className="text-white/60 text-sm font-medium">
              AI Precision, Human Care
            </p>
          </div>

          {/* CTA Button - Glassy with neon blue edge */}
          <Button
            size="lg"
            className="w-full bg-white/5 backdrop-blur-lg hover:bg-white/10 text-white py-4 text-base font-semibold rounded-2xl shadow-lg border border-cyan-400/50 hover:border-cyan-400/80 transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-400/30 hover:shadow-xl"
            onClick={() => window.location.href = '/auth'}
          >
            Begin Diagnosis
          </Button>
        </div>

        {/* Bottom indicator */}
        <div className="mt-6 w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/30"></div>
      </div>
    </div>
  );
};
