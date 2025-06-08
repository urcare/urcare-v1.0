
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Ruler,
  Circle,
  Square,
  Type,
  Layers,
  Download,
  Share2,
  Settings,
  Eye,
  RotateCw,
  Maximize
} from 'lucide-react';

export const DigitalPathology = () => {
  const [selectedSlide, setSelectedSlide] = useState('SLIDE001');
  const [zoomLevel, setZoomLevel] = useState([20]);
  const [activeTool, setActiveTool] = useState('pan');

  const digitalSlides = [
    {
      id: 'SLIDE001',
      specimen: 'Lung Biopsy',
      stain: 'H&E',
      magnification: '40x',
      size: '2.4 GB',
      status: 'Active',
      thumbnail: '/placeholder.svg',
      annotations: 3
    },
    {
      id: 'SLIDE002',
      specimen: 'Lung Biopsy',
      stain: 'TTF-1',
      magnification: '40x',
      size: '1.8 GB',
      status: 'Active',
      thumbnail: '/placeholder.svg',
      annotations: 1
    },
    {
      id: 'SLIDE003',
      specimen: 'Lung Biopsy',
      stain: 'CK7',
      magnification: '40x',
      size: '1.9 GB',
      status: 'Active',
      thumbnail: '/placeholder.svg',
      annotations: 2
    }
  ];

  const annotationTools = [
    { name: 'Pan', icon: Move, active: true },
    { name: 'Measure', icon: Ruler, active: false },
    { name: 'Circle', icon: Circle, active: false },
    { name: 'Rectangle', icon: Square, active: false },
    { name: 'Text', icon: Type, active: false }
  ];

  const measurements = [
    { id: 1, type: 'Length', value: '145.6 μm', color: 'red' },
    { id: 2, type: 'Area', value: '1,234 μm²', color: 'blue' },
    { id: 3, type: 'Angle', value: '42.5°', color: 'green' }
  ];

  const annotations = [
    { id: 1, type: 'Tumor Area', note: 'Adenocarcinoma pattern', x: 45, y: 30 },
    { id: 2, type: 'Necrosis', note: 'Central necrotic area', x: 60, y: 45 },
    { id: 3, type: 'Stroma', note: 'Desmoplastic reaction', x: 25, y: 55 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Digital Pathology</h3>
          <p className="text-gray-600">High-resolution image viewing with annotation and measurement tools</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Viewer Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Slide
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Slide Navigator */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Digital Slides</CardTitle>
              <CardDescription className="text-xs">Available slide images</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {digitalSlides.map((slide) => (
                  <div
                    key={slide.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedSlide === slide.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedSlide(slide.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <Badge variant="outline" className="text-xs">
                        {slide.stain}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{slide.specimen}</h5>
                    <p className="text-xs text-gray-600">{slide.magnification} • {slide.size}</p>
                    <p className="text-xs text-gray-500">{slide.annotations} annotations</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Zoom Level</label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">{zoomLevel[0]}x</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {annotationTools.map((tool, index) => (
                    <Button
                      key={index}
                      variant={activeTool === tool.name.toLowerCase() ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool(tool.name.toLowerCase())}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  
                  <Button variant="outline" size="sm">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">H&E Stain</Badge>
                  <Badge variant="outline">40x Magnification</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slide Viewer */}
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video flex items-center justify-center min-h-[500px]">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg text-gray-400">Digital Slide Viewer</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Slide: {selectedSlide}<br />
                    Zoom: {zoomLevel[0]}x<br />
                    Tool: {activeTool}
                  </p>
                </div>
                
                {/* Annotation Overlays */}
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white cursor-pointer"
                    style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
                    title={`${annotation.type}: ${annotation.note}`}
                  />
                ))}
                
                {/* Viewer Controls */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-2 rounded">
                  <p className="text-xs">Coordinates: (1024, 768)</p>
                  <p className="text-xs">Zoom: {zoomLevel[0]}x</p>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded">
                  <p className="text-xs">Scale: 100 μm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Image Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Image Properties</p>
                  <p className="text-gray-600">Resolution: 0.25 μm/pixel</p>
                  <p className="text-gray-600">Format: SVS</p>
                  <p className="text-gray-600">Size: 2.4 GB</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Acquisition</p>
                  <p className="text-gray-600">Scanner: Aperio AT2</p>
                  <p className="text-gray-600">Objective: 40x/0.75NA</p>
                  <p className="text-gray-600">Date: 2024-01-08</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Quality</p>
                  <p className="text-gray-600">Focus Score: 98.5%</p>
                  <p className="text-gray-600">Tissue %: 85.2%</p>
                  <p className="text-gray-600">Artifacts: None</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Annotations Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Annotations</CardTitle>
              <CardDescription className="text-xs">Slide annotations and notes</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <div key={annotation.id} className="border rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <p className="text-xs font-medium">{annotation.type}</p>
                    </div>
                    <p className="text-xs text-gray-600">{annotation.note}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="text-xs h-6">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-6">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Measurements</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {measurements.map((measurement) => (
                  <div key={measurement.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 bg-${measurement.color}-500 rounded-full`} />
                      <span>{measurement.type}</span>
                    </div>
                    <span className="font-medium">{measurement.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Slide Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <Download className="h-3 w-3" />
                Export Image
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Share2 className="h-3 w-3" />
                Share Annotations
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Type className="h-3 w-3" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
