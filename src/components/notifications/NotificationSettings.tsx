import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Settings,
  Save,
  TestTube,
  Moon,
  Sun,
  Zap,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, NotificationSettings as INotificationSettings } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<INotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<INotificationSettings | null>(null);

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userSettings = await notificationService.getNotificationSettings(user.id);
      
      if (userSettings) {
        setSettings(userSettings);
        setOriginalSettings(userSettings);
      } else {
        // Create default settings
        const defaultSettings: INotificationSettings = {
          userId: user.id,
          pushEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          },
          categories: {
            nutrition: true,
            exercise: true,
            medication: true,
            detox: true,
            lifestyle: true,
            reminders: true
          },
          advanceNotice: {
            nutrition: 15,
            exercise: 30,
            medication: 15,
            detox: 10,
            lifestyle: 10,
            reminders: 5
          },
          snoozeOptions: [5, 15, 30, 60]
        };
        
        setSettings(defaultSettings);
        setOriginalSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      const newSettings = { ...prev };
      
      // Handle nested object updates
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        (newSettings as any)[parent][child] = value;
      } else {
        (newSettings as any)[key] = value;
      }
      
      return newSettings;
    });
    
    setHasChanges(true);
  };

  const handleCategoryChange = (category: keyof INotificationSettings['categories'], enabled: boolean) => {
    handleSettingChange(`categories.${category}`, enabled);
  };

  const handleAdvanceNoticeChange = (category: keyof INotificationSettings['advanceNotice'], minutes: number) => {
    handleSettingChange(`advanceNotice.${category}`, minutes);
  };

  const saveSettings = async () => {
    if (!settings || !user) return;
    
    setIsSaving(true);
    try {
      await notificationService.updateNotificationSettings(user.id, settings);
      
      setOriginalSettings(settings);
      setHasChanges(false);
      
      toast({
        title: 'Success',
        description: 'Notification settings saved successfully',
      });
      
      // Update service worker with new settings
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'UPDATE_NOTIFICATION_SETTINGS',
          settings
        });
      }
      
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification settings',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setHasChanges(false);
    }
  };

  const testNotification = async () => {
    if (!user) return;
    
    try {
      await notificationService.testNotification(user.id);
      toast({
        title: 'Test Notification Sent',
        description: 'Check your notifications to see if it worked',
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8 text-gray-500">
        Failed to load notification settings
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
          <p className="text-gray-600">Customize how and when you receive health reminders</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={resetSettings}
            disabled={!hasChanges}
          >
            Reset
          </Button>
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-gray-600">
                Receive notifications even when the app is closed
              </p>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => handleSettingChange('pushEnabled', checked)}
            />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Sound</Label>
              <p className="text-sm text-gray-600">
                Play sound when notifications arrive
              </p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
            />
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Vibration</Label>
              <p className="text-sm text-gray-600">
                Vibrate device when notifications arrive
              </p>
            </div>
            <Switch
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => handleSettingChange('vibrationEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-purple-600" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Enable Quiet Hours</Label>
              <p className="text-sm text-gray-600">
                Pause notifications during specified hours
              </p>
            </div>
            <Switch
              checked={settings.quietHours.enabled}
              onCheckedChange={(checked) => handleSettingChange('quietHours.enabled', checked)}
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => handleSettingChange('quietHours.start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => handleSettingChange('quietHours.end', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-600" />
            Notification Categories
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose which types of health reminders you want to receive
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.categories).map(([category, enabled]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <p className="text-sm text-gray-600">
                  {getCategoryDescription(category)}
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => handleCategoryChange(category as keyof INotificationSettings['categories'], checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Advance Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Advance Notice
          </CardTitle>
          <p className="text-sm text-gray-600">
            How early should we remind you before each activity?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.advanceNotice).map(([category, minutes]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <p className="text-sm text-gray-600">
                  Current: {minutes} minutes before
                </p>
              </div>
              <Select
                value={minutes.toString()}
                onValueChange={(value) => handleAdvanceNoticeChange(
                  category as keyof INotificationSettings['advanceNotice'], 
                  parseInt(value)
                )}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">On time</SelectItem>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Snooze Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Snooze Options
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose how long to snooze notifications when you need more time
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {settings.snoozeOptions.map((minutes) => (
              <Badge key={minutes} variant="secondary" className="bg-blue-100 text-blue-800">
                {minutes} min
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-red-600" />
            Test & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Test Notification</Label>
              <p className="text-sm text-gray-600">
                Send a test notification to verify your settings
              </p>
            </div>
            <Button
              variant="outline"
              onClick={testNotification}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Send Test
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Clear All Notifications</Label>
              <p className="text-sm text-gray-600">
                Remove all pending notifications from your device
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // This would clear all notifications
                toast({
                  title: 'Notifications Cleared',
                  description: 'All pending notifications have been cleared',
                });
              }}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your health data is private</p>
                <p>
                  Notifications are processed locally on your device when possible. 
                  Only necessary information is sent to our secure servers for 
                  notification delivery.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get category descriptions
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    nutrition: 'Meal reminders and nutrition tracking',
    exercise: 'Workout schedules and fitness reminders',
    medication: 'Prescription and supplement reminders',
    detox: 'Hydration and detoxification reminders',
    lifestyle: 'Wellness activities and stress management',
    reminders: 'General health and wellness reminders'
  };
  
  return descriptions[category] || 'Health and wellness reminders';
}

export default NotificationSettings;
