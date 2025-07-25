import React from 'react';
import { Label } from '@/components/ui/label';

interface SurgeryStepProps {
  hasSurgery: string;
  surgeryDetails: string[];
  onHasSurgeryChange: (value: string) => void;
  onAddSurgeryDetail: (detail: string) => void;
  onRemoveSurgeryDetail: (detail: string) => void;
  error?: string;
}

export const SurgeryStep: React.FC<SurgeryStepProps> = ({
  hasSurgery,
  surgeryDetails,
  onHasSurgeryChange,
  onAddSurgeryDetail,
  onRemoveSurgeryDetail,
  error
}) => {
  const [input, setInput] = React.useState('');
  return (
    <div>
      <Label>Have you undergone any major surgery or transplant?</Label>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="radio"
            name="hasSurgery"
            value="Yes"
            checked={hasSurgery === 'Yes'}
            onChange={() => onHasSurgeryChange('Yes')}
          />
          Yes
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            name="hasSurgery"
            value="No"
            checked={hasSurgery === 'No'}
            onChange={() => onHasSurgeryChange('No')}
          />
          No
        </label>
      </div>
      {hasSurgery === 'Yes' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Add surgery detail"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  onAddSurgeryDetail(input.trim());
                  setInput('');
                }
              }}
            />
            <button type="button" onClick={() => { if (input.trim()) { onAddSurgeryDetail(input.trim()); setInput(''); } }}>Add</button>
          </div>
          <ul>
            {surgeryDetails.map(detail => (
              <li key={detail} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {detail}
                <button type="button" onClick={() => onRemoveSurgeryDetail(detail)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </div>
  );
}; 