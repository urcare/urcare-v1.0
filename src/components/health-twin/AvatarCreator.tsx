
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { User, Palette, Shirt, Crown } from 'lucide-react';
import { HealthAvatar } from '@/types';

interface AvatarCreatorProps {
  onSave: (avatar: HealthAvatar) => void;
  initialAvatar?: HealthAvatar;
}

export function AvatarCreator({ onSave, initialAvatar }: AvatarCreatorProps) {
  const [avatar, setAvatar] = useState<HealthAvatar>(
    initialAvatar || {
      id: '',
      name: '',
      gender: 'other',
      age: 25,
      height: 170,
      weight: 70,
      skinTone: '#F4C2A1',
      hairColor: '#8B4513',
      hairStyle: 'short',
      bodyType: 'average',
      customizations: {
        accessories: [],
        clothing: 'casual',
        features: {}
      }
    }
  );

  const skinTones = ['#F4C2A1', '#D4A574', '#C8956D', '#A67C52', '#8B5A2B', '#654321'];
  const hairColors = ['#000000', '#8B4513', '#D2691E', '#DAA520', '#FF4500', '#B22222'];
  const hairStyles = ['short', 'long', 'curly', 'wavy', 'bald', 'pixie'];
  const accessories = ['glasses', 'hat', 'earrings', 'necklace', 'watch', 'bracelet'];

  const updateAvatar = (field: keyof HealthAvatar, value: any) => {
    setAvatar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAccessory = (accessory: string) => {
    setAvatar(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        accessories: prev.customizations.accessories.includes(accessory)
          ? prev.customizations.accessories.filter(a => a !== accessory)
          : [...prev.customizations.accessories, accessory]
      }
    }));
  };

  const handleSave = () => {
    const newAvatar = {
      ...avatar,
      id: avatar.id || `avatar_${Date.now()}`
    };
    onSave(newAvatar);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Create Your Health Avatar
        </CardTitle>
        <CardDescription>
          Customize your digital health twin to track your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Avatar Preview</h3>
            <div className="aspect-square bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
              <div className="text-center space-y-2">
                <div 
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg"
                  style={{ backgroundColor: avatar.skinTone }}
                />
                <div className="text-sm text-gray-600">
                  {avatar.name || 'Your Avatar'}
                </div>
                <div className="flex justify-center gap-1">
                  {avatar.customizations.accessories.map(accessory => (
                    <Badge key={accessory} variant="secondary" className="text-xs">
                      {accessory}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={avatar.name}
                    onChange={(e) => updateAvatar('name', e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={avatar.gender} onValueChange={(value) => updateAvatar('gender', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Age: {avatar.age}</Label>
                  <Slider
                    value={[avatar.age]}
                    onValueChange={([value]) => updateAvatar('age', value)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Height: {avatar.height}cm</Label>
                  <Slider
                    value={[avatar.height]}
                    onValueChange={([value]) => updateAvatar('height', value)}
                    min={120}
                    max={220}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Weight: {avatar.weight}kg</Label>
                  <Slider
                    value={[avatar.weight]}
                    onValueChange={([value]) => updateAvatar('weight', value)}
                    min={30}
                    max={200}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Skin Tone</Label>
                  <div className="flex gap-2 mt-2">
                    {skinTones.map(tone => (
                      <button
                        key={tone}
                        className={`w-8 h-8 rounded-full border-2 ${
                          avatar.skinTone === tone ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: tone }}
                        onClick={() => updateAvatar('skinTone', tone)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Hair Color</Label>
                  <div className="flex gap-2 mt-2">
                    {hairColors.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          avatar.hairColor === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateAvatar('hairColor', color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hair Style</Label>
                  <Select value={avatar.hairStyle} onValueChange={(value) => updateAvatar('hairStyle', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hairStyles.map(style => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Body Type</Label>
                  <Select value={avatar.bodyType} onValueChange={(value) => updateAvatar('bodyType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slim">Slim</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Accessories
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {accessories.map(accessory => (
                  <Badge
                    key={accessory}
                    variant={avatar.customizations.accessories.includes(accessory) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAccessory(accessory)}
                  >
                    {accessory}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Avatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
