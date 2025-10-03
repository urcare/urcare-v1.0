
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TESTIMONIALS, ANIMATION_VARIANTS } from './constants';

export const TestimonialsSection = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = TESTIMONIALS[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className={ANIMATION_VARIANTS.section}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className={ANIMATION_VARIANTS.heading}>What Our Users Say</h2>
          <p className={ANIMATION_VARIANTS.subheading}>
            Join thousands of satisfied users who trust Urcare for their healthcare needs.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed">
                "{current.content}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{current.avatar}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{current.name}</div>
                  <div className="text-gray-600">{current.role}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full w-12 h-12 border-gray-300 hover:border-blue-300">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            
            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full w-12 h-12 border-gray-300 hover:border-blue-300">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
