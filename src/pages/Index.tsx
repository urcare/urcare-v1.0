import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Stethoscope, Brain, Bot, Shield, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Header */}
      <header className="medical-nav px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-medical rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">UrCare</h1>
              <p className="text-caption text-muted-foreground">AI-Powered Healthcare</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth">
              <Button className="btn-medical-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center space-medical-4xl">
          <div className="space-medical-2xl animate-fade-in">
            <h1 className="text-display-lg text-foreground mb-6">
              Smarter Health,
              <br />
              <span className="gradient-medical bg-clip-text text-transparent">
                Backed by AI
              </span>
            </h1>
            
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the future of healthcare with our AI-powered platform that combines 
              cutting-edge technology with compassionate human care for better health outcomes.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/ai-diagnostics">
                <Button className="btn-medical-primary mobile-touch-target">
                  Begin Diagnosis
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="btn-medical-secondary mobile-touch-target">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="space-medical-4xl">
          <div className="text-center space-medical-2xl">
            <h2 className="text-h1 text-foreground">
              Why Choose UrCare?
            </h2>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              Our platform revolutionizes healthcare delivery through intelligent automation 
              and human-centered design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card group">
              <div className="w-12 h-12 gradient-medical rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">AI-Powered Diagnosis</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Advanced machine learning algorithms analyze symptoms and medical history 
                to provide accurate preliminary diagnoses and treatment recommendations.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">Expert Medical Care</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Connect with board-certified physicians and specialists who review AI insights 
                and provide personalized treatment plans tailored to your needs.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">Secure & Private</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Your health data is protected with enterprise-grade encryption and complies 
                with HIPAA standards to ensure complete privacy and security.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">24/7 AI Assistant</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Get instant answers to health questions, medication reminders, and 
                preliminary assessments anytime, anywhere with our intelligent AI assistant.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">Fast Results</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Receive preliminary health assessments in minutes, not days. Our AI processes 
                information rapidly while maintaining accuracy and attention to detail.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-12 h-12 gradient-medical rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-h3 text-foreground mb-4">Personalized Care</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                Every recommendation is tailored to your unique health profile, medical history, 
                and personal preferences for truly individualized healthcare.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="space-medical-4xl">
          <div className="glass-card rounded-2xl p-12 text-center">
            <h2 className="text-h2 text-foreground mb-8">Trusted by Healthcare Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-medical-sm">
                <div className="text-display-md gradient-medical bg-clip-text text-transparent font-bold">10k+</div>
                <p className="text-body text-muted-foreground">Patients Diagnosed</p>
              </div>
              <div className="space-medical-sm">
                <div className="text-display-md gradient-medical bg-clip-text text-transparent font-bold">95%</div>
                <p className="text-body text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="space-medical-sm">
                <div className="text-display-md gradient-medical bg-clip-text text-transparent font-bold">500+</div>
                <p className="text-body text-muted-foreground">Medical Partners</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-medical-2xl">
          <div className="medical-card p-12 gradient-medical-subtle">
            <h2 className="text-h1 text-foreground mb-6">
              Ready to Transform Your Healthcare?
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of patients who are already experiencing smarter, 
              more personalized healthcare with UrCare.
            </p>
            <Link to="/auth">
              <Button className="btn-medical-primary text-lg px-8 py-4">
                Start Your Health Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-body-sm text-muted-foreground">
            © 2024 UrCare Healthcare Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
