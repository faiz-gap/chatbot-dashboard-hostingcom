import React from 'react';
import { ResponsiveSankey, SankeyNodeDatum, SankeyLinkDatum } from '@nivo/sankey';

// Define valid alignment values for Nivo Sankey
type NivoSankeyAlign = 'justify' | 'center' | 'start' | 'end';

// Define the expected structure for input nodes and links
interface InputNode {
  name: string;
  color: string;
  value?: number; // Original value, used for legend
}

interface InputLink {
  source: number; // Index-based
  target: number; // Index-based
  value: number;
  color?: string;
}

// Define custom properties for Nivo nodes and links
interface NivoCustomNodeProps {
  color: string;
  originalValue?: number;
}
interface NivoCustomLinkProps { 
  // No custom link props needed for basic Sankey, but type placeholder can be useful
  // For example, if you wanted to add custom data to links later.
}

// Type for the INPUT nodes array passed to Nivo Sankey
interface NivoSankeyInputNode {
  id: string; // Nivo requires 'id' for nodes
  color: string;
  originalValue?: number;
}

// Simplified type for INPUT links array passed to Nivo Sankey
interface NivoInputLink {
  source: string; // ID of the source node
  target: string; // ID of the target node
  value: number;
}

// Props for the NivoSankeyChart component
interface NivoSankeyChartProps {
  nodes: InputNode[];
  links: InputLink[];
  height?: number;
  align?: NivoSankeyAlign; // Use the defined union type
}

const NivoSankeyChart: React.FC<NivoSankeyChartProps> = ({ 
  nodes: inputNodes, 
  links: inputLinks, 
  height = 400,
  align = 'justify' as NivoSankeyAlign, // Default alignment, cast for safety
}) => {
  // Transform data for Nivo
  // Nivo expects node IDs to be strings and links to reference these string IDs.
  const nivoNodes: NivoSankeyInputNode[] = inputNodes.map((node, index) => ({
    id: node.name, // Use name as ID, ensure it's unique
    color: node.color,
    originalValue: node.value, // Keep original value for legend if needed
  }));

  const nivoLinks: NivoInputLink[] = inputLinks.map(link => ({
    source: inputNodes[link.source].name, // Map index to node name (ID)
    target: inputNodes[link.target].name, // Map index to node name (ID)
    value: link.value,
  }));

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveSankey
        data={{ nodes: nivoNodes, links: nivoLinks }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }} // Reduced top margin as custom legend will be external
        align={align}
        // iterations prop removed as it's not directly supported by ResponsiveSankey props
        colors={{ datum: 'color' }} // Use the 'color' property from each node datum
        nodeOpacity={1}
        nodeHoverOpacity={0.9}
        nodeThickness={18}
        nodeSpacing={10} // Spacing between nodes in the same column
        nodeBorderWidth={0}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkOpacity={0.6}
        linkHoverOpacity={0.8}
        linkContract={1} // How much links contract before/after nodes
        enableLinkGradient={false} // Use solid colors for links
        labelPosition="outside"
        labelOrientation="vertical" // Can be 'horizontal' or 'vertical'
        labelPadding={10}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
// Native legends prop removed, custom legend will be implemented in parent component
        // Nivo should pick up the 'color' property from the NivoSankeyInputNode data directly.
        // Colors are set directly on nodes. Example for 'colors' prop: colors={{ scheme: 'nivo' }}
        theme={{
          // Removed 'labels' block as it's not a direct Nivo theme key here and was causing lint errors.
          // Node label styling is primarily handled by props like 'labelTextColor', 'labelPosition'.
          tooltip: {
            container: {
              background: '#fff',
              color: '#333',
              fontSize: '12px',
              boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      />
    </div>
  );
};

export default NivoSankeyChart;
