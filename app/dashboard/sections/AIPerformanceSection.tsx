'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Text } from 'recharts';
import { Target, Brain, Zap, TrendingUp, Bot, Database, GitBranch, Users, Clock, Activity, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle } from 'lucide-react';
import type { SectionProps } from '../types';

const AIPerformanceSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const performanceMetricsData = [
    {
      id: 'intentAccuracy',
      title: 'Intent Accuracy',
      Icon: Bot,
      iconColor: 'text-blue-700',
      value: '92.4%',
      changeValue: '+1.2%',
      changeDirection: 'positive' as const,
      tooltipText: 'Percentage of user intents correctly identified by the AI.',
    },
    {
      id: 'avgContextQuality',
      title: 'Avg. Context Quality (RAG)',
      Icon: Database,
      iconColor: 'text-blue-700',
      value: '6.8/10',
      changeValue: '+0.5',
      changeDirection: 'positive' as const,
      tooltipText: 'Average quality score of context retrieved from the knowledge base.',
    },
    {
      id: 'actionSuccessRate',
      title: 'Action Success Rate',
      Icon: GitBranch,
      iconColor: 'text-blue-700',
      value: '76.3%',
      changeValue: '-2.1%',
      changeDirection: 'negative' as const,
      tooltipText: 'Percentage of AI-initiated actions (e.g., API calls, form presentations) that completed successfully.',
    },
    {
      id: 'handoffAccuracy',
      title: 'Handoff Accuracy',
      Icon: Users,
      iconColor: 'text-blue-700',
      value: '86.9%',
      changeValue: '-0.4%',
      changeDirection: 'negative' as const,
      tooltipText: 'Percentage of handoffs routed to the correct human agent team.',
    },
    {
      id: 'avgTimeSaved',
      title: 'Avg. Time Saved (per AI interaction)',
      Icon: Clock,
      iconColor: 'text-blue-700',
      value: '4.2 min',
      changeValue: '+0.3',
      changeDirection: 'positive' as const,
      tooltipText: 'Estimated average time saved by AI handling an interaction compared to a human.',
    },
    {
      id: 'interactionAutomationRate',
      title: 'Interaction Automation Rate',
      Icon: Activity,
      iconColor: 'text-blue-700',
      value: '65.2%',
      changeValue: '+2.5%',
      changeDirection: 'positive' as const,
      tooltipText: 'Percentage of individual messages and actions within conversations handled by AI.',
    },
  ];

  // --- Sample Data (to be replaced with actual data fetching) ---
  const intentRecognitionData = useMemo(() => [
    { name: 'Order Status', recognized: 450, needsClarification: 50, fallback: 10 },
    { name: 'Password Reset', recognized: 320, needsClarification: 30, fallback: 5 },
    { name: 'Product Info', recognized: 600, needsClarification: 70, fallback: 15 },
    { name: 'Tech Support', recognized: 210, needsClarification: 40, fallback: 8 },
    { name: 'Billing Inquiry', recognized: 150, needsClarification: 20, fallback: 3 },
  ], []);

  const knowledgeRetrievalData = useMemo(() => [
    { name: 'Successful Retrieval', value: 750, color: '#10b981' },
    { name: 'Low Relevance', value: 150, color: '#f59e0b' },
    { name: 'No Match Found', value: 100, color: '#ef4444' },
  ], []);

  const totalKnowledgeQueries = knowledgeRetrievalData.reduce((sum, entry) => sum + entry.value, 0);

  const resolutionData = useMemo(() => [
    { name: 'Resolved by AI', value: 750, color: '#22c55e' },
    { name: 'Resolved by Human (Post-Handoff)', value: 150, color: '#3b82f6' },
    { name: 'Abandoned/Unresolved', value: 100, color: '#f43f5e' },
  ], []);

  const handoffReasonsData = useMemo(() => [
    { reason: 'Complex Issue', count: 80, fill: '#8884d8' },
    { reason: 'User Request', count: 45, fill: '#83a6ed' },
    { reason: 'AI Unable to Understand', count: 30, fill: '#8dd1e1' },
    { reason: 'System Error/Bug', count: 20, fill: '#82ca9d' },
    { reason: 'Sentiment Negative', count: 15, fill: '#a4de6c' },
  ].sort((a, b) => b.count - a.count), []);
  // --- End Sample Data ---

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-medium text-gray-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderKnowledgePieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const numericPercentage = percent * 100;
    if (numericPercentage < 5) return null; // Don't render label if too small

    const displayPercentage = numericPercentage.toFixed(0);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${name} (${displayPercentage}%)`}
      </text>
    );
  };

  const renderResolutionPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const displayPercent = (percent * 100).toFixed(0);

    if (parseFloat(displayPercent) < 5) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${name} (${displayPercent}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">AI Performance Analysis</h2>
        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {performanceMetricsData.map((metric) => (
            <div key={metric.id} title={metric.tooltipText} className="bg-white p-4 shadow rounded-lg">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-full ${metric.iconColor} bg-opacity-10`}>
                  <metric.Icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
                <div className={`flex items-center text-xs font-semibold ${metric.changeDirection === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.changeDirection === 'positive' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {metric.changeValue}
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium mt-2">{metric.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">Displaying data for time period: {selectedTimePeriod}</p>
      </div>

      {/* Intent Recognition and Knowledge Retrieval Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intent Recognition Accuracy */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" /> Intent Recognition Accuracy
          </h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentRecognitionData} layout="vertical" margin={{ right: 20, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Bar dataKey="recognized" stackId="a" fill="#3b82f6" name="Successfully Recognized" barSize={20} isAnimationActive={false} />
                <Bar dataKey="needsClarification" stackId="a" fill="#f59e0b" name="Needs Clarification" barSize={20} isAnimationActive={false} />
                <Bar dataKey="fallback" stackId="a" fill="#ef4444" name="Fallback / Not Understood" barSize={20} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Retrieval Effectiveness */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" /> Knowledge Retrieval Effectiveness
          </h3>
          <div style={{ height: '350px' }} className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={knowledgeRetrievalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderKnowledgePieLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                >
                  {knowledgeRetrievalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resolution Types and Handoff Reasons Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolution Types Pie Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Conversation Resolution Types
          </h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderResolutionPieLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={false}
                >
                  {resolutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Handoff Reasons Bar Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" /> Top Handoff Reasons
          </h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={handoffReasonsData} layout="vertical" margin={{ left: 120, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="reason" tick={{ fontSize: 12 }} width={110} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
                <Bar dataKey="count" name="Handoff Count" barSize={20} isAnimationActive={false}>
                  {handoffReasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPerformanceSection;
