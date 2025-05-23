
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Thermometer, Activity, Plus, Trash2, Phone } from 'lucide-react';
import { EmergencyTrigger, VitalSigns } from '@/types/healthTwin';

interface EmergencyTriggerSettingsProps {
  triggers: EmergencyTrigger[];
  onAddTrigger: (trigger: EmergencyTrigger) => void;
  onUpdateTrigger: (triggerId: string, updates: Partial<EmergencyTrigger>) => void;
  onDeleteTrigger: (triggerId: string) => void;
  currentVitals?: VitalSigns;
}

export function EmergencyTriggerSettings({ 
  triggers, 
  onAddTrigger, 
  onUpdateTrigger, 
  onDeleteTrigger,
  currentVitals 
}: EmergencyTriggerSettingsProps) {
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<EmergencyTrigger>>({
    type: 'vitals',
    isActive: true,
    emergencyContacts: ['']
  });

  const vitalTypes = [
    { value: 'heart_rate_high', label: 'Heart Rate (High)', unit: 'bpm', normal: 60-100 },
    { value: 'heart_rate_low', label: 'Heart Rate (Low)', unit: 'bpm', normal: 60-100 },
    { value: 'blood_pressure_high', label: 'Blood Pressure (High)', unit: 'mmHg', normal: '120/80' },
    { value: 'blood_pressure_low', label: 'Blood Pressure (Low)', unit: 'mmHg', normal: '120/80' },
    { value: 'temperature_high', label: 'Temperature (High)', unit: '°C', normal: 36.1-37.2 },
    { value: 'temperature_low', label: 'Temperature (Low)', unit: '°C', normal: 36.1-37.2 },
    { value: 'oxygen_saturation_low', label: 'Oxygen Saturation (Low)', unit: '%', normal: '>95' },
  ];

  const getTriggerColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'vitals': return <Heart className="h-4 w-4" />;
      case 'symptoms': return <AlertTriangle className="h-4 w-4" />;
      case 'condition': return <Activity className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const addEmergencyContact = () => {
    setNewTrigger(prev => ({
      ...prev,
      emergencyContacts: [...(prev.emergencyContacts || []), '']
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setNewTrigger(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts?.filter((_, i) => i !== index) || []
    }));
  };

  const updateEmergencyContact = (index: number, value: string) => {
    setNewTrigger(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts?.map((contact, i) => 
        i === index ? value : contact
      ) || []
    }));
  };

  const handleAddTrigger = () => {
    if (!newTrigger.condition || !newTrigger.threshold) return;

    const trigger: EmergencyTrigger = {
      id: `trigger_${Date.now()}`,
      type: newTrigger.type || 'vitals',
      condition: newTrigger.condition || '',
      threshold: newTrigger.threshold || 0,
      isActive: newTrigger.isActive || true,
      emergencyContacts: newTrigger.emergencyContacts?.filter(contact => contact.trim()) || [],
      actionPlan: newTrigger.actionPlan || ''
    };

    onAddTrigger(trigger);
    setNewTrigger({
      type: 'vitals',
      isActive: true,
      emergencyContacts: ['']
    });
    setIsAddingTrigger(false);
  };

  const checkCurrentVitals = () => {
    if (!currentVitals) return [];

    const alerts = [];
    
    triggers.filter(t => t.isActive && t.type === 'vitals').forEach(trigger => {
      switch (trigger.condition) {
        case 'heart_rate_high':
          if (currentVitals.heartRate > trigger.threshold) {
            alerts.push(`Heart rate is ${currentVitals.heartRate} bpm (threshold: ${trigger.threshold})`);
          }
          break;
        case 'heart_rate_low':
          if (currentVitals.heartRate < trigger.threshold) {
            alerts.push(`Heart rate is ${currentVitals.heartRate} bpm (threshold: ${trigger.threshold})`);
          }
          break;
        case 'temperature_high':
          if (currentVitals.temperature > trigger.threshold) {
            alerts.push(`Temperature is ${currentVitals.temperature}°C (threshold: ${trigger.threshold})`);
          }
          break;
        // Add more vital checks as needed
      }
    });

    return alerts;
  };

  const vitalsAlerts = checkCurrentVitals();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Emergency Trigger Settings
          </CardTitle>
          <CardDescription>
            Set up automatic alerts and emergency responses based on your vital signs and symptoms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Alerts */}
          {vitalsAlerts.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="h-4 w-4" />
                Active Alerts
              </div>
              <ul className="space-y-1">
                {vitalsAlerts.map((alert, index) => (
                  <li key={index} className="text-red-700 text-sm">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Triggers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Triggers ({triggers.length})</h3>
              <Button onClick={() => setIsAddingTrigger(true)} disabled={isAddingTrigger}>
                <Plus className="h-4 w-4 mr-2" />
                Add Trigger
              </Button>
            </div>

            {triggers.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  No emergency triggers configured. Add triggers to monitor your health automatically.
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {triggers.map(trigger => (
                  <Card key={trigger.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getTriggerIcon(trigger.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {vitalTypes.find(v => v.value === trigger.condition)?.label || trigger.condition}
                            </h4>
                            <Badge className={getTriggerColor(trigger.isActive)}>
                              {trigger.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {trigger.type}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>
                              Threshold: {trigger.threshold} {vitalTypes.find(v => v.value === trigger.condition)?.unit}
                            </div>
                            {trigger.emergencyContacts.length > 0 && (
                              <div>
                                Emergency contacts: {trigger.emergencyContacts.join(', ')}
                              </div>
                            )}
                            {trigger.actionPlan && (
                              <div>Action plan: {trigger.actionPlan}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={trigger.isActive}
                          onCheckedChange={(checked) => 
                            onUpdateTrigger(trigger.id, { isActive: checked })
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteTrigger(trigger.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add New Trigger Form */}
          {isAddingTrigger && (
            <Card className="p-4 border-2 border-blue-200">
              <div className="space-y-4">
                <h4 className="font-medium">Add New Emergency Trigger</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select 
                      value={newTrigger.type || 'vitals'} 
                      onValueChange={(value) => setNewTrigger(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vitals">Vital Signs</SelectItem>
                        <SelectItem value="symptoms">Symptoms</SelectItem>
                        <SelectItem value="condition">Medical Condition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select 
                      value={newTrigger.condition || ''} 
                      onValueChange={(value) => setNewTrigger(prev => ({ ...prev, condition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {vitalTypes.map(vital => (
                          <SelectItem key={vital.value} value={vital.value}>
                            {vital.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Threshold Value</Label>
                  <Input
                    type="number"
                    value={newTrigger.threshold || ''}
                    onChange={(e) => setNewTrigger(prev => ({ 
                      ...prev, 
                      threshold: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="Enter threshold value"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contacts</Label>
                  {newTrigger.emergencyContacts?.map((contact, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={contact}
                        onChange={(e) => updateEmergencyContact(index, e.target.value)}
                        placeholder="Phone number or email"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmergencyContact(index)}
                        disabled={(newTrigger.emergencyContacts?.length || 0) <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addEmergencyContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Action Plan (Optional)</Label>
                  <Textarea
                    value={newTrigger.actionPlan || ''}
                    onChange={(e) => setNewTrigger(prev => ({ ...prev, actionPlan: e.target.value }))}
                    placeholder="Describe what should happen when this trigger is activated..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newTrigger.isActive || true}
                      onCheckedChange={(checked) => setNewTrigger(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label>Active</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddingTrigger(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTrigger}>
                      Add Trigger
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
