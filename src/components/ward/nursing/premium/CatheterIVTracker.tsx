
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplets, Clock, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';

interface CatheterIVTrackerProps {
  nightMode: boolean;
}

export const CatheterIVTracker = ({ nightMode }: CatheterIVTrackerProps) => {
  const [lines, setLines] = useState([
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      type: 'Central Line',
      site: 'Right Subclavian',
      insertedDate: '2024-05-28',
      insertedBy: 'Dr. Smith',
      daysInPlace: 4,
      maxDays: 7,
      nextAssessment: '14:00',
      status: 'active',
      complications: [],
      lastFlushed: '12:00',
      flushDue: '16:00'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      type: 'Peripheral IV',
      site: 'Left Forearm',
      insertedDate: '2024-05-30',
      insertedBy: 'Nurse Johnson',
      daysInPlace: 2,
      maxDays: 3,
      nextAssessment: '15:30',
      status: 'due_change',
      complications: ['mild infiltration'],
      lastFlushed: '11:30',
      flushDue: '15:30'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      type: 'Foley Catheter',
      site: 'Urethral',
      insertedDate: '2024-05-29',
      insertedBy: 'Nurse Davis',
      daysInPlace: 3,
      maxDays: 14,
      nextAssessment: '16:00',
      status: 'active',
      complications: [],
      lastFlushed: null,
      flushDue: null
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'due_change': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'removed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (days: number, maxDays: number) => {
    return Math.min((days / maxDays) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '[&>div]:bg-red-500';
    if (percentage >= 70) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Droplets className="h-6 w-6 text-blue-600" />
          Catheter & IV Line Tracker
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Droplets className="h-4 w-4 mr-2" />
          Add New Line
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-green-200 bg-green-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {lines.filter(l => l.status === 'active').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Active Lines</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-orange-200 bg-orange-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {lines.filter(l => l.status === 'due_change').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-orange-800'}`}>Due for Change</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {lines.filter(l => l.complications.length > 0).length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-red-800'}`}>With Complications</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200 bg-blue-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lines.filter(l => l.flushDue && new Date(`2024-06-01T${l.flushDue}`) <= new Date()).length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Flush Due</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lines.map(line => (
          <Card key={line.id} className={`${nightMode ? 'bg-gray-800 border-gray-700' : ''} ${
            line.status === 'due_change' ? 'border-orange-300 bg-orange-50' :
            line.complications.length > 0 ? 'border-red-300 bg-red-50' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{line.type}</CardTitle>
                  <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {line.patient} - {line.room} | Site: {line.site}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusColor(line.status)}>
                    {line.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {line.complications.length > 0 && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Complications
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Days in Place</span>
                      <span className={`font-medium ${
                        line.daysInPlace >= line.maxDays * 0.9 ? 'text-red-600' :
                        line.daysInPlace >= line.maxDays * 0.7 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {line.daysInPlace} / {line.maxDays} days
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(line.daysInPlace, line.maxDays)} 
                      className={`h-2 ${getProgressColor(getProgressPercentage(line.daysInPlace, line.maxDays))}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Inserted:</span>
                      <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{line.insertedDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">By:</span>
                      <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{line.insertedBy}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Next Assessment: {line.nextAssessment}</span>
                    </div>
                  </div>

                  {line.flushDue && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4" />
                        <span>Last Flush: {line.lastFlushed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Next Flush: {line.flushDue}</span>
                      </div>
                    </div>
                  )}

                  {line.complications.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-medium text-red-600">Complications:</span>
                      {line.complications.map((comp, index) => (
                        <p key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                          {comp}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Assessment
                </Button>
                {line.flushDue && (
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    <Droplets className="h-4 w-4 mr-2" />
                    Flush Line
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Change
                </Button>
                <Button size="sm" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Document
                </Button>
                {line.complications.length > 0 && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
