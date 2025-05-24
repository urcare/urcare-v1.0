
import React from 'react';
import { Layout } from '@/components/Layout';
import { DocumentDashboard } from '@/components/documents/DocumentDashboard';

const Documents = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <DocumentDashboard />
      </div>
    </Layout>
  );
};

export default Documents;
