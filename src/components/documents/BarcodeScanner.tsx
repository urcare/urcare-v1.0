
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Barcode, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onScanned: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onScanned, onClose }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleCameraStart = async () => {
    setIsScanning(true);
    
    // Simulate camera scanning
    setTimeout(() => {
      const mockBarcode = '123456789012';
      onScanned(mockBarcode);
      setIsScanning(false);
      toast.success('Medication found and added to your list');
    }, 3000);
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScanned(manualBarcode);
      toast.success('Barcode processed successfully');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              Scan Medication Barcode
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Scanner */}
          <div className="text-center space-y-4">
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {isScanning ? (
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-gray-600">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Barcode className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Position barcode in camera view</p>
                </div>
              )}
            </div>
            <Button 
              onClick={handleCameraStart}
              disabled={isScanning}
              className="w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Start Camera'}
            </Button>
          </div>

          {/* Manual Entry */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or enter manually</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode Number</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode number"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleManualSubmit}
              variant="outline"
              className="w-full"
              disabled={!manualBarcode.trim()}
            >
              Add Medication
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
