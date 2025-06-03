
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Calculator, 
  FileText, 
  Building,
  MapPin,
  Download,
  Settings,
  AlertCircle
} from 'lucide-react';

interface TaxConfiguration {
  serviceType: string;
  hsnSacCode: string;
  gstRate: number;
  exemptionApplicable: boolean;
  category: string;
}

interface TaxCalculation {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  netAmount: number;
}

export const GSTVATEngine = () => {
  const [selectedService, setSelectedService] = useState('consultation');
  const [baseAmount, setBaseAmount] = useState(2500);
  const [customerState, setCustomerState] = useState('same');
  const [corporateCustomer, setCorporateCustomer] = useState(false);

  const taxConfigurations: TaxConfiguration[] = [
    {
      serviceType: 'Medical Consultation',
      hsnSacCode: '9940',
      gstRate: 0,
      exemptionApplicable: true,
      category: 'Medical Services'
    },
    {
      serviceType: 'Diagnostic Services',
      hsnSacCode: '9940',
      gstRate: 5,
      exemptionApplicable: false,
      category: 'Diagnostics'
    },
    {
      serviceType: 'Surgical Procedures',
      hsnSacCode: '9940',
      gstRate: 5,
      exemptionApplicable: false,
      category: 'Medical Services'
    },
    {
      serviceType: 'Pharmacy Sales',
      hsnSacCode: '3004',
      gstRate: 12,
      exemptionApplicable: false,
      category: 'Pharmaceuticals'
    },
    {
      serviceType: 'Medical Equipment',
      hsnSacCode: '9018',
      gstRate: 18,
      exemptionApplicable: false,
      category: 'Equipment'
    },
    {
      serviceType: 'Health Insurance',
      hsnSacCode: '9954',
      gstRate: 18,
      exemptionApplicable: false,
      category: 'Insurance'
    }
  ];

  const stateGSTRates = {
    'delhi': { sgst: 9, cgst: 9 },
    'mumbai': { sgst: 9, cgst: 9 },
    'bangalore': { sgst: 9, cgst: 9 },
    'chennai': { sgst: 9, cgst: 9 },
    'kolkata': { sgst: 9, cgst: 9 }
  };

  const exemptServices = [
    'Basic Medical Consultation',
    'Emergency Services',
    'Pathology Services (Basic)',
    'Blood Bank Services',
    'Ambulance Services'
  ];

  const calculateTax = (): TaxCalculation => {
    const config = taxConfigurations.find(t => t.serviceType.toLowerCase().includes(selectedService));
    
    if (!config) {
      return {
        baseAmount,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        netAmount: baseAmount
      };
    }

    if (config.exemptionApplicable) {
      return {
        baseAmount,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        netAmount: baseAmount
      };
    }

    const gstRate = config.gstRate;
    let cgst = 0, sgst = 0, igst = 0;

    if (customerState === 'same') {
      // Same state - CGST + SGST
      cgst = (baseAmount * gstRate) / 200; // Half of GST rate
      sgst = (baseAmount * gstRate) / 200; // Half of GST rate
    } else {
      // Different state - IGST
      igst = (baseAmount * gstRate) / 100;
    }

    const totalTax = cgst + sgst + igst;
    const netAmount = baseAmount + totalTax;

    return {
      baseAmount,
      cgst,
      sgst,
      igst,
      totalTax,
      netAmount
    };
  };

  const taxCalc = calculateTax();
  const selectedConfig = taxConfigurations.find(t => t.serviceType.toLowerCase().includes(selectedService));

  const complianceReports = [
    { name: 'GSTR-1', dueDate: '2024-06-11', status: 'pending', period: 'May 2024' },
    { name: 'GSTR-3B', dueDate: '2024-06-20', status: 'filed', period: 'May 2024' },
    { name: 'GSTR-9', dueDate: '2024-12-31', status: 'upcoming', period: 'FY 2023-24' }
  ];

  const recentTransactions = [
    {
      invoice: 'INV-001',
      service: 'Diagnostic Services',
      amount: 5000,
      gst: 250,
      total: 5250,
      status: 'paid'
    },
    {
      invoice: 'INV-002',
      service: 'Consultation',
      amount: 2000,
      gst: 0,
      total: 2000,
      status: 'paid'
    },
    {
      invoice: 'INV-003',
      service: 'Pharmacy',
      amount: 1500,
      gst: 180,
      total: 1680,
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GST & VAT Computation Engine</h2>
          <p className="text-gray-600">Automated tax calculations and compliance management</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Tax Settings
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Reports
          </Button>
        </div>
      </div>

      {/* Tax Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tax Calculator
            </CardTitle>
            <CardDescription>Calculate GST for services and products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Service Type</Label>
              <select 
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="consultation">Medical Consultation</option>
                <option value="diagnostic">Diagnostic Services</option>
                <option value="surgical">Surgical Procedures</option>
                <option value="pharmacy">Pharmacy Sales</option>
                <option value="equipment">Medical Equipment</option>
                <option value="insurance">Health Insurance</option>
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Base Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={baseAmount}
                onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="state">Customer Location</Label>
              <select 
                id="state"
                value={customerState}
                onChange={(e) => setCustomerState(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="same">Same State</option>
                <option value="different">Different State</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="corporate"
                checked={corporateCustomer}
                onChange={(e) => setCorporateCustomer(e.target.checked)}
              />
              <Label htmlFor="corporate">Corporate Customer</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Breakdown</CardTitle>
            <CardDescription>Detailed tax calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span className="font-semibold">₹{taxCalc.baseAmount.toLocaleString()}</span>
              </div>
              
              {selectedConfig && (
                <div className="flex justify-between">
                  <span>HSN/SAC Code:</span>
                  <Badge variant="outline">{selectedConfig.hsnSacCode}</Badge>
                </div>
              )}

              {taxCalc.cgst > 0 && (
                <div className="flex justify-between">
                  <span>CGST ({selectedConfig?.gstRate && selectedConfig.gstRate / 2}%):</span>
                  <span>₹{taxCalc.cgst.toFixed(2)}</span>
                </div>
              )}

              {taxCalc.sgst > 0 && (
                <div className="flex justify-between">
                  <span>SGST ({selectedConfig?.gstRate && selectedConfig.gstRate / 2}%):</span>
                  <span>₹{taxCalc.sgst.toFixed(2)}</span>
                </div>
              )}

              {taxCalc.igst > 0 && (
                <div className="flex justify-between">
                  <span>IGST ({selectedConfig?.gstRate}%):</span>
                  <span>₹{taxCalc.igst.toFixed(2)}</span>
                </div>
              )}

              <hr />
              
              <div className="flex justify-between font-semibold">
                <span>Total Tax:</span>
                <span>₹{taxCalc.totalTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Net Amount:</span>
                <span>₹{taxCalc.netAmount.toFixed(2)}</span>
              </div>

              {selectedConfig?.exemptionApplicable && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Tax exemption applicable</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Configuration Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Tax Configuration Matrix
          </CardTitle>
          <CardDescription>Service-wise tax rates and HSN/SAC codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Service Type</th>
                  <th className="text-left p-3">HSN/SAC Code</th>
                  <th className="text-left p-3">GST Rate</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Exemption</th>
                </tr>
              </thead>
              <tbody>
                {taxConfigurations.map((config, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{config.serviceType}</td>
                    <td className="p-3">
                      <Badge variant="outline">{config.hsnSacCode}</Badge>
                    </td>
                    <td className="p-3">{config.gstRate}%</td>
                    <td className="p-3">{config.category}</td>
                    <td className="p-3">
                      {config.exemptionApplicable ? (
                        <Badge className="bg-green-100 text-green-800">Exempt</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Taxable</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Compliance Reports
            </CardTitle>
            <CardDescription>GST filing status and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.period}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Due: {report.dueDate}</div>
                    <Badge 
                      className={
                        report.status === 'filed' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tax Transactions</CardTitle>
            <CardDescription>Latest invoices with tax calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{transaction.invoice}</h4>
                    <p className="text-sm text-gray-600">{transaction.service}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">₹{transaction.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">GST: ₹{transaction.gst}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Tax Credit */}
      <Card>
        <CardHeader>
          <CardTitle>Input Tax Credit (ITC)</CardTitle>
          <CardDescription>Available ITC and utilization tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹45,230</div>
              <div className="text-sm text-gray-600">Available ITC</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹32,150</div>
              <div className="text-sm text-gray-600">Utilized This Month</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">₹13,080</div>
              <div className="text-sm text-gray-600">Carry Forward</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹8,920</div>
              <div className="text-sm text-gray-600">Reversal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
