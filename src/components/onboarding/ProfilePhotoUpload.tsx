
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';

interface ProfilePhotoUploadProps {
  onDataChange: (data: any) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ onDataChange }) => {
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
      {/* Profile Photo */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileData.profilePhoto} />
            <AvatarFallback className="bg-gradient-to-r from-teal-100 to-blue-100">
              <User className="w-8 h-8 text-teal-600" />
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-teal-500 to-blue-500"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Camera className="w-4 h-4" />
          </Button>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <p className="text-sm text-gray-600">Upload your profile photo (optional)</p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={profileData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="25"
        />
      </div>

      {/* Height and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={profileData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="170"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={profileData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="70"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
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
  );
};

export default ProfilePhotoUpload;
