
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Scan, AlertTriangle, CheckCircle, Plus, Search, Calendar } from 'lucide-react';

export const BatchImplantTracker = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryItems = [
    { id: 1, name: 'Cardiac Stent', category: 'Cardiology', batch: 'CS-2024-001', quantity: 15, expiry: '2025-06-15', status: 'good', location: 'OT-1 Cabinet A', lastUsed: '2024-01-15' },
    { id: 2, name: 'Hip Prosthesis', category: 'Orthopedics', batch: 'HP-2024-003', quantity: 8, expiry: '2026-03-20', status: 'good', location: 'OT-2 Cabinet B', lastUsed: '2024-01-10' },
    { id: 3, name: 'Pacemaker Battery', category: 'Cardiology', batch: 'PB-2024-007', quantity: 3, expiry: '2024-08-30', status: 'warning', location: 'OT-1 Secure Storage', lastUsed: '2024-01-08' },
    { id: 4, name: 'Surgical Mesh', category: 'General Surgery', batch: 'SM-2024-012', quantity: 25, expiry: '2025-12-10', status: 'good', location: 'Main Inventory', lastUsed: '2024-01-12' },
    { id: 5, name: 'Spinal Rod', category: 'Orthopedics', batch: 'SR-2024-005', quantity: 12, expiry: '2027-01-15', status: 'good', location: 'OT-3 Cabinet C', lastUsed: '2024-01-14' },
    { id: 6, name: 'Heart Valve', category: 'Cardiology', batch: 'HV-2024-002', quantity: 2, expiry: '2024-04-20', status: 'critical', location: 'OT-1 Secure Storage', lastUsed: '2024-01-05' },
  ];

  const usageHistory = [
    { id: 1, itemName: 'Cardiac Stent', batch: 'CS-2024-001', patient: 'John Doe', surgeon: 'Dr. Smith', date: '2024-01-15', otRoom: 'OT-1', quantity: 1 },
    { id: 2, itemName: 'Hip Prosthesis', batch: 'HP-2024-003', patient: 'Jane Smith', surgeon: 'Dr. Johnson', date: '2024-01-10', otRoom: 'OT-2', quantity: 1 },
    { id: 3, itemName: 'Surgical Mesh', batch: 'SM-2024-012', patient: 'Mike Wilson', surgeon: 'Dr. Brown', date: '2024-01-12', otRoom: 'OT-3', quantity: 2 },
  ];

  const categories = ['all', 'Cardiology', 'Orthopedics', 'General Surgery', 'Neurosurgery'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return <Badge className="bg-green-500">Good</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-500">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDaysToExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-red-600" />
          Batch & Implant Tracker
        </h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Item Name</Label>
                  <Input placeholder="Enter item name" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'all').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Batch Number</Label>
                  <Input placeholder="Enter batch number" />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input placeholder="Enter storage location" />
                </div>
                <Button className="w-full">Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label>Category:</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search items or batch numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Items in Good Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {inventoryItems.filter(item => item.status === 'good').length}
            </div>
            <p className="text-gray-600">Out of {inventoryItems.length} total items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {inventoryItems.filter(item => item.status === 'warning').length}
            </div>
            <p className="text-gray-600">Within 90 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {inventoryItems.filter(item => item.status === 'critical').length}
            </div>
            <p className="text-gray-600">Immediate attention needed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div key={item.id} className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Batch:</span> {item.batch}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Expiry:</span> {item.expiry}
                        <div className="text-xs text-gray-600">
                          ({getDaysToExpiry(item.expiry)} days)
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Usage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageHistory.map(usage => (
              <div key={usage.id} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{usage.itemName}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Batch: {usage.batch} | Patient: {usage.patient}</p>
                      <p>Surgeon: {usage.surgeon} | Room: {usage.otRoom}</p>
                      <p>Date: {usage.date} | Quantity Used: {usage.quantity}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
