import React from 'react';
import { Label } from '@/components/ui/label';

interface SleepScheduleStepProps {
  wakeUpTime: string;
  sleepTime: string;
  onChange: (field: 'wakeUpTime' | 'sleepTime', value: string) => void;
  error?: string;
}

export const SleepScheduleStep: React.FC<SleepScheduleStepProps> = ({ wakeUpTime, sleepTime, onChange, error }) => (
  <div>
    <Label>Sleep Schedule</Label>
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="time"
        value={wakeUpTime}
        onChange={e => onChange('wakeUpTime', e.target.value)}
        placeholder="Wake Up Time"
      />
      <input
        type="time"
        value={sleepTime}
        onChange={e => onChange('sleepTime', e.target.value)}
        placeholder="Sleep Time"
      />
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 