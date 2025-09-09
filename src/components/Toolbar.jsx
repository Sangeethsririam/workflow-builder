
import React, { useCallback } from 'react';
import dagre from '@dagrejs/dagre';



const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));


const NODE_WIDTH = 172;
const NODE_HEIGHT = 56;

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });


  nodes.forEach((n) => {
    dagreGraph.setNode(n.id, {
      width: n.measured?.width ?? NODE_WIDTH,
      height: n.measured?.height ?? NODE_HEIGHT,
    });
  });


  edges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  dagre.layout(dagreGraph);


  const layoutedNodes = nodes.map((n) => {
    const p = dagreGraph.node(n.id);
    const w = n.measured?.width ?? NODE_WIDTH;
    const h = n.measured?.height ?? NODE_HEIGHT;

    return {
      ...n,

      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: { x: p.x - w / 2, y: p.y - h / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export default function Toolbar({
  onSave,
  onLoad,
  nodes,
  edges,
  onApplyLayout,
}) {
  const handleLayout = useCallback(
    (direction) => {
      if (!Array.isArray(nodes) || nodes.length === 0) return;

     
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

 
      const withFlowDir = layoutedNodes.map((n) => {
        if (n.type === 'customPink' || n.type === 'stop') {
          return { ...n, data: { ...(n.data || {}), flowDir: direction } };
        }
        return n;
      });

      onApplyLayout({ nodes: withFlowDir, edges: layoutedEdges });
    },
    [nodes, edges, onApplyLayout]
  );

  return (
    <header
      className="toolbar"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #eee',
        background: '#fafafa',
      }}
    >
      <button onClick={onSave}>Save</button>
      <button onClick={onLoad}>Load</button>

      <div style={{ width: 1, height: 24, background: '#ddd', margin: '0 8px' }} />

      <button onClick={() => handleLayout('TB')}>Vertical layout</button>
      <button onClick={() => handleLayout('LR')}>Horizontal layout</button>
    </header>
  );
}
