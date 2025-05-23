'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { SectionProps, LogEntry, ProcessedConversationGroup } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft, CheckCircle2, XCircle, AlertTriangle, Info, MessageSquare, Zap, Brain, ArrowRightLeft, Settings2, ShieldAlert, UserCheck, Users, Tag, Filter, X, Calendar, Search } from 'lucide-react';
import { format, formatDistanceToNow, parseISO, isWithinInterval, startOfDay, endOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns';
import ActivityTimeline from '../components/ActivityTimeline';
import ConversationChatView from '../components/ConversationChatView';
import { mockActivityLogs } from '../mockData/activityLogData'; // Using mock data for now

const ITEMS_PER_TIMELINE_PAGE = 5;
const CONVERSATION_GROUPS_PER_PAGE = 8;

// Filter interfaces
interface FilterState {
  dateRange: 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  actionTypes: string[];
  teams: string[];
  statuses: ('success' | 'failure' | 'warning' | 'info')[];
  tags: string[];
  conversationId: string;
}

const ActivityLogSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);
  const [timelineCurrentPages, setTimelineCurrentPages] = useState<{ [groupId: string]: number }>({});
  const [currentConversationPage, setCurrentConversationPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    actionTypes: [],
    teams: [],
    statuses: [],
    tags: [],
    conversationId: ''
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const actionTypes = new Set<string>();
    const teams = new Set<string>();
    const tags = new Set<string>();
    
    mockActivityLogs.forEach(log => {
      actionTypes.add(log.type);
      
      // Extract teams from various sources
      if (log.details?.targetTeam) teams.add(log.details.targetTeam);
      if (log.sourceComponent) teams.add(log.sourceComponent);
      
      // Extract tags from conversation topics
      if (log.details?.actionName) tags.add(log.details.actionName);
    });
    
    return {
      actionTypes: Array.from(actionTypes).sort(),
      teams: Array.from(teams).sort(),
      tags: Array.from(tags).sort()
    };
  }, []);

  // Apply filters to logs
  const filteredLogs = useMemo(() => {
    let logs = [...mockActivityLogs];
    
    // Date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date = endOfDay(now);
      
      switch (filters.dateRange) {
        case 'today':
          startDate = startOfDay(now);
          break;
        case 'yesterday':
          startDate = startOfDay(subDays(now, 1));
          endDate = endOfDay(subDays(now, 1));
          break;
        case 'last7days':
          startDate = startOfDay(subDays(now, 7));
          break;
        case 'last30days':
          startDate = startOfDay(subDays(now, 30));
          break;
        case 'custom':
          if (filters.customStartDate && filters.customEndDate) {
            startDate = startOfDay(new Date(filters.customStartDate));
            endDate = endOfDay(new Date(filters.customEndDate));
          } else {
            startDate = startOfDay(now);
          }
          break;
        default:
          startDate = startOfDay(now);
      }
      
      logs = logs.filter(log => {
        const logDate = parseISO(log.timestamp);
        return isWithinInterval(logDate, { start: startDate, end: endDate });
      });
    }
    
    // Action type filter
    if (filters.actionTypes.length > 0) {
      logs = logs.filter(log => filters.actionTypes.includes(log.type));
    }
    
    // Team filter
    if (filters.teams.length > 0) {
      logs = logs.filter(log => 
        (log.details?.targetTeam && filters.teams.includes(log.details.targetTeam)) ||
        (log.sourceComponent && filters.teams.includes(log.sourceComponent))
      );
    }
    
    // Status filter
    if (filters.statuses.length > 0) {
      logs = logs.filter(log => filters.statuses.includes(log.status));
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      logs = logs.filter(log => 
        log.details?.actionName && filters.tags.includes(log.details.actionName)
      );
    }
    
    // Conversation ID filter
    if (filters.conversationId.trim()) {
      logs = logs.filter(log => 
        log.conversationId?.toLowerCase().includes(filters.conversationId.toLowerCase().trim())
      );
    }
    
    return logs;
  }, [filters]);

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
    const sortedLogs = [...filteredLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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
  }, [filteredLogs]);

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentConversationPage(1);
    setExpandedConversationId(null);
    setTimelineCurrentPages({});
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = filters.dateRange !== 'all' || 
    filters.actionTypes.length > 0 || 
    filters.teams.length > 0 || 
    filters.statuses.length > 0 || 
    filters.tags.length > 0 || 
    filters.conversationId.trim() !== '';

  // Handle dropdown toggle
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(prev => prev === dropdownName ? null : dropdownName);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      {/* Filters - Always Visible */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date Range Filter - Dropdown with Custom Option */}
          <div className="relative filter-dropdown">
            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => {
                const value = e.target.value as any;
                setFilters(prev => ({ ...prev, dateRange: value }));
                if (value === 'custom') {
                  setOpenDropdown('dateRange');
                } else {
                  setOpenDropdown(null);
                }
              }}
              className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range...</option>
            </select>
            {filters.dateRange === 'custom' && openDropdown === 'dateRange' && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.customStartDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={filters.customEndDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="End date"
                  />
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply Date Range
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter - Multiselect Dropdown */}
          <div className="relative filter-dropdown">
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-1.5 text-xs text-left bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown('status')}
              >
                <span>
                  {filters.statuses.length === 0 
                    ? 'All Statuses' 
                    : `${filters.statuses.length} selected`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'status' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                  {['success', 'failure', 'warning', 'info'].map(status => (
                    <label key={status} className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.statuses.includes(status as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, statuses: [...prev.statuses, status as any] }));
                          } else {
                            setFilters(prev => ({ ...prev, statuses: prev.statuses.filter(s => s !== status) }));
                          }
                        }}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-xs text-gray-700 flex items-center gap-1">
                        {status === 'success' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                        {status === 'failure' && <XCircle className="w-3 h-3 text-red-500" />}
                        {status === 'warning' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                        {status === 'info' && <Info className="w-3 h-3 text-blue-500" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Types Filter - Multiselect Dropdown */}
          <div className="relative filter-dropdown">
            <label className="block text-xs font-medium text-gray-700 mb-1">Action Types</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-1.5 text-xs text-left bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown('actionTypes')}
              >
                <span className="truncate">
                  {filters.actionTypes.length === 0 
                    ? 'All Action Types' 
                    : filters.actionTypes.length === 1
                    ? filters.actionTypes[0].replace(/_/g, ' ')
                    : `${filters.actionTypes.length} selected`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'actionTypes' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                  {filterOptions.actionTypes.map(type => (
                    <label key={type} className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.actionTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, actionTypes: [...prev.actionTypes, type] }));
                          } else {
                            setFilters(prev => ({ ...prev, actionTypes: prev.actionTypes.filter(t => t !== type) }));
                          }
                        }}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-xs text-gray-700">{type.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Teams Filter - Multiselect Dropdown */}
          <div className="relative filter-dropdown">
            <label className="block text-xs font-medium text-gray-700 mb-1">Teams/Components</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-1.5 text-xs text-left bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown('teams')}
              >
                <span className="truncate">
                  {filters.teams.length === 0 
                    ? 'All Teams' 
                    : filters.teams.length === 1
                    ? filters.teams[0]
                    : `${filters.teams.length} selected`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'teams' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-auto">
                  {filterOptions.teams.map(team => (
                    <label key={team} className="flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.teams.includes(team)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, teams: [...prev.teams, team] }));
                          } else {
                            setFilters(prev => ({ ...prev, teams: prev.teams.filter(t => t !== team) }));
                          }
                        }}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-xs text-gray-700">{team}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Row - Search and Clear */}
        <div className="flex items-center gap-3 mt-3">
          {/* Conversation ID Search */}
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={filters.conversationId}
                onChange={(e) => setFilters(prev => ({ ...prev, conversationId: e.target.value }))}
                placeholder="Search by conversation ID..."
                className="pl-8 pr-3 py-1.5 w-full text-xs border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-5">
              <button
                onClick={() => setFilters({
                  dateRange: 'all',
                  actionTypes: [],
                  teams: [],
                  statuses: [],
                  tags: [],
                  conversationId: ''
                })}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <X className="w-3.5 h-3.5" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {paginatedConversationGroups.length === 0 && processedConversationGroups.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No activity logs on this page. Try another page.</p>
        </div>
      )}
      {processedConversationGroups.length === 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">
            {hasActiveFilters ? 
              'No activity logs match the selected filters. Try adjusting your filter criteria.' : 
              'No activity logs to display.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({
                dateRange: 'all',
                actionTypes: [],
                teams: [],
                statuses: [],
                tags: [],
                conversationId: ''
              })}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
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
                <div className="p-6 bg-gray-100/70 flex flex-col md:flex-row gap-4" style={{ maxHeight: 'max(50vh, min-content)', overflow: 'auto' }}>
                  {/* Left Column: Event Timeline */}
                  <div className="md:w-1/2 bg-white p-4 rounded-md shadow-sm overflow-visible">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Event Timeline</h4>
                    <ActivityTimeline 
                      logs={logsInGroup} 
                      currentPage={timelineCurrentPages[groupId] || 1}
                      itemsPerPage={ITEMS_PER_TIMELINE_PAGE}
                      onPageChange={(newPage) => handleTimelinePageChange(groupId, newPage)}
                    />
                  </div>
                  {/* Right Column: Chat View - More Compact */}
                  <div className="md:w-1/2 bg-white p-0.5 rounded-md shadow-sm flex flex-col max-h-[50vh]">
                     <h4 className="text-xs font-semibold text-gray-700 mb-0 border-b pb-1.5 pt-2 px-2 bg-gray-50 rounded-t-md">Conversation Details</h4>
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
        <div className="flex justify-center items-center mt-4 pt-2 border-t border-gray-200 space-x-2">
          <button
            onClick={() => handleConversationPageChange(currentConversationPage - 1)}
            disabled={currentConversationPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700 px-2">
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
