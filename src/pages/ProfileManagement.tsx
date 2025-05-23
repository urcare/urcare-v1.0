
import React from 'react';
import { Layout } from '@/components/Layout';
import { ProfileManagementDashboard } from '@/components/ProfileManagementDashboard';

const ProfileManagement = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <ProfileManagementDashboard />
      </div>
    </Layout>
  );
};

export default ProfileManagement;
