
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Layers, 
  Target, 
  TrendingUp,
  Users,
  AlertTriangle,
  Globe,
  BarChart3
} from 'lucide-react';

export const GeographicVisualization = () => {
  const [mapLayer, setMapLayer] = useState('cases');
  const [timeRange, setTimeRange] = useState('7days');

  const geoMetrics = {
    totalHotspots: 8,
    newHotspots: 2,
    highRiskAreas: 3,
    populationCoverage: 89.2,
    spatialClusters: 5,
    riskIndex: 6.8
  };

  const hotspots = [
    {
      id: 'HS-001',
      location: 'Downtown District',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      cases: 45,
      riskLevel: 'high',
      population: 3600,
      attackRate: 12.5,
      disease: 'Influenza A',
      trend: 'increasing',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'HS-002',
      location: 'University Campus',
      coordinates: { lat: 40.7300, lng: -73.9950 },
      cases: 28,
      riskLevel: 'medium',
      population: 5000,
      attackRate: 5.6,
      disease: 'Norovirus',
      trend: 'stable',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'HS-003',
      location: 'Industrial Zone',
      coordinates: { lat: 40.7200, lng: -74.0100 },
      cases: 18,
      riskLevel: 'medium',
      population: 2400,
      attackRate: 7.5,
      disease: 'Respiratory Illness',
      trend: 'decreasing',
      lastUpdated: '2024-01-19'
    }
  ];

  const spatialAnalysis = [
    {
      cluster: 'Central Business District',
      diseases: ['Influenza A', 'COVID-19'],
      radius: 2.3,
      significance: 'p < 0.001',
      relativeRisk: 2.8,
      populationDensity: 'High'
    },
    {
      cluster: 'Residential North',
      diseases: ['Norovirus'],
      radius: 1.8,
      significance: 'p < 0.01',
      relativeRisk: 1.9,
      populationDensity: 'Medium'
    },
    {
      cluster: 'Educational Sector',
      diseases: ['Multiple'],
      radius: 1.2,
      significance: 'p < 0.05',
      relativeRisk: 1.6,
      populationDensity: 'High'
    }
  ];

  const riskFactorMapping = [
    {
      factor: 'Population Density',
      impact: 'High',
      coverage: '85%',
      correlation: 0.78,
      spatialVariation: 'Significant'
    },
    {
      factor: 'Age Demographics',
      impact: 'Medium',
      coverage: '92%',
      correlation: 0.54,
      spatialVariation: 'Moderate'
    },
    {
      factor: 'Healthcare Access',
      impact: 'Medium',
      coverage: '76%',
      correlation: -0.42,
      spatialVariation: 'High'
    },
    {
      factor: 'Socioeconomic Status',
      impact: 'High',
      coverage: '88%',
      correlation: -0.65,
      spatialVariation: 'Significant'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geographic Visualization</h2>
          <p className="text-gray-600">Disease mapping and spatial analysis tools</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Map Layers
          </Button>
          <Button className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Full Screen Map
          </Button>
        </div>
      </div>

      {/* Geographic Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{geoMetrics.totalHotspots}</p>
            <p className="text-sm text-red-700">Hotspots</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">+{geoMetrics.newHotspots}</p>
            <p className="text-sm text-orange-700">New Hotspots</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{geoMetrics.highRiskAreas}</p>
            <p className="text-sm text-yellow-700">High Risk Areas</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{geoMetrics.populationCoverage}%</p>
            <p className="text-sm text-blue-700">Pop. Coverage</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Layers className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{geoMetrics.spatialClusters}</p>
            <p className="text-sm text-purple-700">Spatial Clusters</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{geoMetrics.riskIndex}</p>
            <p className="text-sm text-green-700">Risk Index</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Disease Distribution Map</CardTitle>
              <CardDescription>Interactive geographic visualization of disease patterns</CardDescription>
              <div className="flex gap-4">
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cases">Disease Cases</SelectItem>
                    <SelectItem value="hotspots">Hotspots</SelectItem>
                    <SelectItem value="risk">Risk Levels</SelectItem>
                    <SelectItem value="demographics">Demographics</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Interactive Disease Map</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Geographic visualization showing disease distribution, hotspots, and risk areas
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Low Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spatial Analysis */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Spatial Cluster Analysis</CardTitle>
              <CardDescription>Statistical significance of geographic disease clusters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spatialAnalysis.map((cluster, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{cluster.cluster}</h4>
                      <Badge variant="outline">
                        RR: {cluster.relativeRisk}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Radius</p>
                        <p className="font-medium text-gray-900">{cluster.radius} km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Significance</p>
                        <p className="font-medium text-gray-900">{cluster.significance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pop. Density</p>
                        <p className="font-medium text-gray-900">{cluster.populationDensity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Diseases</p>
                        <p className="font-medium text-gray-900">{cluster.diseases.length}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Associated Diseases:</p>
                      <div className="flex flex-wrap gap-1">
                        {cluster.diseases.map((disease, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotspots & Risk Factors */}
        <div className="space-y-6">
          {/* Active Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle>Active Hotspots</CardTitle>
              <CardDescription>Geographic areas with elevated disease activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotspots.map((hotspot, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{hotspot.location}</h4>
                      <Badge className={`${
                        hotspot.riskLevel === 'high' ? 'bg-red-500' :
                        hotspot.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white text-xs`}>
                        {hotspot.riskLevel}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Disease:</span>
                        <span className="font-medium">{hotspot.disease}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cases:</span>
                        <span className="font-medium">{hotspot.cases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attack Rate:</span>
                        <span className="font-medium">{hotspot.attackRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trend:</span>
                        <span className={`font-medium ${
                          hotspot.trend === 'increasing' ? 'text-red-600' :
                          hotspot.trend === 'stable' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {hotspot.trend}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {hotspot.lastUpdated}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Factor Mapping */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Mapping</CardTitle>
              <CardDescription>Spatial distribution of risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactorMapping.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 text-sm">{factor.factor}</span>
                      <Badge className={`${
                        factor.impact === 'High' ? 'bg-red-500' :
                        factor.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white text-xs`}>
                        {factor.impact}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Coverage: </span>
                        <span className="font-medium">{factor.coverage}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Correlation: </span>
                        <span className="font-medium">{factor.correlation}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          Math.abs(factor.correlation) >= 0.7 ? 'bg-red-500' :
                          Math.abs(factor.correlation) >= 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.abs(factor.correlation) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{factor.spatialVariation} spatial variation</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
