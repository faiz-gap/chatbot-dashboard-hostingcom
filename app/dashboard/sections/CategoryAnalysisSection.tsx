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
  Cell,
} from 'recharts';
import { BarChart3, CheckCircle, Users, XCircle } from 'lucide-react'; // Example icons
import type { SectionProps } from '../types';

interface CategoryResolutionDataPoint {
  categoryName: string;
  aiResolved: number;
  humanAssisted: number;
  notResolved: number;
  total: number;
  aiResolvedPercent: number;
  humanAssistedPercent: number;
  notResolvedPercent: number;
}

const initialCategoryData: Omit<CategoryResolutionDataPoint, 'total' | 'aiResolvedPercent' | 'humanAssistedPercent' | 'notResolvedPercent'>[] = [
  { categoryName: 'Product Inquiry', aiResolved: 150, humanAssisted: 50, notResolved: 20 },
  { categoryName: 'Technical Support', aiResolved: 80, humanAssisted: 120, notResolved: 30 },
  { categoryName: 'Billing Question', aiResolved: 60, humanAssisted: 30, notResolved: 10 },
  { categoryName: 'Account Management', aiResolved: 90, humanAssisted: 20, notResolved: 5 },
  { categoryName: 'General Feedback', aiResolved: 25, humanAssisted: 10, notResolved: 5 },
];

const CategoryAnalysisSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
  const categoryResolutionData = useMemo((): CategoryResolutionDataPoint[] => {
    return initialCategoryData.map(cat => {
      const total = cat.aiResolved + cat.humanAssisted + cat.notResolved;
      return {
        ...cat,
        total,
        aiResolvedPercent: total > 0 ? (cat.aiResolved / total) * 100 : 0,
        humanAssistedPercent: total > 0 ? (cat.humanAssisted / total) * 100 : 0,
        notResolvedPercent: total > 0 ? (cat.notResolved / total) * 100 : 0,
      };
    });
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryResolutionDataPoint;
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((bar: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
                <span style={{ color: bar.fill, display: 'flex', alignItems: 'center' }}>
                    {bar.dataKey === 'aiResolvedPercent' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {bar.dataKey === 'humanAssistedPercent' && <Users className="w-3 h-3 mr-1" />}
                    {bar.dataKey === 'notResolvedPercent' && <XCircle className="w-3 h-3 mr-1" />}
                    {bar.name}:
                </span>
                <span className="font-semibold ml-2">{bar.payload[bar.dataKey.replace('Percent', '')].toLocaleString()} ({bar.value.toFixed(1)}%)</span>
            </div>
          ))}
          <p className="text-xs text-gray-600 mt-1 pt-1 border-t">Total: {data.total.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-500" /> Category Resolution Rates
        </h3>
        <div style={{ height: `${Math.max(200, categoryResolutionData.length * 60)}px` }}> {/* Dynamic height */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryResolutionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }} // Increased left margin for category names
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="categoryName" 
                width={150} 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              <Bar dataKey="aiResolvedPercent" name="AI Resolved" stackId="a" fill="#10b981" barSize={25} isAnimationActive={false} />
              <Bar dataKey="humanAssistedPercent" name="Human Assisted" stackId="a" fill="#f59e0b" barSize={25} isAnimationActive={false} />
              <Bar dataKey="notResolvedPercent" name="Not Resolved" stackId="a" fill="#ef4444" barSize={25} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysisSection;
