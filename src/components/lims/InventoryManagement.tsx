
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  ShoppingCart,
  BarChart3,
  Clock,
  DollarSign,
  Truck,
  Settings,
  Download
} from 'lucide-react';

export const InventoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const inventoryOverview = {
    totalItems: 1247,
    lowStockItems: 23,
    expiringSoon: 15,
    totalValue: 485600,
    monthlyConsumption: 89450,
    reorderAlerts: 12
  };

  const inventoryItems = [
    {
      id: 'REG001',
      name: 'Chemistry Reagent Kit A',
      category: 'reagents',
      currentStock: 15,
      minimumStock: 20,
      maximumStock: 100,
      unitCost: 125.50,
      supplier: 'BioChem Solutions',
      expiryDate: '2024-06-15',
      consumption: 8.5,
      status: 'low'
    },
    {
      id: 'REG002',
      name: 'Hematology Control Serum',
      category: 'controls',
      currentStock: 45,
      minimumStock: 30,
      maximumStock: 80,
      unitCost: 85.25,
      supplier: 'Lab Supplies Inc',
      expiryDate: '2024-08-20',
      consumption: 12.3,
      status: 'normal'
    },
    {
      id: 'SUP001',
      name: 'Sample Collection Tubes',
      category: 'supplies',
      currentStock: 8,
      minimumStock: 50,
      maximumStock: 500,
      unitCost: 0.75,
      supplier: 'MedSupply Co',
      expiryDate: '2025-12-31',
      consumption: 45.2,
      status: 'critical'
    },
    {
      id: 'CAL001',
      name: 'Multi-Parameter Calibrator',
      category: 'calibrators',
      currentStock: 12,
      minimumStock: 10,
      maximumStock: 25,
      unitCost: 240.00,
      supplier: 'Precision Labs',
      expiryDate: '2024-04-30',
      consumption: 3.8,
      status: 'expiring'
    },
    {
      id: 'REG003',
      name: 'Immunoassay Buffer Solution',
      category: 'reagents',
      currentStock: 67,
      minimumStock: 40,
      maximumStock: 120,
      unitCost: 95.75,
      supplier: 'ImmunoTech Ltd',
      expiryDate: '2024-09-15',
      consumption: 15.7,
      status: 'normal'
    }
  ];

  const suppliers = [
    {
      name: 'BioChem Solutions',
      contact: 'orders@biochemsol.com',
      phone: '+1-555-0101',
      rating: 4.8,
      leadTime: 3,
      reliability: 98.5,
      totalOrders: 45,
      averageDelivery: 2.8
    },
    {
      name: 'Lab Supplies Inc',
      contact: 'sales@labsupplies.com',
      phone: '+1-555-0102',
      rating: 4.6,
      leadTime: 5,
      reliability: 96.2,
      totalOrders: 32,
      averageDelivery: 4.2
    },
    {
      name: 'MedSupply Co',
      contact: 'support@medsupply.com',
      phone: '+1-555-0103',
      rating: 4.4,
      leadTime: 7,
      reliability: 94.8,
      totalOrders: 28,
      averageDelivery: 6.5
    },
    {
      name: 'Precision Labs',
      contact: 'info@precisionlabs.com',
      phone: '+1-555-0104',
      rating: 4.9,
      leadTime: 2,
      reliability: 99.1,
      totalOrders: 18,
      averageDelivery: 1.9
    }
  ];

  const consumptionAnalysis = [
    { month: 'Jan', reagents: 78500, supplies: 12300, controls: 8900, calibrators: 15400 },
    { month: 'Feb', reagents: 82100, supplies: 13800, controls: 9400, calibrators: 16200 },
    { month: 'Mar', reagents: 89450, supplies: 15200, controls: 10100, calibrators: 17800 }
  ];

  const reorderRecommendations = [
    {
      item: 'Sample Collection Tubes',
      currentStock: 8,
      recommendedOrder: 450,
      estimatedCost: 337.50,
      urgency: 'critical',
      leadTime: 7,
      supplier: 'MedSupply Co'
    },
    {
      item: 'Chemistry Reagent Kit A',
      currentStock: 15,
      recommendedOrder: 85,
      estimatedCost: 10667.50,
      urgency: 'high',
      leadTime: 3,
      supplier: 'BioChem Solutions'
    },
    {
      item: 'Multi-Parameter Calibrator',
      currentStock: 12,
      recommendedOrder: 13,
      estimatedCost: 3120.00,
      urgency: 'medium',
      leadTime: 2,
      supplier: 'Precision Labs'
    }
  ];

  const expiryAlerts = [
    {
      item: 'Multi-Parameter Calibrator',
      expiryDate: '2024-04-30',
      daysRemaining: 35,
      currentStock: 12,
      estimatedUsage: 15,
      action: 'Increase usage rate'
    },
    {
      item: 'Quality Control Serum',
      expiryDate: '2024-05-15',
      daysRemaining: 50,
      currentStock: 8,
      estimatedUsage: 6,
      action: 'Stock will expire - use first'
    },
    {
      item: 'Buffer Solution Type B',
      expiryDate: '2024-06-15',
      daysRemaining: 81,
      currentStock: 25,
      estimatedUsage: 30,
      action: 'Normal consumption'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Laboratory supply chain and inventory optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Inventory
          </Button>
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{inventoryOverview.totalItems}</p>
            <p className="text-sm text-blue-700">Total Items</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{inventoryOverview.lowStockItems}</p>
            <p className="text-sm text-red-700">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{inventoryOverview.expiringSoon}</p>
            <p className="text-sm text-orange-700">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">${inventoryOverview.totalValue.toLocaleString()}</p>
            <p className="text-sm text-green-700">Total Value</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">${inventoryOverview.monthlyConsumption.toLocaleString()}</p>
            <p className="text-sm text-purple-700">Monthly Usage</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{inventoryOverview.reorderAlerts}</p>
            <p className="text-sm text-indigo-700">Reorder Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Alerts</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory Status</CardTitle>
              <CardDescription>Real-time inventory levels and stock status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map((item, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    item.status === 'critical' ? 'border-red-200 bg-red-50' :
                    item.status === 'low' ? 'border-yellow-200 bg-yellow-50' :
                    item.status === 'expiring' ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.id} • {item.supplier}</p>
                      </div>
                      <Badge className={`${
                        item.status === 'critical' ? 'bg-red-500' :
                        item.status === 'low' ? 'bg-yellow-500' :
                        item.status === 'expiring' ? 'bg-orange-500' : 'bg-green-500'
                      } text-white`}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="text-lg font-bold text-gray-900">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min Stock</p>
                        <p className="text-sm font-medium text-gray-700">{item.minimumStock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Unit Cost</p>
                        <p className="text-sm font-medium text-gray-700">${item.unitCost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expiry Date</p>
                        <p className="text-sm font-medium text-gray-700">{item.expiryDate}</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Stock Level</span>
                        <span>{item.currentStock}/{item.maximumStock}</span>
                      </div>
                      <Progress value={(item.currentStock / item.maximumStock) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Recommendations</CardTitle>
              <CardDescription>AI-powered reorder suggestions based on consumption patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reorderRecommendations.map((rec, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    rec.urgency === 'critical' ? 'border-red-200 bg-red-50' :
                    rec.urgency === 'high' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rec.item}</h4>
                        <p className="text-sm text-gray-600">Supplier: {rec.supplier}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          rec.urgency === 'critical' ? 'bg-red-500' :
                          rec.urgency === 'high' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white text-xs`}>
                          {rec.urgency}
                        </Badge>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Order Now
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="text-lg font-bold text-gray-900">{rec.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Recommended Order</p>
                        <p className="text-lg font-bold text-blue-600">{rec.recommendedOrder}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Cost</p>
                        <p className="text-lg font-bold text-green-600">${rec.estimatedCost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lead Time</p>
                        <p className="text-sm font-medium text-gray-700">{rec.leadTime} days</p>
                      </div>
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
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>Supplier performance and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                        <p className="text-sm text-gray-600">{supplier.contact} • {supplier.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-700 border-green-500">
                          {supplier.rating}/5.0
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Truck className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Lead Time</p>
                        <p className="text-lg font-bold text-gray-900">{supplier.leadTime} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reliability</p>
                        <p className="text-lg font-bold text-green-600">{supplier.reliability}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-lg font-bold text-blue-600">{supplier.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Delivery</p>
                        <p className="text-sm font-medium text-gray-700">{supplier.averageDelivery} days</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Analysis</CardTitle>
              <CardDescription>Monthly consumption trends by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {consumptionAnalysis.map((month, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">{month.month} 2024</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Reagents</p>
                        <p className="text-xl font-bold text-blue-600">${month.reagents.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Supplies</p>
                        <p className="text-xl font-bold text-green-600">${month.supplies.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Controls</p>
                        <p className="text-xl font-bold text-purple-600">${month.controls.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Calibrators</p>
                        <p className="text-xl font-bold text-orange-600">${month.calibrators.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Tracking</CardTitle>
              <CardDescription>Items approaching expiration and recommended actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiryAlerts.map((alert, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    alert.daysRemaining < 30 ? 'border-red-200 bg-red-50' :
                    alert.daysRemaining < 60 ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.item}</h4>
                        <p className="text-sm text-gray-600">Expires: {alert.expiryDate}</p>
                      </div>
                      <Badge className={`${
                        alert.daysRemaining < 30 ? 'bg-red-500' :
                        alert.daysRemaining < 60 ? 'bg-yellow-500' : 'bg-blue-500'
                      } text-white text-xs`}>
                        {alert.daysRemaining} days
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="text-lg font-bold text-gray-900">{alert.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Est. Usage</p>
                        <p className="text-lg font-bold text-blue-600">{alert.estimatedUsage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days Remaining</p>
                        <p className={`text-lg font-bold ${
                          alert.daysRemaining < 30 ? 'text-red-600' :
                          alert.daysRemaining < 60 ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {alert.daysRemaining}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700">Recommended Action:</p>
                      <p className="text-sm text-gray-600">{alert.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
