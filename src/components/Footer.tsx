
import React from 'react';
import { Heart, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 UrCare Hospital Management System
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>support@urcare.com</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">HIPAA Compliance</a>
            </div>
            <span>Made with ❤️ for healthcare professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
