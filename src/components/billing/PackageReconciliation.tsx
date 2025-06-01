
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package,
  TrendingUp,
  TrendingDown,
  Calculator,
  Eye,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface PackageUtilization {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  package: {
    name: string;
    type: 'Surgery' | 'Delivery' | 'Treatment' | 'Diagnostic';
    totalAmount: number;
    discountedAmount: number;
  };
  utilization: {
    servicesUsed: Array<{
      name: string;
      packageRate: number;
      individualRate: number;
      quantity: number;
      total: number;
    }>;
    totalUtilized: number;
    remainingBalance: number;
    utilizationPercentage: number;
  };
  variance: {
    packageVsIndividual: number;
    savingsAmount: number;
    efficiencyScore: number;
  };
  status: 'Active' | 'Completed' | 'Exceeded' | 'Underutilized';
  recommendations: string[];
  startDate: string;
  endDate?: string;
}

export const PackageReconciliation = () => {
  const [filterType, setFilterType] = useState('all');

  const packageUtilizations: PackageUtilization[] = [
    {
      id: 'PKG001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      package: {
        name: 'Cardiac Surgery Package',
        type: 'Surgery',
        totalAmount: 15000.00,
        discountedAmount: 13500.00
      },
      utilization: {
        servicesUsed: [
          { name: 'Pre-op Consultation', packageRate: 0, individualRate: 100, quantity: 1, total: 0 },
          { name: 'Angioplasty', packageRate: 0, individualRate: 8000, quantity: 1, total: 0 },
          { name: 'ICU Stay (3 days)', packageRate: 0, individualRate: 2000, quantity: 3, total: 0 },
          { name: 'Post-op Care', packageRate: 0, individualRate: 500, quantity: 2, total: 0 }
        ],
        totalUtilized: 13500.00,
        remainingBalance: 0.00,
        utilizationPercentage: 100
      },
      variance: {
        packageVsIndividual: 14600.00,
        savingsAmount: 1100.00,
        efficiencyScore: 92
      },
      status: 'Completed',
      recommendations: [
        'Package utilized efficiently',
        'Good cost savings achieved',
        'Consider similar packages for cardiac patients'
      ],
      startDate: '2024-05-28',
      endDate: '2024-06-01'
    },
    {
      id: 'PKG002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      package: {
        name: 'Maternity Care Package',
        type: 'Delivery',
        totalAmount: 8000.00,
        discountedAmount: 7200.00
      },
      utilization: {
        servicesUsed: [
          { name: 'Prenatal Checkups', packageRate: 0, individualRate: 800, quantity: 8, total: 0 },
          { name: 'Normal Delivery', packageRate: 0, individualRate: 3000, quantity: 1, total: 0 },
          { name: 'Room Charges (2 days)', packageRate: 0, individualRate: 400, quantity: 2, total: 0 }
        ],
        totalUtilized: 5600.00,
        remainingBalance: 1600.00,
        utilizationPercentage: 78
      },
      variance: {
        packageVsIndividual: 7200.00,
        savingsAmount: -1600.00,
        efficiencyScore: 68
      },
      status: 'Underutilized',
      recommendations: [
        'Package underutilized by 22%',
        'Consider shorter package duration',
        'Review package components for relevance'
      ],
      startDate: '2024-05-15',
      endDate: '2024-05-30'
    },
    {
      id: 'PKG003',
      patient: { name: 'Bob Chen', regId: 'REG001236', category: 'Employee' },
      package: {
        name: 'Comprehensive Health Checkup',
        type: 'Diagnostic',
        totalAmount: 2500.00,
        discountedAmount: 1250.00
      },
      utilization: {
        servicesUsed: [
          { name: 'Blood Tests Panel', packageRate: 0, individualRate: 200, quantity: 1, total: 0 },
          { name: 'Chest X-Ray', packageRate: 0, individualRate: 100, quantity: 1, total: 0 },
          { name: 'ECG', packageRate: 0, individualRate: 50, quantity: 1, total: 0 },
          { name: 'Ultrasound', packageRate: 0, individualRate: 150, quantity: 1, total: 0 },
          { name: 'Additional CT Scan', packageRate: 0, individualRate: 800, quantity: 1, total: 0 }
        ],
        totalUtilized: 1300.00,
        remainingBalance: -50.00,
        utilizationPercentage: 104
      },
      variance: {
        packageVsIndividual: 1300.00,
        savingsAmount: 50.00,
        efficiencyScore: 96
      },
      status: 'Exceeded',
      recommendations: [
        'Package slightly exceeded due to additional services',
        'Still cost-effective compared to individual billing',
        'Consider including CT scan in future packages'
      ],
      startDate: '2024-06-01',
      endDate: '2024-06-01'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Active': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Exceeded': 'bg-orange-100 text-orange-800',
      'Underutilized': 'bg-amber-100 text-amber-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getVarianceIcon = (amount: number) => {
    return amount >= 0 ? TrendingUp : TrendingDown;
  };

  const getVarianceColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const handleOptimizePackage = (packageId: string) => {
    console.log(`Optimizing package ${packageId}`);
  };

  const handleGenerateReport = (packageId: string) => {
    console.log(`Generating report for package ${packageId}`);
  };

  const filteredPackages = packageUtilizations.filter(pkg => 
    filterType === 'all' || pkg.package.type === filterType
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Package-to-Service Reconciliation</h2>
          <p className="text-gray-600">Monitor package utilization and optimize pricing strategies</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{filteredPackages.length} active packages</span>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Utilization</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(packageUtilizations.reduce((sum, pkg) => sum + pkg.utilization.utilizationPercentage, 0) / packageUtilizations.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${packageUtilizations.reduce((sum, pkg) => sum + Math.max(0, pkg.variance.savingsAmount), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(packageUtilizations.reduce((sum, pkg) => sum + pkg.variance.efficiencyScore, 0) / packageUtilizations.length)}/100
                </p>
              </div>
              <Calculator className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Optimization Needed</p>
                <p className="text-2xl font-bold text-amber-600">
                  {packageUtilizations.filter(pkg => pkg.status === 'Underutilized' || pkg.status === 'Exceeded').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Analysis Cards */}
      <div className="grid gap-6">
        {filteredPackages.map((pkg) => {
          const VarianceIcon = getVarianceIcon(pkg.variance.savingsAmount);
          
          return (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">{pkg.package.name}</h3>
                      <p className="text-gray-600">{pkg.patient.name} ({pkg.patient.regId})</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{pkg.package.type}</Badge>
                        <Badge variant="outline">{pkg.patient.category}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(pkg.status)}>
                      {pkg.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Package Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Package Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Original Price:</span>
                        <span className="text-sm line-through">${pkg.package.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Package Price:</span>
                        <span className="font-semibold">${pkg.package.discountedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm">
                          {pkg.startDate} {pkg.endDate ? `- ${pkg.endDate}` : '(Ongoing)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Utilization Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Utilization Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Package Utilization</span>
                          <span>{pkg.utilization.utilizationPercentage}%</span>
                        </div>
                        <Progress value={Math.min(100, pkg.utilization.utilizationPercentage)} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount Used:</span>
                        <span>${pkg.utilization.totalUtilized.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className={pkg.utilization.remainingBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                          ${Math.abs(pkg.utilization.remainingBalance).toFixed(2)}
                          {pkg.utilization.remainingBalance < 0 ? ' Over' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Cost Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Individual Pricing:</span>
                        <span className="text-sm">${pkg.variance.packageVsIndividual.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Package Pricing:</span>
                        <span className="text-sm">${pkg.utilization.totalUtilized.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Variance:</span>
                        <div className="flex items-center gap-1">
                          <VarianceIcon className={`w-4 h-4 ${getVarianceColor(pkg.variance.savingsAmount)}`} />
                          <span className={`text-sm font-semibold ${getVarianceColor(pkg.variance.savingsAmount)}`}>
                            ${Math.abs(pkg.variance.savingsAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Efficiency Score:</span>
                        <span className={`font-semibold ${getEfficiencyColor(pkg.variance.efficiencyScore)}`}>
                          {pkg.variance.efficiencyScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Breakdown */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Services Utilized</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkg.utilization.servicesUsed.map((service, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{service.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {service.quantity} × ${service.individualRate.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              Included in Package
                            </p>
                            <p className="text-xs text-gray-600">
                              (Worth ${(service.individualRate * service.quantity).toFixed(2)})
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Optimization Recommendations</h4>
                  <ul className="space-y-1">
                    {pkg.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleOptimizePackage(pkg.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Optimize Package
                  </Button>
                  
                  <Button 
                    onClick={() => handleGenerateReport(pkg.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    View Service Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
