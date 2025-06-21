
import React from 'react';
import { DocumentIntelligence } from '@/components/ai-insights/DocumentIntelligence';

const DocumentIntelligencePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Intelligence</h1>
        <p className="text-gray-600">
          AI-powered document analysis, categorization, and smart search for your health records
        </p>
      </div>
      
      <DocumentIntelligence />
    </div>
  );
};

export default DocumentIntelligencePage;
