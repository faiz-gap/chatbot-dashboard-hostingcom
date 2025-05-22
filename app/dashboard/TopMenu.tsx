'use client';

import React, { useState } from 'react';

const timePeriods = [
  { id: '1h', name: 'Last Hour' },
  { id: '24h', name: 'Last 24 Hours' },
  { id: '7d', name: 'Last 7 Days' },
  { id: '30d', name: 'Last 30 Days' },
  { id: '3m', name: 'Last 3 Months' },
  { id: 'all', name: 'All Time' },
];

interface TopMenuProps {
  selectedTimePeriod: string;
  setSelectedTimePeriod: (period: string) => void;
  sectionName?: string;
}

const TopMenu: React.FC<TopMenuProps> = ({ selectedTimePeriod, setSelectedTimePeriod, sectionName }) => {
  const selectedPeriodObject = timePeriods.find(p => p.id === selectedTimePeriod);
  const selectedPeriodName = selectedPeriodObject ? selectedPeriodObject.name : selectedTimePeriod;
  return (
    <div className="h-20 bg-white border-b border-gray-300 flex items-center justify-between px-8">
      <div>
        {/* Placeholder for other top menu items like breadcrumbs or global actions */}
        <h1 className="text-xl font-semibold text-gray-800">{sectionName || 'Dashboard'}</h1>
          <p className="text-sm text-gray-500 mt-1">Displaying data for: {selectedPeriodName}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">Time Period:</span>
        <select 
          value={selectedTimePeriod}
          onChange={(e) => setSelectedTimePeriod(e.target.value)}
          className="block w-auto pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
        >
          {timePeriods.map(period => (
            <option key={period.id} value={period.id}>{period.name}</option>
          ))}
        </select>
        {/* Add other filters here if needed */}
      </div>
    </div>
  );
};

export default TopMenu; 