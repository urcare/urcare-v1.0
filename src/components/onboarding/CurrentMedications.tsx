
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Pill, Plus, X } from 'lucide-react';

interface CurrentMedicationsProps {
  onDataChange: (data: any) => void;
}

const commonMedications = [
  'Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Amlodipine',
  'Omeprazole', 'Sertraline', 'Ibuprofen', 'Aspirin', 'Vitamin D',
  'Multivitamin', 'Omega-3', 'Calcium', 'Iron', 'Magnesium'
];

const CurrentMedications: React.FC<CurrentMedicationsProps> = ({ onDataChange }) => {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [customMedication, setCustomMedication] = useState('');
  const [noMedications, setNoMedications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = commonMedications.filter(med => 
    med.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMedicationToggle = (medication: string) => {
    let newSelected;
    if (selectedMedications.includes(medication)) {
      newSelected = selectedMedications.filter(med => med !== medication);
    } else {
      newSelected = [...selectedMedications, medication];
      setNoMedications(false);
    }
    setSelectedMedications(newSelected);
    onDataChange({ medications: newSelected, noMedications: false });
  };

  const handleAddCustom = () => {
    if (customMedication.trim() && !selectedMedications.includes(customMedication.trim())) {
      const newSelected = [...selectedMedications, customMedication.trim()];
      setSelectedMedications(newSelected);
      setCustomMedication('');
      setNoMedications(false);
      onDataChange({ medications: newSelected, noMedications: false });
    }
  };

  const handleRemoveMedication = (medication: string) => {
    const newSelected = selectedMedications.filter(med => med !== medication);
    setSelectedMedications(newSelected);
    onDataChange({ medications: newSelected, noMedications });
  };

  const handleNoMedications = (checked: boolean) => {
    setNoMedications(checked);
    if (checked) {
      setSelectedMedications([]);
      onDataChange({ medications: [], noMedications: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">Select your current medications and supplements.</p>
      </div>

      {/* Selected Medications */}
      {selectedMedications.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Medications:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMedications.map((medication) => (
              <Badge key={medication} variant="secondary" className="flex items-center gap-1">
                <Pill className="w-3 h-3" />
                {medication}
                <button
                  onClick={() => handleRemoveMedication(medication)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="space-y-2">
        <Input
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={noMedications}
        />
      </div>

      {/* Common Medications */}
      {!noMedications && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {filteredMedications.map((medication) => (
            <div
              key={medication}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedMedications.includes(medication)
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
              }`}
              onClick={() => handleMedicationToggle(medication)}
            >
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium">{medication}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Medication */}
      {!noMedications && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add custom medication..."
              value={customMedication}
              onChange={(e) => setCustomMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
            />
            <Button
              onClick={handleAddCustom}
              disabled={!customMedication.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-500"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* No Medications Option */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors">
          <Checkbox
            id="no-medications"
            checked={noMedications}
            onCheckedChange={handleNoMedications}
          />
          <label htmlFor="no-medications" className="text-sm font-medium text-gray-900 cursor-pointer">
            I take no medications or supplements
          </label>
        </div>
      </div>
    </div>
  );
};

export default CurrentMedications;
