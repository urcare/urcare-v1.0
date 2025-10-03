
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, Sun, Moon, Monitor, Sparkles } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
}

export function AppSkinPersonalizer() {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedMode, setSelectedMode] = useState('system');

  const themes: ThemeOption[] = [
    {
      id: 'default',
      name: 'Medical Blue',
      description: 'Professional healthcare theme',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        background: '#ffffff',
        accent: '#0ea5e9'
      }
    },
    {
      id: 'nature',
      name: 'Healing Green',
      description: 'Calming nature-inspired colors',
      preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        background: '#ffffff',
        accent: '#10b981'
      }
    },
    {
      id: 'warm',
      name: 'Warm Care',
      description: 'Warm and welcoming design',
      preview: 'bg-gradient-to-br from-orange-50 to-amber-100',
      colors: {
        primary: '#ea580c',
        secondary: '#78716c',
        background: '#ffffff',
        accent: '#f59e0b'
      }
    },
    {
      id: 'minimal',
      name: 'Clean Minimal',
      description: 'Simple and distraction-free',
      preview: 'bg-gradient-to-br from-gray-50 to-slate-100',
      colors: {
        primary: '#374151',
        secondary: '#9ca3af',
        background: '#ffffff',
        accent: '#6b7280'
      }
    },
    {
      id: 'vibrant',
      name: 'Vibrant Energy',
      description: 'Energetic and modern',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-100',
      colors: {
        primary: '#7c3aed',
        secondary: '#64748b',
        background: '#ffffff',
        accent: '#ec4899'
      }
    },
    {
      id: 'accessibility',
      name: 'High Contrast',
      description: 'Maximum accessibility and readability',
      preview: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      colors: {
        primary: '#000000',
        secondary: '#4b5563',
        background: '#ffffff',
        accent: '#fbbf24'
      }
    }
  ];

  const modes = [
    { id: 'light', name: 'Light Mode', icon: Sun },
    { id: 'dark', name: 'Dark Mode', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            App Theme Personalizer
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your healthcare app
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMode} onValueChange={setSelectedMode}>
            <div className="grid grid-cols-3 gap-4">
              {modes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <div key={mode.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={mode.id} id={mode.id} />
                    <Label htmlFor={mode.id} className="flex items-center gap-2 cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      {mode.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Color Themes</CardTitle>
          <CardDescription>
            Choose a color scheme that suits your preference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <div key={theme.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={theme.id} id={theme.id} />
                    <Label htmlFor={theme.id} className="font-medium cursor-pointer">
                      {theme.name}
                    </Label>
                  </div>
                  <div className={`w-full h-24 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTheme === theme.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  } ${theme.preview}`}>
                    <div className="h-full p-3 flex flex-col justify-between">
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {theme.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Preview & Apply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Theme Preview:</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {themes.find(t => t.id === selectedTheme)?.colors && (
                  <>
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: themes.find(t => t.id === selectedTheme)!.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: themes.find(t => t.id === selectedTheme)!.colors.accent }}
                    />
                  </>
                )}
              </div>
              <span className="text-sm font-medium">
                {themes.find(t => t.id === selectedTheme)?.name} - {modes.find(m => m.id === selectedMode)?.name}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">Reset to Default</Button>
            <Button>Apply Theme</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
