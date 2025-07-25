import React from 'react';
import { Label } from '@/components/ui/label';

interface WorkScheduleStepProps {
  workStart: string;
  workEnd: string;
  onChange: (field: 'workStart' | 'workEnd', value: string) => void;
  error?: string;
}

export const WorkScheduleStep: React.FC<WorkScheduleStepProps> = ({ workStart, workEnd, onChange, error }) => (
  <div>
    <Label>Work Schedule</Label>
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="time"
        value={workStart}
        onChange={e => onChange('workStart', e.target.value)}
        placeholder="Work Start"
      />
      <input
        type="time"
        value={workEnd}
        onChange={e => onChange('workEnd', e.target.value)}
        placeholder="Work End"
      />
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 