
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Calendar,
  Bell,
  FileText,
  TrendingDown,
  Mail
} from 'lucide-react';

interface PenaltyAlert {
  id: string;
  claimId: string;
  patientName: string;
  tpaName: string;
  submissionDeadline: string;
  daysRemaining: number;
  penaltyAmount: number;
  status: 'upcoming' | 'overdue' | 'waived';
  claimAmount: number;
}

export const DelayPenaltyEngine = () => {
  const [alerts] = useState<PenaltyAlert[]>([
    {
      id: 'PEN001',
      claimId: 'CLM001',
      patientName: 'John Doe',
      tpaName: 'Star Health',
      submissionDeadline: '2024-06-10',
      daysRemaining: 2,
      penaltyAmount: 500,
      status: 'upcoming',
      claimAmount: 25000
    },
    {
      id: 'PEN002',
      claimId: 'CLM003',
      patientName: 'Jane Smith',
      tpaName: 'ICICI Lombard',
      submissionDeadline: '2024-06-05',
      daysRemaining: -3,
      penaltyAmount: 750,
      status: 'overdue',
      claimAmount: 15000
    }
  ]);

  const tpaTimelines = [
    { tpa: 'Star Health', submissionDays: 30, penaltyRate: 2 },
    { tpa: 'ICICI Lombard', submissionDays: 45, penaltyRate: 1.5 },
    { tpa: 'HDFC Ergo', submissionDays: 60, penaltyRate: 1 },
    { tpa: 'Bajaj Allianz', submissionDays: 30, penaltyRate: 2.5 }
  ];

  const penaltyHistory = [
    { month: 'January', amount: 2500, claims: 5 },
    { month: 'February', amount: 1800, claims: 3 },
    { month: 'March', amount: 3200, claims: 7 },
    { month: 'April', amount: 1200, claims: 2 },
    { month: 'May', amount: 2100, claims: 4 }
  ];

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === 'overdue') {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    } else if (daysRemaining <= 3) {
      return <Badge className="bg-amber-100 text-amber-800">Critical</Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    } else if (status === 'waived') {
      return <Badge className="bg-green-100 text-green-800">Waived</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
  };

  const totalPendingPenalties = alerts
    .filter(alert => alert.status !== 'waived')
    .reduce((sum, alert) => sum + alert.penaltyAmount, 0);

  const overdueCount = alerts.filter(alert => alert.status === 'overdue').length;
  const criticalCount = alerts.filter(alert => alert.daysRemaining <= 3 && alert.daysRemaining >= 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delay Penalty Warning Engine</h2>
          <p className="text-gray-600">Monitor submission deadlines and prevent penalty charges</p>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Claims</p>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical (≤3 days)</p>
                <p className="text-3xl font-bold text-amber-600">{criticalCount}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Penalties</p>
                <p className="text-3xl font-bold text-purple-600">₹{totalPendingPenalties.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month Penalties</p>
                <p className="text-3xl font-bold text-blue-600">₹{penaltyHistory[penaltyHistory.length - 1]?.amount.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Active Penalty Alerts
          </CardTitle>
          <CardDescription>Claims approaching deadlines or already overdue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{alert.claimId} - {alert.patientName}</h3>
                    <p className="text-sm text-gray-600">
                      {alert.tpaName} • Deadline: {alert.submissionDeadline}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Days Remaining</p>
                    <p className={`font-bold ${alert.daysRemaining < 0 ? 'text-red-600' : alert.daysRemaining <= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                      {alert.daysRemaining < 0 ? `${Math.abs(alert.daysRemaining)} overdue` : alert.daysRemaining}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Penalty Amount</p>
                    <p className="font-semibold text-red-600">₹{alert.penaltyAmount.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(alert.status, alert.daysRemaining)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button size="sm" variant="outline">
                      Request Waiver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TPA Timeline Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              TPA Timeline Requirements
            </CardTitle>
            <CardDescription>Submission deadlines and penalty rates by TPA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tpaTimelines.map((tpa, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{tpa.tpa}</h4>
                    <p className="text-sm text-gray-600">{tpa.submissionDays} days submission limit</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{tpa.penaltyRate}%</p>
                    <p className="text-xs text-gray-500">Penalty Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penalty History Trend</CardTitle>
            <CardDescription>Monthly penalty payments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {penaltyHistory.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <span className="text-sm text-gray-600">₹{month.amount.toLocaleString()} ({month.claims} claims)</span>
                  </div>
                  <Progress value={(month.amount / 3200) * 100} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Penalty Reduction Target</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Target: Reduce penalties by 25% this quarter through improved submission workflows
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Generate Penalty Report
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Bell className="w-4 h-4 mr-2" />
          Set Up Automated Alerts
        </Button>
      </div>
    </div>
  );
};
