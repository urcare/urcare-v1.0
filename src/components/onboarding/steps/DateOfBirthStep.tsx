import React from 'react';
import { getMonths, getDays, getYears } from '../common/helpers';
import { Label } from '@/components/ui/label';

interface DateOfBirthStepProps {
  month: string;
  day: string;
  year: string;
  onChange: (field: 'birthMonth' | 'birthDay' | 'birthYear', value: string) => void;
  error?: string;
}

export const DateOfBirthStep: React.FC<DateOfBirthStepProps> = ({ month, day, year, onChange, error }) => (
  <div>
    <Label>Date of Birth</Label>
    <div style={{ display: 'flex', gap: 8 }}>
      <select value={month} onChange={e => onChange('birthMonth', e.target.value)}>
        {getMonths().map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={day} onChange={e => onChange('birthDay', e.target.value)}>
        {getDays().map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={year} onChange={e => onChange('birthYear', e.target.value)}>
        {getYears().map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 