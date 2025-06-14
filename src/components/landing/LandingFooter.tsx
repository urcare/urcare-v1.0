
import React from 'react';
import { Heart, Linkedin, Instagram, Twitter } from 'lucide-react';

export const LandingFooter = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Privacy', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Urcare</h3>
                <p className="text-gray-400 text-sm">AI-Powered Healthcare</p>
              </div>
            </div>
            
            <p className="text-gray-400 leading-relaxed max-w-md">
              Revolutionizing healthcare through AI-powered diagnosis and connecting patients with qualified medical professionals instantly.
            </p>
          </div>
          
          {/* Links and Social */}
          <div className="flex flex-col sm:flex-row gap-8 justify-between items-start sm:items-center">
            {/* Links */}
            <div className="flex gap-8">
              {footerLinks.company.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Urcare Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
