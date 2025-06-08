import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move,
  Ruler,
  Type,
  Circle,
  Square,
  Download,
  Share2,
  Settings,
  Layers,
  Contrast,
  Sun,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';

export const DICOMViewer = () => {
  const [selectedStudy, setSelectedStudy] = useState('study1');
  const [viewportLayout, setViewportLayout] = useState('1x1');
  const [activeTool, setActiveTool] = useState('pan');
  const [windowLevel, setWindowLevel] = useState({ width: 400, center: 40 });

  const availableStudies = [
    {
      id: 'study1',
      patient: 'John Doe',
      modality: 'CT',
      studyDate: '2024-01-08',
      description: 'CT Chest with Contrast',
      series: 3,
      images: 156,
      bodyPart: 'Chest'
    },
    {
      id: 'study2',
      patient: 'Jane Smith',
      modality: 'MR',
      studyDate: '2024-01-08',
      description: 'MRI Brain without Contrast',
      series: 5,
      images: 248,
      bodyPart: 'Head'
    },
    {
      id: 'study3',
      patient: 'Robert Brown',
      modality: 'XR',
      studyDate: '2024-01-08',
      description: 'Chest X-Ray PA/Lateral',
      series: 2,
      images: 2,
      bodyPart: 'Chest'
    }
  ];

  const seriesList = [
    {
      id: 'series1',
      description: 'Axial CT 5mm',
      images: 52,
      modality: 'CT',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'series2',
      description: 'Sagittal CT 5mm',
      images: 48,
      modality: 'CT',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 'series3',
      description: 'Coronal CT 5mm',
      images: 56,
      modality: 'CT',
      thumbnail: '/placeholder.svg'
    }
  ];

  const hangingProtocols = [
    { name: 'Chest CT Standard', layout: '2x2', preset: 'chest' },
    { name: 'Brain MRI', layout: '1x3', preset: 'brain' },
    { name: 'Comparison View', layout: '1x2', preset: 'comparison' },
    { name: 'Single View', layout: '1x1', preset: 'single' }
  ];

  const measurementTools = [
    { name: 'Length', icon: Ruler, active: false },
    { name: 'Angle', icon: RotateCw, active: false },
    { name: 'Circle', icon: Circle, active: false },
    { name: 'Rectangle', icon: Square, active: false },
    { name: 'Text', icon: Type, active: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">DICOM Viewer</h3>
          <p className="text-gray-600">Advanced medical image viewing with measurement and annotation tools</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Study
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Study Browser */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Study Browser</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {availableStudies.map((study) => (
                  <div
                    key={study.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedStudy === study.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedStudy(study.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {study.modality}
                      </Badge>
                      <span className="text-xs text-gray-500">{study.studyDate}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{study.patient}</h5>
                    <p className="text-xs text-gray-600">{study.description}</p>
                    <p className="text-xs text-gray-500">{study.series} series • {study.images} images</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Series</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {seriesList.map((series) => (
                  <div key={series.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Monitor className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">{series.description}</p>
                      <p className="text-xs text-gray-600">{series.images} images</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hanging Protocols</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-1">
                {hangingProtocols.map((protocol, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setViewportLayout(protocol.layout)}
                  >
                    {protocol.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Viewer and Controls */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTool === 'pan' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('pan')}
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTool === 'zoom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('zoom')}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  {measurementTools.map((tool, index) => (
                    <Button
                      key={index}
                      variant={activeTool === tool.name.toLowerCase() ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool(tool.name.toLowerCase())}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Contrast className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sun className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Viewport */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div className={`grid ${
                  viewportLayout === '1x1' ? 'grid-cols-1' :
                  viewportLayout === '1x2' ? 'grid-cols-2' :
                  viewportLayout === '1x3' ? 'grid-cols-3' :
                  viewportLayout === '2x2' ? 'grid-cols-2' : 'grid-cols-1'
                } ${
                  viewportLayout === '2x2' ? 'grid-rows-2' : 'grid-rows-1'
                } gap-1 bg-black`}>
                  {Array.from({ length: viewportLayout === '2x2' ? 4 : parseInt(viewportLayout.split('x')[1]) }).map((_, index) => (
                    <div key={index} className="aspect-square bg-black border border-gray-600 relative flex items-center justify-center min-h-[400px]">
                      <div className="text-center text-white">
                        <Monitor className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">DICOM Image Viewport {index + 1}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Series: Axial CT 5mm<br />
                          Image: {index * 10 + 1}/156<br />
                          WW: {windowLevel.width} WC: {windowLevel.center}
                        </p>
                      </div>
                      
                      {/* Viewport Overlays */}
                      <div className="absolute top-2 left-2 text-white text-xs">
                        <p>John Doe</p>
                        <p>CT Chest</p>
                        <p>2024-01-08</p>
                      </div>
                      
                      <div className="absolute top-2 right-2 text-white text-xs text-right">
                        <p>5.0mm</p>
                        <p>Axial</p>
                        <p>120kV</p>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 text-white text-xs">
                        <p>L</p>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 text-white text-xs">
                        <p>R</p>
                      </div>
                      
                      <div className="absolute bottom-2 center text-white text-xs">
                        <p>Image {index * 10 + 1}/156</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Controls */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-600">Image:</span>
                    <input
                      type="range"
                      min="1"
                      max="156"
                      defaultValue="78"
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600">78/156</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">WW:</span>
                    <input
                      type="number"
                      value={windowLevel.width}
                      onChange={(e) => setWindowLevel(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                      className="w-16 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">WC:</span>
                    <input
                      type="number"
                      value={windowLevel.center}
                      onChange={(e) => setWindowLevel(prev => ({ ...prev, center: parseInt(e.target.value) }))}
                      className="w-16 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
