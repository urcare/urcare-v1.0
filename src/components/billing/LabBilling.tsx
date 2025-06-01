
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search,
  Clock,
  User,
  Activity,
  Zap,
  Building
} from 'lucide-react';

interface LabBill {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  tests: Array<{
    name: string;
    category: string;
    amount: number;
    isUrgent: boolean;
    isPackage: boolean;
  }>;
  total: number;
  discount: number;
  finalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  orderType: 'OPD' | 'IPD' | 'Emergency';
  timestamp: string;
}

export const LabBilling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const labBills: LabBill[] = [
    {
      id: 'LAB001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      tests: [
        { name: 'Complete Blood Count', category: 'Hematology', amount: 25.00, isUrgent: false, isPackage: true },
        { name: 'Lipid Profile', category: 'Chemistry', amount: 35.00, isUrgent: false, isPackage: true },
        { name: 'HbA1c', category: 'Chemistry', amount: 40.00, isUrgent: false, isPackage: false }
      ],
      total: 100.00,
      discount: 10.00,
      finalAmount: 90.00,
      paymentStatus: 'Paid',
      orderType: 'OPD',
      timestamp: '2024-06-01 09:30'
    },
    {
      id: 'LAB002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      tests: [
        { name: 'Chest X-Ray', category: 'Radiology', amount: 50.00, isUrgent: true, isPackage: false },
        { name: 'Urine Analysis', category: 'Chemistry', amount: 20.00, isUrgent: false, isPackage: false }
      ],
      total: 70.00,
      discount: 7.00,
      finalAmount: 63.00,
      paymentStatus: 'Pending',
      orderType: 'Emergency',
      timestamp: '2024-06-01 10:15'
    },
    {
      id: 'LAB003',
      patient: { name: 'Bob Chen', regId: 'REG001236', category: 'Employee' },
      tests: [
        { name: 'Blood Culture', category: 'Microbiology', amount: 60.00, isUrgent: true, isPackage: false },
        { name: 'CT Scan Abdomen', category: 'Radiology', amount: 200.00, isUrgent: false, isPackage: false }
      ],
      total: 260.00,
      discount: 130.00,
      finalAmount: 130.00,
      paymentStatus: 'Paid',
      orderType: 'IPD',
      timestamp: '2024-06-01 11:00'
    }
  ];

  const testCategories = ['Chemistry', 'Hematology', 'Microbiology', 'Radiology', 'Pathology'];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Paid': 'bg-green-100 text-green-800',
      'Partial': 'bg-blue-100 text-blue-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderTypeBadge = (type: string) => {
    const variants: { [key: string]: string } = {
      'OPD': 'bg-blue-100 text-blue-800',
      'IPD': 'bg-purple-100 text-purple-800',
      'Emergency': 'bg-red-100 text-red-800'
    };
    return variants[type] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Chemistry': Activity,
      'Hematology': Activity,
      'Microbiology': Activity,
      'Radiology': FileText,
      'Pathology': FileText
    };
    return icons[category] || FileText;
  };

  const handleProcessPayment = (billId: string) => {
    console.log(`Processing payment for lab bill ${billId}`);
  };

  const filteredBills = labBills.filter(bill => {
    const matchesSearch = bill.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patient.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                           bill.tests.some(test => test.category === categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laboratory Billing</h2>
          <p className="text-gray-600">Lab tests and radiology billing with package rates</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{filteredBills.length} lab orders today</span>
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
                  placeholder="Search by patient, ID, or bill number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {testCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lab Bills List */}
      <div className="grid gap-4">
        {filteredBills.map((bill) => (
          <Card key={bill.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{bill.id}</h3>
                    <p className="text-sm text-gray-600">Laboratory Order</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(bill.paymentStatus)}>
                    {bill.paymentStatus}
                  </Badge>
                  <Badge className={getOrderTypeBadge(bill.orderType)}>
                    {bill.orderType}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Information</label>
                  <div className="mt-1">
                    <p className="font-medium">{bill.patient.name}</p>
                    <p className="text-sm text-gray-600">{bill.patient.regId}</p>
                    <Badge variant="outline" className="mt-1">
                      {bill.patient.category}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Tests Ordered</label>
                  <div className="mt-1 space-y-2">
                    {bill.tests.map((test, index) => {
                      const IconComponent = getCategoryIcon(test.category);
                      return (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{test.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">{test.category}</span>
                                {test.isUrgent && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    STAT
                                  </Badge>
                                )}
                                {test.isPackage && (
                                  <Badge variant="outline" className="text-xs">
                                    Package
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="font-medium">${test.amount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Billing Summary</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${bill.total.toFixed(2)}</span>
                    </div>
                    {bill.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({bill.patient.category}):</span>
                        <span>-${bill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>${bill.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{bill.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{bill.orderType} Order</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {bill.paymentStatus === 'Pending' && (
                    <Button 
                      onClick={() => handleProcessPayment(bill.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Process Payment
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBills.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lab orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
