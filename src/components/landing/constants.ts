// Shared constants for landing page components
import { Brain, Search, Users, Shield, Clock, MessageSquare, UserCheck, Calendar, Award, Smartphone } from 'lucide-react';

export const GRID_IMAGES = [
  { id: 1, url: "/landing/health-app-desktop-1.jpg", alt: "Health app desktop 1", className: "col-span-1 row-span-2" },
  { id: 2, url: "/landing/health-app-desktop-2.jpg", alt: "Health app desktop 2", className: "col-span-1 row-span-1" },
  { id: 3, url: "/landing/health-app-desktop-3.jpg", alt: "Health app desktop 3", className: "col-span-1 row-span-1" },
  { id: 4, url: "/landing/health-app-desktop-4.jpg", alt: "Health app desktop 4", className: "col-span-1 row-span-2" },
  { id: 5, url: "/landing/health-app-desktop-5.jpg", alt: "Health app desktop 5", className: "col-span-1 row-span-2" },
  { id: 6, url: "/landing/health-app-desktop-6.jpg", alt: "Health app desktop 6", className: "col-span-1 row-span-1" },
  { id: 7, url: "/landing/health-app-mobile-1.jpg", alt: "Health app mobile 1", className: "col-span-1 row-span-1" },
  { id: 8, url: "/landing/health-app-mobile-2.jpg", alt: "Health app mobile 2", className: "col-span-1 row-span-1" },
  { id: 9, url: "/landing/health-app-mobile-3.jpg", alt: "Health app mobile 3", className: "col-span-1 row-span-1" }
];

export const FEATURES = [
  { icon: Brain, title: "AI-Powered Symptom Checker", description: "Advanced machine learning algorithms provide accurate preliminary health assessments based on your symptoms.", color: "blue" },
  { icon: Search, title: "Instant Suggestions and Triage", description: "Get immediate guidance on urgency level and recommended next steps for your health concerns.", color: "green" },
  { icon: Users, title: "Doctor Recommendations Based on Condition", description: "Connect with specialists and healthcare professionals matched to your specific health needs.", color: "purple" },
  { icon: Shield, title: "Privacy-first and HIPAA-Compliant", description: "Your health data is completely secure with enterprise-grade encryption and HIPAA compliance.", color: "orange" },
  { icon: Clock, title: "Available 24/7 on Mobile and Desktop", description: "Access healthcare guidance anytime, anywhere, from any device with our responsive platform.", color: "indigo" }
];

export const HOW_IT_WORKS_STEPS = [
  { icon: MessageSquare, title: "Speak or Type Your Symptoms", description: "Tell us about your symptoms through our intuitive chat interface or voice input.", step: "01" },
  { icon: Brain, title: "Our AI Analyzes and Gives Instant Guidance", description: "Our advanced AI processes your information and provides preliminary assessments.", step: "02" },
  { icon: UserCheck, title: "Connect to a Verified Doctor if Needed", description: "Get connected with qualified healthcare professionals for further consultation.", step: "03" }
];

export const WHY_CHOOSE_BENEFITS = [
  { icon: Clock, title: "No more late-night panic googling", description: "Get reliable medical guidance instantly instead of falling down internet rabbit holes." },
  { icon: Calendar, title: "Faster than waiting rooms", description: "Skip the waiting room and get answers to your health questions in seconds." },
  { icon: Award, title: "Get clarity before you visit a clinic", description: "Understand your symptoms and be prepared for more productive doctor visits." },
  { icon: Smartphone, title: "Built with doctors and AI researchers", description: "Developed in collaboration with medical professionals and leading AI experts." }
];

export const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "Working Mother", content: "Better than Google, feels like magic! Urcare caught my symptoms early and recommended exactly what I needed.", rating: 5, avatar: "SJ" },
  { name: "Michael Chen", role: "Software Engineer", content: "Caught my real issue when I was unsure. The accuracy is incredible and saved me from unnecessary worry.", rating: 5, avatar: "MC" },
  { name: "Emily Rodriguez", role: "College Student", content: "Helped me avoid a panic ER trip. Perfect for late-night health questions when no doctor is around!", rating: 5, avatar: "ER" },
  { name: "David Thompson", role: "Retiree", content: "As someone with multiple health concerns, this platform gives me peace of mind. The AI is remarkably accurate.", rating: 5, avatar: "DT" }
];

export const COLOR_CLASSES = {
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
  green: "bg-green-100 text-green-600 group-hover:bg-green-200", 
  purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
  orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200",
  indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
};

export const ANIMATION_VARIANTS = {
  card: "group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in",
  section: "py-24 bg-gradient-to-b from-slate-50 to-white",
  heading: "text-4xl lg:text-5xl font-bold text-gray-900 mb-6",
  subheading: "text-xl text-gray-600 max-w-3xl mx-auto"
}; 