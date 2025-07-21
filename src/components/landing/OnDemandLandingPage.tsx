import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface OnDemandLandingPageProps {
  showModal?: boolean;
}

export const OnDemandLandingPage = ({ showModal = false }: OnDemandLandingPageProps) => {
  const navigate = useNavigate();

  // Grid images data with healthcare and wellness imagery including the new user-provided images
  const gridImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=400&h=600&fit=crop&crop=center",
      alt: "Grandfather and grandson bonding together",
      className: "col-span-1 row-span-2"
    },
    {
      id: 2, 
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
      alt: "Elderly couple enjoying healthy green smoothies",
      className: "col-span-1 row-span-1"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center", 
      alt: "Young couple doing yoga meditation outdoors",
      className: "col-span-1 row-span-1"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center",
      alt: "Fit young couple at the gym exercising together",
      className: "col-span-1 row-span-2"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop&crop=center",
      alt: "Active couple jogging together in park",
      className: "col-span-1 row-span-2"
    },
    {
      id: 6,
      url: "/images/meditation-wellness.jpg",
      alt: "Meditation and wellness in nature",
      className: "col-span-1 row-span-1"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop&crop=center",
      alt: "Healthcare technology and medical devices",
      className: "col-span-1 row-span-1"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center",
      alt: "Healthy nutrition and wellness lifestyle",
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
            Your Health,Your Way
          </h1>
          
          <p className="text-lg text-gray-600 font-normal max-w-sm mx-auto">
            Anytime, Anywhere.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                onClick={() => navigate('/onboarding')}
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


    </div>
  );
}; 