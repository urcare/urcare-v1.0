
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Chrome, 
  Firefox, 
  Edge, 
  Safari, 
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RefreshCw
} from 'lucide-react';

interface BrowserTest {
  id: string;
  name: string;
  version: string;
  icon: React.ComponentType<any>;
  compatibility: number;
  status: 'passed' | 'failed' | 'warning' | 'testing';
  issues: string[];
  features: {
    webgl: boolean;
    webrtc: boolean;
    serviceWorker: boolean;
    websockets: boolean;
    localStorage: boolean;
  };
}

export const BrowserCompatibilityTester = () => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [browsers, setBrowsers] = useState<BrowserTest[]>([
    {
      id: 'chrome',
      name: 'Chrome',
      version: '119.0',
      icon: Chrome,
      compatibility: 98,
      status: 'passed',
      issues: [],
      features: {
        webgl: true,
        webrtc: true,
        serviceWorker: true,
        websockets: true,
        localStorage: true
      }
    },
    {
      id: 'firefox',
      name: 'Firefox',
      version: '120.0',
      icon: Firefox,
      compatibility: 95,
      status: 'passed',
      issues: ['Minor CSS grid issues'],
      features: {
        webgl: true,
        webrtc: true,
        serviceWorker: true,
        websockets: true,
        localStorage: true
      }
    },
    {
      id: 'safari',
      name: 'Safari',
      version: '17.0',
      icon: Safari,
      compatibility: 88,
      status: 'warning',
      issues: ['WebRTC limitations', 'Service Worker restrictions'],
      features: {
        webgl: true,
        webrtc: false,
        serviceWorker: false,
        websockets: true,
        localStorage: true
      }
    },
    {
      id: 'edge',
      name: 'Edge',
      version: '119.0',
      icon: Edge,
      compatibility: 96,
      status: 'passed',
      issues: ['Minor video codec issues'],
      features: {
        webgl: true,
        webrtc: true,
        serviceWorker: true,
        websockets: true,
        localStorage: true
      }
    }
  ]);

  const runCompatibilityTests = async () => {
    setIsRunningTests(true);
    
    // Set all browsers to testing state
    setBrowsers(prev => prev.map(browser => ({ ...browser, status: 'testing' as const })));
    
    // Simulate testing each browser
    for (let i = 0; i < browsers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBrowsers(prev => prev.map((browser, index) => 
        index === i 
          ? { ...browser, status: browser.compatibility >= 95 ? 'passed' : browser.compatibility >= 85 ? 'warning' : 'failed' }
          : browser
      ));
    }
    
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallCompatibility = Math.round(browsers.reduce((sum, browser) => sum + browser.compatibility, 0) / browsers.length);

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Browser Compatibility Testing</h3>
          <p className="text-sm text-gray-600">Overall Compatibility: {overallCompatibility}%</p>
        </div>
        <Button 
          onClick={runCompatibilityTests}
          disabled={isRunningTests}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunningTests ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      {/* Browser Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {browsers.map((browser) => {
          const IconComponent = browser.icon;
          return (
            <Card key={browser.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{browser.name}</CardTitle>
                      <p className="text-sm text-gray-600">v{browser.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(browser.status)}
                    <Badge className={getStatusColor(browser.status)}>
                      {browser.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compatibility Score</span>
                    <span className="font-medium">{browser.compatibility}%</span>
                  </div>
                  <Progress value={browser.compatibility} className="h-2" />
                </div>

                {/* Feature Support */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Feature Support</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(browser.features).map(([feature, supported]) => (
                      <div key={feature} className="flex items-center gap-1">
                        {supported ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <XCircle className="h-3 w-3 text-red-600" />
                        }
                        <span className={supported ? 'text-green-700' : 'text-red-700'}>
                          {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                {browser.issues.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-orange-700">Known Issues</h4>
                    <ul className="text-xs space-y-1">
                      {browser.issues.map((issue, index) => (
                        <li key={index} className="text-orange-600">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Test Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {browsers.filter(b => b.status === 'passed').length}
              </div>
              <div className="text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {browsers.filter(b => b.status === 'warning').length}
              </div>
              <div className="text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {browsers.filter(b => b.status === 'failed').length}
              </div>
              <div className="text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{overallCompatibility}%</div>
              <div className="text-gray-600">Overall Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Implement WebRTC polyfills for Safari compatibility</p>
            <p>• Add fallback solutions for Service Worker functionality</p>
            <p>• Test with automated browser testing tools</p>
            <p>• Monitor real-user compatibility metrics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
