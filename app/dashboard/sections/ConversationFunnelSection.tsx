'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell, Legend } from 'recharts';
import NivoSankeyChart from '../components/NivoSankeyChart';
import { Filter, GitFork } from 'lucide-react'; // Added GitFork for Sankey icon
import type { SectionProps } from '../types';

const ConversationFunnelSection: React.FC<SectionProps> = ({ selectedTimePeriod }) => {
    // --- Sample Data (to be replaced with actual data fetching) ---
  const funnelData = useMemo(() => [
    { stage: 'Total Started', value: 1200, fill: '#86efac' },        // green-300
    { stage: 'Intent Captured', value: 950, fill: '#4ade80' },      // green-400
    { stage: 'Info Provided', value: 750, fill: '#22c55e' },        // green-500
    { stage: 'Issue Resolved (AI)', value: 550, fill: '#16a34a' },   // green-600
    { stage: 'Needs Escalation', value: 200, fill: '#15803d' },      // green-700
  ].sort((a, b) => b.value - a.value), []); // Funnel data should be sorted by value descending for Recharts

  // --- Sample Sankey Data (to be replaced with actual data fetching) ---
  const sankeyData = useMemo(() => {
    // Define node colors for consistency
    const nodeColors: Record<string, string> = {
      'Initial Inquiry': '#86efac',       // green-300
      'Information Gathering': '#4ade80', // green-400
      'Knowledge Base Used': '#22c55e',   // green-500
      'Agent Assistance': '#16a34a',      // green-600
      'Process Error': '#14532d',        // green-800
      'Resolution Provided': '#15803d',   // green-700
      'Session Abandoned': '#052e16',     // green-900
    };
    // Define node type with value property
    // Node type definition for data preparation, NivoSankeyChart will handle its internal types.
    // This matches the InputNode type in NivoSankeyChart.tsx
    type SankeyNode = {
      name: string;
      color: string;
      value?: number; 
    };
    // Shorter, varied, balanced nodes
    const nodes: SankeyNode[] = [
      { name: 'Initial Inquiry', color: nodeColors['Initial Inquiry'] },         // 0
      { name: 'Information Gathering', color: nodeColors['Information Gathering'] }, // 1
      { name: 'Knowledge Base Used', color: nodeColors['Knowledge Base Used'] },   // 2
      { name: 'Agent Assistance', color: nodeColors['Agent Assistance'] },       // 3
      { name: 'Process Error', color: nodeColors['Process Error'] },           // 4
      { name: 'Resolution Provided', color: nodeColors['Resolution Provided'] },   // 5
      { name: 'Session Abandoned', color: nodeColors['Session Abandoned'] },     // 6
    ];
    // Varied, balanced links (outgoing sums = incoming for each node)
    const links = [
      { source: 0, target: 1, value: 500, fill: nodeColors['Info'], fillOpacity: 0.7 }, // Start -> Info
      { source: 0, target: 2, value: 300, fill: nodeColors['KB'], fillOpacity: 0.7 },   // Start -> KB
      { source: 0, target: 6, value: 200, fill: nodeColors['Abandoned'], fillOpacity: 0.7 }, // Start -> Abandoned
      { source: 1, target: 2, value: 350, fill: nodeColors['KB'], fillOpacity: 0.7 },   // Info -> KB
      { source: 1, target: 4, value: 50, fill: nodeColors['Error'], fillOpacity: 0.7 }, // Info -> Error
      { source: 1, target: 6, value: 100, fill: nodeColors['Abandoned'], fillOpacity: 0.7 }, // Info -> Abandoned
      { source: 2, target: 3, value: 200, fill: nodeColors['Agent'], fillOpacity: 0.7 }, // KB -> Agent
      { source: 2, target: 5, value: 400, fill: nodeColors['Closed'], fillOpacity: 0.7 }, // KB -> Closed
      { source: 3, target: 5, value: 180, fill: nodeColors['Closed'], fillOpacity: 0.7 }, // Agent -> Closed
      { source: 4, target: 3, value: 20, fill: nodeColors['Agent'], fillOpacity: 0.7 },  // Error -> Agent
      { source: 4, target: 6, value: 30, fill: nodeColors['Abandoned'], fillOpacity: 0.7 }, // Error -> Abandoned
    ];
    // Calculate total values for each node for the legend
    const nodeTotals: Record<string, number> = {};
    nodes.forEach(node => { nodeTotals[node.name] = 0; });
    // Calculate incoming values
    links.forEach(link => {
      const targetNode = nodes[link.target].name;
      nodeTotals[targetNode] = (nodeTotals[targetNode] || 0) + link.value;
    });
    // For source nodes without incoming links, use outgoing links
    links.forEach(link => {
      const sourceNode = nodes[link.source].name;
      if (nodeTotals[sourceNode] === 0) {
        // Find all outgoing links for this source
        const outgoingLinks = links.filter(l => l.source === link.source);
        const totalOutgoing = outgoingLinks.reduce((sum, l) => sum + l.value, 0);
        nodeTotals[sourceNode] = totalOutgoing;
      }
    });
    // Assign totals back to nodes
    nodes.forEach(node => {
      node.value = nodeTotals[node.name];
    });
    return { nodes, links, nodeColors };
  }, []);
  // --- End Sample Data ---

  const CustomFunnelTooltip = ({ active, payload }: any) => { // Renamed for clarity
    if (active && payload && payload.length) {
      const data = payload[0].payload; // The data for the hovered segment
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-medium text-gray-800 mb-1">{data.stage}</p>
          <p style={{ color: data.fill }}>
            {`Count: ${data.value.toLocaleString()}`}
          </p>
          {data.percentage && (
             <p className="text-xs text-gray-500">
                {`Conversion: ${data.percentage}${data.percentage !== '100%' ? ' from previous' : ' (Overall)'}`}
             </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate percentages for label
  const processedFunnelData = funnelData.map((entry, index) => {
    let percentage = '100%';
    if (index > 0) {
      const prevValue = funnelData[index - 1].value;
      if (prevValue > 0) {
        percentage = ((entry.value / prevValue) * 100).toFixed(1) + '%';
      }
    }
    return { ...entry, percentage };
  });


  return (
    <div className="space-y-6">
      

      <div className="flex flex-row space-x-6">
        {/* Funnel Chart Card - 1/3 Width */} 
        <div className="w-1/3 bg-white p-4 shadow rounded-lg flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-teal-500" /> User Journey Funnel
          </h3>
          <div style={{ height: '400px' }} className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 5 }}> {/* Adjusted bottom margin after removing native legend */}
                <Tooltip content={<CustomFunnelTooltip />} />
                {/* Native Legend removed, custom legend will be implemented below */}
                <Funnel
                  dataKey="value"
                  data={processedFunnelData}
                  isAnimationActive={false}
                  nameKey="stage"
                  lastShapeType="rectangle"
                >
                  {/* LabelLists removed, Legend component will be used instead */}
                  {processedFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Funnel Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2 pb-1 px-2">
            {processedFunnelData.map((entry) => (
              <div key={`funnel-legend-${entry.stage}`} className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.fill }}
                ></span>
                <span className="text-xs text-gray-600">{entry.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sankey Chart Card - 2/3 Width */} 
        <div className="w-2/3 bg-white p-4 shadow rounded-lg flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <GitFork className="w-5 h-5 mr-2 text-indigo-500" /> Event Flow Sankey
          </h3>
          {/* Custom Sankey Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 px-2">
            {sankeyData.nodes.map((node) => (
              <div key={`sankey-legend-${node.name}`} className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: node.color }}
                ></span>
                <span className="text-xs text-gray-600">{node.name}</span>
              </div>
            ))}
          </div>
          <div style={{ height: '450px' }} className="flex-grow">
            <NivoSankeyChart
              nodes={sankeyData.nodes}
              links={sankeyData.links}
              height={450} // NivoSankeyChart expects explicit height, or use its own div height
              // align can be 'justify', 'center', 'start', 'end'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationFunnelSection;
