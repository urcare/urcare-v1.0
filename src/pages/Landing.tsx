import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Shield, 
  Zap, 
  Brain, 
  Activity, 
  Calendar,
  FileText,
  Bell,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe,
  Clock,
  TrendingUp,
  BarChart3,
  Microscope,
  Pill,
  Phone,
  MessageSquare,
  Video,
  MapPin,
  UserCheck,
  Database,
  Cpu,
  Smartphone,
  Tablet
} from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      icon: Heart,
      title: 'Comprehensive Health Management',
      description: 'Complete health records, appointments, and medication tracking in one secure platform.',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Zap,
      title: 'AI-Powered Diagnostics',
      description: 'Advanced AI algorithms provide diagnostic insights and treatment recommendations.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'HIPAA-compliant security with end-to-end encryption and role-based access control.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Brain,
      title: 'Mental Health Support',
      description: 'Integrated mental health tools and crisis intervention systems.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Continuous health monitoring with instant alerts and notifications.',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Users,
      title: 'Multi-role Support',
      description: 'Comprehensive support for patients, doctors, nurses, and administrators.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users', icon: Users },
    { value: '99.9%', label: 'Uptime', icon: Shield },
    { value: '50+', label: 'Healthcare Partners', icon: Heart },
    { value: '24/7', label: 'Support', icon: Clock }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'UrCare has revolutionized how I manage my patients. The AI insights are incredibly accurate and save me hours of analysis.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Emily Chen',
      role: 'Patient',
      content: 'As a patient, I feel more in control of my health than ever. The platform is intuitive and keeps me informed about my care.',
      rating: 5,
      avatar: 'EC'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Hospital Administrator',
      content: 'The administrative tools are comprehensive and the security features give us complete confidence in patient data protection.',
      rating: 5,
      avatar: 'MR'
    }
  ];

  const roleCards = [
    {
      title: 'For Patients',
      description: 'Access your health records, schedule appointments, and track your wellness journey.',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      features: ['Health Records', 'Appointment Booking', 'Medication Tracking', 'Wellness Programs']
    },
    {
      title: 'For Doctors',
      description: 'Advanced diagnostic tools, patient management, and AI-powered insights.',
      icon: Stethoscope,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      features: ['AI Diagnostics', 'Patient Management', 'Treatment Plans', 'Clinical Analytics']
    },
    {
      title: 'For Nurses',
      description: 'Efficient patient care coordination and real-time monitoring tools.',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      features: ['Patient Monitoring', 'Care Coordination', 'Vital Signs', 'Medication Admin']
    },
    {
      title: 'For Administrators',
      description: 'Comprehensive system management and analytics dashboard.',
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      features: ['User Management', 'System Analytics', 'Security Controls', 'Performance Monitoring']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="medical-nav px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UrCare
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#roles" className="text-foreground hover:text-primary transition-colors">Roles</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Testimonials</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Healthcare Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Healthcare</span>
            <br />
            is Here
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            UrCare is a comprehensive healthcare management platform that combines AI-powered diagnostics, 
            secure patient data management, and seamless care coordination for modern healthcare delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6 text-primary mr-2" />
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose UrCare?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with healthcare expertise to deliver 
              the most comprehensive and secure healthcare management solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-based Features */}
      <section id="roles" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Designed for Every Healthcare Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a patient, healthcare provider, or administrator, 
              UrCare has specialized tools designed for your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roleCards.map((role, index) => {
              const Icon = role.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${role.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${role.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{role.title}</CardTitle>
                        <CardDescription className="text-base">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {role.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what healthcare providers and patients are saying about UrCare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of healthcare professionals and patients who trust UrCare 
            for their healthcare management needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  UrCare
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Transforming healthcare delivery with AI-powered insights and secure patient management.
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                <Phone className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 UrCare. All rights reserved. HIPAA compliant and secure.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 