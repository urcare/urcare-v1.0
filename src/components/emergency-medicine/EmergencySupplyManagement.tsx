
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, AlertTriangle, TrendingDown, Truck } from 'lucide-react';

export const EmergencySupplyManagement = () => {
  const supplies = [
    { name: 'Blood Products (O-)', current: 12, min: 20, max: 50, status: 'critical' },
    { name: 'IV Fluids', current: 45, min: 30, max: 100, status: 'adequate' },
    { name: 'Epinephrine', current: 8, min: 15, max: 40, status: 'low' },
    { name: 'Ventilator Circuits', current: 25, min: 20, max: 60, status: 'adequate' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'low': return 'bg-yellow-500 text-white';
      case 'adequate': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Critical Supply Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplies.map((supply, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{supply.name}</span>
                  <Badge className={getStatusColor(supply.status)}>
                    {supply.status}
                  </Badge>
                </div>
                <Progress value={(supply.current / supply.max) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{supply.current} units available</span>
                  <span>Min: {supply.min} | Max: {supply.max}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
