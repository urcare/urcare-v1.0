
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  CreditCard, 
  Receipt, 
  Calculator,
  Search,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';

interface OPDBill {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  visitType: string;
  department: string;
  doctor: string;
  services: Array<{
    name: string;
    amount: number;
  }>;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  paymentMethod?: string;
  timestamp: string;
}

export const OPDBilling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBill, setShowNewBill] = useState(false);

  const opdBills: OPDBill[] = [
    {
      id: 'OPD001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      visitType: 'Consultation',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      services: [
        { name: 'Consultation Fee', amount: 50.00 },
        { name: 'ECG', amount: 25.00 },
        { name: 'Echo', amount: 100.00 }
      ],
      total: 175.00,
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      timestamp: '2024-06-01 09:30'
    },
    {
      id: 'OPD002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      visitType: 'Follow-up',
      department: 'Orthopedics',
      doctor: 'Dr. Johnson',
      services: [
        { name: 'Consultation Fee', amount: 45.00 },
        { name: 'X-Ray Knee', amount: 35.00 }
      ],
      total: 72.00,
      paymentStatus: 'Pending',
      timestamp: '2024-06-01 10:15'
    },
    {
      id: 'OPD003',
      patient: { name: 'Bob Chen', regId: 'REG001236', category: 'Employee' },
      visitType: 'Consultation',
      department: 'Dermatology',
      doctor: 'Dr. Brown',
      services: [
        { name: 'Consultation Fee', amount: 25.00 },
        { name: 'Skin Biopsy', amount: 75.00 }
      ],
      total: 50.00,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      timestamp: '2024-06-01 11:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Paid': 'bg-green-100 text-green-800',
      'Partial': 'bg-blue-100 text-blue-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryDiscount = (category: string, amount: number) => {
    const discounts: { [key: string]: number } = {
      'General': 0,
      'Senior Citizen': 0.1,
      'Employee': 0.5,
      'Emergency': -0.25,
      'Corporate': 0.15,
      'Insurance': 0.2
    };
    return amount * (discounts[category] || 0);
  };

  const handleProcessPayment = (billId: string) => {
    console.log(`Processing payment for bill ${billId}`);
  };

  const handlePrintReceipt = (billId: string) => {
    console.log(`Printing receipt for bill ${billId}`);
  };

  const filteredBills = opdBills.filter(bill => 
    bill.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.patient.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">OPD Billing</h2>
          <p className="text-gray-600">Outpatient department billing and payment processing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Receipt className="w-4 h-4" />
            <span>{filteredBills.length} bills today</span>
          </div>
          <Button onClick={() => setShowNewBill(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New OPD Bill
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by patient name, ID, or bill number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OPD Bills List */}
      <div className="grid gap-4">
        {filteredBills.map((bill) => {
          const discount = getCategoryDiscount(bill.patient.category, bill.total);
          const finalAmount = bill.total - discount;
          
          return (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bill.id}</h3>
                      <p className="text-sm text-gray-600">{bill.visitType} - {bill.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(bill.paymentStatus)}>
                      {bill.paymentStatus}
                    </Badge>
                    {bill.paymentMethod && (
                      <Badge variant="outline">
                        {bill.paymentMethod}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patient</label>
                    <p className="font-medium">{bill.patient.name}</p>
                    <p className="text-sm text-gray-600">{bill.patient.regId}</p>
                    <Badge variant="outline" className="mt-1">
                      {bill.patient.category}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor</label>
                    <p className="font-medium">{bill.doctor}</p>
                    <p className="text-sm text-gray-600">{bill.department}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Services</label>
                    <div className="space-y-1">
                      {bill.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>${service.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Billing Summary</label>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${bill.total.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({bill.patient.category}):</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>${finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{bill.timestamp}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {bill.paymentStatus === 'Pending' && (
                      <Button 
                        onClick={() => handleProcessPayment(bill.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Process Payment
                      </Button>
                    )}
                    
                    {bill.paymentStatus === 'Paid' && (
                      <Button 
                        onClick={() => handlePrintReceipt(bill.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Print Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBills.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new bill.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
