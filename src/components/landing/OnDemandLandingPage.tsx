import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface OnDemandLandingPageProps {
  showModal?: boolean;
}

export const OnDemandLandingPage = ({ showModal = false }: OnDemandLandingPageProps) => {
  const navigate = useNavigate();

  // Grid images data with diverse people and health-related imagery
  const gridImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1494790108755-2616b612b1c9?w=400&h=600&fit=crop&crop=face",
      alt: "Person with closed eyes and gentle smile",
      className: "col-span-1 row-span-2"
    },
    {
      id: 2, 
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      alt: "Person holding head in contemplation",
      className: "col-span-1 row-span-1"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face", 
      alt: "Woman in athletic wear",
      className: "col-span-1 row-span-1"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      alt: "Man in casual wear smiling",
      className: "col-span-1 row-span-2"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      alt: "Woman holding coffee cup",
      className: "col-span-1 row-span-2"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      alt: "Pills and medication",
      className: "col-span-1 row-span-1"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&crop=center",
      alt: "Medical supplies",
      className: "col-span-1 row-span-1"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=face",
      alt: "Mature person smiling",
      className: "col-span-1 row-span-1"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Main Content */}
      <div className="py-8 px-6 h-full flex flex-col justify-center">
        {/* Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-3 h-[45vh] mb-6 flex-shrink-0"
        >
          {gridImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${image.className} rounded-3xl overflow-hidden bg-gray-200 relative group cursor-pointer`}
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('${image.url}')`,
                  backgroundColor: '#f3f4f6'
                }}
              />
              {/* Overlay for better image display */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center space-y-4 flex-shrink-0"
        >
          <h1 className="text-4xl font-light text-gray-900 leading-tight">
            Treatment, on-demand
          </h1>
          
          <p className="text-lg text-gray-600 font-normal max-w-sm mx-auto">
            Prescribed online, delivered to your door
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                onClick={() => navigate('/auth')}
                className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get started
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className="w-full max-w-sm bg-transparent border-gray-300 text-gray-900 hover:bg-gray-50 py-4 px-8 rounded-2xl text-lg font-medium transition-all duration-300"
              >
                Log in
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Home Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
      </motion.div>
    </div>
  );
}; 