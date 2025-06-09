
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Receipt,
  DollarSign,
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'digital_wallet' | 'bank_transfer';
  name: string;
  lastFour?: string;
  isDefault: boolean;
  isVerified: boolean;
  expiryDate?: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  timestamp: Date;
  paymentMethod: string;
  receiptId?: string;
}

export const MobilePaymentInterface = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4321',
      lastFour: '4321',
      isDefault: true,
      isVerified: true,
      expiryDate: '12/25'
    },
    {
      id: '2',
      type: 'digital_wallet',
      name: 'Apple Pay',
      isDefault: false,
      isVerified: true
    },
    {
      id: '3',
      type: 'bank_transfer',
      name: 'Bank of America',
      lastFour: '7890',
      isDefault: false,
      isVerified: true
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      amount: 150.00,
      currency: 'USD',
      description: 'Consultation Fee - Dr. Smith',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000),
      paymentMethod: 'Visa ending in 4321',
      receiptId: 'RCP_001'
    },
    {
      id: 'txn_002',
      amount: 75.50,
      currency: 'USD',
      description: 'Prescription Medication',
      status: 'pending',
      timestamp: new Date(Date.now() - 1800000),
      paymentMethod: 'Apple Pay'
    }
  ]);

  const [newPayment, setNewPayment] = useState({
    amount: '',
    description: '',
    paymentMethodId: '1'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setNewPayment({ amount: '', description: '', paymentMethodId: '1' });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'digital_wallet': return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer': return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Quick Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  className="pl-8"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newPayment.paymentMethodId}
                onChange={(e) => setNewPayment(prev => ({ ...prev, paymentMethodId: e.target.value }))}
              >
                {paymentMethods.filter(method => method.isVerified).map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newPayment.description}
              onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Payment description"
            />
          </div>

          <Button 
            onClick={processPayment}
            disabled={isProcessing || !newPayment.amount || !newPayment.description}
            className="w-full"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : `Pay $${newPayment.amount || '0.00'}`}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Payment Methods
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddCard(!showAddCard)}
            >
              Add Method
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPaymentIcon(method.type)}
                    <div>
                      <span className="font-medium">{method.name}</span>
                      {method.isDefault && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">Default</Badge>
                      )}
                      {method.isVerified && (
                        <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>
                      )}
                    </div>
                  </div>
                  {method.expiryDate && (
                    <div className="text-sm text-gray-600">
                      Expires {method.expiryDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {showAddCard && (
              <div className="p-4 border-2 border-dashed rounded-lg">
                <h4 className="font-medium mb-3">Add New Payment Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Card Number" />
                  <Input placeholder="Expiry Date (MM/YY)" />
                  <Input placeholder="CVV" />
                  <Input placeholder="Cardholder Name" />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Add Card</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddCard(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.timestamp.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  {transaction.description}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>via {transaction.paymentMethod}</span>
                  {transaction.receiptId && (
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Security Features</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>PCI DSS Compliance</span>
                  <Badge className="bg-green-100 text-green-800">Level 1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>End-to-End Encryption</span>
                  <Badge className="bg-green-100 text-green-800">256-bit SSL</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fraud Detection</span>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>3D Secure</span>
                  <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Payment Analytics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Average Processing Time</span>
                  <span className="font-medium">2.3s</span>
                </div>
                <Progress value={77} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Secure Payments:</strong> All transactions are processed through encrypted channels 
              with multi-layer fraud protection and real-time monitoring.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
