
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Filter } from 'lucide-react';

export const EquipmentMaintenanceTracker = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const equipment = [
    {
      id: 1,
      name: 'Anesthesia Machine #1',
      model: 'Dräger Zeus',
      location: 'OT-1',
      status: 'operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      daysUntilDue: 15,
      maintenanceType: 'Preventive',
      technician: 'Tech Johnson',
      priority: 'Medium'
    },
    {
      id: 2,
      name: 'Surgical Table #2',
      model: 'Steris 5085',
      location: 'OT-2',
      status: 'maintenance_due',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-01-15',
      daysUntilDue: -1,
      maintenanceType: 'Preventive',
      technician: 'Tech Davis',
      priority: 'High'
    },
    {
      id: 3,
      name: 'Electrocautery Unit #3',
      model: 'Medtronic Force',
      location: 'OT-3',
      status: 'under_maintenance',
      lastMaintenance: '2024-01-14',
      nextMaintenance: '2024-02-14',
      daysUntilDue: 30,
      maintenanceType: 'Corrective',
      technician: 'Tech Wilson',
      priority: 'Critical'
    },
    {
      id: 4,
      name: 'Ventilator #1',
      model: 'Hamilton G5',
      location: 'OT-1',
      status: 'operational',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-02-08',
      daysUntilDue: 13,
      maintenanceType: 'Preventive',
      technician: 'Tech Johnson',
      priority: 'Medium'
    },
    {
      id: 5,
      name: 'C-Arm Fluoroscopy',
      model: 'Siemens Cios',
      location: 'OT-4',
      status: 'out_of_service',
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-01-20',
      daysUntilDue: 5,
      maintenanceType: 'Corrective',
      technician: 'Tech Brown',
      priority: 'Critical'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance_due': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'under_maintenance': return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'out_of_service': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance_due': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_maintenance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_of_service': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wrench className="h-6 w-6 text-purple-600" />
          Equipment Maintenance Tracker
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Equipment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} - {item.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Maintenance Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Assigned Technician</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-johnson">Tech Johnson</SelectItem>
                    <SelectItem value="tech-davis">Tech Davis</SelectItem>
                    <SelectItem value="tech-wilson">Tech Wilson</SelectItem>
                    <SelectItem value="tech-brown">Tech Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Schedule Maintenance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="maintenance_due">Maintenance Due</SelectItem>
              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {equipment.filter(e => e.status === 'operational').length}
            </div>
            <p className="text-sm text-gray-600">Operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {equipment.filter(e => e.status === 'maintenance_due').length}
            </div>
            <p className="text-sm text-gray-600">Maintenance Due</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Wrench className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {equipment.filter(e => e.status === 'under_maintenance').length}
            </div>
            <p className="text-sm text-gray-600">Under Maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {equipment.filter(e => e.status === 'out_of_service').length}
            </div>
            <p className="text-sm text-gray-600">Out of Service</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.map(item => (
          <Card key={item.id} className={`${item.status === 'out_of_service' ? 'border-red-200' : item.status === 'maintenance_due' ? 'border-yellow-200' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600">{item.model} | {item.location}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(item.status)}
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Maintenance:</p>
                    <p className="font-medium">{item.lastMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Due:</p>
                    <p className="font-medium">{item.nextMaintenance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Days Until Due:</p>
                    <p className={`font-medium ${item.daysUntilDue < 0 ? 'text-red-600' : item.daysUntilDue < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {item.daysUntilDue < 0 ? `${Math.abs(item.daysUntilDue)} overdue` : `${item.daysUntilDue} days`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Technician:</p>
                    <p className="font-medium">{item.technician}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Wrench className="h-3 w-3 mr-1" />
                    Maintain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
