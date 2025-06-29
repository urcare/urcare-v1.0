import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Shield, Users, Zap, Clock } from 'lucide-react';

const Landing = ({ showModal = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Background images data with descriptions for different themes
  const backgroundImages = [
    {
      desktop: "/landing/health-app-desktop-1.jpg",
      mobile: "/landing/health-app-mobile-1.jpg",
      alt: 'People checking health app with smiles',
      tagline: 'Smart health tracking made simple'
    },
    {
      desktop: "/landing/health-app-desktop-2.jpg",
      mobile: "/landing/health-app-mobile-2.jpg",
      alt: 'Happy person cycling outdoors',
      tagline: 'Your fitness journey, powered by AI'
    },
    {
      desktop: "/landing/health-app-desktop-3.jpg",
      mobile: "/landing/health-app-mobile-3.jpg",
      alt: 'Family cooking healthy meal together',
      tagline: 'Nutrition guidance for the whole family'
    },
    {
      desktop: "/landing/health-app-desktop-4.jpg",
      mobile: "/landing/health-app-mobile-4.jpg",
      alt: 'Person meditating peacefully',
      tagline: 'Mental wellness at your fingertips'
    },
    {
      desktop: "/landing/health-app-desktop-5.jpg",
      mobile: "/landing/health-app-mobile-5.jpg",
      alt: 'Group doing yoga together',
      tagline: 'Community-driven health experiences'
    },
    {
      desktop: "/landing/health-app-desktop-6.jpg",
      mobile: "/landing/health-app-mobile-6.jpg",
      alt: 'Person celebrating health milestone',
      tagline: 'Celebrate every step of your journey'
    }
  ];

  // Auto-shuffle images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const currentImage = backgroundImages[currentImageIndex];
  // const closeModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-transparent">
        {/* Background Image with Cross-dissolve Animation */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 75 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Desktop Image */}
            <div
              className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${currentImage.desktop}')` }}
            />

            {/* Mobile Image */}
            <div
              className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${currentImage.mobile}')` }}
            />

            {/* Enhanced Gradient Overlay for Better Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
          </motion.div>
        </AnimatePresence>

        {/* Main Content Container */}
        <div className="relative z-10 h-full flex items-end md:items-center py-4 justify-center md:justify-end px-4 md:px-12 lg:px-16">

          {/* Content Card - Centered on mobile, Right half on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl"
          >

            {/* Glass Container */}
            <div className="relative backdrop-blur-sm md:backdrop-blur-md bg-black/15 md:bg-white/10 border border-white/25 rounded-3xl p-4 md:p-10 lg:p-12 shadow-2xl">

              {/* Subtle Inner Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-black/5 pointer-events-none" />

              {/* Logo Section */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-4 md:mb-8 text-center md:text-left"
              >
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <div className="flex items-center justify-center bg-gradient-to-br from-black/15 to-black/15 backdrop-blur-md px-3 py-2 rounded-3xl border border-teal-500/50 shadow-lg">
                    <div className="size-16 rounded-full flex items-center justify-center mr-2">
                      <img src="/brand.png" alt="brand" className='scale-150' />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold font-Krona bg-gradient-to-r from-white via-teal-100 to-teal-500 bg-clip-text text-transparent tracking-tight">UrCare</h1>
                  </div>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-6 text-center md:text-left relative p-4 rounded-xl bg-teal-950/50 backdrop-blur-sm border border-white/10 "
              >
                <h2 className="text-xl md:text-3xl lg:text-4xl font-Krona font-bold bg-gradient-to-r from-white via-gray-200 to-teal-300 bg-clip-text text-transparent leading-tight mb-2 md:mb-4">
                  AI‑Powered Healthcare
                  <br />
                  <span className="bg-gradient-to-r from-white via-gray-200 to-teal-300 bg-clip-text text-transparent">
                    That Adapts to You
                  </span>
                </h2>

                {/* Dynamic Tagline with Glass Background */}
                <div className="relative py-2 md:p-4 rounded-2xl bg-none backdrop-blur-sm border border-white/25 mb-2 md:mb-4">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentImageIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="text-sm md:text-xl font-Montserrat font-medium text-gray-100 leading-relaxed"
                    >
                      {currentImage.tagline}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-base font-Montserrat font-medium text-gray-200 leading-relaxed"
                >
                  One platform for records, routines, and real care.
                </motion.p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-8"
              >
                {[
                  { icon: Shield, text: 'HIPAA Secure', color: 'from-green-400 to-emerald-500' },
                  { icon: Zap, text: 'AI-Powered', color: 'from-yellow-400 to-orange-500' },
                  { icon: Users, text: 'Family Care', color: 'from-pink-400 to-rose-500' },
                  { icon: Clock, text: '24/7 Support', color: 'from-blue-400 to-indigo-500' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex flex-row items-center space-x-2 p-2 md:px-3 md:py-2 bg-white/5 md:bg-white/25 backdrop-blur-sm rounded-full border border-white/25 text-gray-950 text-md hover:bg-white/15 transition-all duration-300 shadow-lg">
                      <div className={`mb-1 size-10 flex items-center justify-center rounded-full bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="size-8 text-white" />
                      </div>
                      <span className="text-sm md:text-base font-Montserrat font-semibold text-white md:text-black">{feature.text}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Get Started Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-center md:text-left"
              >
                <button
                  onClick={() => navigate("/auth")}
                  className="group relative px-8 py-4 bg-gradient-to-br from-teal-400 via-teal-700 to-teal-950 hover:from-teal-950 hover:via-teal-700 hover:to-teal-400 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100/50 transform hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center space-x-1 md:space-x-2">
                    <span className='font-semibold'>Get Started</span>
                    <ArrowRight className="size-4 md:size-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>

                  {/* Enhanced Button Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-purple-600/50 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                </button>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Bottom indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-0"
        >
          <div className="backdrop-blur-md bg-white/10 rounded-full p-2 border border-white/20">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${index === currentImageIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}

        <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => navigate("/")}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
              
              {/* Floating Orbs */}
              {/* <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-pulse delay-1000" /> */}
              
              <div className="relative p-8 text-center">
                {/* Header Section */}
                <div className="mb-8">
                  {/* Brand Logo */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex justify-center items-center mb-2"
                  >
                    <div className="relative">
                      <img src="/brand.png" alt="Brand" className="relative size-20 rounded-xl" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-teal-100 to-teal-500 bg-clip-text text-transparent font-Krona tracking-wide">UrCare</h1>
                  </motion.div>
                  
                  {/* Welcome Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                   <p className="text-gray-300 text-sm font-medium font-Montserrat leading-relaxed">
                      Continue your personalized healthcare journey with AI-powered insights and care
                    </p>
                  </motion.div>
                </div>

                {/* Authentication Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4 mb-8"
                >
                  {/* Google Sign In Button */}
                  <button className="group w-full flex items-center justify-center space-x-3 bg-black/50 backdrop-blur-sm text-white py-4 px-6 rounded-2xl border border-white/15 hover:bg-blue-400/15 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black/10 rounded-full blur-sm opacity-20 group-hover:opacity-30 transition-opacity" />
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="relative size-8" />
                    </div>
                    <span className="font-semibold font-Montserrat text-lg">Continue with Google</span>
                  </button>
                </motion.div>

                {/* Features Highlight */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-6"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Shield, text: 'Secure', color: 'from-green-400 to-emerald-500' },
                      { icon: Zap, text: 'AI-Powered', color: 'from-yellow-400 to-orange-500' },
                      { icon: Heart, text: 'Trusted', color: 'from-pink-400 to-rose-500' }
                    ].map((feature, index) => (
                      <div key={feature.text} className="flex flex-col items-center space-y-2 py-2 rounded-2xl shadow-2xl shadow-white/10">
                        <div className={`p-1 rounded-full bg-gradient-to-r ${feature.color} shadow-lg`}>
                          <feature.icon className="size-6 text-white" />
                        </div>
                        <span className="text-white text-sm font-Syne font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-gray-400 text-sm font-Montserrat leading-relaxed">
                    By continuing, you agree to our <span className='font-semibold'>Terms of Service</span> and <span className='font-semibold'>Privacy Policy</span>
                  </p>
                  
                  <button
                    onClick={() => navigate("/")}
                    className="text-white/75 hover:text-white pt-4 font-Syne transition-colors duration-200 underline underline-offset-2"
                  >
                    Maybe later
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>


  );


};





export default Landing;