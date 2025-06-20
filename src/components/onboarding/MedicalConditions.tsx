
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Stethoscope, Pill, Brain, Zap, Eye } from 'lucide-react';

interface MedicalConditionsProps {
  onDataChange: (data: any) => void;
}

const medicalConditions = [
  { id: 'diabetes', label: 'Diabetes', icon: Pill, category: 'Metabolic' },
  { id: 'hypertension', label: 'High Blood Pressure', icon: Heart, category: 'Cardiovascular' },
  { id: 'asthma', label: 'Asthma', icon: Stethoscope, category: 'Respiratory' },
  { id: 'pcos', label: 'PCOS', icon: Pill, category: 'Hormonal' },
  { id: 'thyroid', label: 'Thyroid Disorders', icon: Pill, category: 'Hormonal' },
  { id: 'depression', label: 'Depression', icon: Brain, category: 'Mental Health' },
  { id: 'anxiety', label: 'Anxiety', icon: Brain, category: 'Mental Health' },
  { id: 'arthritis', label: 'Arthritis', icon: Zap, category: 'Musculoskeletal' },
  { id: 'heart', label: 'Heart Conditions', icon: Heart, category: 'Cardiovascular' },
  { id: 'allergies', label: 'Allergies', icon: Eye, category: 'Immune' },
  { id: 'migraine', label: 'Migraine', icon: Brain, category: 'Neurological' },
  { id: 'cholesterol', label: 'High Cholesterol', icon: Heart, category: 'Cardiovascular' },
];

const MedicalConditions: React.FC<MedicalConditionsProps> = ({ onDataChange }) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [noConditions, setNoConditions] = useState(false);

  const handleConditionChange = (conditionId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedConditions, conditionId];
      setNoConditions(false);
    } else {
      newSelected = selectedConditions.filter(id => id !== conditionId);
    }
    setSelectedConditions(newSelected);
    onDataChange({ conditions: newSelected, noConditions: false });
  };

  const handleNoConditions = (checked: boolean) => {
    setNoConditions(checked);
    if (checked) {
      setSelectedConditions([]);
      onDataChange({ conditions: [], noConditions: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">Select any medical conditions you currently have or have been diagnosed with.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicalConditions.map((condition) => {
          const IconComponent = condition.icon;
          return (
            <div 
              key={condition.id}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 transition-colors"
            >
              <Checkbox
                id={condition.id}
                checked={selectedConditions.includes(condition.id)}
                onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                disabled={noConditions}
              />
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <label htmlFor={condition.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                    {condition.label}
                  </label>
                  <p className="text-xs text-gray-500">{condition.category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors">
          <Checkbox
            id="no-conditions"
            checked={noConditions}
            onCheckedChange={handleNoConditions}
          />
          <label htmlFor="no-conditions" className="text-sm font-medium text-gray-900 cursor-pointer">
            I have no medical conditions
          </label>
        </div>
      </div>
    </div>
  );
};

export default MedicalConditions;
