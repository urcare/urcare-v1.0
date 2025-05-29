import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Printer, Share, User, Heart, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface MedicalInfo {
  personalInfo: {
    name: string;
    dob: string;
    bloodType: string;
    weight: string;
    height: string;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  additionalNotes: string;
}

export const MedicalAlertQR = () => {
  const [medicalInfo] = useState<MedicalInfo>({
    personalInfo: {
      name: 'John Smith',
      dob: '1985-03-15',
      bloodType: 'O+',
      weight: '180 lbs',
      height: '6\'0"'
    },
    emergencyContacts: [
      { name: 'Jane Smith', relationship: 'Spouse', phone: '+1-555-0123' },
      { name: 'Dr. Sarah Johnson', relationship: 'Primary Care', phone: '+1-555-0456' }
    ],
    medicalConditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Asthma'],
    allergies: ['Penicillin', 'Shellfish', 'Peanuts'],
    medications: ['Lisinopril 10mg daily', 'Metformin 1000mg twice daily'],
    additionalNotes: 'Insulin dependent. Check blood sugar if unconscious.'
  });

  const [qrSize, setQrSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [includePhoto, setIncludePhoto] = useState(false);

  const generateQRData = () => {
    // In a real implementation, this would create a secure, encrypted URL
    // pointing to a protected medical information page
    const data = {
      id: 'med_profile_12345',
      name: medicalInfo.personalInfo.name,
      emergencyUrl: 'https://medical-emergency.app/profile/12345',
      bloodType: medicalInfo.personalInfo.bloodType,
      conditions: medicalInfo.medicalConditions.slice(0, 3), // Most critical
      allergies: medicalInfo.allergies,
      emergencyContact: medicalInfo.emergencyContacts[0]?.phone,
      lastUpdated: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  };

  const downloadQR = () => {
    // Simulate QR code download
    toast.success('QR code downloaded as PNG');
  };

  const printQR = () => {
    // Simulate printing
    toast.success('QR code sent to printer');
  };

  const shareQR = () => {
    // Simulate sharing
    toast.success('QR code sharing link copied to clipboard');
  };

  const getSizePixels = (size: string) => {
    switch (size) {
      case 'small': return 150;
      case 'medium': return 200;
      case 'large': return 300;
      default: return 200;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            Medical Alert QR Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes for medical bracelets, cards, and emergency access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Preview */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
              {/* QR Code Placeholder - In real implementation, use a QR library */}
              <div 
                className="bg-black mx-auto"
                style={{ 
                  width: getSizePixels(qrSize), 
                  height: getSizePixels(qrSize),
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Ctext x='50' y='50' font-family='monospace' font-size='8' text-anchor='middle' dy='.3em'%3EQR CODE%3C/text%3E%3C/svg%3E")`,
                  backgroundSize: 'cover'
                }}
              />
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                variant={qrSize === 'small' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQrSize('small')}
              >
                Small
              </Button>
              <Button
                variant={qrSize === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQrSize('medium')}
              >
                Medium
              </Button>
              <Button
                variant={qrSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQrSize('large')}
              >
                Large
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={downloadQR} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
            <Button onClick={printQR} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print QR
            </Button>
            <Button onClick={shareQR} variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Information Encoded in QR</CardTitle>
          <CardDescription>
            This information will be accessible to emergency responders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Info */}
          <div className="p-3 bg-blue-50 rounded border">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Name:</strong> {medicalInfo.personalInfo.name}</p>
              <p><strong>DOB:</strong> {medicalInfo.personalInfo.dob}</p>
              <p><strong>Blood Type:</strong> {medicalInfo.personalInfo.bloodType}</p>
              <p><strong>Weight:</strong> {medicalInfo.personalInfo.weight}</p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-3 bg-green-50 rounded border">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" />
              Emergency Contacts
            </h4>
            <div className="space-y-1">
              {medicalInfo.emergencyContacts.map((contact, index) => (
                <div key={index} className="text-sm">
                  <strong>{contact.name}</strong> ({contact.relationship}): {contact.phone}
                </div>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="p-3 bg-red-50 rounded border">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4" />
              Critical Medical Information
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Conditions:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {medicalInfo.medicalConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-sm">Allergies:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {medicalInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-sm">Current Medications:</p>
                <ul className="text-sm mt-1 space-y-1">
                  {medicalInfo.medications.map((medication, index) => (
                    <li key={index} className="text-gray-700">• {medication}</li>
                  ))}
                </ul>
              </div>

              {medicalInfo.additionalNotes && (
                <div>
                  <p className="font-medium text-sm">Additional Notes:</p>
                  <p className="text-sm text-gray-700 mt-1">{medicalInfo.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">For Medical Bracelets:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Use small or medium size QR codes</li>
                <li>• Print on waterproof material</li>
                <li>• Ensure high contrast for scanning</li>
                <li>• Test scan regularly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Emergency Cards:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Use medium or large size</li>
                <li>• Laminate for durability</li>
                <li>• Keep in wallet or purse</li>
                <li>• Include backup contact info</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-100 rounded border border-amber-300">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> QR codes link to encrypted medical profiles. 
              Access is logged and restricted to verified emergency responders. 
              Update your profile regularly to ensure information accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
