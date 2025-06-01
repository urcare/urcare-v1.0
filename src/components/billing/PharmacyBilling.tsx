
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Receipt, 
  Search,
  Clock,
  User,
  Package,
  AlertTriangle,
  Shield,
  CreditCard
} from 'lucide-react';

interface PharmacyBill {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  prescription: {
    id: string;
    doctor: string;
    department: string;
  };
  medications: Array<{
    name: string;
    generic: string;
    quantity: number;
    unitPrice: number;
    total: number;
    stockLevel: number;
    isControlled: boolean;
    hasGenericOption: boolean;
  }>;
  insurance: {
    provider?: string;
    copayment?: number;
    coverage?: number;
  };
  total: number;
  discount: number;
  finalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  timestamp: string;
}

export const PharmacyBilling = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const pharmacyBills: PharmacyBill[] = [
    {
      id: 'PH001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      prescription: {
        id: 'RX001',
        doctor: 'Dr. Smith',
        department: 'Cardiology'
      },
      medications: [
        {
          name: 'Metoprolol 50mg',
          generic: 'Metoprolol Tartrate',
          quantity: 30,
          unitPrice: 0.50,
          total: 15.00,
          stockLevel: 85,
          isControlled: false,
          hasGenericOption: true
        },
        {
          name: 'Atorvastatin 20mg',
          generic: 'Atorvastatin Calcium',
          quantity: 30,
          unitPrice: 1.20,
          total: 36.00,
          stockLevel: 92,
          isControlled: false,
          hasGenericOption: true
        }
      ],
      insurance: {
        provider: 'BlueCross',
        copayment: 10.00,
        coverage: 80
      },
      total: 51.00,
      discount: 0.00,
      finalAmount: 41.00,
      paymentStatus: 'Paid',
      timestamp: '2024-06-01 09:30'
    },
    {
      id: 'PH002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      prescription: {
        id: 'RX002',
        doctor: 'Dr. Johnson',
        department: 'Pain Management'
      },
      medications: [
        {
          name: 'Morphine 10mg',
          generic: 'Morphine Sulfate',
          quantity: 10,
          unitPrice: 2.50,
          total: 25.00,
          stockLevel: 15,
          isControlled: true,
          hasGenericOption: false
        },
        {
          name: 'Acetaminophen 500mg',
          generic: 'Acetaminophen',
          quantity: 50,
          unitPrice: 0.10,
          total: 5.00,
          stockLevel: 95,
          isControlled: false,
          hasGenericOption: true
        }
      ],
      insurance: {},
      total: 30.00,
      discount: 3.00,
      finalAmount: 27.00,
      paymentStatus: 'Pending',
      timestamp: '2024-06-01 10:15'
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

  const getStockStatus = (level: number) => {
    if (level < 20) return { color: 'text-red-600', label: 'Low Stock' };
    if (level < 50) return { color: 'text-amber-600', label: 'Medium Stock' };
    return { color: 'text-green-600', label: 'Good Stock' };
  };

  const handleProcessPayment = (billId: string) => {
    console.log(`Processing payment for pharmacy bill ${billId}`);
  };

  const handleGenericSubstitution = (billId: string, medicationName: string) => {
    console.log(`Suggesting generic substitution for ${medicationName} in bill ${billId}`);
  };

  const filteredBills = pharmacyBills.filter(bill => 
    bill.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.patient.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pharmacy Billing</h2>
          <p className="text-gray-600">Medication dispensing with real-time stock updates</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Receipt className="w-4 h-4" />
          <span>{filteredBills.length} prescriptions today</span>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by patient name, ID, or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pharmacy Bills List */}
      <div className="grid gap-4">
        {filteredBills.map((bill) => (
          <Card key={bill.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{bill.id}</h3>
                    <p className="text-sm text-gray-600">Prescription {bill.prescription.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(bill.paymentStatus)}>
                    {bill.paymentStatus}
                  </Badge>
                  {bill.medications.some(med => med.isControlled) && (
                    <Badge className="bg-red-100 text-red-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Controlled
                    </Badge>
                  )}
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
                  <label className="text-sm font-medium text-gray-500">Prescriber</label>
                  <div className="mt-1">
                    <p className="font-medium">{bill.prescription.doctor}</p>
                    <p className="text-sm text-gray-600">{bill.prescription.department}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance Coverage</label>
                  <div className="mt-1">
                    {bill.insurance.provider ? (
                      <div>
                        <p className="font-medium">{bill.insurance.provider}</p>
                        <p className="text-sm text-gray-600">
                          {bill.insurance.coverage}% coverage, ${bill.insurance.copayment} copay
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No insurance coverage</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medications List */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 mb-3 block">Medications</label>
                <div className="space-y-3">
                  {bill.medications.map((medication, index) => {
                    const stockStatus = getStockStatus(medication.stockLevel);
                    return (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{medication.name}</h4>
                              {medication.isControlled && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Controlled
                                </Badge>
                              )}
                              {medication.hasGenericOption && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                  onClick={() => handleGenericSubstitution(bill.id, medication.name)}
                                >
                                  Generic Available
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Generic: {medication.generic}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {medication.quantity} × ${medication.unitPrice.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${medication.total.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Stock Level */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Stock Level</span>
                              <span className={`text-xs font-medium ${stockStatus.color}`}>
                                {medication.stockLevel}% - {stockStatus.label}
                              </span>
                            </div>
                            <Progress value={medication.stockLevel} className="h-2" />
                          </div>
                          {medication.stockLevel < 20 && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Billing Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${bill.total.toFixed(2)}</span>
                    </div>
                    {bill.insurance.coverage && (
                      <div className="flex justify-between text-blue-600">
                        <span>Insurance Coverage ({bill.insurance.coverage}%):</span>
                        <span>-${((bill.total * bill.insurance.coverage!) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {bill.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({bill.patient.category}):</span>
                        <span>-${bill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Patient Pays:</span>
                      <span>${bill.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {bill.medications.some(med => med.stockLevel < 20) && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Low Stock Alert</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Some medications have low stock levels. Consider reordering soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                  
                  <Button variant="outline" size="sm">
                    Print Label
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
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
