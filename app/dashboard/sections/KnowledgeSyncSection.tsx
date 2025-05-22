'use client';

import React, { useState, useMemo } from 'react';
import type { SectionProps, SyncOperation, SyncEvent as SyncEventType } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Info, RefreshCw, Clock, FileText, ListChecks } from 'lucide-react';
import { format, formatDistanceToNow, parseISO, addHours } from 'date-fns';
import { mockSyncOperations } from '../mockData/knowledgeSyncData'; // Using mock data
// Button import issue: Temporarily using HTML button. User to verify component setup.

const ITEMS_PER_PAGE = 5;

// Simplified Timeline Component (can be expanded or replaced with ActivityTimeline if suitable)
const SyncEventTimeline: React.FC<{ events: SyncEventType[] }> = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-sm text-gray-500 p-3">No events for this sync operation.</p>;
  }
  return (
    <div className="space-y-3 p-3 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Sync Event Log:</h4>
      {events.map((event, index) => {
        let IconComponent;
        let iconColor = 'text-gray-500';
        switch (event.status) {
          case 'success': IconComponent = CheckCircle2; iconColor = 'text-green-500'; break;
          case 'failure': IconComponent = XCircle; iconColor = 'text-red-500'; break;
          case 'warning': IconComponent = AlertTriangle; iconColor = 'text-yellow-500'; break;
          default: IconComponent = Info; iconColor = 'text-blue-500'; break;
        }
        return (
          <div key={event.id} className="flex items-start text-xs">
            <IconComponent className={`w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-grow">
              <p className="font-medium text-gray-700">{event.description}</p>
              <p className="text-gray-500">{format(parseISO(event.timestamp), 'MMM d, HH:mm:ss')}</p>
              {event.details && (
                <pre className="mt-1 p-1.5 bg-gray-50 text-gray-600 text-xs rounded-md whitespace-pre-wrap break-all">
                  {JSON.stringify(event.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SyncedContentDetails: React.FC<{ content: SyncOperation['syncedContentPreview'], operationStatus: SyncOperation['status'] }> = ({ content, operationStatus }) => {
  if (!content || content.length === 0) {
    if (operationStatus === 'failure') {
      return <p className="text-sm text-gray-500 p-4">Sync operation failed, no content to display.</p>;
    }
    return <p className="text-sm text-gray-500 p-4">No specific content changes were recorded for this sync operation.</p>;
  }

  const getStatusIconAndColor = (status: string) => {
    if (status.toLowerCase().includes('synced') && !status.toLowerCase().includes('issue') && !status.toLowerCase().includes('warning') && !status.toLowerCase().includes('fail')) {
      return { Icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50' };
    }
    if (status.toLowerCase().includes('warning') || status.toLowerCase().includes('issue') || status.toLowerCase().includes('missing')) {
      return { Icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    }
    if (status.toLowerCase().includes('fail')) {
      return { Icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' };
    }
    return { Icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-50' }; // Default
  };

  const counts = content.reduce((acc, item) => {
    const { status } = item;
    if (status.toLowerCase().includes('synced') && !status.toLowerCase().includes('issue') && !status.toLowerCase().includes('warning') && !status.toLowerCase().includes('fail')) {
      acc.successful = (acc.successful || 0) + 1;
    } else if (status.toLowerCase().includes('warning') || status.toLowerCase().includes('issue') || status.toLowerCase().includes('missing')) {
      acc.withIssues = (acc.withIssues || 0) + 1;
    } else if (status.toLowerCase().includes('fail')) {
      acc.failed = (acc.failed || 0) + 1;
    } else {
      acc.other = (acc.other || 0) + 1;
    }
    return acc;
  }, { successful: 0, withIssues: 0, failed: 0, other: 0 });

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
      <h4 className="text-base font-semibold text-gray-800 mb-3">Content Sync Details</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        <div className="bg-green-50 p-2 rounded-md">
          <p className="font-medium text-green-700">Successfully Synced</p>
          <p className="text-lg font-semibold text-green-600">{counts.successful}</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded-md">
          <p className="font-medium text-yellow-700">Synced with Issues</p>
          <p className="text-lg font-semibold text-yellow-600">{counts.withIssues}</p>
        </div>
        <div className="bg-red-50 p-2 rounded-md">
          <p className="font-medium text-red-700">Failed to Sync</p>
          <p className="text-lg font-semibold text-red-600">{counts.failed}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-md">
          <p className="font-medium text-blue-700">Other Status</p>
          <p className="text-lg font-semibold text-blue-600">{counts.other}</p>
        </div>
      </div>

      {content.length > 0 && (
        <div className="space-y-2 mt-2">
          <h5 className="text-sm font-medium text-gray-600 mb-1">Itemized Changes:</h5>
          {content.map(item => {
            const { Icon, color, bgColor } = getStatusIconAndColor(item.status);
            return (
              <div key={item.id} className={`p-2.5 rounded-md border ${bgColor.replace('bg-', 'border-')} flex items-center justify-between`}>
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">ID: {item.id} • Type: {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)} ({item.type}) • Action: {item.action.charAt(0).toUpperCase() + item.action.slice(1)}{item.itemType === 'article' && item.parentCategory ? ` • Parent: ${item.parentCategory}` : ''}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bgColor} ${color.replace('text-','text-').replace('-500', '-700')}`}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const KnowledgeSyncSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const [expandedOperationId, setExpandedOperationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>(
    [...mockSyncOperations].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())
  );

  const toggleExpand = (operationId: string) => {
    setExpandedOperationId(expandedOperationId === operationId ? null : operationId);
  };

  // Operations are now sourced from state and already sorted.
  // Add filtering by selectedTimePeriod here if needed in the future.
  const filteredOperations = useMemo(() => {
    return syncOperations;
    // Example for future filtering:
    // return syncOperations.filter(op => matchesTimePeriod(op.timestamp, selectedTimePeriod));
  }, [syncOperations, selectedTimePeriod]);

  // Placeholder for next sync time
  const nextScheduledSyncTime = useMemo(() => {
    // For demonstration, let's assume next sync is 4 hours from the latest operation or now if no operations
    const lastOpTime = filteredOperations.length > 0 ? parseISO(filteredOperations[0].timestamp) : new Date();
    return addHours(lastOpTime, 4);
  }, [filteredOperations]);

  const totalPages = Math.ceil(filteredOperations.length / ITEMS_PER_PAGE);
  const paginatedOperations = filteredOperations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleManualSync = () => {
    const newOperationId = `sync-${Date.now()}`;
    const now = new Date();

    const inProgressOperation: SyncOperation = {
      id: newOperationId,
      timestamp: now.toISOString(),
      status: 'in_progress',
      triggerType: 'manual',
      duration: 0, // Will be updated
      stats: {
        documentsProcessed: 0,
        pagesCreated: 0,
        pagesUpdated: 0,
        pagesDeleted: 0,
        versionConflicts: 0,
        errorsEncountered: 0,
      },
      events: [
        { id: `evt-${Date.now()}-1`, timestamp: now.toISOString(), type: 'SyncInitiated', status: 'info', description: 'Manual sync process started.', details: { user: 'current_user' } },
      ],
      syncedContentPreview: [],
    };

    setSyncOperations((prevOps: SyncOperation[]) => 
      [inProgressOperation, ...prevOps].sort((a: SyncOperation, b: SyncOperation) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())
    );

    setTimeout(() => {
      const endTime = new Date();
      const durationMs = endTime.getTime() - now.getTime();
      const randomStatus = Math.random() < 0.8 ? 'completed' : 'completed_with_errors'; // 80% chance of success
      const errorsEncountered = randomStatus === 'completed_with_errors' ? Math.floor(Math.random() * 5) + 1 : 0;
      const documentsProcessed = Math.floor(Math.random() * 100) + 50;

      const completedOperation: SyncOperation = {
        ...inProgressOperation,
        status: randomStatus,
        duration: durationMs,
        stats: {
          documentsProcessed: documentsProcessed,
          pagesCreated: Math.floor(Math.random() * (documentsProcessed / 2)),
          pagesUpdated: Math.floor(Math.random() * (documentsProcessed / 2)),
          pagesDeleted: Math.floor(Math.random() * 10),
          versionConflicts: Math.floor(Math.random() * 5),
          errorsEncountered: errorsEncountered,
        },
        events: [
          ...inProgressOperation.events,
          { id: `evt-${Date.now()}-2`, timestamp: endTime.toISOString(), type: 'SyncPhaseComplete', status: 'info', description: 'Content processing finished.', details: { phase: 'data_extraction' } },
          { id: `evt-${Date.now()}-3`, timestamp: endTime.toISOString(), type: randomStatus === 'completed' ? 'SyncCompleted' : 'SyncWarning', status: randomStatus === 'completed' ? 'success' : 'warning', description: `Manual sync finished ${randomStatus === 'completed' ? 'successfully' : 'with errors'}.`, details: { outcome: randomStatus } },
        ],
        syncedContentPreview: [
          {
            id: `content-${Date.now()}-1`,
            title: 'New FAQ Article: Returns Policy',
            type: 'FAQ',
            status: errorsEncountered > 0 ? 'Synced with issues' : 'Synced',
            itemType: 'article',
            action: 'created',
            parentCategory: 'Customer Support FAQs'
          },
          {
            id: `content-${Date.now()}-2`,
            title: 'Updated Guide: Getting Started',
            type: 'Guide',
            status: 'Synced',
            itemType: 'article',
            action: 'updated',
            parentCategory: 'Product Guides'
          },
        ].slice(0, Math.floor(Math.random() * 3)), // 0 to 2 items
      };

      setSyncOperations((prevOps: SyncOperation[]) => 
        prevOps.map((op: SyncOperation) => op.id === newOperationId ? completedOperation : op)
               .sort((a: SyncOperation, b: SyncOperation) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())
      );
    }, 3000 + Math.random() * 2000); // Simulate 3-5 seconds of processing
  };

  const getStatusIcon = (status: SyncOperation['status']) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'failure') return <XCircle className="w-4 h-4 text-red-500" />;
    if (status === 'completed_with_errors') return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (status === 'in_progress') return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    return <Info className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Knowledge Sync Status</h2>
        {/* Placeholder for filters or actions */}
      </div>

      {/* Sync Control Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={18} className="mr-2 text-gray-500" />
          Next scheduled sync: 
          <span className="font-medium text-gray-700 ml-1">
            {format(nextScheduledSyncTime, 'MMM d, yyyy HH:mm')}
          </span>
          <span className="text-gray-500 ml-1">
            ({formatDistanceToNow(nextScheduledSyncTime, { addSuffix: true })})
          </span>
        </div>
        <button 
          onClick={handleManualSync} 
          className="flex items-center justify-center text-sm px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw size={16} className="mr-2" />
          Sync Now
        </button>
      </div>

      {/* Pagination Controls Top */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {paginatedOperations.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No knowledge sync operations to display for this period.</p>
        </div>
      )}

      {paginatedOperations.map((op) => {
        const isExpanded = expandedOperationId === op.id;
        return (
          <div key={op.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div 
              className={`p-3 cursor-pointer flex items-center justify-between ${isExpanded ? 'border-b border-gray-200 bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => toggleExpand(op.id)}
            >
              <div className="flex items-center space-x-3">
                {isExpanded ? <ChevronDown size={18} className="text-gray-600" /> : <ChevronRight size={18} className="text-gray-500" />}
                {getStatusIcon(op.status)}
                <div>
                  <p className="text-sm font-medium text-gray-800">{op.id}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(parseISO(op.timestamp), { addSuffix: true })} ago ({format(parseISO(op.timestamp), 'MMM d, yyyy HH:mm')})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span title={`Trigger: ${op.triggerType}`} className="flex items-center text-gray-600"><RefreshCw size={14} className="mr-1 text-gray-400"/> {op.triggerType}</span>
                <span title={`Duration: ${(op.duration / 1000).toFixed(1)}s`} className="flex items-center text-gray-600"><FileText size={14} className="mr-1 text-gray-400"/> ${(op.duration / 1000).toFixed(1)}s</span>
                <span title={`Processed: ${op.stats.documentsProcessed}, Errors: ${op.stats.errorsEncountered}`} className="flex items-center text-gray-600"><ListChecks size={14} className="mr-1 text-gray-400"/> {op.stats.documentsProcessed} / {op.stats.errorsEncountered}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="bg-white">
                {/* Top: Event Timeline for the sync operation */}
                <SyncEventTimeline events={op.events} />
                {/* Bottom: Synced Content Details */}
                <SyncedContentDetails content={op.syncedContentPreview} operationStatus={op.status} />
              </div>
            )}
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeSyncSection;
