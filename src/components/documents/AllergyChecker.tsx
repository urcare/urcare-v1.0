
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface AllergyCheckerProps {
  allergies: Allergy[];
  onAllergyUpdate: (allergies: Allergy[]) => void;
}

export const AllergyChecker = ({ allergies, onAllergyUpdate }: AllergyCheckerProps) => {
  const [newAllergen, setNewAllergen] = useState('');
  const [newSeverity, setNewSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [newReaction, setNewReaction] = useState('');
  const [checkMedication, setCheckMedication] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleAddAllergy = () => {
    if (!newAllergen.trim() || !newReaction.trim()) {
      toast.error('Please fill in all allergy details');
      return;
    }

    const newAllergy: Allergy = {
      id: Date.now().toString(),
      allergen: newAllergen,
      severity: newSeverity,
      reaction: newReaction
    };

    onAllergyUpdate([...allergies, newAllergy]);
    setNewAllergen('');
    setNewReaction('');
    setNewSeverity('mild');
    toast.success('Allergy added successfully');
  };

  const handleRemoveAllergy = (id: string) => {
    onAllergyUpdate(allergies.filter(allergy => allergy.id !== id));
    toast.success('Allergy removed');
  };

  const handleCheckMedication = () => {
    if (!checkMedication.trim()) return;

    const matchingAllergies = allergies.filter(allergy =>
      checkMedication.toLowerCase().includes(allergy.allergen.toLowerCase()) ||
      allergy.allergen.toLowerCase().includes(checkMedication.toLowerCase())
    );

    if (matchingAllergies.length > 0) {
      const severestAllergy = matchingAllergies.reduce((prev, current) => {
        const severityOrder = { mild: 1, moderate: 2, severe: 3 };
        return severityOrder[current.severity] > severityOrder[prev.severity] ? current : prev;
      });
      
      setCheckResult(`⚠️ ALLERGY WARNING: You are allergic to ${severestAllergy.allergen} (${severestAllergy.severity}). Reaction: ${severestAllergy.reaction}`);
    } else {
      setCheckResult('✅ No known allergies detected for this medication.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Allergy & Interaction Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Medication Check */}
          <div className="space-y-3">
            <Label>Check Medication for Allergies</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter medication name"
                value={checkMedication}
                onChange={(e) => setCheckMedication(e.target.value)}
              />
              <Button onClick={handleCheckMedication}>Check</Button>
            </div>
            {checkResult && (
              <Alert className={checkResult.includes('WARNING') ? 'border-red-500' : 'border-green-500'}>
                <AlertDescription>{checkResult}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Current Allergies */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Known Allergies</Label>
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <div key={allergy.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{allergy.allergen}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(allergy.severity)}`}>
                        {allergy.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{allergy.reaction}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveAllergy(allergy.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {allergies.length === 0 && (
                <p className="text-gray-500 text-center py-4">No allergies recorded</p>
              )}
            </div>
          </div>

          {/* Add New Allergy */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-semibold">Add New Allergy</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Allergen</Label>
                <Input
                  placeholder="e.g., Penicillin, Shellfish"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                />
              </div>
              <div>
                <Label>Severity</Label>
                <Select value={newSeverity} onValueChange={(value: 'mild' | 'moderate' | 'severe') => setNewSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Reaction</Label>
              <Input
                placeholder="Describe the allergic reaction"
                value={newReaction}
                onChange={(e) => setNewReaction(e.target.value)}
              />
            </div>
            <Button onClick={handleAddAllergy} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Allergy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
