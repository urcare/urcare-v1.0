
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Calendar, TrendingUp, Award, Users, Heart, Send, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface DigestContent {
  section: string;
  title: string;
  summary: string;
  metrics?: {
    value: number;
    change: number;
    unit?: string;
  };
}

interface WeeklyDigestProps {
  onDigestSend: () => void;
}

export const WeeklyDigest = ({ onDigestSend }: WeeklyDigestProps) => {
  const [digestSettings, setDigestSettings] = useState({
    personalStats: true,
    communityHighlights: true,
    healthTips: true,
    achievements: true,
    friendsActivity: false,
    marketingContent: false
  });

  const [frequency, setFrequency] = useState('weekly');
  const [deliveryDay, setDeliveryDay] = useState('sunday');

  const mockDigestContent: DigestContent[] = [
    {
      section: 'Personal Stats',
      title: 'Your Health Journey This Week',
      summary: 'You completed 12 micro-actions, earned 145 points, and maintained a 3-day wellness streak!',
      metrics: { value: 145, change: 12, unit: 'points' }
    },
    {
      section: 'Community Highlights', 
      title: 'Trending in Your Communities',
      summary: 'The Diabetes Support group had 23 new posts this week. Sarah M. shared an inspiring recovery story.',
      metrics: { value: 23, change: 5, unit: 'posts' }
    },
    {
      section: 'Health Tips',
      title: 'Personalized Recommendations',
      summary: 'Based on your activity, try adding 5 minutes of morning stretching to boost your energy levels.',
    },
    {
      section: 'Achievements',
      title: 'Milestones Unlocked',
      summary: 'You earned the "Hydration Hero" badge and reached Level 3 in the Health IQ challenges!',
      metrics: { value: 2, change: 2, unit: 'badges' }
    },
    {
      section: 'Friends Activity',
      title: 'Your Health Network',
      summary: 'Mike completed his first 5K run, and Emma shared a healthy recipe that got 47 likes.',
      metrics: { value: 47, change: 15, unit: 'interactions' }
    }
  ];

  const handleSettingChange = (setting: string, value: boolean) => {
    setDigestSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSendDigest = () => {
    onDigestSend();
    toast.success('Weekly digest sent to your email! 📧');
  };

  const enabledSections = mockDigestContent.filter(content => 
    digestSettings[content.section.toLowerCase().replace(' ', '') as keyof typeof digestSettings]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Weekly Health Digest
          </CardTitle>
          <CardDescription>
            Get a personalized summary of your health journey delivered to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5.2k</div>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.8★</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <p className="text-sm text-gray-600">Open Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Digest Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Content Sections</Label>
              <div className="space-y-3">
                {Object.entries(digestSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => handleSettingChange(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Delivery Day</Label>
                <Select value={deliveryDay} onValueChange={setDeliveryDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSendDigest} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Test Digest
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week's Preview</CardTitle>
            <CardDescription>
              Here's what your digest would look like
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enabledSections.map((content, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    {content.metrics && (
                      <Badge variant="outline" className="text-xs">
                        {content.metrics.change > 0 ? '+' : ''}{content.metrics.change}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{content.summary}</p>
                  {content.metrics && (
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">
                        {content.metrics.value} {content.metrics.unit}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {enabledSections.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select content sections to see preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Next Digest Delivery</h3>
              <p className="text-blue-700 text-sm">
                Sunday, 8:00 AM - Your personalized health summary will be ready
              </p>
            </div>
            <Badge className="bg-blue-600 text-white">
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
