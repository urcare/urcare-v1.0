import React from 'react';
import { Label } from '@/components/ui/label';

interface HeightWeightStepProps {
  unitSystem: 'imperial' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLb: string;
  weightKg: string;
  onChange: (field: string, value: string) => void;
  error?: string;
}

export const HeightWeightStep: React.FC<HeightWeightStepProps> = ({
  unitSystem,
  heightFeet,
  heightInches,
  heightCm,
  weightLb,
  weightKg,
  onChange,
  error
}) => (
  <div>
    <Label>Height & Weight</Label>
    <div style={{ marginBottom: 8 }}>
      <label>
        <input
          type="radio"
          name="unitSystem"
          value="metric"
          checked={unitSystem === 'metric'}
          onChange={() => onChange('unitSystem', 'metric')}
        />
        Metric (cm, kg)
      </label>
      <label style={{ marginLeft: 16 }}>
        <input
          type="radio"
          name="unitSystem"
          value="imperial"
          checked={unitSystem === 'imperial'}
          onChange={() => onChange('unitSystem', 'imperial')}
        />
        Imperial (ft, in, lb)
      </label>
    </div>
    {unitSystem === 'metric' ? (
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          placeholder="Height (cm)"
          value={heightCm}
          onChange={e => onChange('heightCm', e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weightKg}
          onChange={e => onChange('weightKg', e.target.value)}
        />
      </div>
    ) : (
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          placeholder="Height (ft)"
          value={heightFeet}
          onChange={e => onChange('heightFeet', e.target.value)}
        />
        <input
          type="number"
          placeholder="Height (in)"
          value={heightInches}
          onChange={e => onChange('heightInches', e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (lb)"
          value={weightLb}
          onChange={e => onChange('weightLb', e.target.value)}
        />
      </div>
    )}
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 