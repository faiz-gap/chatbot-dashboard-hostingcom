'use client';

import React from 'react';
import type { SectionProps } from '../types';
import { LayoutGrid } from 'lucide-react';

const CombinedAnalysisSection: React.FC<SectionProps> = ({ selectedTimePeriod, setActiveSection }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <LayoutGrid className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Category & Team Analysis</h3>
        <p className="text-gray-500">
          Category Resolution Rates and Routing Accuracy charts have been moved to the AI Performance section for better organization.
        </p>
        <button 
          onClick={() => setActiveSection?.('aiPerformance')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View in AI Performance
        </button>
      </div>
    </div>
  );
};

export default CombinedAnalysisSection;
