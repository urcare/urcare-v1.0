import React from 'react';
import { Label } from '@/components/ui/label';

interface MealTimingsStepProps {
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  onChange: (field: 'breakfastTime' | 'lunchTime' | 'dinnerTime', value: string) => void;
  error?: string;
}

export const MealTimingsStep: React.FC<MealTimingsStepProps> = ({ breakfastTime, lunchTime, dinnerTime, onChange, error }) => (
  <div>
    <Label>Meal Timings</Label>
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="time"
        value={breakfastTime}
        onChange={e => onChange('breakfastTime', e.target.value)}
        placeholder="Breakfast"
      />
      <input
        type="time"
        value={lunchTime}
        onChange={e => onChange('lunchTime', e.target.value)}
        placeholder="Lunch"
      />
      <input
        type="time"
        value={dinnerTime}
        onChange={e => onChange('dinnerTime', e.target.value)}
        placeholder="Dinner"
      />
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 