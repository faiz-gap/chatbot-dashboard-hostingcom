'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CheckCircle, Users, AlertTriangle } from 'lucide-react'; // Example icons
import type { SectionProps } from '../types';

const ResolutionHandoffSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
    // --- Sample Data ---
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
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-medium text-gray-800 mb-1">{label || data.name || data.reason}</p>
          <p style={{ color: payload[0].color || data.fill }}>
            {`Count: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
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
                label={renderCustomizedPieLabel}
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
        <div style={{ height: '300px' }}>
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

      {/* TODO: Handoff Success Rate / Metrics */}
    </div>
  );
};

export default ResolutionHandoffSection;
