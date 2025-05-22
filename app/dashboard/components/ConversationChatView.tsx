'use client';

import React from 'react';
import { LogEntry } from '../types';
import { format, parseISO } from 'date-fns';
import { User, Bot, MessageCircle, ClipboardList, Mic } from 'lucide-react'; // Added Mic for potential agent notes

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'agent' | 'internal_note' | 'system_event';
  text: string;
  timestamp: string;
  sourceComponent?: string;
  originalLog?: LogEntry; // Optional: for linking back or showing raw log
}

// Helper to determine message type and extract relevant text
const transformLogsToChatMessages = (logs: LogEntry[]): ChatMessage[] => {
  const messages: ChatMessage[] = [];

  logs.forEach(log => {
    let userQueryText: string | null = null;
    if (log.details?.userQuery) {
      userQueryText = log.details.userQuery;
    } else if (log.consolidatedRawEventData?.coreEventDetails?.userQuery) {
      userQueryText = log.consolidatedRawEventData.coreEventDetails.userQuery;
    }

    if (userQueryText) {
      messages.push({
        id: `${log.logId}-user`,
        type: 'user',
        text: userQueryText,
        timestamp: log.timestamp,
        sourceComponent: 'Customer',
        originalLog: log,
      });
    }

    if (log.details?.aiResponseToUser) {
      messages.push({
        id: `${log.logId}-bot`,
        type: 'bot',
        text: log.details.aiResponseToUser,
        timestamp: log.timestamp,
        sourceComponent: log.sourceComponent || 'AI Bot',
        originalLog: log,
      });
    }
    
    // Placeholder for agent messages - assuming an agent message might be in details.agentResponse or similar
    // For now, let's simulate one if a handoff occurred to a human team
    if (log.type === 'handoff_initiated' && log.details?.targetTeam && !log.details?.targetTeam.toLowerCase().includes('bot')) {
         messages.push({
            id: `${log.logId}-agent-placeholder`,
            type: 'agent',
            text: `Agent from ${log.details.targetTeam} joined the conversation. (Placeholder for actual agent message)`, 
            timestamp: log.timestamp,
            sourceComponent: log.details.targetTeam,
            originalLog: log,
        });
    }

    if (log.details?.internal_note) {
      messages.push({
        id: `${log.logId}-note`,
        type: 'internal_note',
        text: log.details.internal_note,
        timestamp: log.timestamp,
        sourceComponent: log.sourceComponent || 'System',
        originalLog: log,
      });
    }
    
    // Fallback for logs that don't fit user/bot/note but should be shown as system events in chat
    if (!userQueryText && !log.details?.aiResponseToUser && !log.details?.internal_note && log.type !== 'handoff_initiated') {
        messages.push({
            id: log.logId,
            type: 'system_event',
            text: `${log.description} (Source: ${log.sourceComponent}, Type: ${log.type}, Status: ${log.status})`,
            timestamp: log.timestamp,
            sourceComponent: log.sourceComponent,
            originalLog: log,
        });
    }
  });

  // Sort messages by timestamp, as logs might produce multiple chat messages not in strict order
  return messages.sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());
};

interface ConversationChatViewProps {
  logs: LogEntry[];
}

const ConversationChatView: React.FC<ConversationChatViewProps> = ({ logs }) => {
  const chatMessages = transformLogsToChatMessages(logs);

  if (chatMessages.length === 0) {
    return <p className="text-sm text-gray-500 p-4 text-center">No chat messages to display for this conversation.</p>;
  }

  const getMessageAlignment = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user': return 'items-end';
      case 'bot': return 'items-start';
      case 'agent': return 'items-start'; // Or 'items-end' if agent is considered 'our side'
      case 'internal_note': return 'items-center';
      case 'system_event': return 'items-center';
      default: return 'items-start';
    }
  };

  const getMessageBubbleStyle = (type: ChatMessage['type']) => {
    switch (type) {
      case 'user': return 'bg-blue-500 text-white rounded-lg rounded-br-none';
      case 'bot': return 'bg-gray-200 text-gray-800 rounded-lg rounded-bl-none';
      case 'agent': return 'bg-green-100 text-green-800 rounded-lg rounded-bl-none';
      case 'internal_note': return 'bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg w-full text-center italic';
      case 'system_event': return 'bg-purple-50 border border-purple-200 text-purple-700 rounded-lg w-full text-xs';
      default: return 'bg-gray-100 text-gray-700 rounded-lg';
    }
  };
  
  const getMessageIcon = (type: ChatMessage['type'], sourceComponent?: string) => {
    switch (type) {
      case 'user': return <User className="w-5 h-5 text-blue-300" />;
      case 'bot': return <Bot className="w-5 h-5 text-gray-500" />;
      case 'agent': return <Mic className="w-5 h-5 text-green-600" />;
      case 'internal_note': return <ClipboardList className="w-5 h-5 text-yellow-600" />;
      case 'system_event': return <MessageCircle className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-grow space-y-3 p-1 overflow-y-auto bg-white rounded-b-md">
      {chatMessages.map((msg, index) => (
        <div key={msg.id} className={`flex flex-col ${getMessageAlignment(msg.type)}`}>
          <div className={`flex items-end gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.type !== 'user' && (
                <div className="flex-shrink-0 self-start p-1 rounded-full bg-gray-100">
                    {getMessageIcon(msg.type, msg.sourceComponent)}
                </div>
            )}
            <div className={`p-2.5 text-sm ${getMessageBubbleStyle(msg.type)} shadow-sm`}>
              {msg.text}
            </div>
             {msg.type === 'user' && (
                <div className="flex-shrink-0 self-start p-1 rounded-full bg-blue-100">
                    {getMessageIcon(msg.type, msg.sourceComponent)}
                </div>
            )}
          </div>
          <p className={`text-xs text-gray-400 mt-1 ${msg.type === 'user' ? 'text-right mr-2' : (msg.type === 'internal_note' || msg.type === 'system_event' ? 'text-center w-full' : 'text-left ml-2') }`}>
            {msg.sourceComponent && msg.type !== 'user' ? `${msg.sourceComponent} · ` : ''}
            {format(parseISO(msg.timestamp), 'HH:mm')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ConversationChatView;
