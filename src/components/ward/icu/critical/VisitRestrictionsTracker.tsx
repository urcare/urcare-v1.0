
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, Clock, AlertTriangle, UserX, CheckCircle } from 'lucide-react';

interface VisitRestriction {
  patientId: string;
  patientName: string;
  room: string;
  restrictionType: 'isolation' | 'infection_control' | 'medical' | 'security' | 'family_request';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate?: Date;
  reason: string;
  allowedVisitors: string[];
  restrictedActivities: string[];
  approvedBy: string;
  isActive: boolean;
  exemptions: string[];
}

const mockRestrictions: VisitRestriction[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    restrictionType: 'isolation',
    severity: 'critical',
    startDate: new Date('2024-01-20'),
    reason: 'C. diff infection - contact isolation required',
    allowedVisitors: ['Spouse: John Johnson'],
    restrictedActivities: ['Group visits', 'Non-essential staff entry', 'Shared equipment'],
    approvedBy: 'Dr. Wilson',
    isActive: true,
    exemptions: ['Emergency medical team', 'Chaplain services']
  },
  {
    patientId: 'ICU003',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    restrictionType: 'medical',
    severity: 'medium',
    startDate: new Date('2024-01-21'),
    endDate: new Date('2024-01-23'),
    reason: 'Post-surgical recovery - limited visitation',
    allowedVisitors: ['Mother: Li Chen', 'Brother: David Chen'],
    restrictedActivities: ['Extended visits >30min', 'Multiple visitors'],
    approvedBy: 'Dr. Martinez',
    isActive: true,
    exemptions: []
  }
];

export const VisitRestrictionsTracker = () => {
  const [restrictions, setRestrictions] = useState<VisitRestriction[]>(mockRestrictions);

  const getRestrictionColor = (type: string) => {
    switch (type) {
      case 'isolation': return 'bg-red-600 text-white';
      case 'infection_control': return 'bg-orange-500 text-white';
      case 'medical': return 'bg-blue-500 text-white';
      case 'security': return 'bg-purple-600 text-white';
      case 'family_request': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const calculateDuration = (start: Date, end?: Date) => {
    const endDate = end || new Date();
    const days = Math.ceil((endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ICU Visit Restrictions Tracker
          </CardTitle>
          <CardDescription>
            Monitor and manage patient visit restrictions for infection control and medical safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <UserX className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Restrictions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                  <p className="text-sm text-gray-600">Isolation Patients</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Approved Visitors</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">5</p>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {restrictions.map((restriction) => (
              <Card key={restriction.patientId} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{restriction.patientName}</h3>
                      <Badge variant="outline">{restriction.room}</Badge>
                      <Badge className={getRestrictionColor(restriction.restrictionType)}>
                        {restriction.restrictionType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-medium ${getSeverityColor(restriction.severity)}`}>
                        {restriction.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Duration: {calculateDuration(restriction.startDate, restriction.endDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Approved by: {restriction.approvedBy}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Allowed Visitors
                      </h4>
                      <div className="space-y-2">
                        {restriction.allowedVisitors.length > 0 ? (
                          restriction.allowedVisitors.map((visitor, index) => (
                            <div key={index} className="text-sm p-2 bg-green-50 rounded">
                              <CheckCircle className="h-3 w-3 inline mr-2 text-green-600" />
                              {visitor}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No visitors allowed</p>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        Restricted Activities
                      </h4>
                      <div className="space-y-2">
                        {restriction.restrictedActivities.map((activity, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            <AlertTriangle className="h-3 w-3 inline mr-2 text-red-600" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Restriction Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Reason:</strong>
                          <p className="mt-1 text-gray-700">{restriction.reason}</p>
                        </div>
                        {restriction.exemptions.length > 0 && (
                          <div className="text-sm">
                            <strong>Exemptions:</strong>
                            <ul className="mt-1 space-y-1">
                              {restriction.exemptions.map((exemption, index) => (
                                <li key={index} className="text-gray-700">• {exemption}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Timeline</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <p>Started: {restriction.startDate.toLocaleDateString()}</p>
                      {restriction.endDate && (
                        <p>Expected End: {restriction.endDate.toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Modify Visitors
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Update Timeline
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Add Exemption
                    </Button>
                    {restriction.isActive && (
                      <Button size="sm" variant="destructive">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Remove Restriction
                      </Button>
                    )}
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
