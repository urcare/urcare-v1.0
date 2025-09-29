import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  adminCredentials: {
    username: string;
    password: string;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const adminCredentials = {
    username: 'admin',
    password: 'admin'
  };

  const setAdmin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
  };

  const value = {
    isAdmin,
    setAdmin,
    adminCredentials
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

