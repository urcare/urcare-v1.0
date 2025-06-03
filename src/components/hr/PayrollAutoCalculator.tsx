
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, FileText, TrendingUp, Download, Settings } from 'lucide-react';

export const PayrollAutoCalculator = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const payrollData = [
    {
      id: '1',
      employee: 'Dr. Sarah Wilson',
      department: 'ICU',
      basicSalary: 85000,
      overtime: 12500,
      nightShift: 8500,
      deductions: {
        pf: 10200,
        esi: 1700,
        tax: 15500,
        insurance: 2500
      },
      netSalary: 76100,
      status: 'processed'
    },
    {
      id: '2',
      employee: 'Nurse John Smith',
      department: 'Emergency',
      basicSalary: 45000,
      overtime: 6750,
      nightShift: 4500,
      deductions: {
        pf: 5400,
        esi: 900,
        tax: 7200,
        insurance: 1500
      },
      netSalary: 41250,
      status: 'pending'
    },
    {
      id: '3',
      employee: 'Dr. Lisa Davis',
      department: 'Cardiology',
      basicSalary: 95000,
      overtime: 8500,
      nightShift: 0,
      deductions: {
        pf: 11400,
        esi: 1900,
        tax: 18500,
        insurance: 2800
      },
      netSalary: 69900,
      status: 'processed'
    }
  ];

  const payrollSummary = {
    totalGross: 2456780,
    totalDeductions: 487356,
    totalNet: 1969424,
    employeeCount: 234,
    overtimeHours: 1256,
    bonusPayments: 156780
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processed: { label: 'Processed', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Error', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Auto Calculator</h2>
          <p className="text-gray-600">Automated salary processing with comprehensive deductions</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Payroll Settings
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(payrollSummary.totalGross / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Gross Salary</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(payrollSummary.totalDeductions / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Deductions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">₹{(payrollSummary.totalNet / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Net Payable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Payroll Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Employee Payroll Details
          </CardTitle>
          <CardDescription>Detailed salary calculations with automatic deductions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollData.map((employee) => (
              <div key={employee.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{employee.employee}</h4>
                    <p className="text-sm text-gray-600">{employee.department}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{employee.netSalary.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Net Salary</div>
                    </div>
                    {getStatusBadge(employee.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Earnings */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-700">Earnings</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span>₹{employee.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span>₹{employee.overtime.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Night Shift:</span>
                        <span>₹{employee.nightShift.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Gross Total:</span>
                        <span>₹{(employee.basicSalary + employee.overtime + employee.nightShift).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deductions */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-red-700">Deductions</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>PF (12%):</span>
                        <span>₹{employee.deductions.pf.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESI (3.25%):</span>
                        <span>₹{employee.deductions.esi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax:</span>
                        <span>₹{employee.deductions.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>₹{employee.deductions.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Deductions:</span>
                        <span>₹{Object.values(employee.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-700">Actions</h5>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Download Payslip
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {employee.status === 'pending' && (
                        <Button size="sm" className="w-full">
                          Process Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Payroll</CardTitle>
            <CardDescription>Salary distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>ICU Department</span>
                <div className="text-right">
                  <div className="font-bold">₹12.5L</div>
                  <div className="text-sm text-gray-600">28 employees</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Emergency Department</span>
                <div className="text-right">
                  <div className="font-bold">₹8.9L</div>
                  <div className="text-sm text-gray-600">22 employees</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Cardiology Department</span>
                <div className="text-right">
                  <div className="font-bold">₹10.2L</div>
                  <div className="text-sm text-gray-600">18 employees</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>General Medicine</span>
                <div className="text-right">
                  <div className="font-bold">₹15.6L</div>
                  <div className="text-sm text-gray-600">45 employees</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overtime Analysis</CardTitle>
            <CardDescription>Overtime costs and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Overtime Hours</span>
                <span className="font-bold">1,256 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Overtime Cost</span>
                <span className="font-bold">₹3.8L</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average OT per Employee</span>
                <span className="font-bold">5.4 hrs</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ICU Department</span>
                  <span>45% of total OT</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Emergency Dept</span>
                  <span>32% of total OT</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statutory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Statutory Compliance & Reports</CardTitle>
          <CardDescription>Government compliance and regulatory reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">PF Compliance</h5>
              <div className="text-2xl font-bold text-green-600">₹1.2L</div>
              <div className="text-sm text-gray-600">Monthly PF Contribution</div>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Generate PF Return
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">ESI Compliance</h5>
              <div className="text-2xl font-bold text-blue-600">₹45K</div>
              <div className="text-sm text-gray-600">Monthly ESI Contribution</div>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Generate ESI Return
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">TDS Compliance</h5>
              <div className="text-2xl font-bold text-purple-600">₹3.8L</div>
              <div className="text-sm text-gray-600">Monthly TDS Deducted</div>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Generate TDS Return
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
