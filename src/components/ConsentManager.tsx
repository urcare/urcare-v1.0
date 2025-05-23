
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Share2, Bell, Database, UserCheck } from 'lucide-react';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  required: boolean;
  enabled: boolean;
  icon: any;
}

export function ConsentManager() {
  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: 'data-processing',
      title: 'Data Processing',
      description: 'Allow processing of health data for medical care',
      category: 'essential',
      required: true,
      enabled: true,
      icon: Database
    },
    {
      id: 'emergency-access',
      title: 'Emergency Access',
      description: 'Allow emergency personnel to access critical health information',
      category: 'essential',
      required: true,
      enabled: true,
      icon: Shield
    },
    {
      id: 'family-sharing',
      title: 'Family Health Sharing',
      description: 'Share health updates with designated family members',
      category: 'functional',
      required: false,
      enabled: true,
      icon: Share2
    },
    {
      id: 'appointment-reminders',
      title: 'Appointment Reminders',
      description: 'Receive notifications about upcoming appointments',
      category: 'functional',
      required: false,
      enabled: true,
      icon: Bell
    },
    {
      id: 'health-analytics',
      title: 'Health Analytics',
      description: 'Use anonymized data to improve health insights',
      category: 'analytics',
      required: false,
      enabled: false,
      icon: Eye
    },
    {
      id: 'third-party-integration',
      title: 'Third-party Integrations',
      description: 'Connect with fitness trackers and health apps',
      category: 'functional',
      required: false,
      enabled: true,
      icon: UserCheck
    }
  ]);

  const handleConsentChange = (id: string, enabled: boolean) => {
    setConsents(prev => prev.map(consent => 
      consent.id === id ? { ...consent, enabled } : consent
    ));
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-red-100 text-red-800';
      case 'functional': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-yellow-100 text-yellow-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedConsents = consents.reduce((acc, consent) => {
    if (!acc[consent.category]) {
      acc[consent.category] = [];
    }
    acc[consent.category].push(consent);
    return acc;
  }, {} as Record<string, ConsentItem[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Consent Management
          </CardTitle>
          <CardDescription>
            Control how your health data is used and shared
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(groupedConsents).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="capitalize">{category} Permissions</CardTitle>
              <Badge className={getCategoryBadgeColor(category)}>
                {items.filter(item => item.enabled).length} / {items.length} enabled
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((consent) => {
              const IconComponent = consent.icon;
              return (
                <div key={consent.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={consent.id} className="font-medium">
                          {consent.title}
                        </Label>
                        {consent.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {consent.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={consent.id}
                    checked={consent.enabled}
                    onCheckedChange={(checked) => handleConsentChange(consent.id, checked)}
                    disabled={consent.required}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button variant="outline">Export Consent Record</Button>
        <div className="space-x-2">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}
