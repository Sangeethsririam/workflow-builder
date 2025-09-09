import React from 'react';
import { Handle, Position } from '@xyflow/react';


export default function StopNode({ data }) {
  const isHorizontal = data?.flowDir === 'LR';

  const tiny = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#111827',
    zIndex: 9,
  };

  return (
    <div
      style={{
        border: '2px solid #22c55e',
        borderRadius: 8,
        padding: '8px 12px',
        background: '#ecfdf5',
        color: '#065f46',
        minWidth: 100,
        textAlign: 'center',
        fontSize: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        position: 'relative',
        fontWeight: 600,
      }}
    >
      {data?.label || 'Stop'}

      {isHorizontal ? (
        <Handle type="target" position={Position.Left} id="in" style={tiny} />
      ) : (
        <Handle type="target" position={Position.Top} id="in" style={tiny} />
      )}
    </div>
  );
}
