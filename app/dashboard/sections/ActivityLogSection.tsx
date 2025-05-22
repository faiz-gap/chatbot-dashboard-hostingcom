'use client';

import React, { useState, useMemo } from 'react';
import type { SectionProps, LogEntry, ProcessedConversationGroup } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft, CheckCircle2, XCircle, AlertTriangle, Info, MessageSquare, Zap, Brain, ArrowRightLeft, Settings2, ShieldAlert, UserCheck, Users, Tag } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import ActivityTimeline from '../components/ActivityTimeline';
import ConversationChatView from '../components/ConversationChatView';
import { mockActivityLogs } from '../mockData/activityLogData'; // Using mock data for now

const ITEMS_PER_TIMELINE_PAGE = 7;
const CONVERSATION_GROUPS_PER_PAGE = 5;

const ActivityLogSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);
  const [timelineCurrentPages, setTimelineCurrentPages] = useState<{ [groupId: string]: number }>({});
  const [currentConversationPage, setCurrentConversationPage] = useState(1);

  const toggleConversationExpand = (conversationId: string) => {
    setExpandedConversationId(prevId => {
      const newId = prevId === conversationId ? null : conversationId;
      if (newId && !timelineCurrentPages[newId]) {
        // If expanding and no page state exists for this group, initialize to page 1
        setTimelineCurrentPages(prevPages => ({ ...prevPages, [newId]: 1 }));
      }
      return newId;
    });
  };

  const handleTimelinePageChange = (groupId: string, newPage: number) => {
    setTimelineCurrentPages(prevPages => ({ ...prevPages, [groupId]: newPage }));
  };

  // Group logs by conversationId and calculate statistics
  const processedConversationGroups: ProcessedConversationGroup[] = useMemo(() => {
    const groups: Record<string, LogEntry[]> = {};
    const systemLogsKey = '_system_and_other_events_';

    // Sort all logs initially by timestamp to ensure correct within-group ordering later
    const sortedLogs = [...mockActivityLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    sortedLogs.forEach(log => {
      const key = log.conversationId || systemLogsKey;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(log);
    });

    // Calculate stats for each group from 'groups'
    const groupsWithStats = Object.entries(groups).map(([groupId, logsInGroup]) => {
      let successCount = 0;
      let failureCount = 0;
      let warningCount = 0;
      const eventTypeCounts: Record<string, number> = {};

      logsInGroup.forEach(log => {
        if (log.status === 'success') successCount++;
        else if (log.status === 'failure') failureCount++;
        else if (log.status === 'warning') warningCount++;
        eventTypeCounts[log.type] = (eventTypeCounts[log.type] || 0) + 1;
      });

      let currentTeam = "N/A";
      for (let i = logsInGroup.length - 1; i >= 0; i--) {
        const log = logsInGroup[i];
        if (log.details?.targetTeam && typeof log.details.targetTeam === 'string') {
          currentTeam = log.details.targetTeam;
          break;
        }
      }
      if (currentTeam === "N/A" && logsInGroup.length > 0) {
        const lastLog = logsInGroup[logsInGroup.length - 1];
        const knownBotComponents = ['IntentRecognitionBot', 'DomainTransferBot', 'HandoffBot', 'KnowledgeBot'];
        if (knownBotComponents.includes(lastLog.sourceComponent)) {
          currentTeam = "AI Support";
        }
      }

      let conversationTopic = "General Inquiry";
      const firstIntentLog = logsInGroup.find(log => log.type === 'intent_recognition');
      if (firstIntentLog) {
        conversationTopic = (typeof firstIntentLog.details?.actionName === 'string' && firstIntentLog.details.actionName) || firstIntentLog.description || "Intent Recognized";
      } else if (logsInGroup.length > 0 && logsInGroup[0].description) {
        conversationTopic = logsInGroup[0].description;
      }

      return {
        groupId,
        logs: logsInGroup,
        successCount,
        failureCount,
        warningCount,
        eventTypeCounts,
        latestTimestamp: logsInGroup.length > 0 ? logsInGroup[logsInGroup.length - 1].timestamp : undefined,
        totalEvents: logsInGroup.length,
        currentTeam,
        conversationTopic
      };
    });

    // Sort groups by the timestamp of their latest log entry (most recent first)
    return groupsWithStats.sort((groupA: ProcessedConversationGroup, groupB: ProcessedConversationGroup) => {
      if (groupA.groupId === systemLogsKey) return 1;
      if (groupB.groupId === systemLogsKey) return -1;
      
      const timeA = groupA.latestTimestamp ? parseISO(groupA.latestTimestamp).getTime() : 0;
      const timeB = groupB.latestTimestamp ? parseISO(groupB.latestTimestamp).getTime() : 0;
      
      if (timeA === 0 && timeB === 0) return 0;
      if (timeA === 0) return 1;
      if (timeB === 0) return -1;

      return timeB - timeA;
    });
  }, []);

  const systemLogsKey = '_system_and_other_events_'; // Define it once if used in render

  // Calculate paginated conversation groups
  const totalConversationPages = Math.ceil(processedConversationGroups.length / CONVERSATION_GROUPS_PER_PAGE);
  const paginatedConversationGroups = useMemo(() => {
    const startIndex = (currentConversationPage - 1) * CONVERSATION_GROUPS_PER_PAGE;
    const endIndex = startIndex + CONVERSATION_GROUPS_PER_PAGE;
    return processedConversationGroups.slice(startIndex, endIndex);
  }, [processedConversationGroups, currentConversationPage]);

  const handleConversationPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalConversationPages) {
      setCurrentConversationPage(newPage);
      setExpandedConversationId(null); // Collapse any expanded conversation when changing main page
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Activity Logs</h2>
        <p className="text-sm text-gray-500">
          Timeline of conversations and system events for: {selectedTimePeriod}
        </p>
      </div>

      {paginatedConversationGroups.length === 0 && processedConversationGroups.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No activity logs on this page. Try another page.</p>
        </div>
      )}
      {processedConversationGroups.length === 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No activity logs to display.</p>
        </div>
      )}

      {paginatedConversationGroups.map((group: ProcessedConversationGroup, index: number) => {
        const { groupId, logs: logsInGroup, successCount, failureCount, warningCount, eventTypeCounts, latestTimestamp, totalEvents, currentTeam, conversationTopic } = group;

        const isSystemLogs = groupId === systemLogsKey;
        const isExpanded = expandedConversationId === groupId;

        // Determine a status for the conversation dot color
        const conversationStatusDotColor = failureCount > 0 ? 'bg-red-500' : (warningCount > 0 ? 'bg-yellow-500' : (successCount > 0 ? 'bg-green-500' : 'bg-gray-400'));

        return (
          <div key={groupId} className="flex items-start group py-1.5"> {/* items-start for alignment, py-1.5 for spacing */}
            {/* Timestamp Area (Last Updated At) */}
            <div className="w-32 text-right pr-3 pt-1 flex-shrink-0 self-center">
              {latestTimestamp && (
                <>
                  <p className="text-xs text-gray-500 whitespace-nowrap" title={format(parseISO(latestTimestamp), 'PPpp EEEE')}>
                    {format(parseISO(latestTimestamp), 'HH:mm:ss')}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(parseISO(latestTimestamp), { addSuffix: true })}
                  </p>
                </>
              )}
            </div>

            {/* Gutter (Center Line & Dot) */}
            <div className="flex flex-col items-center mr-3 flex-shrink-0 self-center pt-1.5"> {/* Added pt-1.5 for alignment with first line of text if timestamp wraps */}
              <div className={`w-2.5 h-2.5 rounded-full ${conversationStatusDotColor} ring-2 ring-white group-hover:ring-gray-100`}></div>
            </div>

            {/* Content Card (Right Side - Expandable) */}
            <div className={`bg-white rounded-md shadow-sm w-full overflow-hidden ${isExpanded ? 'ring-1 ring-blue-500 shadow-md' : 'group-hover:shadow-md'}`}> {/* Removed ml-0 */}
              {/* Conversation Header - Clickable to expand/collapse - SINGLE ROW */}
              <div
                onClick={() => toggleConversationExpand(groupId)}
                className={`p-2.5 cursor-pointer flex items-center w-full whitespace-nowrap ${isExpanded ? 'border-b border-gray-200 bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                {/* Group ID, Topic, and Team - combined and truncated */}
                <div className="flex items-center flex-shrink min-w-0 max-w-[40%] mr-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate" title={isSystemLogs ? 'System & Other Events' : `Conversation ID: ${groupId}`}>
                    {isSystemLogs ? 'System & Other Events' : groupId}
                  </h3>
                  {!isSystemLogs && conversationTopic && (
                    <span className="flex items-center text-xs text-gray-500 ml-1.5 truncate" title={`Topic: ${conversationTopic}`}>
                      <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{conversationTopic}</span>
                    </span>
                  )}
                </div>
                {!isSystemLogs && currentTeam && currentTeam !== "N/A" && (
                  <div className="flex items-center text-xs text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded-full mr-2 flex-shrink-0 max-w-[120px] truncate" title={`Current Team: ${currentTeam}`}>
                    <Users className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 
                    <span className="truncate">{currentTeam}</span>
                  </div>
                )}
                
                <div className="flex-grow"></div> {/* Spacer */}

                {/* Event Counts Area - more compact and limited */}
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 flex-shrink-0 ml-2">
                  {successCount > 0 && (
                    <span className="flex items-center text-green-600 px-1 py-0.5 rounded-full bg-green-50/80" title={`${successCount} successful`}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> {successCount}
                    </span>
                  )}
                  {failureCount > 0 && (
                    <span className="flex items-center text-red-600 px-1 py-0.5 rounded-full bg-red-50/80" title={`${failureCount} failed`}>
                      <XCircle className="w-3.5 h-3.5 mr-0.5" /> {failureCount}
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="flex items-center text-yellow-600 px-1 py-0.5 rounded-full bg-yellow-50/80" title={`${warningCount} warnings`}>
                      <AlertTriangle className="w-3.5 h-3.5 mr-0.5" /> {warningCount}
                    </span>
                  )}
                  {/* All Distinct Event Type Counts */}
                  {Object.entries(eventTypeCounts).sort(([, countA], [, countB]) => (countB as number) - (countA as number)).map(([type, count]: [string, number]) => {  /* Removed .slice(0, 2) */
                    let IconComponent;
                    let iconTitle = type.replace(/_/g, ' ');
                    switch (type) {
                      case 'webhook_received': IconComponent = MessageSquare; iconTitle = 'Webhooks'; break;
                      case 'action_execution': IconComponent = Zap; iconTitle = 'Actions'; break;
                      case 'intent_recognition': IconComponent = Brain; iconTitle = 'Intents'; break;
                      case 'handoff_initiated': IconComponent = ArrowRightLeft; iconTitle = 'Handoffs'; break;
                      default: IconComponent = Settings2; iconTitle = `${iconTitle} Event`;
                    }
                    return (
                      <span key={type} className="flex items-center text-gray-500 px-1 py-0.5 rounded-full bg-gray-100/80" title={`${count} ${iconTitle}`}>
                        <IconComponent className="w-3.5 h-3.5 mr-0.5 flex-shrink-0" /> {count}
                      </span>
                    );
                  })}
                  <span className="text-gray-400 font-medium ml-1" title={`${totalEvents} total events`}>
                    ({totalEvents})
                  </span>
                </div>

                {isExpanded ? 
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" /> :  /* Reduced ml */
                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" /> /* Reduced ml */
                }
              </div>

              {/* Expanded Content Area - Two Columns */}
              {isExpanded && (
                <div className="p-3 bg-gray-100/70 flex flex-col md:flex-row gap-3">
                  {/* Left Column: Event Timeline */}
                  <div className="md:w-1/2 bg-white p-2 rounded-md shadow-sm overflow-y-auto max-h-[400px]">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1.5">Event Timeline</h4>
                    <ActivityTimeline 
                      logs={logsInGroup} 
                      currentPage={timelineCurrentPages[groupId] || 1}
                      itemsPerPage={ITEMS_PER_TIMELINE_PAGE}
                      onPageChange={(newPage) => handleTimelinePageChange(groupId, newPage)}
                    />
                  </div>
                  {/* Right Column: Chat View */}
                  <div className="md:w-1/2 bg-white p-0.5 rounded-md shadow-sm max-h-[400px] flex flex-col">
                     <h4 className="text-sm font-semibold text-gray-700 mb-0 border-b pb-1.5 pt-2 px-2 bg-gray-50 rounded-t-md">Conversation Details</h4>
                    <ConversationChatView logs={logsInGroup} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination for Conversation Groups List */}
      {totalConversationPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
          <button
            onClick={() => handleConversationPageChange(currentConversationPage - 1)}
            disabled={currentConversationPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentConversationPage} of {totalConversationPages}
          </span>
          <button
            onClick={() => handleConversationPageChange(currentConversationPage + 1)}
            disabled={currentConversationPage === totalConversationPages}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogSection;
