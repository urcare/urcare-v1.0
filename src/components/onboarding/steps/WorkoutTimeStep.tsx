import React from 'react';
import { Label } from '@/components/ui/label';

interface WorkoutTimeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const workoutTimes = [
  'Morning (06:00-10:00)',
  'Afternoon (12:00-16:00)',
  'Evening (17:00-21:00)',
  'Night (21:00-00:00)',
  'Flexible',
  'Other'
];

export const WorkoutTimeStep: React.FC<WorkoutTimeStepProps> = ({ value, onChange, error }) => (
  <div>
    <Label>Preferred Workout Time</Label>
    <div style={{ display: 'flex', gap: 16 }}>
      {workoutTimes.map(time => (
        <label key={time} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="radio"
            name="workoutTime"
            value={time}
            checked={value === time}
            onChange={() => onChange(time)}
          />
          {time}
        </label>
      ))}
    </div>
    {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
  </div>
); 