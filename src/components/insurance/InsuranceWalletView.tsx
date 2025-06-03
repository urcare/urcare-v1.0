
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Users,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Bell
} from 'lucide-react';

interface InsuranceCard {
  id: string;
  type: 'primary' | 'secondary' | 'tertiary';
  provider: string;
  policyNumber: string;
  totalCoverage: number;
  usedAmount: number;
  deductible: number;
  deductibleMet: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'suspended';
}

interface CoverageCategory {
  name: string;
  limit: number;
  used: number;
  icon: any;
  color: string;
}

export const InsuranceWalletView = () => {
  const [selectedCard, setSelectedCard] = useState<string>('primary');

  const insuranceCards: InsuranceCard[] = [
    {
      id: 'primary',
      type: 'primary',
      provider: 'Star Health Insurance',
      policyNumber: 'SH-2024-001234',
      totalCoverage: 500000,
      usedAmount: 125000,
      deductible: 25000,
      deductibleMet: 15000,
      expiryDate: '2024-12-31',
      status: 'active'
    },
    {
      id: 'secondary',
      type: 'secondary',
      provider: 'ICICI Lombard',
      policyNumber: 'IL-2024-567890',
      totalCoverage: 300000,
      usedAmount: 45000,
      deductible: 15000,
      deductibleMet: 8000,
      expiryDate: '2024-11-15',
      status: 'active'
    }
  ];

  const coverageCategories: CoverageCategory[] = [
    { name: 'OPD', limit: 25000, used: 8500, icon: Shield, color: 'blue' },
    { name: 'IPD', limit: 400000, used: 95000, icon: Shield, color: 'green' },
    { name: 'Emergency', limit: 50000, used: 12000, icon: AlertCircle, color: 'red' },
    { name: 'Maternity', limit: 75000, used: 0, icon: Users, color: 'pink' },
    { name: 'Dental', limit: 15000, used: 4500, icon: Shield, color: 'purple' }
  ];

  const familyMembers = [
    { name: 'John Doe (Self)', coverage: 500000, used: 125000, status: 'active' },
    { name: 'Jane Doe (Spouse)', coverage: 500000, used: 89000, status: 'active' },
    { name: 'Emily Doe (Child)', coverage: 200000, used: 15000, status: 'active' },
    { name: 'Robert Doe (Parent)', coverage: 300000, used: 245000, status: 'active' }
  ];

  const recentTransactions = [
    { date: '2024-06-01', description: 'Cardiology Consultation', amount: 2500, claimStatus: 'approved' },
    { date: '2024-05-28', description: 'Lab Tests - Complete Blood Count', amount: 1200, claimStatus: 'approved' },
    { date: '2024-05-25', description: 'Emergency Room Visit', amount: 8500, claimStatus: 'processing' },
    { date: '2024-05-20', description: 'Physiotherapy Session', amount: 800, claimStatus: 'approved' }
  ];

  const selectedCardData = insuranceCards.find(card => card.id === selectedCard) || insuranceCards[0];
  const usagePercentage = (selectedCardData.usedAmount / selectedCardData.totalCoverage) * 100;
  const deductiblePercentage = (selectedCardData.deductibleMet / selectedCardData.deductible) * 100;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'Suspended', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insurance Wallet</h2>
          <p className="text-gray-600">Track your coverage, usage, and benefits</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Coverage
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Insurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insuranceCards.map((card) => (
          <Card 
            key={card.id}
            className={`cursor-pointer transition-all ${selectedCard === card.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
            onClick={() => setSelectedCard(card.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium capitalize">{card.type}</span>
                </div>
                {getStatusBadge(card.status)}
              </div>
              <CardTitle className="text-lg">{card.provider}</CardTitle>
              <CardDescription>{card.policyNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coverage Used</span>
                    <span>₹{card.usedAmount.toLocaleString()} / ₹{card.totalCoverage.toLocaleString()}</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Expires:</span>
                  <span className="font-medium">{card.expiryDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Coverage Breakdown
            </CardTitle>
            <CardDescription>Coverage limits by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coverageCategories.map((category, index) => {
                const usagePercentage = (category.used / category.limit) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <category.icon className={`w-4 h-4 text-${category.color}-600`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ₹{category.used.toLocaleString()} / ₹{category.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Deductible Tracker
            </CardTitle>
            <CardDescription>Track your deductible progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₹{selectedCardData.deductibleMet.toLocaleString()}</div>
                <div className="text-sm text-gray-600">of ₹{selectedCardData.deductible.toLocaleString()} met</div>
              </div>
              
              <Progress value={deductiblePercentage} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">₹{(selectedCardData.deductible - selectedCardData.deductibleMet).toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{deductiblePercentage.toFixed(0)}%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Coverage Status
          </CardTitle>
          <CardDescription>Individual coverage and usage for family members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member, index) => {
              const memberUsagePercentage = (member.used / member.coverage) * 100;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">₹{member.used.toLocaleString()} / ₹{member.coverage.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress value={memberUsagePercentage} className="h-2" />
                    </div>
                    <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest insurance claims and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">{transaction.description}</h4>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₹{transaction.amount.toLocaleString()}</span>
                  <Badge 
                    className={
                      transaction.claimStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      transaction.claimStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {transaction.claimStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alerts & Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">Policy Renewal Due</h4>
                <p className="text-sm text-yellow-700">ICICI Lombard policy expires in 45 days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">Health Checkup Due</h4>
                <p className="text-sm text-blue-700">Annual preventive checkup covered under OPD benefits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
