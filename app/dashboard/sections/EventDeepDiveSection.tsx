'use client';

import React, { useState, useMemo } from 'react';
import { Users, Bot, Database, Zap, CheckCircle, ChevronRight, Lightbulb, BookOpen } from 'lucide-react'; // Updated icons
import type { SectionProps } from '../types';

interface EventStat {
  label: string;
  value: string | number;
}

interface EventDetailItem {
  name: string;
  value: string | number;
  details?: string;
}

interface OutcomeCardData {
  name: string;
  value: string | number;
  color: string; // e.g., 'bg-green-100 text-green-700'
}

interface InsightCardProps {
  title: string;
  Icon: React.ElementType;
  iconColor?: string;
  observations: string[];
  recommendations: string[];
}

interface EventTypeDetail {
  id: string;
  title: string;
  Icon: React.ElementType;
  iconColor: string;
  stats: EventStat[];
  detailsView: {
    commonItemsTitle: string;
    commonItems: EventDetailItem[];
    optimizationTitle: string;
    optimizationOpportunities: string[];
    performanceMetricsTitle: string;
    performanceMetrics: EventDetailItem[]; // Can be simple key-value or placeholder for charts
    outcomeCardsTitle: string;
    outcomeCards: OutcomeCardData[];
    aggregateCardsTitle: string;
    aggregateCards: EventDetailItem[];
  };
}

const InsightCard: React.FC<InsightCardProps> = ({ title, Icon, iconColor = 'text-blue-500', observations, recommendations }) => {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="flex items-center mb-3">
        <Icon className={`w-7 h-7 mr-3 ${iconColor}`} />
        <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
      </div>
      <div className="mb-4">
        <h5 className="text-sm font-semibold text-gray-600 mb-1">Observations:</h5>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {observations.map((obs, index) => <li key={index}>{obs}</li>)}
        </ul>
      </div>
      <div>
        <h5 className="text-sm font-semibold text-gray-600 mb-1">Recommendations:</h5>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
        </ul>
      </div>
    </div>
  );
};

const eventTypesData: EventTypeDetail[] = [
  {
    id: 'intentRecognition',
    title: 'Intent Recognition',
    Icon: Bot,
    iconColor: 'text-blue-500',
    stats: [
      { label: 'Attempts', value: '1,200' },
      { label: 'Success', value: '92%' },
      { label: 'Avg. Confidence', value: '0.87' },
    ],
    detailsView: {
      commonItemsTitle: 'Top Recognized Intents',
      commonItems: [
        { name: 'Order Status', value: 450, details: 'Confidence: 0.92' },
        { name: 'Password Reset', value: 320, details: 'Confidence: 0.88' },
        { name: 'Product Info', value: 280, details: 'Confidence: 0.95' },
      ],
      optimizationTitle: 'Optimization Opportunities',
      optimizationOpportunities: [
        'Clarify intents with confidence below 0.7 (e.g., "Track Package")',
        'Review NLU model for overlapping intents like "Cancel Order" vs "Return Item".',
      ],
      performanceMetricsTitle: 'Key Performance Metrics',
      performanceMetrics: [
        { name: 'Intent Accuracy Over Time', value: 'Stable at 92%' },
        { name: 'Fallback Rate due to Low Confidence', value: '3%' },
      ],
      outcomeCardsTitle: 'Recognition Outcomes',
      outcomeCards: [
        { name: 'Successfully Recognized', value: '1,104', color: 'bg-green-100 text-green-700' },
        { name: 'Needs Clarification', value: '60', color: 'bg-yellow-100 text-yellow-700' },
        { name: 'Fallback (Not Understood)', value: '36', color: 'bg-red-100 text-red-700' },
      ],
      aggregateCardsTitle: 'Aggregate Intent Stats',
      aggregateCards: [
        { name: 'Total Intents Processed', value: '1,200' },
        { name: 'Unique Intents Identified', value: '45' },
      ],
    },
  },
  {
    id: 'knowledgeRetrieval',
    title: 'Knowledge Retrieval',
    Icon: Database,
    iconColor: 'text-green-500',
    stats: [
      { label: 'Queries', value: '950' },
      { label: 'Success', value: '85%' },
      { label: 'Avg. Relevance', value: '4.2/5' },
    ],
    detailsView: {
      commonItemsTitle: 'Top Retrieved Articles',
      commonItems: [
        { name: 'KB0012: Resetting Password', value: 150, details: 'Relevance: 4.5/5' },
        { name: 'KB0034: Shipping Policy', value: 120, details: 'Relevance: 4.3/5' },
      ],
      optimizationTitle: 'Optimization Opportunities',
      optimizationOpportunities: [
        'Improve KB0099 (Low Relevance: 2.1/5) based on user feedback.',
        'Add synonyms for "return policy" to improve search for KB0034.',
      ],
      performanceMetricsTitle: 'Key Performance Metrics',
      performanceMetrics: [
        { name: 'Retrieval Success by Source', value: 'FAQ: 90%, Docs: 80%' },
        { name: 'Avg. Search Latency', value: '350ms' },
      ],
      outcomeCardsTitle: 'Retrieval Outcomes',
      outcomeCards: [
        { name: 'Successful Retrieval', value: '807', color: 'bg-green-100 text-green-700' },
        { name: 'Low Relevance', value: '95', color: 'bg-yellow-100 text-yellow-700' },
        { name: 'No Match Found', value: '48', color: 'bg-red-100 text-red-700' },
      ],
      aggregateCardsTitle: 'Aggregate Retrieval Stats',
      aggregateCards: [
        { name: 'Total Knowledge Queries', value: '950' },
        { name: 'Avg. Articles per Query', value: '1.8' },
      ],
    },
  },
  {
    id: 'actionExecution',
    title: 'Action Execution',
    Icon: Zap,
    iconColor: 'text-purple-500',
    stats: [
      { label: 'Actions', value: '300' },
      { label: 'Success', value: '75%' },
      { label: 'Avg. Duration', value: '1.2s' },
    ],
    detailsView: {
      commonItemsTitle: 'Top Executed Actions',
      commonItems: [
        { name: 'SubmitOrder', value: 100, details: 'Success Rate: 80%' },
        { name: 'UpdateUserProfile', value: 80, details: 'Success Rate: 70%' },
      ],
      optimizationTitle: 'Optimization Opportunities',
      optimizationOpportunities: [
        'Debug `CreateTicket` action (Failure rate: 40%). Check API logs.',
        'Optimize `FetchAccountBalance` for latency (Avg: 3.5s).',
      ],
      performanceMetricsTitle: 'Key Performance Metrics',
      performanceMetrics: [
        { name: 'Action Success Rate Over Time', value: 'Trending Down - investigate' },
        { name: 'Most Failed Action', value: 'CreateTicket (40 failures)' },
      ],
      outcomeCardsTitle: 'Execution Outcomes',
      outcomeCards: [
        { name: 'Successfully Executed', value: '225', color: 'bg-green-100 text-green-700' },
        { name: 'Failed Execution', value: '75', color: 'bg-red-100 text-red-700' },
      ],
      aggregateCardsTitle: 'Aggregate Action Stats',
      aggregateCards: [
        { name: 'Total Actions Attempted', value: '300' },
        { name: 'Unique Actions Available', value: '15' },
      ],
    },
  },
  {
    id: 'handoff',
    title: 'Handoff',
    Icon: Users,
    iconColor: 'text-red-500',
    stats: [
      { label: 'Handoffs', value: '150' },
      { label: 'Success', value: '95%' },
      { label: 'Avg. Wait Time', value: '45s' },
    ],
    detailsView: {
      commonItemsTitle: 'Top Handoff Reasons',
      commonItems: [
        { name: 'Complex Issue', value: 60 },
        { name: 'User Request', value: 50 },
      ],
      optimizationTitle: 'Optimization Opportunities',
      optimizationOpportunities: [
        'Review conversations leading to "Technical Glitch" handoffs.',
        'Provide agents with better context for "Product Unavailable" handoffs.',
      ],
      performanceMetricsTitle: 'Key Performance Metrics',
      performanceMetrics: [
        { name: 'Handoff Rate by Intent', value: 'Order Issue: 15%, Tech Support: 25%' },
        { name: 'Avg. Agent Handle Time Post-Handoff', value: '7.2 min' },
      ],
      outcomeCardsTitle: 'Handoff Outcomes',
      outcomeCards: [
        { name: 'Successfully Routed', value: '142', color: 'bg-green-100 text-green-700' },
        { name: 'Routing Error', value: '8', color: 'bg-red-100 text-red-700' },
      ],
      aggregateCardsTitle: 'Aggregate Handoff Stats',
      aggregateCards: [
        { name: 'Total Handoffs Initiated', value: '150' },
        { name: 'Avg. Conversation Steps Before Handoff', value: '6' },
      ],
    },
  },
  {
    id: 'resolution',
    title: 'Resolution',
    Icon: CheckCircle,
    iconColor: 'text-teal-500',
    stats: [
      { label: 'Resolutions', value: '1050' },
      { label: 'AI Resolved', value: '70%' },
      { label: 'Avg. Time', value: '3.5 min' },
    ],
    detailsView: {
      commonItemsTitle: 'Top Resolving Intents',
      commonItems: [
        { name: 'Password Reset', value: 300, details: 'AI Resolution: 95%' },
        { name: 'Order Status', value: 250, details: 'AI Resolution: 80%' },
      ],
      optimizationTitle: 'Optimization Opportunities',
      optimizationOpportunities: [
        'Improve AI resolution for "Billing Inquiry" (AI Res: 40%).',
        'Analyze long resolution times for "Complex Tech Support".',
      ],
      performanceMetricsTitle: 'Key Performance Metrics',
      performanceMetrics: [
        { name: 'AI vs Human Resolution Time', value: 'AI: 2.1m, Human: 6.8m' },
        { name: 'First Contact Resolution Rate', value: '75%' },
      ],
      outcomeCardsTitle: 'Resolution Outcomes',
      outcomeCards: [
        { name: 'AI Resolved', value: '735', color: 'bg-green-100 text-green-700' },
        { name: 'Human Assisted Resolution', value: '315', color: 'bg-blue-100 text-blue-700' },
      ],
      aggregateCardsTitle: 'Aggregate Resolution Stats',
      aggregateCards: [
        { name: 'Total Conversations Resolved', value: '1,050' },
        { name: 'Conversations Awaiting Resolution', value: '50' },
      ],
    },
  },
];

const EventDeepDiveSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(
    eventTypesData.length > 0 ? eventTypesData[0].id : null
  );

  const selectedEventData = useMemo(() => {
    return eventTypesData.find(event => event.id === selectedEventTypeId);
  }, [selectedEventTypeId]);

  const insights = [
    {
      id: 'knowledgeGaps',
      title: 'Technical Knowledge Gaps',
      Icon: BookOpen,
      iconColor: 'text-purple-500',
      observations: [
        "Frequent escalations related to advanced DNS settings and domain transfer complexities indicate gaps in the AI's current knowledge base.",
        "Users often require clarification on SSL certificate installation beyond basic steps.",
      ],
      recommendations: [
        "Expand knowledge base articles with detailed guides and troubleshooting steps for advanced DNS configurations (e.g., SRV, DKIM records).",
        "Develop interactive, guided flows for complex processes like domain transfers and SSL installations.",
        "Monitor user queries within 'Knowledge Retrieval' events to proactively identify emerging knowledge gaps.",
      ],
    },
    {
      id: 'actionReliability',
      title: 'Action Reliability',
      Icon: Zap,
      iconColor: 'text-orange-500',
      observations: [
        "EPP code validation success rate (64.7%) is significantly lower than other actions, suggesting potential API integration issues or unclear user instructions.",
        "Domain transfer initiations sometimes fail due to external registry errors not clearly communicated back to the user.",
      ],
      recommendations: [
        "Thoroughly investigate and debug the EPP code validation process; enhance error logging for this action.",
        "Improve error handling for external API calls during action execution, providing users with clearer feedback and next steps.",
        "Consider implementing a 'pre-check' for domain transfers to identify common issues before full submission.",
      ],
    },
    {
      id: 'handoffQuality',
      title: 'Handoff Quality',
      Icon: Users,
      iconColor: 'text-teal-500',
      observations: [
        "While overall handoff accuracy is good (85%), a notable portion of 'Complex Billing' inquiries are initially misrouted.",
        "Agents report that context provided during handoff for 'Technical Support' sometimes lacks specific troubleshooting steps already attempted by the user with AI.",
      ],
      recommendations: [
        "Refine routing rules for 'Complex Billing' inquiries, potentially adding sub-categories for more precise assignment.",
        "Enhance the context summarization for handoffs to include a log of key AI interactions and user-confirmed information.",
        "Implement a quick feedback mechanism for agents to rate handoff quality, helping to pinpoint areas for improvement.",
      ],
    },
  ];

  return (
    <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
          Select an event type to see detailed analysis for: {selectedTimePeriod}
        </p>
      </div>

      {/* Event Type Selector Bar */}
      <div className="bg-white p-3 shadow rounded-lg">
        <div className="flex space-x-1 overflow-x-auto">
          {eventTypesData.map((eventType) => (
            <button
              key={eventType.id}
              onClick={() => setSelectedEventTypeId(eventType.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedEventTypeId === eventType.id
                  ? `${eventType.iconColor.replace('text-', 'bg-').replace('-500', '-100')} ${eventType.iconColor}`
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <eventType.Icon className={`w-5 h-5 mr-2 ${eventType.iconColor}`} />
                <span>{eventType.title}</span>
              </div>
              <div className="text-xs mt-1 space-x-2 ${selectedEventTypeId === eventType.id ? 'text-gray-700' : 'text-gray-500'}">
                {eventType.stats.map(stat => (
                  <span key={stat.label}>{`${stat.label}: ${stat.value}`}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEventData && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <selectedEventData.Icon className={`w-6 h-6 mr-2 ${selectedEventData.iconColor}`} />
            {selectedEventData.title} Details
          </h3>

          {/* Common Items */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{selectedEventData.detailsView.commonItemsTitle}</h4>
            <ul className="space-y-2 text-sm">
              {selectedEventData.detailsView.commonItems.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>{item.name}</span>
                  <span className="font-medium text-gray-600">{item.value} {item.details && <span className="text-xs text-gray-400">({item.details})</span>}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optimization Opportunities */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{selectedEventData.detailsView.optimizationTitle}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {selectedEventData.detailsView.optimizationOpportunities.map((opp, idx) => (
                <li key={idx}>{opp}</li>
              ))}
            </ul>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{selectedEventData.detailsView.performanceMetricsTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selectedEventData.detailsView.performanceMetrics.map((metric, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                        <p className="text-gray-500">{metric.name}</p>
                        <p className="font-semibold text-gray-700 text-lg">{metric.value}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* Outcome Cards */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{selectedEventData.detailsView.outcomeCardsTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedEventData.detailsView.outcomeCards.map((card, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${card.color}`}>
                  <p className="font-semibold">{card.name}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aggregate Cards */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">{selectedEventData.detailsView.aggregateCardsTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEventData.detailsView.aggregateCards.map((card, idx) => (
                <div key={idx} className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-700 font-medium">{card.name}</p>
                  <p className="text-xl font-semibold text-indigo-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Key Insights & Recommendations Section */}
      <div className="space-y-6 mt-12 pt-8 border-t border-gray-200">
        <div>
          <h2 className="text-2xl font-semibold mb-1 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
            Key Insights & Recommendations
          </h2>
          <p className="text-sm text-gray-500">
            Analysis and actionable suggestions based on data from: {selectedTimePeriod}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.map(insight => (
            <InsightCard 
              key={insight.id} 
              title={insight.title} 
              Icon={insight.Icon} 
              iconColor={insight.iconColor}
              observations={insight.observations} 
              recommendations={insight.recommendations} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDeepDiveSection;
