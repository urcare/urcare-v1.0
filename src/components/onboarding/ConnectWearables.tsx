
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Smartphone, Watch, Heart, Activity } from 'lucide-react';

interface ConnectWearablesProps {
  onDataChange: (data: any) => void;
}

const wearableOptions = [
  {
    id: 'google-fit',
    name: 'Google Fit',
    description: 'Connect your Android fitness data',
    icon: Activity,
    color: 'bg-green-500'
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    description: 'Sync with Apple Health app',
    icon: Heart,
    color: 'bg-red-500'
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    description: 'Connect your Fitbit device',
    icon: Watch,
    color: 'bg-blue-500'
  },
  {
    id: 'samsung-health',
    name: 'Samsung Health',
    description: 'Sync Samsung Health data',
    icon: Smartphone,
    color: 'bg-purple-500'
  }
];

const ConnectWearables: React.FC<ConnectWearablesProps> = ({ onDataChange }) => {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [skipWearables, setSkipWearables] = useState(false);

  const handleDeviceToggle = (deviceId: string, connected: boolean) => {
    let newConnected;
    if (connected) {
      newConnected = [...connectedDevices, deviceId];
      setSkipWearables(false);
    } else {
      newConnected = connectedDevices.filter(id => id !== deviceId);
    }
    setConnectedDevices(newConnected);
    onDataChange({ connectedDevices: newConnected, skipWearables: false });
  };

  const handleSkipWearables = (skip: boolean) => {
    setSkipWearables(skip);
    if (skip) {
      setConnectedDevices([]);
      onDataChange({ connectedDevices: [], skipWearables: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Watch className="w-12 h-12 text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">Connect your health devices for better insights.</p>
        <p className="text-sm text-gray-500 mt-2">This helps us track your progress automatically</p>
      </div>

      {/* Wearable Options */}
      {!skipWearables && (
        <div className="space-y-4">
          {wearableOptions.map((device) => {
            const IconComponent = device.icon;
            const isConnected = connectedDevices.includes(device.id);
            
            return (
              <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${device.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{device.name}</h4>
                    <p className="text-sm text-gray-600">{device.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isConnected}
                  onCheckedChange={(checked) => handleDeviceToggle(device.id, checked)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Connected Devices Summary */}
      {connectedDevices.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">Connected Devices:</h4>
          <div className="flex flex-wrap gap-2">
            {connectedDevices.map((deviceId) => {
              const device = wearableOptions.find(d => d.id === deviceId);
              return device ? (
                <span key={deviceId} className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                  {device.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Skip Option */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors">
          <div>
            <Label htmlFor="skip-wearables" className="text-sm font-medium text-gray-900 cursor-pointer">
              I'll connect devices later
            </Label>
            <p className="text-xs text-gray-500">You can always add devices from settings</p>
          </div>
          <Switch
            id="skip-wearables"
            checked={skipWearables}
            onCheckedChange={handleSkipWearables}
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectWearables;
