
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  icon: any;
  processingFee: number;
  enabled: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  method: string;
  status: 'success' | 'failed' | 'pending';
  date: string;
  gatewayRef: string;
  patientName: string;
}

export const PaymentGatewayIntegration = () => {
  const [paymentAmount, setPaymentAmount] = useState(2500);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [splitPayment, setSplitPayment] = useState(false);
  const [insuranceCoverage, setInsuranceCoverage] = useState(1800);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: CreditCard,
      processingFee: 2.5,
      enabled: true
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: Smartphone,
      processingFee: 0.5,
      enabled: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: Banknote,
      processingFee: 1.5,
      enabled: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: Wallet,
      processingFee: 1.0,
      enabled: true
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 'TXN001',
      amount: 5000,
      method: 'UPI',
      status: 'success',
      date: '2024-06-05 14:30',
      gatewayRef: 'RZP_001234',
      patientName: 'John Doe'
    },
    {
      id: 'TXN002',
      amount: 1500,
      method: 'Credit Card',
      status: 'failed',
      date: '2024-06-05 12:15',
      gatewayRef: 'STR_567890',
      patientName: 'Jane Smith'
    },
    {
      id: 'TXN003',
      amount: 3200,
      method: 'Net Banking',
      status: 'pending',
      date: '2024-06-05 10:45',
      gatewayRef: 'PAY_789012',
      patientName: 'Mike Johnson'
    }
  ];

  const emiOptions = [
    { tenure: 3, rate: 12, emi: Math.round((paymentAmount * 0.12) / 12) },
    { tenure: 6, rate: 14, emi: Math.round((paymentAmount * 0.14) / 12) },
    { tenure: 12, rate: 16, emi: Math.round((paymentAmount * 0.16) / 12) },
    { tenure: 24, rate: 18, emi: Math.round((paymentAmount * 0.18) / 12) }
  ];

  const gatewayStats = {
    totalTransactions: 1247,
    successRate: 94.2,
    totalValue: 2847500,
    avgTransactionTime: 3.2,
    failureRate: 5.8,
    refundsPending: 12
  };

  const patientAmount = paymentAmount - (splitPayment ? insuranceCoverage : 0);
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const processingFee = selectedMethodData ? (patientAmount * selectedMethodData.processingFee) / 100 : 0;
  const finalAmount = patientAmount + processingFee;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Success', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Gateway Integration</h2>
          <p className="text-gray-600">Multi-gateway payment processing and management</p>
        </div>
        
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          Payment Analytics
        </Button>
      </div>

      {/* Gateway Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gatewayStats.totalTransactions}</div>
              <div className="text-xs text-gray-600">Total Transactions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gatewayStats.successRate}%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{(gatewayStats.totalValue / 100000).toFixed(1)}L</div>
              <div className="text-xs text-gray-600">Total Value</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{gatewayStats.avgTransactionTime}s</div>
              <div className="text-xs text-gray-600">Avg Time</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{gatewayStats.failureRate}%</div>
              <div className="text-xs text-gray-600">Failure Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{gatewayStats.refundsPending}</div>
              <div className="text-xs text-gray-600">Pending Refunds</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Processing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Processing
            </CardTitle>
            <CardDescription>Process patient payments with multiple options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="split"
                checked={splitPayment}
                onChange={(e) => setSplitPayment(e.target.checked)}
              />
              <Label htmlFor="split">Split Payment (Insurance + Patient)</Label>
            </div>

            {splitPayment && (
              <div>
                <Label htmlFor="insurance">Insurance Coverage (₹)</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={insuranceCoverage}
                  onChange={(e) => setInsuranceCoverage(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <method.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{method.name}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Fee: {method.processingFee}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span>Bill Amount:</span>
                <span>₹{paymentAmount.toLocaleString()}</span>
              </div>
              
              {splitPayment && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Insurance Coverage:</span>
                    <span>-₹{insuranceCoverage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Responsibility:</span>
                    <span>₹{patientAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between text-red-600">
                <span>Processing Fee ({selectedMethodData?.processingFee}%):</span>
                <span>₹{processingFee.toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Final Amount:</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EMI Options</CardTitle>
            <CardDescription>Flexible payment plans for patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emiOptions.map((option, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{option.tenure} Months EMI</div>
                      <div className="text-sm text-gray-600">Interest Rate: {option.rate}%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{option.emi}/month</div>
                      <div className="text-sm text-gray-600">Total: ₹{(option.emi * option.tenure).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Set Up EMI Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment activities and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.id} - {transaction.patientName}</h4>
                    <p className="text-sm text-gray-600">{transaction.method} • {transaction.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">₹{transaction.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{transaction.gatewayRef}</div>
                  </div>
                  
                  {getStatusBadge(transaction.status)}
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    {transaction.status === 'failed' && (
                      <Button size="sm" variant="outline">
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Failed Payment Recovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Failed Payment Recovery
          </CardTitle>
          <CardDescription>Automated retry and recovery mechanisms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">24</div>
              <div className="text-sm text-gray-600">Failed Payments (24h)</div>
              <Button size="sm" variant="outline" className="mt-2">
                Retry All
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">₹85,200</div>
              <div className="text-sm text-gray-600">Recovery Amount</div>
              <Button size="sm" variant="outline" className="mt-2">
                Send Links
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <div className="text-sm text-gray-600">Recovery Rate</div>
              <Button size="sm" variant="outline" className="mt-2">
                View Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Links & QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Links & QR Codes</CardTitle>
          <CardDescription>Generate payment links for remote collections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkAmount">Amount for Payment Link</Label>
                <Input id="linkAmount" type="number" placeholder="Enter amount" />
              </div>
              
              <div>
                <Label htmlFor="linkDesc">Description</Label>
                <Input id="linkDesc" placeholder="Payment description" />
              </div>
              
              <Button className="w-full">
                Generate Payment Link
              </Button>
            </div>
            
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
                <p className="text-sm text-gray-600">QR Code will appear here</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Generate QR
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
