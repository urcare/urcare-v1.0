
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EquipmentMonitoringDashboard } from './EquipmentMonitoringDashboard';
import { SupplyChainOptimizationInterface } from './SupplyChainOptimizationInterface';
import { EnergyManagementDashboard } from './EnergyManagementDashboard';
import { SpaceUtilizationInterface } from './SpaceUtilizationInterface';
import { StaffSchedulingDashboard } from './StaffSchedulingDashboard';
import { MaintenanceWorkflowInterface } from './MaintenanceWorkflowInterface';
import { 
  Settings,
  Package,
  Zap,
  Building,
  Users,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const PredictiveMaintenanceAIDashboard = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [maintenanceMetrics, setMaintenanceMetrics] = useState({
    equipmentHealth: 92.4,
    predictedFailures: 8,
    maintenanceCosts: 245600,
    energyEfficiency: 87.3,
    spaceUtilization: 78.9,
    staffOptimization: 94.1
  });

  const maintenanceTabs = [
    {
      id: 'equipment',
      title: 'Equipment',
      icon: Settings,
      component: EquipmentMonitoringDashboard,
      description: 'Equipment monitoring and predictive failure alerts'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain',
      icon: Package,
      component: SupplyChainOptimizationInterface,
      description: 'Demand forecasting and inventory optimization'
    },
    {
      id: 'energy',
      title: 'Energy',
      icon: Zap,
      component: EnergyManagementDashboard,
      description: 'Energy consumption analytics and optimization'
    },
    {
      id: 'space',
      title: 'Space',
      icon: Building,
      component: SpaceUtilizationInterface,
      description: 'Space utilization and capacity planning'
    },
    {
      id: 'staff',
      title: 'Scheduling',
      icon: Users,
      component: StaffSchedulingDashboard,
      description: 'AI-optimized staff scheduling and workload balancing'
    },
    {
      id: 'maintenance',
      title: 'Workflows',
      icon: Wrench,
      component: MaintenanceWorkflowInterface,
      description: 'Maintenance workflows and work order management'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMaintenanceMetrics(prev => ({
        ...prev,
        equipmentHealth: Math.min(100, prev.equipmentHealth + (Math.random() - 0.5) * 0.2),
        predictedFailures: Math.max(0, prev.predictedFailures + Math.floor(Math.random() * 3) - 1),
        energyEfficiency: Math.min(100, prev.energyEfficiency + (Math.random() - 0.5) * 0.3),
        spaceUtilization: Math.min(100, prev.spaceUtilization + (Math.random() - 0.5) * 0.5)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Predictive Maintenance AI</h1>
      </div>

      {/* AI Maintenance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{maintenanceMetrics.equipmentHealth.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Equipment Health</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{maintenanceMetrics.predictedFailures}</div>
            <div className="text-sm text-gray-600">Predicted Failures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">${(maintenanceMetrics.maintenanceCosts / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Maintenance Costs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{maintenanceMetrics.energyEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Energy Efficiency</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{maintenanceMetrics.spaceUtilization.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Space Utilization</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{maintenanceMetrics.staffOptimization.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Staff Optimization</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {maintenanceMetrics.predictedFailures > 5 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Predictive Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Multiple equipment failures predicted in the next 48 hours</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <Clock className="h-4 w-4" />
                <span>Preventive maintenance windows need immediate scheduling</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Maintenance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {maintenanceTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {maintenanceTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
