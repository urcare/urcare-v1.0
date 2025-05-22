
import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">UrCare Hospital</h3>
                <p className="text-sm text-muted-foreground">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Providing comprehensive healthcare services with cutting-edge technology 
              and compassionate care for over 25 years.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@urcare.hospital</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>123 Medical Center Dr.</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-red-600">911</p>
              <p className="text-sm text-muted-foreground">24/7 Emergency Services</p>
              <p className="text-sm text-primary font-medium">Emergency Hotline:</p>
              <p className="text-sm font-semibold">+1 (555) 911-HELP</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 UrCare Hospital Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
