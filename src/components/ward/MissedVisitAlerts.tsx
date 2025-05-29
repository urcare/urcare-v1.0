
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, User, Bell, Phone, Mail, CheckCircle, X } from 'lucide-react';

interface MissedVisitAlert {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  ward: string;
  scheduledTime: string;
  missedDuration: string;
  visitType: 'rounds' | 'consultation' | 'procedure' | 'medication';
  assignedDoctor: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  escalationLevel: number;
  lastEscalation?: string;
  contactAttempts: number;
  notes?: string;
}

const mockAlerts: MissedVisitAlert[] = [
  {
    id: 'MA001',
    patientId: 'W002',
    patientName: 'Sarah Wilson',
    bedNumber: 'B-203',
    ward: 'ICU',
    scheduledTime: '2:00 PM',
    missedDuration: '45 minutes',
    visitType: 'consultation',
    assignedDoctor: 'Dr. Brown',
    priority: 'critical',
    status: 'escalated',
    escalationLevel: 2,
    lastEscalation: '3:30 PM',
    contactAttempts: 3,
    notes: 'Critical patient in ICU - immediate attention required'
  },
  {
    id: 'MA002',
    patientId: 'W004',
    patientName: 'Robert Johnson',
    bedNumber: 'A-108',
    ward: 'General Ward A',
    scheduledTime: '11:00 AM',
    missedDuration: '2 hours 15 minutes',
    visitType: 'rounds',
    assignedDoctor: 'Dr. Smith',
    priority: 'medium',
    status: 'acknowledged',
    escalationLevel: 1,
    lastEscalation: '12:00 PM',
    contactAttempts: 1
  },
  {
    id: 'MA003',
    patientId: 'W005',
    patientName: 'Emily Davis',
    bedNumber: 'C-205',
    ward: 'Pediatrics',
    scheduledTime: '9:30 AM',
    missedDuration: '30 minutes',
    visitType: 'medication',
    assignedDoctor: 'Dr. Lee',
    priority: 'high',
    status: 'active',
    escalationLevel: 0,
    contactAttempts: 0
  }
];

export const MissedVisitAlerts = () => {
  const [alerts, setAlerts] = useState<MissedVisitAlert[]>(mockAlerts);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '📋';
      default: return '📊';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', contactAttempts: alert.contactAttempts + 1 }
        : alert
    ));
  };

  const handleEscalate = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'escalated', 
            escalationLevel: alert.escalationLevel + 1,
            lastEscalation: new Date().toLocaleTimeString(),
            contactAttempts: alert.contactAttempts + 1
          }
        : alert
    ));
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Missed Visit Alerts & Escalation
          </CardTitle>
          <CardDescription>
            Monitor and manage missed patient visits with automatic escalation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Send Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Email Report
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.priority === 'critical' ? 'border-l-red-500' :
                alert.priority === 'high' ? 'border-l-orange-500' :
                alert.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getPriorityIcon(alert.priority)}</span>
                      <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                      <Badge variant="outline">{alert.bedNumber}</Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      {alert.escalationLevel > 0 && (
                        <Badge variant="destructive">
                          Level {alert.escalationLevel} Escalation
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Scheduled: {alert.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span>Missed: {alert.missedDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{alert.assignedDoctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>Attempts: {alert.contactAttempts}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm"><strong>Ward:</strong> {alert.ward}</p>
                      <p className="text-sm"><strong>Visit Type:</strong> {alert.visitType}</p>
                      {alert.lastEscalation && (
                        <p className="text-sm"><strong>Last Escalation:</strong> {alert.lastEscalation}</p>
                      )}
                    </div>
                    {alert.notes && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {alert.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      Alert ID: {alert.id} • Patient ID: {alert.patientId}
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      
                      {(alert.status === 'active' || alert.status === 'acknowledged') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEscalate(alert.id)}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Active Alerts</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'escalated').length}</p>
              <p className="text-sm text-gray-500">Escalated</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'resolved').length}</p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{alerts.filter(a => a.priority === 'critical').length}</p>
              <p className="text-sm text-gray-500">Critical Priority</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">1.5h</p>
              <p className="text-sm text-gray-500">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
