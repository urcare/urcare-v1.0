
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, MessageCircle, Calendar, Shield, Heart, Smartphone, Check, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientLandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat for Instant Help",
      description: "Get immediate guidance on your symptoms"
    },
    {
      icon: Calendar,
      title: "Book Doctor Easily",
      description: "Connect with verified doctors instantly"
    },
    {
      icon: Shield,
      title: "Save Reports Securely",
      description: "Store all your medical records safely"
    },
    {
      icon: Heart,
      title: "Get Daily Health Tips",
      description: "Personalized wellness advice daily"
    },
    {
      icon: Smartphone,
      title: "All in One Place",
      description: "Complete health management in your pocket"
    }
  ];

  const testimonials = [
    {
      text: "I got help at midnight when no clinic was open!",
      author: "Rahul M.",
      rating: 5
    },
    {
      text: "This app saved me from panic and gave clear advice.",
      author: "Neha K.",
      rating: 5
    },
    {
      text: "Finally, a health app that actually understands my concerns.",
      author: "Priya S.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%2306b6d4' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full text-cyan-700 text-sm font-medium">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                AI-Powered Health Assistant
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Talk to AI.
                <span className="text-cyan-600 block">Feel Better.</span>
                <span className="text-gray-700">Instantly.</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                AI-powered health assistant for quick help & smarter care
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/patient-dashboard')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Symptom Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-cyan-300 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/1c066dea-4205-4463-a325-e44033b98928.png" 
                  alt="Happy woman using UrCare health app" 
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
                {/* Phone Mockup Overlay */}
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl p-4 max-w-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">AI Health Assistant</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg p-2 text-sm">How can I help you today?</div>
                    <div className="bg-cyan-100 rounded-lg p-2 text-sm ml-auto max-w-[80%]">I have a headache...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete healthcare assistance powered by AI, designed for modern patients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-200 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-cyan-600" />
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

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get better health guidance in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe your symptoms",
                description: "Tell our intelligent chatbot about how you're feeling"
              },
              {
                step: "2",
                title: "Get AI suggestions",
                description: "Receive instant guidance or book an appointment with verified doctors"
              },
              {
                step: "3",
                title: "Store reports & records",
                description: "Keep all your health information organized for personalized ongoing care"
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-cyan-200 to-transparent -translate-x-4 z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose UrCare?
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center font-semibold text-cyan-600">UrCare</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Google</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Random Doctor Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: "AI Chat", urcare: true, google: false, others: false },
                  { feature: "Verified Doctors", urcare: true, google: false, others: true },
                  { feature: "Medical Records Storage", urcare: true, google: false, others: false },
                  { feature: "Personalized Health Tips", urcare: true, google: false, others: false }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.urcare ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.google ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.others ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Patients Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg text-gray-900 mb-6">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="font-semibold text-cyan-600">
                  – {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Feel Better?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8">
            No sign-up needed. Start in seconds.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/patient-dashboard')}
            className="bg-white text-cyan-600 hover:bg-gray-100 px-12 py-6 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
          >
            Start Free Symptom Check
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Verified Doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">UrCare</span>
              </div>
              <p className="text-gray-400">
                AI-powered health assistant for smarter, faster healthcare.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Emergency</h3>
              <p className="text-sm text-gray-400 mb-2">
                For medical emergencies, call:
              </p>
              <p className="text-xl font-bold text-red-400">911</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">About the AI</h3>
              <p className="text-sm text-gray-400">
                Our AI is trained on verified medical data and continuously updated by healthcare professionals.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="text-center text-gray-400">
              <p className="mb-4">
                <strong>Important Disclaimer:</strong> UrCare is not a replacement for emergency medical care. 
                Always consult healthcare professionals for serious conditions.
              </p>
              <p>© 2025 UrCare Technologies. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
