'use client';

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopMenu from './TopMenu';
import { DashboardProvider, useDashboard } from './DashboardContext';
import type { DashboardPageProps } from './page';
import { LayoutDashboard, ListChecks, BrainCircuit, Filter, RefreshCw, CheckCircle2, SearchCode, LayoutGrid, Lightbulb } from 'lucide-react';

// For dynamic header titles
const sections = [
  { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'activityLogs', name: 'Activity Logs', icon: <ListChecks size={18} /> },
  { id: 'aiPerformance', name: 'AI Performance', icon: <BrainCircuit size={18} /> },
  { id: 'conversationFunnel', name: 'Conversation Funnel', icon: <Filter size={18} /> },
  { id: 'knowledgeSync', name: 'Knowledge Sync', icon: <RefreshCw size={18} /> },
  { id: 'eventDeepDive', name: 'Event Deep Dive', icon: <SearchCode size={18} /> },
];

// Original sections array without icons (can be removed or commented out if icons are always used)
// const sections = [



// InnerLayout component to access context for Sidebar and TopMenu
const InnerLayout = ({ children }: { children: React.ReactNode }) => {
  const { selectedSection, setSelectedSection, selectedTimePeriod, setSelectedTimePeriod } = useDashboard();
  const currentSection = sections.find(sec => sec.id === selectedSection);
  const currentSectionName = currentSection ? currentSection.name : 'Dashboard';

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <Sidebar selectedSection={selectedSection} setSelectedSection={setSelectedSection} sections={sections} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopMenu selectedTimePeriod={selectedTimePeriod} setSelectedTimePeriod={setSelectedTimePeriod} sectionName={currentSectionName} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Pass selectedSection and selectedTimePeriod to children if they need it, 
              or manage content display based on selectedSection here directly. 
              For now, children will be the page.tsx content which will handle routing. */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <InnerLayout>{children}</InnerLayout>
    </DashboardProvider>
  );
} 