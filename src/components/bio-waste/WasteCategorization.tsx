
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Droplet, 
  Radiation,
  Flame,
  Skull
} from 'lucide-react';

export const WasteCategorization = () => {
  const wasteCategories = [
    {
      id: 'red-bag',
      name: 'Red Bag Waste',
      color: 'red',
      hazardLevel: 'High',
      icon: AlertTriangle,
      description: 'Pathological waste, human tissues, body parts',
      handling: 'Autoclave treatment required before disposal',
      regulations: ['CPCB Guidelines', 'Biomedical Waste Rules 2016'],
      containers: 'Red colored bags/containers only',
      frequency: 'Daily collection mandatory'
    },
    {
      id: 'yellow-bag',
      name: 'Yellow Bag Waste',
      color: 'yellow',
      hazardLevel: 'High',
      icon: Skull,
      description: 'Pharmaceutical waste, expired medicines',
      handling: 'Incineration at high temperature (>1100°C)',
      regulations: ['CPCB Guidelines', 'Drug Controller Guidelines'],
      containers: 'Yellow colored bags/containers',
      frequency: 'Weekly collection'
    },
    {
      id: 'blue-bag',
      name: 'Blue Bag Waste',
      color: 'blue',
      hazardLevel: 'Medium',
      icon: Droplet,
      description: 'Pharmaceutical vials, ampoules',
      handling: 'Crush and treat before disposal',
      regulations: ['CPCB Guidelines'],
      containers: 'Blue colored bags/containers',
      frequency: 'Bi-weekly collection'
    },
    {
      id: 'white-bag',
      name: 'White Bag Waste',
      color: 'gray',
      hazardLevel: 'Medium',
      icon: Shield,
      description: 'Discarded medicines, cytotoxic drugs',
      handling: 'Special treatment for cytotoxic waste',
      regulations: ['CPCB Guidelines', 'Cytotoxic Guidelines'],
      containers: 'White translucent bags/containers',
      frequency: 'As per generation'
    },
    {
      id: 'sharps',
      name: 'Sharps Waste',
      color: 'purple',
      hazardLevel: 'High',
      icon: AlertTriangle,
      description: 'Needles, scalpels, broken glass',
      handling: 'Puncture-proof containers, autoclave treatment',
      regulations: ['CPCB Guidelines', 'Occupational Safety'],
      containers: 'Puncture-proof sharps containers',
      frequency: 'Daily collection'
    },
    {
      id: 'radioactive',
      name: 'Radioactive Waste',
      color: 'orange',
      hazardLevel: 'Critical',
      icon: Radiation,
      description: 'Radioactive materials from nuclear medicine',
      handling: 'Decay storage before disposal',
      regulations: ['AERB Guidelines', 'Radiation Safety'],
      containers: 'Lead-lined containers',
      frequency: 'Special handling protocol'
    }
  ];

  const getHazardBadge = (level: string) => {
    const config = {
      'Low': { className: 'bg-green-100 text-green-800' },
      'Medium': { className: 'bg-yellow-100 text-yellow-800' },
      'High': { className: 'bg-red-100 text-red-800' },
      'Critical': { className: 'bg-purple-100 text-purple-800' }
    };
    return <Badge className={config[level].className}>{level} Risk</Badge>;
  };

  const getColorBadge = (color: string) => {
    const colorClasses = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      gray: 'bg-gray-400',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    
    return (
      <div className={`w-4 h-4 rounded-full ${colorClasses[color]} border-2 border-white shadow-sm`} />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Waste Categorization System</h3>
          <p className="text-gray-600">Color-coding, hazard levels, and handling instructions</p>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          All biomedical waste must be segregated at source according to CPCB Biomedical Waste Management Rules 2016.
          Proper color-coding is mandatory for safe handling and disposal.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wasteCategories.map((category) => (
          <Card key={category.id} className="border-l-4" style={{ borderLeftColor: category.color === 'gray' ? '#6B7280' : category.color }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="w-6 h-6" />
                <span>{category.name}</span>
                {getColorBadge(category.color)}
                {getHazardBadge(category.hazardLevel)}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Handling Instructions</h4>
                <p className="text-sm text-gray-600">{category.handling}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Container Requirements</h4>
                <p className="text-sm text-gray-600">{category.containers}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Collection Frequency</h4>
                <p className="text-sm text-gray-600">{category.frequency}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Regulatory Compliance</h4>
                <div className="flex flex-wrap gap-1">
                  {category.regulations.map((regulation, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {regulation}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Safety Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Safety Guidelines & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Personal Protective Equipment (PPE)</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Disposable gloves (nitrile recommended)</li>
                <li>• Face masks and eye protection</li>
                <li>• Fluid-resistant gowns or aprons</li>
                <li>• Closed-toe shoes with non-slip soles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Segregation Requirements</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Segregate waste at point of generation</li>
                <li>• Never mix different waste categories</li>
                <li>• Fill containers maximum 3/4 capacity</li>
                <li>• Label all containers with date and source</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
