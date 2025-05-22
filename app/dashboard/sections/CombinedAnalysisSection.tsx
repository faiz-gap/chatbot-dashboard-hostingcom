'use client';

import React from 'react';
import type { SectionProps } from '../types';
import CategoryAnalysisSection from './CategoryAnalysisSection';
import TeamRoutingAnalysisSection from './TeamRoutingAnalysisSection';
import { LayoutGrid } from 'lucide-react';

const CombinedAnalysisSection: React.FC<SectionProps> = ({ selectedTimePeriod, setActiveSection }) => {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Pass down props. Ensure CategoryAnalysisSection is adapted if it doesn't expect setActiveSection or if its internal structure needs adjustment for combined view */}
          <CategoryAnalysisSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setActiveSection} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Pass down props. Ensure TeamRoutingAnalysisSection is adapted similarly */}
          <TeamRoutingAnalysisSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setActiveSection} />
        </div>
      </div>
    </div>
  );
};

export default CombinedAnalysisSection;
