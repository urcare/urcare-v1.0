import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle,
  Calendar,
  TrendingUp,
  Heart,
  Shield,
  Users,
  Gift,
  Play,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  ChevronUp,
  Microscope,
  FileText,
  Leaf,
  Stethoscope,
  Clock,
  AlertCircle,
  ClipboardCheck,
  Activity
} from "lucide-react";
import { toast } from "sonner";

const LandingDiabetes = () => {
  const navigate = useNavigate();
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    diabetesType: "",
    hba1c: "",
    medications: "",
    age: "",
  });

  // All 10 testimonials with images - organized to match names with appropriate images
  const testimonials = [
    {
      name: "Ayesha",
      location: "Australia 🇦🇺",
      text: "Today, Ayesha feels lighter, healthier💚",
      rating: 5,
      image: "/landing/IMG_1501.JPG",
    },
    {
      name: "Tanya",
      location: "Canada 🇨🇦",
      text: "From PCOS to Peace 🌸",
      rating: 5,
      image: "/landing/IMG_1502.JPG",
    },
    {
      name: "Sunita Rai",
      location: "",
      text: "Ab main fir se healthy feel karti hoon ❤️",
      rating: 5,
      image: "/landing/IMG_1503.JPG",
    },
    {
      name: "Shreya",
      location: "Ahmedabad",
      text: "sirf within 90 din mein reports normal ayi!",
      rating: 5,
      image: "/landing/IMG_1504.JPG",
    },
    {
      name: "Mehak",
      location: "Mumbai 🇮🇳",
      text: "High pre diabetes to Normal blood markers 💚.",
      rating: 5,
      image: "/landing/IMG_1505.JPG",
    },
    {
      name: "Priya",
      location: "Delhi",
      text: "Amazing results! My sugar levels are stable now.",
      rating: 5,
      image: "/landing/IMG_1506.JPG",
    },
    {
      name: "Anita",
      location: "Chennai",
      text: "Reversed my diabetes completely. Thank you UrCare!",
      rating: 5,
      image: "/landing/IMG_1507.JPG",
    },
    {
      name: "Mukesh",
      location: "Hyderabad",
      text: "Diagnosis reversed. My A1c level is now 5.4.",
      rating: 5,
      image: "/landing/IMG_1508.JPG",
    },
    {
      name: "Arjun",
      location: "Pune",
      text: "Reversed in 67 days!",
      rating: 5,
      image: "/landing/IMG_1509.JPG",
    },
    {
      name: "Rajesh",
      location: "Bangalore",
      text: "Best decision I made. Feeling healthier every day!",
      rating: 5,
      image: "/landing/IMG_1510.JPG",
    },
  ];

  const bonuses = [
    {
      title: "Personal 1on1 Doctor Call / week",
      value: "₹48,000",
      icon: Phone,
    },
    {
      title: "On-demand Updates + All Future Features FREE",
      value: "₹10,000",
      icon: Gift,
    },
    {
      title: "Add 1 Family Member FREE",
      value: "₹3,500",
      icon: Users,
    },
    {
      title: "Success Reward (110% Cashback if you Reverse)",
      value: "Priceless 💚",
      icon: Heart,
    },
  ];

  const phases = [
    {
      phase: "Phase 1",
      name: "RESET",
      days: "Days 1–30",
      description: "Get the body ready for reversal",
    },
    {
      phase: "Phase 2",
      name: "REBALANCE",
      days: "Days 31–60",
      description: "Your blood sugar machinery starts working smoother",
    },
    {
      phase: "Phase 3",
      name: "REMISSION MODE",
      days: "Days 61–90",
      description: "Your sugars stabilise and the body re-enters its natural balanced state",
    },
  ];

  const faqs = [
    {
      question: "What should I expect in the first week?",
      answer: "Within the first week, you'll experience sugar stabilisation. Our team will guide you through the initial phase with personalized support and monitoring.",
    },
    {
      question: "Do I need to have prior medical knowledge?",
      answer: "No prior medical knowledge is required. Everything is done FOR the patient. You don't think ~ You just follow our personalized treatment plan.",
    },
    {
      question: "What types of diabetes do you treat?",
      answer: "We specialize in Type 1 (SIDD, MOD, MARD), Type 1.5 (LADA), and Long-Term Type 2 diabetes. Each case receives hyper-personalized treatment.",
    },
    {
      question: "How early should I start the program?",
      answer: "The sooner you start, the better. Our program begins working from Day 1, with visible improvements within the first week.",
    },
    {
      question: "What if I have complications or other health conditions?",
      answer: "We specialize in treating the toughest cases. Our expert doctors provide supervision and create custom protocols that address all your health concerns.",
    },
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in the Diabetes Reversal Program. Please share more details.`
    );
    window.open(`https://wa.me/918218741693?text=${message}`, "_blank");
  };

  const handlePaymentClick = (paymentLink: string) => {
    window.open(paymentLink, "_blank");
  };

  const handleAssessmentClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSduyQ2J7cZnH1jsZcfxYovDvUoobILZZkv8sd3-AgmZ_DrCHw/viewform", "_blank");
  };

  const handleMedicalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Google Form
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSduyQ2J7cZnH1jsZcfxYovDvUoobILZZkv8sd3-AgmZ_DrCHw/viewform", "_blank");
    setShowMedicalForm(false);
  };

  const handleStartNow = () => {
    setShowMedicalForm(true);
  };

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/brand.png" 
                alt="UrCare Logo" 
                className="h-10 md:h-12 w-auto"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('span');
                    fallback.className = "logo-fallback text-xl md:text-2xl font-bold text-gray-900";
                    fallback.textContent = "URCARE";
                    parent.appendChild(fallback);
                  }
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-[#228b22] transition-colors">About Us</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#228b22] transition-colors">Reviews</a>
              <a href="#roadmap" className="text-gray-700 hover:text-[#228b22] transition-colors">Program</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#228b22] transition-colors">Pricing</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col gap-4">
                <a href="#about" className="text-gray-700 hover:text-[#228b22]" onClick={() => setMobileMenuOpen(false)}>About Us</a>
                <a href="#testimonials" className="text-gray-700 hover:text-[#228b22]" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <a href="#roadmap" className="text-gray-700 hover:text-[#228b22]" onClick={() => setMobileMenuOpen(false)}>Program</a>
                <a href="#pricing" className="text-gray-700 hover:text-[#228b22]" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-[#228b22]/10 rounded-3xl p-8 md:p-12"
            >
              <p className="text-[#228b22] text-sm md:text-base font-medium mb-4">Root Cause Treatment</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Reverse Your Diabetes From the Root Cause
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Start living freely again in 90 days. If you follow the treatment plan and don't improve, you get 200% back. Everything is done FOR the patient. You don't think ~ You just follow.
              </p>
              <Button
                onClick={handleStartNow}
                className="bg-[#228b22] hover:bg-[#1e7a1e] text-white text-lg px-8 py-6 rounded-xl font-semibold"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>

            {/* Right Image Area with Overlay */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-[#228b22]/10 flex items-center justify-center">
                  <Heart className="w-32 h-32 text-[#228b22] opacity-50" />
                </div>
                {/* Green Ribbon Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#228b22]/90 backdrop-blur-sm p-6">
                  <p className="text-white text-sm md:text-base leading-relaxed">
                    Real People. Real Reversals. Real Health🍀 Your Future Health Depends on the Decision You Make Right Now.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full ${
                  index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-gray-100' : 'bg-green-100'
                }`} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{phase.name}</h3>
                  <p className="text-[#228b22] font-semibold mb-4">{phase.days}</p>
                  <p className="text-gray-600 leading-relaxed">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area with Sidebar */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2/3 */}
            <div className="lg:col-span-2 space-y-12">
              {/* Plans Section */}
              <section id="pricing" className="space-y-8">
                {/* Plan 1 - Easy Reversal Activation Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#228b22]/10"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-[#228b22] to-[#1e7a1e] text-white p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <h3 className="text-2xl md:text-3xl font-bold">Easy Reversal Activation Plan</h3>
                    </div>
                    <p className="text-lg md:text-xl text-white/90">
                      For Type 2 diabetes under 5 years (easy/moderate cases)
                    </p>
                  </div>

                  {/* Features Section */}
                  <div className="p-6 md:p-8 bg-gradient-to-br from-[#228b22]/5 to-[#228b22]/10">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-[#228b22]" />
                      What's Included
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Microscope className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Root Cause Diagnosis</p>
                          <p className="text-sm text-gray-600">Comprehensive analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <FileText className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Hyper-Personalised Protocol</p>
                          <p className="text-sm text-gray-600">Tailored to your needs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Leaf className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Custom Traditional Medication</p>
                          <p className="text-sm text-gray-600">Natural healing approach</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Stethoscope className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Doctor's Supervision</p>
                          <p className="text-sm text-gray-600">Expert guidance</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#228b22]/20 rounded-xl p-4 text-center">
                      <p className="text-sm md:text-base font-semibold text-gray-800">
                        <Clock className="w-4 h-4 inline mr-2 text-[#228b22]" />
                        Patience 2-4 weeks minimum for visible results
                      </p>
                    </div>
                  </div>

                  {/* Enrollment Notice */}
                  <div className="bg-[#228b22] text-white p-4 md:p-6 text-center">
                    <p className="text-base md:text-lg font-semibold">
                      Only 14 enrolments maximum accepted per week to maintain medical quality
                    </p>
                  </div>

                  {/* Payment Button */}
                  <div className="p-6 md:p-8 bg-white">
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=mF6YxeuZFIeNUC0BnVKU%2FQ%3D%3D")}
                      className="w-full bg-gradient-to-r from-[#228b22] to-[#1e7a1e] hover:from-[#1e7a1e] hover:to-[#1a6b1a] text-white text-xl md:text-2xl font-bold py-4 md:py-5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 1 - Pay the Treatment Fee
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Assessment Section */}
                  <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-6 md:p-8 border-t-2 border-dashed border-[#228b22]/30">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Activity className="w-6 h-6 text-[#228b22]" />
                      <h4 className="text-2xl md:text-3xl font-bold text-[#228b22]">Medical Assessment</h4>
                    </div>
                    <p className="text-center text-gray-700 mb-4 text-sm md:text-base">
                      Complete your medical form to receive personalized treatment plan
                    </p>
                    <button
                      onClick={handleAssessmentClick}
                      className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white text-lg md:text-xl font-semibold py-3 md:py-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 2 - Submit the Medical Form
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>

                {/* Plan 2 - Advanced Diabetes Reversal Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#228b22]/10"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-[#228b22] to-[#1e7a1e] text-white p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <h3 className="text-2xl md:text-3xl font-bold">Advanced Diabetes Reversal Plan</h3>
                    </div>
                    <p className="text-lg md:text-xl text-white/90">
                      For diabetes under 10 years
                    </p>
                  </div>

                  {/* Features Section */}
                  <div className="p-6 md:p-8 bg-gradient-to-br from-[#228b22]/5 to-[#228b22]/10">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-[#228b22]" />
                      Comprehensive Treatment
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Microscope className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Advanced Diagnosis</p>
                          <p className="text-sm text-gray-600">Deep root cause analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <FileText className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Custom Protocol</p>
                          <p className="text-sm text-gray-600">Personalized treatment plan</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Stethoscope className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Expert Supervision</p>
                          <p className="text-sm text-gray-600">Regular doctor consultations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <Activity className="w-5 h-5 text-[#228b22] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Progress Tracking</p>
                          <p className="text-sm text-gray-600">Monitor improvements</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="p-6 md:p-8 bg-white">
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=Hrc9gAOPjYioEfEfn0m7SA%3D%3D")}
                      className="w-full bg-gradient-to-r from-[#228b22] to-[#1e7a1e] hover:from-[#1e7a1e] hover:to-[#1a6b1a] text-white text-xl md:text-2xl font-bold py-4 md:py-5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 1 - Pay the Treatment Fee
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Assessment Section */}
                  <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-6 md:p-8 border-t-2 border-dashed border-[#228b22]/30">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Activity className="w-6 h-6 text-[#228b22]" />
                      <h4 className="text-2xl md:text-3xl font-bold text-[#228b22]">Medical Assessment</h4>
                    </div>
                    <p className="text-center text-gray-700 mb-4 text-sm md:text-base">
                      Complete your medical form to receive personalized treatment plan
                    </p>
                    <button
                      onClick={handleAssessmentClick}
                      className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white text-lg md:text-xl font-semibold py-3 md:py-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 2 - Submit the Medical Form
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>

                {/* Plan 3 - Severe Diabetes Reversal Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#228b22]/10"
                >
                  {/* Warning Banner */}
                  <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white p-4 md:p-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <p className="text-lg md:text-xl font-semibold">For Severe Cases Only</p>
                  </div>

                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-[#228b22] to-[#1e7a1e] text-white p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <h3 className="text-2xl md:text-3xl font-bold">Severe Diabetes Reversal Plan</h3>
                    </div>
                    <p className="text-lg md:text-xl text-white/90">
                      For diabetics above 10+ years
                    </p>
                  </div>

                  {/* Features Section */}
                  <div className="p-6 md:p-8 bg-gradient-to-br from-[#228b22]/5 to-[#228b22]/10">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-[#228b22]" />
                      We Specialize In Customized Treatment For:
                    </h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <div className="w-2 h-2 bg-[#228b22] rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Type 1 Diabetes</p>
                          <p className="text-sm text-gray-600">SIDD, MOD, MARD variants</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <div className="w-2 h-2 bg-[#228b22] rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Type 1.5 Diabetes (LADA)</p>
                          <p className="text-sm text-gray-600">Latent Autoimmune Diabetes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                        <div className="w-2 h-2 bg-[#228b22] rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Long-Term Type 2</p>
                          <p className="text-sm text-gray-600">Above 10 years duration</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#228b22]/20 rounded-xl p-4">
                      <p className="text-sm md:text-base font-semibold text-gray-800 text-center">
                        <Shield className="w-4 h-4 inline mr-2 text-[#228b22]" />
                        Hyper-personalized protocols for complex cases
                      </p>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="p-6 md:p-8 bg-white">
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=63ChVqAv5sivdj%2BvL2t%2F4A%3D%3D")}
                      className="w-full bg-gradient-to-r from-[#228b22] to-[#1e7a1e] hover:from-[#1e7a1e] hover:to-[#1a6b1a] text-white text-xl md:text-2xl font-bold py-4 md:py-5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 1 - Pay the Treatment Fee
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Assessment Section */}
                  <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-6 md:p-8 border-t-2 border-dashed border-[#228b22]/30">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Activity className="w-6 h-6 text-[#228b22]" />
                      <h4 className="text-2xl md:text-3xl font-bold text-[#228b22]">Medical Assessment</h4>
                    </div>
                    <p className="text-center text-gray-700 mb-4 text-sm md:text-base">
                      Complete your medical form to receive personalized treatment plan
                    </p>
                    <button
                      onClick={handleAssessmentClick}
                      className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white text-lg md:text-xl font-semibold py-3 md:py-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] relative group"
                    >
                      Step 2 - Submit the Medical Form
                      <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>

                {/* Important Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#fff9e6] border-2 border-[#228b22] rounded-2xl p-6 md:p-8"
                >
                  <p className="text-center text-gray-800 text-base md:text-lg font-semibold mb-2">
                    📝 Note: Share Fee Screenshot & Gmail used in form with us 💚
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleWhatsAppClick}
                      className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp: +91 8218741693
                    </button>
                  </div>
                  <p className="text-center text-gray-600 text-sm md:text-base mt-4">
                    More details are in Below ⬇️
                  </p>
                </motion.div>
              </section>

              {/* Bonuses Section */}
              <section className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">🎁BONUS TODAY ONLY</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {bonuses.map((bonus, index) => (
                    <div
                      key={index}
                      className="bg-[#228b22]/10 rounded-xl p-6 border-2 border-[#228b22]/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-[#228b22] rounded-full p-3 flex-shrink-0">
                          <bonus.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">{bonus.title}</p>
                          <p className="text-[#228b22] font-bold text-lg">💰 Value: {bonus.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center bg-[#228b22]/10 rounded-xl p-6">
                  <p className="text-2xl font-bold text-gray-800 mb-2">🧮TOTAL REAL VALUE:</p>
                  <p className="text-3xl font-bold text-[#228b22]">Priceless💚🫂</p>
                </div>
              </section>
            </div>

            {/* Sidebar - Right 1/3 */}
            <div className="space-y-8">
              {/* Meet Our Experts */}
              <section className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h3>
                <div className="space-y-4">
                  {["Dr. Priya Sharma", "Dr. Arjun Patel", "Dr. Meera Singh"].map((name, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#228b22] flex items-center justify-center text-white font-bold">
                        {name.split(' ')[1][0]}
                      </div>
                      <p className="font-semibold text-gray-900">{name}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Workshops & Events */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4">Programs & Events</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="aspect-video bg-[#228b22] rounded-lg mb-3 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">90-Day Reversal Program</h4>
                    <Button
                      onClick={handleStartNow}
                      className="w-full bg-white text-gray-900 hover:bg-gray-100"
                      size="sm"
                    >
                      Register here
                    </Button>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="aspect-video bg-[#228b22] rounded-lg mb-3 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Advanced Diabetes Care</h4>
                    <Button
                      onClick={handleStartNow}
                      className="w-full bg-white text-gray-900 hover:bg-gray-100"
                      size="sm"
                    >
                      Register here
                    </Button>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h3>
                <div className="space-y-2">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-[#228b22] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pb-4 text-gray-600 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Orange Curve */}
      <section id="testimonials" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Patient Testimonials</h2>
            <p className="text-lg text-gray-600">
              See how our patients have reversed their diabetes and enhanced their well-being with our support and guidance.
            </p>
          </motion.div>

          {/* Testimonial Card */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Top Section - Image (2/3 of card) */}
                <div className="relative h-80 md:h-[500px] overflow-hidden">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ objectPosition: 'center top' }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='384'%3E%3Crect fill='%23374151' width='400' height='384'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='120' fill='white' font-weight='bold'%3E${testimonials[currentTestimonial].name[0]}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  {/* Dark Overlay only at bottom of image - smaller overlay to show more image */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 md:h-28 bg-gradient-to-t from-black/85 via-black/70 to-transparent pointer-events-none"></div>
                  
                  {/* Name and Location on Dark Overlay - refined positioning */}
                  <div className="absolute bottom-2 md:bottom-4 left-4 md:left-6 right-4 md:right-6 z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-0.5 drop-shadow-lg leading-tight">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-sm md:text-base text-white drop-shadow-md font-medium">
                      {testimonials[currentTestimonial].location || "UrCare Patient"}
                    </p>
                  </div>
                </div>

                {/* Bottom Section - Quote (1/3 of card) */}
                <div className="bg-white p-6 md:p-10 relative">
                  {/* Quotation Mark Icon - More visible */}
                  <div className="absolute top-4 md:top-5 left-4 md:left-6">
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12 text-gray-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Testimonial Quote - More visible text */}
                  <div className="pl-12 md:pl-16 pr-4">
                    <p className="text-base md:text-lg text-gray-900 leading-relaxed font-medium">
                      {testimonials[currentTestimonial].text}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentTestimonial
                      ? "w-3 h-3 bg-[#228b22]"
                      : "w-2 h-2 bg-gray-300 hover:bg-[#228b22]/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Green Curved Graphic */}
          <div className="relative mt-16">
            <div className="absolute inset-0 bg-[#228b22] rounded-t-full h-32 md:h-40 transform -translate-y-1/2"></div>
            <div className="relative pt-16 md:pt-20 text-center">
              <p className="text-white font-semibold text-lg md:text-xl px-4">
                See how our patients have transformed their lives through our program. Read their stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section with Purple Ribbon */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Improve Your Health, Reverse Diabetes, Find Peace
            </h2>
            <Button
              onClick={handleStartNow}
              className="bg-[#228b22] hover:bg-[#1e7a1e] text-white text-lg px-12 py-6 rounded-xl font-bold mb-8"
              size="lg"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Green Ribbon Overlay */}
          <div className="relative mt-12">
            <div className="absolute inset-0 bg-[#228b22]/90 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-[#228b22] rounded-3xl p-8 md:p-12 text-white">
              <p className="text-lg md:text-xl leading-relaxed">
                Our program is designed for individuals of all experience levels. We enhance your health, reverse diabetes, and promote deep healing, all with a focus on root cause treatment and personalized care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Newsletter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/brand.png" 
                  alt="UrCare Logo" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="w-full"
                />
                <Button className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#228b22]">90-Day Reversal</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Type 1 Treatment</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Type 2 Treatment</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Advanced Care</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Family Plans</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#228b22]">Our Purpose</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Our Team</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Success Stories</a></li>
                <li><a href="#" className="hover:text-[#228b22]">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-600">
                <li>India</li>
                <li>+91 8218741693</li>
                <li>support@urcare.com</li>
              </ul>
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#228b22]/10 transition-colors">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#228b22]/10 transition-colors">
                  <Instagram className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#228b22]/10 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#228b22]/10 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2024 UrCare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Medical Form Modal */}
      {showMedicalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Medical Form</h2>
              <button
                onClick={() => setShowMedicalForm(false)}
                className="text-2xl font-light text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleMedicalFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <Input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diabetes Type *
                </label>
                <select
                  required
                  value={formData.diabetesType}
                  onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228b22]"
                >
                  <option value="">Select diabetes type</option>
                  <option value="type1">Type 1</option>
                  <option value="type1.5">Type 1.5 (LADA)</option>
                  <option value="type2">Type 2</option>
                  <option value="prediabetes">Pre-diabetes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HbA1c Level
                </label>
                <Input
                  type="text"
                  value={formData.hba1c}
                  onChange={(e) => setFormData({ ...formData, hba1c: e.target.value })}
                  placeholder="Enter your HbA1c level (if known)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="List your current medications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228b22] min-h-[100px]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#228b22] hover:bg-[#1e7a1e] text-white"
                  size="lg"
                >
                  Submit Form
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMedicalForm(false)}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingDiabetes;
