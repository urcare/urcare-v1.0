import React from 'react';
import { Label } from '@/components/ui/label';

interface HealthReportsStepProps {
  hasHealthReports: string;
  healthReports: string[];
  onHasHealthReportsChange: (value: string) => void;
  onAddHealthReport: (file: string) => void;
  onRemoveHealthReport: (file: string) => void;
  error?: string;
}

export const HealthReportsStep: React.FC<HealthReportsStepProps> = ({
  hasHealthReports,
  healthReports,
  onHasHealthReportsChange,
  onAddHealthReport,
  onRemoveHealthReport,
  error
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>Existing health reports to upload?</Label>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="radio"
            name="hasHealthReports"
            value="Yes"
            checked={hasHealthReports === 'Yes'}
            onChange={() => onHasHealthReportsChange('Yes')}
          />
          Yes
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            name="hasHealthReports"
            value="No"
            checked={hasHealthReports === 'No'}
            onChange={() => onHasHealthReportsChange('No')}
          />
          No
        </label>
      </div>
      {hasHealthReports === 'Yes' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={e => {
              if (e.target.files) {
                Array.from(e.target.files).forEach(file => onAddHealthReport(file.name));
              }
            }}
          />
          <ul>
            {healthReports.map(file => (
              <li key={file} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {file}
                <button type="button" onClick={() => onRemoveHealthReport(file)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </div>
  );
}; 