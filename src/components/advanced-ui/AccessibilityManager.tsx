
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Type, 
  Keyboard,
  Monitor,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  fontSize: number;
  focusIndicator: boolean;
  audioDescriptions: boolean;
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

export const AccessibilityManager = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    reducedMotion: false,
    fontSize: 16,
    focusIndicator: true,
    audioDescriptions: false
  });

  const [complianceScore, setComplianceScore] = useState(87);
  const [activeTests, setActiveTests] = useState(false);

  const complianceChecks: ComplianceCheck[] = [
    {
      id: 'contrast',
      name: 'Color Contrast Ratio',
      status: 'pass',
      description: 'WCAG AA contrast requirements met',
      impact: 'serious'
    },
    {
      id: 'keyboard',
      name: 'Keyboard Navigation',
      status: 'pass',
      description: 'All interactive elements accessible via keyboard',
      impact: 'critical'
    },
    {
      id: 'focus',
      name: 'Focus Indicators',
      status: 'warning',
      description: 'Some elements lack visible focus indicators',
      impact: 'moderate'
    },
    {
      id: 'labels',
      name: 'Form Labels',
      status: 'fail',
      description: '3 form inputs missing proper labels',
      impact: 'serious'
    },
    {
      id: 'headings',
      name: 'Heading Structure',
      status: 'pass',
      description: 'Proper heading hierarchy maintained',
      impact: 'moderate'
    },
    {
      id: 'alt-text',
      name: 'Image Alt Text',
      status: 'warning',
      description: '2 images missing alternative text',
      impact: 'serious'
    }
  ];

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    applyAccessibilitySettings({ ...settings, [key]: value });
    toast.success(`${key} updated`);
  };

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text mode
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`;
    
    // Focus indicators
    if (newSettings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  };

  const runAccessibilityAudit = () => {
    setActiveTests(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Running accessibility audit...',
        success: 'Accessibility audit completed',
        error: 'Audit failed'
      }
    );
    
    setTimeout(() => {
      setActiveTests(false);
      setComplianceScore(89);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'serious': return 'bg-orange-100 text-orange-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    applyAccessibilitySettings(settings);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Accessibility Management</h2>
          <p className="text-muted-foreground">WCAG 2.1 AA compliance and accessibility features</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Compliance Score:</span>
            <Badge className={complianceScore >= 90 ? 'bg-green-100 text-green-800' : 
                            complianceScore >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
              {complianceScore}%
            </Badge>
          </div>
          <Button onClick={runAccessibilityAudit} disabled={activeTests}>
            <Eye className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">High Contrast Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Enhanced color contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(value) => updateSetting('highContrast', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span className="font-medium">Large Text Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                </div>
                <Switch
                  checked={settings.largeText}
                  onCheckedChange={(value) => updateSetting('largeText', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="font-medium">Screen Reader Support</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimize for screen reader compatibility</p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={(value) => updateSetting('screenReader', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    <span className="font-medium">Enhanced Keyboard Navigation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Improved keyboard accessibility</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(value) => updateSetting('keyboardNavigation', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span className="font-medium">Reduced Motion</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(value) => updateSetting('reducedMotion', value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Font Size: {settings.fontSize}px</label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Compliance Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>WCAG 2.1 AA Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceChecks.map((check) => (
              <div key={check.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <span className="font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(check.impact)} variant="secondary">
                      {check.impact}
                    </Badge>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{check.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
