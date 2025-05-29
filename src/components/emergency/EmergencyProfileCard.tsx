
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Heart, Pill, AlertTriangle, Phone, Calendar } from 'lucide-react';

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
  lastUpdated: Date;
}

interface EmergencyProfile {
  id: string;
  name: string;
  dateOfBirth: Date;
  age: number;
  gender: string;
  photoUrl?: string;
  medicalInfo: MedicalInfo;
  emergencyPreferences: {
    preferredHospital: string;
    organDonor: boolean;
    dnr: boolean;
  };
}

export const EmergencyProfileCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [profile] = useState<EmergencyProfile>({
    id: '1',
    name: 'John Smith',
    dateOfBirth: new Date('1985-03-15'),
    age: 39,
    gender: 'Male',
    photoUrl: undefined,
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish', 'Peanuts'],
      medications: ['Lisinopril 10mg daily', 'Metformin 1000mg twice daily'],
      conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Asthma'],
      emergencyContacts: [
        { name: 'Jane Smith', relationship: 'Spouse', phone: '+1-555-0123' },
        { name: 'Dr. Sarah Johnson', relationship: 'Primary Care', phone: '+1-555-0456' },
        { name: 'Robert Smith', relationship: 'Brother', phone: '+1-555-0789' }
      ],
      insuranceInfo: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789'
      },
      lastUpdated: new Date('2024-01-15')
    },
    emergencyPreferences: {
      preferredHospital: 'City General Hospital',
      organDonor: true,
      dnr: false
    }
  });

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="bg-red-100">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Heart className="h-5 w-5" />
            Emergency Medical Profile
          </CardTitle>
          <CardDescription className="text-red-700">
            Critical medical information for emergency responders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.photoUrl} />
                <AvatarFallback className="bg-red-200 text-red-800 text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Age: {profile.age}</Badge>
                  <Badge variant="outline">Gender: {profile.gender}</Badge>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Blood Type: {profile.medicalInfo.bloodType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Critical Medical Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded border border-orange-200">
                <h4 className="font-medium text-orange-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Allergies
                </h4>
                {profile.medicalInfo.allergies.length > 0 ? (
                  <div className="space-y-1">
                    {profile.medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="mr-1">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No known allergies</p>
                )}
              </div>

              <div className="p-3 bg-white rounded border border-blue-200">
                <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                  <Pill className="h-4 w-4" />
                  Current Medications
                </h4>
                {profile.medicalInfo.medications.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {profile.medicalInfo.medications.slice(0, 2).map((medication, index) => (
                      <li key={index} className="text-gray-700">• {medication}</li>
                    ))}
                    {profile.medicalInfo.medications.length > 2 && !isExpanded && (
                      <li className="text-blue-600 cursor-pointer" onClick={() => setIsExpanded(true)}>
                        • +{profile.medicalInfo.medications.length - 2} more...
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No current medications</p>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4" />
                Medical Conditions
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Emergency Contacts
              </h4>
              <div className="space-y-2">
                {profile.medicalInfo.emergencyContacts.slice(0, 2).map((contact, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-gray-600 ml-2">({contact.relationship})</span>
                    </div>
                    <span className="font-mono">{contact.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'View Complete Profile'}
            </Button>

            {isExpanded && (
              <div className="space-y-4 pt-4 border-t">
                {/* Insurance Info */}
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium mb-2">Insurance Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Provider:</strong> {profile.medicalInfo.insuranceInfo.provider}</p>
                    <p><strong>Policy #:</strong> {profile.medicalInfo.insuranceInfo.policyNumber}</p>
                  </div>
                </div>

                {/* Emergency Preferences */}
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium mb-2">Emergency Preferences</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Preferred Hospital:</strong> {profile.emergencyPreferences.preferredHospital}</p>
                    <div className="flex gap-4 mt-2">
                      <Badge variant={profile.emergencyPreferences.organDonor ? "default" : "outline"}>
                        {profile.emergencyPreferences.organDonor ? "Organ Donor" : "Not Organ Donor"}
                      </Badge>
                      <Badge variant={profile.emergencyPreferences.dnr ? "destructive" : "outline"}>
                        {profile.emergencyPreferences.dnr ? "DNR on File" : "No DNR"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Complete Medication List */}
                {profile.medicalInfo.medications.length > 2 && (
                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium mb-2">Complete Medication List</h4>
                    <ul className="text-sm space-y-1">
                      {profile.medicalInfo.medications.map((medication, index) => (
                        <li key={index} className="text-gray-700">• {medication}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* All Emergency Contacts */}
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium mb-2">All Emergency Contacts</h4>
                  <div className="space-y-2">
                    {profile.medicalInfo.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-gray-600 ml-2">({contact.relationship})</span>
                        </div>
                        <span className="font-mono">{contact.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last updated: {profile.medicalInfo.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
