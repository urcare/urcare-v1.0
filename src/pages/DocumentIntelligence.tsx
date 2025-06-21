
import React from 'react';
import { DocumentProcessor } from '@/components/ai/DocumentProcessor';

const DocumentIntelligence = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Document Intelligence</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your medical documents with AI-powered analysis. Upload lab reports, 
          prescriptions, and medical records to extract key insights and track your health journey.
        </p>
      </div>
      
      <DocumentProcessor />
    </div>
  );
};

export default DocumentIntelligence;
