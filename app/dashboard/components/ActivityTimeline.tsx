'use client';

import React, { useState } from 'react';
import { LogEntry, LogStatus, SourceComponentType } from '../types';
import { mockActivityLogs } from '../mockData/activityLogData'; // For initial testing
import { ChevronDown, ChevronRight, FileText, AlertCircle, CheckCircle2, XCircle, AlertTriangle, MessageSquare, Zap, Brain, ArrowRightLeft, Settings2, ShieldAlert, UserCheck } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

// Helper to get status color - Tailwind specific
const getStatusIcon = (status: LogEntry['status']) => {
  switch (status) {
    case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />;
    case 'failure': return <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
    case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />;
    default: return <AlertCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />;
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'webhook_received': return <MessageSquare className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />;
    case 'action_execution': return <Zap className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />;
    case 'intent_recognition': return <Brain className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />;
    case 'handoff_initiated': return <ArrowRightLeft className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />;
    case 'system_health_check': return <Settings2 className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />;
    case 'user_feedback_received': return <UserCheck className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />;
    case 'message_sent_to_user': return <MessageSquare className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />;
    default: return <ShieldAlert className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />;
  }
};

const getStatusClasses = (status: LogEntry['status']) => {
  switch (status) {
    case 'success':
      return { dot: 'bg-green-500', badgeText: 'text-green-700', badgeBg: 'bg-green-100' };
    case 'warning':
      return { dot: 'bg-yellow-500', badgeText: 'text-yellow-700', badgeBg: 'bg-yellow-100' };
    case 'failure':
      return { dot: 'bg-red-500', badgeText: 'text-red-700', badgeBg: 'bg-red-100' };
    default:
      return { dot: 'bg-gray-500', badgeText: 'text-gray-700', badgeBg: 'bg-gray-100' };
  }
};

interface ActivityTimelineProps {
  logs: LogEntry[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs, currentPage, itemsPerPage, onPageChange }) => {
  const [showRawDataFor, setShowRawDataFor] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (logId: string) => {
    setExpandedId(expandedId === logId ? null : logId);
  };

  const isPaginationActive = currentPage !== undefined && itemsPerPage !== undefined && onPageChange !== undefined;

  const logsToDisplay = isPaginationActive 
    ? logs.slice((currentPage! - 1) * itemsPerPage!, currentPage! * itemsPerPage!) 
    : logs;

  const totalPages = isPaginationActive 
    ? Math.ceil(logs.length / itemsPerPage!) 
    : 0;

  if (!logsToDisplay || logsToDisplay.length === 0 && !isPaginationActive) {
    // If not paginated and no logs, show message. If paginated, an empty page is possible.
    return <p className="text-gray-500">No activity logs to display.</p>;
  }

  if (isPaginationActive && logsToDisplay.length === 0 && logs.length > 0) {
    // If paginated, on an empty page but there are logs in total (e.g. bad page number), show different message or handle appropriately.
    // For now, let's assume parent component ensures currentPage is valid or provides a way to reset.
    // Or, we could show a message like "No logs on this page."
  }

  if (!logs || logs.length === 0) {
    return <p className="text-gray-500">No activity logs to display.</p>;
  }

  return (
    <div className="space-y-0">
      {logsToDisplay.map((log, index) => {
        const statusColors = getStatusClasses(log.status);
        const isExpanded = expandedId === log.logId;

        return (
          <div key={log.logId} className="flex items-center mb-0">
            {/* Timestamp Area */}
            <div className="w-28 text-right pr-4 pt-1 flex-shrink-0">
              <p className="text-xs text-gray-500 whitespace-nowrap" title={isValid(parseISO(log.timestamp)) ? format(parseISO(log.timestamp), 'PPpp') : 'Invalid date'}>
                {isValid(parseISO(log.timestamp)) ? format(parseISO(log.timestamp), 'HH:mm:ss') : '--:--:--'}
              </p>
            </div>

            {/* Gutter (Center Line & Dot) - Dot removed as status icon is present in content */}
            {/* <div className="flex flex-col items-center mr-4 flex-shrink-0"> */}
            {/*   <div className={`w-2.5 h-2.5 rounded-full ${statusColors.dot} ring-2 ring-white`}></div> */}
            {/* </div> */}

            {/* Content Card (Right Side - Expandable) - Adjust margin if dot removal affects spacing */}
            <div className={`bg-white rounded-sm shadow-xs w-full overflow-hidden ml-[-1rem] ${isExpanded ? 'ring-1 ring-blue-400' : 'hover:shadow-sm'}`}> {/* Example: ml-[-1rem] if dot had 1rem total space via its container's mr-4. Adjust as needed. Original dot container had mr-4 (1rem) */} 
              <div onClick={() => toggleExpand(log.logId)} className="cursor-pointer">
                {/* Always visible: Compact single-row summary (acts as header when expanded) */}
                <div className="flex items-center space-x-2 py-1 px-2 w-full">
                  {getStatusIcon(log.status)}
                  {/* Timestamp removed from here, as it's displayed in the left gutter */}
                  {getEventTypeIcon(log.type)}
                  <span className="text-xs text-gray-700 truncate flex-grow min-w-0" title={log.description}>
                    {log.description}
                  </span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" />}
                </div>
              </div>

              {/* Expanded state: Detailed view */}
              {isExpanded && (
                <div className="pt-2 pb-3 px-3 border-t border-gray-200">
                  <div className="max-h-48 overflow-y-auto pr-1"> {/* Added pr-1 for scrollbar spacing if needed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1 text-xs mb-2">
                    <div className="col-span-1 sm:col-span-2 md:col-span-3"><strong className="text-gray-600">Description:</strong> {log.description}</div>
                    <div><strong className="text-gray-600">Timestamp:</strong> {isValid(parseISO(log.timestamp)) ? format(parseISO(log.timestamp), 'PPpp') : 'Invalid date'}</div>
                    <div><strong className="text-gray-600">Status:</strong> <span className={statusColors.badgeText}>{log.status}</span></div>
                    <div><strong className="text-gray-600">Type:</strong> {log.type.replace(/_/g, ' ')}</div>
                    {log.sourceComponent && <div><strong className="text-gray-600">Source:</strong> {log.sourceComponent}</div>}
                    {log.conversationId && <div><strong className="text-gray-600">Conv. ID:</strong> {log.conversationId}</div>}
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mb-2">
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                        {renderKeyDetails(log)}
                      </div>
                    </div>
                  )}
                  {log.details?.internal_note && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                       <h5 className="text-xs font-semibold text-blue-800 mb-1">Internal Note:</h5>
                       <p className="text-xs text-blue-700 whitespace-pre-wrap">{log.details.internal_note}</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowRawDataFor(showRawDataFor === log.logId ? null : log.logId);
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {showRawDataFor === log.logId ? '[-] Hide Raw Data' : '[+] Show Raw Data'}
                    </button>
                    {showRawDataFor === log.logId && (
                      <div className="mt-2 p-2 bg-gray-800 text-white rounded-md max-h-60 overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap break-all">
                          {JSON.stringify(log.consolidatedRawEventData || log, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  </div> {/* Closing tag for the new max-h div */}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {isPaginationActive && totalPages > 1 && (
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
          <button 
            onClick={() => onPageChange(currentPage! - 1)} 
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => onPageChange(currentPage! + 1)} 
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to render specific key details
const renderKeyDetails = (log: LogEntry) => {
  const details = log.details;
  const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    return (
      <p className="text-xs text-gray-600">
        <span className="font-semibold">{label}:</span> {String(value)}
      </p>
    );
  };

  let specificDetails: React.ReactNode[] = [];

  if (log.sourceComponent === 'Orchestrator') {
    if (log.type === 'webhook_received') {
      specificDetails.push(<DetailItem key="whEvent" label="Webhook Event" value={details.webhookEvent} />);
      specificDetails.push(<DetailItem key="usrQuery" label="User Query" value={details.userQuery} />);
    } else if (log.type === 'lambda_invocation') {
      specificDetails.push(<DetailItem key="invLambda" label="Invoked Lambda" value={details.invokedLambda} />);
    }
  } else if (log.sourceComponent === 'IntentRecognitionBot') {
    if (log.type === 'intent_recognition') {
      specificDetails.push(<DetailItem key="usrQueryProc" label="User Query Processed" value={details.userQuery} />);
      specificDetails.push(<DetailItem key="intentConf" label="Intent Confidence" value={details.confidence} />);
      specificDetails.push(<DetailItem key="actionID" label="Action Identified" value={details.actionName} />); // Mapped from actionName in mock
      specificDetails.push(<DetailItem key="procTime" label="Processing Time" value={details.processingTimeMs ? `${details.processingTimeMs}ms` : undefined} />);
    }
  } else if (log.sourceComponent === 'DomainTransferBot') {
    if (log.type === 'action_execution') {
      specificDetails.push(<DetailItem key="actionName" label="Action Name" value={details.actionName} />);
      if (log.status === 'failure') {
        specificDetails.push(<DetailItem key="errMsg" label="Error Message" value={details.errorMessage} />);
        specificDetails.push(<DetailItem key="errType" label="Error Type" value={details.errorType} />);
      }
      specificDetails.push(<DetailItem key="aiResp" label="AI Response to User" value={details.aiResponseToUser} />);
    }
  } else if (log.sourceComponent === 'HandoffBot') {
    if (log.type === 'handoff_initiated') {
      specificDetails.push(<DetailItem key="targetTeam" label="Target Team" value={details.targetTeam} />);
      specificDetails.push(<DetailItem key="handoffReason" label="Handoff Reason" value={details.handoffReason} />);
    }
  } else if (log.sourceComponent === 'KnowledgeBot') {
    if (log.type === 'knowledge_retrieval') {
      specificDetails.push(<DetailItem key="usrQuery" label="User Query" value={details.userQuery} />);
      specificDetails.push(<DetailItem key="articleId" label="Retrieved Article ID" value={details.retrievedArticleId} />);
      specificDetails.push(<DetailItem key="confidence" label="Retrieval Confidence" value={details.confidence} />);
    }
  } else if (log.sourceComponent === 'Orchestrator' && log.type === 'system_message') {
     specificDetails.push(<DetailItem key="metric" label="Metric" value={details.metric} />); 
     specificDetails.push(<DetailItem key="value" label="Value" value={details.value} />); 
     specificDetails.push(<DetailItem key="threshold" label="Threshold" value={details.threshold} />); 
  }

  // Fallback for any other details not specifically handled
  const genericDetails = Object.entries(details)
    .filter(([key]) => !['internal_note', 'webhookEvent', 'userQuery', 'invokedLambda', 'confidence', 'actionName', 'processingTimeMs', 'errorMessage', 'errorType', 'aiResponseToUser', 'targetTeam', 'handoffReason', 'retrievedArticleId', 'metric', 'value', 'threshold'].includes(key) && details[key] !== undefined && details[key] !== null && String(details[key]).trim() !== '')
    .map(([key, value]) => (
      <DetailItem key={`generic-${key}`} label={key.replace(/([A-Z])/g, ' $1').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} value={String(value)} />
    ));

  if (specificDetails.length === 0 && genericDetails.length === 0) {
    return <p className="text-xs text-gray-500 italic">No specific details available for this event.</p>;
  }

  return (
    <div className="mt-2 space-y-1">
      <h5 className="text-xs font-semibold text-gray-500 mb-1">Key Details:</h5>
      {specificDetails}
      {genericDetails.length > 0 && specificDetails.length > 0 && <hr className="my-1" />} {/* Separator if both specific and generic details exist */}
      {genericDetails}
    </div>
  );
};

export default ActivityTimeline;

// Example Usage (can be removed or moved to a storybook/test page later):
// const TestTimelinePage = () => {
//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Activity Timeline</h1>
//       <ActivityTimeline logs={mockActivityLogs} />
//     </div>
//   );
// };
// export { TestTimelinePage };

