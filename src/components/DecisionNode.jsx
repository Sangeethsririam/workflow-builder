// src/components/DecisionNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function DecisionNode({ data }) {
  const size = 96;

  // small visible dots (match Start/Process size)
  const tinyDot = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    zIndex: 9,
    background: '#111', // optional: ensure dot is visible
  };

  // larger invisible targets (make it easy to connect into this node)
  const bigInvisibleTarget = {
    width: 18,
    height: 18,
    opacity: 0,
    zIndex: 8,
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Diamond shape (rotated square). Does not intercept pointer events. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed #f97316', // orange accent
          transform: 'rotate(45deg)',
          borderRadius: 8,
          background: '#fff',
          pointerEvents: 'none',
        }}
      />

      {/* HORIZONTAL label */}
      <div
        style={{
          position: 'relative',
          transform: 'none',            // keep text horizontal
          transformOrigin: '50% 50%',
          fontSize: 13,
          color: '#111827',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        {data?.label || 'Decision'}
      </div>

      {/* === Visible SOURCE handles (start connections from here) === */}
      <Handle type="source" position={Position.Top}   id="s-top"   style={tinyDot} />
      <Handle type="source" position={Position.Right} id="s-right" style={tinyDot} />
      <Handle type="source" position={Position.Left}  id="s-left"  style={tinyDot} />

      {/* === Invisible TARGET handles (drop connections to this node) === */}
      <Handle type="target" position={Position.Top}   id="t-top"   style={bigInvisibleTarget} />
      <Handle type="target" position={Position.Right} id="t-right" style={bigInvisibleTarget} />
      <Handle type="target" position={Position.Left}  id="t-left"  style={bigInvisibleTarget} />
    </div>
  );
}
