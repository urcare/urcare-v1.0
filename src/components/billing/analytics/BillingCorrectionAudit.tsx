
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileEdit, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  DollarSign,
  User,
  Clock
} from 'lucide-react';

interface CorrectionLog {
  id: string;
  originalBill: number;
  correctedBill: number;
  correctionAmount: number;
  reason: string;
  correctedBy: string;
  approvedBy: string;
  patientName: string;
  patientNotified: boolean;
  refundProcessed: boolean;
  refundMethod: string;
  timestamp: string;
}

export const BillingCorrectionAudit = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const correctionLogs: CorrectionLog[] = [
    {
      id: 'CORR001',
      originalBill: 2500.00,
      correctedBill: 2150.00,
      correctionAmount: -350.00,
      reason: 'Insurance co-payment adjustment',
      correctedBy: 'Finance Manager',
      approvedBy: 'Department Head',
      patientName: 'John Doe',
      patientNotified: true,
      refundProcessed: true,
      refundMethod: 'Credit Card',
      timestamp: '2024-06-01 14:30'
    },
    {
      id: 'CORR002',
      originalBill: 1800.00,
      correctedBill: 2100.00,
      correctionAmount: 300.00,
      reason: 'Additional procedure charges',
      correctedBy: 'Billing Clerk',
      approvedBy: 'Finance Manager',
      patientName: 'Jane Wilson',
      patientNotified: true,
      refundProcessed: false,
      refundMethod: 'N/A',
      timestamp: '2024-06-01 15:45'
    },
    {
      id: 'CORR003',
      originalBill: 950.00,
      correctedBill: 850.00,
      correctionAmount: -100.00,
      reason: 'Senior citizen discount applied',
      correctedBy: 'Reception',
      approvedBy: 'Department Head',
      patientName: 'Robert Smith',
      patientNotified: true,
      refundProcessed: true,
      refundMethod: 'Cash',
      timestamp: '2024-06-01 16:20'
    }
  ];

  const filteredLogs = correctionLogs.filter(log =>
    log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCorrections = correctionLogs.length;
  const totalCorrectionAmount = correctionLogs.reduce((sum, log) => sum + Math.abs(log.correctionAmount), 0);
  const pendingRefunds = correctionLogs.filter(log => !log.refundProcessed && log.correctionAmount < 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing Correction Audit System</h2>
          <p className="text-gray-600">Complete documentation of all billing changes</p>
        </div>
        
        <div className="w-64">
          <Input
            placeholder="Search corrections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Corrections</p>
                <p className="text-3xl font-bold text-blue-600">{totalCorrections}</p>
              </div>
              <FileEdit className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${totalCorrectionAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
                <p className="text-3xl font-bold text-amber-600">{pendingRefunds}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Correction</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(totalCorrectionAmount / totalCorrections).toFixed(0)}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correction Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Correction Log Entries</CardTitle>
          <CardDescription>Detailed audit trail of all billing corrections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileEdit className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{log.id}</h3>
                      <p className="text-gray-600">{log.patientName}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Timestamp</p>
                    <p className="font-medium">{log.timestamp}</p>
                  </div>
                </div>

                {/* Bill Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Original Bill</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${log.originalBill.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Corrected Bill</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${log.correctedBill.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Correction Amount</p>
                    <p className={`text-2xl font-bold ${log.correctionAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {log.correctionAmount >= 0 ? '+' : ''}${log.correctionAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Correction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Correction Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reason:</span>
                        <span className="font-medium">{log.reason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Corrected By:</span>
                        <span className="font-medium">{log.correctedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved By:</span>
                        <span className="font-medium">{log.approvedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Patient Communication</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Patient Notified:</span>
                        <div className="flex items-center gap-2">
                          {log.patientNotified ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          )}
                          <Badge className={log.patientNotified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                            {log.patientNotified ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      
                      {log.correctionAmount < 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Refund Processed:</span>
                            <Badge className={log.refundProcessed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                              {log.refundProcessed ? 'Yes' : 'Pending'}
                            </Badge>
                          </div>
                          
                          {log.refundProcessed && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Refund Method:</span>
                              <span className="font-medium">{log.refundMethod}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  
                  {!log.patientNotified && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Notify Patient
                    </Button>
                  )}
                  
                  {log.correctionAmount < 0 && !log.refundProcessed && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Process Refund
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
