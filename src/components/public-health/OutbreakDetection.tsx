
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Users,
  Calendar,
  Target,
  Activity,
  Shield
} from 'lucide-react';

export const OutbreakDetection = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');

  const outbreaks = [
    {
      id: 'OB-2024-001',
      disease: 'Influenza A',
      location: 'Downtown District',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      cases: 45,
      suspected: 12,
      confirmed: 33,
      status: 'active',
      riskLevel: 'high',
      startDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      trend: 'increasing',
      attackRate: 12.5,
      population: 3600,
      controlMeasures: ['Contact tracing', 'Isolation', 'Vaccination campaign']
    },
    {
      id: 'OB-2024-002',
      disease: 'Norovirus',
      location: 'University Campus',
      coordinates: { lat: 40.7300, lng: -73.9950 },
      cases: 28,
      suspected: 8,
      confirmed: 20,
      status: 'monitored',
      riskLevel: 'medium',
      startDate: '2024-01-18',
      lastUpdate: '2024-01-20',
      trend: 'stable',
      attackRate: 5.6,
      population: 5000,
      controlMeasures: ['Hygiene protocols', 'Food service closure']
    },
    {
      id: 'OB-2024-003',
      disease: 'COVID-19',
      location: 'Nursing Home',
      coordinates: { lat: 40.7200, lng: -74.0100 },
      cases: 12,
      suspected: 3,
      confirmed: 9,
      status: 'contained',
      riskLevel: 'medium',
      startDate: '2024-01-10',
      lastUpdate: '2024-01-19',
      trend: 'decreasing',
      attackRate: 8.0,
      population: 150,
      controlMeasures: ['Quarantine', 'Enhanced testing', 'PPE protocols']
    }
  ];

  const detectionMetrics = {
    activeOutbreaks: 3,
    totalCases: 85,
    newCasesToday: 7,
    highRiskAreas: 2,
    averageDetectionTime: 2.3,
    containmentRate: 75
  };

  const riskFactors = [
    {
      factor: 'Population Density',
      score: 8.5,
      impact: 'High',
      description: 'Dense urban areas increase transmission risk'
    },
    {
      factor: 'Age Demographics',
      score: 7.2,
      impact: 'Medium',
      description: 'Elderly population concentration'
    },
    {
      factor: 'Seasonal Patterns',
      score: 6.8,
      impact: 'Medium',
      description: 'Winter respiratory illness season'
    },
    {
      factor: 'Social Mobility',
      score: 9.1,
      impact: 'High',
      description: 'High movement between areas'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Outbreak Detection</h2>
          <p className="text-gray-600">Automated detection and response coordination</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            View Map
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4" />
            Declare Outbreak
          </Button>
        </div>
      </div>

      {/* Detection Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{detectionMetrics.activeOutbreaks}</p>
            <p className="text-sm text-red-700">Active Outbreaks</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{detectionMetrics.totalCases}</p>
            <p className="text-sm text-blue-700">Total Cases</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">+{detectionMetrics.newCasesToday}</p>
            <p className="text-sm text-yellow-700">New Today</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{detectionMetrics.highRiskAreas}</p>
            <p className="text-sm text-orange-700">High Risk Areas</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{detectionMetrics.averageDetectionTime}</p>
            <p className="text-sm text-green-700">Days to Detect</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{detectionMetrics.containmentRate}%</p>
            <p className="text-sm text-purple-700">Containment Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Outbreaks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Outbreaks</CardTitle>
              <CardDescription>Current outbreak investigations and responses</CardDescription>
              <div className="flex gap-4">
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="monitored">Monitored</SelectItem>
                    <SelectItem value="contained">Contained</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outbreaks.map((outbreak, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{outbreak.disease}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {outbreak.location} • ID: {outbreak.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          outbreak.status === 'active' ? 'bg-red-500' :
                          outbreak.status === 'monitored' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white mb-1`}>
                          {outbreak.status}
                        </Badge>
                        <p className={`text-xs ${
                          outbreak.riskLevel === 'high' ? 'text-red-600' :
                          outbreak.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {outbreak.riskLevel} risk
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Total Cases</p>
                        <p className="font-bold text-gray-900">{outbreak.cases}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confirmed</p>
                        <p className="font-bold text-green-600">{outbreak.confirmed}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Suspected</p>
                        <p className="font-bold text-yellow-600">{outbreak.suspected}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Attack Rate</p>
                        <p className="font-bold text-gray-900">{outbreak.attackRate}%</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Control Measures:</p>
                      <div className="flex flex-wrap gap-1">
                        {outbreak.controlMeasures.map((measure, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {measure}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Started: {outbreak.startDate}</span>
                      <span>Last updated: {outbreak.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
            <CardDescription>Current outbreak risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{factor.factor}</span>
                    <Badge className={`${
                      factor.impact === 'High' ? 'bg-red-500' :
                      factor.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}>
                      {factor.impact}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.score >= 8 ? 'bg-red-500' :
                        factor.score >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${factor.score * 10}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">{factor.description}</p>
                  <p className="text-xs font-medium text-gray-900">Score: {factor.score}/10</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
