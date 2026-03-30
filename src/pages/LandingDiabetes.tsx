import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
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
  ChevronLeft,
  ChevronRight,
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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" role="img" aria-label="WhatsApp" {...props}>
    <path
      fill="currentColor"
      d="M19.11 17.52c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.19-.56.06-.26-.13-1.09-.4-2.08-1.28-.77-.68-1.29-1.52-1.44-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.9-.21-.5-.42-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.14 0 1.26.92 2.48 1.05 2.65.13.17 1.81 2.77 4.39 3.88.61.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.53-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3Zm-3.07 11.08h-.01a12.9 12.9 0 0 1-6.55-1.79l-.47-.28-4.86 1.27 1.3-4.73-.31-.49a12.86 12.86 0 0 1-1.97-6.82C3.18 8.74 8.56 3.4 15.92 3.4c3.57 0 6.92 1.39 9.45 3.92a12.46 12.46 0 0 1 3.9 9.09c0 7.11-5.79 12.19-13.23 12.19ZM15.92 5.47c-6.22 0-11.29 5.02-11.29 11.19 0 2.33.73 4.6 2.12 6.48l.36.49-.77 2.8 2.88-.75.47.28a11.02 11.02 0 0 0 6.34 1.99h.01c6.31 0 11.4-4.34 11.4-10.12 0-2.98-1.17-5.78-3.29-7.89a11.2 11.2 0 0 0-7.93-3.47Z"
    />
  </svg>
);

const LandingDiabetes = () => {
  const navigate = useNavigate();
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [expandedPlans, setExpandedPlans] = useState<{ [key: number]: boolean }>({});
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    diabetesType: "",
    hba1c: "",
    medications: "",
    age: "",
  });


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
      question: "How early should I start the treatment plan?",
      answer: "The sooner you start, the better. Our treatment plan begins working from Day 1, with visible improvements within the first week.",
    },
    {
      question: "What if I have complications or other health conditions?",
      answer: "We specialize in treating the toughest cases. Our expert doctors provide supervision and create custom protocols that address all your health concerns.",
    },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.aisensy.com/aabax0", "_blank");
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

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const togglePlan = (planIndex: number) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planIndex]: !prev[planIndex]
    }));
  };

  const handleBuyNow = () => {
    setShowAddressForm(true);
  };

  const handleAddressFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store address data (you might want to send this to your backend)
    console.log("Address data:", addressFormData);
    // Redirect to payment link
    window.open("https://razorpay.me/@urcare?amount=beO3wAvj51SVNWf3KhDSQw%3D%3D", "_blank");
    setShowAddressForm(false);
    // Reset form
    setAddressFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-[#228b22]/20">
      {/* Header - Modern Translucent Design */}
      <header className="z-50 pt-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Translucent Rounded Header Bar */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-full border border-white/30 shadow-xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Company Name */}
              <div className="flex items-center gap-3">
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
                <span className="text-lg md:text-xl font-bold text-gray-900">UrCare ~ True Healthcare</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => navigate("/about-us")}
                  className="text-gray-700 hover:text-[#228b22] transition-colors font-medium"
                >
                  About Us
                </button>
                <a href="https://drive.google.com/file/d/1HKgNkKOSCN4aDwKgBHoNpstTuucTtsLC/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#228b22] transition-colors font-medium">Testimonials</a>
                <a href="#roadmap" className="text-gray-700 hover:text-[#228b22] transition-colors font-medium">Treatment Plan</a>
                <a href="#pricing" className="text-gray-700 hover:text-[#228b22] transition-colors font-medium">Pricing</a>
              </nav>

              {/* Mobile Menu Button */}
          <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-[#228b22] transition-colors"
          >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

          {/* Mobile Menu - Translucent Design */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-6"
            >
              <nav className="flex flex-col gap-4">
                <button
                  type="button"
                  className="text-left text-gray-700 hover:text-[#228b22] font-medium transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/about-us");
                  }}
                >
                  About Us
                </button>
                <a href="https://drive.google.com/file/d/1HKgNkKOSCN4aDwKgBHoNpstTuucTtsLC/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#228b22] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                <a href="#roadmap" className="text-gray-700 hover:text-[#228b22] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Treatment Plan</a>
                <a href="#pricing" className="text-gray-700 hover:text-[#228b22] font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="text-center md:text-left">
        <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Reverse Your Diabetes With any other Conditions, and Start living freely in 90 days
                </motion.h1>
                <motion.div 
                  className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p className="mb-2">If you follow the Treatment and</p>
                  <p className="mb-2">don't improve → you get 200% back.</p>
                  <p className="mb-2">Everything is done FOR the patient.</p>
                  <p>You don't think ~ You just follow.</p>
                </motion.div>
                
              </motion.div>
          </div>
            
            {/* Right Side - Plan Cards Above Image */}
            <div className="space-y-6">
              <p className="text-center text-gray-700 font-semibold">
                Pricing: Select your offer in this treatment plan
              </p>
              {/* Plans Slider - Dark Card Style */}
              <div className="relative">
                {/* Slider Container */}
                <div className="relative overflow-hidden rounded-3xl">
                  <AnimatePresence mode="wait">
                    {[0, 1, 2].map((planIndex) => {
                      if (planIndex !== currentPlanIndex) return null;
                      
                      const plans = [
                        {
                          id: 2,
                          title: "UrCare Type 2 Diabetes Reversal Kit",
                          description: "Normalise your HbA1c levels. Reduce medicines. Move toward true reversal.",
                          features: [
                            "Complete 3-Phase Reversal Treatment Plan (step-by-step)",
                            "2 treatment plans included",
                            "PancreReViV + GlucoLow FREE (1st month)",
                            "Unlimited diabetes-friendly meal list",
                            "Weekly + monthly modifications",
                            "20% off coupon",
                            "Lifetime access + on-request updates and add-ons",
                            "Price: ₹19,000 -> ₹10,500 (one-time)"
                          ],
                          paymentLink: "https://razorpay.me/@urcare",
                          warning: "Kit 1",
                          slotsLeft: "Limited slots per batch"
                        },
                        {
                          id: 3,
                          title: "UrCare Type 1 / 1.5 Remission/Reversal Kit",
                          description: "Protect and regenerate beta cells. Reduce insulin dependency. Delay progression.",
                          features: [
                            "Full 3-6 phase delayed remission treatment plan",
                            "2 plans included for autoimmune patients",
                            "All 3 medicines FREE (PancreReViV + GlucoLow + BetaReviv)",
                            "Special meals designed for insulin users",
                            "Weekly + monthly modifications",
                            "20% discount coupon",
                            "Upgrade anytime to personalised treatment",
                            "On-request updates and add-ons",
                            "Price: ₹25,000 -> ₹10,500"
                          ],
                          paymentLink: "https://razorpay.me/@urcare",
                          warning: "Kit 2",
                          slotsLeft: "Price increases next batch"
                        },
                        {
                          id: 4,
                          title: "UrCare Complete Personalised Reversal Treatment With Any Other Conditions ( Type 1 / 1.5 / 2 )",
                          description: "Fully customised treatment for diabetes plus any other conditions.",
                          features: [
                            "Root cause diagnosis",
                            "Fully hyper-personalised treatment plan",
                            "All 3 medicines customised to your body",
                            "Nutrition fulfilment",
                            "Weekly modifications + monthly deep reviews",
                            "4 months treatment (3 + 1 free)",
                            "Extra plan for other conditions if needed",
                            "Lifetime access to treatment files",
                            "Recommended updates and add-ons",
                            "1 month FREE medication + treatment support"
                          ],
                          warning: "MOST POPULAR",
                          slotsLeft: "Doctor-guided: limited onboarding per month"
                        }
                      ];
                      
                      const plan = plans[planIndex];
                      
                      return (
                        <motion.div
                          key={planIndex}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="bg-gradient-to-br from-[#1a5a1a] via-[#228b22] to-[#1a3d1a] rounded-3xl shadow-2xl overflow-hidden"
                        >
                          {/* Slots Left Banner - Animated */}
                          {plan.slotsLeft && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="bg-yellow-500 text-black p-3 text-center font-bold text-lg md:text-xl"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center justify-center gap-2"
                              >
                                <AlertCircle className="w-5 h-5" />
                                <p>{plan.slotsLeft}</p>
                              </motion.div>
                            </motion.div>
                          )}
                          
                          {/* Warning Banner for Plan 3 */}
                          {plan.warning && (
                            <div className="bg-red-600 text-white p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <p className="font-bold text-sm">{plan.warning}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="p-6 md:p-8">
                            {/* Title */}
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                              {plan.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-white/80 mb-6 text-base">
                              {plan.description}
                            </p>
                            
                            {/* Features List */}
                            <div className="space-y-3 mb-6">
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-[#228b22] border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-white text-base">{feature}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-white/90 text-xs md:text-sm mb-2">
                              Patient testimonial:{" "}
                              <a
                                href="https://drive.google.com/file/d/1HKgNkKOSCN4aDwKgBHoNpstTuucTtsLC/view?usp=drivesdk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                View now
                              </a>
                            </p>
                            <p className="text-white/90 text-xs md:text-sm mb-6">
                              Share Screenshot in the Under the offers.
                            </p>
                            
                            {/* CTA Button */}
                            <button
                              onClick={() => {
                                togglePlan(plan.id);
                              }}
                              className="w-full bg-white/10 border-2 border-[#228b22] text-white hover:bg-white/20 font-bold py-3 rounded-xl transition-all duration-300 uppercase tracking-wide text-sm"
                            >
                              Get Started
                            </button>
                          </div>
                          
                          {/* Collapsible Details */}
                          <AnimatePresence>
                            {expandedPlans[plan.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden bg-black/20"
                              >
                                <div className="p-6 space-y-4">
                                  {plan.id !== 4 ? (
                                    <>
                                      {/* Payment Section */}
                                      <div>
                                        <button
                                          onClick={() => handlePaymentClick(plan.paymentLink)}
                                          className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] text-sm"
                                        >
                                          Step 1 - Pay the Treatment Fee
                                        </button>
                                      </div>
                                      
                                      {/* Assessment Section */}
                                      <div className="bg-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                          <Activity className="w-5 h-5 text-white" />
                                          <h4 className="text-lg md:text-xl font-bold text-white">Medical Assessment</h4>
                                        </div>
                                        <p className="text-center text-white/90 mb-3 text-xs md:text-sm">
                                          Complete your medical form to receive personalized treatment plan
                                        </p>
                                        <button
                                          onClick={handleAssessmentClick}
                                          className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-semibold py-2 rounded-xl transition-all transform hover:scale-[1.02] text-sm"
                                        >
                                          Step 2 - Submit the Medical Form
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="bg-white/10 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <Shield className="w-5 h-5 text-white" />
                                          <h4 className="text-lg md:text-xl font-bold text-white text-center">
                                            Hyper-Personalised Reversal Treatment
                                          </h4>
                                        </div>
                                        <p className="text-center text-white/90 text-xs md:text-sm">
                                          If reports don't improve, support continues free. If the plan does not fit, we rebuild it free.
                                        </p>
                                      </div>
                                      <div className="space-y-3">
                                        <button
                                          onClick={handleAssessmentClick}
                                          className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] text-sm"
                                        >
                                          ✅ Check Eligibility & Apply (Assessment Form)
                                        </button>
                                        <button
                                          onClick={handleWhatsAppClick}
                                          className="w-full bg-[#25D366] text-white hover:bg-[#20BA5A] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] text-sm"
                                        >
                                          Start Your Free Diabetes Assessment
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Slider Navigation */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={() => setCurrentPlanIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                    className="w-10 h-10 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                    aria-label="Previous treatment"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Slider Dots */}
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPlanIndex(index)}
                        className={`transition-all rounded-full ${
                          currentPlanIndex === index
                            ? "w-3 h-3 bg-[#228b22]"
                            : "w-2 h-2 bg-gray-300 hover:bg-[#228b22]/50"
                        }`}
                        aria-label={`Go to treatment ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPlanIndex((prev) => (prev === 2 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                    aria-label="Next treatment"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* WhatsApp Section - Right after plan cards end */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#fff9e6] border-2 border-[#228b22] rounded-2xl p-6 md:p-8"
              >
                <p className="text-center text-gray-800 text-base md:text-lg font-semibold mb-4">
                  Start Your Free Diabetes Assessment 💚
                </p>
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    WhatsApp: +91 63973 07025
                  </button>
                </div>
              </motion.div>
              
              {/* Image Below Plan Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <img 
                  src="/IMG_8141.JPG" 
                  alt="UrCare Diabetes Treatment" 
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Image failed to load:', e.currentTarget.src);
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 90-Day Roadmap Section */}
      <section id="roadmap" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Second Image - Below 90-Day Reversal Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-xl mb-12 max-w-3xl mx-auto"
          >
            <img 
              src="/IMG_9404.JPG" 
              alt="Diabetes Treatment" 
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', e.currentTarget.src);
              }}
            />
          </motion.div>
          
          {/* Third Image - Below Second Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-xl mb-12 max-w-3xl mx-auto"
          >
            <img 
              src="/IMG_9696.JPG" 
              alt="Diabetes Treatment" 
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', e.currentTarget.src);
              }}
            />
          </motion.div>
          
          {/* Products Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          </motion.div>

          {/* Products Slider */}
          <div className="relative max-w-4xl mx-auto mb-8">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                {[0, 1].map((productIndex) => {
                  if (productIndex !== currentProductIndex) return null;
                  
                  const products = [
                    {
                      id: 1,
                      name: "PancreReViv",
                      tagline: "The Beta-Cell Builder",
                      image: "/Pancrereviv.JPG",
                      price: "₹3,000",
                      features: [
                        'The "Sugar Destroyer" Molecule (Gymnemic Acids)',
                        "Beta-Cell Regeneration (Islet Repair)",
                        "Silent Inflammation Shield"
                      ]
                    },
                    {
                      id: 2,
                      name: "GlucoLow",
                      tagline: "Nature's Metformin",
                      image: "/Glucolow.JPG",
                      price: "₹3,000",
                      features: [
                        "AMPK Activation (Metabolism Switch)",
                        "2x Insulin Sensitivity",
                        'The "Carb-Blocker" Effect'
                      ]
                    }
                  ];
                  
                  const product = products[productIndex];
                  
                  return (
                    <motion.div
                      key={productIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#228b22]"
                    >
                      <div className="p-6 md:p-8">
                        {/* Product Image */}
                        <div className="relative rounded-2xl overflow-hidden mb-6">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-64 md:h-80 object-contain bg-gray-50"
                            loading="lazy"
                            onError={(e) => {
                              console.error('Product image failed to load:', e.currentTarget.src);
                            }}
                          />
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                          {product.name}
                        </h3>
                        
                        {/* Tagline */}
                        <p className="text-lg md:text-xl text-[#228b22] font-semibold mb-6 text-center">
                          {product.tagline}
                        </p>
                        
                        {/* Price removed as requested */}
                        
                        {/* Features List */}
                        <div className="space-y-4 mb-6">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-700 text-base md:text-lg">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Buy Now Button */}
                        <button
                          onClick={handleBuyNow}
                          className="w-full bg-[#228b22] text-white hover:bg-[#1e7a1e] font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] text-lg"
                        >
                          Buy Now
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Slider Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentProductIndex((prev) => (prev === 0 ? 1 : 0))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProductIndex(index)}
                    className={`transition-all rounded-full ${
                      currentProductIndex === index
                        ? "w-3 h-3 bg-[#228b22]"
                        : "w-2 h-2 bg-gray-300 hover:bg-[#228b22]/50"
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentProductIndex((prev) => (prev === 1 ? 0 : 1))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Next product"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <motion.div 
          className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Result You Can Expect</h2>
          </motion.div>
          
          {/* Type 1 Success Stories Slider */}
          <div className="relative max-w-4xl mx-auto">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                {[0, 1, 2].map((storyIndex) => {
                  if (storyIndex !== currentStoryIndex) return null;
                  
                  const stories = [
                    {
                      title: "Type 1",
                      items: [
                        {
                          storyTitle: "6-Year Full Remission Story",
                          description: "A 33-year-old man lived completely insulin-free for six straight years."
                        },
                        {
                          storyTitle: "5+ Year Freedom Story",
                          description: "A 24-year-old stayed in full remission for more than five years with stable sugars."
                        },
                        {
                          storyTitle: "Years of Stability Story",
                          description: "A 68-year-old woman maintained long-term remission for several steady years."
                        },
                        {
                          storyTitle: "950-Day Childhood Remission Story",
                          description: "A child stayed off insulin for 950 days with smooth, stable readings."
                        }
                      ]
                    },
                    {
                      title: "UrCare Team",
                      items: [
                        {
                          storyTitle: "Dr. V.K. Verma (M.B.B.S., C.C.E.B.D.M.)",
                          description: "Senior Diabetologist."
                        },
                        {
                          storyTitle: "Vaidya Narendra Saini (B.A.M.S.)",
                          description: "Ayurvedic Physician (26+ years of practice)."
                        },
                        {
                          storyTitle: "Dr. Aakarshakk (B.A.M.S., CEO)",
                          description: "Endocrine-Focused Practice."
                        },
                        {
                          storyTitle: "Dt. Sejal",
                          description: "Diabetic Nutritionist & CMO."
                        },
                        {
                          storyTitle: "Mrs. Archana Arya",
                          description: "Yogacharya (Therapeutic Exercise Specialist)."
                        },
                        {
                          storyTitle: "Continuous Medical Supervision",
                          description: "Dr. Aakarshakk (BAMS, CEO) personally oversees every case, with continuous support from our medical professionals and protocol team throughout your treatment journey."
                        },
                        {
                          storyTitle: "Our Commitment",
                          description: "We are committed to guiding you with clarity, precision, and consistent medical supervision every step of the way toward healing."
                        },
                        {
                          storyTitle: "Start Now on WhatsApp",
                          description: "Feel free to connect and start your reversal journey now on WhatsApp: https://wa.aisensy.com/aaba7s"
                        }
                      ]
                    },
                    {
                      title: "Type 2",
                      items: [
                        {
                          storyTitle: "7-Day Reversal:",
                          description: "PMC3593165 (Counterpoint Study, N=11 participants, peer-reviewed)"
                        },
                        {
                          storyTitle: "8-Week Beta-Cell Restoration:",
                          description: "PMC3593165 (Same study, gold-standard testing)"
                        },
                        {
                          storyTitle: "3-Month Complete Remission:",
                          description: "PMC9480679 (Individual case, HbA1c 14.9%→5.1%)"
                        },
                        {
                          storyTitle: "Large Trial Validation:",
                          description: "DiRECT Study (N=306, 46% remission at 1 year)"
                        },
                        {
                          storyTitle: "Long-Term Proof:",
                          description: "5-year DiRECT follow-up published 2024"
                        }
                      ]
                    }
                  ];
                  
                  const storyCard = stories[storyIndex];
                  
                  return (
                    <motion.div
                      key={storyIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-8 md:p-10">
                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                          {storyCard.title}
                        </h3>
                        
                        {/* Stories List */}
                        <div className="space-y-6">
                          {storyCard.items.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <div className="w-6 h-6 rounded-full bg-[#228b22] flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
                              <div className="flex-1">
                                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                  {item.storyTitle}
                                </h4>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
        </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Slider Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentStoryIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoryIndex(index)}
                    className={`transition-all rounded-full ${
                      currentStoryIndex === index
                        ? "w-3 h-3 bg-[#228b22]"
                        : "w-2 h-2 bg-gray-300 hover:bg-[#228b22]/50"
                    }`}
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentStoryIndex((prev) => (prev === 2 ? 0 : prev + 1))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Next story"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Third Image Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-5xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img 
              src="/IMG_9439.JPG" 
              alt="Health Transformation" 
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', e.currentTarget.src);
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Important Note Section */}
      <section id="pricing" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-5xl mx-auto">
          {/* Plans Slider - Moved to Hero Section */}
          <div className="relative hidden">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                {[0, 1].map((planIndex) => {
                  if (planIndex !== currentPlanIndex) return null;
                  
                  const plans = [
                    {
                      id: 2,
                      title: "Advanced Diabetes Reversal Plan",
                      description: "For diabetes under 10 years",
                      price: "₹5,000",
                      features: [
                        "Advanced Diagnosis",
                        "Custom Protocol",
                        "Expert Supervision",
                        "Progress Tracking",
                        "Unlimited revision & request"
                      ],
                      paymentLink: "https://razorpay.me/@urcare?amount=Hrc9gAOPjYioEfEfn0m7SA%3D%3D"
                    },
                    {
                      id: 3,
                      title: "Severe Diabetes Reversal Plan",
                      description: "For diabetics above 10+ years",
                      price: "₹10,000",
                      features: [
                        "Type 1 Diabetes (SIDD, MOD, MARD)",
                        "Type 1.5 Diabetes (LADA)",
                        "Long-Term Type 2",
                        "Hyper-personalized protocols",
                        "Unlimited revision & request"
                      ],
                      paymentLink: "https://razorpay.me/@urcare?amount=63ChVqAv5sivdj%2BvL2t%2F4A%3D%3D",
                      warning: "For Severe Cases Only"
                    }
                  ];
                  
                  const plan = plans[planIndex];
                  
                  return (
                    <motion.div
                      key={planIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-[#1a5a1a] via-[#228b22] to-[#1a3d1a] rounded-3xl shadow-2xl overflow-hidden"
                    >
                      {/* Warning Banner for Plan 3 */}
                      {plan.warning && (
                        <div className="bg-red-600 text-white p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <p className="font-bold text-sm">{plan.warning}</p>
                </div>
                        </div>
                      )}
                      
                      <div className="p-8 md:p-10">
                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          {plan.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-white/80 mb-8 text-lg">
                          {plan.description}
                        </p>
                        
                        {/* Price */}
                        <div className="mb-8">
                          <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                            {plan.price}
                          </div>
                          <p className="text-white/70 text-base">
                            Per user / billed monthly
                          </p>
                        </div>
                        
                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded-full bg-[#228b22] border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white text-lg">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA Button */}
                        <button
                          onClick={() => {
                            togglePlan(plan.id);
                          }}
                          className="w-full bg-white/10 border-2 border-[#228b22] text-white hover:bg-white/20 font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-wide"
                        >
                          Get Started
                        </button>
                      </div>
                      
                      {/* Collapsible Details */}
                      <AnimatePresence>
                        {expandedPlans[plan.id] && (
            <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-black/20"
                          >
                            <div className="p-8 space-y-6">
                              {/* Payment Section */}
                <div>
                                <button
                                  onClick={() => handlePaymentClick(plan.paymentLink)}
                                  className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02]"
                                >
                                  Step 1 - Pay the Treatment Fee
                                </button>
                              </div>
                              
                              {/* Assessment Section */}
                              <div className="bg-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                  <Activity className="w-6 h-6 text-white" />
                                  <h4 className="text-xl md:text-2xl font-bold text-white">Medical Assessment</h4>
                                </div>
                                <p className="text-center text-white/90 mb-4 text-sm md:text-base">
                                  Complete your medical form to receive personalized treatment plan
                                </p>
                                <button
                                  onClick={handleAssessmentClick}
                                  className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                                >
                                  Step 2 - Submit the Medical Form
                                </button>
                </div>
              </div>
            </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Slider Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPlanIndex((prev) => (prev === 0 ? 1 : prev - 1))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Previous plan"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {[0, 1].map((index) => (
                  <button
              key={index}
                    onClick={() => setCurrentPlanIndex(index)}
                    className={`transition-all rounded-full ${
                      currentPlanIndex === index
                        ? "w-3 h-3 bg-[#228b22]"
                        : "w-2 h-2 bg-gray-300 hover:bg-[#228b22]/50"
                    }`}
                    aria-label={`Go to plan ${index + 1}`}
                  />
          ))}
        </div>

              <button
                onClick={() => setCurrentPlanIndex((prev) => (prev === 1 ? 0 : prev + 1))}
                className="w-12 h-12 rounded-full bg-[#228b22] hover:bg-[#1e7a1e] text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                aria-label="Next plan"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
                </div>
          </div>
          
          {/* Old Plans List - Removed, using slider above */}
          <div className="hidden">
          <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-[#228b22] rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  <div className="p-6 md:p-8">
                    {/* Title with Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">Easy Reversal Activation Plan</h3>
                      <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                        <span className="text-xs font-bold text-yellow-900">30% off</span>
            </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-white/90 mb-6 text-base md:text-lg">
                      For Type 2 diabetes under 5 years (easy/moderate cases)
                    </p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                        ₹15,999
          </div>
                      <p className="text-white/80 text-sm md:text-base">
                        Per user / billed monthly
                      </p>
                    </div>
                    
                    {/* Features List */}
                    <motion.div 
                      className="space-y-3 mb-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {[
                        "Root Cause Diagnosis",
                        "Hyper-Personalised Protocol",
                        "Custom Traditional Medication",
                        "Doctor's Supervision",
                        "Unlimited revision & request",
                        "Pause & Cancel anytime"
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3"
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { 
                              opacity: 1, 
                              x: 0,
                              transition: { duration: 0.4 }
                            }
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                          <span className="text-white">{feature}</span>
                        </motion.div>
                      ))}
          </motion.div>

                    {/* Expand Button */}
                    <button
                      onClick={() => togglePlan(1)}
                      className="w-full mb-4 flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      {expandedPlans[1] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* CTA Button */}
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=%2Bof50LC3jfrWvfxkua9IsQ%3D%3D")}
                      className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Get Started
                    </button>
                  </div>

                  {/* Collapsible Details */}
                  <AnimatePresence>
                    {expandedPlans[1] && (
          <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white/10"
                      >
                        <div className="p-6 md:p-8 space-y-6">
                          {/* Additional Details */}
                          <div className="bg-white/20 rounded-xl p-4 text-center">
                            <p className="text-sm md:text-base font-semibold text-white">
                              <Clock className="w-4 h-4 inline mr-2" />
                              Patience 2-4 weeks minimum for visible results
                            </p>
            </div>
                          
                          {/* Enrollment Notice */}
                          <div className="bg-white/20 rounded-xl p-4 text-center">
                            <p className="text-sm md:text-base font-semibold text-white">
                              Only 14 enrolments maximum accepted per week to maintain medical quality
                            </p>
                          </div>
                          
                          {/* Assessment Section */}
                          <div className="bg-white/20 rounded-xl p-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <Activity className="w-6 h-6 text-white" />
                              <h4 className="text-xl md:text-2xl font-bold text-white">Medical Assessment</h4>
                </div>
                            <p className="text-center text-white/90 mb-4 text-sm md:text-base">
                              Complete your medical form to receive personalized treatment plan
                            </p>
                            <button
                              onClick={handleAssessmentClick}
                              className="w-full bg-white text-[#228b22] hover:bg-gray-100 font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                              Step 2 - Submit the Medical Form
                            </button>
                </div>
              </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
          </motion.div>

                {/* Plan 2 - Advanced Diabetes Reversal Plan (White Background) */}
          <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 md:p-8">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Advanced Diabetes Reversal Plan
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-base md:text-lg">
                      For diabetes under 10 years
                    </p>
                    
                    {/* Let's Talk Section */}
                    <div className="mb-6">
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Let's Talk
            </div>
                      <p className="text-gray-500 text-sm md:text-base">
                        Contact us for details
                      </p>
                    </div>
                    
                    {/* Features List */}
                    <motion.div 
                      className="space-y-3 mb-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {[
                        "Advanced Diagnosis",
                        "Custom Protocol",
                        "Expert Supervision",
                        "Progress Tracking",
                        "Unlimited revision & request"
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3"
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { 
                              opacity: 1, 
                              x: 0,
                              transition: { duration: 0.4 }
                            }
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#228b22] flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
          </motion.div>
          ))}
                    </motion.div>
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => togglePlan(2)}
                      className="w-full mb-4 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      {expandedPlans[2] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* CTA Button */}
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=Hrc9gAOPjYioEfEfn0m7SA%3D%3D")}
                      className="w-full bg-[#228b22] text-white hover:bg-[#1e7a1e] font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Contact Sales
                    </button>
        </div>

                  {/* Collapsible Details */}
                  <AnimatePresence>
                    {expandedPlans[2] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="p-6 md:p-8 space-y-6">
                          {/* Payment Section */}
                <div>
                            <button
                              onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=Hrc9gAOPjYioEfEfn0m7SA%3D%3D")}
                              className="w-full bg-[#228b22] text-white hover:bg-[#1e7a1e] font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                              Step 1 - Pay the Treatment Fee
                            </button>
        </div>

                          {/* Assessment Section */}
                          <div className="bg-[#e8f5e9] rounded-xl p-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <Activity className="w-6 h-6 text-[#228b22]" />
                              <h4 className="text-xl md:text-2xl font-bold text-[#228b22]">Medical Assessment</h4>
                            </div>
                            <p className="text-center text-gray-700 mb-4 text-sm md:text-base">
                              Complete your medical form to receive personalized treatment plan
                            </p>
                            <button
                              onClick={handleAssessmentClick}
                              className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                              Step 2 - Submit the Medical Form
                            </button>
                </div>
              </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Plan 3 - Severe Diabetes Reversal Plan (White Background) */}
          <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Warning Banner */}
                  <div className="bg-red-600 text-white p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-bold text-sm md:text-base">For Severe Cases Only</p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Severe Diabetes Reversal Plan
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-base md:text-lg">
                      For diabetics above 10+ years
                    </p>
                    
                    {/* Let's Talk Section */}
                    <div className="mb-6">
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Let's Talk
            </div>
                      <p className="text-gray-500 text-sm md:text-base">
                        Contact us for details
                      </p>
                    </div>
                    
                    {/* Features List */}
                    <motion.div 
                      className="space-y-3 mb-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {[
                        "Type 1 Diabetes (SIDD, MOD, MARD)",
                        "Type 1.5 Diabetes (LADA)",
                        "Long-Term Type 2",
                        "Hyper-personalized protocols",
                        "Unlimited revision & request"
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3"
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { 
                              opacity: 1, 
                              x: 0,
                              transition: { duration: 0.4 }
                            }
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#228b22] flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
          </motion.div>

                    {/* Expand Button */}
                    <button
                      onClick={() => togglePlan(3)}
                      className="w-full mb-4 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      {expandedPlans[3] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* CTA Button */}
                    <button
                      onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=63ChVqAv5sivdj%2BvL2t%2F4A%3D%3D")}
                      className="w-full bg-[#228b22] text-white hover:bg-[#1e7a1e] font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Contact Sales
                    </button>
        </div>

                  {/* Collapsible Details */}
                  <AnimatePresence>
                    {expandedPlans[3] && (
          <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50"
          >
                        <div className="p-6 md:p-8 space-y-6">
                          {/* Additional Info */}
                          <div className="bg-[#228b22]/10 rounded-xl p-4 text-center">
                            <p className="text-sm md:text-base font-semibold text-gray-800">
                              <Shield className="w-4 h-4 inline mr-2 text-[#228b22]" />
                              Hyper-personalized protocols for complex cases
                            </p>
            </div>
                          
                          {/* Payment Section */}
                          <div>
                            <button
                              onClick={() => handlePaymentClick("https://razorpay.me/@urcare?amount=63ChVqAv5sivdj%2BvL2t%2F4A%3D%3D")}
                              className="w-full bg-[#228b22] text-white hover:bg-[#1e7a1e] font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                              Step 1 - Pay the Treatment Fee
                            </button>
                          </div>
                          
                          {/* Assessment Section */}
                          <div className="bg-[#e8f5e9] rounded-xl p-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <Activity className="w-6 h-6 text-[#228b22]" />
                              <h4 className="text-xl md:text-2xl font-bold text-[#228b22]">Medical Assessment</h4>
            </div>
                            <p className="text-center text-gray-700 mb-4 text-sm md:text-base">
                              Complete your medical form to receive personalized treatment plan
                            </p>
                            <button
                              onClick={handleAssessmentClick}
                              className="w-full bg-[#228b22] hover:bg-[#1e7a1e] text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                              Step 2 - Submit the Medical Form
                            </button>
                          </div>
                        </div>
          </motion.div>
                    )}
                  </AnimatePresence>
          </motion.div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center bg-white rounded-2xl shadow-xl p-8 md:p-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Patient Testimonials
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              View real patient testimonial document here.
            </p>
            <a
              href="https://drive.google.com/file/d/1HKgNkKOSCN4aDwKgBHoNpstTuucTtsLC/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#228b22] text-white hover:bg-[#1e7a1e] text-base px-8 py-3 rounded-xl font-bold transition-all"
            >
              Open Testimonial PDF
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#228b22]">
        <div className="max-w-4xl mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Choose a treatment plan above and begin your path to diabetes reversal today
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
            <Button
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-[#228b22] hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-bold transition-all"
                size="lg"
            >
                View Plans
            </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Newsletter */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/brand.png" 
                  alt="UrCare Logo" 
                  className="h-14 md:h-16 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xl md:text-2xl font-bold text-gray-900">UrCare ~ True Healthcare</span>
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

            {/* Treatment Plans */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Treatment Plans</h4>
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
                <li>+91 63973 07025</li>
                <li>urcarein@gmail.com</li>
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
                  <WhatsAppIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2024 UrCare. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-2 opacity-60">Refund Policy: No refunds available for incorrect plan enrollment. Please ensure you select the appropriate treatment plan before payment.</p>
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

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-2xl font-light text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddressFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  type="text"
                  required
                  value={addressFormData.name}
                  onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
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
                  value={addressFormData.email}
                  onChange={(e) => setAddressFormData({ ...addressFormData, email: e.target.value })}
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
                  value={addressFormData.phone}
                  onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complete Address *
                </label>
                <textarea
                  required
                  value={addressFormData.address}
                  onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })}
                  placeholder="Enter your complete address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228b22] min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <Input
                    type="text"
                    required
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <Input
                  type="text"
                  required
                  value={addressFormData.pincode}
                  onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#228b22] hover:bg-[#1e7a1e] text-white"
                  size="lg"
                >
                  Proceed to Payment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddressForm(false)}
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
