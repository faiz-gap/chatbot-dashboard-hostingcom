import React from 'react';
import { Chart as ChartJS, Tooltip, Legend, Title, LinearScale, ChartOptions, ScriptableContext } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { Chart } from 'react-chartjs-2';

ChartJS.register(SankeyController, Flow, Tooltip, Legend, Title, LinearScale);

// Props: nodes, links, nodeColors, height
interface SankeyChartProps {
  nodes: { name: string; color: string; value?: number }[]; // Added value for legend
  links: { source: number; target: number; value: number; color?: string }[];
  height?: number;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ nodes, links, height = 400 }) => {
  // Build labels and color arrays
  const labels = nodes.map((n) => n.name);
  const nodeColors = nodes.map((n) => n.color);

  // Chart.js Sankey expects links as { from, to, flow, color? }
  const sankeyData = links.map((l) => ({
    from: labels[l.source],
    to: labels[l.target],
    flow: l.value,
    color: l.color || nodeColors[l.target] || '#888'
  }));

  // For tooltip % calculation
  const totalFlow = sankeyData.reduce((sum, l) => sum + l.flow, 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Event Flow',
        data: sankeyData,
        colorFrom: (ctx: ScriptableContext<'sankey'>) => nodeColors[ctx.dataIndex] || '#888',
        colorTo: (ctx: ScriptableContext<'sankey'>) => nodeColors[ctx.dataIndex] || '#888',
        colorMode: 'gradient' as 'gradient', // Explicitly type colorMode
        borderWidth: 0,
        borderColor: '#fff',
        // Show link values on links
        linkLabel: (ctx: any) => ctx.flow ? ctx.flow.toLocaleString() : '',
        linkLabelFont: { size: 13, weight: 'bold' },
        linkLabelColor: '#222',
        // Node label styling
        nodeLabelFont: { size: 11, weight: 'bold' }, // Reduced font size
        nodeLabelColor: '#222',
        size: 'min' as 'min', // Explicitly type 'min' to make layout more compact
      },
    ],
  };

  // Extend ChartOptions to include Sankey-specific options like nodeAlign
  interface SankeyChartOptions extends ChartOptions<'sankey'> {
    nodeAlign?: 'left' | 'right' | 'center' | 'justify';
  }

  const options: SankeyChartOptions = {
    responsive: true,
    nodeAlign: 'justify', 
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const { from, to, flow } = ctx.raw as any;
            const percent = totalFlow > 0 ? ((flow / totalFlow) * 100).toFixed(1) + '%' : '';
            return `${from} → ${to}: ${flow.toLocaleString()} (${percent})`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#222',
        bodyColor: '#222',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        titleFont: { weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 10,
      },
      title: {
        display: false,
      },
    },
    layout: {
      padding: 20, // Increased padding
    },
    maintainAspectRatio: false,
  };

  return (
    // Removed style={{ height }} from this div to allow it to fit content (chart + legend)
    <div> 
      <Chart type="sankey" data={data} options={options} height={height} />
      {/* Custom legend below chart */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs"> {/* Responsive grid and smaller text */}
        {nodes.map((node, idx) => (
          <div key={idx} className="flex items-center space-x-1.5"> {/* Reduced space-x */} 
            <div className="w-3 h-3 rounded mr-1.5 border border-gray-200" style={{ backgroundColor: node.color }} /> {/* Smaller color box & margin */} 
            <span className="truncate font-medium text-gray-700">{node.name}</span>
            <span className="ml-1 text-gray-500">({typeof node.value === 'number' ? node.value.toLocaleString() : 'N/A'})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SankeyChart;
