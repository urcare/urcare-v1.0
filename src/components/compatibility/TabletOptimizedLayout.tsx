
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Tablet, 
  Layout,
  Grid3X3,
  Maximize2,
  Split,
  Eye,
  Settings
} from 'lucide-react';

interface LayoutFeature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  icon: React.ComponentType<any>;
}

export const TabletOptimizedLayout = () => {
  const [selectedLayout, setSelectedLayout] = useState('adaptive');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [layoutFeatures, setLayoutFeatures] = useState<LayoutFeature[]>([
    {
      id: 'multiWindow',
      name: 'Multi-Window Support',
      enabled: true,
      description: 'Allow multiple app windows simultaneously',
      icon: Split
    },
    {
      id: 'adaptiveUI',
      name: 'Adaptive UI Elements',
      enabled: true,
      description: 'UI components that scale with screen size',
      icon: Layout
    },
    {
      id: 'gestureNav',
      name: 'Gesture Navigation',
      enabled: true,
      description: 'Touch gestures optimized for larger screens',
      icon: Maximize2
    },
    {
      id: 'splitView',
      name: 'Split View Mode',
      enabled: false,
      description: 'Side-by-side app functionality',
      icon: Grid3X3
    }
  ]);

  const layouts = [
    {
      id: 'adaptive',
      name: 'Adaptive Layout',
      description: 'Automatically adjusts to screen size and orientation',
      preview: '📱 → 📱 → 💻'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Layout',
      description: 'Grid-based layout optimized for large screens',
      preview: '📊 📈 📋'
    },
    {
      id: 'sidebar',
      name: 'Sidebar Layout',
      description: 'Navigation sidebar with main content area',
      preview: '📋 | 📄'
    },
    {
      id: 'tabbed',
      name: 'Tabbed Layout',
      description: 'Tab-based navigation for complex workflows',
      preview: '📑 📑 📑'
    }
  ];

  const toggleFeature = (featureId: string) => {
    setLayoutFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layouts.map((layout) => (
              <div 
                key={layout.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedLayout === layout.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedLayout(layout.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{layout.name}</span>
                  <span className="text-lg">{layout.preview}</span>
                </div>
                <p className="text-sm text-gray-600">{layout.description}</p>
                {selectedLayout === layout.id && (
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Selected</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Layout Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {layoutFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Screen Size Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tablet className="h-5 w-5" />
            Screen Size Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium">7-10 inches</div>
              <div className="text-sm text-gray-600">Small Tablets</div>
              <div className="text-xs text-green-600 mt-1">Optimized</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium">10-13 inches</div>
              <div className="text-sm text-gray-600">Standard Tablets</div>
              <div className="text-xs text-green-600 mt-1">Optimized</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">💻</div>
              <div className="font-medium">13+ inches</div>
              <div className="text-sm text-gray-600">Large Tablets</div>
              <div className="text-xs text-blue-600 mt-1">Enhanced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Productivity Features */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Enhancements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Multi-tasking</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Split Screen Apps</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Picture-in-Picture</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>App Switcher</span>
                  <Badge className="bg-green-100 text-green-800">Enhanced</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Input Methods</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Touch Gestures</span>
                  <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stylus Support</span>
                  <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>External Keyboard</span>
                  <Badge className="bg-green-100 text-green-800">Supported</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Layout Preview
            </span>
            <Switch
              checked={isPreviewMode}
              onCheckedChange={setIsPreviewMode}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPreviewMode ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📱</div>
              <div className="text-lg font-medium mb-2">Tablet Layout Preview</div>
              <div className="text-sm text-gray-600 mb-4">
                Selected: {layouts.find(l => l.id === selectedLayout)?.name}
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="h-16 bg-blue-100 rounded flex items-center justify-center text-sm">
                  Navigation
                </div>
                <div className="h-16 bg-green-100 rounded flex items-center justify-center text-sm">
                  Content
                </div>
                <div className="h-16 bg-yellow-100 rounded flex items-center justify-center text-sm">
                  Sidebar
                </div>
                <div className="h-16 bg-purple-100 rounded flex items-center justify-center text-sm">
                  Actions
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Enable preview mode to see tablet layout visualization
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
