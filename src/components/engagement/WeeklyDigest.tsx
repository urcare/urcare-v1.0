
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mail, Bell, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { toast } from 'sonner';

interface DigestItem {
  category: string;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

interface Props {
  onDigestSend: () => void;
}

const weeklyStats: DigestItem[] = [
  {
    category: 'Health Actions',
    title: 'Micro-actions completed',
    value: '28',
    change: '+12% from last week',
    positive: true
  },
  {
    category: 'Learning',
    title: 'Quiz score average',
    value: '85%',
    change: '+5% improvement',
    positive: true
  },
  {
    category: 'Engagement',
    title: 'Stories read',
    value: '15',
    change: '+3 from last week',
    positive: true
  },
  {
    category: 'Achievement',
    title: 'Badges earned',
    value: '3',
    change: 'New: Health Scholar',
    positive: true
  }
];

export const WeeklyDigest = ({ onDigestSend }: Props) => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [digestFrequency, setDigestFrequency] = useState<'weekly' | 'monthly'>('weekly');

  const handleSendNow = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Generating your digest...',
        success: 'Weekly digest sent to your email!',
        error: 'Failed to send digest'
      }
    );
    onDigestSend();
  };

  const handleToggleEmail = (enabled: boolean) => {
    setEmailEnabled(enabled);
    toast.success(enabled ? 'Email digest enabled' : 'Email digest disabled');
  };

  const handleToggleNotification = (enabled: boolean) => {
    setNotificationEnabled(enabled);
    toast.success(enabled ? 'Push notifications enabled' : 'Push notifications disabled');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Weekly Health Digest
          </CardTitle>
          <CardDescription>
            Get a personalized summary of your health journey every week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview of This Week's Stats */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week's Highlights
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weeklyStats.map((stat, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {stat.category}
                    </Badge>
                    {stat.positive && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="font-medium">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digest Settings */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Digest Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Email Digest</p>
                  <p className="text-sm text-gray-600">Receive weekly summary via email</p>
                </div>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={handleToggleEmail}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get notified when digest is ready</p>
                </div>
                <Switch
                  checked={notificationEnabled}
                  onCheckedChange={handleToggleNotification}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Frequency</p>
                  <p className="text-sm text-gray-600">How often to receive digests</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={digestFrequency === 'weekly' ? 'default' : 'outline'}
                    onClick={() => setDigestFrequency('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button
                    size="sm"
                    variant={digestFrequency === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setDigestFrequency('monthly')}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSendNow} className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Send This Week's Digest
            </Button>
            <Button variant="outline" className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Preview Digest
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Digest Preview */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg">📧 Sample Email Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-2">Your Weekly Health Journey 🌟</h3>
            <p className="text-sm text-gray-600 mb-3">Week of January 15-21, 2024</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm">Completed 28 micro-actions (+12%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Earned "Health Scholar" badge</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Quiz average: 85% (+5% improvement)</span>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 rounded">
              <p className="text-xs text-blue-700">
                "Your consistency is paying off! Keep up the great work with your daily health actions."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
