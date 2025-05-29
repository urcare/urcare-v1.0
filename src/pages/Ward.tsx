
import React from 'react';
import { Layout } from '@/components/Layout';
import { WardDashboard } from '@/components/ward/WardDashboard';

const Ward = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Ward Management</h1>
        <WardDashboard />
      </div>
    </Layout>
  );
};

export default Ward;
