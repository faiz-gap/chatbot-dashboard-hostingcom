'use client';

import React from 'react';
import { Lightbulb, AlertTriangle, ThumbsUp, BookOpen, Zap, Users } from 'lucide-react'; // Example icons
import type { SectionProps } from '../types';

interface InsightCardProps {
  title: string;
  Icon: React.ElementType;
  iconColor?: string;
  observations: string[];
  recommendations: string[];
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

const KeyInsightsSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
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
        <h2 className="text-2xl font-semibold mb-1">Key Insights & Recommendations</h2>
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
  );
};

export default KeyInsightsSection;
