
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const RoleBasedSidebar = () => {
  const { profile } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">UrCare</h2>
        <p className="text-sm text-gray-600">Healthcare Management</p>
      </div>
      
      <nav className="mt-4">
        <div className="px-4 space-y-2">
          <a href="/dashboard" className="block px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
            Dashboard
          </a>
          <a href="/profile" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            Profile
          </a>
          <a href="/settings" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            Settings
          </a>
        </div>
      </nav>
      
      {profile && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="px-3 py-2 text-xs text-gray-600 bg-gray-50 rounded-md">
            Role: {profile.role}
          </div>
        </div>
      )}
    </div>
  );
};
