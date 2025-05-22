"use client";

import React, { useEffect } from 'react';
import { useDashboard } from './DashboardContext';
// Import section components
import OverviewSection from './sections/OverviewSection';
import AIPerformanceSection from './sections/AIPerformanceSection';
import ConversationFunnelSection from './sections/ConversationFunnelSection';
import ResolutionHandoffSection from './sections/ResolutionHandoffSection';
import EventDeepDiveSection from './sections/EventDeepDiveSection';
import KeyInsightsSection from './sections/KeyInsightsSection';
import KnowledgeSyncSection from './sections/KnowledgeSyncSection';
import ActivityLogSection from './sections/ActivityLogSection';
import CombinedAnalysisSection from './sections/CombinedAnalysisSection'; // New combined section

// Types and utils are now in their dedicated files and will be imported by section components as needed.
// Lucide icons and Recharts components will also be imported directly into section components.

export interface DashboardPageProps {
  selectedSection: string;
  selectedTimePeriod: string;
}

const ConversationMetricsDashboard: React.FC<DashboardPageProps> = () => {
  const { selectedSection, selectedTimePeriod, setSelectedSection } = useDashboard();
  // Logic to render the correct section based on selectedSection
  const renderSection = () => {
    switch (selectedSection) {
      case 'overview':
        return <OverviewSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'aiPerformance':
        return <AIPerformanceSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'conversationFunnel':
        return <ConversationFunnelSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'resolutionHandoff':
        return <ResolutionHandoffSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'eventDeepDive':
        return <EventDeepDiveSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'categoryTeamAnalysis':
        return <CombinedAnalysisSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'keyInsights':
        return <KeyInsightsSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'knowledgeSync': 
        return <KnowledgeSyncSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      case 'activityLogs':
        return <ActivityLogSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
      default:
        // It's good practice to have a default, or throw an error for unknown sections
        console.warn(`Unknown section: ${selectedSection}, defaulting to Overview.`);
        return <OverviewSection selectedTimePeriod={selectedTimePeriod} setActiveSection={setSelectedSection} />;
    }
  };

  return (
    <div className="w-full">
      {renderSection()} 
    </div>
  );
};

export default ConversationMetricsDashboard;
