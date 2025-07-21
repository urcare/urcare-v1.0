// Shared constants for onboarding components
import { Heart, Stethoscope, Pill, Brain, Zap, Eye, Target, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

// Common animation variants
export const ONBOARDING_ANIMATIONS = {
  containerInitial: { opacity: 0, y: 20 },
  containerAnimate: { opacity: 1, y: 0 },
  containerTransition: { duration: 0.6 },
  
  itemInitial: { opacity: 0, y: 20 },
  itemAnimate: { opacity: 1, y: 0 },
  
  buttonTransition: { duration: 0.3 }
};

// Common button styles
export const ONBOARDING_BUTTON_STYLES = {
  primary: "w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
  secondary: "w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
  ghost: "p-2 hover:bg-gray-100 rounded-full"
};

// Progress bar widths for different steps
export const PROGRESS_WIDTHS = {
  welcome: "w-0",
  name: "w-1/6", 
  greeting: "w-2/6",
  profile: "w-3/6",
  health: "w-4/6",
  goals: "w-5/6",
  complete: "w-full"
};

// Predefined health goals
export const HEALTH_GOALS = [
  'Improve Sleep Quality',
  'Reduce Stress', 
  'Manage Weight',
  'Stay Physically Fit',
  'Monitor Chronic Condition',
  'Better Nutrition',
  'Mental Health',
  'Preventive Care',
  'Just Explore'
];

// Medical conditions with categories
export const MEDICAL_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', icon: Pill, category: 'Metabolic' },
  { id: 'hypertension', label: 'High Blood Pressure', icon: Heart, category: 'Cardiovascular' },
  { id: 'asthma', label: 'Asthma', icon: Stethoscope, category: 'Respiratory' },
  { id: 'pcos', label: 'PCOS', icon: Pill, category: 'Hormonal' },
  { id: 'thyroid', label: 'Thyroid Disorders', icon: Pill, category: 'Hormonal' },
  { id: 'depression', label: 'Depression', icon: Brain, category: 'Mental Health' },
  { id: 'anxiety', label: 'Anxiety', icon: Brain, category: 'Mental Health' },
  { id: 'arthritis', label: 'Arthritis', icon: Zap, category: 'Musculoskeletal' },
  { id: 'heart', label: 'Heart Conditions', icon: Heart, category: 'Cardiovascular' },
  { id: 'allergies', label: 'Allergies', icon: Eye, category: 'Immune' },
  { id: 'migraine', label: 'Migraine', icon: Brain, category: 'Neurological' },
  { id: 'cholesterol', label: 'High Cholesterol', icon: Heart, category: 'Cardiovascular' }
];

// Common container styles
export const ONBOARDING_LAYOUTS = {
  fullScreen: "min-h-screen bg-gray-50 flex flex-col",
  centered: "min-h-screen bg-gray-50 flex items-center justify-center px-4",
  content: "flex-1 flex items-center justify-center px-6",
  header: "flex items-center justify-between p-4 pt-12",
  footer: "p-6 pb-8"
};

// Progress bar component styles
export const PROGRESS_BAR_STYLES = {
  container: "flex-1 mx-8",
  track: "w-full bg-gray-200 rounded-full h-1",
  fill: "bg-gray-800 h-1 rounded-full transition-all duration-300"
};

// Avatar and icon styles
export const AVATAR_STYLES = {
  large: "w-24 h-24",
  fallback: "bg-gradient-to-r from-teal-100 to-blue-100",
  icon: "w-8 h-8 text-teal-600"
};

// Complete step features
export const COMPLETION_FEATURES = [
  {
    icon: Heart,
    title: "Personalized Care", 
    description: "AI-powered health insights tailored to you",
    gradient: "from-teal-50 to-blue-50",
    iconColor: "text-teal-600"
  },
  {
    icon: Sparkles,
    title: "Smart Tracking",
    description: "Monitor your health goals effortlessly", 
    gradient: "from-blue-50 to-purple-50",
    iconColor: "text-blue-600"
  },
  {
    icon: ArrowRight,
    title: "24/7 Support",
    description: "Your health assistant is always available",
    gradient: "from-purple-50 to-pink-50", 
    iconColor: "text-purple-600"
  }
]; 