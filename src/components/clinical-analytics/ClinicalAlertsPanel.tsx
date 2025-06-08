
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  X,
  ChevronRight
} from 'lucide-react';

interface ClinicalAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  department: string;
  timestamp: string;
  metric: string;
  threshold: string;
  currentValue: string;
}

const mockAlerts: ClinicalAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'ICU Mortality Rate Spike',
    description: 'ICU mortality rate has exceeded threshold for 3 consecutive days',
    department: 'ICU',
    timestamp: '2 hours ago',
    metric: 'Mortality Rate',
    threshold: '< 5%',
    currentValue: '7.2%'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Cardiology Readmission Rate',
    description: 'Cardiology 30-day readmission rate approaching threshold',
    department: 'Cardiology',
    timestamp: '4 hours ago',
    metric: 'Readmission Rate',
    threshold: '< 15%',
    currentValue: '14.1%'
  },
  {
    id: '3',
    type: 'info',
    title: 'Quality Score Improvement',
    description: 'Overall quality score has improved significantly this month',
    department: 'Hospital-wide',
    timestamp: '1 day ago',
    metric: 'Quality Score',
    threshold: '> 90%',
    currentValue: '93.5%'
  }
];

export const ClinicalAlertsPanel = () => {
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(mockAlerts);

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active clinical alerts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Clinical Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{alert.title}</h4>
                  <Badge className={`${getAlertBadgeColor(alert.type)} text-xs`}>
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>{alert.department}</span>
                  <span>{alert.timestamp}</span>
                  <span>{alert.metric}: {alert.currentValue} (threshold: {alert.threshold})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => dismissAlert(alert.id)}
                className="h-8 w-8 p-0 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
