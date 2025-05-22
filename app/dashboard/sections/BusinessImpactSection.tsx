'use client';

import React from 'react';
import { TrendingUp, Clock, ShieldCheck, DollarSign, Zap, Users } from 'lucide-react'; // More specific icons
import type { SectionProps } from '../types';

interface ImpactCardProps {
  title: string;
  value: string;
  description: string;
  Icon: React.ElementType;
  iconColor?: string;
  unit?: string; // Optional unit for the value
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, value, description, Icon, iconColor = 'text-green-500', unit }) => {
  return (
    <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center text-center">
      <div className={`p-4 rounded-full bg-opacity-10 mb-4 ${iconColor.replace('text-', 'bg-')}`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mb-1">
        {value}{unit && <span className="text-lg font-normal">{unit}</span>}
      </h4>
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-xs text-gray-500 px-2">{description}</p>
    </div>
  );
};

const BusinessImpactSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const impactData = [
    {
      id: 'aiResolutionRate',
      title: 'AI Resolution Rate',
      value: '36.4',
      unit: '%',
      description: 'Conversations fully resolved by AI, directly reducing agent workload and operational costs.',
      Icon: Zap,
      iconColor: 'text-green-600',
    },
    {
      id: 'agentTimeSaved',
      title: 'Est. Agent Time Saved',
      value: '182',
      unit: ' hrs/month',
      description: 'Projected monthly hours saved by AI handling inquiries, freeing up human agents for complex issues.',
      Icon: Clock,
      iconColor: 'text-blue-500',
    },
    {
      id: 'handoffQuality',
      title: 'Handoff Success Rate',
      value: '85.0',
      unit: '%',
      description: 'Handoffs correctly routed with adequate context, ensuring smoother transitions and agent efficiency.',
      Icon: Users, // Changed from ShieldCheck for better relevance to handoff
      iconColor: 'text-teal-500',
    },
    {
      id: 'resolutionTime',
      title: 'Avg. AI Resolution Time',
      value: '2.5',
      unit: ' mins',
      description: 'Average time for AI to resolve issues, leading to faster customer support and improved satisfaction.',
      Icon: TrendingUp, // Changed from DollarSign as it's about time/efficiency
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Business Impact Assessment</h2>
        <p className="text-sm text-gray-500">
          Key performance indicators demonstrating the value of AI for: {selectedTimePeriod}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactData.map(item => (
          <ImpactCard 
            key={item.id} 
            title={item.title} 
            value={item.value} 
            unit={item.unit}
            description={item.description} 
            Icon={item.Icon} 
            iconColor={item.iconColor}
          />
        ))}
      </div>
       {/* Optional: Add a small section for overall ROI or cost savings if data becomes available */}
       {/* <div className="mt-8 bg-white p-6 shadow rounded-lg text-center">
        <h4 className="text-xl font-semibold text-gray-700 mb-2">Estimated Monthly Cost Savings</h4>
        <p className="text-3xl font-bold text-green-600">$X,XXX</p>
        <p className="text-sm text-gray-500 mt-1">Based on reduced agent handling time and operational efficiencies.</p>
      </div> */}
    </div>
  );
};

export default BusinessImpactSection;
