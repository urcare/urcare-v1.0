
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Image, 
  Zap, 
  HardDrive, 
  Clock,
  Download,
  TrendingDown,
  Settings
} from 'lucide-react';

interface ImageOptimizationStats {
  totalImages: number;
  optimizedImages: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  formatConversions: {
    webp: number;
    avif: number;
    jpeg: number;
    png: number;
  };
}

export const ImageOptimizationDashboard = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [webpEnabled, setWebpEnabled] = useState(true);
  const [avifEnabled, setAvifEnabled] = useState(true);
  const [progressiveLoading, setProgressiveLoading] = useState(true);

  const [stats] = useState<ImageOptimizationStats>({
    totalImages: 2847,
    optimizedImages: 2651,
    originalSize: 45.6, // MB
    compressedSize: 12.3, // MB
    compressionRatio: 73,
    formatConversions: {
      webp: 1523,
      avif: 892,
      jpeg: 236,
      png: 196
    }
  });

  const optimizeImages = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate optimization process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setOptimizationProgress(i);
    }
    
    setIsOptimizing(false);
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} MB`;
  };

  const optimizationPercentage = (stats.optimizedImages / stats.totalImages) * 100;
  const sizeSavings = stats.originalSize - stats.compressedSize;

  const features = [
    'Automatic format detection and conversion',
    'Progressive JPEG enhancement',
    'WebP and AVIF format optimization',
    'Responsive image delivery',
    'Lazy loading integration',
    'CDN optimization'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Image Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Optimization Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Images Optimized</span>
            </div>
            <div className="text-2xl font-bold">{stats.optimizedImages}</div>
            <div className="text-sm text-gray-600">of {stats.totalImages} total</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Size Reduction</span>
            </div>
            <div className="text-2xl font-bold">{stats.compressionRatio}%</div>
            <div className="text-sm text-gray-600">compression ratio</div>
          </div>
        </div>

        {/* Size Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Storage Optimization</span>
            <span>{formatBytes(sizeSavings)} saved</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Original: {formatBytes(stats.originalSize)}</span>
              <span>Optimized: {formatBytes(stats.compressedSize)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(stats.compressedSize / stats.originalSize) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Optimization Progress */}
        {isOptimizing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium">Optimizing images...</span>
            </div>
            <Progress value={optimizationProgress} className="h-2" />
          </div>
        )}

        {/* Format Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Format Distribution</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>WebP</span>
              <Badge variant="secondary">{stats.formatConversions.webp}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AVIF</span>
              <Badge variant="secondary">{stats.formatConversions.avif}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>JPEG</span>
              <Badge variant="secondary">{stats.formatConversions.jpeg}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>PNG</span>
              <Badge variant="secondary">{stats.formatConversions.png}</Badge>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Optimization Settings
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Optimization</span>
              <Switch
                checked={autoOptimization}
                onCheckedChange={setAutoOptimization}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">WebP Conversion</span>
              <Switch
                checked={webpEnabled}
                onCheckedChange={setWebpEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">AVIF Support</span>
              <Switch
                checked={avifEnabled}
                onCheckedChange={setAvifEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Progressive Loading</span>
              <Switch
                checked={progressiveLoading}
                onCheckedChange={setProgressiveLoading}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={optimizeImages}
            disabled={isOptimizing}
            className="flex-1"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize All'}
          </Button>
        </div>

        {/* Savings Display */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Storage Savings</span>
          </div>
          <div className="text-xs text-blue-700">
            Reduced total image size by {formatBytes(sizeSavings)} ({stats.compressionRatio}% compression)
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Automatic format detection and conversion</p>
          <p>• Progressive enhancement for better UX</p>
          <p>• CDN-optimized delivery</p>
        </div>
      </CardContent>
    </Card>
  );
};
