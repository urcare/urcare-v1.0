
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  CreditCard, 
  Calculator,
  Clock,
  User,
  Bed,
  Activity,
  Package
} from 'lucide-react';

interface IPDBill {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  admission: {
    date: string;
    ward: string;
    bedType: string;
    room: string;
  };
  billing: {
    roomCharges: number;
    procedures: Array<{ name: string; amount: number; date: string }>;
    consumables: number;
    pharmacy: number;
    total: number;
    deposit: number;
    balance: number;
  };
  package?: {
    name: string;
    amount: number;
    utilized: number;
  };
  status: 'Active' | 'Discharged' | 'Pending Discharge';
}

export const IPDBilling = () => {
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  const ipdBills: IPDBill[] = [
    {
      id: 'IPD001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      admission: {
        date: '2024-05-28',
        ward: 'Cardiology Ward',
        bedType: 'Private AC',
        room: 'C-201'
      },
      billing: {
        roomCharges: 2400.00,
        procedures: [
          { name: 'Angiography', amount: 1500.00, date: '2024-05-29' },
          { name: 'ECG Daily', amount: 25.00, date: '2024-05-30' },
          { name: 'Blood Tests', amount: 150.00, date: '2024-05-30' }
        ],
        consumables: 340.50,
        pharmacy: 890.25,
        total: 5305.75,
        deposit: 5000.00,
        balance: -305.75
      },
      status: 'Active'
    },
    {
      id: 'IPD002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      admission: {
        date: '2024-05-30',
        ward: 'Surgery Ward',
        bedType: 'Semi-Private',
        room: 'S-105'
      },
      billing: {
        roomCharges: 1200.00,
        procedures: [
          { name: 'Appendectomy', amount: 2500.00, date: '2024-05-30' },
          { name: 'Post-op monitoring', amount: 200.00, date: '2024-05-31' }
        ],
        consumables: 450.75,
        pharmacy: 320.50,
        total: 4671.25,
        deposit: 3000.00,
        balance: -1671.25
      },
      package: {
        name: 'Appendectomy Package',
        amount: 4000.00,
        utilized: 3200.00
      },
      status: 'Pending Discharge'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Active': 'bg-blue-100 text-blue-800',
      'Discharged': 'bg-gray-100 text-gray-800',
      'Pending Discharge': 'bg-amber-100 text-amber-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateDays = (admissionDate: string) => {
    const admission = new Date(admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admission.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddDeposit = (billId: string) => {
    console.log(`Adding deposit for ${billId}`);
  };

  const handleDischarge = (billId: string) => {
    console.log(`Processing discharge for ${billId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IPD Billing</h2>
          <p className="text-gray-600">Inpatient department billing with real-time updates</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="w-4 h-4" />
          <span>{ipdBills.length} active admissions</span>
        </div>
      </div>

      {/* IPD Bills Grid */}
      <div className="grid gap-6">
        {ipdBills.map((bill) => {
          const days = calculateDays(bill.admission.date);
          const isLowBalance = bill.billing.balance < 500;
          
          return (
            <Card key={bill.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">{bill.id}</h3>
                      <p className="text-gray-600">{bill.admission.ward} - {bill.admission.room}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{days} days admitted</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(bill.status)}>
                      {bill.status}
                    </Badge>
                    {isLowBalance && (
                      <Badge className="bg-red-100 text-red-800">
                        Low Balance
                      </Badge>
                    )}
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
                        <p className="font-medium">{bill.patient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Registration ID</label>
                        <p className="text-sm">{bill.patient.regId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Category</label>
                        <Badge variant="outline">{bill.patient.category}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Admission Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      Admission Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Admitted</label>
                        <p className="text-sm">{bill.admission.date}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Bed Type</label>
                        <p className="text-sm">{bill.admission.bedType}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Room</label>
                        <p className="text-sm">{bill.admission.room}</p>
                      </div>
                    </div>
                  </div>

                  {/* Billing Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Billing Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Room Charges:</span>
                        <span>${bill.billing.roomCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Procedures:</span>
                        <span>${bill.billing.procedures.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Consumables:</span>
                        <span>${bill.billing.consumables.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pharmacy:</span>
                        <span>${bill.billing.pharmacy.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>${bill.billing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                {bill.package && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Package Deal: {bill.package.name}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Package Amount:</span>
                        <span>${bill.package.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Utilized:</span>
                        <span>${bill.package.utilized.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(bill.package.utilized / bill.package.amount) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600">
                        {((bill.package.utilized / bill.package.amount) * 100).toFixed(1)}% utilized
                      </p>
                    </div>
                  </div>
                )}

                {/* Procedures List */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Recent Procedures
                  </h4>
                  <div className="space-y-2">
                    {bill.billing.procedures.map((procedure, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{procedure.name}</p>
                          <p className="text-xs text-gray-600">{procedure.date}</p>
                        </div>
                        <span className="font-medium">${procedure.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deposit and Balance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Deposit Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${bill.billing.deposit.toFixed(2)}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${bill.billing.balance < 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <p className="text-sm text-gray-600">Outstanding Balance</p>
                    <p className={`text-2xl font-bold ${bill.billing.balance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      ${Math.abs(bill.billing.balance).toFixed(2)}
                      {bill.billing.balance < 0 ? ' Due' : ' Credit'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {bill.billing.balance < 500 && (
                    <Button 
                      onClick={() => handleAddDeposit(bill.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Deposit
                    </Button>
                  )}
                  
                  {bill.status === 'Pending Discharge' && (
                    <Button 
                      onClick={() => handleDischarge(bill.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Process Discharge
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    View Details
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
