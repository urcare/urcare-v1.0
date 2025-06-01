
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Calendar,
  BarChart3,
  Clock
} from 'lucide-react';

interface PredictionEntry {
  medication: string;
  currentStock: number;
  averageDailyUse: number;
  seasonalFactor: number;
  predicted30DayNeed: number;
  daysUntilReorder: number;
  suggestedOrderQuantity: number;
  confidenceLevel: number;
  lastUpdated: string;
  alertLevel: 'Critical' | 'Low' | 'Reorder' | 'Overstock' | 'Normal';
  category: string;
  supplier: string;
  leadTime: number;
}

export const RefillPredictions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertFilter, setAlertFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const predictions: PredictionEntry[] = [
    {
      medication: 'Paracetamol 500mg',
      currentStock: 2400,
      averageDailyUse: 185,
      seasonalFactor: 1.2,
      predicted30DayNeed: 6660,
      daysUntilReorder: 8,
      suggestedOrderQuantity: 5000,
      confidenceLevel: 87,
      lastUpdated: '2024-06-01 08:00',
      alertLevel: 'Reorder',
      category: 'Analgesics',
      supplier: 'MedSupply Corp',
      leadTime: 3
    },
    {
      medication: 'Amoxicillin 500mg',
      currentStock: 450,
      averageDailyUse: 75,
      seasonalFactor: 0.9,
      predicted30DayNeed: 2025,
      daysUntilReorder: 2,
      suggestedOrderQuantity: 2500,
      confidenceLevel: 92,
      lastUpdated: '2024-06-01 08:00',
      alertLevel: 'Critical',
      category: 'Antibiotics',
      supplier: 'PharmaLink Ltd',
      leadTime: 5
    },
    {
      medication: 'Insulin Glargine 100 units/mL',
      currentStock: 120,
      averageDailyUse: 8,
      seasonalFactor: 1.0,
      predicted30DayNeed: 240,
      daysUntilReorder: 5,
      suggestedOrderQuantity: 200,
      confidenceLevel: 94,
      lastUpdated: '2024-06-01 08:00',
      alertLevel: 'Low',
      category: 'Diabetes',
      supplier: 'BioMed Solutions',
      leadTime: 7
    },
    {
      medication: 'Morphine 10mg',
      currentStock: 8500,
      averageDailyUse: 25,
      seasonalFactor: 1.1,
      predicted30DayNeed: 825,
      daysUntilReorder: 95,
      suggestedOrderQuantity: 0,
      confidenceLevel: 78,
      lastUpdated: '2024-06-01 08:00',
      alertLevel: 'Overstock',
      category: 'Controlled Substances',
      supplier: 'SecurePharma Inc',
      leadTime: 14
    }
  ];

  const getAlertBadge = (alertLevel: string) => {
    const variants: { [key: string]: string } = {
      'Critical': 'bg-red-100 text-red-800',
      'Low': 'bg-yellow-100 text-yellow-800',
      'Reorder': 'bg-blue-100 text-blue-800',
      'Overstock': 'bg-purple-100 text-purple-800',
      'Normal': 'bg-green-100 text-green-800'
    };
    return variants[alertLevel] || 'bg-gray-100 text-gray-800';
  };

  const getAlertIcon = (alertLevel: string) => {
    switch (alertLevel) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Low':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Reorder':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'Overstock':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const handlePlaceOrder = (medication: string, quantity: number) => {
    console.log(`Placing order for ${medication}: ${quantity} units`);
  };

  const handleUpdateStock = (medication: string) => {
    console.log(`Updating stock count for ${medication}`);
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prediction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlert = alertFilter === 'all' || prediction.alertLevel === alertFilter;
    const matchesCategory = categoryFilter === 'all' || prediction.category === categoryFilter;
    
    return matchesSearch && matchesAlert && matchesCategory;
  });

  const summaryStats = {
    totalItems: predictions.length,
    criticalAlerts: predictions.filter(p => p.alertLevel === 'Critical').length,
    lowStock: predictions.filter(p => p.alertLevel === 'Low').length,
    reorderDue: predictions.filter(p => p.alertLevel === 'Reorder').length,
    overstock: predictions.filter(p => p.alertLevel === 'Overstock').length
  };

  const categories = [...new Set(predictions.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Refill Need Prediction Analytics</h2>
          <p className="text-gray-600">AI-powered inventory forecasting and automated reorder recommendations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span>{summaryStats.totalItems} medications tracked</span>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Stock</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reorder Due</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.reorderDue}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overstock</p>
                <p className="text-2xl font-bold text-purple-600">{summaryStats.overstock}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">89%</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by medication or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Alert Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Low">Low Stock</SelectItem>
                <SelectItem value="Reorder">Reorder</SelectItem>
                <SelectItem value="Overstock">Overstock</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Analytics */}
      <div className="space-y-4">
        {filteredPredictions.map((prediction, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getAlertIcon(prediction.alertLevel)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{prediction.medication}</h3>
                    <p className="text-sm text-gray-600">{prediction.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getAlertBadge(prediction.alertLevel)}>
                    {prediction.alertLevel}
                  </Badge>
                  <Badge variant="outline">
                    {prediction.confidenceLevel}% confidence
                  </Badge>
                </div>
              </div>

              {/* Stock Level Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-500">Current Stock Level</label>
                  <span className="text-sm text-gray-600">
                    {prediction.currentStock} units ({prediction.daysUntilReorder > 0 ? prediction.daysUntilReorder : 0} days supply)
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, Math.min(100, (prediction.daysUntilReorder / 30) * 100))}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Usage Analytics</label>
                  <p className="font-medium mt-1">{prediction.averageDailyUse} units/day</p>
                  <p className="text-sm text-gray-600">
                    Seasonal factor: {prediction.seasonalFactor}x
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">30-Day Forecast</label>
                  <p className="font-bold text-blue-600 mt-1 text-lg">
                    {prediction.predicted30DayNeed.toLocaleString()} units
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Supplier Info</label>
                  <p className="font-medium mt-1">{prediction.supplier}</p>
                  <p className="text-sm text-gray-600">
                    Lead time: {prediction.leadTime} days
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{prediction.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              {prediction.suggestedOrderQuantity > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Reorder Recommendation</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Suggested order quantity: <span className="font-bold">{prediction.suggestedOrderQuantity.toLocaleString()} units</span>
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handlePlaceOrder(prediction.medication, prediction.suggestedOrderQuantity)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Place Order
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStock(prediction.medication)}
                      variant="outline"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Update Count
                    </Button>
                  </div>
                </div>
              )}

              {prediction.alertLevel === 'Overstock' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">Overstock Alert</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Current stock will last approximately <span className="font-bold">{prediction.daysUntilReorder} days</span>. 
                    Consider redistributing to other facilities or adjusting future orders.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
