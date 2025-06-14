
import React from 'react';
import { Heart, Linkedin, Instagram, Twitter } from 'lucide-react';

export const LandingFooter = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'HIPAA Compliance', href: '#' },
      { name: 'Cookies', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Status', href: '#' },
      { name: 'Community', href: '#' }
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
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
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
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Urcare Technologies. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>🔒 HIPAA Compliant</span>
            <span>🛡️ SOC 2 Certified</span>
            <span>⚡ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
