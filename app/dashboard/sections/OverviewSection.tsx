'use client';

import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, MessageSquare, Activity, TrendingUp, ChevronRight, ArrowUp, ArrowDown, ChevronLeft, Target } from 'lucide-react'; // Example icons, added for activity log
import type { SectionProps, LogEntry, LogStatus, SourceComponentType, VolumeDataPoint, AIPerformanceDataPoint } from '../types'; // Assuming SectionProps is defined in types.ts
import { useDashboard } from '../DashboardContext';

// Types for Daily Performance Summary Table
interface DailyStatValue {
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  isPercentage?: boolean; // To format change as percentage
  higherIsBetter?: boolean; // To determine color for change
}

interface DailyPerformanceEntry {
  id: string;
  date: string;
  totalConversations: DailyStatValue;
  aiResolvedConversations: DailyStatValue;
  humanHandoffs: DailyStatValue;
  csatScore: DailyStatValue;
  aiBotFeedbackScore: DailyStatValue;
  intentAccuracy: DailyStatValue;
  avgContentQuality: DailyStatValue;
}

// Helper to generate mock daily data
const generateMockDailyPerformanceData = (): DailyPerformanceEntry[] => {
  const data: DailyPerformanceEntry[] = [];
  const today = new Date();
  const numDays = 7;

  let prevValues = {
    totalConversations: 0,
    aiResolvedConversations: 0,
    humanHandoffs: 0,
    csatScore: 0,
    aiBotFeedbackScore: 0,
    intentAccuracy: 0,
    avgContentQuality: 0,
  };

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    const currentValues = {
      totalConversations: Math.floor(Math.random() * 100) + 150, // 150-250
      aiResolvedConversations: Math.floor(Math.random() * 50) + 70,  // 70-120
      humanHandoffs: Math.floor(Math.random() * 30) + 20,         // 20-50
      csatScore: parseFloat((Math.random() * 0.5 + 4.0).toFixed(1)), // 4.0-4.5
      aiBotFeedbackScore: parseFloat((Math.random() * 0.6 + 3.8).toFixed(1)), // 3.8-4.4
      intentAccuracy: parseFloat((Math.random() * 15 + 75).toFixed(1)), // 75.0-90.0%
      avgContentQuality: parseFloat((Math.random() * 0.8 + 3.8).toFixed(1)), // 3.8-4.6
    };
    
    // Ensure AI resolved is not more than total, and handoffs are reasonable
    currentValues.aiResolvedConversations = Math.min(currentValues.aiResolvedConversations, currentValues.totalConversations);
    currentValues.humanHandoffs = Math.min(currentValues.humanHandoffs, currentValues.totalConversations - currentValues.aiResolvedConversations);


    const createStatValue = (current: number, previous: number, higherIsBetter: boolean, isScore: boolean = false): DailyStatValue => {
      let change: number | undefined = undefined;
      let changeType: DailyStatValue['changeType'] = 'neutral';
      if (i < numDays -1) { // No change for the oldest day
        change = current - previous;
        if (isScore) change = parseFloat(change.toFixed(1)); // Keep one decimal for scores
        if (change > 0) changeType = higherIsBetter ? 'increase' : 'decrease';
        else if (change < 0) changeType = higherIsBetter ? 'decrease' : 'increase';
      }
      return {
        value: isScore ? current.toFixed(1) : current,
        change: change,
        changeType: changeType,
        isPercentage: false, // Can be adapted if direct percentage values are needed
        higherIsBetter: higherIsBetter
      };
    };

    data.push({
      id: `day-${i}`,
      date: formattedDate,
      totalConversations: createStatValue(currentValues.totalConversations, prevValues.totalConversations, true),
      aiResolvedConversations: createStatValue(currentValues.aiResolvedConversations, prevValues.aiResolvedConversations, true),
      humanHandoffs: createStatValue(currentValues.humanHandoffs, prevValues.humanHandoffs, false), // Lower handoffs are better
      csatScore: createStatValue(currentValues.csatScore, prevValues.csatScore, true, true),
      aiBotFeedbackScore: createStatValue(currentValues.aiBotFeedbackScore, prevValues.aiBotFeedbackScore, true, true),
      intentAccuracy: { ...createStatValue(currentValues.intentAccuracy, prevValues.intentAccuracy, true, true), isPercentage: true },
      avgContentQuality: createStatValue(currentValues.avgContentQuality, prevValues.avgContentQuality, true, true),
    });

    prevValues = { ...currentValues };
  }
  return data.reverse(); // Show most recent day first
};

// Types and mock data for AI Performance Trend Chart
const generateMockAIPerformanceData = (): AIPerformanceDataPoint[] => {
  const data: AIPerformanceDataPoint[] = [];
  const today = new Date();
  const numDays = 30; // Trend for last 30 days

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    data.push({
      date: formattedDate,
      intentAccuracy: parseFloat((Math.random() * 5 + 80).toFixed(1)), // 80-85%
      contextQuality: parseFloat((Math.random() * 0.3 + 4.0).toFixed(1)), // 4.0-4.3
      actionSuccessRate: parseFloat((Math.random() * 20 + 70).toFixed(1)), // 70-90%
      handoffAccuracy: parseFloat((Math.random() * 10 + 85).toFixed(1)), // 85-95%
    });
  }
  return data;
};
// Types and mock data for Volume Trend Chart
const generateInitialVolumeData = (): VolumeDataPoint[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const total = Math.floor(Math.random() * 200) + 300;
    const aiResolved = Math.floor(total * (0.6 + Math.random() * 0.2));
    return {
      date: date.toISOString().split('T')[0],
      total,
      aiResolved,
      humanAssisted: total - aiResolved,
    };
  });
};


// Import specific types and components needed for this section as you migrate them
// e.g., import { SummaryMetric } from '../types';
// e.g., import { Card } from '@/components/ui/card'; // Example UI component

const OverviewSection: React.FC<SectionProps> = ({ selectedTimePeriod, setActiveSection }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [mockDailyPerformanceData, setMockDailyPerformanceData] = useState<DailyPerformanceEntry[]>([]);
  useEffect(() => {
    setMockDailyPerformanceData(generateMockDailyPerformanceData());
  }, []);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockDailyPerformanceData.slice(startIndex, endIndex);
  }, [mockDailyPerformanceData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(mockDailyPerformanceData.length / itemsPerPage);
  const [aiPerformanceData, setAIPerformanceData] = useState<AIPerformanceDataPoint[]>([]);
  useEffect(() => {
    setAIPerformanceData(generateMockAIPerformanceData());
  }, []);

  const [initialVolumeData, setInitialVolumeData] = useState<VolumeDataPoint[]>([]);
  useEffect(() => {
    setInitialVolumeData(generateInitialVolumeData());
  }, []);

    // State for volume chart time grouping
  const [groupBy, setGroupBy] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');

  // --- Sample Data (to be replaced with actual data fetching) ---
  const summaryMetricsData = [
    {
      id: 'aiResolution',
      title: 'AI Resolution Rate',
      value: '36.4%',
      Icon: CheckCircle,
      iconColor: 'text-green-600',
      detail: '1,247 conversations',
      tooltipText: 'Percentage of conversations fully resolved by AI without human intervention.',
    },
    {
      id: 'totalConvos',
      title: 'Total Conversations',
      value: '3,428',
      Icon: MessageSquare,
      iconColor: 'text-blue-600',
      detail: 'In the past 30 days',
      tooltipText: 'Total number of unique conversations handled by the system.',
    },
    {
      id: 'humanAssistedRate',
      title: 'Human Assisted Rate',
      value: '63.6%',
      Icon: Users,
      iconColor: 'text-amber-600',
      detail: '2,181 conversations',
      tooltipText: 'Percentage of conversations where a human agent intervened or took over.',
    },
    {
      id: 'avgEventsPerConvo',
      title: 'Avg. Events Per Conversation',
      value: '12.8',
      Icon: Activity,
      iconColor: 'text-purple-600',
      detail: '43,796 total events',
      tooltipText: 'Average number of tracked system events (intent, knowledge, action, etc.) per conversation.',
    },
  ];

  // Assume aggregateVolumeData and getWeekNumber are in utils.ts
  // If not, they would need to be defined or moved there.
  // For now, let's create a placeholder if not available for the sake of this example.
  const aggregateVolumeData = React.useCallback((data: VolumeDataPoint[], grouping: 'daily' | 'weekly' | 'monthly') => {
    if (!data || data.length === 0) return [];
    if (grouping === "daily") return data;

    const getGroupKey = (d: Date): string => {
      if (grouping === "weekly") {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7; // Sunday = 7, Monday = 1
        date.setUTCDate(date.getUTCDate() + 4 - dayNum); // Adjust to Thursday of the week
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
      } else { // monthly
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
    };

    const map = new Map<string, { date: string; total: number; aiResolved: number; humanAssisted: number }>();

    data.forEach(row => {
      const dt = new Date(row.date); // Assumes row.date is a valid date string like YYYY-MM-DD
      if (isNaN(dt.getTime())) {
        console.warn(`Invalid date encountered in aggregateVolumeData: ${row.date}`);
        return; // Skip invalid date
      }
      const key = getGroupKey(dt);

      if (!map.has(key)) {
        map.set(key, { date: key, total: 0, aiResolved: 0, humanAssisted: 0 });
      }
      const entry = map.get(key)!;
      entry.total += row.total;
      entry.aiResolved += row.aiResolved;
      entry.humanAssisted += row.humanAssisted;
    });

    // Sort the results. For weekly/monthly, the key itself can be used for chronological sorting.
    return Array.from(map.values()).sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  }, []);

  const aggregatedVolume = React.useMemo(() => {
    return aggregateVolumeData(initialVolumeData, groupBy);
  }, [initialVolumeData, groupBy, aggregateVolumeData]);

  // --- End Sample Data ---

  const { setSelectedSection } = useDashboard();

  const resolutionBreakdownData = useMemo(() => [
    { name: 'AI-Only Resolved', value: 1247, color: '#10b981' }, // From summaryMetricsData AI Resolution
    { name: 'Human-Assisted', value: 2181, color: '#f59e0b' }, // From summaryMetricsData Human Assisted
  ], []);

  const totalResolved = resolutionBreakdownData.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const numericPercentage = percent * 100;
    if (numericPercentage < 5) return null; // Don't render label if too small

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${numericPercentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">

      {/* Row 1: Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetricsData.map((metric) => (
          <div key={metric.id} title={metric.tooltipText} className="bg-white p-4 shadow rounded-lg flex items-center space-x-4">
            <div className={`p-3 rounded-full ${metric.iconColor} bg-opacity-10`}>
              <metric.Icon className={`w-5 h-5 ${metric.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Time Series Graph (Left) and Activity Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Conversation Volume Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Conversation Volume Trend</h3>
            <div className="flex space-x-1">
              {(['daily', 'weekly', 'monthly'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setGroupBy(period)}
                  className={`px-3 py-1 text-xs rounded-md ${groupBy === period ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregatedVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tick) => {
                    if (groupBy === 'daily') return new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' });
                    if (groupBy === 'weekly') return tick.split('-W')[1] ? `W${tick.split('-W')[1]}` : tick;
                    return new Date(tick + '-02').toLocaleDateString([], { month: 'short', year: '2-digit' });
                  }}
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total Conversations" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="aiResolved" stroke="#10b981" strokeWidth={2} name="AI Resolved" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="humanAssisted" stroke="#f59e0b" strokeWidth={2} name="Human Assisted" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: AI Performance Trends */}
        <div className="bg-white p-4 shadow rounded-lg h-full flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-500" /> AI Performance Trends
          </h3>
          <div className="flex-grow" style={{ minHeight: '250px' }}> {/* Ensure chart has space */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiPerformanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" style={{ fontSize: '0.75rem' }} tick={{ fill: '#6b7280' }} />
                <YAxis 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`} 
                  yAxisId="percentage"
                  orientation="left"
                  stroke="#8b5cf6" 
                  style={{ fontSize: '0.75rem' }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tickFormatter={(value) => value.toFixed(1)} 
                  yAxisId="score"
                  orientation="right"
                  stroke="#10b981"
                  style={{ fontSize: '0.75rem' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.8rem' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line type="monotone" dataKey="intentAccuracy" name="Intent Accuracy (%)" stroke="#8b5cf6" strokeWidth={2} yAxisId="percentage" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="contextQuality" name="Context Quality (Score)" stroke="#10b981" strokeWidth={2} yAxisId="score" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="actionSuccessRate" name="Action Success (%)" stroke="#22c55e" strokeWidth={2} yAxisId="percentage" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="handoffAccuracy" name="Handoff Accuracy (%)" stroke="#ec4899" strokeWidth={2} yAxisId="percentage" dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> {/* Closes Row 2 grid */}

      {/* Row 3: Daily Stats Table */}
      <div className="bg-white p-4 shadow rounded-lg mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Conversations</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Resolved</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Human Handoffs</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSAT Score</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Bot Feedback</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent Accuracy</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Content Quality</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((day) => (
                <tr key={day.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                  {[day.totalConversations, day.aiResolvedConversations, day.humanHandoffs, day.csatScore, day.aiBotFeedbackScore, day.intentAccuracy, day.avgContentQuality].map((stat: DailyStatValue, index: number) => (
                    <td key={index} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <span>{stat.value}{stat.isPercentage && '%'}</span>
                        {stat.change !== undefined && stat.change !== 0 && (
                          <span className={`ml-2 flex items-center text-xs px-1.5 py-0.5 rounded-md bg-gray-100 ${stat.changeType === 'increase' && stat.higherIsBetter ? 'text-green-600' : stat.changeType === 'decrease' && !stat.higherIsBetter ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.changeType === 'increase' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span className="ml-0.5">{Math.abs(stat.change!)}{stat.isPercentage && '%'}</span>
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center space-x-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>


      {/* TODO: Add other overview components like User Satisfaction, Top Intents, Key Issues */}
    </div>
  );
};

export default OverviewSection;
