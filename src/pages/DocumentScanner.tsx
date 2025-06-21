
import React from 'react';
import { EnhancedDocumentScanner } from '@/components/documents/EnhancedDocumentScanner';

const DocumentScanner = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Scanner</h1>
        <p className="text-gray-600">
          Scan, digitize, and extract text from your medical documents using AI
        </p>
      </div>
      
      <EnhancedDocumentScanner />
    </div>
  );
};

export default DocumentScanner;
