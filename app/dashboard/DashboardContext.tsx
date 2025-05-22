'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DashboardContextType {
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('30d');

  return (
    <DashboardContext.Provider value={{ selectedSection, setSelectedSection, selectedTimePeriod, setSelectedTimePeriod }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 