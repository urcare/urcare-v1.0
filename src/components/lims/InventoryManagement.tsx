
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Truck,
  ShoppingCart,
  BarChart3,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  Plus,
  Filter,
  Download
} from 'lucide-react';

export const InventoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('reagents');

  const inventoryItems = [
    {
      id: 'REG001',
      name: 'Glucose Reagent Kit',
      category: 'reagents',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unit: 'kits',
      cost: 125.50,
      supplier: 'LabCorp Supplies',
      expiryDate: '2024-08-15',
      lastOrdered: '2024-01-10',
      usage: { daily: 8, weekly: 56, monthly: 240 },
      status: 'low_stock'
    },
    {
      id: 'REG002',
      name: 'Hemoglobin Analyzer Reagent',
      category: 'reagents',
      currentStock: 89,
      minStock: 30,
      maxStock: 150,
      unit: 'bottles',
      cost: 89.75,
      supplier: 'MediTech Inc',
      expiryDate: '2024-06-20',
      lastOrdered: '2024-01-05',
      usage: { daily: 4, weekly: 28, monthly: 120 },
      status: 'adequate'
    },
    {
      id: 'CON001',
      name: 'Sample Collection Tubes',
      category: 'consumables',
      currentStock: 2340,
      minStock: 500,
      maxStock: 5000,
      unit: 'pieces',
      cost: 0.45,
      supplier: 'Medical Supplies Co',
      expiryDate: '2025-12-31',
      lastOrdered: '2024-01-15',
      usage: { daily: 150, weekly: 1050, monthly: 4500 },
      status: 'adequate'
    },
    {
      id: 'CON002',
      name: 'Pipette Tips (1000μL)',
      category: 'consumables',
      currentStock: 89,
      minStock: 200,
      maxStock: 2000,
      unit: 'boxes',
      cost: 24.99,
      supplier: 'Lab Equipment Pro',
      expiryDate: 'N/A',
      lastOrdered: '2023-12-20',
      usage: { daily: 12, weekly: 84, monthly: 360 },
      status: 'critical'
    },
    {
      id: 'EQP001',
      name: 'Centrifuge Maintenance Kit',
      category: 'equipment',
      currentStock: 3,
      minStock: 2,
      maxStock: 10,
      unit: 'kits',
      cost: 450.00,
      supplier: 'Equipment Services Ltd',
      expiryDate: '2026-01-15',
      lastOrdered: '2024-01-08',
      usage: { daily: 0.1, weekly: 0.7, monthly: 3 },
      status: 'adequate'
    }
  ];

  const suppliers = [
    {
      name: 'LabCorp Supplies',
      items: 15,
      totalValue: 12450.50,
      performance: 94.5,
      avgDelivery: '3-5 days',
      reliability: 'excellent'
    },
    {
      name: 'MediTech Inc',
      items: 8,
      totalValue: 8920.25,
      performance: 89.2,
      avgDelivery: '5-7 days',
      reliability: 'good'
    },
    {
      name: 'Medical Supplies Co',
      items: 22,
      totalValue: 6780.90,
      performance: 96.8,
      avgDelivery: '2-4 days',
      reliability: 'excellent'
    },
    {
      name: 'Lab Equipment Pro',
      items: 12,
      totalValue: 4560.75,
      performance: 87.1,
      avgDelivery: '7-10 days',
      reliability: 'fair'
    }
  ];

  const reorderAlerts = [
    {
      item: 'Pipette Tips (1000μL)',
      currentStock: 89,
      minStock: 200,
      urgency: 'critical',
      estimatedRunout: '3 days',
      suggestedOrder: 500,
      cost: 12495.00
    },
    {
      item: 'Glucose Reagent Kit',
      currentStock: 45,
      minStock: 50,
      urgency: 'high',
      estimatedRunout: '6 days',
      suggestedOrder: 100,
      cost: 12550.00
    },
    {
      item: 'CBC Analyzer Reagent',
      currentStock: 28,
      minStock: 25,
      urgency: 'medium',
      estimatedRunout: '12 days',
      suggestedOrder: 75,
      cost: 8925.00
    }
  ];

  const inventoryMetrics = {
    totalValue: 156780.50,
    lowStockItems: 8,
    criticalItems: 3,
    expiringItems: 5,
    pendingOrders: 12,
    monthlyConsumption: 45680.25
  };

  const costAnalytics = {
    monthlySpend: 45680.25,
    yearlyProjection: 548163.00,
    topCategories: [
      { name: 'Reagents', spend: 28450.50, percentage: 62.3 },
      { name: 'Consumables', spend: 12890.75, percentage: 28.2 },
      { name: 'Equipment', spend: 4339.00, percentage: 9.5 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track supplies, manage reorders, and optimize inventory costs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">${inventoryMetrics.totalValue.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Total Value</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{inventoryMetrics.lowStockItems}</p>
            <p className="text-sm text-yellow-700">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{inventoryMetrics.criticalItems}</p>
            <p className="text-sm text-red-700">Critical</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{inventoryMetrics.expiringItems}</p>
            <p className="text-sm text-orange-700">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{inventoryMetrics.pendingOrders}</p>
            <p className="text-sm text-purple-700">Pending Orders</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">${inventoryMetrics.monthlyConsumption.toLocaleString()}</p>
            <p className="text-sm text-green-700">Monthly Usage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="reorders">Reorder Alerts</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Cost Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 mb-4">
            {['reagents', 'consumables', 'equipment'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Current stock levels and item details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems
                  .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                  .map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.id} • {item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          item.status === 'critical' ? 'bg-red-500' :
                          item.status === 'low_stock' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white`}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-lg font-bold text-gray-900">{item.currentStock} {item.unit}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Min Stock</p>
                        <p className="font-medium">{item.minStock} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max Stock</p>
                        <p className="font-medium">{item.maxStock} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Unit Cost</p>
                        <p className="font-medium">${item.cost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Usage</p>
                        <p className="font-medium">{item.usage.monthly} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expires</p>
                        <p className="font-medium">{item.expiryDate}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Stock Level</span>
                        <span>{Math.round((item.currentStock / item.maxStock) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(item.currentStock / item.maxStock) * 100} 
                        className={`h-2 ${
                          item.currentStock <= item.minStock ? 'text-red-600' : 'text-green-600'
                        }`} 
                      />
                    </div>

                    <div className="flex gap-2">
                      {item.status !== 'adequate' && (
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Reorder
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Usage History
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Alerts</CardTitle>
              <CardDescription>Items requiring immediate or upcoming reorders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reorderAlerts.map((alert, index) => (
                  <div key={index} className={`border-l-4 p-4 rounded ${
                    alert.urgency === 'critical' ? 'border-l-red-500 bg-red-50' :
                    alert.urgency === 'high' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.item}</h4>
                        <p className="text-sm text-gray-600">Current: {alert.currentStock} | Min: {alert.minStock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          alert.urgency === 'critical' ? 'bg-red-500' :
                          alert.urgency === 'high' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white`}>
                          {alert.urgency}
                        </Badge>
                        <Bell className={`h-5 w-5 ${
                          alert.urgency === 'critical' ? 'text-red-600' :
                          alert.urgency === 'high' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Runout</p>
                        <p className="font-bold text-red-600">{alert.estimatedRunout}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Suggested Order</p>
                        <p className="font-medium">{alert.suggestedOrder} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Cost</p>
                        <p className="font-medium">${alert.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <p className={`font-bold ${
                          alert.urgency === 'critical' ? 'text-red-600' :
                          alert.urgency === 'high' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {alert.urgency.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Order Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Order
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Adjust Thresholds
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance</CardTitle>
              <CardDescription>Track supplier reliability and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                        <p className="text-sm text-gray-600">{supplier.items} items • ${supplier.totalValue.toLocaleString()} total value</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          supplier.reliability === 'excellent' ? 'bg-green-500' :
                          supplier.reliability === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                        } text-white`}>
                          {supplier.reliability}
                        </Badge>
                        <span className="text-lg font-bold text-gray-900">{supplier.performance}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Items Supplied</p>
                        <p className="text-xl font-bold text-blue-600">{supplier.items}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-xl font-bold text-green-600">${supplier.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        <p className="text-xl font-bold text-purple-600">{supplier.performance}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery Time</p>
                        <p className="text-xl font-bold text-orange-600">{supplier.avgDelivery}</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Performance Score</span>
                        <span>{supplier.performance}%</span>
                      </div>
                      <Progress value={supplier.performance} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Place Order
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View History
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Spending breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-900">${costAnalytics.monthlySpend.toLocaleString()}</p>
                    <p className="text-sm text-blue-700">Monthly Spend</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-900">${costAnalytics.yearlyProjection.toLocaleString()}</p>
                    <p className="text-sm text-green-700">Yearly Projection</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Spending by Category</h4>
                    <div className="space-y-2">
                      {costAnalytics.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">${category.spend.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">({category.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
                <CardDescription>Cost-saving recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Bulk Order Savings</h4>
                    <p className="text-sm text-green-700">Consolidate orders to save 12% on shipping costs</p>
                    <p className="text-xs text-green-600">Potential saving: $2,450/month</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Alternative Suppliers</h4>
                    <p className="text-sm text-blue-700">Switch to competitive suppliers for 3 items</p>
                    <p className="text-xs text-blue-600">Potential saving: $1,890/month</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-1">Expiry Reduction</h4>
                    <p className="text-sm text-yellow-700">Optimize order quantities to reduce waste</p>
                    <p className="text-xs text-yellow-600">Potential saving: $890/month</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">Usage Optimization</h4>
                    <p className="text-sm text-purple-700">Implement lean inventory practices</p>
                    <p className="text-xs text-purple-600">Potential saving: $1,230/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
