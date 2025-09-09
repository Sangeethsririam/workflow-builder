import React from 'react';
import { Handle, Position } from '@xyflow/react';


export default function CustomPinkNode({ data }) {
  const isHorizontal = data?.flowDir === 'LR';

  const tiny = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#111827',
    zIndex: 9,
  };

  const bigInvisible = {
    width: 18,
    height: 18,
    opacity: 0,
    zIndex: 8,
  };

  return (
    <div
      style={{
        border: '2px solid #ec4899',
        borderRadius: 8,
        padding: '6px 12px',
        background: '#fff0f7',
        color: '#111827',
        minWidth: 100,
        textAlign: 'center',
        fontSize: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      {data?.label || 'Custom'}

      {isHorizontal ? (
        <>
          {}
          <Handle type="target" position={Position.Left}  id="in"     style={tiny} />
          <Handle type="target" position={Position.Left}  id="in-big" style={bigInvisible} />

          <Handle type="source" position={Position.Right} id="out"     style={tiny} />
          <Handle type="source" position={Position.Right} id="out-big" style={bigInvisible} />
        </>
      ) : (
        <>
          {}
          <Handle type="target" position={Position.Top}    id="in"     style={tiny} />
          <Handle type="target" position={Position.Top}    id="in-big" style={bigInvisible} />

          <Handle type="source" position={Position.Bottom} id="out"    style={tiny} />

          {}
          <Handle type="target" position={Position.Left}   id="in-left"  style={bigInvisible} />
          <Handle type="target" position={Position.Right}  id="in-right" style={bigInvisible} />
        </>
      )}
    </div>
  );
}
