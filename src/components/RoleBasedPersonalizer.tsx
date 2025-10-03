
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Brain, Palette, Type, Layout } from 'lucide-react';

interface PersonalizationSettings {
  aiAssistance: boolean;
  complexityLevel: string;
  interfaceLayout: string;
  fontSizeMultiplier: number[];
  colorContrast: string;
  animations: boolean;
}

export function RoleBasedPersonalizer() {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    aiAssistance: true,
    complexityLevel: 'standard',
    interfaceLayout: 'default',
    fontSizeMultiplier: [100],
    colorContrast: 'normal',
    animations: true
  });

  const handleSettingChange = (key: keyof PersonalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Interface Personalization
          </CardTitle>
          <CardDescription>
            Customize your experience based on your role and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-assistance">AI Smart Assistance</Label>
              <p className="text-sm text-muted-foreground">
                Get contextual help and suggestions
              </p>
            </div>
            <Switch
              id="ai-assistance"
              checked={settings.aiAssistance}
              onCheckedChange={(checked) => handleSettingChange('aiAssistance', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Interface Complexity Level</Label>
            <Select
              value={settings.complexityLevel}
              onValueChange={(value) => handleSettingChange('complexityLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple - Essential features only</SelectItem>
                <SelectItem value="standard">Standard - Balanced interface</SelectItem>
                <SelectItem value="advanced">Advanced - Full feature set</SelectItem>
                <SelectItem value="expert">Expert - Maximum customization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Layout Style</Label>
            <Select
              value={settings.interfaceLayout}
              onValueChange={(value) => handleSettingChange('interfaceLayout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default - Standard layout</SelectItem>
                <SelectItem value="compact">Compact - Space efficient</SelectItem>
                <SelectItem value="comfortable">Comfortable - Extra spacing</SelectItem>
                <SelectItem value="accessible">Accessible - High contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Font Size: {settings.fontSizeMultiplier[0]}%</Label>
            <Slider
              value={settings.fontSizeMultiplier}
              onValueChange={(value) => handleSettingChange('fontSizeMultiplier', value)}
              max={150}
              min={75}
              step={25}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Color Contrast</Label>
            <Select
              value={settings.colorContrast}
              onValueChange={(value) => handleSettingChange('colorContrast', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Contrast</SelectItem>
                <SelectItem value="extra-high">Extra High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and effects
              </p>
            </div>
            <Switch
              id="animations"
              checked={settings.animations}
              onCheckedChange={(checked) => handleSettingChange('animations', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
