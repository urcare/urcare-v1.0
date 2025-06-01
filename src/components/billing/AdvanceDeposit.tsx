
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  User,
  Building,
  Clock,
  Plus,
  AlertTriangle,
  TrendingDown,
  Wallet,
  CreditCard
} from 'lucide-react';

interface DepositAccount {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  admission: {
    date: string;
    ward: string;
    type: 'IPD' | 'OPD' | 'Emergency';
  };
  deposit: {
    initial: number;
    current: number;
    autoDeductions: number;
    manualDeductions: number;
    topUps: number;
  };
  thresholds: {
    warning: number;
    critical: number;
  };
  autoDeductionRate: number;
  status: 'Active' | 'Low Balance' | 'Critical' | 'Negative';
  lastTransaction: string;
}

export const AdvanceDeposit = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  const depositAccounts: DepositAccount[] = [
    {
      id: 'DEP001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      admission: {
        date: '2024-05-28',
        ward: 'Cardiology Ward',
        type: 'IPD'
      },
      deposit: {
        initial: 5000.00,
        current: 1247.50,
        autoDeductions: 3452.75,
        manualDeductions: 299.75,
        topUps: 0.00
      },
      thresholds: {
        warning: 1000.00,
        critical: 500.00
      },
      autoDeductionRate: 285.50,
      status: 'Low Balance',
      lastTransaction: '2024-06-01 10:30'
    },
    {
      id: 'DEP002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      admission: {
        date: '2024-05-30',
        ward: 'Surgery Ward',
        type: 'IPD'
      },
      deposit: {
        initial: 3000.00,
        current: -671.25,
        autoDeductions: 2890.50,
        manualDeductions: 780.75,
        topUps: 0.00
      },
      thresholds: {
        warning: 800.00,
        critical: 300.00
      },
      autoDeductionRate: 195.75,
      status: 'Negative',
      lastTransaction: '2024-06-01 09:15'
    },
    {
      id: 'DEP003',
      patient: { name: 'Bob Chen', regId: 'REG001236', category: 'Employee' },
      admission: {
        date: '2024-06-01',
        ward: 'Medicine Ward',
        type: 'IPD'
      },
      deposit: {
        initial: 2000.00,
        current: 1850.25,
        autoDeductions: 149.75,
        manualDeductions: 0.00,
        topUps: 0.00
      },
      thresholds: {
        warning: 500.00,
        critical: 200.00
      },
      autoDeductionRate: 125.00,
      status: 'Active',
      lastTransaction: '2024-06-01 11:45'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Low Balance': 'bg-amber-100 text-amber-800',
      'Critical': 'bg-orange-100 text-orange-800',
      'Negative': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getDepositProgress = (account: DepositAccount) => {
    const usedAmount = account.deposit.initial - account.deposit.current;
    const percentage = Math.max(0, (account.deposit.current / account.deposit.initial) * 100);
    return { percentage, usedAmount };
  };

  const getDaysRemaining = (account: DepositAccount) => {
    if (account.autoDeductionRate === 0 || account.deposit.current <= 0) return 0;
    return Math.floor(account.deposit.current / account.autoDeductionRate);
  };

  const handleTopUp = (accountId: string) => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    console.log(`Adding $${topUpAmount} to account ${accountId}`);
    setTopUpAmount('');
  };

  const handleSendNotification = (accountId: string, type: 'SMS' | 'Email') => {
    console.log(`Sending ${type} notification for account ${accountId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advance Deposit Management</h2>
          <p className="text-gray-600">Monitor and manage patient deposit accounts with automated alerts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{depositAccounts.length} active accounts</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-xl font-bold text-green-600">
                  ${depositAccounts.reduce((sum, acc) => sum + acc.deposit.initial, 0).toLocaleString()}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-xl font-bold text-blue-600">
                  ${depositAccounts.reduce((sum, acc) => sum + acc.deposit.current, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Balance Alerts</p>
                <p className="text-xl font-bold text-amber-600">
                  {depositAccounts.filter(acc => acc.status === 'Low Balance' || acc.status === 'Critical').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Negative Balances</p>
                <p className="text-xl font-bold text-red-600">
                  {depositAccounts.filter(acc => acc.status === 'Negative').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Accounts */}
      <div className="grid gap-6">
        {depositAccounts.map((account) => {
          const progress = getDepositProgress(account);
          const daysRemaining = getDaysRemaining(account);
          
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">{account.id}</h3>
                      <p className="text-gray-600">{account.admission.ward}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Since {account.admission.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(account.status)}>
                      {account.status}
                    </Badge>
                    <Badge variant="outline">
                      {account.admission.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Patient Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Patient Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{account.patient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Registration ID</label>
                        <p className="text-sm">{account.patient.regId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Category</label>
                        <Badge variant="outline">{account.patient.category}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Deposit Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Deposit Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Initial Deposit:</span>
                        <span className="font-medium">${account.deposit.initial.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Auto Deductions:</span>
                        <span className="text-red-600">-${account.deposit.autoDeductions.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Manual Deductions:</span>
                        <span className="text-red-600">-${account.deposit.manualDeductions.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Top-ups:</span>
                        <span className="text-green-600">+${account.deposit.topUps.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Current Balance:</span>
                        <span className={account.deposit.current < 0 ? 'text-red-600' : 'text-green-600'}>
                          ${account.deposit.current.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Usage Analytics
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Deposit Utilization</span>
                          <span>{progress.percentage.toFixed(1)}% remaining</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Daily Average:</span>
                          <span>${account.autoDeductionRate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Days Left:</span>
                          <span className={daysRemaining < 3 ? 'text-red-600 font-medium' : ''}>
                            {daysRemaining} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Threshold Alerts */}
                {(account.status === 'Low Balance' || account.status === 'Critical' || account.status === 'Negative') && (
                  <div className={`mb-6 p-4 rounded-lg border ${
                    account.status === 'Negative' ? 'bg-red-50 border-red-200' :
                    account.status === 'Critical' ? 'bg-orange-50 border-orange-200' :
                    'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        account.status === 'Negative' ? 'text-red-600' :
                        account.status === 'Critical' ? 'text-orange-600' :
                        'text-amber-600'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          account.status === 'Negative' ? 'text-red-800' :
                          account.status === 'Critical' ? 'text-orange-800' :
                          'text-amber-800'
                        }`}>
                          {account.status === 'Negative' ? 'Negative Balance Alert' :
                           account.status === 'Critical' ? 'Critical Balance Alert' :
                           'Low Balance Warning'}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          account.status === 'Negative' ? 'text-red-700' :
                          account.status === 'Critical' ? 'text-orange-700' :
                          'text-amber-700'
                        }`}>
                          {account.status === 'Negative' 
                            ? 'Account has a negative balance. Immediate action required.'
                            : `Balance is below ${account.status === 'Critical' ? 'critical' : 'warning'} threshold of $${
                                account.status === 'Critical' ? account.thresholds.critical : account.thresholds.warning
                              }.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-up Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Add Deposit</h4>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleTopUp(account.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deposit
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleSendNotification(account.id, 'SMS')}
                    variant="outline"
                    size="sm"
                  >
                    Send SMS Alert
                  </Button>
                  
                  <Button 
                    onClick={() => handleSendNotification(account.id, 'Email')}
                    variant="outline"
                    size="sm"
                  >
                    Send Email Alert
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    Transaction History
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
