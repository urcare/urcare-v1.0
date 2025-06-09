
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Hand, 
  ZoomIn, 
  ZoomOut,
  Move,
  RotateCcw,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface TouchSettings {
  largeTouchTargets: boolean;
  hapticFeedback: boolean;
  gestureNavigation: boolean;
  pinchToZoom: boolean;
  doubleTapToZoom: boolean;
  touchSensitivity: number;
  swipeThreshold: number;
}

export const TouchOptimizedInterface = () => {
  const [settings, setSettings] = useState<TouchSettings>({
    largeTouchTargets: true,
    hapticFeedback: true,
    gestureNavigation: true,
    pinchToZoom: true,
    doubleTapToZoom: true,
    touchSensitivity: 70,
    swipeThreshold: 50
  });

  const [demoZoom, setDemoZoom] = useState(100);
  const [demoRotation, setDemoRotation] = useState(0);

  const updateSetting = (key: keyof TouchSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${key} updated`);
    
    // Apply settings to document
    applyTouchSettings({ ...settings, [key]: value });
  };

  const applyTouchSettings = (newSettings: TouchSettings) => {
    const root = document.documentElement;
    
    // Large touch targets
    if (newSettings.largeTouchTargets) {
      root.classList.add('touch-large-targets');
    } else {
      root.classList.remove('touch-large-targets');
    }
    
    // Gesture navigation
    if (newSettings.gestureNavigation) {
      root.classList.add('gesture-navigation');
    } else {
      root.classList.remove('gesture-navigation');
    }
    
    // Touch sensitivity
    root.style.setProperty('--touch-sensitivity', `${newSettings.touchSensitivity}%`);
  };

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator && settings.hapticFeedback) {
      navigator.vibrate(50);
    }
  };

  const handleDemoZoom = (direction: 'in' | 'out') => {
    triggerHapticFeedback();
    setDemoZoom(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25;
      return Math.max(50, Math.min(200, newZoom));
    });
  };

  const handleDemoRotate = () => {
    triggerHapticFeedback();
    setDemoRotation(prev => (prev + 90) % 360);
  };

  const resetDemo = () => {
    triggerHapticFeedback();
    setDemoZoom(100);
    setDemoRotation(0);
  };

  const touchGestures = [
    { name: 'Tap', description: 'Select/activate elements', icon: '👆' },
    { name: 'Double Tap', description: 'Zoom to fit or reset', icon: '👆👆' },
    { name: 'Pinch to Zoom', description: 'Scale content up/down', icon: '🤏' },
    { name: 'Swipe', description: 'Navigate between pages', icon: '👆➡️' },
    { name: 'Long Press', description: 'Context menu/options', icon: '👆⏱️' },
    { name: 'Two-finger Scroll', description: 'Pan through content', icon: '✌️' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="h-5 w-5" />
          Touch Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Touch Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Touch Interface Settings</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Large Touch Targets</span>
              <p className="text-xs text-gray-600">Increase button and link sizes for easier tapping</p>
            </div>
            <Switch
              checked={settings.largeTouchTargets}
              onCheckedChange={(value) => updateSetting('largeTouchTargets', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Haptic Feedback</span>
              <p className="text-xs text-gray-600">Vibration response for touch interactions</p>
            </div>
            <Switch
              checked={settings.hapticFeedback}
              onCheckedChange={(value) => updateSetting('hapticFeedback', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Gesture Navigation</span>
              <p className="text-xs text-gray-600">Swipe gestures for navigation</p>
            </div>
            <Switch
              checked={settings.gestureNavigation}
              onCheckedChange={(value) => updateSetting('gestureNavigation', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-medium text-sm">Pinch to Zoom</span>
              <p className="text-xs text-gray-600">Zoom medical images and documents</p>
            </div>
            <Switch
              checked={settings.pinchToZoom}
              onCheckedChange={(value) => updateSetting('pinchToZoom', value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Touch Sensitivity: {settings.touchSensitivity}%
            </label>
            <Slider
              value={[settings.touchSensitivity]}
              onValueChange={([value]) => updateSetting('touchSensitivity', value)}
              min={30}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Swipe Threshold: {settings.swipeThreshold}px
            </label>
            <Slider
              value={[settings.swipeThreshold]}
              onValueChange={([value]) => updateSetting('swipeThreshold', value)}
              min={20}
              max={100}
              step={10}
              className="w-full"
            />
          </div>
        </div>

        {/* Demo Area */}
        <div className="space-y-3">
          <h4 className="font-medium">Touch Gesture Demo</h4>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div 
              className="w-32 h-32 mx-auto bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ 
                transform: `scale(${demoZoom / 100}) rotate(${demoRotation}deg)` 
              }}
            >
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <Button size="sm" onClick={() => handleDemoZoom('out')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleDemoZoom('in')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleDemoRotate}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetDemo}>
                Reset
              </Button>
            </div>
            
            <div className="text-center mt-2">
              <Badge variant="secondary">
                {demoZoom}% • {demoRotation}°
              </Badge>
            </div>
          </div>
        </div>

        {/* Gesture Guide */}
        <div className="space-y-3">
          <h4 className="font-medium">Supported Gestures</h4>
          <div className="grid grid-cols-1 gap-2">
            {touchGestures.map((gesture, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <span className="text-lg">{gesture.icon}</span>
                <div>
                  <span className="font-medium text-sm">{gesture.name}</span>
                  <p className="text-xs text-gray-600">{gesture.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Optimized for 44px minimum touch target size</p>
          <p>• Gesture recognition with configurable sensitivity</p>
          <p>• Haptic feedback for supported devices</p>
        </div>
      </CardContent>
    </Card>
  );
};
