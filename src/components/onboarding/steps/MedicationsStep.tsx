import React from 'react';
import { Label } from '@/components/ui/label';

interface MedicationsStepProps {
  takesMedications: string;
  medications: string[];
  onTakesMedicationsChange: (value: string) => void;
  onAddMedication: (medication: string) => void;
  onRemoveMedication: (medication: string) => void;
  error?: string;
}

export const MedicationsStep: React.FC<MedicationsStepProps> = ({
  takesMedications,
  medications,
  onTakesMedicationsChange,
  onAddMedication,
  onRemoveMedication,
  error
}) => {
  const [input, setInput] = React.useState('');
  return (
    <div>
      <Label>Do you take any medications?</Label>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="radio"
            name="takesMedications"
            value="Yes"
            checked={takesMedications === 'Yes'}
            onChange={() => onTakesMedicationsChange('Yes')}
          />
          Yes
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            name="takesMedications"
            value="No"
            checked={takesMedications === 'No'}
            onChange={() => onTakesMedicationsChange('No')}
          />
          No
        </label>
      </div>
      {takesMedications === 'Yes' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Add medication"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  onAddMedication(input.trim());
                  setInput('');
                }
              }}
            />
            <button type="button" onClick={() => { if (input.trim()) { onAddMedication(input.trim()); setInput(''); } }}>Add</button>
          </div>
          <ul>
            {medications.map(med => (
              <li key={med} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {med}
                <button type="button" onClick={() => onRemoveMedication(med)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </div>
  );
}; 