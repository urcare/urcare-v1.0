
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PillIdentification {
  id: string;
  name: string;
  strength: string;
  shape: string;
  color: string;
  imprint: string;
  manufacturer: string;
  confidence: number;
  warnings: string[];
}

const sampleResults: PillIdentification[] = [
  {
    id: '1',
    name: 'Lisinopril',
    strength: '10mg',
    shape: 'Round',
    color: 'Pink',
    imprint: 'L10',
    manufacturer: 'Generic Pharma',
    confidence: 95,
    warnings: ['ACE Inhibitor', 'Monitor blood pressure']
  },
  {
    id: '2',
    name: 'Metformin',
    strength: '500mg',
    shape: 'Oval',
    color: 'White',
    imprint: 'M500',
    manufacturer: 'Teva',
    confidence: 87,
    warnings: ['Take with food', 'Monitor blood sugar']
  }
];

export const PillIdentificationAI = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [searchImprint, setSearchImprint] = useState('');
  const [identificationResults, setIdentificationResults] = useState<PillIdentification[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCameraIdentification = async () => {
    setIsScanning(true);
    setShowResults(false);
    
    // Simulate AI processing
    setTimeout(() => {
      setIdentificationResults(sampleResults);
      setShowResults(true);
      setIsScanning(false);
      toast.success('Pill identified successfully');
    }, 3000);
  };

  const handleImprintSearch = () => {
    if (!searchImprint.trim()) {
      toast.error('Please enter pill imprint text');
      return;
    }

    setShowResults(false);
    
    // Simulate search
    setTimeout(() => {
      setIdentificationResults(sampleResults.filter(result => 
        result.imprint.toLowerCase().includes(searchImprint.toLowerCase())
      ));
      setShowResults(true);
      toast.success('Search completed');
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Pill Identification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera Scanner */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {isScanning ? (
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse text-blue-600" />
                <p className="text-sm text-gray-600">Analyzing pill image...</p>
                <p className="text-xs text-gray-500 mt-1">AI processing in progress</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Take photo of pill to identify</p>
              </div>
            )}
          </div>
          <Button 
            onClick={handleCameraIdentification}
            disabled={isScanning}
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isScanning ? 'Identifying...' : 'Identify Pill with Camera'}
          </Button>
        </div>

        {/* Manual Search */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or search by imprint</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imprint">Pill Imprint/Text</Label>
            <div className="flex gap-2">
              <Input
                id="imprint"
                placeholder="Enter text/numbers on pill"
                value={searchImprint}
                onChange={(e) => setSearchImprint(e.target.value)}
              />
              <Button onClick={handleImprintSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && identificationResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Identification Results</h4>
            <div className="space-y-3">
              {identificationResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-lg">{result.name}</h5>
                      <p className="text-gray-600">{result.strength}</p>
                    </div>
                    <Badge className={getConfidenceColor(result.confidence)}>
                      {result.confidence}% match
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Shape:</span> {result.shape}
                    </div>
                    <div>
                      <span className="font-medium">Color:</span> {result.color}
                    </div>
                    <div>
                      <span className="font-medium">Imprint:</span> {result.imprint}
                    </div>
                    <div>
                      <span className="font-medium">Manufacturer:</span> {result.manufacturer}
                    </div>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Important Information</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Add to My Medications
                    </Button>
                    <Button size="sm" variant="outline">
                      View Full Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">AI Identification Tips</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Ensure good lighting when taking photos</li>
            <li>• Capture both sides of the pill if different</li>
            <li>• Include any imprinted text or numbers clearly</li>
            <li>• Always verify with healthcare provider before taking unknown pills</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
