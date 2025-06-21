
import React, { useState } from 'react';
import { MedicalRecordsManager } from '@/components/medical-records/MedicalRecordsManager';
import { RecordViewer } from '@/components/medical-records/RecordViewer';

const MedicalRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  if (selectedRecord) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RecordViewer 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MedicalRecordsManager />
    </div>
  );
};

export default MedicalRecords;
