import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';
import { AVATAR_STYLES } from './constants';

interface ProfileComponentsProps {
  onDataChange: (data: any) => void;
  variant?: 'setup' | 'photo-upload';
}

export const ProfileComponents: React.FC<ProfileComponentsProps> = ({ 
  onDataChange, 
  variant = 'setup' 
}) => {
  const [profileData, setProfileData] = useState({
    profilePhoto: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    gender: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...profileData, [field]: value };
    setProfileData(newData);
    onDataChange(newData);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('profilePhoto', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className={AVATAR_STYLES.large}>
            <AvatarImage src={profileData.profilePhoto} />
            <AvatarFallback className={AVATAR_STYLES.fallback}>
              <User className={AVATAR_STYLES.icon} />
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors shadow-lg"
          >
            <Camera className="w-4 h-4 text-white" />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-600 text-center">
          {variant === 'photo-upload' ? 'Add a profile photo to personalize your experience' : 'Upload your profile photo'}
        </p>
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              value={profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-1"
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              value={profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-1"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={profileData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="mt-1"
              placeholder="25"
              min="1"
              max="120"
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender
            </Label>
            <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Height and Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={profileData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="mt-1"
              placeholder="170"
              min="50"
              max="250"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={profileData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="mt-1"
              placeholder="70"
              min="20"
              max="300"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg">
        <p className="text-sm text-teal-800">
          <strong>Privacy Note:</strong> All your personal information is encrypted and stored securely. 
          We use this data to provide personalized health insights and recommendations.
        </p>
      </div>
    </div>
  );
}; 