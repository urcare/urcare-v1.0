
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageSquare, Bell, Clock, CheckCircle } from 'lucide-react';

export const EmergencyContactNotification = () => {
  const [notificationQueue, setNotificationQueue] = useState([
    {
      id: 1,
      patientName: 'John Martinez',
      contactName: 'Maria Martinez (Wife)',
      contactNumber: '(555) 123-4567',
      email: 'maria.martinez@email.com',
      priority: 'high',
      status: 'pending',
      attempts: 0,
      lastAttempt: null
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationQueue.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{notification.patientName}</h3>
                      <Badge className={notification.priority === 'high' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}>
                        {notification.priority} priority
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Contact:</strong> {notification.contactName}</p>
                      <p className="text-sm"><strong>Phone:</strong> {notification.contactNumber}</p>
                      <p className="text-sm"><strong>Email:</strong> {notification.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        SMS
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
