'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Users2, CheckSquare, AlertTriangle } from 'lucide-react'; // Example icons
import type { SectionProps } from '../types';

interface TeamRoutingDataPoint {
  team: string;
  correct: number;
  reassign: number;
  total: number;
}

const initialTeamRoutingData: TeamRoutingDataPoint[] = [
  { team: "Technical Support", correct: 1204, reassign: 210, total: 1414 },
  { team: "Sales Team", correct: 315, reassign: 82, total: 397 },
  { team: "Billing Team", correct: 290, reassign: 34, total: 324 },
  { team: "General Support", correct: 44, reassign: 17, total: 61 },
];

const TeamRoutingAnalysisSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const teamRoutingData = useMemo(() => initialTeamRoutingData, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((bar: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
                <span style={{ color: bar.fill, display: 'flex', alignItems: 'center' }}>
                    {bar.dataKey === 'correct' && <CheckSquare className="w-3 h-3 mr-1" />}
                    {bar.dataKey === 'reassign' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {bar.name}:
                </span>
                <span className="font-semibold ml-2">{bar.value.toLocaleString()}</span>
            </div>
          ))}
           <p className="text-xs text-gray-600 mt-1 pt-1 border-t">Total Routed: {payload[0].payload.total.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <Users2 className="w-5 h-5 mr-2 text-indigo-500" /> Routing Accuracy
        </h3>
        <div style={{ height: `${Math.max(200, teamRoutingData.length * 80)}px` }}> {/* Dynamic height, 80px per team group */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teamRoutingData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 20 }} // Increased bottom margin for legend
              barGap={4} // Gap between bars of the same group
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="team" 
                width={150} 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} verticalAlign="top" align="right" />
              <Bar dataKey="correct" name="Correctly Routed" fill="#22c55e" barSize={20} isAnimationActive={false} />
              <Bar dataKey="reassign" name="Reassigned/Incorrect" fill="#facc15" barSize={20} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamRoutingAnalysisSection;
