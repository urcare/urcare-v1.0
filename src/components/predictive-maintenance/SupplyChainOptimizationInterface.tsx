
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Truck,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export const SupplyChainOptimizationInterface = () => {
  const [inventoryItems] = useState([
    {
      id: 'MED-001',
      name: 'Surgical Masks (Box of 50)',
      category: 'PPE',
      currentStock: 245,
      minThreshold: 100,
      maxThreshold: 500,
      demandForecast: 180,
      reorderPoint: 120,
      leadTime: 3,
      avgConsumption: 45,
      trend: 'increasing',
      predictedStockout: null,
      autoReorder: true
    },
    {
      id: 'MED-002',
      name: 'Disposable Gloves (Box of 100)',
      category: 'PPE',
      currentStock: 78,
      minThreshold: 150,
      maxThreshold: 600,
      demandForecast: 220,
      reorderPoint: 180,
      leadTime: 5,
      avgConsumption: 65,
      trend: 'critical',
      predictedStockout: '2024-06-18',
      autoReorder: true
    },
    {
      id: 'MED-003',
      name: 'IV Bags (500ml Saline)',
      category: 'Medical Supplies',
      currentStock: 156,
      minThreshold: 80,
      maxThreshold: 300,
      demandForecast: 95,
      reorderPoint: 100,
      leadTime: 7,
      avgConsumption: 28,
      trend: 'stable',
      predictedStockout: null,
      autoReorder: false
    },
    {
      id: 'MED-004',
      name: 'Syringes (10ml)',
      category: 'Medical Supplies',
      currentStock: 432,
      minThreshold: 200,
      maxThreshold: 800,
      demandForecast: 185,
      reorderPoint: 250,
      leadTime: 4,
      avgConsumption: 52,
      trend: 'decreasing',
      predictedStockout: null,
      autoReorder: true
    }
  ]);

  const getStockStatus = (item) => {
    if (item.predictedStockout || item.currentStock <= item.minThreshold) return 'critical';
    if (item.currentStock <= item.reorderPoint) return 'warning';
    return 'normal';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-700 border-red-300';
      case 'warning': return 'text-yellow-700 border-yellow-300';
      case 'normal': return 'text-green-700 border-green-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Supply Chain Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">342</div>
            <div className="text-sm text-gray-600">Items in Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">18</div>
            <div className="text-sm text-gray-600">Low Stock Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">$245K</div>
            <div className="text-sm text-gray-600">Inventory Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">94.2%</div>
            <div className="text-sm text-gray-600">Forecast Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stock Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Critical Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <Package className="h-4 w-4" />
              <span>Disposable Gloves predicted to stock out by June 18, 2024</span>
            </div>
            <div className="flex items-center gap-2 text-red-700">
              <Truck className="h-4 w-4" />
              <span>3 items below minimum threshold requiring immediate reorder</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="space-y-4">
        {inventoryItems.map((item) => {
          const status = getStockStatus(item);
          return (
            <Card key={item.id} className={`border-l-4 ${status === 'critical' ? 'border-l-red-500' : status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-gray-600">{item.id} • {item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(item.trend)}
                    <Badge variant="outline" className={getStockColor(status)}>
                      {status === 'critical' ? 'Critical' : status === 'warning' ? 'Low Stock' : 'Normal'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Current Stock</div>
                    <div className={`text-2xl font-bold ${status === 'critical' ? 'text-red-600' : status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {item.currentStock}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minThreshold} • Max: {item.maxThreshold}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Demand Forecast</div>
                    <div className="text-lg font-semibold text-blue-600">{item.demandForecast}</div>
                    <div className="text-xs text-gray-500">Next 30 days</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Avg Consumption</div>
                    <div className="text-lg font-semibold">{item.avgConsumption}/day</div>
                    <div className="text-xs text-gray-500">Lead time: {item.leadTime} days</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Reorder Point</div>
                    <div className="text-lg font-semibold text-orange-600">{item.reorderPoint}</div>
                    <div className="text-xs text-gray-500">
                      {item.autoReorder ? 'Auto-reorder enabled' : 'Manual reorder'}
                    </div>
                  </div>
                </div>

                {item.predictedStockout && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Predicted Stockout: {new Date(item.predictedStockout).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Immediate reorder recommended to avoid stockout
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Reorder Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Forecast
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Supplier Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">MedSupply Corp</div>
              <div className="text-sm text-gray-600 mb-2">Primary PPE Supplier</div>
              <div className="space-y-1">
                <div className="text-sm">On-time delivery: <span className="font-semibold text-green-600">94.2%</span></div>
                <div className="text-sm">Quality score: <span className="font-semibold text-blue-600">98.7%</span></div>
                <div className="text-sm">Lead time: <span className="font-semibold">3.2 days</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">Healthcare Solutions Inc</div>
              <div className="text-sm text-gray-600 mb-2">Medical Equipment</div>
              <div className="space-y-1">
                <div className="text-sm">On-time delivery: <span className="font-semibold text-yellow-600">87.8%</span></div>
                <div className="text-sm">Quality score: <span className="font-semibold text-blue-600">96.4%</span></div>
                <div className="text-sm">Lead time: <span className="font-semibold">5.1 days</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">Pharma Direct</div>
              <div className="text-sm text-gray-600 mb-2">Pharmaceutical Supplies</div>
              <div className="space-y-1">
                <div className="text-sm">On-time delivery: <span className="font-semibold text-green-600">92.1%</span></div>
                <div className="text-sm">Quality score: <span className="font-semibold text-blue-600">99.2%</span></div>
                <div className="text-sm">Lead time: <span className="font-semibold">4.8 days</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
